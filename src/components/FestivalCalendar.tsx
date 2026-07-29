import React from 'react';
import { Festival } from '../types';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface FestivalCalendarProps {
  festivals: Festival[];
  onOpenCalendarModal: () => void;
  onSelectFestival: (festival: Festival) => void;
}

export const FestivalCalendar: React.FC<FestivalCalendarProps> = ({
  festivals,
  onOpenCalendarModal,
  onSelectFestival,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h3 className="text-xl font-serif font-bold text-[#5d100a]">
          Festival Calendar
        </h3>
        <button
          onClick={onOpenCalendarModal}
          className="text-[#5d100a] text-[10px] font-bold uppercase border-b border-[#5d100a] hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
        >
          <span>View Calendar</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {festivals.slice(0, 3).map((fest) => {
          const isUpcoming = fest.status === 'Upcoming';
          return (
            <div
              key={fest.id}
              onClick={() => onSelectFestival(fest)}
              className={`flex items-center gap-4 p-3 rounded-lg card-shadow relative cursor-pointer transition-all hover:-translate-y-0.5 border ${
                isUpcoming ? 'bg-white border-gray-100' : 'bg-white/50 border-dashed border-gray-200'
              }`}
            >
              <div
                className={`px-3 py-1.5 rounded text-center min-w-[54px] shrink-0 ${
                  isUpcoming ? 'bg-[#fbf2ed]' : 'bg-gray-100'
                }`}
              >
                <p
                  className={`text-[8px] font-bold uppercase ${
                    isUpcoming ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {fest.month}
                </p>
                <p
                  className={`text-xl font-bold leading-none mt-0.5 ${
                    isUpcoming ? 'text-[#5d100a]' : 'text-gray-400'
                  }`}
                >
                  {fest.dateNumber}
                </p>
              </div>

              <div className="flex-1 min-w-0 pr-12">
                <p
                  className={`text-xs font-bold truncate ${
                    isUpcoming ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {fest.name}
                </p>
                <p
                  className={`text-[10px] truncate ${
                    isUpcoming ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {fest.templeName}
                </p>
              </div>

              {isUpcoming && (
                <span className="absolute top-2.5 right-2.5 bg-amber-100 text-amber-800 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Upcoming
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
