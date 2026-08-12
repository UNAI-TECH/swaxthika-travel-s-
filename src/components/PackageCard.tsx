import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { DevotionalPackage } from '../types';

interface PackageCardProps {
  pkg: DevotionalPackage;
  onViewDetails: (pkg: DevotionalPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onViewDetails }) => {
  // Get active dates to display next available
  const futureDates = pkg.availableDates.filter(d => d.status !== 'sold-out');
  const nextDate = futureDates.length > 0 ? futureDates[0].date : null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-amber-100 hover:border-[#c5a059] transition-all duration-300 flex flex-col justify-between group h-full">
      <div>
        {/* Cover Image */}
        <div className="h-52 overflow-hidden relative">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Category Badge */}
          <span className="absolute top-3 left-3 bg-[#5d100a] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#c5a059]/30 uppercase">
            {pkg.category}
          </span>

          {/* Duration Badge */}
          <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#5d100a] text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
            {pkg.duration}
          </span>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3">
          <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-[#5d100a] transition-colors leading-tight">
            {pkg.name}
          </h3>
          
          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
            {pkg.description}
          </p>

          {/* Highlights Mini List */}
          <div className="pt-2 space-y-1">
            {pkg.highlights.slice(0, 2).map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-500">
                <span className="text-[#c5a059] font-bold mt-0.5">•</span>
                <span className="line-clamp-1">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="p-5 pt-0">
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-400 uppercase font-bold block">Next Tour</span>
            {nextDate ? (
              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                {new Date(nextDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            ) : (
              <span className="text-xs font-semibold text-rose-500">No Tours Scheduled</span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[9px] text-gray-400 uppercase font-bold block">Dakshina</span>
            <span className="text-base font-bold text-[#5d100a]">₹{pkg.pricePerSeat.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-gray-500"> / seat</span></span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(pkg)}
          className="w-full mt-4 bg-[#5d100a] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-[#c5a059]/30 group-hover:bg-[#801810]"
        >
          <span>View Detailed Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#c5a059] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
