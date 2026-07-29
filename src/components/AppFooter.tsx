import React from 'react';

interface AppFooterProps {
  onNavClick: (tab: string) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-[#5d100a] text-white pt-12 pb-8 px-4 sm:px-8 lg:px-16 border-t-2 border-[#c5a059]/30">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* App Download Banner */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-12 w-full justify-center bg-black/15 p-6 rounded-2xl border border-[#c5a059]/20">
          <div className="text-center md:text-left">
            <h4 className="text-white text-lg font-bold font-serif mb-1">
              Download the Swaxthika App
            </h4>
            <p className="text-white/70 text-xs italic">
              Your pilgrimage companion in your pocket with offline Sthala Puranas & live darshan notifications.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("App Download link clicked! Swaxthika mobile app will be available on Google Play."); }}
              className="block h-10 hover:opacity-90 transition-opacity"
            >
              <img
                alt="Google Play"
                className="h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0l9surZQSpJZU8Eat7HYGc_K2VmpiNPkcCpuB2UgtScKTXXFnWt79e-4PxEDcsizE0KILa2VqdtcfFtNL9AkStdQPVTI9ILiEJejJfRJbzKPfYqct8nozI2V-gNh2aAv6xQR8vEbsdYyZjkibbWpatxQr8FhELr0SpsNUmb9okkPVpLA6BjTkcz1ySJ8FTgm8ZaDg8fRnIPFer39Q8FBBjb6Xqb-tUI6WAQRraf68DCmiIHCaHMc"
              />
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("App Download link clicked! Swaxthika mobile app will be available on App Store."); }}
              className="block h-10 hover:opacity-90 transition-opacity"
            >
              <img
                alt="App Store"
                className="h-full bg-white rounded-md p-1 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc9V68myEZ5uP6N3tbQ2t-DKmNL6Z2sJcdXpP96DL8Ysm1p1SwrOnlMb0W0C_dsB7Fj6hokV6jjeTSmuVu3M5ultumf9R7FyoDLpDs02tNtPrL_Uojyhbk-pdwWH4BAIhdqaVUrgYSDqVjAeyOR6uHc4UkUfus2n8Ylbmvo_WYd3Zs8RhsfDjMAWZdBV79yPCZ_5-4dG6WiOXkTc5d9ngZptveMK5p41C6mPEbTTzQaqhwvhvfMAk"
              />
            </a>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center py-8 border-y border-white/10 gap-6">
          <div className="text-center md:text-left cursor-pointer" onClick={() => onNavClick('home')}>
            <h1 className="text-xl font-bold text-white leading-none tracking-tight font-serif">
              SWAXTHIKA TRAVEL
            </h1>
            <p className="text-[10px] text-[#c5a059] font-bold uppercase mt-1">
              Sacred Journeys. Divine Experiences.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <button onClick={() => onNavClick('home')} className="text-white/80 hover:text-white text-xs cursor-pointer">
              About Us
            </button>
            <button onClick={() => onNavClick('temples')} className="text-white/80 hover:text-white text-xs cursor-pointer">
              Temple Directory
            </button>
            <button onClick={() => onNavClick('planner')} className="text-white/80 hover:text-white text-xs cursor-pointer">
              Yatra Planner
            </button>
            <button onClick={() => onNavClick('festivals')} className="text-white/80 hover:text-white text-xs cursor-pointer">
              Festivals
            </button>
            <button onClick={() => onNavClick('seva')} className="text-white/80 hover:text-white text-xs cursor-pointer">
              Seva & Archanai
            </button>
            <button onClick={() => onNavClick('journals')} className="text-white/80 hover:text-white text-xs cursor-pointer">
              Pilgrim Journals
            </button>
          </nav>
        </div>

        {/* Sanskrit Shloka */}
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-[#c5a059] font-serif text-3xl italic tracking-wide">
            यत्र धर्म: तत्र जय:
          </h2>
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
            Where there is Dharma, there is Victory.
          </p>
          <p className="text-white/30 text-[10px] pt-4">
            © 2026 Swaxthika Travel. All Rights Reserved. Devotional & Pilgrimage Services.
          </p>
        </div>
      </div>
    </footer>
  );
};
