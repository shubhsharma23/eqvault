import Navbar from "@/components/layout/Navbar";
import PresetCard from "@/components/eq/PresetCard";
import DeviceCard from "@/components/eq/DeviceCard";
import { getAllPresets, getAllDevices } from "@/lib/db";
import { APP_LABELS, BUTTON_LABELS, SECTION_LABELS } from "@/data/labels";

export default async function HomePage() {
  const presets = await getAllPresets();
  const devices = await getAllDevices();
  
  const featured = presets.slice(0, 3);
  const topDevices = devices.slice(0, 4);

  // Calculate stats from actual data
  const totalPresets = presets.length;
  const totalDevices = devices.length;
  const totalVotes = presets.reduce((sum, preset) => sum + preset.upvotes, 0);

  // Format numbers for display
  const formatStat = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return `${num}+`;
  };

  const stats = [
    { value: formatStat(totalPresets), label: APP_LABELS.stats.presets.label },
    { value: formatStat(totalDevices), label: APP_LABELS.stats.devices.label },
    { value: formatStat(totalVotes), label: APP_LABELS.stats.communityVotes.label },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <p className="font-mono text-[11px] text-brand tracking-[2px] uppercase mb-4">
          {APP_LABELS.tagline}
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-2px] leading-[1.05] text-text-primary mb-5 max-w-2xl">
          {APP_LABELS.hero.title.split(APP_LABELS.hero.titleHighlight)[0]}<br />
          sound like{" "}
          <span className="text-brand">{APP_LABELS.hero.titleHighlight}</span>
        </h1>
        <p className="text-text-secondary text-[15px] leading-relaxed max-w-md mb-8">
          {APP_LABELS.hero.description}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/browse"
            className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold text-[13px] rounded-lg transition-colors"
          >
            {BUTTON_LABELS.browsePresets}
          </a>
          <a
            href="/devices"
            className="px-5 py-2.5 bg-bg-card border border-bg-border hover:border-brand/40 text-text-secondary hover:text-text-primary font-medium text-[13px] rounded-lg transition-all"
          >
            {BUTTON_LABELS.viewDevices}
          </a>
        </div>

        {/* Stats row */}
        <div className="flex gap-8 mt-12 pt-8 border-t border-bg-border">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-extrabold tracking-tight text-text-primary">{stat.value}</p>
              <p className="text-[11px] font-mono text-text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Presets */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold tracking-tight">{SECTION_LABELS.topPresets}</h2>
          <a href="/browse" className="text-[12px] font-mono text-brand hover:underline">{BUTTON_LABELS.viewAll} →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((preset) => {
            const device = devices.find((d) => d.id === preset.deviceId);
            return (
              <PresetCard
                key={preset.id}
                preset={preset}
                deviceName={device ? `${device.brand} ${device.name}` : undefined}
              />
            );
          })}
        </div>
      </section>

      {/* Devices */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold tracking-tight">{SECTION_LABELS.popularDevices}</h2>
          <a href="/devices" className="text-[12px] font-mono text-brand hover:underline">{BUTTON_LABELS.allDevices} →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-border px-6 py-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span className="font-bold text-[14px] tracking-tight">{APP_LABELS.name}</span>
        </div>
        <p className="text-[11px] font-mono text-text-muted text-center md:text-left">
          {APP_LABELS.footer.description}
        </p>
      </footer>
    </div>
  );
}
