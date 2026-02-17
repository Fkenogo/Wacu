
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  runTransaction,
  limit,
  Timestamp,
  arrayUnion,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase";
import { Listing, BookingState, GuestProfile, AuditEntry, PropertyType, UserRole, Review } from "../types";
import { DEFAULT_HOUSE_RULES, AMENITIES } from "../constants";

// User Services
export const createUserProfile = async (uid: string, phone: string, name?: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  
  const isAdminPhone = phone === '+250794003947' || phone === '794003947';

  if (!snap.exists()) {
    await setDoc(userRef, {
      name: isAdminPhone ? 'Fred (Admin)' : (name || 'Wacu Traveler'),
      email: isAdminPhone ? 'fredkenogo@gmail.com' : '',
      phone: phone,
      bio: isAdminPhone ? 'WACU Platform Administrator' : '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isAdminPhone ? 'Fred' : (name || 'Wacu'))}&background=${isAdminPhone ? '0F172A' : 'F59E0B'}&color=fff`,
      verificationLevel: isAdminPhone ? 3 : 1,
      trustPoints: isAdminPhone ? 999 : 50,
      badges: isAdminPhone ? ['Contact Verified', 'Identity Verified', 'Community Trusted', 'Elite Voucher'] : ['Contact Verified'],
      role: isAdminPhone ? UserRole.ADMIN : UserRole.GUEST,
      referralCount: 0,
      createdAt: serverTimestamp(),
      isPhoneVerified: true,
      completedStays: 0,
      hostRecommendationRate: 100,
      identityDocumentStored: isAdminPhone,
      safetyPledgeAccepted: true,
    });
  } else if (isAdminPhone) {
    await updateDoc(userRef, { 
      role: UserRole.ADMIN,
      email: 'fredkenogo@gmail.com'
    });
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<GuestProfile>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates as any);
};

// Listing Services
export const submitListing = async (uid: string, hostName: string, hostAvatar: string, listingData: any) => {
  return await addDoc(collection(db, "listings"), {
    ...listingData,
    hostId: uid,
    hostName,
    hostAvatar,
    status: 'APPROVED', 
    createdAt: serverTimestamp(),
    likesCount: 0,
    sharesCount: 0,
    rating: 0,
    reviewCount: 0
  });
};

export const getFilteredListings = async (filters: { 
  type?: PropertyType, 
  maxPrice?: number
}) => {
  let q = query(
    collection(db, "listings"), 
    where("status", "==", "APPROVED"), 
    orderBy("pricePerNight", "asc")
  );

  if (filters.type) {
    q = query(
      collection(db, "listings"), 
      where("status", "==", "APPROVED"), 
      where("type", "==", filters.type), 
      orderBy("pricePerNight", "asc")
    );
  }

  const snap = await getDocs(q);
  let docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing));

  if (filters.maxPrice) {
    docs = docs.filter(l => l.pricePerNight <= filters.maxPrice);
  }
  return docs;
};

export const addListingReview = async (listingId: string, review: Review) => {
  const listingRef = doc(db, "listings", listingId);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(listingRef);
    if (!snap.exists()) return;
    const data = snap.data();
    const currentReviews = data.reviews || [];
    const newReviews = [review, ...currentReviews];
    const newCount = newReviews.length;
    const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
    const updatedRating = Number((totalRating / newCount).toFixed(1));
    transaction.update(listingRef, {
      reviews: newReviews,
      reviewCount: newCount,
      rating: updatedRating
    });
    const auditRef = doc(collection(db, "audit_logs"));
    transaction.set(auditRef, {
      action: 'Review Processed',
      details: `Recalculated rating for ${data.title} to ${updatedRating}`,
      listingId,
      timestamp: serverTimestamp()
    });
  });
};

// Booking Services
export const createBooking = async (bookingData: any) => {
  return await addDoc(collection(db, "bookings"), {
    ...bookingData,
    createdAt: serverTimestamp(),
  });
};

export const updateBookingStatus = async (bookingId: string, status: BookingState['status']) => {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, { status });
};

