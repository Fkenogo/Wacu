
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

export const ContextualNudge: React.FC<{
  id: string;
  icon: string;
  title: string;
  text: string;
  seenTooltips: Set<string>;
  onDismiss: (id: string) => void;
  variant?: 'amber' | 'slate' | 'blue';
}> = ({ id, icon, title, text, seenTooltips, onDismiss, variant = 'amber' }) => {
  if (seenTooltips.has(id)) return null;

  const bgStyles = {
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    slate: 'bg-slate-900 border-slate-700 text-white',
    blue: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  const titleStyles = {
    amber: 'text-amber-600',
    slate: 'text-amber-400',
    blue: 'text-blue-600'
  };

  return (
    <div className={`${bgStyles[variant]} border-2 p-5 rounded-[2rem] shadow-lg animate-slideDown space-y-3 relative overflow-hidden group`}>
      <button 
        onClick={() => onDismiss(id)}
        className="absolute top-4 right-4 text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-opacity"
      >
        Got it
      </button>
      <div className="flex items-start gap-4">
        <span className="text-2xl mt-1">{icon}</span>
        <div className="space-y-1 pr-8">
          <h4 className={`text-[10px] font-black uppercase tracking-widest ${titleStyles[variant]}`}>{title}</h4>
          <p className="text-[11px] font-bold leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
};

export const TrustBadgeItem: React.FC<{ badge: TrustBadge, condensed?: boolean, showLabel?: boolean }> = ({ badge, condensed = false, showLabel = true }) => {
  const meta = BADGE_METADATA[badge];
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <button 
        onClick={(e) => { e.stopPropagation(); setShowTooltip(true); }}
        className={`flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl shadow-sm active:scale-95 transition-all text-left group ${condensed ? 'px-2 py-1' : 'hover:border-amber-200 hover:bg-amber-50/30'}`}
      >
        <span className={`${condensed ? 'text-sm' : 'text-xl'}`}>{meta.icon}</span>
        {showLabel && (
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate">{badge}</span>
            {!condensed && (
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate">{meta.microcopy}</span>
            )}
          </div>
        )}
      </button>

      {showTooltip && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 animate-fadeIn">
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
               Understood
             </button>
          </div>
        </div>
      )}
    </>
  );
};

interface TrustBadgeSystemProps {
  badges: TrustBadge[];
  variant?: 'grid' | 'stack' | 'condensed';
  maxVisible?: number;
}

export const TrustBadgeSystem: React.FC<TrustBadgeSystemProps> = ({ badges, variant = 'grid', maxVisible = 6 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleBadges = isExpanded ? badges : badges.slice(0, maxVisible);
  const hiddenCount = badges.length - maxVisible;

  if (badges.length === 0) return null;

  if (variant === 'stack') {
    return (
      <div className="flex -space-x-2 overflow-hidden items-center">
        {badges.slice(0, 4).map((badge) => (
          <div key={badge} className="relative group">
            <TrustBadgeItem badge={badge} condensed showLabel={false} />
          </div>
        ))}
        {badges.length > 4 && (
          <div className="w-8 h-8 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm ml-2">
            +{badges.length - 4}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'condensed') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {badges.map(badge => (
          <TrustBadgeItem key={badge} badge={badge} condensed />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {visibleBadges.map((badge) => (
          <TrustBadgeItem key={badge} badge={badge} />
        ))}
        {!isExpanded && hiddenCount > 0 && (
          <button 
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Show {hiddenCount} More Trust Badges
          </button>
        )}
      </div>
    </div>
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
