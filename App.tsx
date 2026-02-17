
import React, { useState, useEffect } from 'react';
import { View, Listing, BookingState, HostListingState, UserRole, GuestProfile, AuditEntry } from './types';
import { DEFAULT_HOUSE_RULES } from './constants';
import { Layout } from './components/Layout';
import { HomeView } from './views/Home';
import { SearchResultsView } from './views/SearchResults';
import { ListingDetailView } from './views/ListingDetail';
import { BookingDatesView } from './views/BookingDates';
import { BookingSummaryView } from './views/BookingSummary';
import { GuestVerificationView } from './views/GuestVerification';
import { PaymentMethodView } from './views/PaymentMethod';
import { ProcessingView } from './views/Processing';
import { ConfirmationView } from './views/Confirmation';
import { BottomNav } from './components/BottomNav';
import { ProfileView } from './views/Profile';
import { ReviewStayView } from './views/ReviewStay';
import { TrustOverviewView } from './views/TrustOverview';
import { WishlistView } from './views/Wishlist';
import { ReferralDashboard } from './views/ReferralDashboard';
import { PaymentEducationView } from './views/PaymentEducation';
import { PaymentsPolicy } from './views/PaymentsPolicy';
import { FAQs } from './views/FAQs';
import { Onboarding } from './views/Onboarding';
import { LoginView } from './views/LoginView';

// Sub-views for specific roles
import { GuestTripsView } from './views/GuestTrips';
import { HostDashboard } from './views/host/HostDashboard';
import { HostWelcome } from './views/host/HostWelcome';
import { PropertyTypeSelection } from './views/host/PropertyTypeSelection';
import { PropertyTagsSelection } from './views/host/PropertyTagsSelection';
import { PropertyDetails } from './views/host/PropertyDetails';
import { LocationSetup } from './views/host/LocationSetup';
import { AmenitiesRules } from './views/host/AmenitiesRules';
import { PhotosMedia } from './views/host/PhotosMedia';
import { PricingAvailability } from './views/host/PricingAvailability';
import { PaymentSetup } from './views/host/PaymentSetup';
import { VerificationMethod } from './views/host/VerificationMethod';
import { SubmissionStatus } from './views/host/SubmissionStatus';
import { AdminDashboard } from './views/admin/AdminDashboard';

// Firebase Services
import { auth, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, limit } from "firebase/firestore";
import * as dbService from './services/db';

