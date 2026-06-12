import type { SoundSignature } from "@/types";

/**
 * Human-readable labels for sound signatures
 */
export const SIGNATURE_LABELS: Record<SoundSignature, string> = {
  "v-shaped": "V-Shaped",
  "warm": "Warm",
  "neutral": "Neutral",
  "bright": "Bright",
  "bass-heavy": "Bass-Heavy",
  "mid-forward": "Mid-Forward",
  "u-shaped": "U-Shaped",
};

/**
 * Frequency labels for EQ bands (10-band graphic EQ)
 */
export const FREQ_LABELS = [
  "32Hz",
  "64Hz",
  "125Hz",
  "250Hz",
  "500Hz",
  "1kHz",
  "2kHz",
  "4kHz",
  "8kHz",
  "16kHz",
];
