
import React, { useState } from 'react';
import { Listing, BookingState, GuestProfile, PropertyType } from '../types';
import { TrustBadgeItem, TrustTooltip } from '../components/TrustComponents';
import { HOUSE_RULES_TOOLTIPS } from '../constants';

interface BookingSummaryViewProps {
  listing: Listing;
  booking: BookingState;
  guest: GuestProfile;
  onUpdate: (updates: Partial<BookingState>) => void;
  onContinue: (needsVerification: boolean) => void;
  onNavigateToVerify: () => void;
}

export const BookingSummaryView: React.FC<BookingSummaryViewProps> = ({ listing, booking, guest, onUpdate, onContinue, onNavigateToVerify }) => {
  const [showFullRules, setShowFullRules] = useState(false);
  const nights = booking.startDate && booking.endDate 
    ? Math.max(1, Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24)))
    : 1;

  const basePrice = listing.pricePerNight * nights;
  const serviceFee = 2000;
  const total = basePrice + serviceFee;

  const isHighRiskType = listing.type === PropertyType.FAMILY_HOMESTAY || listing.type === PropertyType.SHARED_HOME;
  const hasPhoneBadge = guest.badges.includes('Contact Verified');
  const hasIdentityBadge = guest.badges.includes('Identity Verified');
  const meetBaseTrust = hasPhoneBadge && hasIdentityBadge;
  const trustBlocked = isHighRiskType && !meetBaseTrust && !booking.adminTrustOverride;
  const needsLevel2 = (isHighRiskType || nights > 5 || (booking.adults + booking.children) > 3) && guest.verificationLevel < 2;

  const activeRules = listing.rules.filter(r => r.enabled);

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

      {/* Host Credentials */}
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

      {/* Rules & Safety Pledge */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Safety & Rules</h3>
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">House Rules Summary</h4>
                <TrustTooltip title={HOUSE_RULES_TOOLTIPS.general.title} text={HOUSE_RULES_TOOLTIPS.general.text}>
                  <span className="text-amber-500 text-[10px] font-black">ⓘ</span>
                </TrustTooltip>
              </div>
              <button 
                onClick={() => setShowFullRules(!showFullRules)}
                className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter"
              >
                {showFullRules ? 'Hide Details' : 'View Full Rules'}
              </button>
            </div>
            
            <div className="space-y-3">
              {activeRules.slice(0, 3).map(rule => (
                <div key={rule.id} className="flex items-start gap-3">
                  <span className="text-xs">📜</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-700">{rule.label}</p>
                      {HOUSE_RULES_TOOLTIPS[rule.id] && (
                        <TrustTooltip title={HOUSE_RULES_TOOLTIPS[rule.id].title} text={HOUSE_RULES_TOOLTIPS[rule.id].text}>
                          <span className="text-amber-500 text-[8px] font-black">ⓘ</span>
                        </TrustTooltip>
                      )}
                    </div>
                    {showFullRules && rule.note && <p className="text-[9px] text-slate-400 mt-0.5">{rule.note}</p>}
                  </div>
                </div>
              ))}
              {activeRules.length > 3 && !showFullRules && (
                <p className="text-[9px] font-bold text-slate-300 ml-7">+ {activeRules.length - 3} more rules...</p>
              )}
            </div>
          </div>

          {/* Guest Request Field */}
          <div className="space-y-2 pt-4 border-t border-gray-50">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest request (optional)</label>
            <textarea 
              value={booking.guestRequest}
              onChange={(e) => onUpdate({ guestRequest: e.target.value })}
              maxLength={200}
              placeholder="Short note for the host..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-medium outline-none focus:ring-1 focus:ring-amber-300 resize-none"
              rows={2}
            />
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
                 I have read and agree to the house rules. By booking you confirm you can comply with these rules.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Price details */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Price details</h3>
        <div className="space-y-3 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-sm">
          <div className="flex justify-between items-center text-slate-600">
            <span>{listing.pricePerNight.toLocaleString()} RWF x {nights} nights</span>
            <span>{basePrice.toLocaleString()} RWF</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Service fee</span>
            <span>{serviceFee.toLocaleString()} RWF</span>
          </div>
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
