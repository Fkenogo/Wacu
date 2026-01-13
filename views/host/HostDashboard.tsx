
import React from 'react';
import { HostListingState, BookingState, GuestProfile, UserRole, TrustBadge } from '../../types';
import { BADGE_METADATA } from '../../constants';
import { TrustBadgeItem } from '../../components/TrustComponents';

interface Props {
  listings: HostListingState[];
  requests: BookingState[];
  onUpdateStatus: (id: string, status: BookingState['status']) => void;
  onReleasePayout: (id: string) => void;
  onReviewGuest: (id: string) => void;
}

export const HostDashboard: React.FC<Props> = ({ listings, requests, onUpdateStatus, onReleasePayout, onReviewGuest }) => {
  const pendingApproval = requests.filter(r => r.status === 'PENDING_APPROVAL');
  const activeStays = requests.filter(r => r.status === 'CONFIRMED' || r.status === 'ACTIVE_STAY');
  
  const totalEarnings = requests
    .filter(r => r.status === 'COMPLETED' || r.status === 'ACTIVE_STAY')
    .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

  const myBadges: TrustBadge[] = ['Identity Verified', 'Contact Verified', 'Active Host', 'Community Trusted'];

  return (
    <div className="p-6 space-y-8 animate-fadeIn pb-24 h-full overflow-y-auto no-scrollbar">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">Hosting Hub</h2>
        <p className="text-slate-500 text-sm font-medium">Manage your local stays and trust economy.</p>
      </div>

      {/* Host Trust Profile */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white space-y-4 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
         <div className="flex justify-between items-center relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Your Trust Status</h3>
            <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded-full uppercase">Verified Host</span>
         </div>
         <div className="flex flex-wrap gap-2 relative z-10">
            {myBadges.map(badge => (
              <TrustBadgeItem key={badge} badge={badge} condensed />
            ))}
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-amber-200/40">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Earnings</p>
          <p className="text-2xl font-black mt-1 leading-none">{totalEarnings.toLocaleString()}</p>
          <p className="text-[10px] font-bold mt-1 opacity-60 uppercase">RWF Total</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Properties</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{listings.length || 1}</p>
          <p className="text-[9px] font-black text-emerald-500 uppercase mt-1 flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 100% Occupancy
          </p>
        </div>
      </div>

      {/* New Requests */}
      {pendingApproval.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs ml-1 flex items-center gap-2">
            New Requests 
            <span className="bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{pendingApproval.length}</span>
          </h3>
          <div className="space-y-4">
            {pendingApproval.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-slate-100/50 space-y-6 animate-slideIn">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <img src={req.guestProfile?.avatar} className="w-14 h-14 rounded-full border-2 border-amber-50 shadow-sm object-cover" alt="Guest" />
                    <div>
                      <p className="font-black text-slate-900 text-sm">{req.guestName || 'Guest Request'}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Level {req.guestProfile?.verificationLevel || 1} Identity</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-sm">{req.totalPrice?.toLocaleString()} RWF</p>
                  </div>
                </div>

                {/* Guest Trust Summary */}
                <div className="bg-slate-50 p-5 rounded-[1.5rem] space-y-3 border border-slate-100 shadow-inner">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guest Trust Stack</p>
                   <div className="flex flex-wrap gap-1.5">
                      {req.guestProfile?.badges.map(badge => (
                        <TrustBadgeItem key={badge} badge={badge} condensed />
                      ))}
                   </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => onUpdateStatus(req.id!, 'CONFIRMED')}
                    className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(req.id!, 'CANCELLED')}
                    className="flex-1 bg-gray-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
