
import { 
  collection, doc, setDoc, addDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp, updateDoc, runTransaction, limit, increment
} from "firebase/firestore";
import { db } from "../firebase";
import { Listing, BookingState, GuestProfile, UserRole, Review, PropertyType } from "../types";
import { DEFAULT_HOUSE_RULES, AMENITIES, LISTING_TAGS } from "../constants";

export const createUserProfile = async (uid: string, phone: string, name?: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const isAdminPhone = phone === '+250794003947' || phone === '794003947';

  if (!snap.exists()) {
    await setDoc(userRef, {
      name: isAdminPhone ? 'Fred (Admin)' : (name || 'KAZE Member'),
      phone: phone,
      bio: isAdminPhone ? 'KAZE Administrator' : 'Verified community member.',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isAdminPhone ? 'Fred' : (name || 'K'))}&background=${isAdminPhone ? '0F172A' : 'f15a24'}&color=fff`,
      verificationLevel: isAdminPhone ? 3 : 1,
      trustPoints: isAdminPhone ? 999 : 50,
      badges: isAdminPhone ? ['Contact Verified', 'Identity Verified', 'Elite Voucher'] : ['Contact Verified'],
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
    await updateDoc(userRef, { role: UserRole.ADMIN });
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<GuestProfile>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates as any);
};

export const toggleLikeListing = async (listingId: string, userId: string) => {
  const listingRef = doc(db, "listings", listingId);
  await updateDoc(listingRef, { likesCount: increment(1) });
};

// Fix for views/ListingDetail.tsx: Missing incrementShares export
export const incrementShares = async (listingId: string) => {
  const listingRef = doc(db, "listings", listingId);
  await updateDoc(listingRef, { sharesCount: increment(1) });
};

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
    rating: 5.0,
    reviewCount: 0,
    tags: listingData.tags || [],
    reviews: []
  });
};

export const createBooking = async (bookingData: any) => {
  return await addDoc(collection(db, "bookings"), {
    ...bookingData,
    createdAt: serverTimestamp(),
  });
};

export const confirmBookingPayment = async (bookingId: string) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await runTransaction(db, async (transaction) => {
    const bSnap = await transaction.get(bookingRef);
    if (!bSnap.exists()) return;
    const bData = bSnap.data() as BookingState;
    if (bData.hostPaymentConfirmed) return; 
    transaction.update(bookingRef, {
      hostPaymentConfirmed: true,
      hostConfirmationDate: new Date().toISOString(),
      status: 'CONFIRMED'
    });
  });
};

export const updateBookingStatus = async (id: string, status: string) => {
  await updateDoc(doc(db, "bookings", id), { status });
};

// Fix for views/admin/AdminDashboard.tsx: Missing runDailyNudges export
export const runDailyNudges = async () => {
  // Simulate finding tomorrow's bookings and "nudging" them
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const q = query(collection(db, "bookings"), where("startDate", "==", tomorrowStr));
  const snap = await getDocs(q);
  
  const nudged = [];
  for (const d of snap.docs) {
    // In a production context, this would trigger external notification services
    nudged.push(d.id);
  }
  return nudged;
};

export const seedInitialData = async () => {
  try {
    const usersSnap = await getDocs(query(collection(db, "users"), limit(1)));
    if (!usersSnap.empty) return;
    console.log("🚀 Hydrating KAZE Production Seed...");

    const seedUsers = [
      { id: 'host_bosco', name: 'Jean Bosco', phone: '+250781234567', role: UserRole.HOST, trustPoints: 450, verificationLevel: 3, badges: ['Contact Verified', 'Identity Verified', 'Active Host'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
      { id: 'host_alice', name: 'Alice U.', phone: '+250788123456', role: UserRole.HOST, trustPoints: 210, verificationLevel: 2, badges: ['Contact Verified', 'Active Host'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' }
    ];

    for (const u of seedUsers) {
      await setDoc(doc(db, "users", u.id), { 
        ...u, 
        bio: 'Proud KAZE host helping travelers discover the heart of Rwanda.', 
        identityDocumentStored: true, safetyPledgeAccepted: true, createdAt: serverTimestamp(), isPhoneVerified: true, referralCount: 0 
      });
    }

    const seedListings = [
      { 
        id: 'l1', title: 'Kigali Heights View Loft', hostId: 'host_alice', hostName: 'Alice U.', pricePerNight: 35000, type: PropertyType.CITY_APARTMENT, landmark: 'Kigali Heights', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 
        hostBio: 'Urban explorer and design enthusiast.', hostAvatar: seedUsers[1].avatar, likesCount: 420
      },
      { 
        id: 'l2', title: 'Rebero Hills Sanctuary', hostId: 'host_bosco', hostName: 'Jean Bosco', pricePerNight: 85000, type: PropertyType.ENTIRE_HOME, landmark: 'Rebero Hills', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 
        hostBio: 'Nature lover and coffee farmer.', hostAvatar: seedUsers[0].avatar, likesCount: 890
      }
    ];

    for (const l of seedListings) {
      await setDoc(doc(db, "listings", l.id), { 
        ...l, description: 'Experience authentic Rwandan hospitality in this verified Wacu.', amenities: AMENITIES.slice(0, 10), rules: DEFAULT_HOUSE_RULES, status: 'APPROVED', rating: 4.9, reviewCount: 5, createdAt: serverTimestamp() 
      });
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
};
