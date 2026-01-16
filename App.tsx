
import React, { useState } from 'react';
import { View, Listing, BookingState, HostListingState, UserRole, GuestProfile, AuditEntry } from './types';
import { MOCK_LISTINGS, DEFAULT_HOUSE_RULES } from './constants';
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('ONBOARDING');
  const [history, setHistory] = useState<View[]>([]);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeReviewStay, setActiveReviewStay] = useState<string | null>(null);
  
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);

  // Education & Onboarding Tooltips state
  const [guestEdSeen, setGuestEdSeen] = useState(false);
  const [hostEdSeen, setHostEdSeen] = useState(false);
  const [seenTooltips, setSeenTooltips] = useState<Set<string>>(new Set());

  const handleDismissTooltip = (id: string) => {
    setSeenTooltips(prev => new Set(prev).add(id));
  };

  const addAuditLog = (action: string, details: string, bookingId?: string, raisedBy?: AuditEntry['raisedBy']) => {
    const entry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      action,
      timestamp: new Date().toLocaleString(),
      details,
      bookingId,
      raisedBy
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const [guestProfile, setGuestProfile] = useState<GuestProfile>({
    name: 'Clarisse Keza',
    phone: '0788123456',
    isPhoneVerified: true,
    bio: 'Avid traveler and community builder from Kigali.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
    verificationLevel: 2,
    trustPoints: 250,
    badges: ['Contact Verified', 'Identity Verified'], 
    completedStays: 5,
    hostRecommendationRate: 98,
    identityDocumentStored: true,
    safetyPledgeAccepted: true,
    referralCount: 2
  });

  const [myStays, setMyStays] = useState<BookingState[]>([]);
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
    rules: DEFAULT_HOUSE_RULES,
    photos: [],
    pricePerNight: 0,
    weeklyDiscount: false,
    availability: 'Always',
    verificationMethod: null,
    verificationCompleted: ['Phone'],
    vouchDetails: { name: '', phone: '', profileLink: '', isExistingHost: false },
    status: 'DRAFT',
    paymentMethodType: undefined,
    paymentIdentifier: undefined,
    commissionConsent: false
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
    setBooking(prev => ({ ...prev, listingId: listing.id, listingTitle: listing.title }));
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
        newBooking.expectedCommission = newBooking.totalPrice * 0.1;
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
    setMyStays(prev => [...prev, final]);
    setPendingRequests(prev => [...prev, { ...final, status: 'PENDING_APPROVAL' }]);
    navigate('CONFIRMED');
  };

  const handleConfirmedSent = () => {
    const updatedBooking = { ...booking, guestPaymentMarked: true, status: 'PENDING_PAYMENT' as const };
    setBooking(updatedBooking);
    const finalId = `BK-${Date.now()}`;
    const final: BookingState = { 
      ...updatedBooking, 
      id: finalId, 
      guestName: guestProfile.name,
      guestProfile: { ...guestProfile },
      hostName: selectedListing?.hostName,
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    setMyStays(prev => [...prev, final]);
    setPendingRequests(prev => [...prev, final]);
    addAuditLog("Payment Sent Marked", `${guestProfile.name} marked payment for ${selectedListing?.title} as sent.`, finalId, 'GUEST');
    navigate('CONFIRMED');
  };

  const handleUpdateStayStatus = (id: string, newStatus: BookingState['status']) => {
    setPendingRequests(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setMyStays(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    addAuditLog("Status Update", `Booking ${id} status changed to ${newStatus}`, id, 'SYSTEM');
  };

  const handleConfirmPayment = (id: string) => {
    if (!confirm("This action cannot be undone. Confirm only if paid via Mobile Money SMS confirmation.")) return;
    const dateStr = new Date().toLocaleDateString();
    setPendingRequests(prev => prev.map(t => t.id === id ? { 
      ...t, 
      status: 'CONFIRMED', 
      hostPaymentConfirmed: true, 
      hostConfirmationDate: dateStr 
    } : t));
    setMyStays(prev => prev.map(t => t.id === id ? { 
      ...t, 
      status: 'CONFIRMED', 
      hostPaymentConfirmed: true,
      hostConfirmationDate: dateStr 
    } : t));
    addAuditLog("Payment Confirmed", `Host confirmed receipt for booking ${id}.`, id, 'HOST');
  };

  const handleMarkCommissionRemitted = (id: string, note?: string) => {
    const update = (prev: BookingState[]) => prev.map(t => 
      (id === 'ALL' ? (t.hostPaymentConfirmed && !t.commissionMarkedSent) : (t.id === id)) 
      ? { ...t, commissionMarkedSent: true, commissionRemittanceNote: note } 
      : t
    );
    setPendingRequests(update);
    setMyStays(update);
    addAuditLog("Commission Remitted", `Host marked commission for ${id} as remitted.`, id === 'ALL' ? undefined : id, 'HOST');
  };

  const handleRaisePaymentDispute = (id: string, reason: string) => {
    // Re-show tooltips if a dispute occurs
    setSeenTooltips(new Set());
    setPendingRequests(prev => prev.map(t => t.id === id ? { ...t, status: 'DISPUTED', disputeReason: reason, hostDisputeResponse: 'NOT_RECEIVED' } : t));
    setMyStays(prev => prev.map(t => t.id === id ? { ...t, status: 'DISPUTED', disputeReason: reason, hostDisputeResponse: 'NOT_RECEIVED' } : t));
    addAuditLog("Payment Dispute Raised", `Host reported payment not received for booking ${id}. Reason: ${reason}`, id, 'HOST');
    alert("Dispute raised. A payment issue is under review. Check-in is blocked.");
  };

  const handleResolveDispute = (id: string, outcome: 'PAID' | 'NOT_PAID' | 'INCONCLUSIVE', decisionLog: string) => {
    const newStatus = outcome === 'PAID' ? 'CONFIRMED' : (outcome === 'NOT_PAID' ? 'PENDING_PAYMENT' : 'DISPUTED');
    setPendingRequests(prev => prev.map(t => t.id === id ? { 
      ...t, 
      status: newStatus, 
      adminResolutionOutcome: outcome,
      hostPaymentConfirmed: outcome === 'PAID' ? true : t.hostPaymentConfirmed
    } : t));
    setMyStays(prev => prev.map(t => t.id === id ? { 
      ...t, 
      status: newStatus,
      adminResolutionOutcome: outcome,
      hostPaymentConfirmed: outcome === 'PAID' ? true : t.hostPaymentConfirmed
    } : t));
    addAuditLog("Dispute Resolved", `Admin decision: ${outcome}. Log: ${decisionLog}`, id, 'SYSTEM');
    alert(`Dispute resolved. Status updated to ${newStatus}.`);
  };

  const onSetRole = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.GUEST) setCurrentView('HOME');
    else if (role === UserRole.HOST) setCurrentView('HOST_DASHBOARD');
    else if (role === UserRole.ADMIN) setCurrentView('ADMIN_DASHBOARD');
  };

  const renderView = () => {
    switch (currentView) {
      case 'ONBOARDING':
        return <Onboarding onComplete={() => setCurrentView('HOME')} />;
      case 'HOME':
        return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} />;
      case 'SEARCH':
        return <SearchResultsView onSelect={handleSelectListing} listings={MOCK_LISTINGS} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} likedIds={likedIds} onToggleLike={toggleLike} />;
      case 'DETAIL':
        return selectedListing ? <ListingDetailView listing={selectedListing} isSaved={wishlistIds.includes(selectedListing.id)} isLiked={likedIds.has(selectedListing.id)} onToggleSave={() => toggleWishlist(selectedListing.id)} onToggleLike={() => toggleLike(selectedListing.id)} onBook={() => navigate('BOOKING_DATES')} /> : null;
      case 'WISHLIST':
        return <WishlistView listings={MOCK_LISTINGS.filter(l => wishlistIds.includes(l.id))} onSelect={handleSelectListing} onToggleSave={toggleWishlist} onExplore={() => navigate('HOME')} />;
      case 'BOOKING_DATES':
        return <BookingDatesView listing={selectedListing!} booking={booking} onUpdate={updateBooking} onContinue={() => navigate('BOOKING_SUMMARY')} />;
      case 'BOOKING_SUMMARY':
        return <BookingSummaryView listing={selectedListing!} booking={booking} onUpdate={updateBooking} guest={guestProfile} onContinue={(needsVerification) => {
            if (!guestEdSeen) {
                navigate('GUEST_PAYMENT_EDUCATION');
                return;
            }
            needsVerification ? navigate('GUEST_VERIFICATION') : navigate('PAYMENT');
        }} onNavigateToVerify={() => navigate('GUEST_VERIFICATION')} />;
      case 'PAYMENT':
        return <PaymentMethodView listing={selectedListing!} booking={booking} onSelect={(method) => { updateBooking({ paymentMethod: method }); navigate('PROCESSING'); }} onConfirmedSent={handleConfirmedSent} onHelp={() => navigate('GUEST_PAYMENT_EDUCATION')} seenTooltips={seenTooltips} onDismissTooltip={handleDismissTooltip} />;
      case 'GUEST_PAYMENT_EDUCATION':
        return <PaymentEducationView type="GUEST" onComplete={() => { setGuestEdSeen(true); goBack(); }} onSkip={() => { setGuestEdSeen(true); goBack(); }} />;
      case 'HOST_PAYMENT_EDUCATION':
        return <PaymentEducationView type="HOST" onComplete={() => { setHostEdSeen(true); goBack(); }} onSkip={() => { setHostEdSeen(true); goBack(); }} />;
      case 'PAYMENTS_POLICY':
        return <PaymentsPolicy />;
      case 'FAQS':
        return <FAQs />;
      case 'PROCESSING':
        return <ProcessingView onFinish={finalizeBooking} />;
      case 'CONFIRMED':
        return <ConfirmationView listing={selectedListing!} booking={booking} onHome={() => navigate('HOME')} seenTooltips={seenTooltips} onDismissTooltip={handleDismissTooltip} />;
      case 'GUEST_STAYS':
        return <GuestTripsView trips={myStays} onExplore={() => navigate('HOME')} onUpdateStatus={handleUpdateStayStatus} onReview={(id) => { setActiveReviewStay(id); navigate('REVIEW_STAY'); }} onSafetyCheck={() => {}} seenTooltips={seenTooltips} onDismissTooltip={handleDismissTooltip} />;
      case 'PROFILE':
        return <ProfileView guest={guestProfile} onSetRole={onSetRole} currentRole={userRole} onVerify={() => navigate('GUEST_VERIFICATION')} onNavigateReferrals={() => navigate('REFERRAL_DASHBOARD')} onPaymentsHelp={() => navigate('GUEST_PAYMENT_EDUCATION')} onFAQs={() => navigate('FAQS')} onPolicy={() => navigate('PAYMENTS_POLICY')} />;
      case 'HOST_DASHBOARD':
        return <HostDashboard listings={myListings} requests={pendingRequests} onUpdateStatus={handleUpdateStayStatus} onReleasePayout={() => {}} onReviewGuest={() => {}} onStartListing={() => navigate('HOST_WELCOME')} onConfirmPayment={handleConfirmPayment} onRaisePaymentDispute={handleRaisePaymentDispute} onMarkCommissionRemitted={handleMarkCommissionRemitted} onPaymentsHelp={() => navigate('HOST_PAYMENT_EDUCATION')} onFAQs={() => navigate('FAQS')} onPolicy={() => navigate('PAYMENTS_POLICY')} seenTooltips={seenTooltips} onDismissTooltip={handleDismissTooltip} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard listings={MOCK_LISTINGS} requests={pendingRequests} trips={myStays} onUpdateStatus={handleUpdateStayStatus} onResolveDispute={handleResolveDispute} auditLogs={auditLogs} />;
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
        return <PricingAvailability state={hostListing} onUpdate={updateHostListing} onContinue={() => navigate('HOST_PAYMENT_SETUP')} />;
      case 'HOST_PAYMENT_SETUP':
        return <PaymentSetup state={hostListing} onUpdate={updateHostListing} onContinue={() => {
            if (!hostEdSeen) {
                navigate('HOST_PAYMENT_EDUCATION');
                return;
            }
            navigate('HOST_VERIFICATION');
        }} onHelp={() => navigate('HOST_PAYMENT_EDUCATION')} seenTooltips={seenTooltips} onDismissTooltip={handleDismissTooltip} />;
      case 'HOST_VERIFICATION':
        return <VerificationMethod state={hostListing} onUpdate={updateHostListing} onSubmit={() => {
            const finalHostListing = { ...hostListing, status: 'APPROVED' as const, id: `LS-${Date.now()}`, hostName: guestProfile.name };
            setMyListings(prev => [...prev, finalHostListing]);
            navigate('HOST_STATUS');
        }} />;
      case 'HOST_STATUS':
        return <SubmissionStatus onHome={() => navigate('HOME')} />;
      case 'REFERRAL_DASHBOARD':
        return <ReferralDashboard onBack={goBack} referralCount={guestProfile.referralCount} trustPoints={guestProfile.trustPoints} />;
      case 'GUEST_VERIFICATION':
        return <GuestVerificationView guest={guestProfile} onUpdate={setGuestProfile} onComplete={() => goBack()} />;
      default:
        return <HomeView role={userRole} onSetRole={onSetRole} onSearch={() => navigate('SEARCH')} onSelectListing={handleSelectListing} onHostStart={() => navigate('HOST_WELCOME')} />;
    }
  };

  const getTitle = () => {
    if (currentView.startsWith('HOST_')) return 'Setup Your Wacu';
    switch (currentView) {
      case 'ONBOARDING': return 'Welcome';
      case 'HOME': return 'Wacu';
      case 'SEARCH': return 'Explore';
      case 'DETAIL': return 'Details';
      case 'GUEST_STAYS': return 'My Stays';
      case 'PROFILE': return 'Profile';
      case 'HOST_DASHBOARD': return 'Hosting';
      case 'ADMIN_DASHBOARD': return 'Admin Panel';
      case 'GUEST_PAYMENT_EDUCATION':
      case 'HOST_PAYMENT_EDUCATION': return 'Payment Help';
      case 'PAYMENTS_POLICY': return 'Payments Policy';
      case 'FAQS': return 'FAQs';
      default: return 'Wacu';
    }
  };

  const showBottomNav = ['HOME', 'SEARCH', 'GUEST_STAYS', 'PROFILE', 'HOST_DASHBOARD', 'WISHLIST', 'ADMIN_DASHBOARD'].includes(currentView);

  return (
    <Layout 
      title={getTitle()} 
      onBack={currentView !== 'HOME' && currentView !== 'ONBOARDING' ? goBack : undefined}
      hideHeader={['ONBOARDING', 'HOME', 'PROCESSING', 'GUEST_PAYMENT_EDUCATION', 'HOST_PAYMENT_EDUCATION'].includes(currentView)}
    >
      <div className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        {renderView()}
      </div>
      {showBottomNav && (
        <BottomNav currentView={currentView} role={userRole} onNavigate={(view) => setCurrentView(view as View)} />
      )}
    </Layout>
  );
};

export default App;
