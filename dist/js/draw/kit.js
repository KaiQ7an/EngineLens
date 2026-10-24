// Shared canvas drawing kit. Every view draws in a W × H logical space as a blueprint
// cutaway: white linework, section hatching for cut metal and one accent colour.
export const W = 1000, H = 760;

// Blueprint drawing: white linework and section hatching on blueprint blue, with a
// yellow accent. Figures stay blueprint in both page themes; only the depth changes.
const PALETTES = {
  light: { paper: '#1f4f8c', paper2: '#2a5c9c', ink: '#f4f8ff', ink2: '#b3cbec', faint: '#4673ad', accent: '#ffd23f', burn: '#ff9f2e', grid: '#ffffff12', hatch: '#c9dbf5' },
  dark: { paper: '#10294b', paper2: '#16325a', ink: '#eaf2ff', ink2: '#93b3de', faint: '#2d5487', accent: '#ffd23f', burn: '#ff9f2e', grid: '#ffffff0d', hatch: '#9fbde6' }
};
export const C = { ...PALETTES.light };
const LINE = 1.4;
let hatchCache = null;
export function setPalette(theme) { Object.assign(C, PALETTES[theme] ?? PALETTES.light); hatchCache = null; }

// Fill a cut surface (already traced as the current path) with section hatching.
export function fillCut(c) { c.fillStyle = hatch(c); c.fill(); c.strokeStyle = C.ink; c.lineWidth = LINE; c.stroke(); }
// Fill a moving part (piston, rod, crank): a light wash, so it reads apart from castings.
export function fillPart(c) { c.fillStyle = alpha(C.ink, 0.1); c.fill(); c.strokeStyle = C.ink; c.lineWidth = LINE; c.stroke(); }

export const SANS = '"Noto Sans SC", "PingFang SC", sans-serif';
export const MONO = '"IBM Plex Mono", ui-monospace, monospace';

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, f) => a + (b - a) * f;
export const ease = f => (f = clamp(f), f * f * (3 - 2 * f));

// Deterministic pseudo-random numbers, so particles keep their places between frames.
export const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const alpha = (hex, a) => hex + Math.round(clamp(a) * 255).toString(16).padStart(2, '0');

// ── Focus: a step or a tapped part is drawn in full; everything else fades back ──
// Views are drawn twice when something is in focus: once in full, then under a wash
// of the background colour, then again with only the focused parts. Fading with
// globalAlpha instead would let layered strokes (pipe walls, bores) show through.
let focus = null, primary = null, pass = 'all', inside = 0;
export const setFocus = ids => { focus = ids && ids.length ? new Set(ids) : null; primary = focus ? ids[0] : null; };
export const focused = id => !focus || focus.has(id);
export const isFocus = id => !!focus && focus.has(id);
export const isPrimary = id => primary === id;
export const anyFocus = () => !!focus;
export const focusPass = () => pass === 'focus';
// A focused part takes everything drawn inside it along, so a whole cylinder can be
// focused even though it is built from smaller parts.
export function part(c, id, draw) {
  if (!isFocus(id)) { if (pass !== 'focus' || inside) draw(); return; }
  inside++;
  try { draw(); } finally { inside--; }
}
// Like part(), for one drawing that stands for several focusable parts.
export function partAny(c, ids, draw) {
  if (!ids.some(isFocus)) { if (pass !== 'focus' || inside) draw(); return; }
  inside++;
  try { draw(); } finally { inside--; }
}
// Draw a view with focus handling: `draw` is called once, or twice around the wash.
export function withFocus(c, draw) {
  pass = 'all';
  const out = draw();
  if (!focus) return out;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = alpha(C.paper, 0.58); c.fillRect(0, 0, c.canvas.width, c.canvas.height); c.restore();
  pass = 'focus';
  try { return draw(); } finally { pass = 'all'; }
}

// Hit areas registered while drawing, so a tap on the canvas can select a part.
export const hits = [];
export const hit = (id, x, y, rad = 46) => hits.push({ id, x, y, rad });
export const clearHits = () => { hits.length = 0; };

// ── Page ────────────────────────────────────────────────────────────
export function stage(c, w, h) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = C.paper; c.fillRect(0, 0, w, h);
  c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
  const s = w / 40;
  for (let x = s; x < w; x += s) { c.moveTo(x, 0); c.lineTo(x, h); }
  for (let y = s; y < h; y += s) { c.moveTo(0, y); c.lineTo(w, y); }
  c.stroke();
}

// Diagonal section hatching, the drafting convention for a surface that has been cut.
export function hatch(c) {
  if (hatchCache) return hatchCache;
  const t = document.createElement('canvas'); t.width = t.height = 12;
  const g = t.getContext('2d');
  g.fillStyle = C.paper; g.fillRect(0, 0, 12, 12);
  g.strokeStyle = alpha(C.hatch, 0.36); g.lineWidth = 1;
  g.beginPath(); g.moveTo(-3, 15); g.lineTo(15, -3); g.moveTo(-3, 3); g.lineTo(3, -3); g.moveTo(9, 15); g.lineTo(15, 9); g.stroke();
  hatchCache = c.createPattern(t, 'repeat');
  return hatchCache;
}

// On a narrow screen the whole figure shrinks, so small labels are drawn larger to stay
// legible. Text of 12 units or less gets the full boost; text of 20 or more, none.
let boost = 1;
export const setTextBoost = k => { boost = clamp(k || 1, 1, 1.6); };
const boosted = size => (boost > 1 ? size * (1 + (boost - 1) * clamp((20 - size) / 8)) : size);

