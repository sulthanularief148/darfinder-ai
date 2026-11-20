export type PropertyType = 'apartment' | 'villa' | 'townhouse';
export type PropertyPurpose = 'rent' | 'sale';
export type PropertyStatus = 'active' | 'rented' | 'sold';
export type LeadStatus = 'new' | 'contacted' | 'viewing_booked' | 'closed' | 'lost';

export interface Agent {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  agency_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  agent_id: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price_aed: number;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  area: string;
  latitude: number;
  longitude: number;
  furnished: boolean;
  pet_friendly: boolean;
  near_metro: boolean;
  parking: number;
  amenities: string[];
  description_en: string;
  description_ar: string | null;
  photos: string[];
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface PropertyEmbedding {
  id: string;
  property_id: string;
  embedding: number[];
  content_hash: string;
  created_at: string;
}

export interface Lead {
  id: string;
  property_id: string;
  agent_id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  preferred_contact_time: string | null;
  status: LeadStatus;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface SearchLog {
  id: string;
  query_text: string;
  parsed_filters: SearchFilters;
  result_count: number;
  ip_hash: string | null;
  created_at: string;
}

export interface SearchFilters {
  purpose?: PropertyPurpose;
  propertyType?: PropertyType;
  minBedrooms?: number;
  maxBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  areas?: string[];
  nearMetro?: boolean;
  petFriendly?: boolean;
  furnished?: boolean;
  amenities?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'relevance';
  freeTextIntent?: string;
}

export interface EnquiryInput {
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  preferred_contact_time?: string;
}

export const DUBAI_AREAS = [
  'Dubai Marina',
  'Downtown Dubai',
  'Business Bay',
  'JVC',
  'JLT',
  'Al Barsha',
  'Deira',
  'Dubai Hills',
  'Arabian Ranches',
  'Dubai Silicon Oasis',
] as const;

export type DubaiArea = typeof DUBAI_AREAS[number];
