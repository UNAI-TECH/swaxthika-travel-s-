import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { DevotionalPackage } from '../types';
import { PackageCard } from './PackageCard';

interface PackageGridProps {
  packages: DevotionalPackage[];
  onViewDetails: (pkg: DevotionalPackage) => void;
}

export const PackageGrid: React.FC<PackageGridProps> = ({ packages, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories dynamically
  const categories = ['All', ...Array.from(new Set(packages.map((p) => p.category)))];

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-amber-100/60 shadow-xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 order-2 md:order-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#5d100a] text-white shadow-xs border border-[#c5a059]/30'
                  : 'text-gray-600 hover:bg-[#fff8f5] hover:text-[#5d100a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 order-1 md:order-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sacred packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5d100a] focus:bg-white text-gray-800 font-medium"
          />
        </div>
      </div>

      {/* Grid Display */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/60 shadow-xs space-y-3">
          <p className="text-gray-400 font-serif italic text-lg">No sacred packages found matching your criteria.</p>
          <p className="text-xs text-gray-500">Try searching for other destinations or changing the category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id}>
              <PackageCard pkg={pkg} onViewDetails={onViewDetails} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
