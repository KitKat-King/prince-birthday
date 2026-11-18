"use client";

import { useCallback, useRef, useState } from "react";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { triggerConfetti } from "@/components/shell/ConfettiCanvas";
import { setProgress } from "@/lib/progress";

const CORRECT_PINS = ["123456", "1234567"];
const PIN_LENGTH = 6;

export default function PinPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const busy = useRef(false);

  const unlock = useCallback(() => {
    setUnlocked(true);
    triggerConfetti({ x: window.innerWidth / 2, y: window.innerHeight / 2, count: 300 });
    setProgress(1);
    setTimeout(() => {
      window.location.href = "/loader/";
    }, 900);
  }, []);

  const fail = useCallback(() => {
    setError(true);
    setPin("");
    setTimeout(() => setError(false), 900);
  }, []);

  const addDigit = (digit) => {
    if (busy.current || unlocked) return;
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + digit;
    setPin(next);
    if (CORRECT_PINS.includes(next)) {
      busy.current = true;
      setTimeout(unlock, 250);
    } else if (next.length >= PIN_LENGTH) {
      busy.current = true;
      setTimeout(() => {
        fail();
        busy.current = false;
      }, 250);
    }
  };

  const removeDigit = () => {
    if (busy.current || unlocked) return;
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <div className="page-content">
          <div className="pin-blob pin-blob-1" aria-hidden="true" />
          <div className="pin-blob pin-blob-2" aria-hidden="true" />
          <div className="pin-blob pin-blob-3" aria-hidden="true" />
          <canvas id="pin-confetti" className="pin-confetti" aria-hidden="true" />
          <div className="pin-bunting pin-bunting-top" aria-hidden="true" />
          <div className="pin-bunting pin-bunting-bottom" aria-hidden="true" />

          <div className="glass-card max-w-sm w-full mx-auto flex flex-col items-center">
            <div className="pin-glass" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="pin-bear-wrap relative mb-6">
                <img src="/gifs/gift.gif" alt="Birthday gift" className="pin-bear" />
                <div className="pin-lock-badge">
                  <Lock size={16} strokeWidth={2.2} />
                </div>
              </div>

              <h2 className="pin-title text-[2rem] font-semibold mb-1">Unlock Your Surprise</h2>
              <p className="pin-sub text-sm mb-6">
                {unlocked ? "Welcome in, Prince." : "Enter the secret code to begin"}
              </p>

              <div className="pin-dots" aria-label="PIN entry">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`pin-dot ${i < pin.length ? "filled" : ""} ${error ? "error" : ""}`}
                    aria-label={`Digit ${i + 1}${i < pin.length ? " filled" : " empty"}`}
                  />
                ))}
              </div>

              <div className="pin-keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    className="pin-key"
                    onClick={() => addDigit(String(n))}
                    aria-label={`Digit ${n}`}
                  >
                    {n}
                  </button>
                ))}
                <div className="pin-key pin-key-empty" aria-hidden="true" />
                <button className="pin-key" onClick={() => addDigit("0")} aria-label="Digit 0">
                  0
                </button>
                <button className="pin-key pin-key-delete" onClick={removeDigit} aria-label="Delete last digit">
                  <ArrowRight size={20} strokeWidth={2} rotate={180} />
                </button>
              </div>

              {error && (
                <p className="pin-error mt-3 text-sm flex items-center justify-center gap-2">
                  <Sparkles size={14} strokeWidth={2} /> Wrong code — try again
                </p>
              )}
            </div>
          </div>

        </div>
      </NavShell>
    </div>
  );
}
