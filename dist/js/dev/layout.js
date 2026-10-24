// Development aid, not loaded by the site. Draws every figure at every step, in both
// languages, at desktop and tablet text sizes and as a compact phone figure, and lists
// labels that overlap each other or leave the figure. In the browser console on the
// running site:
//   (await import('/js/dev/layout.js')).check()
import { VIEWS } from '../draw/views.js';
import { ENTRIES } from '../data/entries.js';
import * as kit from '../draw/kit.js';
import { valveLift, wrap } from '../sim/kinematics.js';
import { lang, setLang } from '../i18n.js';

const overlap = (a, b, m) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > -m && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > -m;

// A handful of moments per step: the step's own angle and a little after it, and the
// throttle experiments before, during and after they run.
const MOMENTS = [{ dth: 0, tip: -1, t: -1 }, { dth: 40, tip: 0.6, t: 0.5 }, { dth: 90, tip: 2.5, t: 2.5 }, { dth: 140, tip: -1, t: 9 }];

function frameFor(entry, i, m, boost) {
  const s = i === 'free' ? { ...entry.steps[0], focus: null } : entry.steps[i];
  const st = {
    theta: (s.at ?? 200) + m.dth, time: 1 + m.dth / 50, playing: true, guided: i !== 'free', hold: 0, part: null,
    step: i === 'free' ? 0 : i, stepClock: 0, speed: entry.speed ?? 24, rpm: s.rpm ?? 3000, tip: m.tip, t: m.t,
    alt: 'sea', balance: false, boxer: 'flat6'
  };
  const view = VIEWS[entry.view];
  if (view.update) for (let k = 0; k < 30; k++) { view.update(st, 0.1, entry); st.tip = m.tip; st.t = m.t; }
  const a = wrap(st.theta);
  return { st: { ...st, parts: entry.parts, figure: '1.1', blur: 0, step: s, flow: { intake: valveLift(a, 'intake'), exhaust: valveLift(a, 'exhaust') } }, focus: s.focus };
}

const SIZES = [{ name: 'desktop', boost: 1.25 }, { name: 'tablet', boost: 1.6 }, { name: 'phone', boost: kit.TEXT_BOOST_MAX, compact: true }];

export async function check({ margin = 2, langs = ['zh', 'en'], sizes = SIZES, only } = {}) {
  const cv = document.createElement('canvas'); cv.width = kit.W; cv.height = kit.H;
  const c = cv.getContext('2d'), was = lang, issues = new Map();
  const add = (key, msg) => { if (!issues.has(key)) issues.set(key, msg); };
  for (const L of langs) {
    setLang(L);
    for (const { name, boost, compact } of sizes) for (const entry of ENTRIES) {
      if (only && !only.includes(entry.id)) continue;
      const view = VIEWS[entry.view];
      for (const i of [...entry.steps.keys(), 'free']) for (const m of MOMENTS) {
        const { st, focus } = frameFor(entry, i, m, boost);
        kit.setFocus(focus); kit.clearHits(); kit.setTextBoost(boost); kit.setCompact(compact);
        kit.stage(c, kit.W, kit.H);
        let pass = 0; kit.textLog.items = [];
        kit.withFocus(c, () => { pass++; kit.textLog.on = !focus || pass === 2; view.draw(c, st, entry); });
        kit.textLog.on = false; kit.setFocus(null); kit.setTextBoost(1); kit.setCompact(false);
        const items = kit.textLog.items.filter(t => t.str.trim());
        const tag = `${entry.id} ${L} ${name} step ${i === 'free' ? 'free' : i + 1}`;
        for (const t of items) if (t.x0 < 2 || t.x1 > kit.W - 2 || t.y0 < 2 || t.y1 > kit.H - 2)
          add(`${entry.id}|${L}|${name}|out|${t.str}`, `${tag}: "${t.str}" leaves the figure [${t.x0 | 0}–${t.x1 | 0}, ${t.y0 | 0}–${t.y1 | 0}]`);
        for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) {
          const p = items[a], q = items[b];
          if (p.str !== q.str && overlap(p, q, margin)) add(`${entry.id}|${L}|${name}|${p.str}|${q.str}`, `${tag}: "${p.str}" [${p.x0 | 0},${p.y0 | 0}] × "${q.str}" [${q.x0 | 0},${q.y0 | 0}]`);
        }
      }
    }
  }
  setLang(was);
  return [...issues.values()];
}
