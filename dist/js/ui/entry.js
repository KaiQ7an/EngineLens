import { ENTRIES, GROUPS, entryById } from '../data/entries.js';
import { bi, t, ui } from '../i18n.js';
import { W, H, stage, setFocus, withFocus, hits, clearHits, lerp, ease, clamp } from '../draw/kit.js';
import { VIEWS } from '../draw/views.js';
import { wrap, valveLift } from '../sim/kinematics.js';
import { rich } from './terms.js';
import { cardHTML, mountCards } from './cards.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOLD = 1.6;          // seconds the guide pauses on each step
const STEP_TIME = 4.8;     // seconds per step for cause-and-effect narration
const VISUAL_CAP = 150;    // fastest rpm drawn literally; beyond this the picture is slowed
const PRESETS = [24, 800, 2500, 7000];
const toSlider = rpm => Math.round(Math.log(rpm / 6) / Math.log(7000 / 6) * 100);
const fromSlider = v => Math.round(6 * (7000 / 6) ** (v / 100));

// Each engine's state survives language switches and revisits within a session.
const states = new Map();
function stateFor(entry) {
  if (!states.has(entry.id)) states.set(entry.id, {
    theta: entry.start ?? 20, time: 0, playing: !reduced, guided: true, hold: 0, tween: null,
    part: null, step: 0, stepClock: 0, speed: entry.speed ?? 24, rpm: 3000, tip: -1, alt: 'sea', balance: false, boxer: 'flat6'
  });
  return states.get(entry.id);
}

const timed = entry => entry.steps.some(s => s.at === undefined);
const stepAt = (entry, theta) => {
  const a = wrap(theta);
  const i = entry.steps.findIndex(s => a < s.until);
  return i < 0 ? 0 : i;
};

function controlsFor(entry, st) {
  const view = VIEWS[entry.view];
  if (entry.kind === 'flow') return `
    <div class="ctl-speed">
      <label for="rpm"><span>${t('rpm')}</span><output id="rpm-out">${st.rpm.toLocaleString('en')}</output><small>rpm</small></label>
      <input id="rpm" type="range" min="1000" max="6500" step="100" value="${st.rpm}">
    </div>
    <button class="btn btn-accent" id="tip-in" type="button">${t('tipIn')}</button>`;
  if (entry.kind === 'experiment') return `
    <div class="seg" role="group" aria-label="${t('altitude')}">
      <button type="button" data-alt="sea" aria-pressed="${st.alt === 'sea'}">${t('sea')}</button>
      <button type="button" data-alt="high" aria-pressed="${st.alt === 'high'}">${t('high')}</button>
    </div>
    <button class="btn btn-accent" id="floor" type="button">${t('floor')}</button>`;
  return `
    <div class="ctl-speed">
      <label for="speed"><span>${t('speed')}</span><output id="speed-out">${st.speed.toLocaleString('en')}</output><small>rpm</small></label>
      <input id="speed" type="range" min="0" max="100" value="${toSlider(st.speed)}">
      <div class="presets">${PRESETS.map((p, i) => `<button type="button" data-preset="${p}">${bi(ui.presets[i])}</button>`).join('')}</div>
    </div>
    ${view.extraControls ? view.extraControls(st) : ''}`;
}

// Other engines worth a look: the rest of this group first, then the neighbours.
function related(entry) {
  const same = ENTRIES.filter(e => e.group === entry.group && e !== entry);
  const i = ENTRIES.indexOf(entry);
  const near = [ENTRIES[i + 1], ENTRIES[i - 1], ...ENTRIES].filter(e => e && e !== entry && !same.includes(e));
  return [...same, ...near].slice(0, 3);
}

