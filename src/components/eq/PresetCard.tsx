"use client";
import { useState } from "react";
import { ThumbsUp, Copy, Check, Tag } from "lucide-react";
import type { Preset } from "@/types";
import EQVisualizer from "./EQVisualizer";
import { presetToGeneric, cn } from "@/lib/utils";

type Props = {
  preset: Preset;
  deviceName?: string;
};

const SIGNATURE_COLORS: Record<string, string> = {
  "neutral":     "text-emerald-400 bg-emerald-400/10",
  "v-shaped":    "text-purple-400 bg-purple-400/10",
  "bass-heavy":  "text-orange-400 bg-orange-400/10",
  "warm":        "text-amber-400 bg-amber-400/10",
  "bright":      "text-sky-400 bg-sky-400/10",
  "mid-forward": "text-rose-400 bg-rose-400/10",
  "u-shaped":    "text-indigo-400 bg-indigo-400/10",
};

export default function PresetCard({ preset, deviceName }: Props) {
  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [votes, setVotes] = useState(preset.upvotes);

  function handleCopy() {
    navigator.clipboard.writeText(presetToGeneric(preset));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleUpvote() {
    if (!upvoted) {
      setUpvoted(true);
      setVotes((v) => v + 1);
    }
  }

  const sigColor = SIGNATURE_COLORS[preset.signature] ?? "text-text-muted bg-bg-border";

  return (
    <div className="group bg-bg-card border border-bg-border rounded-card p-4 flex flex-col gap-3 hover:border-brand/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-[15px] text-text-primary leading-tight">{preset.name}</h3>
          {deviceName && (
            <p className="text-[11px] font-mono text-text-muted mt-0.5">{deviceName}</p>
          )}
        </div>
        <span className={cn("text-[10px] font-mono font-medium px-2 py-0.5 rounded-full shrink-0 capitalize", sigColor)}>
          {preset.signature.replace("-", " ")}
        </span>
      </div>

      {/* EQ Viz */}
      <EQVisualizer bands={preset.bands} height={60} className="opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Description */}
      <p className="text-[12px] text-text-secondary leading-relaxed">{preset.description}</p>

      {/* Target */}
      <div className="flex items-center gap-1.5 text-[11px] text-brand font-mono">
        <Tag size={10} />
        <span>Targets: {preset.targetSound}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {preset.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bg-border text-text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-bg-border mt-auto">
        <span className="text-[11px] text-text-muted font-mono">by {preset.author}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpvote}
            className={cn(
              "flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full transition-all",
              upvoted
                ? "bg-brand/20 text-brand"
                : "bg-bg-border text-text-muted hover:text-brand hover:bg-brand/10"
            )}
          >
            <ThumbsUp size={10} />
            {votes}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-bg-border text-text-muted hover:bg-brand/10 hover:text-brand transition-all"
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
