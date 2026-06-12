import Navbar from "@/components/layout/Navbar";
import DeviceCard from "@/components/eq/DeviceCard";
import { getAllDevices } from "@/lib/db";

export default async function DevicesPage() {
  const devices = await getAllDevices();
  const brands = Array.from(new Set(devices.map((d) => d.brand)));

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Devices</h1>
          <p className="text-text-secondary text-[14px]">
            {devices.length} earphones with EQ presets
          </p>
        </div>

        {brands.map((brand) => {
          const brandDevices = devices.filter((d) => d.brand === brand);
          return (
            <div key={brand} className="mb-10">
              <h2 className="text-[13px] font-mono text-text-muted tracking-[1px] uppercase mb-3">
                {brand}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {brandDevices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
