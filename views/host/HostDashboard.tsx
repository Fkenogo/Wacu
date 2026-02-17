
import React, { useState, useEffect } from 'react';
import { HostListingState, BookingState } from '../../types';
import { db, auth } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

interface Props {
  listings: HostListingState[];
  requests: BookingState[];
  onUpdateStatus: (id: string, status: BookingState['status']) => void;
  onStartListing: () => void;
  onConfirmPayment: (id: string) => void;
}

type Tab = 'Overview' | 'Earnings' | 'Listings' | 'Bookings';

export const HostDashboard: React.FC<Props> = ({ listings, requests, onStartListing, onConfirmPayment }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const confirmedRequests = requests.filter(r => r.hostPaymentConfirmed);
  const pendingRequests = requests.filter(r => !r.hostPaymentConfirmed && r.status !== 'CANCELLED');
  const totalRevenue = confirmedRequests.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
  const pendingPayout = pendingRequests.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

  return (
    <div className="flex flex-col bg-[#F9FAFB] min-h-screen animate-fadeIn pb-32 overflow-y-auto no-scrollbar">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-primary/5">
            <img 
              src={auth.currentUser?.photoURL || "https://ui-avatars.com/api/?name=Host&background=f15a24&color=fff"} 
              className="w-full h-full object-cover" 
              alt="Avatar" 
            />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Host Mode</p>
            <h1 className="text-lg font-black text-slate-900 leading-none">Your Hub</h1>
          </div>
        </div>
        <button className="w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100">
          <span className="material-symbols-outlined text-slate-600">settings</span>
        </button>
      </header>

      <div className="px-5 space-y-6 mt-4">
        <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-orange-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Wallet Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{totalRevenue.toLocaleString()}</span>
              <span className="text-lg font-black opacity-80">RWF</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {(['Overview', 'Earnings', 'Listings', 'Bookings'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-7 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-lg shadow-orange-100' 
                  : 'bg-white text-slate-400 border border-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Smart Nudges</h3>
              <div className="space-y-3">
                {pendingRequests.filter(r => r.guestPaymentMarked).map(req => (
                  <div key={req.id} className="bg-white p-6 rounded-[2rem] border-l-4 border-primary shadow-sm flex gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">Payment Claimed</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                          {req.guestName} marked payment for {req.listingTitle}. Please confirm in your MoMo.
                        </p>
                      </div>
                      <button 
                        onClick={() => onConfirmPayment(req.id!)}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95"
                      >
                        Confirm Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Performance</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Guests</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">0</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Upcoming</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{pendingRequests.length}</p>
                  </div>
               </div>
            </div>

            <button 
              onClick={onStartListing}
              className="w-full py-6 rounded-[2rem] bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">add_circle</span>
              List New Property
            </button>
          </div>
        )}

        {activeTab === 'Bookings' && (
          <div className="space-y-4 animate-fadeIn pb-10">
            {requests.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white rounded-[2rem] border border-gray-100">
                <span className="text-4xl block">🎒</span>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No reservations found</p>
              </div>
            ) : (
              requests.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 relative group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">👤</div>
                       <div>
                          <h4 className="font-black text-slate-900 text-sm uppercase tracking-tighter">{req.guestName}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">{req.startDate} — {req.endDate}</p>
                       </div>
                    </div>
                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                      req.status === 'CONFIRMED' || req.hostPaymentConfirmed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                     <p className="text-xs font-bold text-slate-800 uppercase tracking-tighter truncate max-w-[180px]">{req.listingTitle}</p>
                     <p className="text-xs font-black text-primary">{req.totalPrice?.toLocaleString()} RWF</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
