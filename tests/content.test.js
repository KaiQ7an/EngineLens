import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENTRIES, GROUPS } from '../dist/js/data/entries.js';
import { GLOSSARY, termById } from '../dist/js/data/glossary.js';
import { VIEWS } from '../dist/js/draw/views.js';

const pair = v => Array.isArray(v) && v.length === 2 && v.every(s => typeof s === 'string' && s.trim());
const strings = v => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);

test('every entry has a known view and group and a unique id', () => {
  assert.equal(new Set(ENTRIES.map(e => e.id)).size, ENTRIES.length);
  for (const e of ENTRIES) {
    assert.ok(VIEWS[e.view], `${e.id}: view ${e.view}`);
    assert.ok(GROUPS.some(g => g.id === e.group), `${e.id}: group ${e.group}`);
  }
  for (const g of GROUPS) assert.ok(ENTRIES.some(e => e.group === g.id), `empty group ${g.id}`);
});

test('every entry is written in both languages', () => {
  for (const e of ENTRIES) {
    for (const key of ['name', 'tagline', 'card', 'lead', 'analogy']) assert.ok(pair(e[key]), `${e.id}.${key}`);
    // Every step says what happens, then why: the standard the four-stroke page set.
    assert.ok(e.steps.length >= 3 && e.steps.every(s => pair(s.title) && pair(s.text) && pair(s.why)), `${e.id} steps`);
    assert.ok(Object.keys(e.parts).length >= 4 && Object.values(e.parts).every(p => pair(p.name) && pair(p.text)), `${e.id} parts`);
    assert.ok(e.facts.every(([k, v]) => pair(k) && pair(v)), `${e.id} facts`);
    assert.ok(e.pros.length && e.cons.length && e.cars.length && pair(e.myth.q) && pair(e.myth.a), `${e.id} sections`);
  }
});

test('glossary links in the copy all resolve, and both languages link the same terms', () => {
  const links = s => [...s.matchAll(/\[\[([\w-]+)\|/g)].map(m => m[1]);
  for (const e of ENTRIES) for (const s of strings(e)) for (const id of links(s)) assert.ok(termById(id), `${e.id}: [[${id}]]`);
  const walk = (v, path) => (Array.isArray(v) && v.length === 2 && v.every(x => typeof x === 'string')
    ? assert.deepEqual(links(v[0]).sort(), links(v[1]).sort(), path)
    : v && typeof v === 'object' && Object.entries(v).forEach(([k, x]) => walk(x, path + '.' + k)));
  for (const e of ENTRIES) walk(e, e.id);
  assert.equal(new Set(GLOSSARY.map(g => g.id)).size, GLOSSARY.length);
});

test('the four-stroke guide stops at each dead centre, in that stroke\'s colour', async () => {
  const { STROKE_TONES } = await import('../dist/js/draw/kit.js');
  const { strokeIndex } = await import('../dist/js/sim/kinematics.js');
  const steps = ENTRIES.find(e => e.id === 'four-stroke').steps;
  assert.deepEqual(steps.map(s => s.at), [0, 180, 360, 540]);
  for (const s of steps) assert.equal(s.tone, STROKE_TONES[strokeIndex(s.at)]);
  for (const e of ENTRIES) for (const s of e.steps) if (s.why) assert.ok(pair(s.why), `${e.id}: ${s.title[1]} why`);
});

test('the piston is reported at a dead centre only when it is there', async () => {
  const { pistonState } = await import('../dist/js/draw/fourstroke.js');
  for (const a of [0, 360, 720, 3, 717]) assert.equal(pistonState(a).at, 'tdc', `θ = ${a}`);
  for (const a of [180, 540, 183]) assert.equal(pistonState(a).at, 'bdc', `θ = ${a}`);
  for (const a of [30, 90, 270, 450, 630]) assert.equal(pistonState(a).at, undefined, `θ = ${a}`);
});
