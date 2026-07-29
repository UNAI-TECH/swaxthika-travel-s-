import React, { useState } from 'react';
import { LiveDarshanStatus } from '../types';
import { Info, Clock, Users, ArrowRight, Activity, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface LiveDarshanWidgetProps {
  liveStatuses: LiveDarshanStatus[];
  onOpenFullLiveModal: () => void;
}

export const LiveDarshanWidget: React.FC<LiveDarshanWidgetProps> = ({
  liveStatuses,
  onOpenFullLiveModal,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl card-shadow border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#5d100a]" />
            <h4 className="text-sm font-bold text-[#5d100a]">
              Live Darshan Load
            </h4>
          </div>
          <button
            onClick={onOpenFullLiveModal}
            className="text-gray-400 hover:text-[#5d100a] transition-colors cursor-pointer"
            title="Real-time crowd AI estimator info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Low Crowd */}
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#fff8f5] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center text-[#2d6a4f] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#2d6a4f]">Low Crowd</p>
              <p className="text-[10px] text-gray-500 truncate">Fewer than usual</p>
            </div>
            <div className="text-[#2d6a4f] shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Moderate Crowd */}
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#fff8f5] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#d97706]/10 flex items-center justify-center text-[#d97706] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#d97706]">Moderate Crowd</p>
              <p className="text-[10px] text-gray-500 truncate">Expect some wait time</p>
            </div>
            <div className="text-[#d97706] shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* High Crowd */}
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#fff8f5] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#dc2626]/10 flex items-center justify-center text-[#dc2626] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#dc2626]">High Crowd</p>
              <p className="text-[10px] text-gray-500 truncate">Long wait expected</p>
            </div>
            <div className="text-[#dc2626] shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenFullLiveModal}
        className="w-full mt-6 py-2.5 border border-[#c5a059] text-[#c5a059] text-[10px] sm:text-xs font-bold uppercase rounded-lg hover:bg-[#c5a059] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
      >
        <span>View Live Status</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
