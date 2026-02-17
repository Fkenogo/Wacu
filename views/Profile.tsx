import React from 'react';
import { GuestProfile, UserRole } from '../types';
import { LowTrustBanner, TrustGrowthTooltip, VerificationExplanationTooltip, TrustBadgeSystem } from '../components/TrustComponents';

interface ProfileViewProps {
  guest: GuestProfile;
  currentRole: UserRole;
  onSetRole: (role: UserRole) => void;
  onVerify: () => void;
  onNavigateStays: () => void;
  onNavigateReferrals?: () => void;
  onPaymentsHelp?: () => void;
  onFAQs?: () => void;
  onPolicy?: () => void;
  onNavigateAdmin?: () => void;
  onNavigateHost?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  guest, 
  onVerify, 
  onNavigateStays,
  onNavigateReferrals, 
  onPaymentsHelp, 
  onFAQs, 
  onNavigateAdmin,
  onNavigateHost
}) => {
  const pointBonus = Math.min(20, (guest.trustPoints / 1000) * 20);
  const verificationProgress = Math.min(100, ((guest.verificationLevel / 3) * 80) + pointBonus);
  const isAdmin = guest.role === UserRole.ADMIN;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 animate-fadeIn h-full pb-10">
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
            <div className="h-full bg-amber-500 rounded-full shadow-sm transition-all duration-1000" style={{ width: `${verificationProgress}%` }} />
          </div>
          {guest.verificationLevel < 2 && (
            <button onClick={onVerify} className="w-full py-2 text-[10px] font-black text-amber-600 uppercase tracking-widest text-center animate-pulse">Finish Level 2 Verification →</button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
        {/* Primary Utility Grid */}
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={onNavigateStays}
             className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all group"
           >
             <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">🎒</div>
             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">My Stays</p>
           </button>
           <button 
             onClick={onNavigateReferrals}
             className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all group"
           >
             <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">🎁</div>
             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Vouch & Earn</p>
           </button>
        </div>

        {isAdmin && (
          <button onClick={onNavigateAdmin} className="w-full flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] border-2 border-slate-800 shadow-xl active:scale-95 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">⚙️</div>
              <div className="text-left">
                <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Administrative Access</p>
                <h4 className="text-white font-black text-lg">System HQ</h4>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-white transition-colors">→</span>
          </button>
        )}

        {guest.verificationLevel < 2 && <LowTrustBanner onAction={onVerify} />}

        <div className="space-y-2">
           <button onClick={onPaymentsHelp} className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm active:scale-95 transition-all">
             <div className="flex items-center gap-4"><span className="text-xl">💰</span><span className="text-xs font-black text-slate-900 uppercase tracking-widest">Payments Help</span></div>
             <span className="text-slate-300">→</span>
           </button>
           <button onClick={onFAQs} className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm active:scale-95 transition-all">
             <div className="flex items-center gap-4"><span className="text-xl">❔</span><span className="text-xs font-black text-slate-900 uppercase tracking-widest">FAQs & Policy</span></div>
             <span className="text-slate-300">→</span>
           </button>
        </div>

        <div className="space-y-4">
          <TrustGrowthTooltip>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 cursor-help">Identity Badges <span className="text-amber-500 text-[8px]">ⓘ</span></h3>
          </TrustGrowthTooltip>
          <TrustBadgeSystem badges={guest.badges} maxVisible={4} />
        </div>

        <div className="pt-4">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl relative overflow-hidden">
             <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-50 rounded-full blur-[80px] opacity-20"></div>
             <h4 className="text-xl font-black relative z-10">Hosting Portal</h4>
             <p className="text-xs text-slate-400 font-medium relative z-10">Manage your listings and income.</p>
             <button onClick={onNavigateHost} className="w-full py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all relative z-10">Enter Host Dashboard</button>
           </div>
        </div>
      </div>
    </div>
  );
};