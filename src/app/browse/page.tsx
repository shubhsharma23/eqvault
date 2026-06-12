import Navbar from "@/components/layout/Navbar";
import PresetCard from "@/components/eq/PresetCard";
import { SIGNATURE_LABELS } from "@/data";
import type { SoundSignature, Device, Preset } from "@/types";
import { cn } from "@/lib/utils";
import { getAllDevices, getAllPresets } from "@/lib/db";
import Link from "next/link";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ sig?: string; device?: string; tag?: string }>;
}) {
  const { sig, device, tag } = await searchParams;
  
  // Fetch data from database
  const [devices, presets] = await Promise.all([
    getAllDevices(),
    getAllPresets(),
  ]);
  
  // Extract all unique tags
  const allTags = Array.from(new Set(presets.flatMap((p) => p.tags)));
  
  // Apply filters
  const filtered = presets.filter((p) => {
    if (sig && p.signature !== sig) return false;
    if (device && p.deviceId !== device) return false;
    if (tag && !p.tags.includes(tag)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Browse Presets</h1>
          <p className="text-text-secondary text-[14px]">{filtered.length} presets found</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="w-52 shrink-0 hidden md:block">
            <div className="sticky top-20 flex flex-col gap-6">
              {/* Sound signature */}
              <div>
                <p className="font-mono text-[10px] text-text-muted tracking-[1.5px] uppercase mb-2">Sound Signature</p>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/browse"
                    className={cn(
                      "text-left text-[13px] px-3 py-1.5 rounded-lg font-medium transition-colors",
                      !sig ? "bg-brand/15 text-brand" : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                    )}
                  >
                    All signatures
                  </Link>
                  {Object.entries(SIGNATURE_LABELS).map(([key, label]) => (
                    <Link
                      key={key}
                      href={`/browse?sig=${key}`}
                      className={cn(
                        "text-left text-[13px] px-3 py-1.5 rounded-lg font-medium transition-colors",
                        sig === key ? "bg-brand/15 text-brand" : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Device filter */}
              <div>
                <p className="font-mono text-[10px] text-text-muted tracking-[1.5px] uppercase mb-2">Device</p>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/browse"
                    className={cn(
                      "text-left text-[13px] px-3 py-1.5 rounded-lg font-medium transition-colors",
                      !device ? "bg-brand/15 text-brand" : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                    )}
                  >
                    All devices
                  </Link>
                  {devices.map((d) => (
                    <Link
                      key={d.id}
                      href={`/browse?device=${d.id}`}
                      className={cn(
                        "text-left text-[12px] px-3 py-1.5 rounded-lg transition-colors",
                        device === d.id ? "bg-brand/15 text-brand" : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                      )}
                    >
                      {d.brand} {d.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="font-mono text-[10px] text-text-muted tracking-[1.5px] uppercase mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((t) => (
                    <Link
                      key={t}
                      href={`/browse?tag=${t}`}
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-full transition-all",
                        tag === t
                          ? "bg-brand text-white"
                          : "bg-bg-border text-text-muted hover:bg-brand/15 hover:text-brand"
                      )}
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Preset grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-text-muted">
                <p className="font-mono text-[13px]">No presets match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((preset) => {
                  const dev = devices.find((d) => d.id === preset.deviceId);
                  return (
                    <PresetCard
                      key={preset.id}
                      preset={preset}
                      deviceName={dev ? `${dev.brand} ${dev.name}` : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
