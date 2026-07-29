import React from 'react';
import { LiveDarshanStatus } from '../types';
import { X, Activity, Clock, Users, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface LiveStatusModalProps {
  statuses: LiveDarshanStatus[];
  onBookSevaForTemple: (templeName: string) => void;
  onClose: () => void;
}

export const LiveStatusModal: React.FC<LiveStatusModalProps> = ({
  statuses,
  onBookSevaForTemple,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/30 relative my-8">
        {/* Header */}
        <div className="bg-[#5d100a] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#c5a059] font-bold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-[#c5a059]" />
            Real-Time Pilgrim Traffic Tracker
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            Live Darshan Crowd & Queue Monitor
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Updated live with sensor counters and pilgrim density reports across major temples.
          </p>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-500 border-b border-gray-100 pb-2">
            <span>Live status updated every 2-5 minutes</span>
            <span className="flex items-center gap-1 text-[#2d6a4f] font-bold">
              <RefreshCw className="w-3 h-3 animate-spin" /> Live Syncing
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {statuses.map((item) => {
              const isLow = item.crowdLevel === 'Low';
              const isModerate = item.crowdLevel === 'Moderate';

              return (
                <div
                  key={item.templeId}
                  className="bg-white p-4 rounded-xl border border-gray-200 card-shadow hover:border-[#c5a059]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-gray-900 font-serif">
                        {item.templeName}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isLow
                            ? 'bg-green-100 text-green-800'
                            : isModerate
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.crowdLevel} Crowd
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">{item.statusText}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-gray-800">
                        <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                        Estimated Wait: ~{item.waitTimeMinutes} minutes
                      </span>
                      <span>• {item.queueStatusText}</span>
                    </div>

                    <p className="text-[10px] text-[#5d100a] font-semibold bg-[#fff8f5] px-2 py-1 rounded inline-block">
                      💡 Recommended Best Visit Slot: {item.recommendedTimeSlot}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onBookSevaForTemple(item.templeName);
                      onClose();
                    }}
                    className="bg-[#5d100a] text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-colors shrink-0 cursor-pointer text-center"
                  >
                    Book Special Entry
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
