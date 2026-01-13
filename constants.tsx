
import React from 'react';
import { Listing, PropertyType, Amenity, ListingTag, TrustBadge } from './types';

export const AMENITIES: Amenity[] = [
  { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'shower', name: 'Hot Shower', icon: '🚿' },
  { id: 'security', name: '24/7 Security', icon: '🛡️' },
  { id: 'solar', name: 'Solar Power', icon: '☀️' },
  { id: 'garden', name: 'Garden', icon: '🌿' },
];

export const LISTING_TAGS: ListingTag[] = [
  'Host lives on site',
  'Meals available',
  'Family-friendly',
  'Rural setting',
  'Near national park',
  'Off-grid / solar',
  'Long-stay friendly',
  'Group-friendly'
];

export const BADGE_METADATA: Record<TrustBadge, { icon: string, tooltip: string, microcopy: string }> = {
  'Identity Verified': {
    icon: '🛡️',
    tooltip: 'This user has confirmed their identity to keep our Wacu community safe.',
    microcopy: 'Verified Wacu ID'
  },
  'Contact Verified': {
    icon: '📱',
    tooltip: 'This user is reachable and part of our trusted contact circle.',
    microcopy: 'Wacu Contact Verified'
  },
  'Active Host': {
    icon: '🏠',
    tooltip: 'This host has successfully opened their Wacu to many guests.',
    microcopy: 'Trusted Wacu Host'
  },
  'Active Guest': {
    icon: '🎒',
    tooltip: 'This guest has stayed in many Wacus and followed all rules.',
    microcopy: 'Respected Wacu Guest'
  },
  'Community Trusted': {
    icon: '✨',
    tooltip: 'Consistently high ratings from the Wacu family.',
    microcopy: 'Wacu Legend'
  },
  'Safety Pledge': {
    icon: '🤝',
    tooltip: 'This user has pledged to treat every stay as their own Wacu.',
    microcopy: 'Wacu Pledge Signed'
  }
};

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Peaceful Homestay in Musanze',
    hostName: 'Jean Bosco',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    isVerified: true,
    pricePerNight: 12500,
    type: PropertyType.FAMILY_HOMESTAY,
    tags: ['Host lives on site', 'Rural setting', 'Family-friendly', 'Meals available'],
    legacyCategory: 'Homestay',
    capacity: 2,
    bathroomCount: 1,
    petFriendly: false,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    description: 'Experience local Rwandan life at the foot of the Volcanoes. We offer traditional meals and a quiet garden.',
    landmark: 'Near Musanze Market',
    distanceToLandmark: '5 mins walk',
    what3words: '///fountain.pizzas.climbing',
    howToGetThere: 'Take a moto-taxi from Musanze town center towards the market. Our Wacu is behind the big yellow shop.',
    amenities: [AMENITIES[1], AMENITIES[2], AMENITIES[5]],
    rating: 4.8,
    reviewCount: 12,
    likesCount: 245,
    sharesCount: 12,
    location: { lat: -1.5034, lng: 29.6350 },
    hostBio: "I've lived in Musanze my whole life. I love sharing our local history and our Wacu.",
    hostJoinDate: "Joined Wacu June 2021",
    hostLanguages: ["Kinyarwanda", "French", "English"],
    hostResponseRate: "100%",
    hostResponseTime: "within an hour",
    hostWork: "Tourism Guide",
    hostInteraction: "I love to share a meal and stories with my guests in our Wacu.",
    hostFavoriteLandmark: "The Twin Lakes viewpoints",
    hostTrustBadges: ['Identity Verified', 'Contact Verified', 'Active Host', 'Community Trusted', 'Safety Pledge'],
    hostCompletedStays: 45,
    verifiedChecks: { identity: true, phone: true, communityVouch: true, propertyVerified: true, videoVerified: true },
    reviews: [
      { id: 'r1', user: 'Clarisse K.', rating: 5, comment: 'Amazing hospitality in this beautiful Wacu!', date: '2 days ago', likes: 12 }
    ]
  },
  {
    id: '2',
    title: 'Kigali View Apartment',
    hostName: 'Clarisse K.',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    isVerified: true,
    pricePerNight: 35000,
    type: PropertyType.CITY_APARTMENT,
    tags: ['Long-stay friendly', 'Family-friendly'],
    legacyCategory: 'Premium',
    capacity: 4,
    bathroomCount: 2,
    petFriendly: true,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
    description: 'Modern luxury with a stunning view of the Kigali city skyline. A perfect city Wacu.',
    landmark: 'Close to Kigali Heights',
    distanceToLandmark: '10 mins walk',
    what3words: '///modern.city.view',
    howToGetThere: 'Located in Kimihurura. This Wacu is next to the Convention Center.',
    amenities: [AMENITIES[0], AMENITIES[1], AMENITIES[2], AMENITIES[3]],
    rating: 4.9,
    reviewCount: 28,
    likesCount: 890,
    sharesCount: 54,
    location: { lat: -1.9441, lng: 30.0619 },
    hostBio: "Professional Wacu host based in Kigali.",
    hostJoinDate: "Joined Wacu January 2022",
    hostLanguages: ["English", "Kinyarwanda"],
    hostResponseRate: "98%",
    hostResponseTime: "within 30 mins",
    hostWork: "Real Estate Management",
    hostInteraction: "I give guests complete privacy in their city Wacu.",
    hostFavoriteLandmark: "Kimihurura's many cafes",
    hostTrustBadges: ['Contact Verified', 'Active Host', 'Safety Pledge'],
    hostCompletedStays: 120,
    verifiedChecks: { identity: true, phone: true, communityVouch: false, propertyVerified: true, videoVerified: false },
    reviews: [
      { id: 'r3', user: 'David W.', rating: 5, comment: 'Spectacular view from a great Wacu.', date: '3 days ago', likes: 23 }
    ]
  }
];

