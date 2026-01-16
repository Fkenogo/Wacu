
import React, { useState } from 'react';
import { Listing, BookingState, AuditEntry } from '../../types';

interface Props {
  listings: Listing[];
  trips: BookingState[];
  requests: BookingState[];
  onUpdateStatus: (id: string, status: BookingState['status']) => void;
  onResolveDispute: (id: string, outcome: 'PAID' | 'NOT_PAID' | 'INCONCLUSIVE', decisionLog: string) => void;
  auditLogs: AuditEntry[];
}

export const AdminDashboard: React.FC<Props> = ({ listings, trips, requests, onUpdateStatus, onResolveDispute, auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DISPUTES' | 'AUDIT'>('OVERVIEW');
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const disputedTrips = requests.filter(t => t.status === 'DISPUTED');
  
  const handleResolution = (id: string, outcome: 'PAID' | 'NOT_PAID' | 'INCONCLUSIVE') => {
    if (!resolutionNote) {
      alert("Please provide a log for the decision.");
      return;
    }
    onResolveDispute(id, outcome, resolutionNote);
    setSelectedDispute(null);
    setResolutionNote('');
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">System HQ</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Phase 1 Direct Payment Protocol</p>
        </div>
        <div className="bg-amber-100 px-3 py-1.5 rounded-full">
           <span className="text-[10px] font-black text-amber-600 uppercase">Escrow Disabled</span>
        </div>
      </div>

      <div className="flex p-1 bg-gray-100 rounded-2xl">
        {(['OVERVIEW', 'DISPUTES', 'AUDIT'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-gray-400'}`}
          >
            {tab} {tab === 'DISPUTES' && disputedTrips.length > 0 && `(${disputedTrips.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Listings</p>
              <p className="text-2xl font-black mt-1">{listings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Active Conflicts</p>
              <p className="text-2xl font-black mt-1 text-red-500">{disputedTrips.length}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 space-y-4">
            <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Escrow Readiness Checklist</h4>
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                 <span className="text-blue-400">✓</span>
                 <p className="text-[10px] font-bold text-blue-700 uppercase">Direct Payment Flow Tested</p>
               </div>
               <div className="flex items-center gap-2 opacity-50">
                 <span className="text-blue-300">○</span>
                 <p className="text-[10px] font-bold text-blue-700 uppercase">Regulatory Bank Wallet License</p>
               </div>
               <div className="flex items-center gap-2 opacity-50">
                 <span className="text-blue-300">○</span>
                 <p className="text-[10px] font-bold text-blue-700 uppercase">Stable User Base threshold</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DISPUTES' && (
        <div className="space-y-4">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] ml-1">Payment Disputes under Review</h3>
          {disputedTrips.length === 0 ? (
            <div className="p-12 text-center space-y-4 bg-emerald-50 rounded-[3rem] border border-emerald-100">
               <span className="text-4xl">🛡️</span>
               <p className="text-xs text-emerald-800 font-black uppercase tracking-widest">All clear</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputedTrips.map(trip => (
                <div key={trip.id} className={`bg-white p-6 rounded-[2.5rem] border-2 shadow-sm space-y-4 transition-all ${selectedDispute === trip.id ? 'border-amber-400 ring-4 ring-amber-400/5' : 'border-red-100 hover:border-red-200 cursor-pointer'}`} onClick={() => setSelectedDispute(trip.id!)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-red-600 text-xs uppercase tracking-[0.2em]">Conflict ID: #{trip.id?.slice(-5)}</h4>
                      <p className="text-lg font-black text-slate-900 mt-1">{trip.totalPrice?.toLocaleString()} RWF</p>
                    </div>
                    <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Check-in Blocked</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-slate-400 uppercase">Guest</p>
                       <p className="text-xs font-bold text-slate-800">{trip.guestName}</p>
                       <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-tight">Marked as Paid</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <p className="text-[8px] font-black text-slate-400 uppercase">Host</p>
                       <p className="text-xs font-bold text-slate-800">{trip.hostName}</p>
                       <p className="text-[9px] text-red-600 font-bold uppercase tracking-tight">Reported: {trip.hostDisputeResponse?.replace('_', ' ') || 'No Response'}</p>
                    </div>
                  </div>

                  {selectedDispute === trip.id && (
                    <div className="animate-slideDown space-y-6 pt-4 border-t-2 border-dashed border-slate-100">
                       <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence / Proof</h5>
                          <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                             <p className="text-xs font-medium text-slate-700 leading-relaxed italic">
                                "{trip.disputeProofText || trip.disputeReason || "No explanation provided."}"
                             </p>
                             <div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                [ MTN SMS Screenshot ]
                             </div>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decision Log (Required)</h5>
                          <textarea 
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                            placeholder="State clearly why you are resolving this way..."
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 text-xs font-medium outline-none focus:border-amber-400 h-24"
                          />
                       </div>

                       <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleResolution(trip.id!, 'PAID')}
                            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-200"
                          >
                            Outcome: Payment Confirmed (Mark Paid)
                          </button>
                          <button 
                            onClick={() => handleResolution(trip.id!, 'NOT_PAID')}
                            className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-200"
                          >
                            Outcome: Payment Not Received (Prompt Retry)
                          </button>
                          <button 
                            onClick={() => handleResolution(trip.id!, 'INCONCLUSIVE')}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                          >
                            Outcome: Inconclusive (Support Required)
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="space-y-4">
           <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] ml-1">System Audit Logs</h3>
           <div className="space-y-3">
             {auditLogs.map(log => (
               <div key={log.id} className="bg-white p-4 rounded-2xl border border-gray-100 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-[10px] font-black uppercase tracking-tight text-amber-600">{log.action}</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">{log.timestamp}</p>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{log.details}</p>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};
