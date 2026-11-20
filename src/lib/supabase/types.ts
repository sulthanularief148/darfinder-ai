// Hand-written database types matching our migrations.
// In production you'd generate these with `supabase gen types typescript`.
// We define them manually so there's no build step dependency on the Supabase CLI.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
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
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          agency_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          agency_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_demo?: boolean;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          agent_id: string;
          title: string;
          type: 'apartment' | 'villa' | 'townhouse';
          purpose: 'rent' | 'sale';
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
          status: 'active' | 'rented' | 'sold';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          title: string;
          type: 'apartment' | 'villa' | 'townhouse';
          purpose: 'rent' | 'sale';
          price_aed: number;
          bedrooms: number;
          bathrooms: number;
          size_sqft: number;
          area: string;
          latitude: number;
          longitude: number;
          furnished?: boolean;
          pet_friendly?: boolean;
          near_metro?: boolean;
          parking?: number;
          amenities?: string[];
          description_en: string;
          description_ar?: string | null;
          photos?: string[];
          status?: 'active' | 'rented' | 'sold';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          agent_id?: string;
          title?: string;
          type?: 'apartment' | 'villa' | 'townhouse';
          purpose?: 'rent' | 'sale';
          price_aed?: number;
          bedrooms?: number;
          bathrooms?: number;
          size_sqft?: number;
          area?: string;
          latitude?: number;
          longitude?: number;
          furnished?: boolean;
          pet_friendly?: boolean;
          near_metro?: boolean;
          parking?: number;
          amenities?: string[];
          description_en?: string;
          description_ar?: string | null;
          photos?: string[];
          status?: 'active' | 'rented' | 'sold';
          updated_at?: string;
        };
      };
      property_embeddings: {
        Row: {
          id: string;
          property_id: string;
          embedding: number[];
          content_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          embedding: number[];
          content_hash: string;
          created_at?: string;
        };
        Update: {
          property_id?: string;
          embedding?: number[];
          content_hash?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          property_id: string;
          agent_id: string;
          name: string;
          email: string;
          phone: string;
          message: string | null;
          preferred_contact_time: string | null;
          status: 'new' | 'contacted' | 'viewing_booked' | 'closed' | 'lost';
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          agent_id: string;
          name: string;
          email: string;
          phone: string;
          message?: string | null;
          preferred_contact_time?: string | null;
          status?: 'new' | 'contacted' | 'viewing_booked' | 'closed' | 'lost';
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'new' | 'contacted' | 'viewing_booked' | 'closed' | 'lost';
          updated_at?: string;
        };
      };
      search_logs: {
        Row: {
          id: string;
          query_text: string;
          parsed_filters: Json;
          result_count: number;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          query_text: string;
          parsed_filters?: Json;
          result_count?: number;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: {
          query_text?: string;
          parsed_filters?: Json;
          result_count?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_properties: {
        Args: {
          query_embedding: string;
          match_count?: number;
          property_ids?: string[];
        };
        Returns: { id: string; similarity: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
