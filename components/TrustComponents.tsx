
import React, { useState } from 'react';
import { TrustBadge } from '../types';
import { BADGE_METADATA } from '../constants';

interface TooltipProps {
  title: string;
  text: string;
  children: React.ReactNode;
}

export const TrustTooltip: React.FC<TooltipProps> = ({ title, text, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white w-full max-w-xs rounded-[2.5rem] p-8 text-center space-y-4 shadow-2xl animate-slideUp">
             <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-blue-100">
               🛡️
             </div>
             <div className="space-y-2">
               <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{title}</h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                 "{text}"
               </p>
             </div>
             <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
             >
               Got it
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const TrustBadgeItem: React.FC<{ badge: TrustBadge, condensed?: boolean }> = ({ badge, condensed = false }) => {
  const meta = BADGE_METADATA[badge];
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowTooltip(true)}
        className={`flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl shadow-sm active:scale-95 transition-all text-left group ${condensed ? 'px-2 py-1' : ''}`}
      >
        <span className={`${condensed ? 'text-sm' : 'text-xl'}`}>{meta.icon}</span>
        {!condensed && (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{badge}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{meta.microcopy}</span>
          </div>
        )}
      </button>

      {showTooltip && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowTooltip(false)} />
          <div className="relative bg-white w-full max-w-xs rounded-[2.5rem] p-8 text-center space-y-4 shadow-2xl animate-slideUp">
             <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-slate-100">
               {meta.icon}
             </div>
             <div className="space-y-2">
               <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{badge}</h4>
               <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{meta.microcopy}</p>
               <p className="text-xs text-slate-500 font-medium leading-relaxed italic mt-2">
                 "{meta.tooltip}"
               </p>
             </div>
             <button 
              onClick={() => setShowTooltip(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
             >
               Got it
             </button>
          </div>
        </div>
      )}
    </>
  );
};

export const VerificationExplanationTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TrustTooltip 
    title="Why verification?" 
    text="Verification helps confirm real people are using the platform. It reduces fraud, improves safety, and builds confidence for both hosts and guests."
  >
    {children}
  </TrustTooltip>
);

export const TrustGrowthTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TrustTooltip 
    title="Trust grows with use" 
    text="Your trust level increases as you complete stays, receive reviews, and keep your account in good standing."
  >
    {children}
  </TrustTooltip>
);

export const PrivateChecksTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TrustTooltip 
    title="Private checks" 
    text="Some safety checks happen in the background and are not visible to other users."
  >
    {children}
  </TrustTooltip>
);

export const LowTrustBanner: React.FC<{ onAction?: () => void }> = ({ onAction }) => (
  <div 
    onClick={onAction}
    className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-5 flex items-start gap-4 shadow-sm animate-fadeIn cursor-pointer hover:bg-amber-100 transition-colors"
  >
    <span className="text-2xl mt-1">⚡</span>
    <p className="text-xs text-amber-900 font-bold leading-relaxed uppercase tracking-tight">
      Complete more verification steps to increase your trust level and unlock more bookings.
    </p>
  </div>
);
