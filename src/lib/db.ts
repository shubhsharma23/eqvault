/**
 * Database utility functions that fetch from Supabase and transform
 * snake_case database rows to camelCase application types.
 */

import { createServerSupabaseClient } from "@/lib/supabase";
import type { Device, Preset, EQBand } from "@/types";
import type { DeviceRow, PresetRow, EQBandRow } from "@/types/database";

/**
 * Group EQ bands by preset_id
 */
function groupBands(bands: EQBandRow[]): Record<string, EQBandRow[]> {
  return bands.reduce<Record<string, EQBandRow[]>>((acc, b) => {
    (acc[b.preset_id] ??= []).push(b);
    return acc;
  }, {});
}

/**
 * Transform database device row (snake_case) to application Device type (camelCase)
 */
function mapDeviceRowToDevice(row: DeviceRow): Device {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    type: row.type as "tws" | "iems" | "over-ear" | "on-ear",
    driverType: row.driver_type,
    defaultSignature: row.signature as Device["defaultSignature"],
    presetCount: row.preset_count,
  };
}

/**
 * Transform database EQ band row to application EQBand type
 */
function mapEQBandRowToEQBand(row: EQBandRow): EQBand {
  return {
    freq: row.freq,
    gain: row.gain,
    q: row.q ?? undefined,
  };
}

/**
 * Transform database preset row with bands to application Preset type
 */
function mapPresetRowToPreset(
  row: PresetRow,
  bands: EQBandRow[]
): Preset {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    deviceId: row.device_id,
    targetSound: row.target_sound ?? "",
    signature: row.signature as Preset["signature"],
    tags: row.tags ?? [],
    bands: bands
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapEQBandRowToEQBand),
    format: row.format as Preset["format"],
    author: row.author_name ?? "Anonymous",
    upvotes: row.upvotes,
    createdAt: row.created_at,
  };
}

/**
 * Fetch all devices from Supabase
 */
export async function getAllDevices(): Promise<Device[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("devices")
    .select("id, name, brand, type, driver_type, signature, preset_count, created_at")
    .order("brand", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching devices:", error);
    return [];
  }

  return ((data as DeviceRow[]) ?? []).map(mapDeviceRowToDevice);
}

/**
 * Fetch a single device by ID
 */
export async function getDeviceById(id: string): Promise<Device | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("devices")
    .select("id, name, brand, type, driver_type, signature, preset_count, created_at")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("Error fetching device:", error);
    return null;
  }

  return data ? mapDeviceRowToDevice(data as DeviceRow) : null;
}

/**
 * Fetch all presets with their EQ bands from Supabase
 */
export async function getAllPresets(): Promise<Preset[]> {
  const supabase = await createServerSupabaseClient();
  
  // Fetch presets first
  const { data: presetRows, error: presetError } = await supabase
    .from("presets")
    .select("id, device_id, name, description, target_sound, signature, tags, format, author_name, upvotes, created_at")
    .order("created_at", { ascending: false });

  if (presetError) {
    console.error("Error fetching presets:", presetError);
    return [];
  }

  if (!presetRows || presetRows.length === 0) {
    return [];
  }

  // Fetch all bands for these presets
  const presetIds = (presetRows as PresetRow[]).map(p => p.id);
  const { data: bandRows, error: bandError } = await supabase
    .from("eq_bands")
    .select("id, preset_id, freq, gain, q, sort_order")
    .in("preset_id", presetIds);

  if (bandError) {
    console.error("Error fetching eq_bands:", bandError);
    return [];
  }

  // Group bands by preset_id
  const bandsByPreset = groupBands((bandRows as EQBandRow[]) ?? []);

  // Map presets with their bands
  return (presetRows as PresetRow[]).map(row => 
    mapPresetRowToPreset(row, bandsByPreset[row.id] ?? [])
  );
}

/**
 * Fetch presets for a specific device
 */
export async function getPresetsByDeviceId(
  deviceId: string
): Promise<Preset[]> {
  const supabase = await createServerSupabaseClient();
  
  // Fetch presets for this device
  const { data: presetRows, error: presetError } = await supabase
    .from("presets")
    .select("id, device_id, name, description, target_sound, signature, tags, format, author_name, upvotes, created_at")
    .eq("device_id", deviceId)
    .order("upvotes", { ascending: false });

  if (presetError) {
    console.error("Error fetching presets by device:", presetError);
    return [];
  }

  if (!presetRows || presetRows.length === 0) {
    return [];
  }

  // Fetch all bands for these presets
  const presetIds = (presetRows as PresetRow[]).map(p => p.id);
  const { data: bandRows, error: bandError } = await supabase
    .from("eq_bands")
    .select("id, preset_id, freq, gain, q, sort_order")
    .in("preset_id", presetIds);

  if (bandError) {
    console.error("Error fetching eq_bands:", bandError);
    return [];
  }

  // Group bands by preset_id
  const bandsByPreset = groupBands((bandRows as EQBandRow[]) ?? []);

  // Map presets with their bands
  return (presetRows as PresetRow[]).map(row => 
    mapPresetRowToPreset(row, bandsByPreset[row.id] ?? [])
  );
}

/**
 * Fetch a single preset by ID with its EQ bands
 */
export async function getPresetById(id: string): Promise<Preset | null> {
  const supabase = await createServerSupabaseClient();
  
  // Fetch the preset
  const { data: presetRow, error: presetError } = await supabase
    .from("presets")
    .select("id, device_id, name, description, target_sound, signature, tags, format, author_name, upvotes, created_at")
    .eq("id", id)
    .single();

  if (presetError) {
    if (presetError.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("Error fetching preset:", presetError);
    return null;
  }

  if (!presetRow) return null;

  // Fetch bands for this preset
  const { data: bandRows, error: bandError } = await supabase
    .from("eq_bands")
    .select("id, preset_id, freq, gain, q, sort_order")
    .eq("preset_id", id);

  if (bandError) {
    console.error("Error fetching eq_bands:", bandError);
    return null;
  }

  return mapPresetRowToPreset(presetRow as PresetRow, (bandRows as EQBandRow[]) ?? []);
}
