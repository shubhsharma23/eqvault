import Link from "next/link";
import { Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import DeviceCard from "@/components/eq/DeviceCard";
import { getAllDevices } from "@/lib/db";
import { cn } from "@/lib/utils";

const SIGNATURE_STYLES: Record<string, { pill: string; label: string }> = {
  "neutral":     { pill: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", label: "Neutral" },
  "v-shaped":    { pill: "text-purple-400 bg-purple-400/10 border-purple-400/20",   label: "V-Shaped" },
  "bass-heavy":  { pill: "text-orange-400 bg-orange-400/10 border-orange-400/20",   label: "Bass Heavy" },
  "warm":        { pill: "text-amber-400 bg-amber-400/10 border-amber-400/20",       label: "Warm" },
  "bright":      { pill: "text-sky-400 bg-sky-400/10 border-sky-400/20",             label: "Bright" },
  "mid-forward": { pill: "text-rose-400 bg-rose-400/10 border-rose-400/20",          label: "Mid Forward" },
  "u-shaped":    { pill: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",    label: "U-Shaped" },
};

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; sig?: string }>;
}) {
  const { brand: activeBrand, sig: activeSignature } = await searchParams;
  const allDevices = await getAllDevices();
  
  // Extract unique brands and signatures
  const brands = Array.from(new Set(allDevices.map((d) => d.brand))).sort();
  const signatures = Array.from(new Set(allDevices.map((d) => d.defaultSignature)));

  // Filter devices based on query params
  let devices = allDevices;
  if (activeBrand) {
    devices = devices.filter((d) => d.brand === activeBrand);
  }
  if (activeSignature) {
    devices = devices.filter((d) => d.defaultSignature === activeSignature);
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Devices</h1>
          <p className="text-text-secondary text-[14px]">
            {devices.length} of {allDevices.length} earphones with EQ presets
          </p>
        </div>

        {/* Fast Search Links - Brand Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-text-muted" />
            <h2 className="text-[12px] font-mono text-text-muted tracking-[1px] uppercase">
              Filter by Brand
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/devices"
              className={cn(
                "text-[12px] font-mono px-3 py-1.5 rounded-full border transition-all",
                !activeBrand && !activeSignature
                  ? "bg-brand/15 text-brand border-brand/30"
                  : "bg-transparent text-text-muted border-bg-border hover:text-text-primary hover:border-text-muted"
              )}
            >
              All Brands ({allDevices.length})
            </Link>
            {brands.map((brand) => {
              const count = allDevices.filter((d) => d.brand === brand).length;
              const href = activeSignature 
                ? `/devices?brand=${brand}&sig=${activeSignature}`
                : `/devices?brand=${brand}`;
              return (
                <Link
                  key={brand}
                  href={href}
                  className={cn(
                    "text-[12px] font-mono px-3 py-1.5 rounded-full border transition-all",
                    activeBrand === brand
                      ? "bg-brand/15 text-brand border-brand/30"
                      : "bg-transparent text-text-muted border-bg-border hover:text-text-primary hover:border-text-muted"
                  )}
                >
                  {brand} ({count})
                </Link>
              );
            })}
          </div>
        </div>

        {/* Fast Search Links - Signature Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-text-muted" />
            <h2 className="text-[12px] font-mono text-text-muted tracking-[1px] uppercase">
              Filter by Sound Signature
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={activeBrand ? `/devices?brand=${activeBrand}` : "/devices"}
              className={cn(
                "text-[12px] font-mono px-3 py-1.5 rounded-full border transition-all",
                !activeSignature
                  ? "bg-brand/15 text-brand border-brand/30"
                  : "bg-transparent text-text-muted border-bg-border hover:text-text-primary hover:border-text-muted"
              )}
            >
              All Signatures
            </Link>
            {signatures.map((sig) => {
              const st = SIGNATURE_STYLES[sig];
              const count = allDevices.filter((d) => d.defaultSignature === sig).length;
              const href = activeBrand
                ? `/devices?brand=${activeBrand}&sig=${sig}`
                : `/devices?sig=${sig}`;
              return (
                <Link
                  key={sig}
                  href={href}
                  className={cn(
                    "text-[12px] font-mono px-3 py-1.5 rounded-full border transition-all capitalize",
                    activeSignature === sig
                      ? cn(st?.pill, "border-opacity-50")
                      : "bg-transparent text-text-muted border-bg-border hover:text-text-primary hover:border-text-muted"
                  )}
                >
                  {st?.label ?? sig} ({count})
                </Link>
              );
            })}
          </div>
        </div>

        {/* Active Filters Display */}
        {(activeBrand || activeSignature) && (
          <div className="mb-6 p-4 bg-bg-card border border-bg-border rounded-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-mono text-text-muted">Active filters:</span>
                {activeBrand && (
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-brand/15 text-brand border border-brand/30">
                    Brand: {activeBrand}
                  </span>
                )}
                {activeSignature && (
                  <span className={cn(
                    "text-[11px] font-mono px-2.5 py-1 rounded-full border capitalize",
                    SIGNATURE_STYLES[activeSignature]?.pill
                  )}>
                    Signature: {SIGNATURE_STYLES[activeSignature]?.label ?? activeSignature}
                  </span>
                )}
              </div>
              <Link
                href="/devices"
                className="text-[11px] font-mono text-text-muted hover:text-text-primary transition-colors"
              >
                Clear all
              </Link>
            </div>
          </div>
        )}

        {/* Devices Grid */}
        {devices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-bg-border rounded-card">
            <p className="text-[14px] font-medium text-text-secondary">No devices found</p>
            <p className="text-[12px] font-mono text-text-muted mt-1">Try adjusting your filters</p>
            <Link
              href="/devices"
              className="mt-4 inline-block text-[12px] font-bold bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
