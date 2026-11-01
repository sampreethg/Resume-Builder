"use client";

import React from "react";
import { Check } from "lucide-react";

export interface ThemeOption {
  id: string;
  label: string;
  hex: string;
  description: string;
}

export const PRESET_THEMES: ThemeOption[] = [
  { id: "black", label: "Classic Black", hex: "#000000", description: "Institutional & ATS Standard" },
  { id: "navy", label: "Executive Navy", hex: "#0f2b5c", description: "Professional Academic Blue" },
  { id: "steel", label: "Slate Steel", hex: "#334155", description: "Modern Neutral Accent" },
  { id: "spruce", label: "Forest Spruce", hex: "#1b4332", description: "Distinguished Organic Deep Green" }
];

interface Props {
  currentTheme: string;
  onThemeChange: (hex: string) => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange }: Props) {
  const isCustom = !PRESET_THEMES.some((t) => t.hex.toLowerCase() === currentTheme.toLowerCase());

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Theme Accent:
      </span>
      <div className="flex items-center gap-2">
        {PRESET_THEMES.map((theme) => {
          const isSelected = currentTheme.toLowerCase() === theme.hex.toLowerCase();
          return (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.hex)}
              title={`${theme.label} (${theme.description})`}
              className={`group relative flex items-center justify-center w-6 h-6 rounded-full border border-neutral-300 transition-all ${
                isSelected
                  ? "ring-2 ring-offset-2 ring-neutral-900 scale-105"
                  : "hover:scale-105 opacity-85 hover:opacity-100"
              }`}
              style={{ backgroundColor: theme.hex }}
              aria-label={theme.label}
            >
              {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </button>
          );
        })}

        {/* Custom Color Input */}
        <label
          className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium cursor-pointer transition ${
            isCustom
              ? "border-neutral-900 bg-neutral-100 text-neutral-900 ring-1 ring-neutral-900"
              : "border-neutral-200 text-neutral-600 hover:border-neutral-400 bg-white"
          }`}
          title="Pick a custom institutional accent color"
        >
          <span
            className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0"
            style={{ backgroundColor: currentTheme }}
          />
          <span className="text-[11px] font-mono">{currentTheme.toUpperCase()}</span>
          <input
            type="color"
            value={currentTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
