
import React, { useState } from 'react';
import { GuestProfile, UserRole, TrustBadge } from '../types';
import { BADGE_METADATA } from '../constants';
import { LowTrustBanner, TrustGrowthTooltip, VerificationExplanationTooltip, TrustBadgeItem } from '../components/TrustComponents';

interface ProfileViewProps {
  guest: GuestProfile;
  currentRole: UserRole;
  onSetRole: (role: UserRole) => void;
  onVerify: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ guest, currentRole, onSetRole, onVerify }) => {
  const [showAllBadges, setShowAllBadges] = useState(false);

  const verificationProgress = (guest.verificationLevel / 3) * 100;
  const displayedBadges = guest.badges.slice(0, 4);
  const remainingCount = Math.max(0, guest.badges.length - 4);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 animate-fadeIn h-full pb-10">
      {/* Header Profile Section */}
      <div className="bg-white px-8 pt-12 pb-8 rounded-b-[3rem] shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full -mr-24 -mt-24 blur-3xl opacity-50"></div>
        
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="relative">
            <img src={guest.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover" alt="Profile" />
            <div className="absolute bottom-1 right-1 bg-amber-500 text-white p-2 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-xs font-black">
              L{guest.verificationLevel}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{guest.name}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{guest.phone}</p>
          </div>
        </div>

        {/* Verification Progress Bar */}
        <div className="space-y-3 pt-4">
          <div className="flex justify-between items-center px-1">
            <VerificationExplanationTooltip>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1 cursor-help">
                Internal Trust Index <span className="text-amber-500 text-[8px]">ⓘ</span>
              </span>
            </VerificationExplanationTooltip>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{Math.round(verificationProgress)}% Verified</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner p-0.5">
            <div 
              className="h-full bg-amber-500 rounded-full shadow-sm transition-all duration-1000"
              style={{ width: `${verificationProgress}%` }}
            />
          </div>
          {guest.verificationLevel < 2 && (
            <button 
              onClick={onVerify}
              className="w-full py-2 text-[10px] font-black text-amber-600 uppercase tracking-widest text-center animate-pulse"
            >
              Finish Level 2 Verification to Host →
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
        {/* Low Trust Alert Banner */}
        {guest.verificationLevel < 2 && (
          <LowTrustBanner onAction={onVerify} />
        )}

        {/* Trust Badges Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <TrustGrowthTooltip>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 cursor-help">
                Trust & Identity Badges <span className="text-amber-500 text-[8px]">ⓘ</span>
              </h3>
            </TrustGrowthTooltip>
            {remainingCount > 0 && (
              <button 
                onClick={() => setShowAllBadges(true)}
                className="text-[10px] font-black text-amber-600 uppercase"
              >
                View All (+{remainingCount})
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayedBadges.map(badge => (
              <TrustBadgeItem key={badge} badge={badge} />
            ))}
            <button 
              onClick={onVerify}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100/50 border border-dashed border-gray-200 rounded-2xl text-slate-400 hover:border-amber-400 transition-all"
            >
              <span className="text-xl opacity-30">➕</span>
              <span className="text-[10px] font-black uppercase tracking-tight">Earn More Badges</span>
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stays Booked</p>
             <p className="text-3xl font-black text-slate-900">{guest.completedStays}</p>
             <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 100% Reliability
             </p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommendation</p>
             <p className="text-3xl font-black text-slate-900">{guest.hostRecommendationRate}%</p>
             <p className="text-[9px] font-black text-amber-600 uppercase tracking-tighter">Community Proof</p>
          </div>
        </div>

        {/* Switch Context */}
        <div className="pt-4">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl relative overflow-hidden">
             <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-500 rounded-full blur-[80px] opacity-20"></div>
             <h4 className="text-xl font-black relative z-10">Switch Context</h4>
             <p className="text-xs text-slate-400 font-medium relative z-10">Toggle between guest exploring and host dashboard.</p>
             <div className="flex gap-2 relative z-10">
                <button 
                  onClick={() => onSetRole(UserRole.GUEST)}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentRole === UserRole.GUEST ? 'bg-white text-slate-900 shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  Guest
                </button>
                <button 
                  onClick={() => onSetRole(UserRole.HOST)}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentRole === UserRole.HOST ? 'bg-amber-500 text-white shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  Host
                </button>
             </div>
           </div>
        </div>
      </div>

      {/* View All Badges Modal */}
      {showAllBadges && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAllBadges(false)} />
          <div className="relative bg-white rounded-t-[3rem] p-8 space-y-8 animate-slideUp safe-bottom shadow-[0_-20px_50px_rgba(0,0,0,0.1)] max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto -mt-2" />
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Your Trust Network</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Badges: {guest.badges.length}</p>
            </div>
            
            <div className="space-y-4">
               {guest.badges.map(badge => (
                  <div key={badge} className="flex items-start gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <span className="text-3xl">{BADGE_METADATA[badge].icon}</span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{badge}</h4>
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{BADGE_METADATA[badge].microcopy}</p>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed italic mt-2">
                        "{BADGE_METADATA[badge].tooltip}"
                      </p>
                    </div>
                  </div>
               ))}
            </div>
            
            <button 
              onClick={() => setShowAllBadges(false)}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl"
            >
              Back to Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
