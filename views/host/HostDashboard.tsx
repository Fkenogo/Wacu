
import React, { useState } from 'react';
import { HostListingState, BookingState, TrustBadge, GuestProfile } from '../../types';
import { TrustBadgeItem } from '../../components/TrustComponents';

interface Props {
  listings: HostListingState[];
  requests: BookingState[];
  onUpdateStatus: (id: string, status: BookingState['status']) => void;
  onReleasePayout: (id: string) => void;
  onReviewGuest: (id: string) => void;
  onStartListing: () => void;
}

type Tab = 'OVERVIEW' | 'BOOKINGS' | 'LISTINGS' | 'INBOX';

export const HostDashboard: React.FC<Props> = ({ listings, requests, onUpdateStatus, onReleasePayout, onReviewGuest, onStartListing }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [showReports, setShowReports] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [selectedGuestProfile, setSelectedGuestProfile] = useState<GuestProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const pendingApproval = requests.filter(r => r.status === 'PENDING_APPROVAL');
  const activeStays = requests.filter(r => r.status === 'CONFIRMED' || r.status === 'ACTIVE_STAY');
  const completedStays = requests.filter(r => r.status === 'COMPLETED');
  
  const totalEarnings = completedStays.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

  const mockMessages = [
    { id: 'm1', from: 'Emmanuel Mugisha', text: 'Hi Clarisse, is the wifi fast enough for zoom calls? I have a few meetings.', time: '2h ago', unread: true, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
    { id: 'm2', from: 'Sarah Uwase', text: 'Checking in tomorrow around 2 PM! Is that okay?', time: '1d ago', unread: false, avatar: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=200&h=200&fit=crop' },
    { id: 'm3', from: 'Jean Bosco', text: 'Thanks for the great stay last week! My family loved the hillside view.', time: '3d ago', unread: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  ];

  const handleBookingAction = (id: string, status: BookingState['status']) => {
    setIsUpdating(id);
    setTimeout(() => {
      onUpdateStatus(id, status);
      setIsUpdating(null);
    }, 800);
  };

  const ReportsView = () => (
    <div className="fixed inset-0 z-[100] bg-white animate-slideUp flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Performance Hub</h3>
        <button onClick={() => setShowReports(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Revenue</p>
          <p className="text-4xl font-black">{totalEarnings.toLocaleString()} RWF</p>
          <p className="text-xs text-emerald-400 font-bold mt-2">↑ 12% from last month</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
               <p className="text-2xl font-black text-amber-900">4.9</p>
               <p className="text-[9px] font-black text-amber-700 uppercase">Avg Rating</p>
             </div>
             <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
               <p className="text-2xl font-black text-blue-900">98%</p>
               <p className="text-[9px] font-black text-blue-700 uppercase">Occupancy</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GuestTrustProfile = ({ profile }: { profile: GuestProfile }) => (
    <div className="fixed inset-0 z-[150] flex flex-col justify-end animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setSelectedGuestProfile(null)} />
      <div className="relative bg-white w-full rounded-t-[3rem] animate-slideUp overflow-hidden max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-4 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Guest trust index</h3>
          <button onClick={() => setSelectedGuestProfile(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-8 no-scrollbar">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img src={profile.avatar} className="w-24 h-24 rounded-full border-4 border-amber-50 shadow-xl object-cover" alt="Guest" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black">
                L{profile.verificationLevel}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{profile.name}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Wacu Member since 2023</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended</p>
              <p className="text-xl font-black text-slate-900">{profile.hostRecommendationRate}%</p>
              <p className="text-[8px] text-emerald-500 font-bold uppercase">By {profile.completedStays} hosts</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Stays</p>
              <p className="text-xl font-black text-slate-900">{profile.completedStays}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase">In Rwanda</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity & Trust Stack</h4>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map(badge => (
                <TrustBadgeItem key={badge} badge={badge} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">About {profile.name.split(' ')[0]}</h4>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                "{profile.bio || "No bio provided."}"
              </p>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
            <span className="text-2xl mt-1">✨</span>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Host Tip</p>
              <p className="text-[11px] font-bold text-amber-800/70 leading-relaxed">
                This guest has completed {profile.completedStays} stays with zero reported issues. They are considered a "Trusted Traveler."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MessageDetail = ({ msg }: { msg: any }) => (
    <div className="fixed inset-0 z-[120] bg-white animate-slideUp flex flex-col">
       <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <button onClick={() => setSelectedMessage(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black">←</button>
          <div className="flex items-center gap-3">
             <img src={msg.avatar} className="w-10 h-10 rounded-full border border-gray-100" />
             <div>
                <h4 className="font-black text-slate-900 text-sm leading-none">{msg.from}</h4>
                <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Online Now</p>
             </div>
          </div>
       </div>
       <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          <div className="flex flex-col items-start max-w-[80%]">
             <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm text-sm text-slate-700 font-medium">
                {msg.text}
             </div>
             <span className="text-[9px] text-slate-400 mt-1 ml-1">{msg.time}</span>
          </div>
          <div className="flex flex-col items-end max-w-[80%] ml-auto">
             <div className="bg-amber-500 p-4 rounded-3xl rounded-tr-none shadow-md text-sm text-white font-medium">
                Hello! Yes, we have high-speed fiber internet (50Mbps). It's very stable for calls.
             </div>
             <span className="text-[9px] text-slate-400 mt-1 mr-1">Just now</span>
          </div>
       </div>
       <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
          <input type="text" placeholder="Type your reply..." className="flex-1 bg-slate-100 rounded-2xl px-6 py-4 outline-none text-sm font-medium" />
          <button className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">🚀</button>
       </div>
    </div>
  );

  const renderTabs = () => (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl sticky top-0 z-10 mx-6 mb-6">
       {(['OVERVIEW', 'LISTINGS', 'BOOKINGS', 'INBOX'] as Tab[]).map(tab => (
         <button 
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
         >
           {tab}
           {tab === 'BOOKINGS' && pendingApproval.length > 0 && (
             <span className="ml-1 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">{pendingApproval.length}</span>
           )}
           {tab === 'INBOX' && mockMessages.filter(m => m.unread).length > 0 && (
             <span className="ml-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">1</span>
           )}
         </button>
       ))}
    </div>
  );

  return (
    <div className="animate-fadeIn pb-24 h-full overflow-y-auto no-scrollbar bg-slate-50/30">
      <div className="p-6 flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Hosting Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Manage your Wacus & community trust.</p>
        </div>
        <button 
          onClick={onStartListing}
          className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-200 active:scale-95 transition-all"
        >
          ➕
        </button>
      </div>

      {renderTabs()}

      <div className="px-6 space-y-8">
        {activeTab === 'OVERVIEW' && (
          <>
            <div className="grid grid-cols-3 gap-3">
               <button onClick={onStartListing} className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all group">
                  <span className="text-xl">➕</span>
                  <span className="text-[8px] font-black uppercase text-slate-400">Add Wacu</span>
               </button>
               <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all group opacity-50 cursor-not-allowed">
                  <span className="text-xl">📅</span>
                  <span className="text-[8px] font-black uppercase text-slate-400">Calendar</span>
               </button>
               <button onClick={() => setShowReports(true)} className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all group">
                  <span className="text-xl">📊</span>
                  <span className="text-[8px] font-black uppercase text-slate-400">Reports</span>
               </button>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white space-y-4 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
               <div className="flex justify-between items-center relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Host Trust Profile</h3>
                  <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded-full uppercase">Level 3</span>
               </div>
               <div className="flex flex-wrap gap-2 relative z-10">
                  <TrustBadgeItem badge="Identity Verified" condensed />
                  <TrustBadgeItem badge="Active Host" condensed />
                  <TrustBadgeItem badge="Community Trusted" condensed />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-amber-200/40">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Earnings</p>
                <p className="text-2xl font-black mt-1 leading-none">{totalEarnings.toLocaleString()}</p>
                <p className="text-[10px] font-bold mt-1 opacity-60 uppercase">RWF</p>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Avg Occupancy</p>
                <p className="text-2xl font-black text-slate-900 mt-1">100%</p>
                <p className="text-[9px] font-black text-emerald-500 uppercase mt-1">High Season</p>
              </div>
            </div>
            
            {pendingApproval.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Urgent Actions</h3>
                <div onClick={() => setActiveTab('BOOKINGS')} className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between cursor-pointer active:scale-95 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📬</span>
                    <p className="text-xs font-bold text-amber-900">{pendingApproval.length} New Booking Requests</p>
                  </div>
                  <span className="text-amber-500 font-black">→</span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'LISTINGS' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Manage My Wacus</h3>
            {listings.length === 0 ? (
               <div onClick={onStartListing} className="p-12 border-4 border-dashed border-slate-200 rounded-[3rem] text-center space-y-4 group cursor-pointer hover:border-amber-400 transition-all">
                  <span className="text-5xl grayscale group-hover:grayscale-0 transition-all">🏠</span>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No active Wacus yet</p>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase">Create First Listing</button>
               </div>
            ) : (
              listings.map(l => (
                <div key={l.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 group">
                   <div className="flex items-center gap-4">
                      <img src={l.photos?.[0] || 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=200&q=80'} className="w-16 h-16 rounded-2xl object-cover shadow-inner" alt="Property" />
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 text-sm truncate">{l.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{l.landmark}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${l.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {l.status}
                          </span>
                          <span className="text-[10px] font-black text-slate-900">{l.pricePerNight.toLocaleString()} RWF</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => alert('Wizard data mapped! Entering Edit Mode...')}
                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                      >
                        Edit Wacu
                      </button>
                      <button 
                        onClick={() => setShowReports(true)}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                      >
                        Performance
                      </button>
                   </div>
                </div>
              ))
            )}
            <button 
              onClick={onStartListing}
              className="w-full py-5 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-amber-400 hover:text-amber-500 transition-all flex items-center justify-center gap-2"
            >
              ➕ ADD ANOTHER WACU
            </button>
          </div>
        )}

        {activeTab === 'BOOKINGS' && (
          <div className="space-y-6">
            {pendingApproval.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending Approval ({pendingApproval.length})</h4>
                {pendingApproval.map(req => (
                  <div key={req.id} className={`bg-white p-6 rounded-[2.5rem] border border-amber-100 shadow-xl shadow-amber-50 space-y-4 transition-all ${isUpdating === req.id ? 'opacity-50 scale-95' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => setSelectedGuestProfile(req.guestProfile || null)}
                        className="cursor-pointer active:scale-95 transition-transform"
                      >
                        <img src={req.guestProfile?.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm" alt="Guest" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900 text-sm">{req.guestName}</p>
                          <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">Verified</span>
                        </div>
                        <button 
                          onClick={() => setSelectedGuestProfile(req.guestProfile || null)}
                          className="text-[9px] font-bold text-amber-600 uppercase tracking-tight flex items-center gap-1 mt-0.5"
                        >
                          View Trust Profile <span className="text-[10px]">→</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Dates & Price</p>
                      <p className="text-xs font-bold text-slate-700">{req.startDate} — {req.endDate}</p>
                      <p className="text-xs font-black text-slate-900">{req.totalPrice?.toLocaleString()} RWF</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleBookingAction(req.id!, 'CONFIRMED')}
                        disabled={!!isUpdating}
                        className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                       >
                         {isUpdating === req.id ? '...' : 'Accept'}
                       </button>
                       <button 
                        onClick={() => handleBookingAction(req.id!, 'CANCELLED')}
                        disabled={!!isUpdating}
                        className="flex-1 bg-gray-100 text-slate-500 py-4 rounded-2xl font-black text-[10px] uppercase active:scale-95 transition-all"
                       >
                         Decline
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upcoming & In-Stay</h4>
               {activeStays.length === 0 ? (
                 <div className="py-16 text-center space-y-4 bg-white rounded-[2rem] border border-slate-100">
                    <span className="text-4xl grayscale opacity-30">🎒</span>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No active stays right now.</p>
                 </div>
               ) : (
                 activeStays.map(trip => (
                   <div key={trip.id} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm space-y-4 flex flex-col group">
                      <div className="flex justify-between items-center">
                        <div 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedGuestProfile(trip.guestProfile || null)}
                        >
                          <img src={trip.guestProfile?.avatar} className="w-8 h-8 rounded-full border border-slate-100" alt="Guest" />
                          <p className="text-xs font-black text-slate-800">{trip.guestName}</p>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${trip.status === 'ACTIVE_STAY' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                         <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase">Dates</p>
                            <p className="text-[10px] font-bold text-slate-600">{trip.startDate} - {trip.endDate}</p>
                         </div>
                         <button 
                          onClick={() => setSelectedMessage(mockMessages[0])}
                          className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                         >
                            Message
                         </button>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        )}

        {activeTab === 'INBOX' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs ml-1">Engagement Hub</h3>
            <div className="divide-y divide-slate-100 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
               {mockMessages.map(m => (
                 <div 
                  key={m.id} 
                  onClick={() => setSelectedMessage(m)}
                  className={`p-6 flex items-start gap-4 active:bg-slate-50 transition-colors cursor-pointer relative ${m.unread ? 'bg-amber-50/20' : ''}`}
                 >
                    <img src={m.avatar} className="w-12 h-12 rounded-full shrink-0 border border-slate-100 object-cover" />
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center mb-1">
                          <h4 className="font-black text-slate-900 text-xs truncate">{m.from}</h4>
                          <span className="text-[9px] text-slate-400 font-bold">{m.time}</span>
                       </div>
                       <p className={`text-[11px] truncate ${m.unread ? 'font-black text-slate-900' : 'text-slate-500 font-medium'}`}>{m.text}</p>
                    </div>
                    {m.unread && (
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-lg shadow-amber-200"></div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlays */}
      {showReports && <ReportsView />}
      {selectedMessage && <MessageDetail msg={selectedMessage} />}
      {selectedGuestProfile && <GuestTrustProfile profile={selectedGuestProfile} />}
    </div>
  );
};
