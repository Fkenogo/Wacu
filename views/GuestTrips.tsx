
import React, { useState } from 'react';
import { BookingState } from '../types';
import { HOUSE_RULES_TOOLTIPS } from '../constants';
import { TrustTooltip } from '../components/TrustComponents';

interface Props {
  trips: BookingState[];
  onExplore: () => void;
  onUpdateStatus: (id: string, status: BookingState['status']) => void;
  onReview: (id: string) => void;
  onSafetyCheck: (id: string, satisfied: boolean) => void;
  seenTooltips: Set<string>;
  onDismissTooltip: (id: string) => void;
}

export const GuestTripsView: React.FC<Props> = ({ trips, onExplore, onUpdateStatus, onReview, onSafetyCheck, seenTooltips, onDismissTooltip }) => {
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());

  const getStatusBadge = (trip: BookingState) => {
    switch (trip.status) {
      case 'ACTIVE_STAY': return <span className="bg-purple-100 text-purple-600 text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-sm">Active Stay</span>;
      case 'COMPLETED': return <span className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-sm">Completed</span>;
      case 'DISPUTED': return (
        <div className="flex items-center gap-1.5">
           <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-sm">Disputed</span>
           <TrustTooltip title="Under review" text="A payment issue is being checked by admin. Contact support via WhatsApp if you have proof of payment.">
             <span className="text-red-400 text-xs">⚠️</span>
           </TrustTooltip>
        </div>
      );
      default: return <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-sm">Confirmed</span>;
    }
  };

  const dismissReminder = (tripId: string, type: string) => {
    setDismissedReminders(prev => new Set(prev).add(`${tripId}-${type}`));
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn pb-10">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">My Stays</h2>
        <p className="text-slate-500 text-sm font-medium">View your past and upcoming stays.</p>
      </div>

      {trips.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center text-5xl">🎒</div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-800 text-lg">No stays booked yet</h3>
            <p className="text-sm text-gray-400 max-w-[200px] mx-auto leading-relaxed">Discover Rwanda and build your trust reputation by staying with verified hosts in their Wacus.</p>
          </div>
          <button 
            onClick={onExplore}
            className="bg-amber-50 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-100 active:scale-95 transition-all"
          >
            Start Exploring
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-5 animate-slideIn relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">History</p>
                  <h4 className="font-black text-slate-800 leading-tight">{trip.startDate} - {trip.endDate}</h4>
                  <p className="text-[10px] font-bold text-amber-600 uppercase mt-1">Host: {trip.hostName}</p>
                </div>
                {getStatusBadge(trip)}
              </div>

              {/* Automated Reminders Section for Active Stays */}
              {trip.status === 'ACTIVE_STAY' && (
                <div className="space-y-3 pt-2">
                   {!dismissedReminders.has(`${trip.id}-rules`) && (
                     <div className="bg-slate-900 text-white p-4 rounded-2xl border-l-4 border-amber-500 animate-slideIn relative group">
                        <button 
                          onClick={() => dismissReminder(trip.id!, 'rules')}
                          className="absolute top-2 right-2 text-slate-500 hover:text-white"
                        >✕</button>
                        <div className="flex items-start gap-3">
                           <span className="text-xl">🤖</span>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase tracking-widest text-amber-400">Wacu Bot • Stay Reminder</p>
                              <p className="text-[11px] font-bold leading-tight">Please remember: "No Smoking Indoors" is a strictly enforced rule at this Wacu.</p>
                           </div>
                        </div>
                     </div>
                   )}
                   
                   {!dismissedReminders.has(`${trip.id}-checkout`) && (
                     <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl animate-slideIn relative">
                        <button 
                          onClick={() => dismissReminder(trip.id!, 'checkout')}
                          className="absolute top-2 right-2 text-blue-300"
                        >✕</button>
                        <div className="flex items-start gap-3">
                           <span className="text-xl">⏰</span>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase tracking-widest text-blue-600">Automated Checkout Alert</p>
                              <p className="text-[11px] font-bold text-blue-900 leading-tight">Your Wacu stay ends tomorrow. Standard checkout is by 11:00 AM.</p>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              )}
              
              <div className="flex items-center gap-4 py-4 border-y border-gray-50">
                 <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🏠</div>
                 <div className="flex-1">
                   <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">Booking #{trip.id?.slice(-5)}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{trip.totalPrice?.toLocaleString()} RWF Total</p>
                 </div>
              </div>

              {trip.status === 'ACTIVE_STAY' && !trip.safetyCheckPerformed && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 space-y-3">
                   <p className="text-xs font-bold text-amber-900 uppercase tracking-tight">In-Stay Safety Check</p>
                   <p className="text-[10px] text-amber-800 leading-relaxed font-medium">Is everything okay with your stay so far?</p>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => onSafetyCheck(trip.id!, true)}
                        className="flex-1 bg-white border border-amber-200 text-amber-600 py-2 rounded-xl text-[10px] font-black uppercase active:scale-95"
                      >
                        Yes, all good
                      </button>
                      <button 
                        onClick={() => onSafetyCheck(trip.id!, false)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 shadow-md"
                      >
                        Need help
                      </button>
                   </div>
                </div>
              )}

              {trip.status === 'ACTIVE_STAY' && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => onUpdateStatus(trip.id!, 'DISPUTED')}
                    className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 border border-red-100"
                  >
                    Report Issue
                  </button>
                  <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-lg">Message Host</button>
                </div>
              )}

              {trip.status === 'COMPLETED' && !trip.guestReview?.submitted && (
                <div className="p-5 bg-amber-50 rounded-[2rem] border border-amber-100 space-y-4">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Build Community Trust</p>
                     <p className="text-xs font-bold text-amber-900 leading-tight">Review your stay to help other travelers and see what the host said about you.</p>
                   </div>
                   <button 
                     onClick={() => onReview(trip.id!)}
                     className="w-full bg-amber-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-md shadow-amber-200"
                   >
                     Review Host
                   </button>
                </div>
              )}

              {trip.status === 'DISPUTED' && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{HOUSE_RULES_TOOLTIPS.violation_reported.title}</p>
                    <TrustTooltip title={HOUSE_RULES_TOOLTIPS.trust_impact.title} text={HOUSE_RULES_TOOLTIPS.trust_impact.text}>
                      <span className="text-red-500 text-[10px] font-black">ⓘ</span>
                    </TrustTooltip>
                  </div>
                  <p className="text-xs text-red-900 font-medium italic">" {trip.disputeReason || "No details provided."} "</p>
                  <div className="bg-white/50 p-3 rounded-xl border border-red-100">
                    <p className="text-[9px] text-red-400 font-bold uppercase">{HOUSE_RULES_TOOLTIPS.payout_hold.title}</p>
                    <p className="text-[8px] text-red-300 font-medium mt-0.5">{HOUSE_RULES_TOOLTIPS.payout_hold.text}</p>
                  </div>
                </div>
              )}

              {trip.status === 'COMPLETED' && trip.guestReview?.submitted && (
                <div className="flex items-center justify-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 gap-3">
                   <span className="text-xl">🙌</span>
                   <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                     {trip.hostReview?.submitted ? 'Review Reveal Active' : 'Waiting for host review'}
                   </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
