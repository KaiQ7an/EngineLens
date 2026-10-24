import { ENTRIES, GROUPS, entryById } from '../data/entries.js';
import { bi, t, ui } from '../i18n.js';
import { W, H, stage, setFocus, withFocus, hits, clearHits, lerp, ease, fitCanvas, setTextBoost, setCompact, readouts, STROKE_TONES } from '../draw/kit.js';
import { VIEWS } from '../draw/views.js';
import { STROKE_NAMES } from '../draw/fourstroke.js';
import { wrap, valveLift, strokeIndex } from '../sim/kinematics.js';
import { rich } from './terms.js';
import { cardHTML, mountCards } from './cards.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// On a phone the figure is too small for boxes of small text, so views leave their
// readouts out of the drawing and the page shows them as text under the figure.
const narrow = matchMedia('(max-width: 640px)');
const HOLD = 1.6;          // seconds the guide pauses on each step, unless the entry says otherwise
const STEP_TIME = 4.8;     // seconds per step for cause-and-effect narration
// Playback is how fast the drawing turns, as a multiple of the entry's base speed in
// crank rpm. It is not the engine speed being described: the real thing at 3,000 rpm
// is far too fast to see, so that is a separate setting with its own readout.
const PLAYBACK = { slow: 0.5, mid: 1, fast: 2.5 };
const BASE_SPEED = 16;
const playRpm = (entry, st) => (entry.speed ?? BASE_SPEED) * PLAYBACK[st.play];
// Readout numbers rounded the way you would say them: 380, 25, 6.7.
const say = v => (v >= 100 ? Math.round(v / 10) * 10 : v >= 10 ? Math.round(v) : +v.toFixed(1)).toLocaleString('en');

