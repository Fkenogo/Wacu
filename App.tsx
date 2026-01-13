import React, { useState, useEffect } from 'react';
import { View, Listing, BookingState, HostListingState, UserRole, GuestProfile, StructuredReview, AuditEntry, TrustBadge } from './types';
import { MOCK_LISTINGS } from './constants';
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
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeReviewTrip, setActiveReviewTrip] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);

  // Engagement State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev => prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]);
  };

  const toggleLike = (id: string) => {
    setLikedIds(prev => prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]);
  };

  // Dynamic Guest State - Starts at Level 1 Baseline
  const [guestProfile, setGuestProfile] = useState<GuestProfile>({
    name: 'Clarisse Keza',
    phone: '0788123456',
    isPhoneVerified: true,
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
    verificationLevel: 1,
    badges: ['Contact Verified'], 
    completedStays: 0,
    hostRecommendationRate: 0,
    identityDocumentStored: false,
    safetyPledgeAccepted: false
  });

  // Effect to derive badges from state
  useEffect(() => {
    const newBadges: TrustBadge[] = [];
    if (guestProfile.isPhoneVerified) newBadges.push('Contact Verified');
    if (guestProfile.identityDocumentStored) newBadges.push('Identity Verified');
    if (guestProfile.completedStays > 0) newBadges.push('Active Guest');
    if (guestProfile.hostRecommendationRate > 90) newBadges.push('Community Trusted');
    if (guestProfile.safetyPledgeAccepted) newBadges.push('Safety Pledge');
    
    if (JSON.stringify(newBadges) !== JSON.stringify(guestProfile.badges)) {
        setGuestProfile(prev => ({ ...prev, badges: newBadges }));
    }
  }, [guestProfile.isPhoneVerified, guestProfile.identityDocumentStored, guestProfile.completedStays, guestProfile.hostRecommendationRate, guestProfile.safetyPledgeAccepted]);

  const [myTrips, setMyTrips] = useState<BookingState[]>([]);
  const [myListings, setMyListings] = useState<HostListingState[]>([]);
  const [pendingRequests, setPendingRequests] = useState<BookingState[]>([]);

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
    // Fix: Replaced invalid 'boolean = false' with just 'false'
    weeklyDiscount: false,
    availability: 'Always',
    verificationMethod: null,
    verificationCompleted: ['Phone'],
    status: 'DRAFT'
  });

  const addAuditLog = (action: string, details: string, adminId?: string) => {
    const entry: AuditEntry = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString(),
      userId: guestProfile.phone,
      userName: guestProfile.name,
      action,
      details,
      adminId
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

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

  const startPaymentFlow = () => {
    updateBooking({ status: 'PENDING_PAYMENT' });
    navigate('PROCESSING');
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
    
    if (booking.rulesAcknowledged) {
        setGuestProfile(prev => ({ ...prev, safetyPledgeAccepted: true }));
    }

    addAuditLog('BOOKING_CONFIRMED', `Booking created for ${selectedListing?.title}. Status: PENDING_APPROVAL`);
    navigate('CONFIRMED');
  };

  const handleUpdateTripStatus = (id: string, newStatus: BookingState['status'], reason?: string, role?: UserRole) => {
    setMyTrips(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, status: newStatus };
        if (newStatus === 'DISPUTED') {
          updated.disputeReason = reason;
          updated.disputeInitiatedBy = role || userRole;
          addAuditLog('DISPUTE_REPORTED', `Dispute initiated by ${role || userRole}. Reason: ${reason}`);
        }
        return updated;
      }
      return t;
    }));
    setPendingRequests(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, status: newStatus };
        if (newStatus === 'DISPUTED') {
          updated.disputeReason = reason;
          updated.disputeInitiatedBy = role || userRole;
        }
        return updated;
      }
      return t;
    }));
    if (newStatus !== 'DISPUTED') {
      addAuditLog('TRIP_STATUS_UPDATE', `Trip ${id} status updated to ${newStatus}`);
    }
  };

  const handleSafetyCheck = (id: string, satisfied: boolean) => {
    if (!satisfied) {
      handleUpdateTripStatus(id, 'DISPUTED', 'In-stay safety check failed: Guest needs help.', UserRole.GUEST);
    } else {
      setMyTrips(prev => prev.map(t => t.id === id ? { ...t, safetyCheckPerformed: true } : t));
      setPendingRequests(prev => prev.map(t => t.id === id ? { ...t, safetyCheckPerformed: true } : t));
      addAuditLog('SAFETY_CHECK_PASSED', `Guest confirmed stay is okay for booking ${id}`);
    }
  };

  const handleResolveDispute = (id: string, resolution: 'REFUND' | 'PAY_HOST', details: string) => {
    const finalStatus = resolution === 'REFUND' ? 'CANCELLED' : 'COMPLETED';
    handleUpdateTripStatus(id, finalStatus);
    setMyTrips(prev => prev.map(t => t.id === id ? { ...t, disputeResolution: details } : t));
    setPendingRequests(prev => prev.map(t => t.id === id ? { ...t, disputeResolution: details } : t));
    addAuditLog('DISPUTE_RESOLVED', `Dispute ${id} resolved: ${resolution}. Note: ${details}`, 'ADMIN-01');
  };

  const handleReleasePayout = (id: string) => {
    setPendingRequests(prev => prev.map(t => t.id === id ? { ...t, status: 'COMPLETED', payoutReleased: true } : t));
    setMyTrips(prev => prev.map(t => t.id === id ? { ...t, status: 'COMPLETED' } : t));
    addAuditLog('PAYOUT_RELEASED', `Payout released for booking ${id}`);
  };

  const handleAdminUpdateListing = (id: string, newStatus: HostListingState['status']) => {
    setMyListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    addAuditLog('LISTING_AUDIT', `Listing ${id} updated to ${newStatus}`, 'ADMIN-01');
  };

  const submitNewListing = () => {
    const newListing = { 
      ...hostListing, 
      id: `LS-${Date.now()}`, 
      status: 'PENDING_REVIEW' as const,
      hostName: guestProfile.name,
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    setMyListings(prev => [...prev, newListing]);
    addAuditLog('LISTING_SUBMITTED', `New listing submitted by ${guestProfile.name}`);
    navigate('HOST_STATUS');
  };

  const handleSubmitReview = (tripId: string, role: UserRole, review: StructuredReview) => {
    setMyTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return role === UserRole.GUEST 
          ? { ...t, guestReview: review } 
          : { ...t, hostReview: review };
      }
      return t;
    }));
    setPendingRequests(prev => prev.map(t => {
      if (t.id === tripId) {
        return role === UserRole.GUEST 
          ? { ...t, guestReview: review } 
          : { ...t, hostReview: review };
      }
      return t;
    }));
    
    addAuditLog('REVIEW_SUBMITTED', `Structured review submitted for ${tripId} by ${role}`);

    if (role === UserRole.HOST) {
        setGuestProfile(prev => ({
            ...prev,
            completedStays: prev.completedStays + 1,
            hostRecommendationRate: review.q1 ? 100 : Math.max(0, prev.hostRecommendationRate - 20)
        }));
    }

    goBack();
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <HomeView 
            role={userRole} 
            onSetRole={onSetRole} 
            onSearch={() => navigate('SEARCH')} 
            onSelectListing={handleSelectListing}
            onHostStart={() => {
              if (guestProfile.verificationLevel < 2) {
                navigate('TRUST_OVERVIEW');
              } else {
                navigate('HOST_WELCOME');
              }
            }} 
          />
        );
      case 'TRUST_OVERVIEW':
        return <TrustOverviewView onContinue={() => navigate('GUEST_VERIFICATION')} />;
      case 'SEARCH':
        return <SearchResultsView onSelect={handleSelectListing} listings={MOCK_LISTINGS} />;
      case 'DETAIL':
        return selectedListing ? (
          <ListingDetailView 
            listing={selectedListing} 
            isSaved={wishlistIds.includes(selectedListing.id)}
            isLiked={likedIds.includes(selectedListing.id)}
            onToggleSave={() => toggleWishlist(selectedListing.id)}
            onToggleLike={() => toggleLike(selectedListing.id)}
            onBook={() => navigate('BOOKING_DATES')} 
          />
        ) : null;
      case 'WISHLIST':
        return (
          <WishlistView 
            listings={MOCK_LISTINGS.filter(l => wishlistIds.includes(l.id))}
            onSelect={handleSelectListing}
            onToggleSave={toggleWishlist}
            onExplore={() => navigate('HOME')}
          />
        );
      case 'BOOKING_DATES':
        return <BookingDatesView listing={selectedListing!} booking={booking} onUpdate={updateBooking} onContinue={() => navigate('BOOKING_SUMMARY')} />;
      case 'BOOKING_SUMMARY':
        return <BookingSummaryView listing={selectedListing!} booking={booking} onUpdate={updateBooking} guest={guestProfile} onContinue={(needsVerification) => needsVerification ? navigate('GUEST_VERIFICATION') : navigate('PAYMENT')} onNavigateToVerify={() => navigate('GUEST_VERIFICATION')} />;
      case 'GUEST_VERIFICATION':
        return <GuestVerificationView guest={guestProfile} onUpdate={setGuestProfile} onComplete={() => history[history.length-1] === 'BOOKING_SUMMARY' ? navigate('PAYMENT') : (history.includes('TRUST_OVERVIEW') ? navigate('HOST_WELCOME') : goBack())} />;
      case 'PAYMENT':
        return <PaymentMethodView onSelect={(method) => { updateBooking({ paymentMethod: method }); startPaymentFlow(); }} />;
      case 'PROCESSING':
        return <ProcessingView onFinish={finalizeBooking} />;
      case 'CONFIRMED':
        return <ConfirmationView listing={selectedListing!} booking={booking} onHome={() => navigate('HOME')} />;
      
      // Dashboards
      case 'GUEST_TRIPS':
        return (
            <GuestTripsView 
                trips={myTrips} 
                onExplore={() => navigate('HOME')} 
                onUpdateStatus={(id, status) => {
                  if (status === 'DISPUTED') {
                    const reason = prompt("Describe the issue:");
                    if (reason) handleUpdateTripStatus(id, status, reason, UserRole.GUEST);
                  } else {
                    handleUpdateTripStatus(id, status);
                  }
                }}
                onReview={(id) => { setActiveReviewTrip(id); navigate('REVIEW_STAY'); }}
                onSafetyCheck={handleSafetyCheck}
            />
        );
      case 'PROFILE':
        return <ProfileView guest={guestProfile} onSetRole={onSetRole} currentRole={userRole} onVerify={() => navigate('GUEST_VERIFICATION')} />;
      case 'HOST_DASHBOARD':
        return (
          <HostDashboard 
            listings={myListings} 
            requests={pendingRequests} 
            onUpdateStatus={(id, status) => {
              if (status === 'DISPUTED') {
                const reason = prompt("Describe the issue:");
                if (reason) handleUpdateTripStatus(id, status, reason, UserRole.HOST);
              } else {
                handleUpdateTripStatus(id, status);
              }
            }}
            onReleasePayout={handleReleasePayout}
            onReviewGuest={(id) => { setActiveReviewTrip(id); navigate('REVIEW_STAY'); }}
          />
        );
      case 'VERIFIER_DASHBOARD':
        return <VerifierDashboard listings={MOCK_LISTINGS} />;
      case 'ADMIN_DASHBOARD':
        return (
          <AdminDashboard 
            listings={MOCK_LISTINGS} 
            trips={myTrips} 
            requests={pendingRequests} 
            onUpdateStatus={handleUpdateTripStatus} 
          />
        );
      case 'ADMIN_PANEL':
        return (
          <AdminPanel 
            listings={MOCK_LISTINGS}
            hostListings={myListings}
            bookings={pendingRequests}
            auditLogs={auditLogs}
            onUpdateBooking={handleUpdateTripStatus}
            onResolveDispute={handleResolveDispute}
            onUpdateListing={handleAdminUpdateListing}
            onHome={() => navigate('HOME')}
          />
        );

      // Review System
      case 'REVIEW_STAY':
        const trip = [...myTrips, ...pendingRequests].find(t => t.id === activeReviewTrip);
        return trip ? <ReviewStayView trip={trip} role={userRole} onSubmit={(rev) => handleSubmitReview(activeReviewTrip!, userRole, rev)} /> : null;

      // Host Wizard
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
        return <VerificationMethod state={hostListing} onUpdate={updateHostListing} onSubmit={submitNewListing} />;
      case 'HOST_STATUS':
        return <SubmissionStatus onHome={() => navigate('HOME')} />;
      
      default:
        return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} />;
    }
  };

  const onSetRole = (role: UserRole) => {
    setUserRole(role);
  };

  const getTitle = () => {
    if (currentView.startsWith('HOST_')) return 'Welcome Home, Host';
    switch (currentView) {
      case 'HOME': return 'Wacu';
      case 'SEARCH': return 'Explore Our Places';
      case 'DETAIL': return 'Property Details';
      case 'WISHLIST': return 'My Secret Collection';
      case 'GUEST_TRIPS': return 'My Trips';
      case 'PROFILE': return 'My Trust Profile';
      case 'HOST_DASHBOARD': return 'Wacu Host Hub';
      case 'VERIFIER_DASHBOARD': return 'Trust Queue';
      case 'ADMIN_DASHBOARD': return 'Wacu Admin';
      case 'ADMIN_PANEL': return 'Wacu Management';
      case 'GUEST_VERIFICATION': return 'Identity & Trust';
      case 'REVIEW_STAY': return 'Review Stay';
      case 'TRUST_OVERVIEW': return 'Wacu Trust System';
      default: return 'Wacu';
    }
  };

  const showBottomNav = ['HOME', 'SEARCH', 'GUEST_TRIPS', 'PROFILE', 'HOST_DASHBOARD', 'VERIFIER_DASHBOARD', 'ADMIN_DASHBOARD', 'WISHLIST'].includes(currentView);
  const isWebPanel = currentView === 'ADMIN_PANEL';

  return (
    <Layout 
      title={getTitle()} 
      onBack={currentView !== 'HOME' && currentView !== 'CONFIRMED' && currentView !== 'HOST_STATUS' ? goBack : undefined}
      hideHeader={currentView === 'HOME' || currentView === 'PROCESSING' || isWebPanel || currentView === 'TRUST_OVERVIEW'}
      fullWidth={isWebPanel}
    >
      <div className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        {renderView()}
      </div>
      {showBottomNav && (
        <BottomNav 
          currentView={currentView} 
          role={userRole} 
          onNavigate={(view) => {
             setHistory([]);
             if (view === 'ADMIN_DASHBOARD' && userRole === UserRole.ADMIN) {
               setCurrentView('ADMIN_PANEL');
             } else {
               setCurrentView(view);
             }
          }} 
        />
      )}
    </Layout>
  );
};

export default App;