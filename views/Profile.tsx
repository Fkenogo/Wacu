
import React from 'react';
import { GuestProfile, UserRole } from '../types';
import { auth } from '../firebase';
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

interface ProfileViewProps {
  guest: GuestProfile;
  currentRole: UserRole;
  onSetRole: (role: UserRole) => void;
  onVerify: () => void;
  onNavigateStays: () => void;
  onNavigateReferrals?: () => void;
  onNavigateAdmin?: () => void;
  onNavigateHost?: () => void;
  onBack: () => void;
}

const MenuItem: React.FC<{ icon: string; label: string; onClick?: () => void; isRed?: boolean }> = ({ icon, label, onClick, isRed }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white border-b border-gray-50 active:bg-gray-50 transition-all group last:border-b-0"
  >
    <div className="flex items-center gap-4">
      <span className={`material-symbols-outlined text-[20px] ${isRed ? 'text-rose-500' : 'text-primary'}`}>
        {icon}
      </span>
      <span className={`text-[15px] font-semibold ${isRed ? 'text-rose-500' : 'text-slate-800'}`}>
        {label}
      </span>
    </div>
    {!isRed && <span className="material-symbols-outlined text-gray-300 text-lg group-hover:translate-x-0.5 transition-transform">chevron_right</span>}
  </button>
);

const SectionTitle: React.FC<{ label: string }> = ({ label }) => (
  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-2 mb-3 mt-8">
    {label}
  </h3>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  guest, 
  onVerify, 
  onNavigateStays,
  onNavigateReferrals, 
  onNavigateAdmin,
  onNavigateHost,
  onBack,
  onSetRole
}) => {
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await signOut(auth);
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] animate-fadeIn pb-32 overflow-y-auto no-scrollbar">
      {/* 1. Header Navigation */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-transparent">
        <button 
          onClick={onBack}
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-slate-900">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Profile</h1>
        <button 
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-slate-700">settings</span>
        </button>
      </header>

      {/* 2. User Hero Section */}
      <div className="flex flex-col items-center mt-6 space-y-4">
        <div className="relative">
          <div className="w-[124px] h-[124px] rounded-full border-[5px] border-primary p-0.5 shadow-xl bg-white overflow-hidden">
            <img 
              src={guest.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(guest.name || 'W')}&background=F59E0B&color=fff`} 
              className="w-full h-full rounded-full object-cover" 
              alt="Avatar" 
            />
          </div>
          <div className="absolute bottom-2 right-0 w-8 h-8 bg-primary border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
             <span className="material-symbols-outlined text-sm font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">{guest.name || 'Wacu'}</h2>
          <p className="text-slate-400 text-sm font-medium mt-2">Member since April 2023 • Verified</p>
        </div>
      </div>

      <div className="px-6 space-y-6 mt-10">
        {/* 3. Payment Identity Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-7 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-7 right-7 w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center">
             <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Payment Identity</p>
            <div className="flex items-center gap-1.5 pt-1">
              <h4 className="text-base font-bold text-slate-900 leading-none">MTN MoMo Linked</h4>
              <span className="material-symbols-outlined text-primary text-[16px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>

          <div className="bg-gray-50/80 p-4 rounded-[1.5rem] border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-inner">
                <span className="font-black text-[10px] text-white tracking-tighter">MoMo</span>
             </div>
             <div className="flex-1">
                <p className="text-lg font-bold text-slate-900 leading-none">+250 78X XXX XXX</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Verified Payment Account</p>
             </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-amber-50 text-primary font-bold text-sm border border-amber-100/50 active:scale-95 transition-all">
             Manage Payment Methods
          </button>
        </div>

        {/* 4. Switch to Host Mode Button */}
        <button 
          onClick={onNavigateHost}
          className="w-full py-6 rounded-[2rem] bg-primary text-[#1d180c] font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all border-b-4 border-amber-600"
        >
          <span className="material-symbols-outlined font-black">swap_horiz</span>
          Switch to Host Mode
        </button>

        {/* 5. Menu Sections */}
        <div className="space-y-4">
          <div>
            <SectionTitle label="Account" />
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <MenuItem icon="person" label="Personal Information" />
              <MenuItem icon="wallet" label="Payments & Payouts" />
              <MenuItem icon="notifications" label="Notifications" />
            </div>
          </div>

          <div>
            <SectionTitle label="Safety" />
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <MenuItem icon="shield" label="Login & Security" />
              <MenuItem icon="privacy_tip" label="Privacy & Sharing" />
              <MenuItem icon="contact_emergency" label="Emergency Contacts" />
            </div>
          </div>

          <div>
            <SectionTitle label="Community" />
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <MenuItem icon="help" label="Support Center" />
              <MenuItem icon="person_add" label="Invite Friends" onClick={onNavigateReferrals} />
            </div>
          </div>
        </div>

        {/* 6. Logout and Version */}
        <div className="pt-8 flex flex-col items-start gap-4">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 text-rose-500 font-bold px-2 active:scale-95 transition-all"
           >
             <span className="material-symbols-outlined font-bold">logout</span>
             <span>Log Out</span>
           </button>
           <p className="text-[10px] font-bold text-slate-300 px-2">Version 2.4.1 (2024)</p>
        </div>
      </div>
    </div>
  );
};
