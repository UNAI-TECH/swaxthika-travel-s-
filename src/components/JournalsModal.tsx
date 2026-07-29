import React, { useState } from 'react';
import { Journal } from '../types';
import { X, PenTool, Star, ThumbsUp, MessageSquare, CheckCircle } from 'lucide-react';

interface JournalsModalProps {
  journals: Journal[];
  onAddJournal: (newJournal: Journal) => void;
  onClose: () => void;
  startInWriteMode?: boolean;
}

export const JournalsModal: React.FC<JournalsModalProps> = ({
  journals,
  onAddJournal,
  onClose,
  startInWriteMode = false,
}) => {
  const [isWriting, setIsWriting] = useState(startInWriteMode);
  const [authorName, setAuthorName] = useState('');
  const [templeVisited, setTempleVisited] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tipsForPilgrims, setTipsForPilgrims] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !title || !content) return;

    setLoading(true);
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName,
          templeVisited,
          rating,
          title,
          content,
          tipsForPilgrims,
        }),
      });

      const data = await res.json();
      if (data.success && data.journal) {
        onAddJournal(data.journal);
        setIsWriting(false);
      }
    } catch (err) {
      console.error('Error adding journal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/30 relative my-8">
        {/* Header */}
        <div className="bg-[#5d100a] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#c5a059] font-bold text-xs uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4 text-[#c5a059]" />
            Community Pilgrim Yatra Journals
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            {isWriting ? 'Share Your Yatra Experience' : 'Real Pilgrim Experiences & Notes'}
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Read honest notes, tips for senior citizens, crowd hacks, and spiritual blessings.
          </p>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-[#534341] uppercase">
              {journals.length} Pilgrim Notes Published
            </span>
            <button
              onClick={() => setIsWriting(!isWriting)}
              className="bg-[#5d100a] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-opacity-90 transition-colors cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{isWriting ? 'View All Notes' : 'Write a Yatra Note'}</span>
            </button>
          </div>

          {isWriting ? (
            /* Write Form */
            <form onSubmit={handleSubmit} className="bg-[#fff8f5] p-5 rounded-xl border border-[#c5a059]/30 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g., Ananthakrishnan"
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                    Temple / Yatra Visited
                  </label>
                  <input
                    type="text"
                    value={templeVisited}
                    onChange={(e) => setTempleVisited(e.target.value)}
                    placeholder="e.g., Tirupati & Kanchipuram Yatra"
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                  Journal Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Blessed Early Morning Darshan & Senior Citizen Queue Experience"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                  Your Yatra Note / Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share details about your journey, queue wait times, dress code, prasadam, or spiritual moments..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                  Tips for Fellow Pilgrims / Seniors
                </label>
                <input
                  type="text"
                  value={tipsForPilgrims}
                  onChange={(e) => setTipsForPilgrims(e.target.value)}
                  placeholder="e.g., Carry original Aadhaar card for senior citizen counter verification."
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5d100a] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all cursor-pointer shadow-md"
              >
                {loading ? 'Publishing Note...' : 'Publish Yatra Note'}
              </button>
            </form>
          ) : (
            /* Journal Feed */
            <div className="space-y-4">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-white p-5 rounded-xl border border-gray-200 card-shadow space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img
                        src={journal.authorAvatar}
                        alt={journal.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-[#c5a059]"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">
                          {journal.authorName}
                        </h4>
                        <p className="text-[10px] text-gray-500">
                          Visited {journal.templeVisited} • {journal.dateVisited}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-[#c5a059]">
                      {[...Array(journal.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <h5 className="font-bold text-sm text-[#5d100a] font-serif">
                    {journal.title}
                  </h5>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    {journal.content}
                  </p>

                  {journal.tipsForPilgrims && (
                    <div className="bg-[#fff8f5] p-2.5 rounded-lg border border-[#c5a059]/20 text-xs text-gray-800">
                      <span className="font-bold text-[#5d100a]">💡 Pilgrim Tip: </span>
                      <span>{journal.tipsForPilgrims}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                    <button
                      onClick={() => alert(`Liked ${journal.authorName}'s yatra note!`)}
                      className="flex items-center gap-1 hover:text-[#5d100a] cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{journal.likesCount} Helpful</span>
                    </button>
                    <span>Verified Pilgrim Visit</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
