"use client";

import React, { useState } from "react";
import { Copy, Check, X, Sparkles, HelpCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRole: string;
  selectedSkills: string[];
}

export default function AISummaryModal({ isOpen, onClose, targetRole, selectedSkills }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const promptText = `I am a student at Sri Shakthi Institute of Engineering and Technology applying for a ${
    targetRole || "Software Engineer"
  } position. My core technical skills are: ${
    selectedSkills.join(", ") || "Full-Stack Development, Problem Solving"
  }.

Before writing my resume summary/objective, please ask me these 3 quick questions:
1. What is the target company name or exact role focus?
2. What are 1-2 flagship projects or achievements I should highlight?
3. What specific soft skills or career ambition should be highlighted?

Once I provide the answers, write a tailored, professional, high-impact 3-4 sentence resume objective in the first-person voice without generic buzzwords.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-md max-w-xl w-full p-6 shadow-2xl border border-neutral-300">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-neutral-100 rounded text-neutral-800">
              <Sparkles className="w-4 h-4 text-neutral-800" />
            </span>
            <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
              Interactive ChatGPT Summary Prompt
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
          Copy this structured prompt into ChatGPT. It instructs the AI to conduct a 3-question diagnostic interview before generating an authentic, non-generic summary for your resume.
        </p>

        <div className="mt-3 p-3.5 bg-neutral-50 rounded border border-neutral-200 text-xs font-mono text-neutral-800 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
          {promptText}
        </div>

        <div className="mt-5 flex justify-between items-center pt-2">
          <span className="text-[11px] text-neutral-500 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Paste generated response into Objective field
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 rounded border border-neutral-300 font-medium transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-1.5 text-xs bg-neutral-900 text-white rounded font-medium hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Prompt for ChatGPT
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