export function entryPage(id) {
  const entry = entryById(id);
  const st = stateFor(entry);
  const group = GROUPS.find(g => g.id === entry.group);
  const siblings = ENTRIES.filter(e => e.group === entry.group);
  const view = VIEWS[entry.view];
  const n = entry.steps.length;

  const html = `
  <article class="entry" data-kind="${entry.kind}">
    <div class="crumbs wrap">
      <a href="#/" class="back">← ${t('gallery')}</a>
      <nav class="siblings" aria-label="${bi(group.name)}">${siblings.map(s => `<a href="#/${s.id}" ${s === entry ? 'aria-current="page"' : ''}>${bi(s.name)}</a>`).join('')}</nav>
    </div>
    <div class="entry-grid wrap">
      <div class="stage-col">
        <figure class="stage">
          <canvas id="stage" width="${W * 1.5}" height="${H * 1.5}" role="img" aria-label="${bi(entry.name)}"></canvas>
          <figcaption class="caption">
            <div class="cap-body" aria-live="polite"><span class="cap-step"></span><span class="cap-text"></span></div>
            <div class="cap-nav">
              <button type="button" id="prev" aria-label="${t('prev')}">‹</button><span class="cap-count"></span><button type="button" id="next" aria-label="${t('next')}">›</button>
              <button type="button" class="cap-clear" hidden aria-label="${t('clearPart')}">×</button>
            </div>
          </figcaption>
        </figure>
        <div class="controls">
          <div class="ctl-main">
            <button type="button" class="btn btn-icon" id="play" aria-pressed="${st.playing}"></button>
            <div class="seg" role="group">
              <button type="button" data-guided="1" aria-pressed="${st.guided}">${t('guided')}</button>
              <button type="button" data-guided="0" aria-pressed="${!st.guided}">${t('free')}</button>
            </div>
          </div>
          <div class="ctl-extra">${controlsFor(entry, st)}</div>
        </div>
        <p class="note">${t('model')}</p>
      </div>
      <aside class="brief">
        <p class="eyebrow"><span>${bi(group.name)}</span> ${entry.eyebrow}</p>
        <h1 tabindex="-1">${bi(entry.name)}</h1>
        <p class="tagline">${bi(entry.tagline)}</p>
        <p class="lead">${rich(bi(entry.lead))}</p>
        <dl class="idcard">${entry.facts.map(([k, v]) => `<div><dt>${bi(k)}</dt><dd>${bi(v)}</dd></div>`).join('')}</dl>
        <div class="parts">
          <h2>${t('parts')}</h2>
          <ol class="chips">${Object.entries(entry.parts).map(([pid, p], k) => `<li><button type="button" class="chip" data-part="${pid}"><span>${k + 1}</span>${bi(p.name)}</button></li>`).join('')}</ol>
        </div>
        <p class="analogy">${rich(bi(entry.analogy))}</p>
      </aside>
    </div>
    <section class="facts wrap">
      <div class="pc"><h2>${t('pros')}</h2><ul>${entry.pros.map(p => `<li>${rich(bi(p))}</li>`).join('')}</ul></div>
      <div class="pc cons"><h2>${t('cons')}</h2><ul>${entry.cons.map(p => `<li>${rich(bi(p))}</li>`).join('')}</ul></div>
    </section>
    <section class="cars wrap">
      <h2>${t('cars')}</h2>
      <div class="car-grid">${entry.cars.map(car => `
        <div class="car">
          <h3>${bi(car.name)}</h3>
          <p class="engine">${bi(car.engine)}</p>
          <p class="tags">${car.tags.map(tag => `<span>${bi(tag)}</span>`).join('')}</p>
          <p>${rich(bi(car.why))}</p>
        </div>`).join('')}</div>
    </section>
    <section class="myth wrap">
      <h2>${t('myth')}</h2>
      <p class="q">${bi(entry.myth.q)}</p>
      <p class="a">${rich(bi(entry.myth.a))}</p>
    </section>
    <section class="related wrap">
      <h2>${t('related')}</h2>
      <div class="wall">${related(entry).map(cardHTML).join('')}</div>
    </section>
  </article>`;

  function mount(root) {
    const $ = s => root.querySelector(s);
    const canvas = $('#stage'), c = canvas.getContext('2d');
    const cap = { step: $('.cap-step'), text: $('.cap-text'), clear: $('.cap-clear'), count: $('.cap-count') };
    const cards = mountCards(root);
    let shown = '';

    const setPart = id => { st.part = st.part === id ? null : id; render(); };
    const goStep = (i, manual = true) => {
      const n = entry.steps.length;
      i = (i + n) % n;
      st.step = i; st.stepClock = 0; st.part = null;
      const target = entry.steps[i].at;
      if (target !== undefined) {
        const from = st.theta, cur = wrap(from);
        let to = from - cur + target;
        if (to < from - 0.01 && manual !== 'back') to += 720;
        if (manual === 'back' && to > from) to -= 720;
        st.tween = { from, to, t: 0 };
      }
      if (manual) st.playing = false;
      render();
    };
    const currentStep = () => (timed(entry) ? st.step : stepAt(entry, st.theta));

    function render() {
      $('#play').innerHTML = st.playing ? '❚❚' : '▶';
      $('#play').setAttribute('aria-label', t(st.playing ? 'pause' : 'play'));
      $('#play').setAttribute('aria-pressed', st.playing);
      root.querySelectorAll('[data-guided]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.guided === '1') === String(st.guided)));
      root.querySelectorAll('[data-part]').forEach(b => b.setAttribute('aria-pressed', b.dataset.part === st.part));
      shown = '';
    }

    function updateCaption() {
      const i = currentStep();
      const key = (st.part ?? '') + '|' + i;
      if (key === shown) return;
      shown = key;
      if (st.part) {
        const p = entry.parts[st.part];
        cap.step.textContent = bi(p.name); cap.text.innerHTML = rich(bi(p.text)); cap.clear.hidden = false;
      } else {
        const s = entry.steps[i];
        cap.step.textContent = bi(s.title); cap.text.innerHTML = rich(bi(s.text)); cap.clear.hidden = true;
      }
      cap.count.textContent = `${i + 1} / ${n}`;
    }

    function advance(dt) {
      st.time += dt;
      if (view.update) view.update(st, dt, entry);
      if (st.tween) {
        st.tween.t = Math.min(1, st.tween.t + dt / 0.7);
        st.theta = lerp(st.tween.from, st.tween.to, ease(st.tween.t));
        if (st.tween.t >= 1) st.tween = null;
        return;
      }
      if (!st.playing) return;
      if (timed(entry)) {
        if (st.guided) { st.stepClock += dt; if (st.stepClock > STEP_TIME) goStep(st.step + 1, false); }
      }
      if (st.hold > 0) { st.hold -= dt; return; }
      const vis = entry.kind === 'flow' ? 20 + st.rpm / 6500 * 40 : Math.min(st.speed, VISUAL_CAP);
      const before = st.theta, after = before + vis * 6 * dt;
      if (st.guided && !timed(entry)) {
        for (const s of entry.steps) {
          const k = Math.ceil((before - s.at) / 720), mark = s.at + 720 * k;
          if (mark > before && mark <= after) { st.theta = mark; st.hold = HOLD; return; }
        }
      }
      st.theta = after;
    }

    function draw() {
      const i = currentStep();
      const s = entry.steps[i];
      const guidedFocus = (st.guided || !st.playing) && s.focus;
      setFocus(st.part ? [st.part] : guidedFocus ? s.focus : null);
      stage(c, canvas.width, canvas.height);
      c.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      clearHits();
      const a = wrap(st.theta);
      const vis = Math.min(st.speed, VISUAL_CAP);
      const frame = {
        ...st, theta: st.theta, parts: entry.parts,
        blur: entry.kind === 'crank' ? clamp((st.speed - VISUAL_CAP) / 1500) : 0,
        flow: { intake: valveLift(a, 'intake') * (0.5 + vis / 60), exhaust: valveLift(a, 'exhaust') * (0.5 + vis / 60) },
        step: s
      };
      withFocus(c, () => view.draw(c, frame, entry));
      setFocus(null);
      updateCaption();
    }

    // ── Events ──
    $('#play').addEventListener('click', () => { st.playing = !st.playing; st.hold = 0; render(); });
    root.querySelectorAll('[data-guided]').forEach(b => b.addEventListener('click', () => { st.guided = b.dataset.guided === '1'; st.hold = 0; st.playing = true; render(); }));
    $('#prev').addEventListener('click', () => goStep(currentStep() - 1, 'back'));
    $('#next').addEventListener('click', () => goStep(currentStep() + 1));
    root.querySelectorAll('[data-part]').forEach(b => b.addEventListener('click', () => {
      setPart(b.dataset.part);
      const r = canvas.getBoundingClientRect();
      if (r.bottom < 60 || r.top > innerHeight - 120) canvas.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }));
    cap.clear.addEventListener('click', () => setPart(st.part));
    const toLogical = e => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
    const hitAt = ([x, y]) => hits.reduce((best, h) => { const d = Math.hypot(h.x - x, h.y - y); return d < h.rad && (!best || d < best.d) ? { id: h.id, d } : best; }, null);
    canvas.addEventListener('click', e => { const h = hitAt(toLogical(e)); if (h) setPart(h.id); else if (st.part) setPart(st.part); });
    canvas.addEventListener('mousemove', e => { canvas.style.cursor = hitAt(toLogical(e)) ? 'pointer' : 'default'; });
    const speed = $('#speed');
    if (speed) {
      const out = $('#speed-out');
      const set = rpm => { st.speed = rpm; out.textContent = rpm.toLocaleString('en'); speed.value = toSlider(rpm); };
      speed.addEventListener('input', () => set(fromSlider(+speed.value)));
      root.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => { set(+b.dataset.preset); if (!st.playing) { st.playing = true; render(); } }));
    }
    const rpm = $('#rpm');
    if (rpm) rpm.addEventListener('input', () => { st.rpm = +rpm.value; $('#rpm-out').textContent = st.rpm.toLocaleString('en'); });
    if (view.bind) view.bind(root, st, render);

    render();
    return {
      frame(dt) { if (!document.hidden) { advance(dt); draw(); cards.frame(dt); } },
      stop() { cards.stop(); },
      key(e) {
        if (e.key === ' ') { st.playing = !st.playing; st.hold = 0; render(); return true; }
        if (e.key === 'ArrowRight') { goStep(currentStep() + 1); return true; }
        if (e.key === 'ArrowLeft') { goStep(currentStep() - 1, 'back'); return true; }
        return false;
      }
    };
  }

  return { title: bi(entry.name), html, mount };
}
