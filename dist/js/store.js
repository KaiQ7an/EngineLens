// localStorage can be missing or blocked (private windows, previews); the site
// must keep working without it, so every access is guarded.
export function load(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch { return fallback; }
}
export function save(key, value) {
  try { localStorage.setItem(key, value); } catch { /* not persisted */ }
}
export function loadJSON(key, fallback) {
  try { return JSON.parse(load(key)) ?? fallback; } catch { return fallback; }
}
export const saveJSON = (key, value) => save(key, JSON.stringify(value));
