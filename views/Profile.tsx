
import React, { useState } from 'react';
import { GuestProfile, UserRole, TrustBadge } from '../types';
import { BADGE_METADATA } from '../constants';
import { LowTrustBanner, TrustGrowthTooltip, VerificationExplanationTooltip, TrustBadgeSystem } from '../components/TrustComponents';

interface ProfileViewProps {
  guest: GuestProfile;
  currentRole: UserRole;
  onSetRole: (role: UserRole) => void;
  onVerify: () => void;
  onNavigateReferrals?: () => void;
  onPaymentsHelp?: () => void;
  onFAQs?: () => void;
  onPolicy?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ guest, currentRole, onSetRole, onVerify, onNavigateReferrals, onPaymentsHelp, onFAQs, onPolicy }) => {
  // Trust points now contribute 20% to the total index calculation (cap at 1000 points for full credit)
  const pointBonus = Math.min(20, (guest.trustPoints / 1000) * 20);
  const verificationProgress = Math.min(100, ((guest.verificationLevel / 3) * 80) + pointBonus);

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
          <div className="flex justify-between items-center px-1">
             <p className="text-[8px] font-black text-slate-400 uppercase">Verification Level {guest.verificationLevel}</p>
             <p className="text-[8px] font-black text-amber-600 uppercase">+{Math.round(pointBonus)}% from Trust Points</p>
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
        {/* Referral Entry Card */}
        <div 
          onClick={onNavigateReferrals}
          className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl active:scale-[0.98] transition-all cursor-pointer group"
        >
           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
           <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Vouch & Earn</p>
                 <h4 className="text-lg font-black leading-tight">Refer a Host</h4>
                 <p className="text-[10px] text-slate-400 font-medium">Earn points to grow your trust level.</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">
                📤
              </div>
           </div>
        </div>

        {/* Low Trust Alert Banner */}
        {guest.verificationLevel < 2 && (
          <LowTrustBanner onAction={onVerify} />
        )}

        {/* General Options */}
        <div className="space-y-2">
           <button 
             onClick={onPaymentsHelp}
             className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm active:scale-95 transition-all"
           >
             <div className="flex items-center gap-4">
                <span className="text-xl">💰</span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Payments Help</span>
             </div>
             <span className="text-slate-300">→</span>
           </button>

           <button 
             onClick={onFAQs}
             className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm active:scale-95 transition-all"
           >
             <div className="flex items-center gap-4">
                <span className="text-xl">❔</span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">FAQs & Policy</span>
             </div>
             <span className="text-slate-300">→</span>
           </button>
        </div>

        {/* Trust Badges Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <TrustGrowthTooltip>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 cursor-help">
                Trust & Identity Badges <span className="text-amber-500 text-[8px]">ⓘ</span>
              </h3>
            </TrustGrowthTooltip>
          </div>
          
          <TrustBadgeSystem badges={guest.badges} maxVisible={4} />

          {guest.badges.length < 6 && (
            <button 
              onClick={onVerify}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white border border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-amber-400 hover:text-amber-600 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">➕</span>
              <span className="text-[10px] font-black uppercase tracking-[0.1em]">Unlock More Community Badges</span>
            </button>
          )}
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
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trust Points</p>
             <p className="text-3xl font-black text-slate-900">{guest.trustPoints}</p>
             <p className="text-[9px] font-black text-amber-600 uppercase tracking-tighter">Community Proof</p>
          </div>
        </div>

        {/* Switch Context */}
        <div className="pt-4">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl relative overflow-hidden">
             <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-50 rounded-full blur-[80px] opacity-20"></div>
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
    </div>
  );
};
