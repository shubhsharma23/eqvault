"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import { APP_LABELS, NAV_LABELS, BUTTON_LABELS, ARIA_LABELS } from "@/data/labels";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-bg-border bg-bg-primary/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span className="font-bold text-[17px] tracking-tight text-text-primary">
            {APP_LABELS.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px] text-text-secondary font-medium">
          <Link href="/browse" className="hover:text-text-primary transition-colors">{NAV_LABELS.browse}</Link>
          <Link href="/devices" className="hover:text-text-primary transition-colors">{NAV_LABELS.devices}</Link>
          <button disabled className="text-text-muted/50 cursor-not-allowed">{NAV_LABELS.compare}</button>
          <button disabled className="text-text-muted/50 cursor-not-allowed">{NAV_LABELS.community}</button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label={ARIA_LABELS.search}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-all"
          >
            <Search size={16} />
          </button>
          <button className="text-[12px] font-bold bg-brand hover:bg-brand-dark text-white px-4 py-1.5 rounded-full transition-colors">
            {BUTTON_LABELS.submitPreset}
          </button>
        </div>
      </div>
    </header>
  );
}
