import React from 'react';
import { CheckCircle2, Printer, Check, Ticket, Calendar, User, Phone, DollarSign } from 'lucide-react';
import { Booking } from '../types';

interface BookingConfirmationProps {
  booking: Booking;
  onClose: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/30 relative my-8 p-6 space-y-6">
        
        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#5d100a]">
            Sacred Pass Generated!
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Your package tour booking has been confirmed successfully.
          </p>
        </div>

        {/* Boarding Pass Style Ticket */}
        <div className="bg-[#fffcf8] border border-[#c5a059]/40 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
          {/* Top colored band */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#5d100a] to-[#c5a059]"></div>
          
          <div className="flex justify-between items-start border-b border-dashed border-[#c5a059]/30 pb-4 mb-4 mt-2">
            <div>
              <span className="bg-[#5d100a] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Swaxthika Tour Pass
              </span>
              <h4 className="text-base font-serif font-bold text-gray-900 mt-1.5">
                {booking.packageName}
              </h4>
            </div>
            
            <div className="text-right">
              <span className="text-[9px] text-gray-400 uppercase font-bold block">Pass Code</span>
              <span className="text-sm font-mono font-bold text-[#5d100a] bg-[#5d100a]/10 px-2 py-0.5 rounded-md border border-[#c5a059]/20">
                {booking.bookingId}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs mb-5">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">Primary Devotee</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-[#c5a059]" />
                {booking.userName}
              </span>
            </div>
            
            <div>
              <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">Tour Date</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                {new Date(booking.tourDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">Booked Seats</span>
              <span className="font-semibold text-gray-800 mt-0.5 block">
                {booking.numberOfSeats} Person{booking.numberOfSeats > 1 ? 's' : ''}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">Total Dakshina</span>
              <span className="font-bold text-[#5d100a] mt-0.5 block">
                ₹{booking.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {booking.selectedAddons && booking.selectedAddons.length > 0 && (
              <div className="col-span-2 border-t border-gray-100 pt-3">
                <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">Selected Add-ons</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {booking.selectedAddons.map((addon) => (
                    <span key={addon.id} className="bg-amber-50 text-amber-850 border border-amber-200/60 text-[9px] px-2 py-0.5 rounded font-bold">
                      {addon.name} (+₹{addon.price})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ticket Tear-off Divider */}
          <div className="relative flex items-center py-2">
            <div className="absolute -left-7 w-4 h-4 rounded-full bg-white border border-[#c5a059]/40 border-l-transparent"></div>
            <div className="w-full border-t border-dashed border-[#c5a059]/40"></div>
            <div className="absolute -right-7 w-4 h-4 rounded-full bg-white border border-[#c5a059]/40 border-r-transparent"></div>
          </div>

          {/* Code & QR Code display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs mt-3">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[9px] text-gray-400 uppercase font-bold block tracking-wider">Unique Onboarding Code</span>
              <span className="text-2xl font-mono font-extrabold text-[#5d100a] tracking-widest block bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                {booking.uniqueCode}
              </span>
              <p className="text-[9px] text-gray-500 pt-1 leading-tight max-w-[200px]">
                Enter this code or present the QR code at boarding point for check-in.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center p-2 bg-[#fffdfa] border border-[#c5a059]/20 rounded-xl shadow-3xs">
              <img
                src={booking.qrCodeUrl}
                alt="Verification QR Code"
                className="w-24 h-24 object-contain"
              />
              <span className="text-[9px] font-bold text-gray-500 mt-1">SCAN TO VERIFY</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 bg-white border border-[#5d100a] text-[#5d100a] py-3 rounded-xl font-bold text-xs hover:bg-[#fff8f5] cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Download Ticket</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 bg-[#5d100a] text-white py-3 rounded-xl font-bold text-xs hover:bg-opacity-95 cursor-pointer flex items-center justify-center gap-1 shadow-md border border-[#c5a059]/30"
          >
            <Check className="w-4 h-4 text-[#c5a059]" />
            <span>Proceed to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
