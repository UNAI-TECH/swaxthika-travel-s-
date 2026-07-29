import React from 'react';
import { PuranaStory } from '../types';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface SthalaPuranaStoriesProps {
  story: PuranaStory;
  onOpenPuranaModal: (story: PuranaStory) => void;
  onExploreStories: () => void;
}

export const SthalaPuranaStories: React.FC<SthalaPuranaStoriesProps> = ({
  story,
  onOpenPuranaModal,
  onExploreStories,
}) => {
  return (
    <div className="bg-[#5d100a]/5 p-6 rounded-xl border border-[#5d100a]/10 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-end justify-between mb-3">
          <h3 className="text-xl font-serif font-bold text-[#5d100a]">
            Sthala Purana Stories
          </h3>
          <button
            onClick={onExploreStories}
            className="text-[#5d100a] text-[10px] font-bold uppercase border-b border-[#5d100a] hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
          >
            <span>EXPLORE STORIES</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-xs italic text-[#534341] mb-4">
          The divine stories behind every temple.
        </p>

        <div className="relative rounded-lg overflow-hidden group border border-[#c5a059]/20 shadow-xs">
          <img
            alt={story.title}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            src={story.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3.5 flex flex-col justify-end">
            <p className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider">
              {story.templeName}
            </p>
            <h4 className="text-white font-serif font-bold text-sm leading-snug line-clamp-2">
              {story.title}
            </h4>
          </div>
        </div>
      </div>

      <button
        onClick={() => onOpenPuranaModal(story)}
        className="w-full bg-[#5d100a] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 mt-4 hover:bg-opacity-95 transition-colors cursor-pointer shadow-sm"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Read Story</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
