import Link from "next/link";
import { Headphones, ChevronRight } from "lucide-react";
import type { Device } from "@/types";
import { cn } from "@/lib/utils";
import { SOUND_SIGNATURE_LABELS, DEVICE_TYPE_LABELS, DEVICE_CARD_LABELS } from "@/data/labels";

type Props = { device: Device };

const SIGNATURE_COLORS: Record<string, string> = {
  "neutral":    "text-emerald-400",
  "v-shaped":   "text-purple-400",
  "bass-heavy": "text-orange-400",
  "warm":       "text-amber-400",
  "bright":     "text-sky-400",
  "mid-forward":"text-rose-400",
  "u-shaped":   "text-indigo-400",
};

// Map signature keys to label keys
const SIGNATURE_KEY_MAP: Record<string, keyof typeof SOUND_SIGNATURE_LABELS> = {
  "neutral":     "neutral",
  "v-shaped":    "vShaped",
  "bass-heavy":  "bassHeavy",
  "warm":        "warm",
  "bright":      "bright",
  "mid-forward": "midForward",
  "u-shaped":    "uShaped",
};

// Map device type keys to label keys
const TYPE_KEY_MAP: Record<string, keyof typeof DEVICE_TYPE_LABELS> = {
  tws:        "tws",
  iems:       "iems",
  "over-ear": "overEar",
  "on-ear":   "onEar",
};

export default function DeviceCard({ device }: Props) {
  const sigColor = SIGNATURE_COLORS[device.defaultSignature] ?? "text-text-muted";
  const sigLabelKey = SIGNATURE_KEY_MAP[device.defaultSignature];
  const sigLabel = sigLabelKey ? SOUND_SIGNATURE_LABELS[sigLabelKey] : device.defaultSignature;
  const typeLabelKey = TYPE_KEY_MAP[device.type];
  const typeLabel = typeLabelKey ? DEVICE_TYPE_LABELS[typeLabelKey] : device.type;

  return (
    <Link
      href={`/devices/${device.id}`}
      className="group bg-bg-card border border-bg-border rounded-card p-4 flex gap-4 items-center hover:border-brand/40 transition-colors"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-bg-border flex items-center justify-center shrink-0 group-hover:border-brand/30 transition-colors">
        <Headphones size={20} className="text-brand opacity-70" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-mono text-text-muted mb-0.5">{device.brand} · {typeLabel}</p>
        <h3 className="font-bold text-[14px] text-text-primary truncate">{device.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn("text-[10px] font-mono capitalize", sigColor)}>
            {sigLabel}
          </span>
          <span className="text-[10px] text-text-muted">·</span>
          <span className="text-[10px] font-mono text-text-muted">{device.driverType}</span>
        </div>
      </div>

      {/* Right */}
      <div className="shrink-0 text-right">
        <p className="text-[12px] font-mono text-brand">{device.presetCount} {DEVICE_CARD_LABELS.presetsCount}</p>
        <ChevronRight
          size={14}
          className="text-text-muted mt-1 ml-auto group-hover:text-brand transition-colors"
        />
      </div>
    </Link>
  );
}
