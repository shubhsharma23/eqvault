import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Headphones, Cpu, Radio, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PresetCard from "@/components/eq/PresetCard";
import { getDeviceById, getPresetsByDeviceId } from "@/lib/db";
import type { Device, Preset } from "@/types";
import { cn } from "@/lib/utils";

// ── Helpers ────────────────────────────────────────────────────

const SIGNATURE_STYLES: Record<string, { pill: string; glow: string; label: string }> = {
  "neutral":     { pill: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", glow: "rgba(52,211,153,0.06)", label: "Neutral" },
  "v-shaped":    { pill: "text-purple-400 bg-purple-400/10 border-purple-400/20",   glow: "rgba(167,139,250,0.06)", label: "V-Shaped" },
  "bass-heavy":  { pill: "text-orange-400 bg-orange-400/10 border-orange-400/20",   glow: "rgba(251,146,60,0.06)",  label: "Bass Heavy" },
  "warm":        { pill: "text-amber-400 bg-amber-400/10 border-amber-400/20",       glow: "rgba(251,191,36,0.06)",  label: "Warm" },
  "bright":      { pill: "text-sky-400 bg-sky-400/10 border-sky-400/20",             glow: "rgba(56,189,248,0.06)",  label: "Bright" },
  "mid-forward": { pill: "text-rose-400 bg-rose-400/10 border-rose-400/20",          glow: "rgba(251,113,133,0.06)", label: "Mid Forward" },
  "u-shaped":    { pill: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",    glow: "rgba(129,140,248,0.06)", label: "U-Shaped" },
};

const TYPE_LABELS: Record<string, string> = {
  tws:      "True Wireless",
  iems:     "Wired IEM",
  "over-ear": "Over-Ear",
  "on-ear":   "On-Ear",
};

function formatUpvotes(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ── Device hero section ────────────────────────────────────────

function DeviceHero({ device, presets }: { device: Device; presets: Preset[] }) {
  const sig = SIGNATURE_STYLES[device.defaultSignature] ?? SIGNATURE_STYLES["neutral"];
  const totalUpvotes = presets.reduce((s, p) => s + p.upvotes, 0);
  const topSignatures = [...new Set(presets.map((p) => p.signature))].slice(0, 3);

  return (
    <div
      className="rounded-card border border-bg-border p-6 md:p-8 mb-8 relative overflow-hidden"
      style={{ background: `radial-gradient(ellipse at top left, ${sig.glow} 0%, transparent 60%), #16161f` }}
    >
      {/* Back link */}
      <Link
        href="/devices"
        className="inline-flex items-center gap-1.5 text-[12px] font-mono text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={12} />
        All devices
      </Link>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-bg-border flex items-center justify-center shrink-0">
          <Headphones size={28} className="text-brand opacity-80" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-mono text-text-muted">{device.brand}</span>
            <span className="text-[11px] text-text-muted">·</span>
            <span className="text-[11px] font-mono text-text-muted">{TYPE_LABELS[device.type] ?? device.type}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-3">
            {device.name}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={cn("text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border capitalize", sig.pill)}>
              {sig.label}
            </span>
            {topSignatures
              .filter((s) => s !== device.defaultSignature)
              .map((s) => {
                const st = SIGNATURE_STYLES[s];
                return (
                  <span key={s} className={cn("text-[11px] font-mono px-2.5 py-1 rounded-full border capitalize", st?.pill)}>
                    {st?.label ?? s}
                  </span>
                );
              })}
          </div>

          {/* Specs row */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: Cpu,    label: "Driver",   value: device.driverType },
              { icon: Layers, label: "Presets",  value: `${presets.length} available` },
              { icon: Radio,  label: "Upvotes",  value: formatUpvotes(totalUpvotes) + " total" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={13} className="text-text-muted shrink-0" />
                <div>
                  <p className="text-[10px] font-mono text-text-muted leading-none">{label}</p>
                  <p className="text-[13px] font-medium text-text-primary mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Signature filter tabs ─────────────────────────────────────

function SignatureTabs({
  presets,
  active,
}: {
  presets: Preset[];
  active: string | null;
}) {
  const signatures = [...new Set(presets.map((p) => p.signature))];
  if (signatures.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href="?"
        className={cn(
          "text-[12px] font-mono px-3 py-1.5 rounded-full border transition-all",
          !active
            ? "bg-brand/15 text-brand border-brand/30"
            : "bg-transparent text-text-muted border-bg-border hover:text-text-primary hover:border-text-muted"
        )}
      >
        All ({presets.length})
      </Link>
      {signatures.map((sig) => {
        const st = SIGNATURE_STYLES[sig];
        const count = presets.filter((p) => p.signature === sig).length;
        return (
          <Link
            key={sig}
            href={`?sig=${sig}`}
            className={cn(
              "text-[12px] font-mono px-3 py-1.5 rounded-full border transition-all capitalize",
              active === sig
                ? cn(st?.pill, "border-opacity-50")
                : "bg-transparent text-text-muted border-bg-border hover:text-text-primary hover:border-text-muted"
            )}
          >
            {st?.label ?? sig} ({count})
          </Link>
        );
      })}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────

function EmptyState({ deviceName }: { deviceName: string }) {
  return (
    <div className="text-center py-20 border border-dashed border-bg-border rounded-card">
      <Headphones size={32} className="text-text-muted mx-auto mb-3 opacity-40" />
      <p className="text-[14px] font-medium text-text-secondary">No presets yet for {deviceName}</p>
      <p className="text-[12px] font-mono text-text-muted mt-1">Be the first to submit one</p>
      <button className="mt-4 text-[12px] font-bold bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg transition-colors">
        Submit a preset
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────

export default async function DeviceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sig?: string }>;
}) {
  const { id } = await params;
  const { sig } = await searchParams;

  const [device, allPresets] = await Promise.all([
    getDeviceById(id),
    getPresetsByDeviceId(id),
  ]);

  if (!device) notFound();

  const presets = sig
    ? allPresets.filter((p) => p.signature === sig)
    : allPresets;

  const sortedPresets = [...presets].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <DeviceHero device={device} presets={allPresets} />

        {allPresets.length === 0 ? (
          <EmptyState deviceName={device.name} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold tracking-tight">
                {sig ? `${SIGNATURE_STYLES[sig]?.label ?? sig} presets` : "All presets"}
                <span className="text-text-muted font-mono text-[13px] ml-2">
                  ({sortedPresets.length})
                </span>
              </h2>
            </div>

            <SignatureTabs presets={allPresets} active={sig ?? null} />

            {sortedPresets.length === 0 ? (
              <p className="text-[13px] font-mono text-text-muted text-center py-12">
                No presets match this signature filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedPresets.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const device = await getDeviceById(id);

  if (!device) return { title: "Device not found — EQVault" };

  return {
    title: `${device.brand} ${device.name} EQ Presets — EQVault`,
    description: `Browse ${device.presetCount} community EQ presets for the ${device.brand} ${device.name}. Find the perfect sound signature — neutral, bass-heavy, vocal clarity and more.`,
  };
}
