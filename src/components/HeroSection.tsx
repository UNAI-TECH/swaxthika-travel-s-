import React, { useState } from 'react';
import { Search, BookOpen, Video, Calendar, Users, Accessibility, Globe, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string, state: string, festival: string) => void;
  onQuickLinkClick: (targetTab: string) => void;
  onToggleSeniorMode: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onQuickLinkClick,
  onToggleSeniorMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedFestival, setSelectedFestival] = useState('Any Festival');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedState, selectedFestival);
  };

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden py-10 lg:py-16">
      {/* Hero Background Image with subtle gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Indian Temple Background"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgJHBx_XlBi0brcY_DfQac9mqjGJYMJU9uJmCwiSocsAiUpjWLNw-DOvzlWSd8RZQcBQNG71cwMYk2K-LjsmbRaUnJ4Uue1MD5FZWiha4Mn7G94KbJHyGVfeTUUQV2xV8sQ3r8eHiLK0PPG1JYZRE9Oymj4iW7iO04PEhwC3CD1CfXgPXz95vUlkLuOrq-x1Q2Uc3unrGTuoGc3hJcL7tnlw_ztyJMiHgT09Awzp52P7N4ufaRwzQ"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff8f5] via-[#fff8f5]/85 to-[#fff8f5]/40 md:to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid lg:grid-cols-2 items-center gap-12">
        <div className="space-y-6">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-3 text-[#c5a059] font-bold text-xs sm:text-sm tracking-wide">
            <span className="w-8 h-[1px] bg-[#c5a059]"></span>
            Plan Your Divine Journey
            <span class="w-8 h-[1px] bg-[#c5a059]"></span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#5d100a] leading-tight">
            Temples are not <br className="hidden sm:block" /> just destinations, <br className="hidden sm:block" /> they are experiences.
          </h2>

          <p className="text-[#534341] max-w-md text-base sm:text-lg italic font-sans leading-relaxed">
            Discover Sthala Puranas, plan auspicious trips, book seva, and experience devotion like never before.
          </p>

          {/* Search Widget */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-2xl flex flex-col md:flex-row items-stretch border border-[#c5a059]/30"
          >
            <div className="flex-1 p-3.5 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="block text-[10px] font-bold text-[#534341] mb-1 uppercase tracking-wider">
                Search Temple / Deity
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Ranganathaswamy"
                className="w-full border-none p-0 focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent outline-none"
              />
            </div>

            <div className="flex-1 p-3.5 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="block text-[10px] font-bold text-[#534341] mb-1 uppercase tracking-wider">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full border-none p-0 focus:ring-0 text-sm text-gray-800 bg-transparent outline-none cursor-pointer"
              >
                <option value="All States">All States</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Kerala">Kerala</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Odisha">Odisha</option>
              </select>
            </div>

            <div className="flex-1 p-3.5 border-b md:border-b-0">
              <label className="block text-[10px] font-bold text-[#534341] mb-1 uppercase tracking-wider">
                Select Festival <span className="text-gray-400 font-normal italic">(Optional)</span>
              </label>
              <select
                value={selectedFestival}
                onChange={(e) => setSelectedFestival(e.target.value)}
                className="w-full border-none p-0 focus:ring-0 text-sm text-gray-800 bg-transparent outline-none cursor-pointer"
              >
                <option value="Any Festival">Any Festival</option>
                <option value="Diwali">Diwali</option>
                <option value="Pongal">Pongal</option>
                <option value="Rath Yatra">Rath Yatra</option>
                <option value="Brahmotsavam">Brahmotsavam</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#5d100a] text-white px-6 py-3.5 m-1 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors cursor-pointer font-bold text-sm shrink-0 shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Hero Quick Links Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
            <div
              onClick={() => onQuickLinkClick('purana')}
              className="bg-white/60 hover:bg-white/90 border border-[#c5a059]/20 cursor-pointer p-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all shadow-2xs group"
            >
              <BookOpen className="w-5 h-5 text-[#5d100a] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase leading-tight text-[#534341]">
                Sthala Purana Library
              </span>
            </div>

            <div
              onClick={() => onQuickLinkClick('temples')}
              className="bg-white/60 hover:bg-white/90 border border-[#c5a059]/20 cursor-pointer p-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all shadow-2xs group"
            >
              <Video className="w-5 h-5 text-[#5d100a] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase leading-tight text-[#534341]">
                Live Darshan Load
              </span>
            </div>

            <div
              onClick={() => onQuickLinkClick('planner')}
              className="bg-white/60 hover:bg-white/90 border border-[#c5a059]/20 cursor-pointer p-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all shadow-2xs group"
            >
              <Calendar className="w-5 h-5 text-[#5d100a] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase leading-tight text-[#534341]">
                Panchangam Planner
              </span>
            </div>

            <div
              onClick={() => onQuickLinkClick('seva')}
              className="bg-white/60 hover:bg-white/90 border border-[#c5a059]/20 cursor-pointer p-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all shadow-2xs group"
            >
              <Users className="w-5 h-5 text-[#5d100a] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase leading-tight text-[#534341]">
                Seva & Archanai
              </span>
            </div>

            <div
              onClick={onToggleSeniorMode}
              className="bg-white/60 hover:bg-white/90 border border-[#c5a059]/20 cursor-pointer p-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all shadow-2xs group"
            >
              <Accessibility className="w-5 h-5 text-[#5d100a] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase leading-tight text-[#534341]">
                Senior Friendly Mode
              </span>
            </div>

            <div
              onClick={() => onQuickLinkClick('home')}
              className="bg-white/60 hover:bg-white/90 border border-[#c5a059]/20 cursor-pointer p-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all shadow-2xs group"
            >
              <Globe className="w-5 h-5 text-[#5d100a] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold uppercase leading-tight text-[#534341]">
                Multilingual Support
              </span>
            </div>
          </div>
        </div>

        {/* Inspirational Quote Card on Right Side */}
        <div className="hidden lg:flex justify-end">
          <div className="bg-[#fffdfa]/95 border-2 border-[#c5a059]/40 p-10 rounded-[50px] relative max-w-sm text-center card-shadow backdrop-blur-xs">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[#c5a059] bg-[#fff8f5] p-2 rounded-full border border-[#c5a059]/30">
              <Sparkles className="w-6 h-6" />
            </div>

            <p className="font-serif text-2xl text-[#5d100a] italic leading-relaxed mt-2">
              "A pilgrimage is not measured in kilometers, but in devotion."
            </p>

            <div className="mt-6">
              <img
                alt="Temple Illustration"
                className="mx-auto opacity-50 max-h-36 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7_-E0Y6IJw24_9P_flryI7-A6lS5io0qT8AMLkekQSV_WEbLaQ08f4rtWe2UFILScl3DQ6apvhGjkL8yk25mbsyp9UDKsDqK4tS5JeYsVk7xLiyyDGLUmwYAN7MkbMFWK_mw5ZfprxBx9pFbey61-ZxHnqmLITKnXazEULNU4yCJCzCJNDBrwd-_D3WfHiIvRoODMyQZmL9OUIA8LCvRxR4x6v1EfhceGomlFTHUYJbWTDvWa2u8"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
