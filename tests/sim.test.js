import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pistonDrop, strokeAt, valveLift, valvesOverlap, sparkGlow, burnGlow, camAngle } from '../dist/js/sim/kinematics.js';
import { ENGINES, fireAngles, localAngle, bankIntervals, throwAngle, lastFired, inlineForces } from '../dist/js/sim/firing.js';
import { steadyBoost, tipIn, manifold, gauge, parasitic, power, airCharge, ALTITUDES, P_SEA } from '../dist/js/sim/induction.js';

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);
const r = 27, l = 106;

test('piston sits at TDC at 0° and 360°, BDC at 180° and 540°', () => {
  for (const a of [0, 360, 720]) near(pistonDrop(a, r, l), 0);
  for (const a of [180, 540]) near(pistonDrop(a, r, l), 2 * r);
});

test('slider-crank is not a pure sine: the piston is past half stroke at 90°', () => {
  // The connecting rod's angle pulls the piston further down at 90° than cos would.
  assert.ok(pistonDrop(90, r, l) > r);
  near(pistonDrop(90, r, l), r + l - Math.sqrt(l * l - r * r));
});

test('four strokes span 720° in order', () => {
  assert.deepEqual([10, 200, 400, 600].map(strokeAt), ['intake', 'compression', 'power', 'exhaust']);
  near(camAngle(720), 360);
});

test('valves open on their own strokes and overlap only around exhaust TDC', () => {
  assert.ok(valveLift(90, 'intake') > 0.9 && valveLift(90, 'exhaust') === 0);
  assert.ok(valveLift(630, 'exhaust') > 0.9 && valveLift(630, 'intake') === 0);
  for (const a of [270, 360, 450]) assert.equal(valveLift(a, 'intake') + valveLift(a, 'exhaust'), 0);
  assert.ok(valvesOverlap(0) && valvesOverlap(715) && !valvesOverlap(30) && !valvesOverlap(690));
});

test('spark comes just before compression TDC and the burn follows it', () => {
  assert.ok(sparkGlow(352) > 0 && sparkGlow(300) === 0 && sparkGlow(90) === 0);
  assert.ok(burnGlow(380) > 0.8 && burnGlow(560) === 0 && burnGlow(200) === 0);
});

test('inline-four fires 1-3-4-2 every 180°', () => {
  const e = ENGINES.inline4;
  assert.deepEqual(Object.values(fireAngles(e)), [0, 180, 360, 540]);
  assert.deepEqual(bankIntervals(e, 'A'), [180, 180, 180, 180]);
  assert.equal(lastFired(190, e).cyl, 'A3');
  near(localAngle(0, e, 'A1'), 360);
});

test('inline-four: cylinders 1 and 4 move together, 2 and 3 opposite them', () => {
  const e = ENGINES.inline4;
  for (const theta of [0, 47, 133, 290, 611]) {
    const drop = c => pistonDrop(localAngle(theta, e, c), r, l);
    near(drop('A1'), drop('A4'), 1e-6);
    near(drop('A2'), drop('A3'), 1e-6);
  }
});

test('inline-four cancels primary forces but adds up secondary ones', () => {
  const e = ENGINES.inline4;
  for (const theta of [0, 30, 77, 145]) {
    const f = inlineForces(theta, e, 0.25);
    near(f.primary, 0, 1e-9);
    near(f.secondary, 4 * 0.25 * Math.cos(2 * theta * Math.PI / 180), 1e-9);
  }
});

test('V8 fires every 90°; cross-plane banks are uneven, flat-plane banks are even', () => {
  assert.deepEqual(bankIntervals(ENGINES.v8cross, 'L'), [180, 270, 180, 90]);
  assert.deepEqual(bankIntervals(ENGINES.v8cross, 'R'), [180, 90, 180, 270]);
  for (const bank of ['L', 'R']) assert.deepEqual(bankIntervals(ENGINES.v8flat, bank), [180, 180, 180, 180]);
});

test('V8 cylinders sharing a crank throw agree on its direction', () => {
  for (const key of ['v8cross', 'v8flat']) {
    const e = ENGINES[key];
    for (let p = 1; p <= 4; p++) near(throwAngle(e, 'L' + p), throwAngle(e, 'R' + p), 1e-9);
  }
  const throws = e => [1, 2, 3, 4].map(p => throwAngle(e, 'L' + p));
  assert.deepEqual(new Set(throws(ENGINES.v8cross)).size, 4); // four directions: a cross
  assert.deepEqual(new Set(throws(ENGINES.v8flat)).size, 2);  // two directions: flat
});

test('naturally aspirated manifold never exceeds ambient pressure', () => {
  for (const alt of Object.values(ALTITUDES))
    for (let t = 0; t <= 4; t += 0.25) assert.ok(gauge('na', t, alt.pressure) <= 0);
  assert.ok(steadyBoost('na', 6000) <= 0);
});

test('turbo boost starts near zero and rises steadily; the blower boosts at once', () => {
  assert.ok(gauge('turbo', 0.15) < 0.05);
  let prev = -Infinity;
  for (let t = 0; t <= 4; t += 0.05) { const p = manifold('turbo', t); assert.ok(p >= prev - 1e-12); prev = p; }
  assert.ok(gauge('turbo', 4) > 0.7);
  assert.ok(gauge('super', 0.5) > 0.9 * gauge('super', 4));
  assert.ok(tipIn('turbo', 0) === 0 && tipIn('super', 1) > 0.99 && tipIn('na', 0) === 1);
});

test('a supercharger costs crankshaft power; a turbo does not', () => {
  assert.ok(parasitic('super', 3) > 0);
  assert.equal(parasitic('turbo', 3), 0);
  assert.ok(power('super', 3) < manifold('super', 3) / (P_SEA * 0.97));
});

test('at altitude NA power falls with pressure, the turbo mostly recovers', () => {
  const high = ALTITUDES.high.pressure;
  near(power('na', 4, high) / power('na', 4), high / P_SEA, 1e-3);
  assert.ok(power('turbo', 4, high) / power('turbo', 4) > 0.85);
  assert.ok(power('super', 4, high) / power('super', 4) < 0.75);
});

test('boost packs more air per cycle', () => {
  assert.ok(airCharge(0.85) > 1.8 && airCharge(-0.03) === 1);
});
