import React, { useState } from 'react';
import { YatraStop } from '../types';
import { MapPin, Navigation, ArrowRight, Map, Sparkles, CheckCircle2 } from 'lucide-react';

interface PlanYourYatraProps {
  stops: YatraStop[];
  onOpenTripPlannerModal: () => void;
  onSelectStop: (stop: YatraStop) => void;
}

export const PlanYourYatra: React.FC<PlanYourYatraProps> = ({
  stops,
  onOpenTripPlannerModal,
  onSelectStop,
}) => {
  const [activeStopId, setActiveStopId] = useState<number>(1);

  const handleStopClick = (stop: YatraStop) => {
    setActiveStopId(stop.id);
    onSelectStop(stop);
  };

  return (
    <div className="bg-white p-6 rounded-xl card-shadow border border-gray-100">
      <div className="flex items-end justify-between mb-6 border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#5d100a]">
            Plan Your Yatra
          </h3>
          <p className="text-xs text-[#534341] mt-0.5">
            Structured pilgrimage routes optimized with auspicious Panchangam timings.
          </p>
        </div>
        <button
          onClick={onOpenTripPlannerModal}
          className="text-[#5d100a] text-[10px] sm:text-xs font-bold uppercase border-b border-[#5d100a] hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
        >
          <Map className="w-3.5 h-3.5" />
          <span>MAP VIEW</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-center">
        {/* Left Side: Numbered Itinerary Steps */}
        <div className="lg:col-span-2 space-y-3">
          {stops.map((stop) => {
            const isActive = activeStopId === stop.id;
            return (
              <div
                key={stop.id}
                onClick={() => handleStopClick(stop)}
                className={`flex items-center gap-4 p-3.5 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#fbf2ed] border-l-4 border-[#5d100a] shadow-xs'
                    : 'border border-gray-100 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#5d100a] text-white shadow-xs'
                      : 'bg-[#c5a059] text-white'
                  }`}
                >
                  {stop.id}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {stop.name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {stop.city} {stop.recommendedDuration ? `• ${stop.recommendedDuration}` : ''}
                  </p>
                </div>

                {isActive && (
                  <CheckCircle2 className="w-4 h-4 text-[#5d100a] shrink-0" />
                )}
              </div>
            );
          })}

          <button
            onClick={onOpenTripPlannerModal}
            className="w-full bg-[#5d100a] text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 mt-4 hover:bg-opacity-95 transition-all cursor-pointer shadow-md text-sm"
          >
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Map View Container */}
        <div className="lg:col-span-3 h-[320px] bg-gray-100 rounded-xl relative overflow-hidden border border-gray-200 group">
          <img
            alt="Yatra Map View"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYblj7Y9SCAg0yjTu4xxN2N1t_LnI7OkZtT5Im2t3G_5Hit0HhjlfXwUggtLuYKavsStjWU0mTdZJ0X12t2dL_UBDuCZz6L_hIGxKs5-Mtf9MWzg8oF-uCPibLXk_rqShRXuMd6PIY2b8b_n9CRv9RNi6ovzp2W3Q7L1QOoZRZwqKCGQCWMpsNal-jhmCvESNpfvDQwM4mHn58ODLREzv99LnFZhfPO2Hjv73n-OOWpmxc3a6362g"
          />

          {/* Interactive Simulated Map Markers */}
          <div className="absolute inset-0 p-4 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 bg-[#5d100a] w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold animate-pulse">
              1
            </div>
            <div className="absolute top-2/5 left-1/2 bg-[#c5a059] w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[8px] font-bold">
              2
            </div>
            <div className="absolute bottom-1/3 left-3/5 bg-[#c5a059] w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[8px] font-bold">
              3
            </div>
            <div className="absolute bottom-1/4 right-1/4 bg-[#c5a059] w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[8px] font-bold">
              4
            </div>

            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M33 25 Q 50 40, 50 40 T 60 65 T 75 75"
                fill="none"
                stroke="#5d100a"
                strokeDasharray="3"
                strokeWidth="1.5"
              ></path>
            </svg>
          </div>

          {/* Overlay Map Banner */}
          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-lg border border-[#c5a059]/30 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-bold text-[#5d100a] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                Selected: {stops.find((s) => s.id === activeStopId)?.name || 'Tirupati Balaji'}
              </p>
              <p className="text-[10px] text-gray-600">
                {stops.find((s) => s.id === activeStopId)?.description}
              </p>
            </div>
            <button
              onClick={onOpenTripPlannerModal}
              className="bg-[#5d100a] text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-opacity-90 transition-colors shrink-0 cursor-pointer"
            >
              Customize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
