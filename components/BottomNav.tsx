
import React from 'react';
import { View, UserRole } from '../types';

interface Props {
  currentView: View;
  role: UserRole;
  onNavigate: (view: View) => void;
  onOpenQuickActions: () => void;
}

export const BottomNav: React.FC<Props> = ({ currentView, role, onNavigate, onOpenQuickActions }) => {
  const tabs = [
    { id: 'HOME', label: 'HOME', icon: 'home' },
    { id: 'SEARCH', label: 'EXPLORE', icon: 'explore' },
    { id: 'FAB', label: 'HOST', icon: 'add' }, // Central FAB Position
    { id: 'WISHLIST', label: 'WISHLIST', icon: 'favorite' },
    { id: 'PROFILE', label: 'PROFILE', icon: 'person' },
  ];

  const getIsActive = (tabId: string) => {
    if (currentView === tabId) return true;
    if (tabId === 'PROFILE') {
      return ['PROFILE', 'HOST_DASHBOARD', 'ADMIN_DASHBOARD', 'REFERRAL_DASHBOARD'].includes(currentView);
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 flex justify-between items-center px-2 py-3 safe-bottom z-50 max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        if (tab.id === 'FAB') {
          return (
            <div key="fab-container" className="flex-1 flex flex-col items-center justify-center -mt-8">
              <button 
                onClick={onOpenQuickActions}
                className="w-16 h-16 bg-primary text-slate-900 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-primary/30 border-4 border-white mb-1.5"
                aria-label="Host Actions"
              >
                <span className="material-symbols-outlined text-[32px] font-black">add</span>
              </button>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">HOST</span>
            </div>
          );
        }

        const isActive = getIsActive(tab.id);
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as View)}
            className="flex flex-col items-center justify-center space-y-1.5 flex-1 relative active:scale-95 transition-transform"
          >
            <span 
              className={`material-symbols-outlined text-[26px] transition-all duration-300 ${
                isActive ? 'text-primary' : 'text-slate-400'
              }`}
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-tight transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
              {tab.label}
            </span>
            {isActive && tab.id === 'HOME' && (
              <div className="absolute -bottom-3 w-1 h-1 bg-primary rounded-full animate-fadeIn" />
            )}
          </button>
        );
      })}
    </div>
  );
};