const BYPASS_KEY = 'WACU_BYPASS_SESSION';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View | 'LOGIN'>('ONBOARDING');
  const [history, setHistory] = useState<(View | 'LOGIN')[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [myStays, setMyStays] = useState<BookingState[]>([]);
  const [myListings, setMyListings] = useState<HostListingState[]>([]);
  const [pendingRequests, setPendingRequests] = useState<BookingState[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [seenTooltips, setSeenTooltips] = useState<Set<string>>(new Set());
  const [guestProfile, setGuestProfile] = useState<GuestProfile | null>(null);

  useEffect(() => {
    dbService.seedInitialData().catch(e => console.warn("Seed skipped/failed:", e));
  }, []);

  useEffect(() => {
    const bypassSession = localStorage.getItem(BYPASS_KEY);
    if (bypassSession) {
      try {
        const parsed = JSON.parse(bypassSession);
        setUser(parsed);
        setLoading(false);
        if (currentView === 'ONBOARDING' || currentView === 'LOGIN') setCurrentView('HOME');
      } catch (e) {
        localStorage.removeItem(BYPASS_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.removeItem(BYPASS_KEY);
        if (currentView === 'ONBOARDING' || currentView === 'LOGIN') setCurrentView('HOME');
      } else {
        if (!localStorage.getItem(BYPASS_KEY)) {
          setUser(null);
          setGuestProfile(null);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Auth listener error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    let unsubscribes: (() => void)[] = [];
    
    const initProfile = async () => {
      try {
        await dbService.createUserProfile(user.uid, user.phoneNumber || '');
        
        const unsubProfile = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) {
            const profileData = snap.data() as GuestProfile;
            setGuestProfile(profileData);
            if (profileData.role) setUserRole(profileData.role as UserRole);
          }
        });
        unsubscribes.push(unsubProfile);

        const unsubBookings = onSnapshot(
          query(collection(db, "bookings"), where("guestId", "==", user.uid)),
          (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingState));
            setMyStays(data.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || '')));
          }
        );
        unsubscribes.push(unsubBookings);

        const unsubHostRequests = onSnapshot(
          query(collection(db, "bookings"), where("hostId", "==", user.uid)),
          (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingState));
            setPendingRequests(data.sort((a, b) => (a.status || '').localeCompare(b.status || '')));
          }
        );
        unsubscribes.push(unsubHostRequests);

        const unsubHostListings = onSnapshot(
          query(collection(db, "listings"), where("hostId", "==", user.uid)),
          (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as HostListingState));
            setMyListings(data.sort((a, b) => (a.status || '').localeCompare(b.status || '')));
          }
        );
        unsubscribes.push(unsubHostListings);

      } catch (err) {
        console.error("Profile sync error:", err);
      }
    };
    
    initProfile();
    return () => unsubscribes.forEach(fn => fn());
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, "listings"), where("status", "==", "APPROVED"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
      setListings(docs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }, (error) => {
      console.warn("Listing feed error:", error);
    });
    return () => unsubscribe();
  }, []);

  const [booking, setBooking] = useState<BookingState>({
    listingId: null, startDate: null, endDate: null, adults: 1, children: 0, paymentMethod: null, status: 'DRAFT', totalPrice: 0, payoutReleased: false, rulesAcknowledged: false
  });

  const [hostListing, setHostListing] = useState<HostListingState>({
    type: null, tags: [], name: '', description: '', howToGetThere: '', capacity: 2, roomType: 'Entire Place', bathroomType: 'Shared', hostInteraction: 'I give guests privacy', landmark: '', locationDescription: '', what3words: '', amenities: [], rules: DEFAULT_HOUSE_RULES, photos: [], pricePerNight: 0, weeklyDiscount: false, availability: 'Always', verificationMethod: null, verificationCompleted: ['Phone'], status: 'DRAFT'
  });

  const navigate = (nextView: View | 'LOGIN') => {
    setHistory(prev => [...prev, currentView]);
    setCurrentView(nextView);
    setShowQuickActions(false);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prevView = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentView(prevView);
    }
  };

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setBooking(prev => ({ 
      ...prev, 
      listingId: listing.id, 
      listingTitle: listing.title,
      totalPrice: listing.pricePerNight 
    }));
    navigate('DETAIL');
  };

  const onSetRole = async (role: UserRole) => {
    if (user) await dbService.updateUserProfile(user.uid, { role } as any);
    setUserRole(role);
    if (role === UserRole.GUEST) setCurrentView('HOME');
    else if (role === UserRole.HOST) setCurrentView('HOST_DASHBOARD');
    else if (role === UserRole.ADMIN) setCurrentView('ADMIN_DASHBOARD');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-r-4 border-r-transparent"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Establishing KAZE Trust Network</p>
      </div>
    );
  }

  const renderView = () => {
    if (!user && !['ONBOARDING', 'LOGIN'].includes(currentView)) {
      return <LoginView onSuccess={(u) => { setUser(u); navigate('HOME'); }} onBack={() => setCurrentView('ONBOARDING')} />;
    }

    switch (currentView) {
      case 'ONBOARDING': return <Onboarding onComplete={() => navigate('LOGIN')} />;
      case 'LOGIN': return <LoginView onSuccess={(u) => { setUser(u); navigate('HOME'); }} onBack={() => setCurrentView('ONBOARDING')} />;
      case 'HOME': return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} listings={listings} guestAvatar={guestProfile?.avatar} />;
      case 'SEARCH': return <SearchResultsView onSelect={handleSelectListing} listings={listings} wishlistIds={wishlistIds} onToggleWishlist={(id) => setWishlistIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} likedIds={likedIds} onToggleLike={(id) => setLikedIds(p => { const n = new Set(p); if(n.has(id)) n.delete(id); else n.add(id); return n; })} />;
      case 'DETAIL': return selectedListing ? (
        <ListingDetailView 
          listing={selectedListing} 
          guest={guestProfile} 
          isSaved={wishlistIds.includes(selectedListing.id)} 
          isLiked={likedIds.has(selectedListing.id)} 
          onToggleSave={() => setWishlistIds(p => p.includes(selectedListing.id) ? p.filter(x => x !== selectedListing.id) : [...p, selectedListing.id])} 
          onToggleLike={() => setLikedIds(p => { const n = new Set(p); if(n.has(selectedListing.id)) n.delete(selectedListing.id); else n.add(selectedListing.id); return n; })} 
          onBookingComplete={(b) => { setBooking(b); navigate('PROCESSING'); }} 
          onNavigateToVerify={() => navigate('GUEST_VERIFICATION')}
          onHelp={() => navigate('GUEST_PAYMENT_EDUCATION')}
          seenTooltips={seenTooltips}
          onDismissTooltip={(id) => setSeenTooltips(p => new Set(p).add(id))}
        />
      ) : null;
      case 'WISHLIST': return <WishlistView listings={listings.filter(l => wishlistIds.includes(l.id))} onSelect={handleSelectListing} onToggleSave={(id) => setWishlistIds(p => p.filter(x => x !== id))} onExplore={() => navigate('HOME')} />;
      case 'GUEST_STAYS': return <GuestTripsView trips={myStays} onExplore={() => navigate('HOME')} onUpdateStatus={(id, status) => dbService.updateBookingStatus(id, status)} onReview={(id) => navigate('REVIEW_STAY')} onSafetyCheck={(id, sat) => {}} seenTooltips={seenTooltips} onDismissTooltip={(id) => setSeenTooltips(p => new Set(p).add(id))} />;
      case 'PROFILE': return guestProfile ? <ProfileView guest={guestProfile} onSetRole={onSetRole} currentRole={userRole} onVerify={() => navigate('GUEST_VERIFICATION')} onNavigateAdmin={() => navigate('ADMIN_DASHBOARD')} onNavigateHost={() => navigate('HOST_DASHBOARD')} onNavigateReferrals={() => navigate('REFERRAL_DASHBOARD')} onNavigateStays={() => navigate('GUEST_STAYS')} onBack={goBack} /> : null;
      case 'HOST_DASHBOARD': return <HostDashboard listings={myListings} requests={pendingRequests} onUpdateStatus={dbService.updateBookingStatus} onStartListing={() => navigate('HOST_WELCOME')} onConfirmPayment={dbService.confirmBookingPayment} />;
      case 'HOST_WELCOME': return <HostWelcome onStart={() => navigate('HOST_TYPE')} />;
      case 'HOST_TYPE': return <PropertyTypeSelection state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onContinue={() => navigate('HOST_TAGS')} />;
      case 'HOST_TAGS': return <PropertyTagsSelection state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onContinue={() => navigate('HOST_DETAILS')} />;
      case 'HOST_DETAILS': return <PropertyDetails state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onContinue={() => navigate('HOST_LOCATION')} />;
      case 'HOST_LOCATION': return <LocationSetup state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onContinue={() => navigate('HOST_AMENITIES')} />;
      case 'HOST_AMENITIES': return <AmenitiesRules state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onContinue={() => navigate('HOST_PHOTOS')} />;
      case 'HOST_PHOTOS': return <PhotosMedia state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onContinue={() => navigate('HOST_PRICING')} />;
      case 'HOST_PRICING': return <PricingAvailability state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onContinue={() => navigate('HOST_PAYMENT_SETUP')} />;
      case 'HOST_PAYMENT_SETUP': return <PaymentSetup state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onContinue={() => navigate('HOST_VERIFICATION')} onHelp={() => navigate('HOST_PAYMENT_EDUCATION')} seenTooltips={seenTooltips} onDismissTooltip={(id) => setSeenTooltips(p => new Set(p).add(id))} />;
      case 'HOST_VERIFICATION': return <VerificationMethod state={hostListing} onUpdate={(u) => setHostListing(p => ({ ...p, ...u }))} onSubmit={() => { dbService.submitListing(user.uid, guestProfile?.name || 'Host', guestProfile?.avatar || '', hostListing); navigate('HOST_STATUS'); }} />;
      case 'HOST_STATUS': return <SubmissionStatus onHome={() => navigate('HOST_DASHBOARD')} />;
      case 'ADMIN_DASHBOARD': return <AdminDashboard listings={listings} trips={myStays} requests={pendingRequests} auditLogs={auditLogs} onUpdateStatus={dbService.updateBookingStatus} onResolveDispute={() => {}} />;
      case 'REFERRAL_DASHBOARD': return guestProfile ? <ReferralDashboard onBack={goBack} referralCount={guestProfile.referralCount} trustPoints={guestProfile.trustPoints} userId={user.uid} /> : null;
      case 'GUEST_VERIFICATION': return guestProfile ? <GuestVerificationView guest={guestProfile} onUpdate={(u) => dbService.updateUserProfile(user.uid, u)} onComplete={goBack} /> : null;
      case 'FAQS': return <FAQs />;
      case 'PAYMENTS_POLICY': return <PaymentsPolicy />;
      default: return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} listings={listings} guestAvatar={guestProfile?.avatar} />;
    }
  };

  return (
    <Layout 
      title={currentView === 'LOGIN' ? 'ACCESS' : (currentView === 'HOME' ? 'KAZE' : currentView.replace('_', ' '))} 
      onBack={currentView !== 'HOME' && currentView !== 'ONBOARDING' && currentView !== 'LOGIN' ? goBack : undefined}
      hideHeader={['ONBOARDING', 'HOME', 'PROCESSING', 'LOGIN', 'PROFILE', 'WISHLIST'].includes(currentView)}
    >
      <div className="flex-1 pb-24 overflow-y-auto no-scrollbar">
        {renderView()}
      </div>

      {showQuickActions && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowQuickActions(false)} />
          <div className="relative bg-white w-full rounded-t-[3rem] p-8 space-y-4 animate-slideUp safe-bottom">
            <div className="w-12 h-1 bg-primary/20 rounded-full mx-auto mb-6" />
            <div className="text-center mb-8">
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Community Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => { setShowQuickActions(false); navigate('SEARCH'); }}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm active:scale-95 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl shrink-0">🔍</div>
                <div className="text-left">
                   <p className="font-bold text-slate-900 text-sm">Find a wacu</p>
                   <p className="text-slate-400 text-xs">Discover nearby spaces</p>
                </div>
              </button>
              <button 
                onClick={() => { setShowQuickActions(false); navigate('HOST_WELCOME'); }}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm active:scale-95 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl shrink-0">🏠</div>
                <div className="text-left">
                   <p className="font-bold text-slate-900 text-sm">Become a host</p>
                   <p className="text-slate-400 text-xs">Share your unique space</p>
                </div>
              </button>
            </div>
            <div className="pt-4 flex justify-center">
              <button onClick={() => setShowQuickActions(false)} className="py-3 px-10 bg-gray-100 rounded-full text-slate-900 font-bold text-sm">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {['HOME', 'SEARCH', 'GUEST_STAYS', 'PROFILE', 'HOST_DASHBOARD', 'WISHLIST', 'ADMIN_DASHBOARD'].includes(currentView) && (
        <BottomNav 
          currentView={currentView as View} 
          role={userRole} 
          onNavigate={navigate}
          onOpenQuickActions={() => setShowQuickActions(true)}
        />
      )}
    </Layout>
  );
};

export default App;
