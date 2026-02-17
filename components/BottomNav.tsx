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
    { id: 'HOME', label: 'Home', icon: '🏠' },
    { id: 'SEARCH', label: 'Explore', icon: '🔍' },
    { id: 'FAB', label: '', icon: '' }, // Central FAB Position
    { id: 'WISHLIST', label: 'Wishlist', icon: '❤️' },
    { id: 'PROFILE', label: 'Profile', icon: '👤' },
  ];

  const getIsActive = (tabId: string) => {
    if (currentView === tabId) return true;
    if (tabId === 'PROFILE') {
      return ['PROFILE', 'HOST_DASHBOARD', 'ADMIN_DASHBOARD', 'REFERRAL_DASHBOARD', 'GUEST_STAYS'].includes(currentView);
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-between items-center px-2 py-3 safe-bottom z-40 max-w-md mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
      {tabs.map((tab, idx) => {
        if (tab.id === 'FAB') {
          return (
            <div key="fab-container" className="flex-1 flex justify-center -mt-10">
              <button 
                onClick={onOpenQuickActions}
                className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center text-3xl shadow-[0_8px_20px_rgba(245,158,11,0.4)] active:scale-90 transition-all border-4 border-white"
                aria-label="Quick Actions"
              >
                <span className="mb-1">+</span>
              </button>
            </div>
          );
        }

        const isActive = getIsActive(tab.id);
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as View)}
            className="flex flex-col items-center justify-center space-y-1 group flex-1 relative h-10"
          >
            <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-30 group-active:scale-90'}`}>
              {tab.icon}
            </span>
            <span className={`text-[8px] font-black uppercase tracking-[0.1em] transition-colors ${isActive ? 'text-amber-600' : 'text-slate-400'}`}>
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-amber-500 rounded-full animate-fadeIn" />
            )}
          </button>
        );
      })}
    </div>
  );
};