export const confirmBookingPayment = async (bookingId: string) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await runTransaction(db, async (transaction) => {
    const bSnap = await transaction.get(bookingRef);
    if (!bSnap.exists()) return;
    const bData = bSnap.data() as BookingState;
    if (bData.hostPaymentConfirmed) return; 
    const guestId = bData.guestId as string;
    const hostId = bData.hostId as string;
    const guestRef = doc(db, "users", guestId);
    const hostRef = doc(db, "users", hostId);
    const [gSnap, hSnap] = await Promise.all([transaction.get(guestRef), transaction.get(hostRef)]);
    transaction.update(bookingRef, {
      hostPaymentConfirmed: true,
      hostConfirmationDate: new Date().toISOString(),
      status: 'CONFIRMED',
      expectedCommission: (bData.totalPrice || 0) * 0.1
    });
    if (hSnap.exists()) {
      const currentPoints = hSnap.data().trustPoints || 0;
      transaction.update(hostRef, { trustPoints: currentPoints + 25 });
    }
    if (gSnap.exists()) {
      const currentPoints = gSnap.data().trustPoints || 0;
      transaction.update(guestRef, { trustPoints: currentPoints + 10 });
    }
    const auditRef = doc(collection(db, "audit_logs"));
    transaction.set(auditRef, {
      action: 'Payment Processed',
      details: `Booking ${bookingId} confirmed. Trust points awarded to both parties.`,
      bookingId,
      timestamp: serverTimestamp(),
      raisedBy: 'SYSTEM'
    });
  });
};

export const runDailyNudges = async () => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];
  const q = query(collection(db, "bookings"), where("status", "==", "CONFIRMED"));
  const snap = await getDocs(q);
  const results: string[] = [];
  const promises = snap.docs.map(async (d) => {
    const data = d.data() as BookingState;
    if (data.startDate === today || data.startDate === tomorrow) {
      await logAudit({
        action: 'Stay Reminder Sent',
        details: `Nudge sent to ${data.guestName} for stay at ${data.listingTitle}`,
        bookingId: d.id,
        raisedBy: 'SYSTEM'
      });
      results.push(`Nudge sent for ${d.id}`);
    }
  });
  await Promise.all(promises);
  return results;
};

export const raisePaymentDispute = async (bookingId: string, reason: string) => {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, {
    status: 'DISPUTED',
    disputeReason: reason,
    hostDisputeResponse: 'NOT_RECEIVED'
  });
  await logAudit({
    action: 'Payment Dispute',
    details: `Host reported missing payment: ${reason}`,
    bookingId,
    raisedBy: 'HOST'
  });
};

export const markCommissionSent = async (bookingId: string, note?: string) => {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, {
    commissionMarkedSent: true,
    commissionRemittanceNote: note || ''
  });
};

// Audit Services
export const logAudit = async (auditData: any) => {
  return await addDoc(collection(db, "audit_logs"), {
    ...auditData,
    timestamp: serverTimestamp(),
  });
};

