"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Palette, Volume2, VolumeX } from "lucide-react";

const THEMES = [
  { id: "a", label: "Midnight Rose", color: "bg-pink-400" },
  { id: "b", label: "Cream Blush", color: "bg-[#f7e9d7]" },
  { id: "c", label: "Gold Navy", color: "bg-amber-400" },
  { id: "d", label: "Pink Lock", color: "bg-rose-500" },
  { id: "e", label: "Electric Neon", color: "bg-cyan-400" },
  { id: "f", label: "Sunset Dream", color: "bg-[#ff9a9e]" },
];

const PAGES = [
  { path: "/pin", label: "PIN · Unlock" },
  { path: "/loader", label: "Boot · Countdown" },
  { path: "/seal", label: "Wax · Seal" },
  { path: "/hero", label: "Era · Title" },
  { path: "/dossier", label: "ID · Card" },
  { path: "/anthems", label: "Mixtape · Music" },
  { path: "/memories", label: "Reel · Photos" },
  { path: "/wish", label: "Candle · Wish" },
  { path: "/legend", label: "Credits · Pass" },
  { path: "/surprise", label: "Gift · Finale" },
];

function normalizePath(pathname) {
  if (!pathname) return "/pin";
  const clean = pathname.replace(/\/+$/, "");
  return clean === "" ? "/pin" : clean;
}

export default function NavShell({ children }) {
  const pathname = normalizePath(usePathname());
  const [theme, setTheme] = useState("a");
  const [themeReady, setThemeReady] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("prince-theme");
    if (stored && THEMES.some((t) => t.id === stored)) setTheme(stored);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("prince-theme", theme);
  }, [theme, themeReady]);

  useEffect(() => {
    const audio = document.getElementById("site-audio");
    if (audio) audio.volume = 0.35;
  }, []);

  useEffect(() => {
    const audio = document.getElementById("site-audio");
    if (!audio) return;
    if (audioOn) {
      audio.play().catch(() => setAudioOn(false));
    } else {
      audio.pause();
    }
  }, [audioOn]);

  const pageIndex = PAGES.findIndex((p) => p.path === pathname);
  const current = PAGES[pageIndex] || { label: pathname };
  const activeTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <>
      <nav className="nav-top">
        <div className="theme-label">PRINCE · CHAPTER 16</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTheme((s) => !s)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition"
            title="Pick a theme"
            aria-label="Pick a theme"
          >
            <Palette size={16} strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-widest opacity-70 hidden sm:inline">
              {activeTheme.label.toUpperCase()}
            </span>
          </button>
          <button
            onClick={() => setAudioOn((a) => !a)}
            className="flex items-center p-2 rounded-full hover:bg-white/10 transition"
            title={audioOn ? "Mute" : "Unmute"}
            aria-label={audioOn ? "Mute" : "Unmute"}
          >
            {audioOn ? <Volume2 size={16} strokeWidth={2} /> : <VolumeX size={16} strokeWidth={2} />}
          </button>
        </div>
      </nav>

      {showTheme && (
        <div className="theme-panel">
          <p className="text-[10px] text-white/60 font-semibold tracking-widest mb-3 uppercase">Choose a palette</p>
          <div className="theme-panel-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setShowTheme(false);
                }}
                className={`theme-swatch ${theme === t.id ? "is-active" : ""}`}
                title={t.label}
              >
                <span className={`w-6 h-6 rounded-full border-2 border-white/40 ${t.color}`} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="nav-bottom">
        <div className="page-indicator">{current.label}</div>
      </nav>

      {children}
    </>
  );
}
