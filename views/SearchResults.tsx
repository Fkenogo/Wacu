
import React, { useState, useMemo } from 'react';
import { Listing, PropertyType, ListingTag } from '../types';
import { AMENITIES, LISTING_TAGS, CATEGORY_DESCRIPTIONS, CATEGORY_ICONS } from '../constants';

interface SearchResultsViewProps {
  listings: Listing[];
  onSelect: (listing: Listing) => void;
}

interface FilterState {
  types: PropertyType[];
  amenities: string[];
  tags: ListingTag[];
  maxPrice: number;
  groupSize: number;
  minBathrooms: number;
  petFriendly: boolean;
  sortBy: 'price_asc' | 'rating_desc' | 'near_me';
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ listings, onSelect }) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    amenities: [],
    tags: [],
    maxPrice: 100000,
    groupSize: 1,
    minBathrooms: 1,
    petFriendly: false,
    sortBy: 'rating_desc'
  });

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSaved = new Set(savedIds);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedIds(newSaved);
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newLiked = new Set(likedIds);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedIds(newLiked);
  };

  const filteredListings = useMemo(() => {
    let result = listings.filter(l => {
      const typeMatch = filters.types.length === 0 || filters.types.includes(l.type);
      const priceMatch = l.pricePerNight <= filters.maxPrice;
      const capacityMatch = l.capacity >= filters.groupSize;
      const bathroomsMatch = l.bathroomCount >= filters.minBathrooms;
      const petsMatch = !filters.petFriendly || l.petFriendly;
      const amenitiesMatch = filters.amenities.every(id => l.amenities.some(a => a.id === id));
      const tagsMatch = filters.tags.every(tag => l.tags.includes(tag));
      return typeMatch && priceMatch && capacityMatch && bathroomsMatch && petsMatch && amenitiesMatch && tagsMatch;
    });

    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (filters.sortBy === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [listings, filters]);

  const activeFilterCount = (filters.types.length > 0 ? 1 : 0) + 
                            (filters.amenities.length > 0 ? filters.amenities.length : 0) + 
                            (filters.tags.length > 0 ? filters.tags.length : 0) +
                            (filters.maxPrice < 100000 ? 1 : 0) +
                            (filters.minBathrooms > 1 ? 1 : 0) +
                            (filters.groupSize > 1 ? 1 : 0) +
                            (filters.petFriendly ? 1 : 0);

  const selectedCategory = filters.types.length === 1 ? filters.types[0] : null;

  return (
    <div className="relative flex-1 flex flex-col min-h-screen">
      <div className="p-4 space-y-4 sticky top-0 bg-gray-50/90 backdrop-blur-md z-30 border-b border-gray-100">
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-lg">Exploration</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {filteredListings.length} results available
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(true)}
              className={`p-2.5 px-3 rounded-xl transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-wider border ${activeFilterCount > 0 ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-gray-200 text-slate-600'}`}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>

        {/* Quick Type Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {Object.values(PropertyType).map(type => (
            <button
              key={type}
              onClick={() => {
                setFilters(f => ({
                  ...f,
                  types: f.types.includes(type) ? [] : [type]
                }));
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${filters.types.includes(type) ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-200 text-gray-500'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {selectedCategory && (
          <div className="animate-slideDown bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                {CATEGORY_ICONS[selectedCategory]}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">{selectedCategory}</h4>
                   <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Stay Guide</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {CATEGORY_DESCRIPTIONS[selectedCategory]}
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredListings.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <span className="text-5xl">🌍</span>
             <p className="text-slate-400 font-medium">No stays match your criteria.</p>
             <button 
                onClick={() => setFilters({ types: [], amenities: [], tags: [], maxPrice: 100000, groupSize: 1, minBathrooms: 1, petFriendly: false, sortBy: 'rating_desc' })}
                className="text-amber-600 font-black text-xs uppercase tracking-widest underline"
             >
                Reset all filters
             </button>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div 
              key={listing.id}
              onClick={() => onSelect(listing)}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer relative"
            >
              <div className="relative aspect-[4/3]">
                <img 
                  src={listing.image} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                <button 
                  onClick={(e) => toggleSave(e, listing.id)}
                  className="absolute top-5 right-5 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md z-10"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${savedIds.has(listing.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                    viewBox="0 0 24 24" stroke="currentColor" fill="none"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full z-10">
                   <p className="text-[9px] font-black text-white uppercase tracking-widest">{listing.type}</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 leading-tight text-lg">{listing.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{listing.landmark}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                       {listing.tags.map(tag => (
                         <span key={tag} className="text-[8px] font-black uppercase text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/50">{tag}</span>
                       ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-slate-900">{listing.pricePerNight.toLocaleString()} RWF</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">per night</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => toggleLike(e, listing.id)}
                      className="flex items-center gap-1.5"
                    >
                      <span className="text-lg">{likedIds.has(listing.id) ? '❤️' : '🤍'}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{listing.likesCount + (likedIds.has(listing.id) ? 1 : 0)}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">💬</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{listing.reviewCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    👤 {listing.capacity} • 🛁 {listing.bathroomCount} • {listing.petFriendly ? '🐶' : '🚫🐶'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 text-xs">★</span>
                    <span className="text-xs font-bold text-slate-700">{listing.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Modal Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setShowFilters(false)} />
          <div className="relative bg-white rounded-t-[3rem] p-8 space-y-8 animate-slideUp safe-bottom shadow-[0_-20px_50px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto -mt-2" />
            
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Filters</h3>
              <button 
                onClick={() => setFilters({ types: [], amenities: [], tags: [], maxPrice: 100000, groupSize: 1, minBathrooms: 1, petFriendly: false, sortBy: 'rating_desc' })}
                className="text-[10px] font-black text-amber-600 uppercase tracking-widest"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Experience Tags</h4>
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
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                      filters.tags.includes(tag) ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-100 text-slate-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Max Price (RWF)</h4>
                <span className="text-sm font-black text-slate-900">{filters.maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="100000" 
                step="5000"
                value={filters.maxPrice}
                onChange={(e) => setFilters(f => ({ ...f, maxPrice: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Minimum Guest Capacity</h4>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => setFilters(f => ({ ...f, groupSize: num }))}
                    className={`flex-1 min-w-[50px] py-4 rounded-2xl border-2 font-black transition-all ${
                      filters.groupSize === num 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg' 
                        : 'bg-white border-gray-100 text-slate-900 hover:border-gray-200'
                    }`}
                  >
                    {num}{num === 6 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Minimum Bathrooms</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setFilters(f => ({ ...f, minBathrooms: num }))}
                    className={`flex-1 py-4 rounded-2xl border-2 font-black transition-all ${
                      filters.minBathrooms === num 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg' 
                        : 'bg-white border-gray-100 text-slate-900 hover:border-gray-200'
                    }`}
                  >
                    {num}{num === 4 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-gray-100">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                   🐶
                 </div>
                 <div>
                   <p className="font-bold text-slate-900 text-sm">Pet Friendly</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Show pet-safe stays</p>
                 </div>
               </div>
               <button
                  onClick={() => setFilters(f => ({ ...f, petFriendly: !f.petFriendly }))}
                  className={`w-14 h-8 rounded-full transition-all relative ${filters.petFriendly ? 'bg-amber-500' : 'bg-gray-200'}`}
               >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${filters.petFriendly ? 'left-7' : 'left-1'}`} />
               </button>
            </div>

            <button 
              onClick={() => setShowFilters(false)}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all mt-4"
            >
              Show {filteredListings.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
