export interface DroneData {
  lat: number;
  lng: number;
  status: 'idle' | 'dispatched' | 'enroute' | 'delivered' | 'returning';
}

export interface RequestData {
  payload: string;
  lat: number;
  lng: number;
  status: 'dispatched' | 'delivered';
  timestamp: number;
  deliveredAt?: number;
}

export interface LogEntry {
  id: string;
  text: string;
  timestamp: Date;
}

export interface DropLocation {
  lat: number;
  lng: number;
}