
import React from 'react';
import { Listing, PropertyType, Amenity, ListingTag, TrustBadge, AmenityCategory, HouseRule } from './types';

export const HOUSE_RULES_TOOLTIPS: Record<string, { title: string, text: string }> = {
  general: {
    title: "Why house rules matter",
    text: "Clear rules help everyone feel comfortable and safe."
  },
  security_deposit: {
    title: "Security deposit",
    text: "This covers damages beyond normal wear."
  },
  curfew: {
    title: "Night curfew",
    text: "Helps maintain a quiet and respectful environment."
  },
  responsible_lead: {
    title: "Guest responsibility",
    text: "The lead guest speaks for the group."
  },
  violation_reported: {
    title: "Rule violation reported",
    text: "This issue has been sent for review."
  },
  payout_hold: {
    title: "Payout on hold",
    text: "Payout is paused while we review the report."
  },
  trust_impact: {
    title: "Trust impact notice",
    text: "Repeated rule violations may affect future bookings."
  }
};

export const DEFAULT_HOUSE_RULES: HouseRule[] = [
  // Safety & Security
  { id: 'no_smoking', category: 'Safety & Security', label: 'No Smoking Indoors', enabled: true, note: 'Smoking allowed outdoors only.' },
  { id: 'curfew', category: 'Safety & Security', label: 'Night Curfew', enabled: false, note: 'Quiet hours for community respect.', meta: { time: '22:00' } },
  { id: 'no_fires', category: 'Safety & Security', label: 'No Open Fires', enabled: true, note: 'No indoor fires. Ask host for approved outdoor fire areas.' },
  { id: 'lock_room', category: 'Safety & Security', label: 'Lockable Room Required', enabled: true, note: 'Guests must lock the room when away.' },
  
  // Guests & Behavior
  { id: 'max_guests', category: 'Guests & Behavior', label: 'Maximum Guests', enabled: true, meta: { count: 1 } },
  { id: 'responsible_lead', category: 'Guests & Behavior', label: 'Lead Guest Responsible', enabled: true, note: 'Lead guest accepts responsibility for group behavior.' },
  { id: 'no_parties', category: 'Guests & Behavior', label: 'No Parties / Events', enabled: true, note: 'No parties or loud events unless pre-approved.' },
  
  // Pets
  { id: 'no_pets', category: 'Pets & Animals', label: 'No Pets Allowed', enabled: true },
  { id: 'pets_permission', category: 'Pets & Animals', label: 'Pets Allowed with Permission', enabled: false, note: 'Add pet rules (size, vaccines).' },

  // Cleanliness
  { id: 'no_shoes', category: 'Cleanliness & Facilities', label: 'Remove Shoes Indoors', enabled: false, note: 'Please remove shoes inside the main house.' },
  { id: 'no_room_cooking', category: 'Cleanliness & Facilities', label: 'No Cooking in Room', enabled: true, note: 'Kitchen available; no cooking inside bedrooms.' },
  { id: 'waste', category: 'Cleanliness & Facilities', label: 'Waste Disposal', enabled: true, note: 'Use provided bins.' },

  // Cultural
  { id: 'modesty', category: 'Cultural & Respect', label: 'Dress Modesty', enabled: false, note: 'Respect local customs: modest dress inside.' },
  { id: 'photos', category: 'Cultural & Respect', label: 'Photography Consent', enabled: true, note: 'Ask host before photographing family or interior.' },

  // Check-in
  { id: 'check_in_window', category: 'Check-in / Check-out', label: 'Check-in window', enabled: true, meta: { time: '14:00', endTime: '20:00' } },
  { id: 'check_out_time', category: 'Check-in / Check-out', label: 'Check-out time', enabled: true, meta: { time: '11:00' } },

  // Payment
  { 
    id: 'security_deposit', 
    category: 'Payment & Damages', 
    label: 'Security Deposit Required', 
    enabled: false, 
    meta: { amount: 0 }, 
    note: 'this is held in case damages, and refunded on checkout' 
  },
  { 
    id: 'damage_responsibility', 
    category: 'Payment & Damages', 
    label: 'Damage responsibility', 
    enabled: true, 
    note: 'Guests may be charged for damages caused during the stay.' 
  },

  // Farm/Local
  { id: 'animals_present', category: 'Misc / Local Specifics', label: 'Animals on Premises', enabled: false, note: 'Farm animals present.' },
  { id: 'power_outage', category: 'Misc / Local Specifics', label: 'Electricity interruptions expected', enabled: true, note: 'Power outages common; please plan.' },
];

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    id: 'connectivity',
    name: 'Connectivity & Work',
    icon: '📶',
    amenities: [
      { id: 'wifi', name: 'Wi-Fi', icon: '📶', category: 'connectivity' },
      { id: 'workspace', name: 'Workspace', icon: '💻', category: 'connectivity' },
      { id: 'desk_chair', name: 'Desk & Chair', icon: '🪑', category: 'connectivity' },
      { id: 'charging', name: 'Charging Area / Extension Cables', icon: '🔌', category: 'connectivity' },
      { id: 'mobile_net', name: 'Strong Mobile Signal', icon: '📡', category: 'connectivity' },
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Food',
    icon: '🍳',
    amenities: [
      { id: 'kitchen', name: 'Kitchen Access', icon: '🍳', category: 'kitchen' },
      { id: 'breakfast', name: 'Breakfast Included', icon: '☕', category: 'kitchen' },
      { id: 'shared_kitchen', name: 'Shared Kitchen', icon: '🥣', category: 'kitchen' },
      { id: 'private_kitchen', name: 'Private Kitchen', icon: '👨‍🍳', category: 'kitchen' },
      { id: 'fridge', name: 'Refrigerator', icon: '🧊', category: 'kitchen' },
      { id: 'stove', name: 'Cooking Stove', icon: '🔥', category: 'kitchen' },
      { id: 'utensils', name: 'Cooking Utensils', icon: '🍴', category: 'kitchen' },
      { id: 'meals_paid', name: 'Meals Available (Paid)', icon: '🍱', category: 'kitchen' },
      { id: 'outdoor_cooking', name: 'Outdoor Cooking Area', icon: '🥘', category: 'kitchen' },
    ]
  },
  {
    id: 'bathroom',
    name: 'Bathroom & Laundry',
    icon: '🚿',
    amenities: [
      { id: 'shower', name: 'Hot Shower', icon: '🚿', category: 'bathroom' },
      { id: 'laundry', name: 'Laundry Service', icon: '🧺', category: 'bathroom' },
      { id: 'private_bathroom', name: 'Private Bathroom', icon: '🚽', category: 'bathroom' },
      { id: 'shared_bathroom', name: 'Shared Bathroom', icon: '🧼', category: 'bathroom' },
      { id: 'handwash', name: 'Hand-wash Area', icon: '🚰', category: 'bathroom' },
      { id: 'drying_line', name: 'Drying Line / Rack', icon: '👕', category: 'bathroom' },
      { id: 'iron', name: 'Iron', icon: '💨', category: 'bathroom' },
    ]
  },
  {
    id: 'power_water',
    name: 'Power & Water',
    icon: '☀️',
    amenities: [
      { id: 'solar', name: 'Solar Power', icon: '☀️', category: 'power_water' },
      { id: 'water_tank', name: 'Water Tank', icon: '🚰', category: 'power_water' },
      { id: 'grid_power', name: 'Grid Electricity', icon: '⚡', category: 'power_water' },
      { id: 'generator', name: 'Backup Generator', icon: '🔋', category: 'power_water' },
      { id: 'running_water', name: 'Running Water', icon: '💧', category: 'power_water' },
      { id: 'fan_basic', name: 'Fan', icon: '🌀', category: 'power_water' },
      { id: 'heater', name: 'Heater', icon: '♨️', category: 'power_water' },
    ]
  },
  {
    id: 'safety',
    name: 'Safety & Security',
    icon: '🛡️',
    amenities: [
      { id: 'security', name: '24/7 Security', icon: '🛡️', category: 'safety' },
      { id: 'night_guard', name: 'Night Guard', icon: '💂', category: 'safety' },
      { id: 'gated', name: 'Gated Compound', icon: '🚧', category: 'safety' },
      { id: 'lit_property', name: 'Well-lit Property', icon: '💡', category: 'safety' },
      { id: 'lockable_room', name: 'Lockable Room', icon: '🔑', category: 'safety' },
      { id: 'safe', name: 'Safe / Lockbox', icon: '🔒', category: 'safety' },
      { id: 'extinguisher', name: 'Fire Extinguisher', icon: '🧯', category: 'safety' },
      { id: 'first_aid', name: 'First Aid Kit', icon: '🩹', category: 'safety' },
    ]
  },
  {
    id: 'outdoor',
    name: 'Outdoor & Living',
    icon: '🌿',
    amenities: [
      { id: 'garden', name: 'Garden / Yard', icon: '🌿', category: 'outdoor' },
      { id: 'balcony', name: 'Balcony / Terrace', icon: '🏙️', category: 'outdoor' },
      { id: 'veranda', name: 'Veranda', icon: '🛖', category: 'outdoor' },
      { id: 'courtyard', name: 'Courtyard', icon: '⛲', category: 'outdoor' },
      { id: 'outdoor_seating', name: 'Outdoor Seating', icon: '⛱️', category: 'outdoor' },
      { id: 'fire_pit', name: 'Fire Pit', icon: '🔥', category: 'outdoor' },
      { id: 'scenic_view', name: 'Scenic View', icon: '🌄', category: 'outdoor' },
    ]
  },
  {
    id: 'comfort',
    name: 'Comfort & Health',
    icon: '🦟',
    amenities: [
      { id: 'mosquito_net', name: 'Mosquito Net', icon: '🕸️', category: 'comfort' },
      { id: 'ac', name: 'Air Conditioning', icon: '❄️', category: 'comfort' },
      { id: 'extra_bedding', name: 'Extra Bedding', icon: '🛌', category: 'comfort' },
      { id: 'floor_mattress', name: 'Floor Mattress', icon: '💤', category: 'comfort' },
    ]
  },
  {
    id: 'family',
    name: 'Family & Groups',
    icon: '👨‍👩‍👧‍👦',
    amenities: [
      { id: 'family_friendly_tag', name: 'Family-Friendly', icon: '👨‍👩‍👧‍👦', category: 'family' },
      { id: 'children_allowed', name: 'Children Allowed', icon: '👶', category: 'family' },
      { id: 'baby_cot', name: 'Baby Cot / Mattress', icon: '🛏️', category: 'family' },
      { id: 'extra_floor_mattress_group', name: 'Extra Floor Mattress', icon: '💤', category: 'family' },
      { id: 'large_compound', name: 'Large Compound', icon: '🏡', category: 'family' },
      { id: 'group_seating', name: 'Group Seating Area', icon: '👥', category: 'family' },
    ]
  },
  {
    id: 'transport',
    name: 'Transport & Access',
    icon: '🚗',
    amenities: [
      { id: 'parking', name: 'Parking on Premises', icon: '🅿️', category: 'transport' },
      { id: 'moto_parking', name: 'Motorcycle Parking', icon: '🏍️', category: 'transport' },
      { id: 'road_car', name: 'Road Accessible by Car', icon: '🛣️', category: 'transport' },
      { id: 'road_4x4', name: '4x4 Access Only', icon: '🚜', category: 'transport' },
      { id: 'airport_pickup', name: 'Airport Pickup (Paid)', icon: '🚐', category: 'transport' },
      { id: 'public_transport', name: 'Public Transport Nearby', icon: '🚌', category: 'transport' },
    ]
  },
  {
    id: 'cultural',
    name: 'Cultural & Local',
    icon: '🥁',
    amenities: [
      { id: 'host_lives_tag', name: 'Host Lives on Site', icon: '🏠', category: 'cultural' },
      { id: 'village_setting', name: 'Village Setting', icon: '🛖', category: 'cultural' },
      { id: 'traditional_design', name: 'Traditional Home Design', icon: '🎨', category: 'cultural' },
      { id: 'farm_activities', name: 'Farm Activities', icon: '🐔', category: 'cultural' },
      { id: 'local_guide', name: 'Local Guide Available', icon: '🗺️', category: 'cultural' },
      { id: 'cultural_activities', name: 'Cultural Activities Nearby', icon: '🎭', category: 'cultural' },
    ]
  },
];

