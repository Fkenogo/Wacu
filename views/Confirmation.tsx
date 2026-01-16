
import React from 'react';
import { Listing, BookingState } from '../types';
import { ContextualNudge } from '../components/TrustComponents';

interface ConfirmationViewProps {
  listing: Listing;
  booking: BookingState;
  onHome: () => void;
  seenTooltips: Set<string>;
  onDismissTooltip: (id: string) => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({ 
  listing, 
  booking, 
  onHome,
  seenTooltips,
  onDismissTooltip
}) => {
  const bookingId = `WACU-${Math.floor(Math.random() * 90000) + 10000}`;

  return (
    <div className="flex flex-col animate-slideUp bg-gray-50 min-h-full">
      {/* Success Hero */}
      <div className={`${booking.guestPaymentMarked ? 'bg-amber-500' : 'bg-emerald-600'} p-10 text-white text-center space-y-4`}>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl">
          {booking.guestPaymentMarked ? '⏳' : '✓'}
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter">
            {booking.guestPaymentMarked ? 'Yambi. Payment received' : 'Yambi. Your Wacu is confirmed'}
          </h2>
          <p className="mt-2 opacity-90 text-sm font-medium">
            {booking.guestPaymentMarked ? 'The host has been notified. Enjoy your stay.' : 'Your host has been notified. Check messages for next steps.'}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-10">
        <ContextualNudge 
          id="guest_trust_matters"
          icon="🤝"
          title="Trust matters"
          text="Honest payments help keep the community safe. Your reliability score has been updated."
          seenTooltips={seenTooltips}
          onDismiss={onDismissTooltip}
          variant="blue"
        />

        {/* Booking Card */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wacu Reference</p>
                <p className="text-lg font-mono font-black text-slate-800">{bookingId}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Status</p>
                <p className={`text-lg font-black ${booking.guestPaymentMarked ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {booking.guestPaymentMarked ? 'Processing' : 'Confirmed'}
                </p>
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

            {booking.guestPaymentMarked && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                 <span className="text-xl">ℹ️</span>
                 <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                   Once the host confirms receipt of your MoMo transfer, your booking status will update automatically.
                 </p>
              </div>
            )}
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
