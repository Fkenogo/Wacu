import React, { useState, useEffect } from 'react';
import { HostListingState, BookingState, GuestProfile } from '../../types';
import { TrustBadgeItem, TrustTooltip, ContextualNudge } from '../../components/TrustComponents';
import { HOUSE_RULES_TOOLTIPS } from '../../constants';
import { db, auth } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

interface Props {
  listings: HostListingState[];
  requests: BookingState[];
  onUpdateStatus: (id: string, status: BookingState['status']) => void;
  onReleasePayout: (id: string) => void;
  onReviewGuest: (id: string) => void;
  onStartListing: () => void;
  onConfirmPayment: (id: string) => void;
  onRaisePaymentDispute: (id: string, reason: string) => void;
  onMarkCommissionRemitted: (id: string, note?: string) => void;
  onPaymentsHelp: () => void;
  onFAQs: () => void;
  onPolicy: () => void;
  seenTooltips: Set<string>;
  onDismissTooltip: (id: string) => void;
}

type Tab = 'OVERVIEW' | 'EARNINGS' | 'LISTINGS' | 'BOOKINGS' | 'INBOX';

export const HostDashboard: React.FC<Props> = ({ 
  listings, 
  requests, 
  onUpdateStatus, 
  onReleasePayout, 
  onReviewGuest, 
  onStartListing, 
  onConfirmPayment, 
  onRaisePaymentDispute,
  onMarkCommissionRemitted,
  onPaymentsHelp,
  onFAQs,
  onPolicy,
  seenTooltips,
  onDismissTooltip
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [showReports, setShowReports] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [selectedGuestProfile, setSelectedGuestProfile] = useState<GuestProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [remittanceNote, setRemittanceNote] = useState('');
  const [activeRemittanceId, setActiveRemittanceId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const pendingPayment = requests.filter(r => r.status === 'PENDING_PAYMENT' || (r.guestPaymentMarked && !r.hostPaymentConfirmed));
  const activeStays = requests.filter(r => r.status === 'CONFIRMED' || r.status === 'ACTIVE_STAY');
  const confirmedEarnings = requests.filter(r => r.hostPaymentConfirmed);
  
  const totalEarnings = confirmedEarnings.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
  const pendingAmount = pendingPayment.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
  const totalCommissionDue = confirmedEarnings
    .filter(r => !r.commissionMarkedSent)
    .reduce((sum, r) => sum + (r.expectedCommission || 0), 0);
  const completedCount = requests.filter(r => r.status === 'COMPLETED' && r.hostPaymentConfirmed).length;

  useEffect(() => {
    if (!auth.currentUser) return;
    // Real-time listener for host's incoming messages/chats
    const q = query(collection(db, "chats"), where("hostId", "==", auth.currentUser.uid), orderBy("lastMessageTime", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.error("Inbox feed error:", error);
      if (error.message.includes('requires an index')) {
        // Fallback to simple query with client-side sort
        onSnapshot(query(collection(db, "chats"), where("hostId", "==", auth.currentUser.uid)), (snap) => {
           const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
           setMessages(data.sort((a: any, b: any) => (b.lastMessageTime?.seconds || 0) - (a.lastMessageTime?.seconds || 0)));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSendReminder = (id: string, type: 'RULES' | 'CHECKOUT') => {
    alert(`Automated ${type} reminder sent to guest. A notification will appear in their "My Stays" view.`);
  };

  const handleRemit = (id: string) => {
    onMarkCommissionRemitted(id, remittanceNote);
    setActiveRemittanceId(null);
    setRemittanceNote('');
    alert("Contribution marked as sent. Thank you for supporting WACU!");
  };

  const EarningsView = () => (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center flex-1 pr-4">
          Disclaimer: Amounts shown are based on confirmations. WACU does not process payments in Phase 1.
        </p>
        <button onClick={onPolicy} className="text-[9px] font-black text-slate-900 uppercase underline shrink-0">Policy</button>
      </div>

      {totalCommissionDue > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-[2rem] shadow-lg animate-slideDown flex items-start gap-4">
          <span className="text-2xl mt-1">🤝</span>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Good-faith contribution reminder</p>
            <p className="text-xs font-bold text-amber-900 leading-tight">
              You have <span className="underline decoration-amber-400 decoration-2">{totalCommissionDue.toLocaleString()} RWF</span> due for Wacu community growth.
            </p>
          </div>
        </div>
      )}

      <ContextualNudge 
        id="host_earnings_confirmations"
        icon="📊"
        title="Based on confirmations"
        text="Amounts shown depend on guest and host confirmations. Wacu tracks trust, not your bank."
        seenTooltips={seenTooltips}
        onDismiss={onDismissTooltip}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-5 rounded-[2.5rem] text-white shadow-xl space-y-1">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Payments Received</p>
          <p className="text-xl font-black">{totalEarnings.toLocaleString()} RWF</p>
          <p className="text-[7px] font-bold text-emerald-400 uppercase">Based on your confirmations</p>
        </div>
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-1">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Pending Payments</p>
          <p className="text-xl font-black text-slate-900">{pendingAmount.toLocaleString()} RWF</p>
          <p className="text-[7px] font-bold text-amber-500 uppercase">Awaiting your confirmation</p>
        </div>
        <div className="bg-amber-100 p-5 rounded-[2.5rem] border-2 border-amber-200 shadow-sm space-y-1 relative overflow-hidden group">
          {!seenTooltips.has('host_commission_trust') && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          )}
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-800">Good-faith contribution</p>
          <p className="text-xl font-black text-amber-900">{totalCommissionDue.toLocaleString()} RWF</p>
          <p className="text-[7px] font-bold text-amber-600 uppercase flex items-center gap-1">
            Total Commission Due 
            <TrustTooltip title="Based on trust" text="This is not auto-deducted in Phase 1. You remit it manually.">
              <span className="text-[8px]">ⓘ</span>
            </TrustTooltip>
          </p>
        </div>
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-1">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Completed Stays</p>
          <p className="text-xl font-black text-slate-900">{completedCount}</p>
          <p className="text-[7px] font-bold text-slate-400 uppercase">Confirmed & Paid</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Recent Transactions</h3>
          <button onClick={onFAQs} className="text-[10px] font-black text-amber-600 uppercase">Help ⓘ</button>
        </div>
        {requests.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[3rem] border border-slate-100">
            <p className="text-slate-400 font-bold text-xs uppercase italic">“You’ll see payments here once guests complete bookings.”</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 relative">
                {!req.hostPaymentConfirmed && req.guestPaymentMarked && !seenTooltips.has('host_confirm_only_if_paid') && (
                   <div className="absolute -top-3 -right-3 animate-bounce z-10">
                     <span className="bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg">✔️ NEW PAYMENT</span>
                   </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm leading-tight">{req.listingTitle || 'Your Wacu Stay'}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{req.guestName} • {req.startDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-sm">{req.totalPrice.toLocaleString()} RWF</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{req.paymentMethodType === 'MERCHANT_CODE' ? 'Merchant' : 'Personal MoMo'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  {req.hostPaymentConfirmed ? (
                    <div className="flex items-center gap-2">
                       <span className="bg-emerald-100 text-emerald-600 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Paid (Confirmed)</span>
                       <span className="text-[7px] text-slate-400 font-bold uppercase">{req.hostConfirmationDate || 'Just now'}</span>
                    </div>
                  ) : req.status === 'DISPUTED' ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-red-100 text-red-600 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Under Review</span>
                      <TrustTooltip title="Under review" text="A payment issue is being checked by admin. Contact support if needed.">
                        <span className="text-red-400 text-xs">⚠️</span>
                      </TrustTooltip>
                    </div>
                  ) : req.guestPaymentMarked ? (
                    <div className="flex-1 space-y-3">
                       <ContextualNudge 
                        id="host_confirm_only_if_paid"
                        icon="✔️"
                        title="Confirm only if paid"
                        text="Only confirm after you receive the Mobile Money SMS confirmation."
                        seenTooltips={seenTooltips}
                        onDismiss={onDismissTooltip}
                       />
                       <div className="flex gap-2">
                         <button 
                           onClick={() => onConfirmPayment(req.id!)}
                           className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                         >
                           Confirm Received
                         </button>
                         <button 
                           onClick={() => {
                             const reason = prompt("Why wasn't it received? (e.g. Number didn't match, SMS not received)");
                             if(reason) onRaisePaymentDispute(req.id!, reason);
                           }}
                           className="flex-1 bg-white text-red-500 border border-red-100 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all group overflow-hidden relative"
                         >
                           <span className="relative z-10">Not Received</span>
                           {!seenTooltips.has('host_missing_payment') && (
                             <span className="absolute right-0 top-0 bg-red-100 text-red-600 text-[6px] px-1 animate-pulse">🚩</span>
                           )}
                         </button>
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Awaiting Guest Action</span>
                      <TrustTooltip title="Awaiting payment" text="Guest has not confirmed payment yet. They have 24h before check-in to confirm.">
                        <span className="text-slate-300 text-xs">⏳</span>
                      </TrustTooltip>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">Commission Due to WACU</h3>
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden border-2 border-amber-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="space-y-1 relative z-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Good-faith contribution</p>
            <p className="text-4xl font-black text-white mt-1">{totalCommissionDue.toLocaleString()} RWF</p>
            <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/10">
               <p className="text-[10px] text-slate-400 font-medium italic">“This amount supports our community infrastructure. Your honesty builds your Wacu reputation.”</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10 pt-4 border-t border-white/10">
            {confirmedEarnings.filter(r => !r.commissionMarkedSent).length > 0 ? (
              <div className="space-y-4">
                <ContextualNudge 
                  id="host_commission_good_faith"
                  icon="🤝"
                  title="Trust-based support"
                  text="Marking your contribution as sent confirms you've manually transferred the funds to Wacu."
                  variant="slate"
                  seenTooltips={seenTooltips}
                  onDismiss={onDismissTooltip}
                />
                {activeRemittanceId === 'ALL' ? (
                  <div className="space-y-3 animate-slideDown">
                    <textarea 
                      value={remittanceNote}
                      onChange={(e) => setRemittanceNote(e.target.value)}
                      placeholder="Payment reference or note (optional)"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-xs font-medium text-white outline-none focus:border-amber-400"
                    />
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleRemit('ALL')}
                         className="flex-1 bg-amber-500 text-slate-900 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95"
                       >
                         Mark Commission as Sent
                       </button>
                       <button onClick={() => setActiveRemittanceId(null)} className="px-4 text-slate-400 text-[10px] font-black uppercase">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveRemittanceId('ALL')}
                    className="w-full bg-amber-500 text-slate-900 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                  >
                    🚀 Remit Good-faith Contribution
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">All contributions up to date ✨</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn pb-24 h-full overflow-y-auto no-scrollbar bg-slate-50/30">
      <div className="p-6 flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Hosting Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Direct Payment — Phase 1</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onPaymentsHelp}
            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0"
          >
            ❓
          </button>
          <button 
            onClick={onStartListing}
            className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-all shrink-0"
          >
            ➕
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl sticky top-0 z-50 mx-6 mb-6">
         {(['OVERVIEW', 'EARNINGS', 'LISTINGS', 'BOOKINGS', 'INBOX'] as Tab[]).map(tab => (
           <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
           >
             {tab}
             {tab === 'EARNINGS' && (pendingPayment.length > 0 || totalCommissionDue > 0) && (
               <span className="ml-1 w-1.5 h-1.5 bg-amber-500 rounded-full inline-block animate-pulse" />
             )}
           </button>
         ))}
      </div>

      <div className="px-6">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Revenue</p>
                <p className="text-2xl font-black mt-1 leading-none">{totalEarnings.toLocaleString()}</p>
                <p className="text-[8px] font-bold mt-1 opacity-60 uppercase">RWF Confirmed</p>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Open Vouchers</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{listings.length}</p>
                <p className="text-[9px] font-black text-amber-500 uppercase mt-1">Active Wacus</p>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[2rem] p-6 text-white space-y-4 shadow-xl shadow-blue-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
              <div className="relative z-10 space-y-1">
                <h4 className="text-sm font-black uppercase tracking-widest">Smart Nudges</h4>
                <p className="text-[10px] opacity-80">Automate your communication with guests.</p>
              </div>
              <div className="flex gap-2 relative z-10">
                 <button 
                  onClick={() => handleSendReminder('all', 'RULES')}
                  className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                 >
                   Nudge Rules
                 </button>
                 <button 
                  onClick={() => handleSendReminder('all', 'CHECKOUT')}
                  className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                 >
                   Check-out Alert
                 </button>
              </div>
            </div>

            {(pendingPayment.length > 0 || totalCommissionDue > 0) && (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-[2.5rem] flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-amber-900 uppercase">Action Required</p>
                   <p className="text-xs font-bold text-amber-800">
                     {pendingPayment.length > 0 ? `${pendingPayment.length} Payment(s) to verify` : `${totalCommissionDue.toLocaleString()} RWF Contribution Due`}
                   </p>
                </div>
                <button 
                  onClick={() => setActiveTab('EARNINGS')}
                  className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-amber-200 active:scale-95"
                >
                  View Details
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'EARNINGS' && <EarningsView />}

        {activeTab === 'LISTINGS' && (
          <div className="space-y-4">
            {listings.map(l => (
                <div key={l.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                   <h4 className="font-black text-slate-900 text-sm truncate">{l.name}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">{l.landmark}</p>
                   <p className="text-[9px] text-amber-600 font-bold mt-2 uppercase">Payout: {l.paymentMethodType?.replace('_', ' ')} ({l.paymentIdentifier})</p>
                </div>
            ))}
            <button onClick={onStartListing} className="w-full py-5 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-[10px] font-black text-slate-400 uppercase tracking-widest">➕ ADD ANOTHER WACU</button>
          </div>
        )}

        {activeTab === 'BOOKINGS' && (
          <div className="space-y-4">
            {activeStays.length === 0 ? (
               <div className="py-20 text-center text-slate-400 font-black uppercase text-[10px]">No active bookings</div>
            ) : (
              activeStays.map(trip => (
                <div key={trip.id} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between">
                      <span className="font-black text-xs">{trip.guestName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-emerald-500 uppercase">{trip.status}</span>
                        <button 
                          onClick={() => handleSendReminder(trip.id!, 'RULES')}
                          className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px]"
                        >🔔</button>
                      </div>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase">{trip.startDate} to {trip.endDate}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'INBOX' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
               <div className="py-20 text-center text-slate-400 font-black uppercase text-[10px]">No messages yet</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} onClick={() => setSelectedMessage(msg)} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex gap-4 cursor-pointer active:scale-95 transition-all">
                    <img src={msg.guestAvatar || 'https://via.placeholder.com/100'} className="w-12 h-12 rounded-full border-2 border-slate-50" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black text-slate-900 text-xs">{msg.guestName || 'Guest'}</h4>
                        <span className="text-[8px] text-slate-400">{msg.lastMessageTime?.toDate().toLocaleDateString() || 'Recently'}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium truncate">{msg.lastMessageText || 'Tap to view chat...'}</p>
                    </div>
                    {msg.unread && <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showReports && <div className="fixed inset-0 bg-white z-[100] animate-slideUp">Reports View Implementation...</div>}
      {selectedMessage && <div className="fixed inset-0 bg-white z-[120] animate-slideUp">Message Detail implementation...</div>}
      {selectedGuestProfile && <div className="fixed inset-0 bg-white z-[150] animate-slideUp">Guest Trust profile implementation...</div>}
    </div>
  );
};