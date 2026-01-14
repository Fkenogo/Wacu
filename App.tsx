
import React, { useState, useEffect } from 'react';
import { View, Listing, BookingState, HostListingState, UserRole, GuestProfile, StructuredReview, AuditEntry, TrustBadge } from './types';
import { MOCK_LISTINGS, AMENITIES } from './constants';
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

// Role Dashboards
import { GuestTripsView } from './views/GuestTrips';
import { HostDashboard } from './views/host/HostDashboard';
import { VerifierDashboard } from './views/verifier/VerifierDashboard';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminPanel } from './views/admin/AdminPanel';

// Host Views
import { HostWelcome } from './views/host/HostWelcome';
import { PropertyTypeSelection } from './views/host/PropertyTypeSelection';
import { PropertyTagsSelection } from './views/host/PropertyTagsSelection';
import { PropertyDetails } from './views/host/PropertyDetails';
import { LocationSetup } from './views/host/LocationSetup';
import { AmenitiesRules } from './views/host/AmenitiesRules';
import { PhotosMedia } from './views/host/PhotosMedia';
import { PricingAvailability } from './views/host/PricingAvailability';
import { VerificationMethod } from './views/host/VerificationMethod';
import { SubmissionStatus } from './views/host/SubmissionStatus';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [history, setHistory] = useState<View[]>([]);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeReviewTrip, setActiveReviewTrip] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [hasAdminRights, setHasAdminRights] = useState(false);

  // Engagement State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev => 
      prev.includes(id) 
        ? prev.filter(wishId => wishId !== id) 
        : [...prev, id]
    );
  };

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Dynamic Guest State
  const [guestProfile, setGuestProfile] = useState<GuestProfile>({
    name: 'Clarisse Keza',
    phone: '0788123456',
    isPhoneVerified: true,
    bio: 'Avid traveler and community builder from Kigali.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
    verificationLevel: 2,
    badges: ['Contact Verified', 'Identity Verified'], 
    completedStays: 5,
    hostRecommendationRate: 98,
    identityDocumentStored: true,
    safetyPledgeAccepted: true
  });

  // MOCK DATA FOR TESTING ALL FLOWS
  const [myTrips, setMyTrips] = useState<BookingState[]>([
    {
      id: 'BK-PREV-01',
      listingId: '1',
      hostName: 'Jean Bosco',
      startDate: '2024-01-10',
      endDate: '2024-01-15',
      status: 'COMPLETED',
      totalPrice: 62500,
      payoutReleased: true,
      rulesAcknowledged: true,
      guestReview: { submitted: false, q1: false, q2: false, q3: false }
    }
  ]);
  
  const [myListings, setMyListings] = useState<HostListingState[]>([
    {
      id: 'LS-001',
      name: 'The Secret Hillside Haven',
      type: 'Entire Home' as any,
      status: 'APPROVED',
      pricePerNight: 25000,
      capacity: 4,
      landmark: 'Amahoro Stadium',
      description: 'A beautiful hidden gem with a perfect view of the hills.',
      photos: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
      amenities: ['wifi', 'kitchen', 'shower'],
      tags: ['Family-friendly', 'Host lives on site'],
      rules: { smoking: false, pets: true, curfew: false },
      hostName: 'Clarisse Keza',
      dateSubmitted: '2023-11-15'
    }
  ]);

  const [pendingRequests, setPendingRequests] = useState<BookingState[]>([
    {
      id: 'BK-991',
      listingId: 'LS-001',
      guestName: 'Emmanuel Mugisha',
      guestProfile: {
        name: 'Emmanuel Mugisha',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
        verificationLevel: 2,
        badges: ['Identity Verified', 'Safety Pledge'],
        completedStays: 12,
        hostRecommendationRate: 100,
        phone: '0780000000',
        isPhoneVerified: true,
        bio: 'Visiting for a business conference. Respectful and quiet.',
        identityDocumentStored: true,
        safetyPledgeAccepted: true
      },
      startDate: '2024-03-10',
      endDate: '2024-03-14',
      status: 'PENDING_APPROVAL',
      totalPrice: 102000,
      payoutReleased: false,
      rulesAcknowledged: true
    }
  ]);

  const [booking, setBooking] = useState<BookingState>({
    listingId: null,
    startDate: null,
    endDate: null,
    adults: 1,
    children: 0,
    paymentMethod: null,
    status: 'DRAFT',
    totalPrice: 0,
    payoutReleased: false,
    purposeOfStay: 'Tourism',
    rulesAcknowledged: false
  });

  const [hostListing, setHostListing] = useState<HostListingState>({
    type: null,
    tags: [],
    name: '',
    description: '',
    howToGetThere: '',
    capacity: 2,
    roomType: 'Entire Place',
    bathroomType: 'Shared',
    hostInteraction: 'I give guests privacy',
    landmark: '',
    locationDescription: '',
    what3words: '',
    amenities: [],
    rules: { smoking: false, pets: false, curfew: false },
    photos: [],
    pricePerNight: 0,
    weeklyDiscount: false,
    availability: 'Always',
    verificationMethod: null,
    verificationCompleted: ['Phone'],
    status: 'DRAFT'
  });

  const navigate = (nextView: View) => {
    setHistory(prev => [...prev, currentView]);
    setCurrentView(nextView);
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
    setBooking(prev => ({ ...prev, listingId: listing.id }));
    navigate('DETAIL');
  };

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking(prev => {
      const newBooking = { ...prev, ...updates };
      if (selectedListing && newBooking.startDate && newBooking.endDate) {
        const start = new Date(newBooking.startDate);
        const end = new Date(newBooking.endDate);
        const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
        newBooking.totalPrice = (selectedListing.pricePerNight * nights) + 2000;
      }
      return newBooking;
    });
  };

  const updateHostListing = (updates: Partial<HostListingState>) => {
    setHostListing(prev => ({ ...prev, ...updates }));
  };

  const finalizeBooking = () => {
    const final: BookingState = { 
      ...booking, 
      id: `BK-${Date.now()}`, 
      status: 'CONFIRMED' as const,
      guestName: guestProfile.name,
      guestProfile: { ...guestProfile, safetyPledgeAccepted: booking.rulesAcknowledged },
      hostName: selectedListing?.hostName,
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    setMyTrips(prev => [...prev, final]);
    setPendingRequests(prev => [...prev, { ...final, status: 'PENDING_APPROVAL' }]);
    navigate('CONFIRMED');
  };

  const handleUpdateTripStatus = (id: string, newStatus: BookingState['status']) => {
    setPendingRequests(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setMyTrips(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleReleasePayout = (id: string) => {
    setPendingRequests(prev => prev.map(t => t.id === id ? { ...t, status: 'COMPLETED', payoutReleased: true } : t));
  };

  const handleReviewSubmit = (review: StructuredReview) => {
    if (!activeReviewTrip) return;
    setMyTrips(prev => prev.map(t => t.id === activeReviewTrip ? { ...t, guestReview: review } : t));
    setActiveReviewTrip(null);
    goBack();
  };

  const onSetRole = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.ADMIN) setHasAdminRights(true);
    if (role === UserRole.GUEST) setCurrentView('HOME');
    if (role === UserRole.HOST) setCurrentView('HOST_DASHBOARD');
    setIsRoleMenuOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} />;
      case 'TRUST_OVERVIEW':
        return <TrustOverviewView onContinue={() => navigate('GUEST_VERIFICATION')} />;
      case 'SEARCH':
        return <SearchResultsView onSelect={handleSelectListing} listings={MOCK_LISTINGS} />;
      case 'DETAIL':
        return selectedListing ? <ListingDetailView listing={selectedListing} isSaved={wishlistIds.includes(selectedListing.id)} isLiked={likedIds.has(selectedListing.id)} onToggleSave={() => toggleWishlist(selectedListing.id)} onToggleLike={() => toggleLike(selectedListing.id)} onBook={() => navigate('BOOKING_DATES')} /> : null;
      case 'WISHLIST':
        return <WishlistView listings={MOCK_LISTINGS.filter(l => wishlistIds.includes(l.id))} onSelect={handleSelectListing} onToggleSave={toggleWishlist} onExplore={() => navigate('HOME')} />;
      case 'BOOKING_DATES':
        return <BookingDatesView listing={selectedListing!} booking={booking} onUpdate={updateBooking} onContinue={() => navigate('BOOKING_SUMMARY')} />;
      case 'BOOKING_SUMMARY':
        return <BookingSummaryView listing={selectedListing!} booking={booking} onUpdate={updateBooking} guest={guestProfile} onContinue={(needsVerification) => needsVerification ? navigate('GUEST_VERIFICATION') : navigate('PAYMENT')} onNavigateToVerify={() => navigate('GUEST_VERIFICATION')} />;
      case 'GUEST_VERIFICATION':
        return <GuestVerificationView guest={guestProfile} onUpdate={setGuestProfile} onComplete={() => goBack()} />;
      case 'PAYMENT':
        return <PaymentMethodView onSelect={(method) => { updateBooking({ paymentMethod: method }); navigate('PROCESSING'); }} />;
      case 'PROCESSING':
        return <ProcessingView onFinish={finalizeBooking} />;
      case 'CONFIRMED':
        return <ConfirmationView listing={selectedListing!} booking={booking} onHome={() => navigate('HOME')} />;
      case 'GUEST_TRIPS':
        return <GuestTripsView trips={myTrips} onExplore={() => navigate('HOME')} onUpdateStatus={handleUpdateTripStatus} onReview={(id) => { setActiveReviewTrip(id); navigate('REVIEW_STAY'); }} onSafetyCheck={() => {}} />;
      case 'PROFILE':
        return <ProfileView guest={guestProfile} onSetRole={onSetRole} currentRole={userRole} onVerify={() => navigate('GUEST_VERIFICATION')} />;
      case 'HOST_DASHBOARD':
        return <HostDashboard listings={myListings} requests={pendingRequests} onUpdateStatus={handleUpdateTripStatus} onReleasePayout={handleReleasePayout} onReviewGuest={(id) => { setActiveReviewTrip(id); navigate('REVIEW_STAY'); }} onStartListing={() => navigate('HOST_WELCOME')} />;
      case 'HOST_WELCOME':
        return <HostWelcome onStart={() => navigate('HOST_TYPE')} />;
      case 'HOST_TYPE':
        return <PropertyTypeSelection state={hostListing} onUpdate={updateHostListing} onContinue={() => navigate('HOST_TAGS')} />;
      case 'HOST_TAGS':
        return <PropertyTagsSelection state={hostListing} onUpdate={updateHostListing} onContinue={() => navigate('HOST_DETAILS')} />;
      case 'HOST_DETAILS':
        return <PropertyDetails state={hostListing} onUpdate={updateHostListing} onContinue={() => navigate('HOST_LOCATION')} />;
      case 'HOST_LOCATION':
        return <LocationSetup state={hostListing} onUpdate={updateHostListing} onContinue={() => navigate('HOST_AMENITIES')} />;
      case 'HOST_AMENITIES':
        return <AmenitiesRules state={hostListing} onUpdate={updateHostListing} onContinue={() => navigate('HOST_PHOTOS')} />;
      case 'HOST_PHOTOS':
        return <PhotosMedia state={hostListing} onUpdate={updateHostListing} onContinue={() => navigate('HOST_PRICING')} />;
      case 'HOST_PRICING':
        return <PricingAvailability state={hostListing} onUpdate={updateHostListing} onContinue={() => navigate('HOST_VERIFICATION')} />;
      case 'HOST_VERIFICATION':
        return <VerificationMethod state={hostListing} onUpdate={updateHostListing} onSubmit={() => {
            setMyListings(prev => [...prev, { ...hostListing, status: 'APPROVED', id: `LS-${Date.now()}`, hostName: guestProfile.name }]);
            navigate('HOST_STATUS');
        }} />;
      case 'HOST_STATUS':
        return <SubmissionStatus onHome={() => navigate('HOME')} />;
      case 'REVIEW_STAY':
        const trip = [...myTrips, ...pendingRequests].find(t => t.id === activeReviewTrip);
        return trip ? <ReviewStayView trip={trip} role={userRole} onSubmit={handleReviewSubmit} /> : null;
      default:
        return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} />;
    }
  };

  const getTitle = () => {
    if (currentView.startsWith('HOST_')) return 'Welcome Home, Host';
    switch (currentView) {
      case 'HOME': return 'Wacu';
      case 'SEARCH': return 'Explore';
      case 'DETAIL': return 'Wacu Details';
      case 'GUEST_TRIPS': return 'My Trips';
      case 'PROFILE': return 'My Trust Profile';
      case 'HOST_DASHBOARD': return 'Hosting Hub';
      case 'WISHLIST': return 'Wishlist';
      default: return 'Wacu';
    }
  };

  const showBottomNav = ['HOME', 'SEARCH', 'GUEST_TRIPS', 'PROFILE', 'HOST_DASHBOARD', 'WISHLIST'].includes(currentView);

  return (
    <Layout 
      title={getTitle()} 
      onBack={currentView !== 'HOME' ? goBack : undefined}
      hideHeader={['HOME', 'PROCESSING'].includes(currentView)}
      rightContent={hasAdminRights ? <button onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)} className="p-2">👁️</button> : null}
    >
      <div className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        {renderView()}
      </div>
      {showBottomNav && (
        <BottomNav currentView={currentView} role={userRole} onNavigate={(view) => setCurrentView(view)} />
      )}
    </Layout>
  );
};

export default App;
