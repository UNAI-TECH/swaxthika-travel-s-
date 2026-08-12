import React, { useState } from 'react';
import { X, Calendar, User, Check, AlertCircle, Clock, ChevronDown, Plus, Minus, ShieldCheck, Ticket } from 'lucide-react';
import { DevotionalPackage, TourDate, UserSession, PackageAddon } from '../types';

interface PackageDetailModalProps {
  pkg: DevotionalPackage;
  user: UserSession | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onBookingComplete: (booking: any) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  user,
  onClose,
  onOpenAuth,
  onBookingComplete,
}) => {
  const [selectedDateId, setSelectedDateId] = useState<string>(() => {
    const available = pkg.availableDates.filter((d) => d.status !== 'sold-out');
    return available.length > 0 ? available[0].id : '';
  });
  
  const [seats, setSeats] = useState<number>(1);
  const [phone, setPhone] = useState<string>('');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'details'>('itinerary');

  const selectedDate = pkg.availableDates.find((d) => d.id === selectedDateId);
  const isSoldOut = !selectedDate || selectedDate.status === 'sold-out';
  
  // Calculate add-on totals
  const selectedAddons = (pkg.addons || []).filter((a) => selectedAddonIds.includes(a.id));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  
  const price = pkg.pricePerSeat;
  const totalAmount = (price + addonsTotal) * seats;

  const handleIncrement = () => {
    if (selectedDate && seats < selectedDate.totalSeats - selectedDate.bookedSeats) {
      setSeats((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (seats > 1) {
      setSeats((prev) => prev - 1);
    }
  };

  const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      if (selectedDate && val <= selectedDate.totalSeats - selectedDate.bookedSeats) {
        setSeats(val);
      }
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.isLoggedIn) {
      onOpenAuth();
      return;
    }

    if (!selectedDateId) {
      setErrorMsg('Please select a travel date.');
      return;
    }

    if (!phone) {
      setErrorMsg('Please enter a contact phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/book-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          tourDateId: selectedDateId,
          userName: user.name,
          userEmail: user.email,
          userPhone: phone,
          numberOfSeats: seats,
          totalAmount,
          selectedAddons,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onBookingComplete(data.booking);
      } else {
        setErrorMsg(data.error || 'Failed to book package. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Failed to reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fffdfa] w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50 relative my-8 flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side: Package Information */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
          {/* Header Banner */}
          <div className="relative h-60 rounded-2xl overflow-hidden">
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0c0a] via-transparent to-transparent"></div>
            
            <button
              onClick={onClose}
              className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors cursor-pointer md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-4 right-4">
              <span className="bg-[#c5a059] text-white text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-white/20 uppercase">
                {pkg.category}
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white mt-1">
                {pkg.name}
              </h2>
            </div>
          </div>

          {/* Description & Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#c5a059]" />
                {pkg.duration}
              </span>
              <span>•</span>
              <span>Spiritual Pilgrimage Route</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed font-sans">
              {pkg.description}
            </p>
          </div>

          {/* highlights */}
          <div className="bg-[#fff8f5] p-5 rounded-2xl border border-amber-100 space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#5d100a] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
              Yatra Highlights & Key Stops
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
              {pkg.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs for Itinerary vs details */}
          <div className="space-y-4">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'itinerary'
                    ? 'border-[#5d100a] text-[#5d100a]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Day-by-Day Itinerary
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[#5d100a] text-[#5d100a]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Inclusions & Exclusions
              </button>
            </div>

            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {pkg.itinerary.map((stop, idx) => (
                  <div key={idx} className="border-l-2 border-[#c5a059]/40 pl-4 py-1 relative space-y-1">
                    <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#5d100a]"></span>
                    <h4 className="font-bold text-xs text-gray-900">
                      Day {stop.day}: {stop.title}
                    </h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {stop.description}
                    </p>
                    {stop.temples.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {stop.temples.map((temple, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-[#fbf2ed] text-[#5d100a] text-[9px] font-bold px-2 py-0.5 rounded border border-[#c5a059]/10"
                          >
                            ⛩️ {temple}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="space-y-2.5">
                  <h4 className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">What's Included</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    {pkg.inclusions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-bold text-rose-800 uppercase tracking-wider text-[10px]">Exclusions</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    {pkg.exclusions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Booking Sidebar */}
        <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-amber-200/50 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-[#5d100a] flex items-center gap-1.5">
                <Ticket className="w-5 h-5 text-[#c5a059]" />
                Book Seats
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer hidden md:block"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[11px] p-3 rounded-xl flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-5">
              {/* Tour Date Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-500 block">Select Tour Date</label>
                <div className="space-y-2">
                  {pkg.availableDates.map((d) => (
                    <label
                      key={d.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        d.status === 'sold-out'
                          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                          : selectedDateId === d.id
                          ? 'border-[#5d100a] bg-[#fff8f5] text-gray-900 font-semibold'
                          : 'border-gray-200 text-gray-700 hover:border-amber-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <input
                          type="radio"
                          name="tourDate"
                          disabled={d.status === 'sold-out'}
                          checked={selectedDateId === d.id}
                          onChange={() => {
                            setSelectedDateId(d.id);
                            setSeats(1);
                          }}
                          className="accent-[#5d100a]"
                        />
                        <span>
                          {new Date(d.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          d.status === 'sold-out'
                            ? 'bg-gray-200 text-gray-500'
                            : d.status === 'filling-fast'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {d.status === 'sold-out'
                          ? 'Sold Out'
                          : d.status === 'filling-fast'
                          ? 'Filling Fast'
                          : 'Available'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Number of Seats (Stepper) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-500 block">Number of seats</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50/50 p-1 w-32 justify-between">
                    <button
                      type="button"
                      disabled={isSoldOut || seats <= 1}
                      onClick={handleDecrement}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <input
                      type="text"
                      disabled={isSoldOut}
                      value={seats}
                      onChange={handleSeatsChange}
                      className="w-10 text-center font-bold text-xs text-gray-800 bg-transparent focus:outline-none"
                    />

                    <button
                      type="button"
                      disabled={
                        isSoldOut ||
                        (selectedDate && seats >= selectedDate.totalSeats - selectedDate.bookedSeats)
                      }
                      onClick={handleIncrement}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {selectedDate && (
                    <span className="text-[10px] text-gray-500 font-medium">
                      {selectedDate.totalSeats - selectedDate.bookedSeats} seats left
                    </span>
                  )}
                </div>
              </div>

              {/* Devotional Add-ons Selection */}
              {pkg.addons && pkg.addons.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-500 block">Devotional Add-ons</label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {pkg.addons.map((addon) => {
                      const isChecked = selectedAddonIds.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'border-[#5d100a] bg-[#fff8f5] text-gray-900 font-semibold'
                              : 'border-gray-200 text-gray-700 hover:border-amber-300 bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAddonIds([...selectedAddonIds, addon.id]);
                              } else {
                                setSelectedAddonIds(selectedAddonIds.filter((id) => id !== addon.id));
                              }
                            }}
                            className="accent-[#5d100a] mt-0.5 shrink-0"
                          />
                          <div className="text-[10px] leading-tight">
                            <div className="flex justify-between w-full font-bold">
                              <span>{addon.name}</span>
                              <span className="text-[#5d100a] ml-1">+₹{addon.price}</span>
                            </div>
                            {addon.description && (
                              <p className="text-[8px] text-gray-500 font-normal mt-0.5 leading-none">{addon.description}</p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contact Details */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-500 block">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5d100a] text-gray-800 font-semibold"
                />
              </div>
            </form>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 mt-6">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Total price</span>
                <span className="text-[10px] text-gray-400 font-medium">₹{(price + addonsTotal).toLocaleString('en-IN')} × {seats}</span>
              </div>
              <span className="text-xl font-bold text-[#5d100a]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading || isSoldOut}
              className="w-full bg-[#5d100a] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed border border-[#c5a059]/30"
            >
              {loading ? (
                <span>Generating Sacred Pass...</span>
              ) : isSoldOut ? (
                <span>Date Sold Out</span>
              ) : !user || !user.isLoggedIn ? (
                <span>Sign In with Google to Book</span>
              ) : (
                <span>Confirm Devotional booking</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
