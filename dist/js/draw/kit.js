// Shared canvas drawing kit. Every view draws in a W × H logical space as a blueprint
// cutaway: white linework, section hatching for cut metal and one accent colour.
export const W = 1000, H = 760;

// Blueprint drawing: white linework and section hatching on blueprint blue, with a
// yellow accent. Figures stay blueprint in both page themes; only the depth changes.
// Each stroke of the cycle keeps one colour everywhere it appears: intake cyan,
// compression lilac, burning orange, exhaust grey (style.css repeats them as --tone-*).
const TONES = { intake: '#7fdcff', squeeze: '#c9a8ff', burn: '#ff9f2e', exhaust: '#c4bcb2' };
const PALETTES = {
  light: { paper: '#1f4f8c', paper2: '#2a5c9c', ink: '#f4f8ff', ink2: '#b3cbec', faint: '#4673ad', accent: '#ffd23f', grid: '#ffffff12', hatch: '#c9dbf5', ...TONES },
  dark: { paper: '#10294b', paper2: '#16325a', ink: '#eaf2ff', ink2: '#93b3de', faint: '#2d5487', accent: '#ffd23f', grid: '#ffffff0d', hatch: '#9fbde6', ...TONES }
};
export const STROKE_TONES = ['intake', 'squeeze', 'burn', 'exhaust'];
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
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = alpha(C.paper, 0.45); c.fillRect(0, 0, c.canvas.width, c.canvas.height); c.restore();
  pass = 'focus';
  try { return draw(); } finally { pass = 'all'; }
}

// Hit areas registered while drawing, so a tap on the canvas can select a part.
export const hits = [];
export const hit = (id, x, y, rad = 46) => hits.push({ id, x, y, rad });
export const clearHits = () => { hits.length = 0; };

