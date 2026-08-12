import React, { useState } from 'react';
import { User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { UserSession } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserSession | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onSignOut,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'packages', label: 'Devotional Packages' },
    ...(user && user.isLoggedIn ? [{ id: 'my-bookings', label: 'My Boarding Passes' }] : []),
  ];

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#c5a059]/20 shadow-xs">
      <div className="h-16 sm:h-20 flex items-center px-4 sm:px-8 lg:px-16 justify-between">
        {/* Brand Logo & Name */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-sm border border-[#c5a059]/40 shrink-0 bg-white p-0.5 flex items-center justify-center group-hover:scale-105 transition-transform">
            <img
              src="/swaxthika-logo.jpg"
              alt="Swaxthika Travel Logo"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=100&q=80';
              }}
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-[#5d100a] leading-none tracking-tight font-serif">
              SWAXTHIKA
            </h1>
            <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#c5a059] font-bold uppercase">
              Travel
            </p>
            <p className="text-[8px] text-[#534341] italic hidden sm:block">
              Sacred Journeys. Divine Experiences.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-semibold transition-colors cursor-pointer pb-1 ${
                activeTab === item.id
                  ? 'text-[#5d100a] font-bold border-b-2 border-[#5d100a]'
                  : 'text-[#534341] hover:text-[#5d100a]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Session profile display */}
          {user && user.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer p-1 rounded-xl hover:bg-white/50 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#c5a059]"
                />
                <span className="hidden sm:block text-xs font-semibold text-gray-700 max-w-[120px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#c5a059]/30 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 space-y-0.5">
                      <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => handleNavClick('my-bookings')}
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-[#fff8f5] transition-colors cursor-pointer"
                    >
                      My Boarding Passes
                    </button>

                    <button
                      onClick={() => {
                        onSignOut();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-[#5d100a] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold hover:bg-[#801810] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#c5a059]/30"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-[#5d100a]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute top-full left-0 right-0 bg-[#fff8f5] border-b border-[#c5a059]/30 shadow-lg z-40 md:hidden animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col py-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-6 py-3 text-sm font-semibold transition-colors cursor-pointer border-l-4 ${
                    activeTab === item.id
                      ? 'text-[#5d100a] font-bold bg-[#fff0eb] border-[#5d100a]'
                      : 'text-[#534341] hover:bg-[#fff0eb] hover:text-[#5d100a] border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};
