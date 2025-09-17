import React, { useState, useEffect, useCallback } from "react";
import { ref, push, set, onValue, update } from "firebase/database";
import { database } from "./config/firebase";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import { useDroneAnimation } from "./hooks/useDroneAnimation";
import { DropLocation, RequestData, LogEntry, DroneData } from "./types";
import Loader from "./components/Loader";

function App() {
  // State management
  const [dropLocation, setDropLocation] = useState<DropLocation | null>(null);
  const [selectedPayload, setSelectedPayload] = useState("medicine");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [requests, setRequests] = useState<Record<string, RequestData>>({});
  const [dronePosition, setDronePosition] = useState<DropLocation>({
    lat: 17.26235,
    lng: 78.29479,
  });

  const [loading, setLoading] = useState(true); // Loader state

  const baseLocation: DropLocation = { lat: 17.405, lng: 78.4867 };

  // Logging function
  const addLog = useCallback((text: string) => {
    const logEntry: LogEntry = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
    };
    setLogs((prev) => [logEntry, ...prev].slice(0, 50)); // Keep last 50 entries
  }, []);

  // Drone animation hook
  const { animateDroneTo, isBusy } = useDroneAnimation(
    dronePosition,
    setDronePosition,
    baseLocation,
    addLog
  );

  // Firebase listeners
  useEffect(() => {
    // Listen to drone position updates
    const droneRef = ref(database, "drones/drone1");
    const unsubscribeDrone = onValue(
      droneRef,
      (snapshot) => {
        const droneData: DroneData | null = snapshot.val();
        console.log("Drone data from Firebase:", droneData);
        if (droneData) {
          setDronePosition({ lat: droneData.lat, lng: droneData.lng });
        }
      },
      (error) => {
        console.error("Drone data error:", error);
      }
    );

    // Listen to requests
    const requestsRef = ref(database, "requests");
    const unsubscribeRequests = onValue(
      requestsRef,
      (snapshot) => {
        const requestsData = snapshot.val() || {};
        console.log("Requests data from Firebase:", requestsData);
        setRequests(requestsData);

        setLoading(false); // ✅ stop loader once Firebase responds
      },
      (error) => {
        console.error("Requests error:", error);
        setLoading(false); // prevent infinite loader
      }
    );

    // Initial log
    addLog("App loaded. Click map to set drop location.");

    return () => {
      unsubscribeDrone();
      unsubscribeRequests();
    };
  }, [addLog]);

  // Handle drop location selection
  const handleDropLocationSelect = useCallback(
    (location: DropLocation) => {
      setDropLocation(location);
      addLog("Drop location set.");
    },
    [addLog]
  );

  // Handle dispatch
  const handleDispatch = useCallback(async () => {
    if (!dropLocation) {
      alert("Select drop location on map first");
      return;
    }
    if (isBusy) {
      alert("Drone is currently busy");
      return;
    }

    try {
      // Create request in Firebase
      const requestsRef = ref(database, "requests");
      const newRequestRef = push(requestsRef);
      const requestId = newRequestRef.key!;

      const requestData: RequestData = {
        payload: selectedPayload,
        lat: dropLocation.lat,
        lng: dropLocation.lng,
        status: "dispatched",
        timestamp: Date.now(),
      };

      await set(newRequestRef, requestData);
      addLog(`Request created: ${requestId.slice(-6)} [${selectedPayload}]`);
      addLog("Dispatching drone...");

      // Animate drone to target
      await animateDroneTo(dropLocation);

      // Mark as delivered
      await update(ref(database, `requests/${requestId}`), {
        status: "delivered",
        deliveredAt: Date.now(),
      });

      addLog(`Delivery confirmed for request: ${requestId.slice(-6)}`);
      alert("Delivery completed successfully!");

      setDropLocation(null); // clear drop location after successful dispatch
    } catch (error: any) {
      console.error("Dispatch failed:", error.message || error);
      addLog("Dispatch failed. Please try again.");
    }
  }, [dropLocation, selectedPayload, isBusy, animateDroneTo, addLog]);

  // ✅ Show Loader while waiting for Firebase
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative h-screen bg-gray-100">
      <MapView
        dronePosition={dronePosition}
        dropLocation={dropLocation}
        baseLocation={baseLocation}
        requests={requests}
        onDropLocationSelect={handleDropLocationSelect}
      />

      <Sidebar
        dropLocation={dropLocation}
        baseLocation={baseLocation}
        selectedPayload={selectedPayload}
        logs={logs}
        isBusy={isBusy}
        onPayloadChange={setSelectedPayload}
        onDispatch={handleDispatch}
      />
    </div>
  );
}

export default App;
