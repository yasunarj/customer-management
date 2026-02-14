// lib/dateKey.ts

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function jstDateKey(offsetDay = 0) {
  const ms = Date.now() + JST_OFFSET_MS;
  const d = new Date(ms);

  d.setUTCDate(d.getUTCDate() - offsetDay);

  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
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

export function jstWeekdayKey(offsetDay = 0) {
  const ms = Date.now() + JST_OFFSET_MS;
  const d = new Date(ms);

  d.setUTCDate(d.getUTCDate() - offsetDay);

  return WEEKDAY_KEYS[d.getUTCDay()];
}