import { ENTRIES, GROUPS, entryById } from '../data/entries.js';
import { bi } from '../i18n.js';
import { W, H } from '../draw/kit.js';
import { drawPreview } from './preview.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// One gallery card: a small live drawing of the engine, its name and one line.
export function cardHTML(e) {
  const group = GROUPS.find(g => g.id === e.group);
  return `
    <a class="engine-card" href="#/${e.id}" data-group="${e.group}">
      <canvas width="${W / 2}" height="${H / 2}" data-preview="${e.id}" aria-hidden="true"></canvas>
      <span class="ec-group">${bi(group.name)}</span>
      <b>${bi(e.name)}</b>
      <span class="ec-line">${bi(e.card)}</span>
    </a>`;
}

// Cards animate while they are on screen (slowly) and at full speed under the pointer.
export function mountCards(root) {
  const cards = [...root.querySelectorAll('[data-preview]')].map(cv => {
    const e = entryById(cv.dataset.preview);
    const p = { cv, e, theta: 90 + 137 * ENTRIES.indexOf(e), seen: false, hover: false };
    drawPreview(cv, e, p.theta, 0);
    const link = cv.closest('a');
    link.addEventListener('mouseenter', () => { p.hover = true; });
    link.addEventListener('mouseleave', () => { p.hover = false; });
    return p;
  });
  const io = 'IntersectionObserver' in window && new IntersectionObserver(list => {
    for (const it of list) { const p = cards.find(q => q.cv === it.target); if (p) p.seen = it.isIntersecting; }
  });
  if (io) cards.forEach(p => io.observe(p.cv));
  let time = 0, acc = 0;
  return {
    frame(dt) {
      if (reduced || document.hidden) return;
      time += dt; acc += dt;
      const tick = acc >= 1 / 24; // idle cards redraw at about 24 fps
      if (tick) acc = 0;
      for (const p of cards) {
        if (!p.hover && !(p.seen && tick)) continue;
        p.theta += (p.hover ? 40 : 18) * 6 * (p.hover ? dt : 1 / 24);
        if (p.cv.closest('[hidden]')) continue;
        drawPreview(p.cv, p.e, p.theta, time);
      }
    },
    stop() { if (io) io.disconnect(); }
  };
}
