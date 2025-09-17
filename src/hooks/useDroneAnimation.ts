import { useRef, useCallback } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../config/firebase';
import { DropLocation } from '../types';

interface AnimationConfig {
  steps: number;
  delay: number;
}

export const useDroneAnimation = (
  dronePosition: DropLocation,
  setDronePosition: (position: DropLocation) => void,
  baseLocation: DropLocation,
  addLog: (text: string) => void
) => {
  const isBusyRef = useRef(false);

  const animateDroneTo = useCallback(
    (
      targetLocation: DropLocation, 
      config: AnimationConfig = { steps: 150, delay: 60 },
      onComplete?: () => void
    ) => {
      if (isBusyRef.current) {
        addLog("A drone is already busy.");
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        isBusyRef.current = true;
        const { steps, delay } = config;
        let currentStep = 0;
        
        const startPosition = { ...dronePosition };
        const deltaLat = (targetLocation.lat - startPosition.lat) / steps;
        const deltaLng = (targetLocation.lng - startPosition.lng) / steps;

        const droneRef = ref(database, 'drones/drone1');
        set(droneRef, { 
          lat: startPosition.lat, 
          lng: startPosition.lng, 
          status: 'dispatched' 
        });

        const animationInterval = setInterval(() => {
          currentStep++;
          const newPosition = {
            lat: startPosition.lat + deltaLat * currentStep,
            lng: startPosition.lng + deltaLng * currentStep
          };
          
          setDronePosition(newPosition);
          set(droneRef, { 
            lat: newPosition.lat, 
            lng: newPosition.lng, 
            status: 'enroute' 
          });

          if (currentStep >= steps) {
            clearInterval(animationInterval);
            set(droneRef, { 
              lat: targetLocation.lat, 
              lng: targetLocation.lng, 
              status: 'delivered' 
            });
            
            setTimeout(() => {
              animateDroneReturn(() => {
                if (onComplete) onComplete();
                resolve();
              });
            }, 1000);
          }
        }, delay);
      });
    },
    [dronePosition, setDronePosition, addLog]
  );

  const animateDroneReturn = useCallback(
    (onComplete?: () => void) => {
      const steps = 120;
      const delay = 50;
      let currentStep = 0;
      
      const startPosition = { ...dronePosition };
      const deltaLat = (baseLocation.lat - startPosition.lat) / steps;
      const deltaLng = (baseLocation.lng - startPosition.lng) / steps;
      
      const droneRef = ref(database, 'drones/drone1');

      const returnInterval = setInterval(() => {
        currentStep++;
        const newPosition = {
          lat: startPosition.lat + deltaLat * currentStep,
          lng: startPosition.lng + deltaLng * currentStep
        };
        
        setDronePosition(newPosition);
        set(droneRef, { 
          lat: newPosition.lat, 
          lng: newPosition.lng, 
          status: 'returning' 
        });

        if (currentStep >= steps) {
          clearInterval(returnInterval);
          const finalPosition = { lat: baseLocation.lat, lng: baseLocation.lng };
          setDronePosition(finalPosition);
          set(droneRef, { 
            lat: finalPosition.lat, 
            lng: finalPosition.lng, 
            status: 'idle' 
          });
          
          isBusyRef.current = false;
          addLog("Drone returned to base (idle).");
          if (onComplete) onComplete();
        }
      }, delay);
    },
    [dronePosition, setDronePosition, baseLocation, addLog]
  );

  return {
    animateDroneTo,
    isBusy: isBusyRef.current
  };
};