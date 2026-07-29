import React, { useState } from 'react';
import { Globe, User, Sun, Accessibility, Menu, X, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  seniorMode,
  setSeniorMode,
  selectedLang,
  setSelectedLang,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'TA', name: 'தமிழ் (Tamil)' },
    { code: 'TE', name: 'తెలుగు (Telugu)' },
    { code: 'HI', name: 'हिंदी (Hindi)' },
    { code: 'KN', name: 'கன்னட (Kannada)' },
    { code: 'ML', name: 'മലയാളം (Malayalam)' },
  ];

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'temples', label: 'Temples' },
    { id: 'planner', label: 'Trip Planner' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'seva', label: 'Seva Booking' },
    { id: 'journals', label: 'Journals' },
    { id: 'purana', label: 'Sthala Puranas' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#c5a059]/20 h-20 flex items-center px-4 sm:px-8 lg:px-16 justify-between shadow-xs">
      {/* Brand Logo & Name */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setActiveTab('home')}
      >
        <div className="w-10 h-10 bg-[#c5a059] rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z"></path>
          </svg>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#5d100a] leading-none tracking-tight font-serif">
            SWAXTHIKA
          </h1>
          <p className="text-[10px] tracking-[0.2em] text-[#c5a059] font-bold uppercase">
            Travel
          </p>
          <p className="text-[8px] text-[#534341] italic hidden sm:block">
            Sacred Journeys. Divine Experiences.
          </p>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden xl:flex items-center space-x-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`text-sm transition-colors cursor-pointer ${
              activeTab === item.id
                ? 'text-[#5d100a] font-bold border-b-2 border-[#5d100a] pb-1'
                : 'text-[#534341] hover:text-[#5d100a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Utility Buttons */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Senior Friendly Mode Toggle */}
        <button
          onClick={() => setSeniorMode(!seniorMode)}
          title="Toggle Senior Citizen Friendly Mode (Larger Text & High Contrast)"
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all border ${
            seniorMode
              ? 'bg-[#5d100a] text-white border-[#5d100a]'
              : 'bg-white/80 text-[#534341] border-[#c5a059]/40 hover:bg-[#fff8f5]'
          }`}
        >
          <Accessibility className="w-4 h-4 text-[#c5a059]" />
          <span className="hidden md:inline">Senior Mode</span>
          {seniorMode && <span className="text-[10px] bg-[#c5a059] px-1 rounded text-white font-bold">ON</span>}
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1 text-[#534341] text-xs sm:text-sm font-medium hover:text-[#5d100a] px-2 py-1 rounded cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#c5a059]" />
            <span>{selectedLang}</span>
            <ChevronDown className="w-3 h-3 text-[#534341]" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#c5a059]/30 rounded-lg shadow-xl py-2 z-50">
              <div className="px-3 py-1 border-b border-gray-100 text-[10px] font-bold uppercase text-[#c5a059]">
                Select Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setLangMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-[#fbf2ed] flex items-center justify-between cursor-pointer"
                >
                  <span>{lang.name}</span>
                  {selectedLang === lang.code && (
                    <Check className="w-3.5 h-3.5 text-[#5d100a]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign In / Sign Up Button */}
        <button
          onClick={onOpenAuth}
          className="bg-[#5d100a] text-white px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In / Sign Up</span>
          <span className="sm:hidden">Sign In</span>
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-[#5d100a] hover:bg-[#fbf2ed] rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#fff8f5] border-b border-[#c5a059]/30 shadow-xl p-4 flex flex-col gap-3 xl:hidden z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 text-sm rounded-lg cursor-pointer ${
                activeTab === item.id
                  ? 'bg-[#5d100a] text-white font-bold'
                  : 'text-[#534341] hover:bg-[#fbf2ed]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