// Match a canvas's backing store to its displayed size and pixel density, keeping the
// W × H proportions. Cheap to call every frame: it only resizes when something changed.
export function fitCanvas(canvas, maxRatio = 2) {
  const w = Math.round(canvas.clientWidth * Math.min(devicePixelRatio || 1, maxRatio));
  if (w > 0 && canvas.width !== w) { canvas.width = w; canvas.height = Math.round(w * H / W); }
}

// ── Primitives ──────────────────────────────────────────────────────
export function text(c, str, x, y, { size = 16, color = C.ink, align = 'left', weight = 500, font = SANS, spacing = 0, base = 'alphabetic' } = {}) {
  size = boosted(size);
  c.font = `${weight} ${size}px ${font}`; c.fillStyle = color; c.textAlign = align; c.textBaseline = base;
  if ('letterSpacing' in c) c.letterSpacing = spacing + 'px';
  c.fillText(str, x, y);
  const w = c.measureText(str).width;
  if ('letterSpacing' in c) c.letterSpacing = '0px';
  return w;
}

export function path(c, pts) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); }
export function stroke(c, pts, color = C.ink, width = 1.5, dash) {
  path(c, pts); c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round';
  if (dash) c.setLineDash(dash); c.stroke(); if (dash) c.setLineDash([]);
}
export function rect(c, x, y, w, h, r, fill, line, lw = 1.6) {
  c.beginPath(); c.roundRect(x, y, w, h, r);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (line) { c.strokeStyle = line; c.lineWidth = lw; c.stroke(); }
}
export function circle(c, x, y, r, fill, line, lw = 1.6) {
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (line) { c.strokeStyle = line; c.lineWidth = lw; c.stroke(); }
}
export function poly(c, pts, fill, line, lw = 1.6) {
  path(c, pts); c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (line) { c.strokeStyle = line; c.lineWidth = lw; c.stroke(); }
}

function lengths(pts) {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  return { seg, total: seg.reduce((a, b) => a + b, 0) };
}
export const pathLength = pts => lengths(pts).total;
export function pointAt(pts, d) {
  const { seg } = lengths(pts);
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const f = seg[i] ? clamp(d / seg[i]) : 0;
      return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f), Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])];
    }
    d -= seg[i];
  }
  return [...pts[pts.length - 1], 0];
}

// Gas is drawn as dots, told apart by shape and tone rather than many colours:
// fresh air is a hollow ring, burning charge a solid orange dot, exhaust a pale dot.
export const GAS = {
  air: { fill: null, line: () => C.ink2 },
  squeezed: { fill: null, line: () => C.ink },
  burning: { fill: () => C.burn, line: null },
  exhaust: { fill: () => C.ink2, line: null }
};
export function dot(c, x, y, r, kind) {
  const g = GAS[kind];
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  if (g.fill) { c.fillStyle = g.fill(); c.fill(); }
  if (g.line) { c.strokeStyle = g.line(); c.lineWidth = 1.5; c.stroke(); }
}

// A pipe in section: two walls with the cut between them and the bore left clear.
export function pipe(c, pts, width = 30) {
  c.save(); c.lineCap = 'butt'; c.lineJoin = 'round';
  stroke(c, pts, C.ink, width + 8);
  path(c, pts); c.lineCap = 'butt';
  c.strokeStyle = hatch(c); c.lineWidth = width + 8 - LINE * 2; c.stroke();
  stroke(c, pts, C.ink, width + LINE);
  stroke(c, pts, C.paper, width - LINE);
  c.restore();
}

// Gas moving along a pipe: dots whose spacing shows how much air there is.
export function flow(c, pts, kind, time, { rate = 1, density = 1, r = 3.6, lanes = 2, spread = 9, strength = 1 } = {}) {
  if (rate <= 0 || strength <= 0) return;
  const { total } = lengths(pts);
  const gap = 34 / Math.max(0.35, density);
  c.save(); c.globalAlpha *= clamp(strength);
  for (let lane = 0; lane < lanes; lane++) {
    const off = (lane - (lanes - 1) / 2) * spread, shift = hash(lane + 3) * gap;
    for (let d = (time * 90 * rate + shift) % gap; d < total; d += gap) {
      const [x, y, a] = pointAt(pts, d);
      const wob = Math.sin(d * 0.08 + lane) * 1.5;
      dot(c, x - Math.sin(a) * (off + wob), y + Math.cos(a) * (off + wob), r, kind);
    }
  }
  c.restore();
}

// An arrowhead at the end of a path, showing which way the gas goes.
export function arrow(c, x, y, ang, color = C.ink, size = 10) {
  poly(c, [[x + Math.cos(ang) * size, y + Math.sin(ang) * size], [x + Math.cos(ang + 2.5) * size, y + Math.sin(ang + 2.5) * size], [x + Math.cos(ang - 2.5) * size, y + Math.sin(ang - 2.5) * size]], color);
}

// Numbered callout marker, as in a technical illustration.
export function marker(c, n, x, y, on) {
  circle(c, x, y, 11, on ? C.accent : C.paper, on ? C.accent : C.ink, 1.4);
  text(c, String(n), x, y + 0.5, { size: 12.5, weight: 700, color: on ? C.paper : C.ink, align: 'center', base: 'middle', font: MONO });
}

// The figure number in the bottom-left corner, as in a printed plate. Thumbnails omit it.
export function figLabel(c, n) {
  if (n) text(c, 'FIG. ' + n, 28, 748, { size: 12, color: C.ink2, font: MONO, spacing: 1 });
}

// The EngineLens: a thin accent ring that frames whatever is being explained.
export function lens(c, x, y, r) {
  c.save();
  c.setLineDash([2, 5]); circle(c, x, y, r + 8, null, alpha(C.accent, 0.6), 1.2); c.setLineDash([]);
  circle(c, x, y, r, null, C.accent, 2);
  c.restore();
}
