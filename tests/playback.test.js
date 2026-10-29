import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceCrank, advanceClock, crankTime, displayAngle, stepTarget } from '../dist/js/sim/playback.js';
import { pinHeight, pistonDrop, strokeAt, wrap } from '../dist/js/sim/kinematics.js';
import { steadyBoost, tipIn, manifold, ALTITUDES } from '../dist/js/sim/induction.js';

test('pause freezes both particle time and the view-specific tip-in clock', () => {
  const st = { playing: false, time: 12, tip: 0.7 };
  let calls = 0;
  const update = (s, dt) => { calls++; s.tip += dt; };
  for (let i = 0; i < 120; i++) advanceClock(st, 1 / 60, update);
  assert.deepEqual(st, { playing: false, time: 12, tip: 0.7 });
  assert.equal(calls, 0);
  st.playing = true;
  advanceClock(st, 0.1, update);
  assert.equal(calls, 1);
  assert.ok(Math.abs(st.tip - 0.8) < 1e-9);
});

test('manual stepping selects the proper cycle in either direction', () => {
  assert.equal(stepTarget(100, 180), 180);
  assert.equal(stepTarget(630, 0), 720);
  assert.equal(stepTarget(0, 540, true), -180);
  assert.equal(stepTarget(810, 0, true), 720);
});

test('each guide stop is exact at both high and low frame rates', () => {
  for (const dt of [1 / 120, 1 / 60, 1 / 20]) {
    let theta = 179;
    for (let i = 0; i < 120; i++) {
      const next = advanceCrank(theta, dt, 16, [0, 180, 360, 540]);
      theta = next.theta;
      if (next.stopped) break;
    }
    assert.equal(theta, 180);
    assert.equal(pistonDrop(theta, 40, 150), 80);
  }
});

test('large frames take the earliest stop, independent of list order', () => {
  assert.deepEqual(advanceCrank(170, 1, 600, [540, 360, 180, 0]), { theta: 180, stopped: true });
  assert.deepEqual(advanceCrank(180, 0.01, 16, [180, 360]), { theta: 180.96, stopped: false });
});

test('the full-cycle endpoint is reachable and distinct from the start in the UI', () => {
  assert.equal(displayAngle(720, true), 720);
  assert.equal(displayAngle(720, false), 0);
  assert.equal(displayAngle(-180), 540);
  assert.equal(displayAngle(270, true), 270);
});

test('floating-point noise cannot put a dead-centre caption in the previous stroke', () => {
  for (const [angle, phase] of [[180, 'compression'], [360, 'power'], [540, 'exhaust'], [720, 'intake']]) {
    for (const epsilon of [-1e-12, 0, 1e-12]) {
      assert.equal(strokeAt(angle + epsilon), phase);
      assert.equal(wrap(angle + epsilon), angle % 720);
    }
  }
  assert.equal(strokeAt(179.9), 'intake');
});

test('visual motion is capped and clock position is determined only by crank angle', () => {
  assert.equal(advanceCrank(0, 0.1, 9000).theta, 360);
  assert.equal(advanceCrank(0, 0.1, -100).theta, 0);
  assert.equal(crankTime(180), 1.875);
  assert.equal(crankTime(180), crankTime(stepTarget(100, 180)));
});

test('a connecting rod retains its length throughout the entire cycle', () => {
  const r = 40, l = 150;
  for (let theta = -720; theta <= 1440; theta += 7) {
    const a = theta * Math.PI / 180;
    const length = Math.hypot(r * Math.sin(a), pinHeight(theta, r, l) - r * Math.cos(a));
    assert.ok(Math.abs(length - l) < 1e-9);
  }
  for (const [theta, r0, l0] of [[0, 40, 20], [NaN, 40, 150], [0, -1, 150]]) assert.throws(() => pinHeight(theta, r0, l0), RangeError);
});

test('stopped compressors cannot boost; boost is bounded at extreme RPM', () => {
  for (const mode of ['na', 'turbo', 'super']) {
    assert.equal(steadyBoost(mode, 0), 0);
    assert.equal(steadyBoost(mode, -100), 0);
    assert.ok(steadyBoost(mode, 100000) <= 0.85);
  }
  assert.throws(() => steadyBoost('super', NaN), RangeError);
});

test('turbo pressure follows squared spool response; direct drive is immediate', () => {
  assert.equal(tipIn('turbo', -1), 0);
  assert.equal(tipIn('turbo', 0), 0);
  assert.equal(tipIn('super', 0), 1);
  assert.ok(Math.abs(tipIn('turbo', 0.9) - (1 - Math.exp(-1)) ** 2) < 1e-9);
  for (const alt of Object.values(ALTITUDES)) {
    let previous = manifold('turbo', 0, alt.pressure);
    for (let t = 0.05; t <= 8; t += 0.05) {
      const next = manifold('turbo', t, alt.pressure);
      assert.ok(next >= previous);
      previous = next;
    }
  }
});