// Each engine's state survives language switches and revisits within a session.
const states = new Map();
function stateFor(entry) {
  if (!states.has(entry.id)) states.set(entry.id, {
    theta: entry.start ?? entry.steps[0].at ?? 20, time: 0, playing: !reduced, guided: true, hold: 0, tween: null,
    part: null, step: 0, stepClock: 0, play: entry.playback ?? 'mid', rpm: 3000, tip: -1, alt: 'sea', balance: false, boxer: 'flat6'
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
  // Drive-mode scenes are narrated only; they have no speed or throttle to set.
  if (entry.kind === 'scene') return view.extraControls ? view.extraControls(st) : '';
  if (entry.kind === 'experiment') return `
    <div class="seg" role="group" aria-label="${t('altitude')}">
      <button type="button" data-alt="sea" aria-pressed="${st.alt === 'sea'}">${t('sea')}</button>
      <button type="button" data-alt="high" aria-pressed="${st.alt === 'high'}">${t('high')}</button>
    </div>
    <button class="btn btn-accent" id="floor" type="button">${t('floor')}</button>`;
  const redline = entry.redline ?? 7000;
  return `
    <div class="ctl-play">
      <span class="ctl-label">${t('playback')}</span>
      <div class="seg" role="group" aria-label="${t('playback')}">${Object.keys(PLAYBACK).map(k => `<button type="button" data-play="${k}" aria-pressed="${st.play === k}">${t(k)}</button>`).join('')}</div>
    </div>
    ${entry.scrub ? `
    <div class="ctl-speed">
      <label for="rpm"><span>${t('engineRpm')}</span><output id="rpm-out">${st.rpm.toLocaleString('en')}</output><small>rpm</small></label>
      <input id="rpm" type="range" min="800" max="${redline}" step="100" value="${st.rpm}">
      <div class="presets">${[800, 2500, redline].map((p, i) => `<button type="button" data-rpm="${p}">${bi(ui.presets[i])}</button>`).join('')}</div>
      <p class="ctl-read" id="rate" aria-live="polite"></p>
    </div>` : ''}
    ${view.extraControls ? view.extraControls(st) : ''}`;
}

// The crank-angle scrubber under the figure: drag to turn the crank by hand. For a
// single cylinder it is marked with the strokes and dead centres.
function scrubber(entry, st) {
  const strokes = entry.scrub === 'strokes';
  return `
  <div class="scrub">
    <div class="scrub-head"><label for="angle">${t('crankAngle')}</label><output id="angle-out"></output><span class="scrub-hint">${t('scrubHint')}</span></div>
    ${strokes ? `<div class="scrub-strokes">${STROKE_NAMES.map((nm, k) => `<span data-tone="${STROKE_TONES[k]}">${bi(nm)}</span>`).join('')}</div>` : ''}
    <input id="angle" type="range" min="0" max="719" step="1" value="${Math.round(wrap(st.theta))}" data-mode="${entry.scrub}">
    <div class="scrub-marks">${[0, 180, 360, 540, 720].map(d => `<span style="left:${d / 7.2}%">${strokes ? t(d % 360 ? 'bdc' : 'tdc') : d + '°'}</span>`).join('')}</div>
  </div>`;
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
  // Figures are numbered like plates in a book: category, then place in it.
  const figure = `${GROUPS.indexOf(group) + 1}.${siblings.indexOf(entry) + 1}`;

  const html = `
  <article class="entry" data-kind="${entry.kind}"${entry.scrub ? ' data-scrub' : ''}>
    <div class="crumbs wrap">
      <a href="#/" class="back">← ${t('gallery')}</a>
      <nav class="siblings" aria-label="${bi(group.name)}">${siblings.map(s => `<a href="#/${s.id}" ${s === entry ? 'aria-current="page"' : ''}>${bi(s.name)}</a>`).join('')}</nav>
    </div>
    <div class="entry-grid wrap">
      <div class="stage-col">
        <figure class="stage">
          <canvas id="stage" width="${W * 1.5}" height="${H * 1.5}" role="img" aria-label="${bi(entry.name)}"></canvas>
          <div class="fig-read" hidden></div>
          ${entry.scrub ? scrubber(entry, st) : ''}
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
      <h2>${entry.carsTitle ? bi(entry.carsTitle) : t('cars')}</h2>
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
        cap.step.textContent = bi(p.name); cap.step.dataset.tone = ''; cap.text.innerHTML = rich(bi(p.text)); cap.clear.hidden = false;
      } else {
        const s = entry.steps[i];
        cap.step.textContent = bi(s.title); cap.step.dataset.tone = s.tone ?? ''; cap.clear.hidden = true;
        // First what is happening, then why it matters.
        cap.text.innerHTML = rich(bi(s.text)) + (s.why ? `<span class="cap-why"><b>${t('why')}</b>${rich(bi(s.why))}</span>` : '');
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
      const vis = entry.kind === 'flow' ? 20 + st.rpm / 6500 * 40 : playRpm(entry, st);
      const before = st.theta, after = before + vis * 6 * dt;
      if (st.guided && !timed(entry)) {
        for (const s of entry.steps) {
          const k = Math.ceil((before - s.at) / 720), mark = s.at + 720 * k;
          if (mark > before && mark <= after) { st.theta = mark; st.hold = entry.hold ?? HOLD; return; }
        }
      }
      st.theta = after;
    }

    // Drawing pauses while the figure is scrolled out of view; the animation's state
    // keeps advancing so it picks up where it should be.
    let visible = true;
    const io = 'IntersectionObserver' in window && new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (io) io.observe(canvas);

    function draw() {
      fitCanvas(canvas);
      const i = currentStep();
      const s = entry.steps[i];
      const guidedFocus = (st.guided || !st.playing) && s.focus;
      setFocus(st.part ? [st.part] : guidedFocus ? s.focus : null);
      stage(c, canvas.width, canvas.height);
      c.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      clearHits();
      const a = wrap(st.theta);
      const vis = playRpm(entry, st);
      const frame = {
        ...st, theta: st.theta, parts: entry.parts, figure, speed: vis,
        flow: { intake: valveLift(a, 'intake') * (0.5 + vis / 60), exhaust: valveLift(a, 'exhaust') * (0.5 + vis / 60) },
        step: s
      };
      setTextBoost(1000 / canvas.clientWidth);
      setCompact(narrow.matches);
      withFocus(c, () => view.draw(c, frame, entry));
      setTextBoost(1); setCompact(false);
      showReadouts();
      setFocus(null);
      updateCaption();
      updateScrub();
    }

    // Keep the scrubber on the crank angle while it plays.
    const angle = $('#angle'), angleOut = $('#angle-out'), scrubStrokes = root.querySelectorAll('.scrub-strokes span');
    let shownAngle = -1;
    function updateScrub() {
      if (!angle) return;
      const d = Math.round(wrap(st.theta)) % 720;
      if (d === shownAngle) return;
      shownAngle = d;
      if (+angle.value !== d) angle.value = d;
      const k = strokeIndex(d), name = entry.scrub === 'strokes' ? ' · ' + bi(STROKE_NAMES[k]) : '';
      angleOut.textContent = d + '°' + name;
      angle.setAttribute('aria-valuetext', d + '°' + name);
      scrubStrokes.forEach((el, i) => el.classList.toggle('on', i === k));
    }

    // Readout boxes the view handed over instead of drawing (phones only).
    const figRead = $('.fig-read');
    let shownRead = '';
    // Rows go two to a line unless a label is too long to share one (a Chinese character
    // counts double). Labels never change on a page, so the layout does not jump.
    const span = str => [...String(str)].reduce((n, ch) => n + (/[\u2e80-\u9fff\uff00-\uffef]/.test(ch) ? 2 : 1), 0);
    function showReadouts() {
      const html = readouts.map(r => `<section${r.rows.some(row => span(row.label) > 12) ? ' class="one"' : ''}><h3>${r.title}</h3><dl>${r.rows.map(row =>
        `<div${row.hot ? ' class="hot"' : ''}><dt>${row.label}</dt><dd>${row.value}</dd></div>`).join('')}</dl></section>`).join('');
      if (html === shownRead) return;
      shownRead = html; figRead.innerHTML = html; figRead.hidden = !html;
    }
    // Turning the crank by hand pauses the animation; it carries on from there when played.
    const turnTo = theta => { st.theta = theta; st.playing = false; st.tween = null; st.hold = 0; render(); };
    if (angle) angle.addEventListener('input', () => turnTo(st.theta - wrap(st.theta) + +angle.value));

    const rate = $('#rate');
    function updateRate() {
      if (!rate) return;
      rate.textContent = t('rate', { fires: say(st.rpm / 120), ms: say(120000 / st.rpm), slow: say(st.rpm / playRpm(entry, st)) });
    }

    // ── Events ──
    $('#play').addEventListener('click', () => { st.playing = !st.playing; st.hold = 0; render(); });
    root.querySelectorAll('[data-guided]').forEach(b => b.addEventListener('click', () => { st.guided = b.dataset.guided === '1'; st.hold = 0; st.playing = true; render(); }));
    // Back goes to the start of the current step first, like a video player's back button.
    const back = () => {
      const i = currentStep(), at = entry.steps[i].at;
      goStep(at !== undefined && wrap(st.theta) - at > 4 ? i : i - 1, 'back');
    };
    $('#prev').addEventListener('click', back);
    $('#next').addEventListener('click', () => goStep(currentStep() + 1));
    root.querySelectorAll('[data-part]').forEach(b => b.addEventListener('click', () => {
      setPart(b.dataset.part);
      const r = canvas.getBoundingClientRect();
      if (r.bottom < 60 || r.top > innerHeight - 120) canvas.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }));
    cap.clear.addEventListener('click', () => setPart(st.part));
    const toLogical = e => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
    const hitAt = ([x, y]) => hits.reduce((best, h) => { const d = Math.hypot(h.x - x, h.y - y); return d < h.rad && (!best || d < best.d) ? { id: h.id, d } : best; }, null);
    // A tap picks a part; a sideways drag on the drawing turns the crank instead.
    let drag = null, dragged = false;
    canvas.addEventListener('pointerdown', e => { if (angle) drag = { x: e.clientX, theta: st.theta, id: e.pointerId, moving: false }; });
    canvas.addEventListener('pointermove', e => {
      if (!drag) { canvas.style.cursor = hitAt(toLogical(e)) ? 'pointer' : angle ? 'ew-resize' : 'default'; return; }
      const dx = e.clientX - drag.x;
      if (!drag.moving && Math.abs(dx) < 6) return;
      if (!drag.moving) { drag.moving = true; canvas.setPointerCapture(drag.id); }
      turnTo(drag.theta + dx / canvas.clientWidth * 720);
    });
    const endDrag = () => { dragged = !!drag?.moving; drag = null; };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('click', e => {
      if (dragged) { dragged = false; return; }
      const h = hitAt(toLogical(e)); if (h) setPart(h.id); else if (st.part) setPart(st.part);
    });
    root.querySelectorAll('[data-play]').forEach(b => b.addEventListener('click', () => {
      st.play = b.dataset.play;
      root.querySelectorAll('[data-play]').forEach(x => x.setAttribute('aria-pressed', x === b));
      updateRate();
    }));
    const rpm = $('#rpm');
    if (rpm) {
      const set = v => { st.rpm = v; rpm.value = v; $('#rpm-out').textContent = v.toLocaleString('en'); updateRate(); };
      rpm.addEventListener('input', () => set(+rpm.value));
      root.querySelectorAll('[data-rpm]').forEach(b => b.addEventListener('click', () => set(+b.dataset.rpm)));
    }
    updateRate();
    if (view.bind) view.bind(root, st, render);

    render();
    return {
      frame(dt) { if (!document.hidden) { advance(dt); if (visible) draw(); cards.frame(dt); } },
      stop() { cards.stop(); if (io) io.disconnect(); },
      key(e) {
        if (e.key === ' ') { st.playing = !st.playing; st.hold = 0; render(); return true; }
        if (e.key === 'ArrowRight') { goStep(currentStep() + 1); return true; }
        if (e.key === 'ArrowLeft') { back(); return true; }
        return false;
      }
    };
  }

  return { title: bi(entry.name), html, mount };
}
