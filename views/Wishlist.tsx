
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
    <div className="p-6 space-y-8 animate-fadeIn h-full overflow-y-auto no-scrollbar pb-24">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Your Secret Collection</h2>
        <p className="text-slate-500 text-sm font-medium">Wacus you've discovered for your next stay.</p>
      </div>

      {listings.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-5xl">❤️</div>
          <div className="space-y-2 px-6">
            <h3 className="font-black text-slate-800 text-lg">No Wacus Found Yet!</h3>
            <p className="text-sm text-gray-400 leading-relaxed">The best stays go fast. Start hunting and heart the Wacus you love.</p>
          </div>
          <button 
            onClick={onExplore}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Start Hunting Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 animate-slideUp">
          {listings.map((listing) => (
            <div 
              key={listing.id}
              onClick={() => onSelect(listing)}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col active:scale-[0.98] transition-all cursor-pointer relative"
            >
              <div className="relative aspect-square">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(listing.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md z-10"
                >
                  <span className="text-red-500 text-sm">❤️</span>
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">★ {listing.rating}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-[11px] leading-tight truncate">{listing.title}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 truncate">{listing.landmark}</p>
                </div>
                <div className="mt-2 flex justify-between items-end">
                   <p className="font-black text-slate-900 text-xs">{listing.pricePerNight.toLocaleString()} RWF</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
