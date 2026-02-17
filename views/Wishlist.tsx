
import React from 'react';
import { Listing } from '../types';

interface WishlistViewProps {
  listings: Listing[];
  onSelect: (listing: Listing) => void;
  onToggleSave: (id: string) => void;
  onExplore: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ listings, onSelect, onToggleSave, onExplore }) => {
  return (
    <div className="p-6 space-y-6 animate-fadeIn pb-24 overflow-y-auto no-scrollbar">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase">Saved Wacus</h2>
        <p className="text-slate-500 text-sm font-medium">Your collection of future stays.</p>
      </div>

      {listings.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center space-y-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center text-5xl">❤️</div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Your wishlist is empty</h3>
            <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">Save your favorite stays here by tapping the heart icon on any listing.</p>
          </div>
          <button 
            onClick={onExplore}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all"
          >
            Start Exploring
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.map((listing) => (
            <div 
              key={listing.id}
              onClick={() => onSelect(listing)}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-50 flex flex-col active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="relative aspect-video">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(listing.id);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center z-10"
                >
                  <span className="material-symbols-outlined text-rose-500 text-xl fill-current">favorite</span>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-slate-900 text-base uppercase tracking-tighter truncate pr-2 flex-1">{listing.title}</h4>
                  <div className="text-primary font-black text-sm">{listing.pricePerNight.toLocaleString()} <span className="text-[9px] uppercase">RWF</span></div>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <p className="text-[10px] font-bold uppercase tracking-tight">{listing.landmark}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
