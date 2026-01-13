
import React, { useState } from 'react';
import { Listing, BookingState } from '../../types';

interface Props {
  listings: Listing[];
  trips: BookingState[];
  requests: BookingState[];
  onUpdateStatus: (id: string, status: BookingState['status']) => void;
}

export const AdminDashboard: React.FC<Props> = ({ listings, trips, requests, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PAYOUTS' | 'DISPUTES'>('OVERVIEW');

  const disputedTrips = requests.filter(t => t.status === 'DISPUTED');
  const escrowTotal = requests
    .filter(t => ['CONFIRMED', 'ACTIVE_STAY', 'DISPUTED'].includes(t.status))
    .reduce((sum, t) => sum + (t.totalPrice || 0), 0);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>
          <p className="text-slate-500 text-sm">HQ Command Center 🇷🇼</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl">
        {(['OVERVIEW', 'PAYOUTS', 'DISPUTES'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-gray-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-5 rounded-3xl text-white shadow-lg">
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Escrow Balance</p>
              <p className="text-xl font-black mt-1">{escrowTotal.toLocaleString()} RWF</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Disputes</p>
              <p className={`text-xl font-black mt-1 ${disputedTrips.length > 0 ? 'text-red-500' : 'text-slate-900'}`}>{disputedTrips.length}</p>
            </div>
          </div>

          <section className="space-y-4">
             <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[11px] ml-1">Marketplace Health</h3>
             <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
               <div className="p-4 flex justify-between items-center">
                 <span className="text-xs font-medium text-slate-600">Total Listings</span>
                 <span className="text-xs font-bold text-slate-900">{listings.length}</span>
               </div>
               <div className="p-4 flex justify-between items-center">
                 <span className="text-xs font-medium text-slate-600">MTN Success Rate</span>
                 <span className="text-xs font-bold text-emerald-500">98.2%</span>
               </div>
               <div className="p-4 flex justify-between items-center">
                 <span className="text-xs font-medium text-slate-600">Average Payout Speed</span>
                 <span className="text-xs font-bold text-slate-900">&lt; 2 mins</span>
               </div>
             </div>
          </section>
        </div>
      )}

      {activeTab === 'PAYOUTS' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[11px] ml-1">Release Log</h3>
          <div className="space-y-3">
             {requests.filter(r => r.status === 'COMPLETED').map(r => (
               <div key={r.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Payout to Host #{r.id}</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Status: Released via MoMo</p>
                  </div>
                  <span className="text-sm font-black text-slate-900">{r.totalPrice?.toLocaleString()} RWF</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'DISPUTES' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[11px] ml-1">Active Cases</h3>
          {disputedTrips.length === 0 ? (
            <div className="p-10 text-center space-y-4 bg-emerald-50 rounded-3xl border border-emerald-100">
               <span className="text-3xl">🛡️</span>
               <p className="text-sm text-emerald-800 font-medium">No active disputes in the region.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputedTrips.map(trip => (
                <div key={trip.id} className="bg-white p-5 rounded-3xl border-2 border-red-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-red-600 text-xs uppercase tracking-widest">Case #DIS-{trip.id}</h4>
                      <p className="text-sm font-bold text-slate-800 mt-1">Guest reported issue</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">{trip.totalPrice?.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                     <button 
                       onClick={() => onUpdateStatus(trip.id!, 'CANCELLED')}
                       className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase active:scale-95"
                     >
                       Refund Guest
                     </button>
                     <button 
                       onClick={() => onUpdateStatus(trip.id!, 'CONFIRMED')}
                       className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase active:scale-95"
                     >
                       Release to Host
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl active:scale-95 transition-all text-sm mt-auto">
        Download Financial Report
      </button>
    </div>
  );
};
