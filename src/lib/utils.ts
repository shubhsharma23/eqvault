import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Preset } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a Preset to a simple, readable EQ bands format for copying
 */
export function presetToGeneric(preset: Preset): string {
  const lines = [
    `EQ Settings: ${preset.name}`,
    '',
    ...preset.bands.map((band) => {
      const qPart = band.q ? ` Q:${band.q}` : '';
      return `${band.freq}Hz: ${band.gain > 0 ? '+' : ''}${band.gain}dB${qPart}`;
    })
  ];
  
  return lines.join('\n');
}
