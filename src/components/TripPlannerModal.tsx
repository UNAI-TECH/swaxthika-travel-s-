import React, { useState } from 'react';
import { YatraStop, YatraPlanResponse } from '../types';
import { X, MapPin, Sparkles, Calendar, Clock, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

interface TripPlannerModalProps {
  initialStops: YatraStop[];
  onClose: () => void;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  initialStops,
  onClose,
}) => {
  const [startingCity, setStartingCity] = useState('Chennai');
  const [durationDays, setDurationDays] = useState(3);
  const [preferredState, setPreferredState] = useState('Tamil Nadu & Andhra Pradesh');
  const [travelerType, setTravelerType] = useState<'family' | 'senior' | 'solo' | 'group'>('family');
  const [specialRequirements, setSpecialRequirements] = useState('Auspicious Panchangam timings, Senior-friendly');

  const [aiPlan, setAiPlan] = useState<YatraPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai-plan-yatra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startingCity,
          durationDays,
          preferredState,
          travelerType,
          specialRequirements,
        }),
      });

      const data = await res.json();
      setAiPlan(data);
    } catch (err) {
      console.error('AI Plan Yatra failed:', err);
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
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            AI Panchangam-Aware Trip Planner
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            Plan Your Divine Yatra
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Generate auspicious, crowd-optimized pilgrimage itineraries tailored to your travel preferences.
          </p>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Form */}
          <form onSubmit={handleGeneratePlan} className="bg-[#fff8f5] p-4 rounded-xl border border-[#c5a059]/30 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#534341] uppercase mb-1">
                  Starting Location
                </label>
                <input
                  type="text"
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="e.g., Chennai, Hyderabad, Bengaluru"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#534341] uppercase mb-1">
                  Trip Duration (Days)
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                >
                  {[1, 2, 3, 4, 5, 7, 10].map((d) => (
                    <option key={d} value={d}>
                      {d} Day{d > 1 ? 's' : ''} Yatra
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#534341] uppercase mb-1">
                  Traveler Type
                </label>
                <select
                  value={travelerType}
                  onChange={(e) => setTravelerType(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                >
                  <option value="family">Family with Seniors</option>
                  <option value="senior">Senior Citizens Solo/Couple</option>
                  <option value="solo">Solo Pilgrim</option>
                  <option value="group">Devotional Group</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#534341] uppercase mb-1">
                Special Preferences / Needs
              </label>
              <input
                type="text"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="e.g., Wheelchair assistance needed, morning Suprabhatam focus, budget stays"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5d100a] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Consulting Panchangam & Calculating Route...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>Generate Auspicious Yatra Itinerary</span>
                </>
              )}
            </button>
          </form>

          {/* Generated Plan Output */}
          {aiPlan && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div className="bg-[#fbf2ed] p-4 rounded-xl border-l-4 border-[#5d100a]">
                <h4 className="text-xl font-bold font-serif text-[#5d100a]">
                  {aiPlan.title}
                </h4>
                <p className="text-xs text-[#534341] mt-1 italic">
                  {aiPlan.summary}
                </p>
              </div>

              {/* Panchangam Timings Note */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-xs">
                <Clock className="w-4 h-4 text-[#c5a059] shrink-0" />
                <div>
                  <span className="font-bold">Auspicious Panchangam Timing: </span>
                  <span>{aiPlan.auspiciousTimings}</span>
                </div>
              </div>

              {/* Route Stops */}
              <div>
                <h5 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-3">
                  Recommended Yatra Route Stops
                </h5>
                <div className="space-y-3">
                  {aiPlan.stops.map((stop, index) => (
                    <div
                      key={stop.id || index}
                      className="bg-white p-3.5 rounded-lg border border-gray-200 flex items-start gap-3 shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#5d100a] text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h6 className="font-bold text-sm text-gray-900">
                            {stop.name}
                          </h6>
                          <span className="text-[10px] bg-[#fbf2ed] text-[#5d100a] font-bold px-2 py-0.5 rounded">
                            {stop.recommendedDuration}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{stop.city}</p>
                        <p className="text-xs text-gray-700 mt-1">
                          {stop.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Tips */}
              {aiPlan.travelTips && aiPlan.travelTips.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                  <h6 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                    Devotional Travel Tips
                  </h6>
                  <ul className="space-y-1">
                    {aiPlan.travelTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