export const RW_CITIES = ['Kigali', 'Musanze', 'Gisenyi', 'Butare', 'Kibuye', 'Nyamata'];

export const CATEGORY_ICONS: Record<PropertyType, string> = {
  [PropertyType.FAMILY_HOMESTAY]: '🌍',
  [PropertyType.SHARED_HOME]: '🏠',
  [PropertyType.ENTIRE_HOME]: '🔑',
  [PropertyType.VILLAGE_STAY]: '🛖',
  [PropertyType.FARM_STAY]: '🚜',
  [PropertyType.ECO_STAY]: '🌱',
  [PropertyType.GUESTHOUSE_COMPOUND]: '🏢',
  [PropertyType.CITY_APARTMENT]: '🌇',
  [PropertyType.CULTURAL_STAY]: '🥁',
  [PropertyType.GROUP_FAMILY_COMPOUND]: '👨‍👩‍👧‍👦',
};

export const CATEGORY_DESCRIPTIONS: Record<PropertyType, string> = {
  [PropertyType.FAMILY_HOMESTAY]: 'Stay with a local family in their Wacu. Host lives on site and shares common spaces.',
  [PropertyType.SHARED_HOME]: 'Private room inside a lived-in Wacu. Host lives on the property.',
  [PropertyType.ENTIRE_HOME]: 'Full house or apartment. A private Wacu with no host on site.',
  [PropertyType.VILLAGE_STAY]: 'Traditional Wacu experience, often in rural village settings.',
  [PropertyType.FARM_STAY]: 'A Wacu on a working farm or plantation (coffee, tea, or crops).',
  [PropertyType.ECO_STAY]: 'Nature-based, low-impact Wacu (solar power, near parks or lakes).',
  [PropertyType.GUESTHOUSE_COMPOUND]: 'Locally run Wacu compound with multiple rooms for the community.',
  [PropertyType.CITY_APARTMENT]: 'Urban Wacu or flat, perfect for city explorers.',
  [PropertyType.CULTURAL_STAY]: 'A Wacu centered around cultural heritage and artisan traditions.',
  [PropertyType.GROUP_FAMILY_COMPOUND]: 'Large Wacu compound suitable for extended families or groups.',
};
