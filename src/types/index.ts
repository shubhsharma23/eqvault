export type SoundSignature =
  | "v-shaped"
  | "warm"
  | "neutral"
  | "bright"
  | "bass-heavy"
  | "mid-forward"
  | "u-shaped";

export type EQBand = {
  freq: string;   // e.g. "32", "64", "1k"
  gain: number;   // dB, e.g. +4.5 or -2.0
  q?: number;     // bandwidth (for parametric EQ)
};

export type EQFormat = "10-band" | "parametric" | "wavelet" | "generic";

export type Preset = {
  id: string;
  name: string;
  description: string;
  deviceId: string;
  targetSound: string;        // e.g. "Sony WF-1000XM5 signature"
  signature: SoundSignature;
  tags: string[];
  bands: EQBand[];
  format: EQFormat;
  author: string;
  upvotes: number;
  createdAt: string;
};

export type Device = {
  id: string;
  name: string;              // e.g. "Oppo Enco Air 3 Pro"
  brand: string;
  type: "tws" | "iems" | "over-ear" | "on-ear";
  driverType: string;
  defaultSignature: SoundSignature;
  presetCount: number;
};

export type PresetFilter = {
  signature?: SoundSignature;
  deviceId?: string;
  tag?: string;
  format?: EQFormat;
};
