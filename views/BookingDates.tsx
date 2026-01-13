
import React from 'react';
import { Listing, BookingState } from '../types';

interface BookingDatesViewProps {
  listing: Listing;
  booking: BookingState;
  onUpdate: (updates: Partial<BookingState>) => void;
  onContinue: () => void;
}

export const BookingDatesView: React.FC<BookingDatesViewProps> = ({ listing, booking, onUpdate, onContinue }) => {
  // Simplified date picker for prototype
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="p-6 flex flex-col space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Choose your dates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Check-in</label>
            <input 
              type="date" 
              min={today}
              value={booking.startDate || today}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Check-out</label>
            <input 
              type="date" 
              min={booking.startDate || tomorrow}
              value={booking.endDate || tomorrow}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Who's coming?</h3>
        <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800 text-sm">Adults</p>
              <p className="text-xs text-gray-500">Ages 13+</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onUpdate({ adults: Math.max(1, booking.adults - 1) })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold"
              >-</button>
              <span className="w-4 text-center font-bold">{booking.adults}</span>
              <button 
                onClick={() => onUpdate({ adults: booking.adults + 1 })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold"
              >+</button>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <div>
              <p className="font-bold text-slate-800 text-sm">Children</p>
              <p className="text-xs text-gray-500">Ages 2–12</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onUpdate({ children: Math.max(0, booking.children - 1) })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold"
              >-</button>
              <span className="w-4 text-center font-bold">{booking.children}</span>
              <button 
                onClick={() => onUpdate({ children: booking.children + 1 })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="space-y-4">
        {booking.totalPrice > 0 && (
          <div className="flex justify-between items-baseline px-2">
            <span className="text-gray-600 font-medium">Estimated Total</span>
            <span className="text-xl font-bold text-slate-900">{booking.totalPrice.toLocaleString()} RWF</span>
          </div>
        )}
        <button 
          onClick={onContinue}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
