"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/pin/");
  }, []);

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(150deg, #1a0b1e 0%, #000 55%, #1a0b1e 100%)",
        color: "rgba(255,255,255,0.65)",
        fontFamily: "monospace",
        fontSize: 10,
        letterSpacing: "0.3em",
      }}
    >
      OPENING THE CHAPTER…
    </main>
  );
}
