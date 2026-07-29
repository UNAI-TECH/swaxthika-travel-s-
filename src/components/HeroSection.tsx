import React, { useState, useEffect } from 'react';
import { BookOpen, Video, Calendar, Users, Accessibility, Globe } from 'lucide-react';

interface HeroSectionProps {
  onSearch?: (query: string, state: string, festival: string) => void;
  onQuickLinkClick: (targetTab: string) => void;
  onToggleSeniorMode: () => void;
}

const HERO_IMAGES = [
  {
    src: '/hero-temple-1.jpg',
    title: 'Sunset Temple Gopuram',
  },
  {
    src: '/rameshwaram.jpg',
    title: 'Ramanathaswamy Temple Golden Gopuram',
  },
  {
    src: '/hero-temple-3.jpg',
    title: 'Tiruchendur Murugan Temple Seashore Gopuram',
  },
  {
    src: '/hero-temple-4.jpg',
    title: 'Srirangam Ranganathaswamy Rajagopuram',
  },
  {
    src: '/hero-temple-2.jpg',
    title: 'Brihadeeswarar Shrine',
  },
  {
    src: '/hero-temple-5.jpg',
    title: 'Dravidian Temple Sculptures',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onQuickLinkClick,
  onToggleSeniorMode,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[580px] flex items-center overflow-hidden py-14 lg:py-24 bg-[#0d0504]">
      {/* High Definition Background Rotating Images with smooth fade and cinematic zoom */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={img.src}
          className={`absolute inset-0 z-0 transition-all duration-1000 ease-out ${
            idx === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={img.src}
            alt={img.title}
            className="w-full h-full object-cover object-center brightness-[1.08] contrast-[1.06] saturate-[1.10] transform-gpu"
          />
        </div>
      ))}

      {/* Ultra-Clean Gradient Mask for 100% Text Legibility on Left & Pure High-Res Image Quality on Right */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#fff8f5] via-[#fff8f5]/85 via-35% to-transparent"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Hero Left Content */}
        <div className="max-w-2xl space-y-6">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-3 text-[#c5a059] font-bold text-xs sm:text-sm tracking-wide">
            <span className="w-8 h-[1px] bg-[#c5a059]"></span>
            Plan Your Divine Journey
            <span className="w-8 h-[1px] bg-[#c5a059]"></span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#5d100a] leading-tight drop-shadow-xs">
            Temples are not <br className="hidden sm:block" /> just destinations, <br className="hidden sm:block" /> they are experiences.
          </h2>

          <p className="text-[#534341] max-w-lg text-base sm:text-lg italic font-sans leading-relaxed">
            Discover Sthala Puranas, plan auspicious trips, book seva, and experience devotion like never before.
          </p>

          {/* Hero Quick Links Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-4">
            <div
              onClick={() => onQuickLinkClick('purana')}
              className="bg-white/95 hover:bg-white border border-[#c5a059]/40 cursor-pointer p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-md hover:shadow-lg group backdrop-blur-xs"
            >
              <BookOpen className="w-5 h-5 text-[#5d100a] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase leading-tight text-[#534341]">
                Sthala Purana Library
              </span>
            </div>

            <div
              onClick={() => onQuickLinkClick('temples')}
              className="bg-white/95 hover:bg-white border border-[#c5a059]/40 cursor-pointer p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-md hover:shadow-lg group backdrop-blur-xs"
            >
              <Video className="w-5 h-5 text-[#5d100a] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase leading-tight text-[#534341]">
                Live Darshan Load
              </span>
            </div>

            <div
              onClick={() => onQuickLinkClick('planner')}
              className="bg-white/95 hover:bg-white border border-[#c5a059]/40 cursor-pointer p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-md hover:shadow-lg group backdrop-blur-xs"
            >
              <Calendar className="w-5 h-5 text-[#5d100a] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase leading-tight text-[#534341]">
                Panchangam Planner
              </span>
            </div>

            <div
              onClick={() => onQuickLinkClick('seva')}
              className="bg-white/95 hover:bg-white border border-[#c5a059]/40 cursor-pointer p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-md hover:shadow-lg group backdrop-blur-xs"
            >
              <Users className="w-5 h-5 text-[#5d100a] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase leading-tight text-[#534341]">
                Seva & Archanai
              </span>
            </div>

            <div
              onClick={onToggleSeniorMode}
              className="bg-white/95 hover:bg-white border border-[#c5a059]/40 cursor-pointer p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-md hover:shadow-lg group backdrop-blur-xs"
            >
              <Accessibility className="w-5 h-5 text-[#5d100a] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase leading-tight text-[#534341]">
                Senior Friendly Mode
              </span>
            </div>

            <div
              onClick={() => onQuickLinkClick('home')}
              className="bg-white/95 hover:bg-white border border-[#c5a059]/40 cursor-pointer p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-md hover:shadow-lg group backdrop-blur-xs"
            >
              <Globe className="w-5 h-5 text-[#5d100a] mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase leading-tight text-[#534341]">
                Multilingual Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
