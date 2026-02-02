// lib/dateKey.ts
export function jstDateKey(now = new Date()) {
  const jst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const y = jst.getFullYear();
  const m = String(jst.getMonth() + 1).padStart(2, "0");
  const d = String(jst.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const WEEKDAY_KEYS = [
  "onSun",
  "onMon",
  "onTue",
  "onWed",
  "onThu",
  "onFri",
  "onSat"
] as const;

export function jstWeekdayKey(now = new Date()) {
  const jst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const d = jst.getDay();
  return WEEKDAY_KEYS[d];
}