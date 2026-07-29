import React, { useState } from 'react';
import { SevaOption } from '../types';
import { X, CheckCircle, Ticket, Calendar, User, Phone, Sparkles, QrCode } from 'lucide-react';

interface SevaBookingModalProps {
  sevas: SevaOption[];
  preselectedTempleName?: string;
  onClose: () => void;
}

export const SevaBookingModal: React.FC<SevaBookingModalProps> = ({
  sevas,
  preselectedTempleName,
  onClose,
}) => {
  const [selectedSevaId, setSelectedSevaId] = useState<string>(sevas[0]?.id || 's1');
  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [numberOfDevotees, setNumberOfDevotees] = useState(1);
  const [specialWishes, setSpecialWishes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const selectedSeva = sevas.find((s) => s.id === selectedSevaId) || sevas[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/book-seva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templeName: selectedSeva?.templeName || preselectedTempleName || 'Tirupati Balaji Temple',
          sevaName: selectedSeva?.sevaName || 'Special Entry Darshan',
          devoteeName,
          phone,
          date,
          numberOfDevotees,
          totalAmount: (selectedSeva?.price || 300) * numberOfDevotees,
          specialWishes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingConfirmed(data.booking);
      }
    } catch (err) {
      console.error('Seva booking failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/30 relative my-8">
        {/* Header */}
        <div className="bg-[#5d100a] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#c5a059] font-bold text-xs uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            Official Seva & Archanai Booking
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            {bookingConfirmed ? 'Seva E-Pass Confirmed!' : 'Book Divine Seva'}
          </h3>
          <p className="text-xs text-white/70 mt-1">
            {bookingConfirmed
              ? 'Present this e-pass at the temple entrance along with photo ID.'
              : 'Pre-book your Seva, Archana, or Special Entry Darshan for seamless sanctum visit.'}
          </p>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {bookingConfirmed ? (
            /* Confirmed Ticket View */
            <div className="space-y-6">
              <div className="bg-[#fff8f5] border-2 border-dashed border-[#c5a059] p-6 rounded-xl relative">
                <div className="flex justify-between items-start border-b border-[#c5a059]/20 pb-4 mb-4">
                  <div>
                    <span className="bg-[#2d6a4f] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Confirmed
                    </span>
                    <h4 className="text-xl font-bold text-[#5d100a] font-serif mt-1">
                      {bookingConfirmed.templeName}
                    </h4>
                    <p className="text-xs font-semibold text-gray-700">
                      {bookingConfirmed.sevaName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Pass ID</p>
                    <p className="text-base font-bold text-[#5d100a] font-mono">
                      {bookingConfirmed.bookingId}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Devotee Name</span>
                    <span className="font-semibold text-gray-900">{bookingConfirmed.devoteeName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Date of Seva</span>
                    <span className="font-semibold text-gray-900">{bookingConfirmed.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Devotees</span>
                    <span className="font-semibold text-gray-900">{bookingConfirmed.numberOfDevotees} Person(s)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Total Amount</span>
                    <span className="font-bold text-[#5d100a]">Rs. {bookingConfirmed.totalAmount}</span>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 mt-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={bookingConfirmed.qrCodePlaceholder}
                      alt="Pass QR Code"
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Scan at Counter</p>
                      <p className="text-[10px] text-gray-500">Fast-track e-verification</p>
                    </div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-[#2d6a4f]" />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-white border border-[#5d100a] text-[#5d100a] py-2.5 rounded-lg font-bold text-xs hover:bg-[#fff8f5] cursor-pointer"
                >
                  Print / Download Pass
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#5d100a] text-white py-2.5 rounded-lg font-bold text-xs hover:bg-opacity-90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Seva */}
              <div>
                <label className="block text-xs font-bold text-[#534341] uppercase mb-1.5">
                  Select Temple & Seva Option
                </label>
                <select
                  value={selectedSevaId}
                  onChange={(e) => setSelectedSevaId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 bg-white focus:ring-2 focus:ring-[#5d100a] focus:outline-none"
                >
                  {sevas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.templeName} - {s.sevaName} (Rs. {s.price})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 italic mt-1">
                  {selectedSeva?.description} • {selectedSeva?.timing}
                </p>
              </div>

              {/* Devotee Name */}
              <div>
                <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                  Primary Devotee Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    placeholder="e.g., Sundararajan Swamy"
                    className="w-full pl-9 border border-gray-300 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#5d100a] focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 border border-gray-300 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#5d100a] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                    Seva Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 border border-gray-300 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#5d100a] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Number of Devotees */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                    Number of Devotees
                  </label>
                  <select
                    value={numberOfDevotees}
                    onChange={(e) => setNumberOfDevotees(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Person{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                    Total Amount
                  </label>
                  <div className="p-2 border border-gray-200 rounded-lg bg-[#fbf2ed] text-[#5d100a] font-bold text-sm text-center">
                    Rs. {(selectedSeva?.price || 300) * numberOfDevotees}
                  </div>
                </div>
              </div>

              {/* Special Wishes / Gothram */}
              <div>
                <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                  Gothram & Nakshatram <span className="text-gray-400 font-normal">(Optional for Sankalpam)</span>
                </label>
                <input
                  type="text"
                  value={specialWishes}
                  onChange={(e) => setSpecialWishes(e.target.value)}
                  placeholder="e.g., Haritha Gothram, Rohini Nakshatram"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#5d100a] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5d100a] text-white py-3 rounded-lg font-bold text-sm hover:bg-opacity-95 transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span>Generating Seva E-Pass...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#c5a059]" />
                    <span>Confirm & Generate Seva Pass</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
