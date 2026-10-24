import { C, SANS, isFocus, isPrimary, anyFocus, focusPass, hit, marker, lens, stroke, text, placed, measure, boostedSize, markerR, W, H } from './kit.js';
import { lang } from '../i18n.js';

// Numbered callouts in the manner of a technical illustration. Each part gets a
// numbered marker joined to it by a short leader; parts in focus also show their name
// and the lens ring. `spots` gives each marker's preferred offset from its anchor.
//
// If that spot would cover other text or run off the figure, nearby alternatives are
// tried in turn. The choice is remembered per callout, so labels do not hop about
// from frame to frame while their parts move.
const chosen = new WeakMap();

function candidates({ dx, dy }) {
  const sx = dx || 70, list = [[dx, dy], [-dx, dy]];
  for (const d of [40, 80, 130]) list.push([dx, dy - d], [dx, dy + d], [-dx, dy - d], [-dx, dy + d]);
  list.push([0, -Math.abs(dy) - 60], [0, Math.abs(dy) + 60]);
  for (const k of [1.6, 2.4]) list.push([sx * k, dy], [-sx * k, dy], [sx * k, dy - 60], [-sx * k, dy - 60], [sx * k, dy + 60], [-sx * k, dy + 60]);
  return list;
}

const hits2 = (a, b, pad = 2) => a.x0 - pad < b.x1 && b.x0 - pad < a.x1 && a.y0 - pad < b.y1 && b.y0 - pad < a.y1;
const inside = b => b.x0 >= 4 && b.x1 <= W - 4 && b.y0 >= 4 && b.y1 <= H - 4;

function boxesFor(c, to, [dx, dy], name) {
  const m = [to[0] + dx, to[1] + dy], r = markerR() + 2, out = [{ x0: m[0] - r, x1: m[0] + r, y0: m[1] - r, y1: m[1] + r }];
  if (name) {
    const w = measure(c, name, 17, 700, SANS), size = boostedSize(17), right = dx >= 0;
    const x0 = right ? m[0] + r + 5 : m[0] - r - 5 - w;
    out.push({ x0, x1: x0 + w, y0: m[1] + 6 - size * 0.85, y1: m[1] + 6 + size * 0.2 });
  }
  return { m, out };
}

export function callouts(c, anchors, spots, parts) {
  const ids = Object.keys(parts);
  for (const [id, spot] of Object.entries(spots)) {
    const p = parts[id], to = anchors[id];
    if (!p || !to) continue;
    if (anyFocus() && !focusPass()) continue; // focused callouts are drawn on the second pass
    const n = ids.indexOf(id) + 1, on = isFocus(id);
    if (anyFocus() && !on) { hit(id, to[0], to[1], spot.hit ?? 40); continue; }
    const name = on && !spot.quiet ? (lang === 'zh' ? p.name[0] : p.name[1]) : null;
    const options = candidates(spot), last = chosen.get(spot) ?? 0;
    // How badly a spot collides: area covered on other text, plus a big charge for leaving the figure.
    const cost = k => boxesFor(c, to, options[k], name).out.reduce((sum, b) => sum + (inside(b) ? 0 : 1e6) +
      placed.reduce((t, q) => t + (hits2(b, q) ? (Math.min(b.x1, q.x1) - Math.max(b.x0, q.x0) + 4) * (Math.min(b.y1, q.y1) - Math.max(b.y0, q.y0) + 4) : 0), 0), 0);
    let pick = last;
    if (cost(last) > 0) {
      let best = Infinity;
      options.forEach((_, k) => { const v = cost(k); if (v < best) { best = v; pick = k; } });
    }
    chosen.set(spot, pick);
    const { m, out } = boxesFor(c, to, options[pick], name);
    placed.push(...out);
    hit(id, to[0], to[1], spot.hit ?? 40);
    hit(id, m[0], m[1], 22);
    if (isPrimary(id) && spot.r) lens(c, to[0], to[1], spot.r);
    stroke(c, [m, to], on ? C.accent : C.ink2, 1);
    c.beginPath(); c.arc(to[0], to[1], 2.6, 0, Math.PI * 2); c.fillStyle = on ? C.accent : C.ink; c.fill();
    marker(c, n, m[0], m[1], on);
    if (name) {
      const right = options[pick][0] >= 0, gap = markerR() + 7;
      text(c, name, m[0] + (right ? gap : -gap), m[1] + 6, { size: 17, weight: 700, color: C.accent, align: right ? 'left' : 'right', font: SANS });
    }
  }
}
