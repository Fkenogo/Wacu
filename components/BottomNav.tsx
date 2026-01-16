
import React from 'react';
import { View, UserRole } from '../types';

interface Props {
  currentView: View;
  role: UserRole;
  onNavigate: (view: View) => void;
}

export const BottomNav: React.FC<Props> = ({ currentView, role, onNavigate }) => {
  const getTabs = () => {
    switch (role) {
      case UserRole.HOST:
        return [
          { id: 'HOME', label: 'Explore', icon: '🔍' },
          { id: 'HOST_DASHBOARD', label: 'Hosting', icon: '🏠' },
          { id: 'PROFILE', label: 'Profile', icon: '👤' },
        ];
      case UserRole.VERIFIER:
        return [
          { id: 'HOME', label: 'Explore', icon: '🔍' },
          { id: 'VERIFIER_DASHBOARD', label: 'Verify', icon: '🛡️' },
        ];
      case UserRole.ADMIN:
        return [
          { id: 'HOME', label: 'Explore', icon: '🔍' },
          { id: 'ADMIN_DASHBOARD', label: 'System', icon: '⚙️' },
        ];
      default:
        return [
          { id: 'HOME', label: 'Explore', icon: '🔍' },
          { id: 'WISHLIST', label: 'Wishlist', icon: '❤️' },
          { id: 'GUEST_STAYS', label: 'Stays', icon: '🎒' },
          { id: 'PROFILE', label: 'Profile', icon: '👤' },
        ];
    }
  };

  const tabs = getTabs();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center px-4 py-3 safe-bottom z-40 max-w-md mx-auto shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as View)}
            className="flex flex-col items-center justify-center space-y-1 group"
          >
            <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-active:scale-90 opacity-60'}`}>
              {tab.icon}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-amber-600' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
