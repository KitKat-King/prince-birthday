export const CHAPTERS = ["/pin", "/loader", "/seal", "/hero", "/dossier", "/anthems", "/memories", "/wish", "/legend", "/surprise"];

export function indexFor(path) {
  if (!path) return -1;
  const clean = String(path).replace(/\/+$/, "");
  return CHAPTERS.indexOf(clean === "" ? "/pin" : clean);
}

export function getProgress() {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem("prince-progress") || "0", 10) || 0;
  } catch {
    return 0;
  }
}

export function setProgress(n) {
  if (typeof window === "undefined") return;
  try {
    const cur = getProgress();
    if (n > cur) {
      localStorage.setItem("prince-progress", String(n));
      window.dispatchEvent(new Event("prince-progress"));
    }
  } catch {}
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("prince-progress", "0");
    window.dispatchEvent(new Event("prince-progress"));
  } catch {}
}
