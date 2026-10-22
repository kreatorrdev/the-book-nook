export function validateProgress(mode: string, value: number, pages: number | null | undefined) {
  if (!Number.isInteger(value) || value < 0) throw new Error("Progress must be a whole number of zero or more.");
  if (mode === "pages") {
    if (!pages) throw new Error("This edition has no verified page count. Use percentage progress.");
    if (value > pages) throw new Error(`This edition has ${pages} pages. Enter a value between 0 and ${pages}.`);
  } else if (mode !== "percentage" || value > 100) throw new Error("Percentage progress must be between 0 and 100.");
  return value;
}
export function percentage(entry: { progress: number; progressMode: string }, pages?: number | null) {
  return entry.progressMode === "pages" ? (pages ? Math.min(100, Math.round(entry.progress / pages * 100)) : 0) : entry.progress;
}
export function safeReturn(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : "/my-shelves";
}
