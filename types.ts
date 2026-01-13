
export enum PropertyType {
  FAMILY_HOMESTAY = 'Family Homestay',
  SHARED_HOME = 'Shared Home',
  ENTIRE_HOME = 'Entire Home',
  VILLAGE_STAY = 'Village Stay',
  FARM_STAY = 'Farm Stay',
  ECO_STAY = 'Eco Stay',
  GUESTHOUSE_COMPOUND = 'Guesthouse / Compound',
  CITY_APARTMENT = 'City Apartment',
  CULTURAL_STAY = 'Cultural Stay',
  GROUP_FAMILY_COMPOUND = 'Group & Family Compound'
}

export type ListingTag = 
  | 'Host lives on site'
  | 'Meals available'
  | 'Family-friendly'
  | 'Rural setting'
  | 'Near national park'
  | 'Off-grid / solar'
  | 'Long-stay friendly'
  | 'Group-friendly';

export enum UserRole {
  GUEST = 'GUEST',
  HOST = 'HOST',
  VERIFIER = 'VERIFIER',
  ADMIN = 'ADMIN'
}

export type TrustBadge = 
  | 'Identity Verified'
  | 'Contact Verified'
  | 'Active Host'
  | 'Active Guest'
  | 'Community Trusted'
  | 'Safety Pledge';

export interface GuestProfile {
  name: string;
  avatar?: string;
  bio: string;
  phone: string;
  isPhoneVerified: boolean;
  verificationLevel: 1 | 2 | 3;
  badges: TrustBadge[];
  completedStays: number;
  hostRecommendationRate: number; // 0-100%
  identityDocumentStored: boolean;
  safetyPledgeAccepted: boolean;
  communityReference?: {
    name: string;
    phone: string;
    confirmed: boolean;
  };
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  adminId?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  user: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  likes?: number;
  replies?: Review[]; // For threaded community engagement
}

export interface StructuredReview {
  submitted: boolean;
  timestamp?: string;
  q1: boolean; // Guest: Felt safe? | Host: Host again?
  q2: boolean; // Guest: Accurate?  | Host: Respected rules?
  q3: boolean; // Guest: Stay again? | Host: Safety concerns?
  comment?: string;
}

export interface Listing {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  isVerified: boolean;
  pricePerNight: number;
  type: PropertyType;
  tags: ListingTag[];
  capacity: number;
  bathroomCount: number;
  petFriendly: boolean;
  image: string;
  description: string;
  landmark: string;
  distanceToLandmark: string;
  what3words: string;
  howToGetThere: string;
  amenities: Amenity[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  location?: {
    lat: number;
    lng: number;
  };
  // Host Profile Details
  hostBio?: string;
  hostJoinDate?: string;
  hostLanguages?: string[];
  hostResponseRate?: string;
  hostResponseTime?: string;
  hostWork?: string;
  hostInteraction?: string;
  hostFavoriteLandmark?: string;
  hostTrustBadges?: TrustBadge[];
  hostCompletedStays?: number;
  verifiedChecks?: {
    identity: boolean;
    phone: boolean;
    communityVouch: boolean;
    propertyVerified: boolean;
    videoVerified: boolean;
  };
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  sharesCount: number;
  legacyCategory?: string;
  needsMigrationReview?: boolean;
}

export interface BookingState {
  id?: string;
  listingId: string | null;
  guestName?: string;
  guestProfile?: GuestProfile;
  hostName?: string;
  startDate: string | null;
  endDate: string | null;
  adults: number;
  children: number;
  paymentMethod: 'MTN' | 'AIRTEL' | 'ARRIVAL' | null;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'ACTIVE_STAY' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED';
  totalPrice: number;
  payoutReleased: boolean;
  dateSubmitted?: string;
  purposeOfStay?: 'Tourism' | 'Work' | 'Family' | 'Event';
  rulesAcknowledged: boolean;
  guestReview?: StructuredReview;
  hostReview?: StructuredReview;
  safetyCheckPerformed?: boolean;
  disputeReason?: string;
  disputeResolution?: string;
  disputeInitiatedBy?: UserRole;
  adminTrustOverride?: boolean;
}

export interface HostListingState {
  id?: string;
  type: PropertyType | null;
  tags: ListingTag[];
  name: string;
  description: string;
  howToGetThere: string;
  capacity: number;
  roomType: string;
  bathroomType: 'Shared' | 'Private';
  hostInteraction: string;
  landmark: string;
  locationDescription: string;
  what3words: string;
  amenities: string[];
  rules: {
    smoking: boolean;
    pets: boolean;
    curfew: boolean;
  };
  photos: string[];
  pricePerNight: number;
  weeklyDiscount: boolean;
  availability: 'Always' | 'Select';
  verificationMethod: 'Vouch' | 'Video' | 'ID' | null;
  verificationCompleted: ('Phone' | 'Property' | 'Vouch' | 'Video' | 'ID')[];
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  hostName?: string;
  dateSubmitted?: string;
  legacyCategory?: string;
}

export type View = 
  | 'HOME' 
  | 'SEARCH' 
  | 'DETAIL' 
  | 'WISHLIST'
  | 'BOOKING_DATES' 
  | 'BOOKING_SUMMARY' 
  | 'GUEST_VERIFICATION'
  | 'PAYMENT' 
  | 'PROCESSING' 
  | 'CONFIRMED' 
  | 'GUEST_TRIPS' 
  | 'PROFILE' 
  | 'HOST_DASHBOARD' 
  | 'VERIFIER_DASHBOARD' 
  | 'ADMIN_DASHBOARD' 
  | 'ADMIN_PANEL' 
  | 'HOST_WELCOME' 
  | 'HOST_TYPE' 
  | 'HOST_TAGS' 
  | 'HOST_DETAILS' 
  | 'HOST_LOCATION' 
  | 'HOST_AMENITIES' 
  | 'HOST_PHOTOS' 
  | 'HOST_PRICING' 
  | 'HOST_VERIFICATION' 
  | 'HOST_STATUS' 
  | 'REVIEW_STAY'
  | 'TRUST_OVERVIEW';