// Seeder logic
export const seedInitialData = async () => {
  const usersSnap = await getDocs(query(collection(db, "users"), limit(1)));
  
  if (usersSnap.empty) {
    console.log("🚀 MIGRATION START: Seeding Relational Trust Network...");

    // 1. SEED 5 USERS
    const seedUsers = [
      { id: 'admin_794003947', name: 'Fred (Admin)', phone: '+250794003947', role: UserRole.ADMIN, trustPoints: 999, verificationLevel: 3, badges: ['Contact Verified', 'Identity Verified', 'Elite Voucher'], avatar: 'https://ui-avatars.com/api/?name=Fred&background=0F172A&color=fff' },
      { id: 'host_bosco_1', name: 'Jean Bosco', phone: '+250781234567', role: UserRole.HOST, trustPoints: 450, verificationLevel: 3, badges: ['Contact Verified', 'Identity Verified', 'Active Host', 'Community Trusted'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
      { id: 'host_alice_2', name: 'Alice U.', phone: '+250788123456', role: UserRole.HOST, trustPoints: 210, verificationLevel: 2, badges: ['Contact Verified', 'Identity Verified', 'Active Host'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
      { id: 'guest_emmanuel_3', name: 'Emmanuel M.', phone: '+250785554444', role: UserRole.GUEST, trustPoints: 120, verificationLevel: 2, badges: ['Contact Verified', 'Identity Verified', 'Active Guest'], avatar: 'https://ui-avatars.com/api/?name=Emmanuel&background=F59E0B&color=fff' },
      { id: 'guest_keza_5', name: 'Keza S.', phone: '+250783332211', role: UserRole.GUEST, trustPoints: 75, verificationLevel: 1, badges: ['Contact Verified'], avatar: 'https://ui-avatars.com/api/?name=Keza&background=EC4899&color=fff' }
    ];

    for (const u of seedUsers) {
      await setDoc(doc(db, "users", u.id), { ...u, bio: `Verified member of the Wacu family.`, identityDocumentStored: true, safetyPledgeAccepted: true, createdAt: serverTimestamp() });
    }

    // 2. SEED 5 LISTINGS
    const seedListings = [
      { id: 'listing_musanze_1', title: 'Peaceful Wacu Homestay', hostId: 'host_bosco_1', hostName: 'Jean Bosco', pricePerNight: 12500, type: PropertyType.FAMILY_HOMESTAY, landmark: 'Musanze Market', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', paymentMethodType: 'PHONE_NUMBER', paymentIdentifier: '0781234567' },
      { id: 'listing_kigali_2', title: 'Kigali Skyline Apartment', hostId: 'host_alice_2', hostName: 'Alice U.', pricePerNight: 35000, type: PropertyType.CITY_APARTMENT, landmark: 'Kigali Heights', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', paymentMethodType: 'MERCHANT_CODE', paymentIdentifier: '123456' },
      { id: 'listing_lake_3', title: 'Lake Kivu Sunrise Villa', hostId: 'host_bosco_1', hostName: 'Jean Bosco', pricePerNight: 28000, type: PropertyType.ENTIRE_HOME, landmark: 'Gisenyi Waterfront', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', paymentMethodType: 'PHONE_NUMBER', paymentIdentifier: '0781234567' },
      { id: 'listing_heritage_4', title: 'Cultural Heritage Homestay', hostId: 'host_alice_2', hostName: 'Alice U.', pricePerNight: 15000, type: PropertyType.CULTURAL_STAY, landmark: 'National Museum', image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800', paymentMethodType: 'MERCHANT_CODE', paymentIdentifier: '123456' },
      { id: 'listing_farm_5', title: 'Coffee Plantation Farmstay', hostId: 'host_bosco_1', hostName: 'Jean Bosco', pricePerNight: 18000, type: PropertyType.FARM_STAY, landmark: 'Rubavu Coffee Hub', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', paymentMethodType: 'PHONE_NUMBER', paymentIdentifier: '0781234567' }
    ];

    for (const l of seedListings) {
      const photos = [l.image, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=800', 'https://images.unsplash.com/photo-1556912170-453f2c710403?w=800', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'];
      await setDoc(doc(db, "listings", l.id), { ...l, photos, isVerified: true, capacity: 2, description: 'Experience authentic hospitality.', amenities: AMENITIES.slice(0, 8), rules: DEFAULT_HOUSE_RULES, status: 'APPROVED', rating: 4.8, reviewCount: 0, createdAt: serverTimestamp(), hostAvatar: seedUsers.find(u => u.id === l.hostId)?.avatar });
    }

    // 3. SEED 3 BOOKINGS
    const seedBookings = [
      { id: 'booking_sample_1', listingId: 'listing_musanze_1', guestId: 'guest_emmanuel_3', guestName: 'Emmanuel M.', hostId: 'host_bosco_1', status: 'COMPLETED', totalPrice: 25000, hostPaymentConfirmed: true },
      { id: 'booking_sample_2', listingId: 'listing_kigali_2', guestId: 'guest_keza_5', guestName: 'Keza S.', hostId: 'host_alice_2', status: 'CONFIRMED', totalPrice: 70000, hostPaymentConfirmed: true },
      { id: 'booking_sample_3', listingId: 'listing_lake_3', guestId: 'guest_emmanuel_3', guestName: 'Emmanuel M.', hostId: 'host_bosco_1', status: 'PENDING_PAYMENT', totalPrice: 56000, hostPaymentConfirmed: false }
    ];

    for (const b of seedBookings) {
      await setDoc(doc(db, "bookings", b.id), { ...b, listingTitle: seedListings.find(l => l.id === b.listingId)?.title, startDate: '2024-06-01', endDate: '2024-06-03', createdAt: serverTimestamp() });
    }

    console.log("✅ MIGRATION SUCCESS: Trust Network hydrated with relational data.");
  }
};
