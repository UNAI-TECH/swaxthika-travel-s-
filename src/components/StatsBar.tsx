import React from 'react';
import { Compass, Landmark, Users, CheckCircle2, Star } from 'lucide-react';

export const StatsBar: React.FC = () => {
  return (
    <section className="bg-[#5d100a] text-white py-12 px-4 sm:px-8 lg:px-16 mt-12 overflow-hidden relative border-t border-b border-[#c5a059]/40">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              ></path>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)"></rect>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
        {/* Stat 1 */}
        <div className="flex flex-col items-center text-center">
          <Compass className="w-8 h-8 mb-3 text-[#c5a059]" />
          <p className="text-2xl font-bold font-serif">50+</p>
          <p className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider mt-0.5">
            Devotional Packages
          </p>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-center text-center">
          <Landmark className="w-8 h-8 mb-3 text-[#c5a059]" />
          <p className="text-2xl font-bold font-serif">120+</p>
          <p className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider mt-0.5">
            Sacred Temples Covered
          </p>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-center text-center">
          <Users className="w-8 h-8 mb-3 text-[#c5a059]" />
          <p className="text-2xl font-bold font-serif">85,000+</p>
          <p className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider mt-0.5">
            Happy Pilgrims
          </p>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="w-8 h-8 mb-3 text-[#c5a059]" />
          <p className="text-2xl font-bold font-serif">100%</p>
          <p className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider mt-0.5">
            Verified Boarding
          </p>
        </div>

        {/* Stat 5 */}
        <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
          <div className="flex items-center mb-1 text-[#c5a059] justify-center">
            <Star className="w-5 h-5 fill-current" />
            <p className="text-2xl font-bold font-serif text-white ml-1">4.9/5</p>
          </div>
          <p className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider">
            Pilgrim Rating
          </p>
        </div>
      </div>
    </section>
  );
};
