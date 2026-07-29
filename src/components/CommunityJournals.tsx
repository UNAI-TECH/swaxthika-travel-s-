import React from 'react';
import { Journal } from '../types';
import { MessageSquare, ArrowRight, Star, PenTool, Smartphone } from 'lucide-react';

interface CommunityJournalsProps {
  journals: Journal[];
  onOpenJournalsModal: () => void;
  onWriteJournalModal: () => void;
}

export const CommunityJournals: React.FC<CommunityJournalsProps> = ({
  journals,
  onOpenJournalsModal,
  onWriteJournalModal,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl card-shadow border border-gray-100 flex flex-col justify-between relative overflow-hidden h-full">
      <div className="relative z-10">
        <h3 className="text-xl font-serif font-bold text-[#5d100a] mb-1">
          Community Yatra Journals
        </h3>
        <p className="text-xs text-[#534341] mb-5">
          Real experiences. Honest notes. Helpful for your journey.
        </p>

        {/* User Avatars Row */}
        <div className="flex items-center -space-x-2.5 mb-6">
          {journals.slice(0, 3).map((j, i) => (
            <img
              key={j.id || i}
              alt={j.authorName}
              className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-xs"
              src={j.authorAvatar}
            />
          ))}
          <div className="w-9 h-9 rounded-full border-2 border-white bg-[#fbf2ed] flex items-center justify-center text-[10px] text-[#5d100a] font-bold shadow-xs">
            +1.2k
          </div>
          <span className="text-[11px] text-gray-500 font-medium ml-4">
            Shared Notes & Pilgrim Tips
          </span>
        </div>

        {/* Sample Featured Review */}
        {journals[0] && (
          <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#c5a059]/20 mb-4 text-xs italic text-gray-700">
            <p className="line-clamp-2">"{journals[0].content}"</p>
            <p className="text-[10px] font-bold text-[#5d100a] not-italic mt-1">
              — {journals[0].authorName} ({journals[0].templeVisited})
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2 relative z-10">
        <button
          onClick={onOpenJournalsModal}
          className="w-full bg-[#5d100a] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-opacity-95 transition-colors cursor-pointer shadow-sm"
        >
          <span>Explore Journals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onWriteJournalModal}
          className="w-full bg-white border border-[#c5a059] text-[#5d100a] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#fff8f5] transition-colors cursor-pointer"
        >
          <PenTool className="w-3 h-3 text-[#c5a059]" />
          <span>Write Yatra Note</span>
        </button>
      </div>

      {/* Decorative Smartphone Mockup Visual at Corner matching prompt design */}
      <div className="absolute -bottom-10 -right-4 w-28 h-52 bg-gray-900 rounded-[24px] border-4 border-gray-800 opacity-15 rotate-12 pointer-events-none"></div>
    </div>
  );
};
