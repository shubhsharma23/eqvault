// Auto-generated types matching the Supabase schema exactly.
// Column names here are snake_case (as stored in Postgres).
// The db.ts layer maps these to camelCase for the rest of the app.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      devices: {
        Row: {
          id:            string;
          name:          string;
          brand:         string;
          type:          string;
          driver_type:   string;
          signature:     string;
          preset_count:  number;
          created_at:    string;
        };
        Insert: {
          id:            string;
          name:          string;
          brand:         string;
          type:          string;
          driver_type:   string;
          signature:     string;
          preset_count?: number;
          created_at?:   string;
        };
        Update: Partial<Database["public"]["Tables"]["devices"]["Insert"]>;
      };
      presets: {
        Row: {
          id:           string;
          device_id:    string;
          name:         string;
          description:  string | null;
          target_sound: string | null;
          signature:    string;
          tags:         string[] | null;
          format:       string;
          author_name:  string | null;
          upvotes:      number;
          created_at:   string;
        };
        Insert: {
          id?:          string;
          device_id:    string;
          name:         string;
          description?: string | null;
          target_sound?: string | null;
          signature:    string;
          tags?:        string[] | null;
          format?:      string;
          author_name?: string | null;
          upvotes?:     number;
          created_at?:  string;
        };
        Update: Partial<Database["public"]["Tables"]["presets"]["Insert"]>;
      };
      eq_bands: {
        Row: {
          id:         string;
          preset_id:  string;
          freq:       string;
          gain:       number;
          q:          number | null;
          sort_order: number;
        };
        Insert: {
          id?:        string;
          preset_id:  string;
          freq:       string;
          gain:       number;
          q?:         number | null;
          sort_order: number;
        };
        Update: Partial<Database["public"]["Tables"]["eq_bands"]["Insert"]>;
      };
    };
    Views:   Record<string, never>;
    Functions: Record<string, never>;
    Enums:   Record<string, never>;
  };
};

// Convenience row types
export type DeviceRow  = Database["public"]["Tables"]["devices"]["Row"];
export type PresetRow  = Database["public"]["Tables"]["presets"]["Row"];
export type EQBandRow  = Database["public"]["Tables"]["eq_bands"]["Row"];

// Insert types for seeding
export type DeviceInsert = Database["public"]["Tables"]["devices"]["Insert"];
export type PresetInsert = Database["public"]["Tables"]["presets"]["Insert"];
export type EQBandInsert = Database["public"]["Tables"]["eq_bands"]["Insert"];

// Preset row joined with its bands — returned by getPresetWithBands()
export type PresetWithBandsRow = PresetRow & { eq_bands: EQBandRow[] };