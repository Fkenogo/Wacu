
import React, { useState, useMemo } from 'react';
import { Listing, PropertyType, ListingTag } from '../types';
import { LISTING_TAGS, CATEGORY_ICONS } from '../constants';

interface SearchResultsViewProps {
  listings: Listing[];
  onSelect: (listing: Listing) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  likedIds: Set<string>;
  onToggleLike: (id: string) => void;
}

interface FilterState {
  types: PropertyType[];
  amenities: string[];
  tags: ListingTag[];
  maxPrice: number;
  sortBy: 'price_asc' | 'rating_desc';
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ listings, onSelect, wishlistIds, onToggleWishlist, likedIds, onToggleLike }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PropertyType | 'All'>('All');
  
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    amenities: [],
    tags: [],
    maxPrice: 150000,
    sortBy: 'rating_desc',
  });

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const categoryMatch = activeCategory === 'All' || l.type === activeCategory;
      const priceMatch = l.pricePerNight <= filters.maxPrice;
      const tagsMatch = filters.tags.every(tag => (l.tags || []).includes(tag));
      return categoryMatch && priceMatch && tagsMatch;
    });
  }, [listings, activeCategory, filters]);

  const categories = ['All Wacus', ...Object.values(PropertyType)];

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      {/* 1. Header Section */}
      <div className="px-6 pt-6 pb-4 space-y-5 sticky top-0 bg-white/95 backdrop-blur-md z-30">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Wacu</h2>
          <button 
            onClick={() => setShowFilters(true)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-slate-900 font-bold">tune</span>
          </button>
        </div>

        {/* 2. Search Pill */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <span className="material-symbols-outlined font-bold">search</span>
          </div>
          <input 
            type="text"
            placeholder="Where to next?"
            className="w-full h-14 pl-12 pr-4 bg-white rounded-full border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
          />
        </div>

        {/* 3. Horizontal Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          {categories.map((cat) => {
            const isAll = cat === 'All Wacus';
            const type = isAll ? 'All' : cat as PropertyType;
            const isActive = activeCategory === type;
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(type)}
                className={`whitespace-nowrap px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                  isActive 
                    ? 'bg-primary border-primary text-[#1d180c] shadow-md' 
                    : 'bg-white border-slate-100 text-slate-500'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Immersive Results Grid */}
      <div className="px-6 pb-24 space-y-8 mt-4">
        {filteredListings.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <span className="text-6xl opacity-30">🏡</span>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No Wacus found in this area</p>
            <button onClick={() => setActiveCategory('All')} className="text-primary font-black uppercase text-[10px] tracking-[0.2em] underline">Clear filters</button>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div 
              key={listing.id}
              onClick={() => onSelect(listing)}
              className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl animate-fadeIn cursor-pointer aspect-[3/4]"
            >
              {/* Image Layer */}
              <img 
                src={listing.image} 
                alt={listing.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Scrim/Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-5 left-5 flex gap-2 items-center">
                <div className="bg-primary px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                  <span className="material-symbols-outlined text-sm font-black fill-current">verified</span>
                  <span className="text-[10px] font-black uppercase text-[#1d180c]">Verified</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">Superhost</span>
                </div>
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleWishlist(listing.id); }}
                className="absolute top-5 right-5 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <span className={`material-symbols-outlined text-2xl ${wishlistIds.includes(listing.id) ? 'text-red-500 fill-current' : 'text-white'}`}>
                  favorite
                </span>
              </button>

              {/* Card Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-5">
                {/* Host Info */}
                <div className="flex items-center gap-3">
                  <img 
                    src={listing.hostAvatar} 
                    className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow-lg" 
                    alt={listing.hostName} 
                  />
                  <div>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-tight">Hosted by {listing.hostName.split(' ')[0]}</p>
                    <div className="flex items-center gap-1.5 text-white">
                      <span className="text-primary text-xs">★</span>
                      <span className="text-xs font-black">{listing.rating}</span>
                      <span className="text-white/40 text-[10px] font-bold">({listing.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                  {listing.title}
                </h3>

                {/* Footer Action */}
                <div className="flex justify-between items-end pt-2">
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary font-black text-xl">RWF {listing.pricePerNight.toLocaleString()}</span>
                    </div>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">per night</p>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelect(listing); }}
                    className="bg-primary text-[#1d180c] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all transform hover:-translate-y-1"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="relative bg-white rounded-t-[3rem] p-8 space-y-8 animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto -mt-2" />
            
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Search Filters</h3>
              <button 
                onClick={() => setFilters({ types: [], amenities: [], tags: [], maxPrice: 150000, sortBy: 'rating_desc' })}
                className="text-[10px] font-black text-primary uppercase tracking-widest"
              >
                Reset All
              </button>
            </div>

            {/* Experience Tags */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Wacu Vibes</h4>
              <div className="flex flex-wrap gap-2">
                {LISTING_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilters(f => ({
                        ...f,
                        tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
                      }));
                    }}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                      filters.tags.includes(tag) ? 'bg-primary border-primary text-[#1d180c] shadow-md' : 'bg-white border-slate-100 text-slate-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Max Budget (RWF)</h4>
                <span className="text-sm font-black text-slate-900">{filters.maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="150000" 
                step="5000"
                value={filters.maxPrice}
                onChange={(e) => setFilters(f => ({ ...f, maxPrice: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>

            <button 
              onClick={() => setShowFilters(false)}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all mt-4"
            >
              Show {filteredListings.length} Result{filteredListings.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
