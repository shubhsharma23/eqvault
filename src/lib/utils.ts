import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Preset } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a Preset to a generic text format for copying to clipboard
 */
export function presetToGeneric(preset: Preset): string {
  const lines = [
    `Preset: ${preset.name}`,
    `Device: ${preset.deviceId}`,
    `Signature: ${preset.signature}`,
    `Target: ${preset.targetSound}`,
    `Format: ${preset.format}`,
    `Author: ${preset.author}`,
    ``,
    `EQ Bands:`,
  ];
  
  preset.bands.forEach((band) => {
    const qPart = band.q ? ` (Q: ${band.q})` : "";
    lines.push(`  ${band.freq}Hz: ${band.gain > 0 ? "+" : ""}${band.gain}dB${qPart}`);
  });
  
  if (preset.description) {
    lines.push("", `Description: ${preset.description}`);
  }
  
  if (preset.tags.length > 0) {
    lines.push("", `Tags: ${preset.tags.join(", ")}`);
  }
  
  return lines.join("\n");
}