export const AMENITIES: Amenity[] = AMENITY_CATEGORIES.flatMap(cat => cat.amenities);

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
    tooltip: 'This user has confirmed their identity to keep our community safe.',
    microcopy: 'Verified Wacu ID'
  },
  'Contact Verified': {
    icon: '📱',
    tooltip: 'This user is reachable and part of our trusted contact circle.',
    microcopy: 'Wacu Contact Verified'
  },
  'Active Host': {
    icon: '🏠',
    tooltip: 'This host has successfully opened their home to many guests.',
    microcopy: 'Trusted Wacu Host'
  },
  'Active Guest': {
    icon: '🎒',
    tooltip: 'This guest has stayed in many homes and followed all rules.',
    microcopy: 'Respected Wacu Guest'
  },
  'Community Trusted': {
    icon: '✨',
    tooltip: 'Consistently high ratings from the community family.',
    microcopy: 'Wacu Legend'
  },
  'Safety Pledge': {
    icon: '🤝',
    tooltip: 'This user has pledged to treat every stay as their own home.',
    microcopy: 'Wacu Pledge Signed'
  },
  'Elite Voucher': {
    icon: '💎',
    tooltip: 'Awarded for exceptional community contributions and high-trust referrals.',
    microcopy: 'Elite Community Voucher'
  }
};

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
  [PropertyType.GROUP_FAMILY_COMPOUND]: '👨‍👩‍👧',
};

export const CATEGORY_DESCRIPTIONS: Record<PropertyType, string> = {
  [PropertyType.FAMILY_HOMESTAY]: 'Stay with a local family. Host lives on site and shares common spaces.',
  [PropertyType.SHARED_HOME]: 'Private room inside a lived-in home. Host lives on the property.',
  [PropertyType.ENTIRE_HOME]: 'Full house or apartment. A private stay with no host on site.',
  [PropertyType.VILLAGE_STAY]: 'Traditional experience, often in rural village settings.',
  [PropertyType.FARM_STAY]: 'A stay on a working farm or plantation (coffee, tea, or crops).',
  [PropertyType.ECO_STAY]: 'Nature-based, low-impact stay (solar power, near parks or lakes).',
  [PropertyType.GUESTHOUSE_COMPOUND]: 'Locally run compound with multiple rooms for the community.',
  [PropertyType.CITY_APARTMENT]: 'Urban stay or flat, perfect for city explorers.',
  [PropertyType.CULTURAL_STAY]: 'A stay centered around cultural heritage and artisan traditions.',
  [PropertyType.GROUP_FAMILY_COMPOUND]: 'Large compound suitable for extended families or groups.',
};
