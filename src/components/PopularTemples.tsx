import React, { useState } from 'react';
import { Temple, CrowdLevel } from '../types';
import { ChevronRight, ChevronLeft, Clock, MapPin, Sparkles, ArrowRight } from 'lucide-react';

interface PopularTemplesProps {
  temples: Temple[];
  onSelectTemple: (temple: Temple) => void;
  onViewAllTemples: () => void;
  onBookSeva: (templeName: string) => void;
}

export const PopularTemples: React.FC<PopularTemplesProps> = ({
  temples,
  onSelectTemple,
  onViewAllTemples,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Exclude Ramanathaswamy / Rameswaram entry completely
  const displayTemples = temples.filter(
    (t) => t.id !== 'rameshwaram' && !t.name.toLowerCase().includes('ramanathaswamy') && !t.location.toLowerCase().includes('rameswaram')
  );

  const getCrowdBadge = (level: CrowdLevel) => {
    switch (level) {
      case 'Low':
        return { color: 'bg-[#2d6a4f]', text: 'text-[#2d6a4f]', label: 'Low Crowd' };
      case 'Moderate':
        return { color: 'bg-[#d97706]', text: 'text-[#d97706]', label: 'Moderate Crowd' };
      case 'High':
        return { color: 'bg-[#dc2626]', text: 'text-[#dc2626]', label: 'High Crowd' };
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, displayTemples.length - 3));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-gray-200/80 pb-3">
        <div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-[#c5a059] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#c5a059]" />
            <span>Featured Sacred Shrines</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#5d100a]">
            Popular Temples
          </h3>
          <p className="text-xs text-[#534341] mt-0.5">
            Explore sacred shrines, live darshan wait times, and Sthala Puranas.
          </p>
        </div>
        <button
          onClick={onViewAllTemples}
          className="text-[#5d100a] text-xs font-bold uppercase border-b border-[#5d100a] hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
        >
          <span>VIEW ALL TEMPLES</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {displayTemples.slice(currentIndex, currentIndex + 4).map((temple) => {
            const crowd = getCrowdBadge(temple.crowdLevel);
            return (
              <div
                key={temple.id}
                onClick={() => onSelectTemple(temple)}
                className="bg-white rounded-xl overflow-hidden card-shadow group cursor-pointer border border-gray-200/80 hover:border-[#c5a059] transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="h-40 overflow-hidden relative bg-gray-900">
                  <img
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={temple.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#c5a059]" />
                    <span>~{temple.waitTimeMinutes}m wait</span>
                  </div>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <h4 className="font-serif font-bold text-xs text-gray-900 line-clamp-1 group-hover:text-[#5d100a] transition-colors">
                      {temple.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#c5a059] shrink-0" />
                      <span className="truncate">{temple.location}, {temple.state}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${crowd.color}`}></span>
                      <span className={`text-[10px] font-medium ${crowd.text}`}>
                        {crowd.label}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-[#5d100a] group-hover:underline flex items-center gap-0.5">
                      Explore
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Arrow Button */}
        {displayTemples.length > 4 && (
          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#c5a059] rounded-full flex items-center justify-center shadow-lg hover:bg-[#fff8f5] hover:border-[#5d100a] transition-all cursor-pointer z-10"
            title="Next Temples"
          >
            <ChevronRight className="w-4 h-4 text-[#5d100a]" />
          </button>
        )}
      </div>
    </div>
  );
};
