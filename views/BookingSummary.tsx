
import React from 'react';
import { Listing, BookingState, GuestProfile, PropertyType, TrustBadge } from '../types';
import { TrustBadgeItem } from '../components/TrustComponents';

interface BookingSummaryViewProps {
  listing: Listing;
  booking: BookingState;
  guest: GuestProfile;
  onUpdate: (updates: Partial<BookingState>) => void;
  onContinue: (needsVerification: boolean) => void;
  onNavigateToVerify: () => void;
}

export const BookingSummaryView: React.FC<BookingSummaryViewProps> = ({ listing, booking, guest, onUpdate, onContinue, onNavigateToVerify }) => {
  const nights = booking.startDate && booking.endDate 
    ? Math.max(1, Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24)))
    : 1;

  const basePrice = listing.pricePerNight * nights;
  const serviceFee = 2000;
  const total = basePrice + serviceFee;

  // SYSTEM TRUST RULES
  const isHighRiskType = listing.type === PropertyType.FAMILY_HOMESTAY || listing.type === PropertyType.SHARED_HOME;
  
  const hasPhoneBadge = guest.badges.includes('Contact Verified');
  const hasIdentityBadge = guest.badges.includes('Identity Verified');
  
  const meetBaseTrust = hasPhoneBadge && hasIdentityBadge;
  const trustBlocked = isHighRiskType && !meetBaseTrust && !booking.adminTrustOverride;

  const needsLevel2 = (isHighRiskType || nights > 5 || (booking.adults + booking.children) > 3) && guest.verificationLevel < 2;

  return (
    <div className="p-6 flex flex-col space-y-6 animate-fadeIn pb-24 h-full overflow-y-auto no-scrollbar">
      {/* Mini Listing Card */}
      <div className="flex space-x-4 items-center p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <img src={listing.image} alt={listing.title} className="w-24 h-24 rounded-2xl object-cover shadow-inner" />
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-slate-800 text-sm truncate">{listing.title}</h4>
          <p className="text-xs text-gray-400 mt-1 font-bold">📍 {listing.landmark}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-black text-amber-600">★ {listing.rating}</span>
            <span className="text-[10px] text-gray-300">|</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{listing.type}</span>
          </div>
        </div>
      </div>

      {/* Host Credentials (Guest View) */}
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <img src={listing.hostAvatar} className="w-10 h-10 rounded-full border-2 border-white/20" alt="Host" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Wacu Credentials</p>
            <p className="text-sm font-bold">{listing.hostName}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {listing.hostTrustBadges?.map(badge => (
            <TrustBadgeItem key={badge} badge={badge} condensed />
          ))}
        </div>
      </div>

      {/* Trust Constraint Block */}
      <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-6 space-y-4 shadow-sm animate-fadeIn">
        <div className="flex items-start gap-4">
           <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl shrink-0">🚫</div>
           <div className="space-y-1">
             <h4 className="text-sm font-black text-red-900 uppercase">Wacu Protocol Incomplete</h4>
             <p className="text-xs text-red-800 font-medium leading-relaxed">
               As this is a <strong>{listing.type}</strong>, we require guests to have a verified identity footprint to join our Wacu family.
             </p>
           </div>
        </div>
        <div className="grid grid-cols-1 gap-3 pt-2">
           <button 
              onClick={onNavigateToVerify}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${hasPhoneBadge ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-red-100 text-slate-600 active:scale-95 shadow-sm'}`}
           >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest">Contact Verified</span>
              </div>
              <span className="font-black">{hasPhoneBadge ? '✓' : '!'}</span>
           </button>
           
           <button 
              onClick={onNavigateToVerify}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${hasIdentityBadge ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-red-100 text-slate-600 active:scale-95 shadow-sm'}`}
           >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest">Identity Verified</span>
              </div>
              <span className="font-black">{hasIdentityBadge ? '✓' : '!'}</span>
           </button>
        </div>
      </div>

      {/* Rules & Safety Pledge */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Safety & Rules</h3>
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wacu Community Rules</h4>
              <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Pledge Required</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs">🚭</span>
                <span className="text-xs font-medium text-slate-700">No smoking inside the Wacu</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs">🔇</span>
                <span className="text-xs font-medium text-slate-700">Respect the neighborhood (10PM Curfew)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 flex items-start gap-4">
             <button
               onClick={() => onUpdate({ rulesAcknowledged: !booking.rulesAcknowledged })}
               className={`w-8 h-8 rounded-xl shrink-0 border-2 transition-all flex items-center justify-center text-white ${
                 booking.rulesAcknowledged ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'
               }`}
             >
               {booking.rulesAcknowledged && '✓'}
             </button>
             <div className="space-y-1">
               <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">Wacu Community Pledge</p>
               <p className="text-[9px] text-slate-400 leading-tight">
                 I agree to treat this home as Wacu (our place) and follow all community guidelines.
               </p>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Price details</h3>
        <div className="space-y-3 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-sm">
          <div className="flex justify-between pt-4 border-t border-gray-100 text-base">
            <span className="font-black text-slate-900">Total (RWF)</span>
            <span className="font-black text-slate-900 text-lg">{total.toLocaleString()} RWF</span>
          </div>
        </div>
      </div>

      <button 
        disabled={!booking.rulesAcknowledged}
        onClick={() => trustBlocked ? onNavigateToVerify() : onContinue(needsLevel2)}
        className={`w-full font-black py-5 rounded-[1.5rem] shadow-xl active:scale-95 transition-all mt-4 uppercase tracking-[0.2em] text-xs ${
          booking.rulesAcknowledged ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {trustBlocked ? 'Complete Wacu Protocol →' : (needsLevel2 ? 'Verify My Identity' : 'Proceed to Payment')}
      </button>
    </div>
  );
};
