import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DroneData, RequestData, DropLocation } from '../types';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  dronePosition: DropLocation;
  dropLocation: DropLocation | null;
  baseLocation: DropLocation;
  requests: Record<string, RequestData>;
  onDropLocationSelect: (location: DropLocation) => void;
}

function MapClickHandler({ onDropLocationSelect }: { onDropLocationSelect: (location: DropLocation) => void }) {
  useMapEvents({
    click: (e) => {
      onDropLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const MapView: React.FC<MapViewProps> = ({
  dronePosition,
  dropLocation,
  baseLocation,
  requests,
  onDropLocationSelect
}) => {
  const droneIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2949/2949110.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const baseIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <MapContainer
      center={[17.3850, 78.4867]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapClickHandler onDropLocationSelect={onDropLocationSelect} />
      
      {/* Base Marker */}
      <Marker position={[baseLocation.lat, baseLocation.lng]} icon={baseIcon}>
        <Popup>
          <div className="text-center">
            <strong>Drone Base</strong>
            <br />
            Coordinates: {baseLocation.lat.toFixed(5)}, {baseLocation.lng.toFixed(5)}
          </div>
        </Popup>
      </Marker>

      {/* Drone Marker */}
      <Marker position={[dronePosition.lat, dronePosition.lng]} icon={droneIcon}>
        <Popup>
          <div className="text-center">
            <strong>Drone Position</strong>
            <br />
            Live tracking enabled
          </div>
        </Popup>
      </Marker>

      {/* Drop Location Marker */}
      {dropLocation && (
        <Marker position={[dropLocation.lat, dropLocation.lng]}>
          <Popup>
            <div className="text-center">
              <strong>Drop Location</strong>
              <br />
              Ready for dispatch
            </div>
          </Popup>
        </Marker>
      )}

      {/* Request Markers */}
      {Object.entries(requests).map(([id, request]) => (
        <CircleMarker
          key={id}
          center={[request.lat, request.lng]}
          radius={8}
          pathOptions={{ 
            color: request.status === 'delivered' ? '#10b981' : '#f59e0b',
            fillColor: request.status === 'delivered' ? '#10b981' : '#f59e0b',
            fillOpacity: 0.8
          }}
        >
          <Popup>
            <div>
              <strong>Request: {id.slice(-6)}</strong>
              <br />
              Payload: {request.payload}
              <br />
              Status: {request.status}
              <br />
              {request.deliveredAt && (
                <>Delivered: {new Date(request.deliveredAt).toLocaleTimeString()}</>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapView;