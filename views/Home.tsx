
import React, { useMemo } from 'react';
import { PropertyType, Listing, UserRole } from '../types';

interface HomeViewProps {
  role: UserRole;
  onSetRole: (role: UserRole) => void;
  onSearch: (filters?: any) => void;
  onSelectListing: (listing: Listing) => void;
  onHostStart: () => void;
  listings: Listing[];
  guestAvatar?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSearch, onSelectListing, onHostStart, listings, guestAvatar }) => {
  const featuredStays = useMemo(() => [...listings].slice(0, 4), [listings]);
  const popularStays = useMemo(() => [...listings].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)).slice(0, 5), [listings]);

  const renderFeaturedCard = (listing: Listing) => (
    <div 
      key={listing.id}
      onClick={() => onSelectListing(listing)}
      className="min-w-[320px] snap-center bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-4 active:scale-[0.98] transition-all cursor-pointer"
    >
      <div className="relative h-64 w-full p-4">
        <img src={listing.image} className="w-full h-full object-cover rounded-[2rem]" alt={listing.title} />
        <div className="absolute top-8 left-8 bg-[#1e293b]/80 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10">
          <span className="text-[11px] font-bold text-white tracking-wide">{listing.type}</span>
        </div>
        <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-rose-500 text-[16px] fill-current">favorite</span>
          <span className="text-[11px] font-black text-slate-800">{listing.likesCount || 890}</span>
        </div>
      </div>
      <div className="px-7 pb-8 pt-2">
        <div className="flex justify-between items-start">
          <h3 className="text-[19px] font-black text-slate-900 leading-tight pr-4 flex-1">
            {listing.title}
          </h3>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">RWF</p>
            <p className="text-xl font-black text-primary leading-none">{(listing.pricePerNight || 35000).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 mt-3">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          <p className="text-[13px] font-medium tracking-tight truncate">{listing.landmark || 'Close to Kigali Heights'}</p>
        </div>
      </div>
    </div>
  );

  const renderPopularCard = (listing: Listing) => (
    <div 
      key={listing.id}
      onClick={() => onSelectListing(listing)}
      className="min-w-[280px] snap-center bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 mb-4 active:scale-[0.98] transition-all cursor-pointer"
    >
      <div className="relative aspect-square w-full p-3">
        <img src={listing.image} className="w-full h-full object-cover rounded-[2rem]" alt={listing.title} />
        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-rose-500 text-[14px] fill-current">favorite</span>
          <span className="text-[10px] font-black text-slate-800">950</span>
        </div>
      </div>
      <div className="px-5 pb-6">
        <div className="flex items-baseline justify-between gap-1">
          <h3 className="text-[15px] font-black text-slate-900 leading-tight truncate flex-1">{listing.title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-[9px] font-black text-primary uppercase">RWF</span>
            <span className="text-[15px] font-black text-primary">{(listing.pricePerNight || 45000).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400 mt-2">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          <p className="text-[11px] font-medium truncate">{listing.landmark || 'Muhazi Lake, Rwanda'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col animate-fadeIn pb-12 bg-background-light">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-slate-900 shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined font-black text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#1e293b]">Wacu</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-50 active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-slate-700 text-[24px]">notifications</span>
            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xl ring-2 ring-primary/5 cursor-pointer active:scale-95 transition-transform">
            <img 
              alt="Profile" 
              className="w-full h-full object-cover" 
              src={guestAvatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"} 
            />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6 py-6">
        <div 
          onClick={() => onSearch()}
          className="bg-white rounded-full p-2 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex items-center cursor-pointer active:scale-[0.99] transition-all"
        >
          <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined font-black">search</span>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-[15px] font-black text-slate-900 leading-tight">Where to next?</p>
            <p className="text-[11px] text-slate-400 font-bold tracking-tight">Find hosts • Receive guests</p>
          </div>
          <button className="p-3 text-slate-300">
            <span className="material-symbols-outlined text-2xl font-bold">tune</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-6 px-6 py-4 no-scrollbar">
        {[
          { type: PropertyType.FAMILY_HOMESTAY, label: 'Family', icon: '👨‍👩‍👧‍👦' },
          { type: PropertyType.SHARED_HOME, label: 'Shared', icon: '👥' },
          { type: PropertyType.ENTIRE_HOME, label: 'Entire Home', icon: '🏠' },
          { type: PropertyType.VILLAGE_STAY, label: 'Village Stay', icon: '🛖' },
          { type: PropertyType.FARM_STAY, label: 'Farm', icon: '🚜' },
        ].map((item, idx) => (
          <button
            key={item.label}
            onClick={() => onSearch({ type: item.type })}
            className="flex flex-col items-center gap-3 shrink-0"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all border ${idx === 0 ? 'bg-amber-100/50 border-amber-200' : 'bg-gray-50 border-transparent'}`}>
               {item.icon}
            </div>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Section */}
      <section className="mt-8">
        <div className="flex justify-between items-center px-6 mb-6">
          <h2 className="text-[22px] font-black text-[#1e293b] tracking-tight">Featured Wacu's</h2>
          <button onClick={() => onSearch()} className="text-primary font-black text-[13px] hover:opacity-80">See all</button>
        </div>
        <div className="flex overflow-x-auto gap-6 px-6 no-scrollbar snap-x">
          {featuredStays.length > 0 ? featuredStays.map(listing => renderFeaturedCard(listing)) : (
            [1, 2].map(i => (
               <div key={i} className="min-w-[320px] h-[400px] bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
            ))
          )}
        </div>
      </section>

      {/* Popular Section */}
      <section className="mt-12">
        <div className="flex justify-between items-center px-6 mb-6">
          <h2 className="text-[22px] font-black text-[#1e293b] tracking-tight">Popular Wacus</h2>
          <button onClick={() => onSearch()} className="text-primary font-black text-[13px] hover:opacity-80">See all</button>
        </div>
        <div className="flex overflow-x-auto gap-6 px-6 no-scrollbar snap-x">
          {popularStays.length > 0 ? popularStays.map(listing => renderPopularCard(listing)) : (
             [1, 2, 3].map(i => (
               <div key={i} className="min-w-[280px] h-[320px] bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
            ))
          )}
        </div>
      </section>

      {/* Host Recruitment Card */}
      <div className="px-6 py-12">
        <div className="bg-[#1e293b] rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white leading-tight tracking-tight">
                Turn Your Spare Space into a Wacu
              </h3>
              <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-[260px]">
                Join our community of hosts and start your journey to financial freedom today.
              </p>
            </div>
            
            <button 
              onClick={onHostStart}
              className="w-full bg-primary text-slate-900 font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm tracking-wide"
            >
              Start Hosting Journey
              <span className="material-symbols-outlined text-lg font-black">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
