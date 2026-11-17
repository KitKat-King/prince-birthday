"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Palette, ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";

const THEMES = [
  { id: "a", label: "Midnight Rose" },
  { id: "b", label: "Cream Blush" },
  { id: "c", label: "Gold Navy" },
  { id: "d", label: "Pink Lock" },
  { id: "e", label: "Electric Neon" },
  { id: "f", label: "Sunset Dream" },
];

const PAGE_LABELS = {
  "/": "PIN · Unlock",
  "/loader": "Boot · Countdown",
  "/seal": "Wax · Seal",
  "/hero": "Era · Title",
  "/dossier": "ID · Card",
  "/anthems": "Mixtape · Music",
  "/memories": "Reel · Photos",
  "/wish": "Candle · Wish",
  "/legend": "Credits · Pass",
  "/surprise": "Gift · Finale",
};

export default function NavShell({ children }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("prince-theme") || "a";
    }
    return "a";
  });
  const [audioOn, setAudioOn] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("prince-theme", theme);
  }, [theme]);

  const pageLabel = PAGE_LABELS[pathname] || pathname;

  return (
    <>
      <nav className="nav-top">
        <div className="theme-label">PRINCE · CHAPTER 16</div>
        <div className="flex items-center gap-8">
          <button
            onClick={() => setShowTheme((s) => !s)}
            className="flex items-center gap-4 p-2 rounded-full hover:bg-white/10 transition"
            title="Pick a theme"
          >
            <Palette size={16} strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-widest opacity-70">{theme.toUpperCase()}</span>
          </button>
          <button
            onClick={() => setAudioOn((a) => !a)}
            className="flex items-center gap-4 p-2 rounded-full hover:bg-white/10 transition"
            title={audioOn ? "Mute" : "Unmute"}
          >
            {audioOn ? <Volume2 size={16} strokeWidth={2} /> : <VolumeX size={16} strokeWidth={2} />}
          </button>
        </div>
      </nav>

      {showTheme && (
        <div className="absolute top-20 left-4 z-[70] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-[10px] text-white/60 font-semibold tracking-widest mb-3 uppercase">Choose a palette</p>
          <div className="flex gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${theme === t.id ? "ring-2 ring-white" : "border-transparent"} ${getThemeColor(t.id)}`}
                title={t.label}
              />
            ))}
          </div>
        </div>
      )}

      <nav className="nav-bottom">
        <div className="page-indicator">{pageLabel}</div>
        <div className="flex items-center gap-4">
          {pathname !== "/" && (
            <button className="nav-btn" onClick={() => navigatePrev(pathname)}>
              <ArrowLeft size={14} strokeWidth={2} /> Prev
            </button>
          )}
          {pathname !== "/legend" && (
            <button className="nav-btn" onClick={() => navigateNext(pathname)}>
              Next <ArrowRight size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </nav>

      {children}
    </>
  );
}

function getThemeColor(id) {
  const colors = {
    a: "bg-pink-400",
    b: "bg-purple-600",
    c: "bg-amber-400",
    d: "bg-rose-500",
    e: "bg-cyan-400",
    f: "bg-rose-300",
  };
  return colors[id] || "bg-white";
}

function navigatePrev(path) {
  const order = ["/", "/loader", "/seal", "/hero", "/dossier", "/anthems", "/memories", "/wish", "/legend", "/surprise"];
  const idx = order.indexOf(path);
  if (idx > 0) window.location.href = order[idx - 1];
}

function navigateNext(path) {
  const order = ["/", "/loader", "/seal", "/hero", "/dossier", "/anthems", "/memories", "/wish", "/legend", "/surprise"];
  const idx = order.indexOf(path);
  if (idx < order.length - 1) window.location.href = order[idx + 1];
}
