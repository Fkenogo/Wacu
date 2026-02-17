
import React from 'react';
import { CATEGORY_ICONS } from '../constants';
import { UserRole, PropertyType, Listing } from '../types';

interface HomeViewProps {
  role: UserRole;
  onSetRole: (role: UserRole) => void;
  onSearch: (filters?: any) => void;
  onSelectListing: (listing: Listing) => void;
  onHostStart: () => void;
  listings: Listing[];
}

export const HomeView: React.FC<HomeViewProps> = ({ role, onSetRole, onSearch, onSelectListing, onHostStart, listings }) => {
  const featuredStays = listings.slice(0, 3);

  return (
    <div className="flex flex-col space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="px-6 pt-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black text-slate-900 leading-none tracking-tighter uppercase">WACU</h1>
          <button 
            onClick={() => onSetRole(role === UserRole.GUEST ? UserRole.HOST : UserRole.GUEST)}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg active:scale-95 shadow-sm"
          >
            {role === UserRole.GUEST ? '👤' : '🏠'}
          </button>
        </div>

        {/* Search Bar */}
        <div 
          onClick={() => onSearch()}
          className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg">🔍</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">Yambi. Discover a home to call yours</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Find Hosts • Receive Guests</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-2">
          {Object.values(PropertyType).map(type => (
            <button
              key={type}
              onClick={() => onSearch({ type })}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-2xl shadow-md border border-slate-50 active:scale-90 transition-all">
                {CATEGORY_ICONS[type]}
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center w-20 break-words leading-tight px-1">
                {type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-6">
          <h3 className="text-xl font-black text-slate-900 leading-tight">Rare Finds</h3>
          <button onClick={() => onSearch()} className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Show All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 snap-x">
          {featuredStays.length > 0 ? featuredStays.map(listing => (
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
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 truncate">{listing.title}</h4>
                  <p className="font-black text-slate-900 text-sm">{listing.pricePerNight.toLocaleString()} RWF</p>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">📍 {listing.landmark}</p>
              </div>
            </div>
          )) : (
            <div className="w-[85vw] p-10 text-center bg-slate-50 rounded-3xl text-slate-400 italic">No Wacus live yet. Be the first host!</div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-4">
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-4">
             <h3 className="text-3xl font-black leading-none">Turn Your Spare Space into a Wacu</h3>
             <button 
              onClick={onHostStart}
              className="bg-white text-slate-900 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg"
             >
               Start Hosting Journey
             </button>
           </div>
           <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500 rounded-full blur-[80px] opacity-20" />
        </div>
      </div>
    </div>
  );
};
