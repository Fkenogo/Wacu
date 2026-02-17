
import React, { useState, useMemo } from 'react';
import { Listing, Review, GuestProfile, BookingState } from '../types';
import { TrustBadgeSystem } from '../components/TrustComponents';
import { BookingDatesView } from './BookingDates';
import { BookingSummaryView } from './BookingSummary';
import { PaymentMethodView } from './PaymentMethod';
import * as dbService from '../services/db';
import { auth } from '../firebase';

interface ListingDetailViewProps {
  listing: Listing;
  guest?: GuestProfile | null;
  isSaved: boolean;
  isLiked: boolean;
  onToggleSave: () => void;
  onToggleLike: () => void;
  onBookingComplete: (booking: BookingState) => void;
  onNavigateToVerify: () => void;
  onHelp: () => void;
  seenTooltips: Set<string>;
  onDismissTooltip: (id: string) => void;
}

export const ListingDetailView: React.FC<ListingDetailViewProps> = ({ 
  listing, 
  guest, 
  isSaved, 
  isLiked, 
  onToggleSave, 
  onToggleLike, 
  onBookingComplete,
  onNavigateToVerify,
  onHelp,
  seenTooltips,
  onDismissTooltip
}) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [bookingStep, setBookingStep] = useState<0 | 1 | 2 | 3>(0);
  const [internalBooking, setInternalBooking] = useState<BookingState>({
    listingId: listing.id,
    listingTitle: listing.title,
    startDate: null,
    endDate: null,
    adults: 1,
    children: 0,
    paymentMethod: null,
    status: 'DRAFT',
    totalPrice: listing.pricePerNight,
    payoutReleased: false,
    rulesAcknowledged: false
  });

  const handleLike = async () => {
    if (!auth.currentUser) return;
    onToggleLike();
    await dbService.toggleLikeListing(listing.id, auth.currentUser.uid);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: `Check out this Wacu: ${listing.title} at ${listing.landmark}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
      await dbService.incrementShares(listing.id);
    } catch (err) {
      console.warn("Share failed", err);
    }
  };

  const photos = listing.photos || [listing.image];

  return (
    <div className="flex flex-col animate-fadeIn bg-white min-h-screen relative pb-32">
      {/* 1. Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-4 items-center">
        <button 
          onClick={() => window.history.back()}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-slate-900">arrow_back</span>
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleShare}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-slate-900">share</span>
          </button>
          <button 
            onClick={handleLike}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all"
          >
            <span className={`material-symbols-outlined ${isLiked ? 'text-red-500 fill-current' : 'text-slate-900'}`}>favorite</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Image Section */}
      <div className="relative aspect-[4/3] w-full">
        <img src={listing.image} className="w-full h-full object-cover" alt={listing.title} />
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-bold tracking-widest">
          1/{photos.length}
        </div>
      </div>

      {/* 3. Title & Info Section */}
      <div className="px-6 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
            {listing.title}
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <p>{listing.landmark}, Rwanda • {listing.bedsCount || 2} beds • {listing.bathroomCount} baths • {listing.capacity} guests</p>
          </div>
        </div>

        {/* Community Engagement Stats (Wacu Buzz) */}
        <div className="flex items-center gap-6 px-1">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none">{listing.likesCount || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Likes</span>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none">{listing.sharesCount || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Shares</span>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none">{listing.reviewCount || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reviews</span>
          </div>
        </div>

        {/* Community Favorite Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between group active:bg-slate-50 transition-all">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">💬</div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px] font-bold">star</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Community Favorite</span>
                <span className="text-slate-900 font-black text-sm">Wacu Buzz</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-black text-slate-900 text-sm">{listing.rating}</span>
                <div className="flex text-amber-500 text-[10px]">★★★★★</div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic">"One of the most loved by travelers..."</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300">chevron_right</span>
        </div>

        {/* Host Card */}
        <div className="flex items-center justify-between py-6 border-y border-slate-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={listing.hostAvatar} className="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-100" alt={listing.hostName} />
              {listing.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-base">Hosted by {listing.hostName}</h4>
              <p className="text-xs text-slate-400 font-bold">
                {listing.isVerified ? 'Verified Host' : 'KAZE Member'} • {listing.hostJoinDate || 'Joining recently'}
              </p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 uppercase tracking-widest active:scale-95 transition-all shadow-sm">
            Contact
          </button>
        </div>

        {/* Host Bio Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Meet your host</h3>
          <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
             <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
               "{listing.hostBio || 'I am excited to welcome you to our Wacu community stay. We pride ourselves on authentic Rwandan hospitality.'}"
             </p>
             <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Languages</p>
                   <p className="text-xs font-bold text-slate-900">{listing.hostLanguages?.join(', ') || 'Kinyarwanda, English'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Response Rate</p>
                   <p className="text-xs font-bold text-slate-900">{listing.hostResponseRate || '95%'}</p>
                </div>
             </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">About this space</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            {listing.description || "Experience unparalleled luxury in the heart of Kigali. This architecturally stunning villa offers panoramic views of the hills, high-end Italian finishes, and a private infinity pool."}
          </p>
          <button className="flex items-center gap-1 text-slate-900 font-black text-sm border-b-2 border-slate-900 pb-0.5">
            Show more <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        {/* What this place offers */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">What this place offers</h3>
          <div className="space-y-5">
            {listing.amenities.slice(0, 5).map(amenity => (
              <div key={amenity.id} className="flex items-start gap-4">
                <span className="text-xl">{amenity.icon}</span>
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-slate-900">{amenity.name}</p>
                </div>
              </div>
            ))}
          </div>
          {listing.amenities.length > 5 && (
            <button 
              onClick={() => setShowAllAmenities(true)}
              className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 uppercase tracking-[0.1em] active:scale-[0.98] transition-all"
            >
              Show all {listing.amenities.length} amenities
            </button>
          )}
        </div>

        {/* Wacu North Star Guide */}
        <div className="space-y-6 pt-8">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Wacu North Star Guide</h3>
            <span className="bg-primary text-[#1d180c] px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Neighborhood Expert</span>
          </div>
          
          <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl bg-slate-50 aspect-[16/10]">
            <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/29.8739,1.9441,12/800x450?access_token=none')] bg-cover"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary animate-pulse">
                <div className="w-4 h-4 bg-primary rounded-full shadow-lg"></div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 grid grid-cols-3 gap-2 bg-white/60 backdrop-blur-md border-t border-white/40">
              <div className="text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Safety</p>
                <p className="text-lg font-black text-emerald-600">9.8</p>
              </div>
              <div className="text-center border-x border-slate-200/50">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Transit</p>
                <p className="text-lg font-black text-slate-900">8.2</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vibe</p>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight pt-1">Peaceful</p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 font-medium leading-relaxed italic text-center px-4">
            "{listing.landmark} is one of Rwanda's most vibrant areas. It's safe for evening walks and very welcoming to visitors." — {listing.hostName}
          </p>
        </div>
      </div>

      {/* GUIDED BOOKING MODAL */}
      {bookingStep > 0 && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setBookingStep(0)} />
          <div className="relative bg-white w-full max-w-md mx-auto rounded-t-[3rem] animate-slideUp overflow-hidden max-h-[95vh] flex flex-col shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-4 flex justify-between items-center border-b border-slate-50">
              <div>
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Request Booking</h3>
                 <div className="flex gap-1.5 mt-2">
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`h-1 rounded-full transition-all ${bookingStep >= s ? 'w-6 bg-amber-500' : 'w-2 bg-slate-100'}`} />
                    ))}
                 </div>
              </div>
              <button onClick={() => setBookingStep(0)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center font-black text-slate-400">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
               {bookingStep === 1 && (
                 <BookingDatesView listing={listing} booking={internalBooking} onUpdate={(u) => setInternalBooking(p => ({ ...p, ...u }))} onContinue={() => setBookingStep(2)} />
               )}
               {bookingStep === 2 && guest && (
                 <BookingSummaryView listing={listing} booking={internalBooking} guest={guest} onUpdate={(u) => setInternalBooking(p => ({ ...p, ...u }))} onContinue={(needsVerify) => needsVerify ? onNavigateToVerify() : setBookingStep(3)} onNavigateToVerify={onNavigateToVerify} />
               )}
               {bookingStep === 3 && (
                 <PaymentMethodView listing={listing} booking={internalBooking} onSelect={() => onBookingComplete(internalBooking)} onConfirmedSent={() => onBookingComplete({ ...internalBooking, guestPaymentMarked: true })} onHelp={onHelp} seenTooltips={seenTooltips} onDismissTooltip={onDismissTooltip} />
               )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 safe-bottom flex items-center justify-between max-w-md mx-auto z-40 rounded-t-[2.5rem] shadow-2xl">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">RWF {listing.pricePerNight.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">/ night</span>
          </div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mt-0.5">Flexible dates available</span>
        </div>
        <button 
          onClick={() => setBookingStep(1)}
          className="bg-primary hover:bg-primary/90 text-[#1d180c] px-10 py-4 rounded-[1.2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all transform -translate-y-0.5"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
