
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
  | 'Safety Pledge'
  | 'Elite Voucher';

export interface GuestProfile {
  name: string;
  avatar?: string;
  bio: string;
  phone: string;
  isPhoneVerified: boolean;
  verificationLevel: 1 | 2 | 3;
  trustPoints: number;
  badges: TrustBadge[];
  completedStays: number;
  hostRecommendationRate: number;
  identityDocumentStored: boolean;
  safetyPledgeAccepted: boolean;
  referralCount: number;
  communityReference?: {
    name: string;
    phone: string;
    confirmed: boolean;
  };
  role: UserRole;
  paymentMethodType?: 'MERCHANT_CODE' | 'PHONE_NUMBER';
  paymentIdentifier?: string;
}

export interface HouseRule {
  id: string;
  category: string;
  label: string;
  enabled: boolean;
  note?: string;
  meta?: {
    time?: string;
    endTime?: string;
    amount?: number;
    count?: number;
    options?: string[];
  };
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface AmenityCategory {
  id: string;
  name: string;
  icon: string;
  amenities: Amenity[];
}

export interface Review {
  id: string;
  user: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  likes?: number;
  replies?: Review[];
}

export interface StructuredReview {
  submitted: boolean;
  timestamp?: string;
  q1: boolean;
  q2: boolean;
  q3: boolean;
  comment?: string;
}

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  isVerified: boolean;
  pricePerNight: number;
  type: PropertyType;
  tags: ListingTag[];
  capacity: number;
  bedsCount: number;
  bathroomCount: number;
  petFriendly: boolean;
  image: string;
  photos?: string[];
  description: string;
  landmark: string;
  distanceToLandmark: string;
  what3words: string;
  howToGetThere: string;
  amenities: Amenity[];
  rules: HouseRule[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  location?: {
    lat: number;
    lng: number;
  };
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
  needsMigrationReview?: boolean;
  paymentMethodType?: 'MERCHANT_CODE' | 'PHONE_NUMBER';
  paymentIdentifier?: string;
  commissionConsent?: boolean;
  escrowEnabled?: boolean; 
}

export interface AuditEntry {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  bookingId?: string;
  raisedBy?: 'GUEST' | 'HOST' | 'SYSTEM';
  userId?: string;
}

export interface BookingState {
  id?: string;
  guestId?: string;
  hostId?: string;
  listingId: string | null;
  listingTitle?: string;
  guestName?: string;
  guestProfile?: GuestProfile;
  hostName?: string;
  startDate: string | null;
  endDate: string | null;
  adults: number;
  children: number;
  paymentMethod: 'MTN' | 'AIRTEL' | 'ARRIVAL' | null;
  paymentMethodType?: 'MERCHANT_CODE' | 'PHONE_NUMBER';
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'ACTIVE_STAY' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED';
  totalPrice: number;
  payoutReleased: boolean;
  dateSubmitted?: string;
  purposeOfStay?: 'Tourism' | 'Work' | 'Family' | 'Event';
  rulesAcknowledged: boolean;
  guestRequest?: string;
  guestReview?: StructuredReview;
  hostReview?: StructuredReview;
  safetyCheckPerformed?: boolean;
  adminTrustOverride?: boolean;
  disputeReason?: string;
  guestPaymentMarked?: boolean;
  hostPaymentConfirmed?: boolean;
  hostConfirmationDate?: string;
  expectedCommission?: number;
  commissionMarkedSent?: boolean;
  commissionRemittanceNote?: string;
  disputeProofText?: string;
  disputeProofImage?: string;
  hostDisputeResponse?: 'NOT_RECEIVED' | 'RECEIVED_LATER';
  hostDisputeNote?: string;
  adminResolutionOutcome?: 'PAID' | 'NOT_PAID' | 'INCONCLUSIVE';
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
  rules: HouseRule[];
  photos: string[];
  pricePerNight: number;
  weeklyDiscount: boolean;
  availability: 'Always' | 'Select';
  verificationMethod: 'Vouch' | 'Video' | 'ID' | null;
  verificationCompleted: ('Phone' | 'Property' | 'Vouch' | 'Video' | 'ID')[];
  vouchDetails?: {
    name: string;
    phone: string;
    profileLink?: string;
    isExistingHost?: boolean;
  };
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  hostName?: string;
  dateSubmitted?: string;
  paymentMethodType?: 'MERCHANT_CODE' | 'PHONE_NUMBER';
  paymentIdentifier?: string;
  commissionConsent?: boolean;
}

export type View = 
  | 'ONBOARDING'
  | 'HOME' 
  | 'SEARCH' 
  | 'DETAIL' 
  | 'WISHLIST'
  | 'BOOKING_DATES' 
  | 'BOOKING_SUMMARY' 
  | 'GUEST_VERIFICATION'
  | 'PAYMENT' 
  | 'GUEST_PAYMENT_EDUCATION'
  | 'HOST_PAYMENT_EDUCATION'
  | 'PAYMENTS_POLICY'
  | 'FAQS'
  | 'PROCESSING' 
  | 'CONFIRMED' 
  | 'GUEST_STAYS' 
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
  | 'HOST_PAYMENT_SETUP'
  | 'HOST_VERIFICATION' 
  | 'HOST_STATUS' 
  | 'REVIEW_STAY'
  | 'TRUST_OVERVIEW'
  | 'REFERRAL_DASHBOARD';
