import { C, SANS, isFocus, isPrimary, anyFocus, focusPass, hit, marker, lens, stroke, text } from './kit.js';
import { lang } from '../i18n.js';

// Numbered callouts in the manner of a technical illustration. Each part gets a
// numbered marker joined to it by a short leader; parts in focus also show their name
// and the lens ring. `spots` gives each marker's offset from its part's anchor.
export function callouts(c, anchors, spots, parts) {
  const ids = Object.keys(parts);
  for (const [id, spot] of Object.entries(spots)) {
    const p = parts[id], to = anchors[id];
    if (!p || !to) continue;
    const n = ids.indexOf(id) + 1, on = isFocus(id);
    const m = [to[0] + spot.dx, to[1] + spot.dy];
    if (anyFocus() && !focusPass()) continue; // focused callouts are drawn on the second pass
    hit(id, to[0], to[1], spot.hit ?? 40);
    hit(id, m[0], m[1], 22);
    if (isPrimary(id) && spot.r) lens(c, to[0], to[1], spot.r);
    if (anyFocus() && !on) continue;
    stroke(c, [m, to], on ? C.accent : C.ink2, 1);
    c.beginPath(); c.arc(to[0], to[1], 2.6, 0, Math.PI * 2); c.fillStyle = on ? C.accent : C.ink; c.fill();
    marker(c, n, m[0], m[1], on);
    if (on && !spot.quiet) {
      const right = spot.dx >= 0;
      const name = lang === 'zh' ? p.name[0] : p.name[1];
      text(c, name, m[0] + (right ? 18 : -18), m[1] + 6, { size: 17, weight: 700, color: C.accent, align: right ? 'left' : 'right', font: SANS });
    }
  }
}
