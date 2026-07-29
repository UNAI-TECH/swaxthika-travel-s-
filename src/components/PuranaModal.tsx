import React, { useState } from 'react';
import { PuranaStory } from '../types';
import { X, BookOpen, Volume2, Sparkles, VolumeX } from 'lucide-react';

interface PuranaModalProps {
  story: PuranaStory;
  allStories: PuranaStory[];
  onSelectStory: (story: PuranaStory) => void;
  onClose: () => void;
}

export const PuranaModal: React.FC<PuranaModalProps> = ({
  story,
  allStories,
  onSelectStory,
  onClose,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [customTempleSearch, setCustomTempleSearch] = useState('');
  const [customStoryLoading, setCustomStoryLoading] = useState(false);
  const [currentStory, setCurrentStory] = useState<PuranaStory>(story);

  const toggleAudioSpeech = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `${currentStory.title}. ${currentStory.summary}. ${currentStory.fullStory}`
        );
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      } else {
        alert('Text-to-speech audio narration is not supported in this browser window.');
      }
    }
  };

  const handleFetchAiPurana = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTempleSearch.trim()) return;

    setCustomStoryLoading(true);
    try {
      const res = await fetch('/api/ai-purana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templeName: customTempleSearch }),
      });
      const data = await res.json();
      if (data.story) {
        setCurrentStory(data.story);
      }
    } catch (err) {
      console.error('AI Purana Error:', err);
    } finally {
      setCustomStoryLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/30 relative my-8">
        {/* Header */}
        <div className="bg-[#5d100a] text-white p-6 relative">
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              onClose();
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#c5a059] font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-[#c5a059]" />
            Sacred Sthala Purana Library
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            {currentStory.title}
          </h3>
          <p className="text-xs text-white/80 mt-1 font-serif italic">
            {currentStory.templeName} • {currentStory.associatedDeity}
          </p>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* AI Narrator Search Bar */}
          <form onSubmit={handleFetchAiPurana} className="flex gap-2">
            <input
              type="text"
              value={customTempleSearch}
              onChange={(e) => setCustomTempleSearch(e.target.value)}
              placeholder="Search or ask AI for Sthala Purana of any temple (e.g. Kedarnath, Golden Temple)..."
              className="flex-1 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-[#5d100a] focus:outline-none"
            />
            <button
              type="submit"
              disabled={customStoryLoading}
              className="bg-[#5d100a] text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-opacity-90 transition-colors cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{customStoryLoading ? 'Narrating...' : 'Narrate'}</span>
            </button>
          </form>

          {/* Quick Story Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 border-b border-gray-100">
            {allStories.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                  setCurrentStory(s);
                  onSelectStory(s);
                }}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  currentStory.id === s.id
                    ? 'bg-[#5d100a] text-white font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#fbf2ed]'
                }`}
              >
                {s.templeName.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Story Main Content Card */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden h-48 sm:h-64 shadow-md">
              <img
                src={currentStory.image}
                alt={currentStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex items-end justify-between">
                <div>
                  <span className="bg-[#c5a059] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Puranic Legend
                  </span>
                  <p className="text-white text-xs mt-1 font-serif italic max-w-lg">
                    "{currentStory.significance}"
                  </p>
                </div>

                {/* Audio Narrator Button */}
                <button
                  onClick={toggleAudioSpeech}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-white text-[#5d100a] hover:bg-[#fff8f5]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#c5a059]" />
                      <span>Listen Narration</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Story Text */}
            <div className="bg-[#fff8f5] p-5 rounded-xl border border-[#c5a059]/20 space-y-3">
              <p className="text-sm font-semibold text-[#5d100a] font-serif border-b border-[#c5a059]/20 pb-2">
                {currentStory.summary}
              </p>
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-serif whitespace-pre-line space-y-2">
                {currentStory.fullStory}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
