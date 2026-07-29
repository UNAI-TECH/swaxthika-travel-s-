import React from 'react';
import { Temple } from '../types';
import { X, MapPin, Clock, Ticket, BookOpen, Shield, Sparkles, Navigation } from 'lucide-react';

interface TempleDetailModalProps {
  temple: Temple;
  onBookSeva: (templeName: string) => void;
  onReadPurana: (templeName: string) => void;
  onClose: () => void;
}

export const TempleDetailModal: React.FC<TempleDetailModalProps> = ({
  temple,
  onBookSeva,
  onReadPurana,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/30 relative my-8">
        {/* Banner Image */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={temple.image}
            alt={temple.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
            <span className="bg-[#c5a059] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase w-max mb-1">
              {temple.architectureStyle} Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {temple.name}
            </h3>
            <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{temple.location}, {temple.state}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fff8f5] p-3 rounded-xl border border-[#c5a059]/20 text-center text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Deity</span>
              <span className="font-bold text-[#5d100a]">{temple.deity}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Darshan Wait</span>
              <span className="font-bold text-[#5d100a]">~{temple.waitTimeMinutes} Mins</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Crowd Status</span>
              <span className="font-bold text-[#2d6a4f]">{temple.crowdLevel}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Best Month</span>
              <span className="font-bold text-[#5d100a]">{temple.bestTimeToVisit}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-[#5d100a] uppercase tracking-wider mb-1">
              Overview & Spiritual Significance
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed font-serif">
              {temple.description}
            </p>
          </div>

          {/* Timings & Dress Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-3.5 rounded-lg border border-gray-200">
              <h5 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-[#c5a059]" />
                Darshan & Pooja Timings
              </h5>
              <p className="text-xs text-gray-700">{temple.timings}</p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-gray-200">
              <h5 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1">
                <Shield className="w-4 h-4 text-[#c5a059]" />
                Traditional Dress Code
              </h5>
              <p className="text-xs text-gray-700">{temple.dressCode}</p>
            </div>
          </div>

          {/* Specialty */}
          <div className="bg-[#fbf2ed] p-3.5 rounded-lg border-l-4 border-[#5d100a]">
            <span className="font-bold text-xs text-[#5d100a] uppercase block">Special Blessing / Sthala Specialty</span>
            <p className="text-xs text-gray-800 italic mt-0.5">{temple.specialty}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                onBookSeva(temple.name);
                onClose();
              }}
              className="flex-1 bg-[#5d100a] text-white py-3 rounded-lg font-bold text-xs hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Ticket className="w-4 h-4 text-[#c5a059]" />
              <span>Book Seva / Special Entry</span>
            </button>

            <button
              onClick={() => {
                onReadPurana(temple.name);
                onClose();
              }}
              className="flex-1 bg-white border border-[#c5a059] text-[#5d100a] py-3 rounded-lg font-bold text-xs hover:bg-[#fff8f5] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#c5a059]" />
              <span>Read Sthala Purana Story</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
