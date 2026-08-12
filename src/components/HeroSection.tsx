import React, { useState, useEffect } from 'react';
import { Search, Compass, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    title: 'Himalayan Spiritual Peak',
  },
  {
    src: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    title: 'Historic South Indian Temple Architecture',
  },
  {
    src: 'https://images.unsplash.com/photo-1561361068-61690a201b5f?auto=format&fit=crop&w=1200&q=80',
    title: 'Varanasi Ganga Aarti Ghats',
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  return (
    <section className="relative min-h-[520px] flex items-center overflow-hidden py-16 lg:py-24 bg-[#0d0504]">
      {/* Background Rotating Images with Zoom */}
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
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.05] saturate-[1.05] transform-gpu"
          />
        </div>
      ))}

      {/* Elegant Gradient Mask */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#fff8f5] via-[#fff8f5]/90 via-35% to-transparent"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Content Box */}
        <div className="max-w-2xl space-y-6">
          {/* Eyebrow Badge */}
          <div className="flex items-center gap-3 text-[#c5a059] font-bold text-xs tracking-wider uppercase">
            <span className="w-8 h-[1px] bg-[#c5a059]"></span>
            Sacred Pilgrimages Made Seamless
            <span className="w-8 h-[1px] bg-[#c5a059]"></span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#5d100a] leading-tight drop-shadow-xs">
            Sacred Journeys. <br /> Curated Packages. <br /> Divine Experiences.
          </h2>

          <p className="hidden sm:block text-[#534341] max-w-lg text-sm sm:text-base font-medium leading-relaxed">
            Embark on holy yatras meticulously planned with sacred rituals, VIP temple entries, comfortable stays, and pure vegetarian meals. Book seats instantly and check in securely using QR passes.
          </p>

          {/* Search Bar in Hero */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md bg-white p-1.5 rounded-2xl border border-[#c5a059]/30 shadow-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Where would you like to travel? (e.g. Kashi)"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-transparent text-xs rounded-xl pl-10 pr-3 py-2.5 focus:outline-none text-gray-800 font-medium"
              />
            </div>
            
            <button
              type="submit"
              className="bg-[#5d100a] hover:bg-[#801810] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border border-[#c5a059]/30 shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick Category Filter Chips */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">Quick Category Filters</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#5d100a] text-white shadow-xs'
                      : 'bg-white/80 hover:bg-[#fff8f5] text-[#534341] hover:text-[#5d100a] border border-[#c5a059]/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
