"use client";

import PinLock from "@/components/experience/pin-lock";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";

export default function Home() {
  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <div className="page-content flex flex-col items-center justify-center">
          <PinLock />
        </div>
      </NavShell>
    </div>
  );
}
