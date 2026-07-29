import React, { useState } from 'react';
import { X, ShieldCheck, HeartHandshake, ScrollText, Sparkles, Building2, Calendar, FileText } from 'lucide-react';

interface AppFooterProps {
  onNavClick: (tab: string) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onNavClick }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <footer className="bg-[#5d100a] text-white pt-12 pb-8 px-4 sm:px-8 lg:px-16 border-t-2 border-[#c5a059]/30 relative">
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

        {/* Main Footer Links & Navigation */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center py-8 border-y border-white/10 gap-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavClick('home')}>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-[#c5a059]/50 shrink-0 bg-white p-0.5 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/swaxthika-logo.jpg"
                alt="Swaxthika Travel Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none tracking-tight font-serif">
                SWAXTHIKA TRAVEL
              </h1>
              <p className="text-[10px] text-[#c5a059] font-bold uppercase mt-1">
                Sacred Journeys. Divine Experiences.
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-5 sm:gap-6">
            <button
              onClick={() => setShowAboutModal(true)}
              className="text-[#c5a059] font-bold hover:underline text-xs cursor-pointer flex items-center gap-1"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>About Us</span>
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

            <button
              onClick={() => setShowTermsModal(true)}
              className="text-[#c5a059] font-bold hover:underline text-xs cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms & Conditions</span>
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

      {/* ABOUT US MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdfa] text-gray-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-[#c5a059]/40 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5d100a] text-[#c5a059] flex items-center justify-center font-serif font-bold text-lg shadow-md">
                  🕉️
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#5d100a]">About Swaxthika Travel</h3>
                  <p className="text-xs text-gray-500">எங்களைப் பற்றி • Sacred Journeys & Divine Experiences</p>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-gray-700 font-sans">
              <div className="bg-[#fff8f5] border border-[#c5a059]/40 p-4 rounded-xl space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#5d100a] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>Our Sacred Mission</span>
                </h4>
                <p>
                  Swaxthika Travel was founded with a deep spiritual commitment to connect devotees and pilgrims across Tamil Nadu, South India, and the world with the rich heritage of sacred shrines, authentic Sthala Puranas, auspicious Tamil Panchangams, and seamless online Seva reservations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white border border-gray-200 p-3.5 rounded-xl space-y-1">
                  <h5 className="font-serif font-bold text-xs text-[#5d100a] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Real-Time Darshan Tracking</span>
                  </h5>
                  <p className="text-[11px] text-gray-600">
                    Live crowd status and queue wait time estimates for Tirupati, Meenakshi Amman, Sabarimala, and Srirangam.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 p-3.5 rounded-xl space-y-1">
                  <h5 className="font-serif font-bold text-xs text-[#5d100a] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Authentic Tamil Calendar</span>
                  </h5>
                  <p className="text-[11px] text-gray-600">
                    Traditional Tamil month uthsavams (சித்திரை, ஆடி, கார்த்திகை, தை), Nalla Neram, and auspicious tithis.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-1">
                <h5 className="font-serif font-bold text-xs text-amber-900 flex items-center gap-1">
                  <HeartHandshake className="w-4 h-4 text-[#c5a059]" />
                  <span>Senior Citizen Friendly Yatra</span>
                </h5>
                <p className="text-[11px] text-amber-800">
                  Dedicated Senior Mode providing high-contrast typography, wheelchair access guides, and simplified queue passes for elderly devotees.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="bg-[#5d100a] text-white font-bold text-xs px-5 py-2 rounded-xl hover:bg-opacity-90 transition-all cursor-pointer shadow-md"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TERMS & CONDITIONS MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdfa] text-gray-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-[#c5a059]/40 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5d100a] text-[#c5a059] flex items-center justify-center font-serif font-bold text-lg shadow-md">
                  📜
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#5d100a]">Terms & Conditions</h3>
                  <p className="text-xs text-gray-500">சேவை விதிகள் மற்றும் நிபந்தனைகள் • Swaxthika Travel Guidelines</p>
                </div>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-gray-700 font-sans">
              <div className="space-y-1.5">
                <h4 className="font-bold text-xs text-[#5d100a] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>1. Seva Booking & Devotee Registration</span>
                </h4>
                <p className="text-[11px] text-gray-600">
                  All online Archana, Abhishekams, and Special Darshan bookings made through Swaxthika Travel are registered with respective temple trusts. Devotees receive a digital confirmation pass with a unique Booking ID and QR code.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-gray-100 pt-3">
                <h4 className="font-bold text-xs text-[#5d100a] flex items-center gap-1">
                  <ScrollText className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>2. Live Crowd Status & Wait Time Accuracy</span>
                </h4>
                <p className="text-[11px] text-gray-600">
                  Queue wait times and crowd levels are updated continuously via real-time temple monitoring. However, actual wait times may fluctuate during unannounced VIP visits or sudden festival rush.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-gray-100 pt-3">
                <h4 className="font-bold text-xs text-[#5d100a] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>3. Traditional Temple Dress Code</span>
                </h4>
                <p className="text-[11px] text-gray-600">
                  Devotees are required to adhere strictly to the traditional attire mandated by temple trusts (e.g. Dhoti/Veshti for men, Saree/Salwar for women). Western wear or footwear is prohibited inside the inner sanctums.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-gray-100 pt-3">
                <h4 className="font-bold text-xs text-[#5d100a] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>4. Cancellation & Rescheduling Policy</span>
                </h4>
                <p className="text-[11px] text-gray-600">
                  Seva booking cancellations submitted at least 48 hours prior to the scheduled date are eligible for full refund or date rescheduling.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-[#5d100a] text-white font-bold text-xs px-5 py-2 rounded-xl hover:bg-opacity-90 transition-all cursor-pointer shadow-md"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