// ── Page ────────────────────────────────────────────────────────────
export function stage(c, w, h) {
  placed.length = 0; readouts.length = 0;
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
// legible: text grows with the boost up to a floor of 13 × boost, so on a phone every
// label lands near the same readable size. Text already above the floor is left alone.
let boost = 1;
export const TEXT_BOOST_MAX = 2.3;
export const setTextBoost = k => { boost = clamp(k || 1, 1, TEXT_BOOST_MAX); };
const boosted = size => (boost > 1 ? Math.max(size, Math.min(size * boost, 13 * boost)) : size);

// Compact figures are for phones: readout boxes are not drawn into the figure, where
// their text would be tiny, but collected in `readouts` for the page to show as text.
let compact = false;
export const setCompact = v => { compact = !!v; };
export const isCompact = () => compact;
export const readouts = [];

// Match a canvas's backing store to its displayed size and pixel density, keeping the
// W × H proportions. Cheap to call every frame: it only resizes when something changed.
export function fitCanvas(canvas, maxRatio = 2) {
  const w = Math.round(canvas.clientWidth * Math.min(devicePixelRatio || 1, maxRatio));
  if (w > 0 && canvas.width !== w) { canvas.width = w; canvas.height = Math.round(w * H / W); }
}

// ── Primitives ──────────────────────────────────────────────────────
// Every label gets a thin halo of the background colour, so it stays readable where it
// crosses linework. Pass `halo: false` for text sitting on a filled shape.
// Options for enlarged text: `fit` is the widest it may be, and it shrinks to fit (not
// below its unenlarged size); `keepIn` slides it sideways to stay on the figure;
// `minor` marks a footnote that a compact figure leaves out (the caption covers it).
export const textLog = { on: false, items: [] }; // layout checks collect label boxes here
// Boxes of everything written on the current figure, in logical units, so callouts
// can find a place that does not cover other text. stage() starts a new list.
export const placed = [];
export const measure = (c, str, size, weight = 500, font = SANS) => { c.font = `${weight} ${boosted(size)}px ${font}`; return c.measureText(str).width; };
export const boostedSize = size => boosted(size);
// Baseline-to-baseline distance for a line of `size` text under the one above: the
// spacing a figure was drawn with, or more when its text has been enlarged.
export const below = (size, spacing) => Math.max(spacing, boosted(size) * 1.22);
export function text(c, str, x, y, { size = 16, color = C.ink, align = 'left', weight = 500, font = SANS, spacing = 0, base = 'alphabetic', halo = true, fit = 0, keepIn = false, minor = false } = {}) {
  if (minor && compact) return 0;
  const plain = size;
  size = boosted(size);
  c.font = `${weight} ${size}px ${font}`;
  if (fit || keepIn) {
    const w0 = c.measureText(str).width;
    if (fit && w0 > fit) { size = Math.max(plain, size * fit / w0); c.font = `${weight} ${size}px ${font}`; }
    if (keepIn) {
      const w1 = c.measureText(str).width, left = align === 'center' ? x - w1 / 2 : align === 'right' ? x - w1 : x;
      x += Math.max(0, 6 - left) - Math.max(0, left + w1 - (W - 6));
    }
  }
  c.fillStyle = color; c.textAlign = align; c.textBaseline = base;
  if ('letterSpacing' in c) c.letterSpacing = spacing + 'px';
  if (halo) {
    c.save(); c.strokeStyle = alpha(C.paper, 0.92); c.lineWidth = Math.max(3, size * 0.3); c.lineJoin = 'round';
    c.strokeText(str, x, y); c.restore();
  }
  c.fillText(str, x, y);
  const w = c.measureText(str).width;
  if ('letterSpacing' in c) c.letterSpacing = '0px';
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  const top = base === 'middle' ? y - size / 2 : y - size * 0.82, m = c.getTransform();
  const pts = [[x0, top], [x0 + w, top], [x0, top + size], [x0 + w, top + size]].map(([px, py]) => [m.a * px + m.c * py + m.e, m.b * px + m.d * py + m.f]);
  const k = c.canvas.width / W;
  const box = { str, x0: Math.min(...pts.map(p => p[0])) / k, x1: Math.max(...pts.map(p => p[0])) / k, y0: Math.min(...pts.map(p => p[1])) / k, y1: Math.max(...pts.map(p => p[1])) / k };
  placed.push(box);
  if (textLog.on) textLog.items.push(box);
  return w;
}

// Text wrapped to fit `maxW`: breaks at spaces, or between characters in Chinese.
// `y` is the first line's baseline, or with `anchor` the middle or the last line's.
// Returns the height used, so the next line can follow it.
export function para(c, str, x, y, maxW, opts = {}) {
  if (opts.minor && compact) return 0;
  const size = boosted(opts.size ?? 16), lh = size * (opts.leading ?? 1.35);
  c.font = `${opts.weight ?? 500} ${size}px ${opts.font ?? SANS}`;
  const lines = [];
  let cur = '';
  for (const w of str.match(/[\u2e80-\u9fff\uff00-\uffef]|[^\s\u2e80-\u9fff\uff00-\uffef]+\s*|\s+/g) ?? []) {
    if (cur.trim() && c.measureText((cur + w).trimEnd()).width > maxW) { lines.push(cur.trimEnd()); cur = w.trimStart(); } else cur += w;
  }
  if (cur.trim()) lines.push(cur.trimEnd());
  const shift = opts.anchor === 'bottom' ? (lines.length - 1) * lh : opts.anchor === 'middle' ? (lines.length - 1) * lh / 2 : 0;
  lines.forEach((l, i) => text(c, l, x, y - shift + i * lh, { ...opts, fit: maxW }));
  return lines.length * lh;
}

// Nudge stacked labels (objects with a `y`) apart until they are at least `gap` apart.
export function spread(labels, gap) {
  const sorted = [...labels].sort((p, q) => p.y - q.y);
  for (let i = 1; i < sorted.length; i++) sorted[i].y = Math.max(sorted[i].y, sorted[i - 1].y + gap);
  return labels;
}

// A dashed blueprint annotation block with key / value rows; a row's third item marks
// its value as the one to watch. A value too long to share its row drops below it.
export function note(c, x, y, w, title, rows) {
  if (compact) {
    const i = readouts.findIndex(r => r.title === title), entry = { title, rows: rows.map(([k, v, hot]) => ({ label: k, value: v, hot: !!hot })) };
    if (i < 0) readouts.push(entry); else readouts[i] = entry;
    return [x + w / 2, y + 40 + rows.length * 15];
  }
  const fits = rows.map(r => measure(c, r[0], 14) + measure(c, r[1], 17, 500, MONO) + 20 <= w - 32);
  const h = 40 + fits.reduce((s, f) => s + (f ? 30 : 54), 0);
  c.save(); c.setLineDash([5, 5]); rect(c, x, y, w, h, 6, alpha(C.paper, 0.85), C.ink2, 1); c.restore();
  text(c, title, x + 16, y + 26, { size: 12, color: C.ink2, font: MONO, spacing: 1.2 });
  let yy = y + 56;
  rows.forEach((r, i) => {
    text(c, r[0], x + 16, yy, { size: 14, color: C.ink2 });
    if (!fits[i]) yy += 24;
    text(c, r[1], x + w - 16, yy, { size: 17, color: r[2] ? C.accent : C.ink, font: MONO, weight: 500, align: 'right' });
    yy += 30;
  });
  return [x + w / 2, y + h / 2];
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

// Gas is drawn as dots in its stroke's colour, and told apart by shape as well:
// fresh and squeezed air are rings, burning charge and exhaust are solid dots.
export const GAS = {
  air: { fill: null, line: () => C.intake },
  squeezed: { fill: null, line: () => C.squeeze },
  burning: { fill: () => C.burn, line: null },
  exhaust: { fill: () => C.exhaust, line: null }
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
export const markerR = () => Math.max(11, boosted(12.5) * 0.72);
export function marker(c, n, x, y, on) {
  circle(c, x, y, markerR(), on ? C.accent : C.paper, on ? C.accent : C.ink, 1.4);
  text(c, String(n), x, y + 0.5, { size: 12.5, weight: 700, color: on ? C.paper : C.ink, align: 'center', base: 'middle', font: MONO, halo: false });
}

// The figure number in the bottom-left corner, as in a printed plate. Thumbnails omit it.
export function figLabel(c, n) {
  if (n) text(c, 'FIG. ' + n, 28, 748, { size: 12, color: C.ink2, font: MONO, spacing: 1, minor: true });
}

// The EngineLens: a thin accent ring that frames whatever is being explained.
export function lens(c, x, y, r) {
  c.save();
  c.setLineDash([2, 5]); circle(c, x, y, r + 8, null, alpha(C.accent, 0.6), 1.2); c.setLineDash([]);
  circle(c, x, y, r, null, C.accent, 2);
  c.restore();
}
