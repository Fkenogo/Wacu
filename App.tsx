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

// Firebase
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, where, onSnapshot, orderBy, doc, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import * as dbService from './services/db';

// Dashboards
import { GuestTripsView } from './views/GuestTrips';
import { HostDashboard } from './views/host/HostDashboard';
import { AdminDashboard } from './views/admin/AdminDashboard';

// Host Wizard
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

  // Initial Seed
  useEffect(() => {
    dbService.seedInitialData().catch(console.error);
  }, []);

  // Sync session and profile logic
  useEffect(() => {
    if (!user) return;
    const setupProfile = async () => {
      await dbService.createUserProfile(user.uid, user.phoneNumber || '');
      const unsubProfile = onSnapshot(doc(db, "users", user.uid), (snap) => {
        if (snap.exists()) {
          const profileData = snap.data() as GuestProfile;
          setGuestProfile(profileData);
          setUserRole(profileData.role as UserRole);
        }
      });
      const unsubBookings = onSnapshot(
        query(collection(db, "bookings"), where("guestId", "==", user.uid), orderBy("startDate", "desc")),
        (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingState));
          setMyStays(data);
        },
        (error) => {
          if (error.message.includes('requires an index')) {
            onSnapshot(query(collection(db, "bookings"), where("guestId", "==", user.uid)), (snap) => {
              const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingState));
              setMyStays(data.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || '')));
            });
          }
        }
      );
      const unsubHostRequests = onSnapshot(
        query(collection(db, "bookings"), where("hostId", "==", user.uid)),
        (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingState));
          setPendingRequests(data.sort((a, b) => (a.status || '').localeCompare(b.status || '')));
        }
      );
      const unsubHostListings = onSnapshot(
        query(collection(db, "listings"), where("hostId", "==", user.uid)),
        (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as HostListingState));
          setMyListings(data.sort((a, b) => (a.status || '').localeCompare(b.status || '')));
        }
      );
      return () => { unsubProfile(); unsubBookings(); unsubHostRequests(); unsubHostListings(); };
    };
    const cleanup = setupProfile();
    return () => { cleanup.then(cb => cb && cb()); };
  }, [user]);

  // Auth Listener
  useEffect(() => {
    const bypassSession = localStorage.getItem(BYPASS_KEY);
    if (bypassSession) {
      const parsed = JSON.parse(bypassSession);
      setUser(parsed);
      setLoading(false);
      if (currentView === 'ONBOARDING' || currentView === 'LOGIN') setCurrentView('HOME');
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.removeItem(BYPASS_KEY);
        if (currentView === 'ONBOARDING' || currentView === 'LOGIN') setCurrentView('HOME');
        setLoading(false);
      } else {
        if (!localStorage.getItem(BYPASS_KEY)) {
          setUser(null);
          setGuestProfile(null);
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Global Listing feed
  useEffect(() => {
    const q = query(collection(db, "listings"), where("status", "==", "APPROVED"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
      setListings(docs);
    }, (error) => {
      if (error.message.includes('requires an index')) {
        onSnapshot(query(collection(db, "listings"), where("status", "==", "APPROVED")), (snap) => {
           const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
           setListings(docs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Audit stream
  useEffect(() => {
    const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(20));
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AuditEntry));
      setAuditLogs(logs);
    });
  }, []);

  const [booking, setBooking] = useState<BookingState>({
    listingId: null, startDate: null, endDate: null, adults: 1, children: 0, paymentMethod: null, status: 'DRAFT', totalPrice: 0, payoutReleased: false, rulesAcknowledged: false
  });

  const [hostListing, setHostListing] = useState<HostListingState>({
    type: null, tags: [], name: '', description: '', howToGetThere: '', capacity: 2, roomType: 'Entire Place', bathroomType: 'Shared', hostInteraction: 'I give guests privacy', landmark: '', locationDescription: '', what3words: '', amenities: [], rules: DEFAULT_HOUSE_RULES, photos: [], pricePerNight: 0, weeklyDiscount: false, availability: 'Always', verificationMethod: null, verificationCompleted: ['Phone'], vouchDetails: { name: '', phone: '', profileLink: '', isExistingHost: false }, status: 'DRAFT'
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
    setBooking(prev => ({ ...prev, listingId: listing.id, listingTitle: listing.title }));
    navigate('DETAIL');
  };

  const onSetRole = async (role: UserRole) => {
    if (user) await dbService.updateUserProfile(user.uid, { role } as any);
    setUserRole(role);
    if (role === UserRole.GUEST) setCurrentView('HOME');
    else if (role === UserRole.HOST) setCurrentView('HOST_DASHBOARD');
    else if (role === UserRole.ADMIN) setCurrentView('ADMIN_DASHBOARD');
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem(BYPASS_KEY);
    setUser(null);
    setGuestProfile(null);
    setCurrentView('LOGIN');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-500 border-r-4 border-r-transparent"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing WACU Trust Network</p>
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
      case 'HOME': return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} listings={listings} />;
      case 'SEARCH': return <SearchResultsView onSelect={handleSelectListing} listings={listings} wishlistIds={wishlistIds} onToggleWishlist={(id) => setWishlistIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} likedIds={likedIds} onToggleLike={(id) => setLikedIds(p => { const n = new Set(p); if(n.has(id)) n.delete(id); else n.add(id); return n; })} />;
      case 'DETAIL': return selectedListing ? <ListingDetailView listing={selectedListing} guest={guestProfile} isSaved={wishlistIds.includes(selectedListing.id)} isLiked={likedIds.has(selectedListing.id)} onToggleSave={() => setWishlistIds(p => p.includes(selectedListing.id) ? p.filter(x => x !== selectedListing.id) : [...p, selectedListing.id])} onToggleLike={() => setLikedIds(p => { const n = new Set(p); if(n.has(selectedListing.id)) n.delete(selectedListing.id); else n.add(selectedListing.id); return n; })} onBook={() => navigate('BOOKING_DATES')} /> : null;
      case 'WISHLIST': return <WishlistView listings={listings.filter(l => wishlistIds.includes(l.id))} onSelect={handleSelectListing} onToggleSave={(id) => setWishlistIds(p => p.filter(x => x !== id))} onExplore={() => navigate('HOME')} />;
      case 'GUEST_STAYS': return <GuestTripsView trips={myStays} onExplore={() => navigate('HOME')} onUpdateStatus={() => {}} onReview={() => {}} onSafetyCheck={() => {}} seenTooltips={seenTooltips} onDismissTooltip={(id) => setSeenTooltips(p => new Set(p).add(id))} />;
      case 'PROFILE': return guestProfile ? <ProfileView guest={guestProfile} onSetRole={onSetRole} currentRole={userRole} onVerify={() => navigate('GUEST_VERIFICATION')} onNavigateAdmin={() => navigate('ADMIN_DASHBOARD')} onNavigateHost={() => navigate('HOST_DASHBOARD')} onNavigateReferrals={() => navigate('REFERRAL_DASHBOARD')} onNavigateStays={() => navigate('GUEST_STAYS')} /> : null;
      case 'BOOKING_DATES': return selectedListing ? <BookingDatesView listing={selectedListing} booking={booking} onUpdate={(u) => setBooking(p => ({ ...p, ...u }))} onContinue={() => navigate('BOOKING_SUMMARY')} /> : null;
      case 'BOOKING_SUMMARY': return selectedListing && guestProfile ? <BookingSummaryView listing={selectedListing} booking={booking} guest={guestProfile} onUpdate={(u) => setBooking(p => ({ ...p, ...u }))} onContinue={() => navigate('PAYMENT')} onNavigateToVerify={() => navigate('GUEST_VERIFICATION')} /> : null;
      case 'PAYMENT': return selectedListing ? <PaymentMethodView listing={selectedListing} booking={booking} onSelect={() => navigate('PROCESSING')} onConfirmedSent={() => { setBooking(p => ({ ...p, guestPaymentMarked: true })); navigate('CONFIRMED'); }} onHelp={() => navigate('GUEST_PAYMENT_EDUCATION')} seenTooltips={seenTooltips} onDismissTooltip={(id) => setSeenTooltips(p => new Set(p).add(id))} /> : null;
      case 'GUEST_PAYMENT_EDUCATION': return <PaymentEducationView type="GUEST" onComplete={goBack} />;
      case 'PROCESSING': return <ProcessingView onFinish={async () => {
        const finalBooking = { ...booking, guestId: user.uid, guestName: guestProfile?.name, hostId: selectedListing?.hostId, status: 'CONFIRMED', dateSubmitted: new Date().toISOString(), paymentMethodType: selectedListing?.paymentMethodType };
        await dbService.createBooking(finalBooking); navigate('CONFIRMED');
      }} />;
      case 'CONFIRMED': return selectedListing ? <ConfirmationView listing={selectedListing} booking={booking} onHome={() => navigate('HOME')} seenTooltips={seenTooltips} onDismissTooltip={(id) => setSeenTooltips(p => new Set(p).add(id))} /> : null;
      case 'HOST_DASHBOARD': return <HostDashboard listings={myListings} requests={pendingRequests} onUpdateStatus={dbService.updateBookingStatus} onReleasePayout={() => {}} onReviewGuest={() => {}} onStartListing={() => navigate('HOST_WELCOME')} onConfirmPayment={dbService.confirmBookingPayment} onRaisePaymentDispute={dbService.raisePaymentDispute} onMarkCommissionRemitted={dbService.markCommissionSent} onPaymentsHelp={() => navigate('HOST_PAYMENT_EDUCATION')} onFAQs={() => navigate('FAQS')} onPolicy={() => navigate('PAYMENTS_POLICY')} seenTooltips={seenTooltips} onDismissTooltip={(id) => setSeenTooltips(p => new Set(p).add(id))} />;
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
      case 'HOST_STATUS': return <SubmissionStatus onHome={() => navigate('HOST_DASHBOARD' as any)} />;
      case 'ADMIN_DASHBOARD': return <AdminDashboard listings={listings} trips={myStays} requests={pendingRequests} auditLogs={auditLogs} onUpdateStatus={dbService.updateBookingStatus} onResolveDispute={() => {}} />;
      case 'REFERRAL_DASHBOARD': return guestProfile ? <ReferralDashboard onBack={goBack} referralCount={guestProfile.referralCount} trustPoints={guestProfile.trustPoints} userId={user.uid} /> : null;
      case 'GUEST_VERIFICATION': return guestProfile ? <GuestVerificationView guest={guestProfile} onUpdate={(u) => dbService.updateUserProfile(user.uid, u)} onComplete={goBack} /> : null;
      case 'FAQS': return <FAQs />;
      case 'PAYMENTS_POLICY': return <PaymentsPolicy />;
      default: return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} listings={listings} />;
    }
  };

  return (
    <Layout 
      title={currentView === 'LOGIN' ? 'ACCESS' : (currentView === 'HOME' ? 'WACU' : currentView.replace('_', ' '))} 
      onBack={currentView !== 'HOME' && currentView !== 'ONBOARDING' && currentView !== 'LOGIN' ? goBack : undefined}
      hideHeader={['ONBOARDING', 'HOME', 'PROCESSING', 'LOGIN'].includes(currentView)}
    >
      <div className="flex-1 pb-24">
        {renderView()}
      </div>

      {/* Quick Actions FAB Overlay */}
      {showQuickActions && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowQuickActions(false)} />
          <div className="relative bg-white w-full rounded-t-[3rem] p-8 space-y-8 animate-slideUp safe-bottom">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto -mt-4 mb-4" />
            <div className="text-center space-y-2">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Wacu Quick Access</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Join the community</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setShowQuickActions(false); navigate('HOST_WELCOME'); }}
                className="w-full flex items-center gap-6 p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl active:scale-95 transition-all group"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">🏡</div>
                <div className="text-left">
                   <p className="font-black text-amber-400 text-[10px] uppercase tracking-widest">Share your home</p>
                   <p className="text-lg font-black leading-tight">Add a new Wacu</p>
                </div>
              </button>
              
              <button 
                onClick={() => { setShowQuickActions(false); navigate('SEARCH'); }}
                className="w-full flex items-center gap-6 p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm active:scale-95 transition-all group"
              >
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">🔍</div>
                <div className="text-left">
                   <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Discover Rwanda</p>
                   <p className="text-lg font-black leading-tight text-slate-900">Find your next Stay</p>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setShowQuickActions(false)}
              className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]"
            >
              Cancel
            </button>
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