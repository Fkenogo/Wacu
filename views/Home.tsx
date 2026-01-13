
import React from 'react';
import { MOCK_LISTINGS, CATEGORY_ICONS } from '../constants';
import { UserRole, PropertyType, Listing } from '../types';

interface HomeViewProps {
  role: UserRole;
  onSetRole: (role: UserRole) => void;
  onSearch: (filters?: any) => void;
  onSelectListing: (listing: Listing) => void;
  onHostStart: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ role, onSetRole, onSearch, onSelectListing, onHostStart }) => {
  const featuredStays = MOCK_LISTINGS.slice(0, 3);
  const guestFavorites = MOCK_LISTINGS.filter(l => l.rating >= 4.7);

  return (
    <div className="flex flex-col space-y-8 animate-fadeIn pb-12">
      {/* Dynamic Header & Search */}
      <div className="px-6 pt-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 leading-none tracking-tighter">Wacu</h1>
          </div>
          <button 
            onClick={() => onSetRole(role === UserRole.GUEST ? UserRole.HOST : UserRole.GUEST)}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg active:scale-95 transition-all shadow-sm"
          >
            {role === UserRole.GUEST ? '👤' : '🏢'}
          </button>
        </div>

        {/* Floating Search Bar */}
        <div 
          onClick={() => onSearch()}
          className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-200">
            🔍
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">Discover a Wacu to call yours</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Magic Awaits • Any Week • Add Guests</p>
          </div>
        </div>
      </div>

      {/* Enhanced Horizontal Category Bar */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-2 snap-x snap-mandatory">
          {Object.values(PropertyType).map(type => (
            <button
              key={type}
              onClick={() => onSearch({ type })}
              className="flex flex-col items-center gap-2 group shrink-0 snap-start pb-2"
            >
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-2xl shadow-md border border-slate-50 group-active:scale-90 transition-all">
                {CATEGORY_ICONS[type]}
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors text-center w-20 break-words leading-tight px-1">
                {type}
              </span>
            </button>
          ))}
          <div className="shrink-0 w-6" />
        </div>
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
      </div>

      {/* Unique Stays */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-6">
          <h3 className="text-xl font-black text-slate-900 leading-tight">Wacus You Won't Find Anywhere Else</h3>
          <button onClick={() => onSearch()} className="text-[10px] font-black text-amber-600 uppercase tracking-widest border-b-2 border-amber-600/20 pb-0.5">Show Me More</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 snap-x">
          {featuredStays.map(listing => (
            <div 
              key={listing.id}
              onClick={() => onSelectListing(listing)}
              className="w-[85vw] shrink-0 snap-center bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 active:scale-[0.98] transition-all"
            >
              <div className="relative aspect-[16/10]">
                <img src={listing.image} className="w-full h-full object-cover" alt={listing.title} />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">{listing.type}</span>
                  </div>
                  {listing.tags.slice(0, 1).map(tag => (
                    <div key={tag} className="bg-amber-500/80 backdrop-blur-md px-3 py-1 rounded-full">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 truncate">{listing.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 truncate">{listing.landmark}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-black text-slate-900 text-sm whitespace-nowrap">{listing.pricePerNight.toLocaleString()} RWF</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">per night</p>
                  </div>
                </div>
                {/* Small tag cloud for featured items */}
                <div className="flex flex-wrap gap-1">
                   {listing.tags.slice(1, 3).map(tag => (
                     <span key={tag} className="text-[8px] font-black uppercase text-slate-400 border border-slate-100 px-2 py-0.5 rounded-full">{tag}</span>
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guest Favorites */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-end px-6">
          <h3 className="text-xl font-black text-slate-900 leading-tight">The Wacus Everyone is Obsessed With</h3>
          <button onClick={() => onSearch()} className="text-[10px] font-black text-amber-600 uppercase tracking-widest border-b-2 border-amber-600/20 pb-0.5">Join the Trend</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 snap-x pb-4">
          {guestFavorites.map(listing => (
            <div 
              key={listing.id}
              onClick={() => onSelectListing(listing)}
              className="w-48 shrink-0 snap-start space-y-2 group"
            >
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-md group-active:scale-[0.97] transition-all">
                <img src={listing.image} className="w-full h-full object-cover" alt={listing.title} />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                   <img src={listing.hostAvatar} className="w-6 h-6 rounded-full border border-white" />
                   <span className="text-[9px] font-black text-white truncate max-w-[80px]">{listing.hostName}</span>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{listing.title}</h4>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-[10px] font-black text-slate-400">{listing.pricePerNight.toLocaleString()} RWF</p>
                  <span className="text-[9px] font-black text-emerald-500">★ {listing.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Become a Host Hero */}
      <div className="px-6 py-4">
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-4">
             <h3 className="text-3xl font-black leading-none">Turn Your Spare Space into a Wacu</h3>
             <p className="text-slate-400 text-sm font-medium">Join our community of hosts and share the magic of Rwanda. Your home, their story.</p>
             <button 
              onClick={onHostStart}
              className="bg-white text-slate-900 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg"
             >
               Start Your Wacu Hosting Journey
             </button>
           </div>
           <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500 rounded-full blur-[80px] opacity-20" />
        </div>
      </div>
    </div>
  );
};
