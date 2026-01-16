
import React, { useState, useMemo } from 'react';
import { Listing, Review, TrustBadge, Amenity } from '../types';
import { CATEGORY_DESCRIPTIONS, CATEGORY_ICONS, BADGE_METADATA, AMENITY_CATEGORIES, HOUSE_RULES_TOOLTIPS } from '../constants';
import { TrustBadgeSystem, TrustTooltip } from '../components/TrustComponents';

interface ListingDetailViewProps {
  listing: Listing;
  isSaved: boolean;
  isLiked: boolean;
  onToggleSave: () => void;
  onToggleLike: () => void;
  onBook: () => void;
}

export const ListingDetailView: React.FC<ListingDetailViewProps> = ({ listing, isSaved, isLiked, onToggleSave, onToggleLike, onBook }) => {
  const [commentText, setCommentText] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>(listing.reviews || []);
  const [showHostProfile, setShowHostProfile] = useState(false);
  
  // Toggles for long lists
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllRules, setShowAllRules] = useState(false);

  const criticalAmenities = useMemo(() => {
    const ids = ['wifi', 'grid_power', 'solar', 'running_water', 'water_tank', 'security'];
    return listing.amenities.filter(a => ids.includes(a.id));
  }, [listing.amenities]);

  const groupedAmenities = useMemo(() => {
    return AMENITY_CATEGORIES.map(cat => ({
      ...cat,
      amenities: cat.amenities.filter(ca => listing.amenities.some(la => la.id === ca.id))
    })).filter(cat => cat.amenities.length > 0);
  }, [listing.amenities]);

  const activeRules = useMemo(() => listing.rules.filter(r => r.enabled), [listing.rules]);

  const handleShare = async () => {
    const shareUrl = window.location.origin + window.location.pathname;
    const shareData = {
      title: `Stay at this Wacu: ${listing.title} | Wacu`,
      text: `Check out this ${listing.type} stay near ${listing.landmark} on Wacu!`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (clipErr) {
        alert('Could not share or copy link.');
      }
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newReview: Review = {
      id: `r-new-${Date.now()}`,
      user: 'Clarisse Keza',
      rating: 5,
      comment: commentText,
      date: 'Just now',
      likes: 0
    };
    setLocalReviews([newReview, ...localReviews]);
    setCommentText('');
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Hi ${listing.hostName}, I'm interested in your Wacu: ${listing.title} on Wacu.`);
    window.open(`https://wa.me/250788000000?text=${message}`, '_blank');
  };

  const getYearsHosting = () => {
    if (!listing.hostJoinDate) return "New Host";
    const yearMatch = listing.hostJoinDate.match(/\d{4}/);
    if (!yearMatch) return "Verified Host";
    const joinYear = parseInt(yearMatch[0]);
    const currentYear = new Date().getFullYear();
    const diff = currentYear - joinYear;
    return diff <= 0 ? "New Host" : `${diff} Year${diff > 1 ? 's' : ''} Hosting`;
  };

  return (
    <div className="flex flex-col animate-slideUp bg-white pb-32 no-scrollbar overflow-y-auto h-full">
      {/* Image Gallery */}
      <div className="relative aspect-[4/3] bg-gray-200">
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover shadow-inner" />
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
          1 / 5 Wacu Photos
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-3">
          <button onClick={(e) => { e.stopPropagation(); onToggleSave(); }} className="p-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl active:scale-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isSaved ? 'text-red-500 fill-current' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button onClick={handleShare} className="p-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl active:scale-90 transition-transform text-xl">📤</button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Title & Stats */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-black text-slate-900 leading-tight flex-1">{listing.title}</h2>
            <div className="text-right">
              <p className="text-xl font-black text-emerald-600">{listing.pricePerNight.toLocaleString()} RWF</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">per night</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-50">
            <div className="flex items-center gap-3">
               <div className="flex items-center text-amber-500 font-black text-sm">★ {listing.rating}</div>
               <span className="text-gray-300">|</span>
               <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">{listing.type}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onToggleLike} className="flex items-center gap-1.5">
                <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase">{listing.likesCount + (isLiked ? 1 : 0)}</span>
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">💬</span>
                <span className="text-[10px] font-black text-slate-500 uppercase">{localReviews.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Amenities Highlight */}
        {criticalAmenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {criticalAmenities.map(a => (
              <div key={a.id} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
                <span className="text-xs">{a.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{a.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Compact Host Card */}
        <div 
          onClick={() => setShowHostProfile(true)}
          className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={listing.hostAvatar} className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md" alt="Host" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Wacu Host</p>
              <h4 className="text-base font-black text-slate-900 leading-none">{listing.hostName}</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Verified Wacu Legend • {listing.hostCompletedStays} Wacus Hosted</p>
            </div>
          </div>
          <span className="text-slate-300 font-black group-hover:translate-x-1 transition-transform">→</span>
        </div>

        {/* Property Description */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">THE STORY OF THIS WACU</h4>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">{listing.description}</p>
          </div>

          {/* Categorized Amenities */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">WACU AMENITIES</h4>
              {groupedAmenities.length > 2 && (
                <button 
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:text-amber-600 transition-colors"
                >
                  {showAllAmenities ? 'Show Less' : `Show All (${listing.amenities.length})`}
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {(showAllAmenities ? groupedAmenities : groupedAmenities.slice(0, 2)).map(cat => (
                <div key={cat.id} className="space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-1">
                    <span className="text-sm">{cat.icon}</span>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.name}</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {cat.amenities.map(amenity => (
                      <div key={amenity.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-50 shadow-sm">
                        <span className="text-lg">{amenity.icon}</span>
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-tight">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {!showAllAmenities && groupedAmenities.length > 2 && (
                <button 
                  onClick={() => setShowAllAmenities(true)}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-[1.5rem] text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  View {listing.amenities.length - groupedAmenities.slice(0, 2).reduce((acc, c) => acc + c.amenities.length, 0)} more amenities
                </button>
              )}
            </div>
          </div>
        </div>

        {/* House Rules Preview Section */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">WACU HOUSE RULES</h4>
              <TrustTooltip title={HOUSE_RULES_TOOLTIPS.general.title} text={HOUSE_RULES_TOOLTIPS.general.text}>
                <span className="text-amber-500 text-[10px] font-black cursor-help uppercase tracking-widest">Why Rules? ⓘ</span>
              </TrustTooltip>
            </div>
            {activeRules.length > 4 && (
              <button 
                onClick={() => setShowAllRules(!showAllRules)}
                className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:text-amber-600 transition-colors"
              >
                {showAllRules ? 'Collapse' : 'Show More'}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {(showAllRules ? activeRules : activeRules.slice(0, 4)).map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-3">
                  <span className="text-sm">📜</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{rule.label}</span>
                      {HOUSE_RULES_TOOLTIPS[rule.id] && (
                        <TrustTooltip title={HOUSE_RULES_TOOLTIPS[rule.id].title} text={HOUSE_RULES_TOOLTIPS[rule.id].text}>
                          <span className="text-amber-500 text-[9px] font-black">ⓘ</span>
                        </TrustTooltip>
                      )}
                    </div>
                    {rule.note && <p className="text-[9px] text-slate-400 font-medium italic mt-0.5 line-clamp-1">{rule.note}</p>}
                  </div>
                </div>
                {rule.meta?.time && (
                  <span className="text-[9px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">{rule.meta.time}</span>
                )}
              </div>
            ))}
            
            {!showAllRules && activeRules.length > 4 && (
               <button 
                onClick={() => setShowAllRules(true)}
                className="p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest"
               >
                 + {activeRules.length - 4} More Rules
               </button>
            )}
          </div>
        </div>

        {/* Community Engagement Section */}
        <div className="space-y-6 pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">THE WACU BUZZ</h4>
            <span className="text-[9px] font-black text-amber-500 uppercase">SEE WHAT THE WACU FAMILY SAYS</span>
          </div>

          <div className="space-y-6">
            {localReviews.map((review) => (
              <div key={review.id} className="space-y-3 animate-fadeIn">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center font-black text-slate-400 text-xs shadow-sm">
                    {review.user.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-black text-slate-800">{review.user}</p>
                      <span className="text-[9px] text-slate-400 font-bold">{review.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl rounded-tl-none">{review.comment}</p>
                    <div className="flex items-center gap-4 pt-1">
                      <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Love this Wacu ({review.likes || 0})</button>
                      <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Reply</button>
                    </div>
                  </div>
                </div>

                {review.id.startsWith('r1') && (
                  <div className="flex gap-4 ml-10 pl-4 border-l-2 border-slate-100">
                    <img src={listing.hostAvatar} className="w-8 h-8 rounded-full flex-shrink-0" alt="Host" />
                    <div className="flex-1 space-y-1">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Wacu Host Reply</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium bg-amber-50/50 p-3 rounded-2xl rounded-tl-none border border-amber-100/50">
                        Thank you for the kind words! We can't wait to have you back soon at our Wacu family home.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl flex items-center gap-3">
             <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the Wacu conversation..." 
              className="flex-1 bg-transparent px-4 py-3 outline-none text-xs font-medium"
             />
             <button 
              onClick={handlePostComment}
              disabled={!commentText.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${commentText.trim() ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-slate-100 text-slate-300'}`}
             >
               →
             </button>
          </div>
        </div>

        {/* Landmark & Directions */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">HOW TO FIND THIS WACU</h4>
          <div className="bg-amber-50/50 p-6 rounded-[2.5rem] border border-amber-100/50 space-y-4 shadow-inner">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Wacu North Star</p>
                <p className="text-sm font-black text-slate-900">{listing.landmark}</p>
              </div>
            </div>
            <p className="text-xs text-amber-900/80 font-bold leading-relaxed italic">"{listing.howToGetThere}"</p>
          </div>
        </div>
      </div>

      {/* Host Profile Modal */}
      {showHostProfile && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowHostProfile(false)} />
          <div className="relative bg-white w-full rounded-t-[3rem] animate-slideUp overflow-hidden max-h-[95vh] flex flex-col">
            <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-4 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Wacu Ambassador</h3>
              <button onClick={() => setShowHostProfile(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-8 no-scrollbar">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <img src={listing.hostAvatar} className="w-32 h-32 rounded-full border-4 border-amber-50 shadow-2xl object-cover" alt="Profile" />
                  <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-2 rounded-full border-4 border-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{listing.hostName}</h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1 bg-emerald-50 px-4 py-1.5 rounded-full inline-block">Wacu Legend</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                 <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-1">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{getYearsHosting()}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-1">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stays Hosted</p>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{listing.hostCompletedStays}+ Stays</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-1">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Response</p>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{listing.hostResponseRate || "100%"}</p>
                 </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About the Wacu host</h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-amber-200 pl-4 py-1">
                    "{listing.hostBio || `I am ${listing.hostName}, and I am passionate about sharing our Wacu and ensuring every guest feels like part of the family.`}"
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-4">
                  {listing.hostLanguages && listing.hostLanguages.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-sm shrink-0">🗣️</div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Languages Spoken</p>
                        <p className="text-xs font-bold text-slate-800">{listing.hostLanguages.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {listing.hostWork && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-sm shrink-0">💼</div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Host Occupation</p>
                        <p className="text-xs font-bold text-slate-800">{listing.hostWork}</p>
                      </div>
                    </div>
                  )}
                  {listing.hostInteraction && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-sm shrink-0">🤝</div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Interaction Style</p>
                        <p className="text-xs font-bold text-slate-800">{listing.hostInteraction}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wacu Trust Badges</h4>
                <TrustBadgeSystem badges={listing.hostTrustBadges || []} variant="grid" />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <span className="text-xs font-bold text-slate-800">Identity Document Confirmed</span>
                    <span className="text-emerald-500 font-black">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <span className="text-xs font-bold text-slate-800">MoMo Payment Verified</span>
                    <span className="text-emerald-500 font-black">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <span className="text-xs font-bold text-slate-800">Community Vouched</span>
                    <span className="text-emerald-500 font-black">✓</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 sticky bottom-0 bg-white">
                <button 
                  onClick={openWhatsApp}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-xl">💬</span> Message on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-5 safe-bottom flex items-center justify-between max-w-md mx-auto shadow-[0_-15px_35px_rgba(0,0,0,0.1)] z-50 rounded-t-[2.5rem]">
        <div className="flex flex-col px-3">
          <span className="text-2xl font-black text-slate-900">{listing.pricePerNight.toLocaleString()} RWF</span>
          <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Rare Wacu Find
          </span>
        </div>
        <button 
          onClick={onBook}
          className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-amber-200 active:scale-95 transition-all transform -translate-y-1"
        >
          Claim Your Wacu Spot!
        </button>
      </div>
    </div>
  );
};
