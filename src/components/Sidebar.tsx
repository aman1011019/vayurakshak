import React from 'react';
import { MapPin, Package, Radio, Send, Activity } from 'lucide-react';
import { DropLocation, LogEntry } from '../types';

interface SidebarProps {
  dropLocation: DropLocation | null;
  baseLocation: DropLocation;
  selectedPayload: string;
  logs: LogEntry[];
  isBusy: boolean;
  onPayloadChange: (payload: string) => void;
  onDispatch: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  dropLocation,
  baseLocation,
  selectedPayload,
  logs,
  isBusy,
  onPayloadChange,
  onDispatch
}) => {
  const payloadOptions = [
    { value: 'medicine', label: 'Medicine Kit', icon: Package },
    { value: 'food', label: 'Food Pack', icon: Package },
    { value: 'comm', label: 'Communication Kit', icon: Radio },
  ];

  return (
    <div className="fixed top-4 left-4 z-[1000] w-80">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Radio className="w-5 h-5" />
            VayuRakshak Command Center
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Click on the map to set drop location → choose payload → Dispatch
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Drop Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Selected Drop Location
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              value={dropLocation 
                ? `${dropLocation.lat.toFixed(5)}, ${dropLocation.lng.toFixed(5)}`
                : 'Click map to select drop location'
              }
              readOnly
            />
          </div>

          {/* Payload Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Payload Type
            </label>
            <select
              value={selectedPayload}
              onChange={(e) => onPayloadChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {payloadOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Drone Base */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Drone Base
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              value={`${baseLocation.lat.toFixed(5)}, ${baseLocation.lng.toFixed(5)}`}
              readOnly
            />
          </div>

          {/* Dispatch Button */}
          <button
            onClick={onDispatch}
            disabled={!dropLocation || isBusy}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              !dropLocation || isBusy
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            <Send className="w-4 h-4" />
            {isBusy ? 'Drone Active...' : 'Dispatch Drone'}
          </button>

          {/* Activity Log */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-semibold text-gray-700">Activity Log</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-y-auto border">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-xs">No activity yet...</p>
              ) : (
                <div className="space-y-1">
                  {logs.slice().reverse().map((log) => (
                    <div key={log.id} className="text-xs text-gray-600">
                      <span className="text-gray-400">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      {' — '}
                      <span>{log.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;