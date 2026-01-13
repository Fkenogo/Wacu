
import React from 'react';
import { Listing, BookingState } from '../types';

interface ConfirmationViewProps {
  listing: Listing;
  booking: BookingState;
  onHome: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({ listing, booking, onHome }) => {
  const bookingId = `WACU-${Math.floor(Math.random() * 90000) + 10000}`;

  return (
    <div className="flex flex-col animate-slideUp bg-gray-50 min-h-full">
      {/* Success Hero */}
      <div className="bg-emerald-600 p-10 text-white text-center space-y-4">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl">
          ✓
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome to Your Wacu!</h2>
          <p className="text-emerald-100 mt-1 opacity-90 text-sm">Your place in {listing.landmark.split(' ').pop()} is waiting.</p>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-10">
        {/* Booking Card */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wacu Reference</p>
                <p className="text-lg font-mono font-black text-slate-800">{bookingId}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paid via MoMo</p>
                <p className="text-lg font-black text-emerald-600">{booking.totalPrice.toLocaleString()} RWF</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-50">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dates</p>
                <p className="font-bold text-slate-800 text-sm leading-tight">
                  {booking.startDate} to<br />{booking.endDate}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Wacu</p>
                <p className="font-bold text-slate-800 text-sm leading-tight">{listing.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Contact & Home */}
        <div className="space-y-3 pt-2">
          <button 
            className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group"
          >
            <span className="bg-emerald-500 p-1 rounded-full text-xs">💬</span>
            <span>Chat with Host on WhatsApp</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
          </button>
          
          <button 
            onClick={onHome}
            className="w-full bg-white text-slate-400 font-bold py-5 rounded-3xl border border-gray-100 shadow-sm active:scale-95 transition-all text-center"
          >
            Back to Wacu Home
          </button>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
};
