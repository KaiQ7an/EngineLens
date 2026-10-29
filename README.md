# EngineLens

看懂每一口动力 — an interactive, bilingual (中文 / English) atlas of how engines work,
for people who love racing but have never opened an engine.

The home page sorts twenty engines into six categories, each card a live blueprint
drawing. Each engine page puts its cutaway top-left with narrated captions. Air is drawn as dots you can
count: a turbo visibly packs more into the same cylinder.

## Engines

| Group | Engine | What you see |
| --- | --- | --- |
| The basics | Four-stroke | One cylinder with its cams, valves and spark, dead centres marked, and a live readout of every part |
| How it breathes | Naturally aspirated | The atmosphere pushing air past the throttle |
| | Turbocharged | Exhaust spinning the turbine, boost, intercooler, wastegate, lag |
| | Supercharged | Belt-driven Roots blower and the power it takes |
| | Floor-it test | Three 2.0-litre engines floored together, at sea level or 3,650 m |
| | Twincharging & e-boost | A supercharger handing over to a turbo, and how fast an electric compressor spools |
| Cylinder layouts | Inline-four | Firing order 1-3-4-2, secondary shake and balance shafts |
| | Inline-six | 1-5-3-6-2-4, overlapping power strokes, a shake meter that stays still |
| | V6 | A 60° front section with split crank pins, banks taking turns |
| | V8 | Cross-plane vs flat-plane: crank shape, per-bank firing rhythm |
| | V12 | Two inline-sixes on one crank, three cylinders always pushing |
| | W16 | Four rows on one crank: two narrow VR8s in a V, four turbos |
| | Boxer | Opposed pistons moving together, flat-four or flat-six, centre of gravity |
| Different designs | Diesel | Air-only intake, a hard squeeze to over 600°C, injector spray, glow plug |
| | Rotary | Epitrochoid housing, three chambers at once, 3 : 1 shaft to rotor |
| Going electric | Hybrid | Energy flows through five drive modes: electric, generating, engine drive, regen, plug-in |
| | Range extender | The same drivetrain with no link from engine to wheels |
| | Electric motor | Three-phase coils, a rotating field, the rotor following it, and regeneration |
| | Hydrogen fuel cell | Hydrogen split at the anode, protons through the membrane, electrons round the circuit, water out |
| On track | F1 power unit | The 2026 rules: 90° V6 turbo, 350 kW MGU-K, no MGU-H; energy over a lap; 2014–2025 for comparison |

The four-stroke page sets the pattern for the others. The narrated guide stops at each
dead centre (the diesel page does the same, and the inline engines stop as each
cylinder fires) and explains what happens, then why; every page's steps are written
that way, and a test keeps it so. A crank-angle scrubber under the figure
(or a sideways drag on the drawing) turns the engine by hand; it stays where you leave it
and plays on from there. Playback speed is set apart from the engine speed being
described, which has its own readout of firings per second and how much the drawing is
slowed. Each stroke keeps one colour throughout: intake cyan, compression yellow,
burning orange, exhaust grey; boosted intake air has its own blue key. Each stage
button pauses at that stroke; clickable angle marks land exactly at 0°, 180°, 360°,
540° or the full-cycle endpoint of 720°. Part selection pauses the figure for inspection.
Pausing also freezes particle positions and view-specific boost timers, and skips
identical canvas redraws. Reduced-motion navigation jumps directly to the chosen step.

Labels are placed so they never cover each other: numbered callouts look for a free
spot, and `dist/js/dev/layout.js` draws every figure at every step, in both languages,
at desktop and tablet sizes and as a phone figure, and lists any label that overlaps
another or leaves the figure. On phones the figure runs edge to edge and its labels
are enlarged to a readable floor; readout boxes and footnotes leave the drawing, and
the readouts appear as text under it. Every figure redraws only while it is on screen. Each engine page has an identity card, parts you can tap (numbered callouts on the
drawing), strengths and trade-offs, cars you may know (tagged by layout and
induction), one common myth explained, and links to related engines. Dashed-underlined
terms open a glossary.

Live at **https://kaiq7an.github.io/EngineLens/**. Every push to `main` runs the tests
and publishes `dist/` to GitHub Pages (`.github/workflows/pages.yml`).

## Run locally

Requires Node.js 20 or newer. There are no dependencies and no build step.

```sh
npm run dev     # http://localhost:5173, reloads on changes in dist/
npm test        # model and content tests
npm run check   # syntax-check every module
```

To check figure labels, open the running site and run this in the browser console; an
empty list means nothing overlaps:

```js
(await import('/js/dev/layout.js')).check()
```

Use `PORT=5174 npm run dev` to choose another port. The site is static and can be
served from `dist/` by any web server.

## How it is built

```
dist/
  index.html, style.css
  js/main.js            router, theme, language, animation loop
  js/sim/               pure, tested models: crank and valve timing, firing orders, boost,
                        diesel compression heating, Wankel rotary geometry, three-phase
                        motor field, hybrid and range-extender drive modes, the F1 power split,
                        twincharger handover and spool-up, fuel-cell stoichiometry
  js/draw/              canvas views, all drawn from a single crank angle
  js/data/              entry copy, cars and glossary as [中文, English] pairs
  js/ui/                gallery, engine page, glossary, term tooltips
  js/dev/layout.js      label overlap check, run from the browser console
tests/sim.test.js       node:test checks on the models
tests/content.test.js   every entry has a view, both languages, and glossary links that resolve
tests/playback.test.js  pause freezing, exact stops, full-cycle endpoint, numerical boundaries,
                       frame-rate independence and bounded compressor response
```

Every moving part is derived from one crank angle θ, so slowing down, pausing or
stepping never shows an impossible position. Piston motion uses the slider-crank
equation; valves follow a timing with 20° of overlap. The tests check each firing
order against its crank: V8 and V12 pins are shared by both banks, the V6 pins are
split, boxer pistons move out together, and the inline-six cancels its own shake.
The rotary's apexes are checked to stay on the housing, with one power stroke per
shaft turn; the diesel's compressed air must end hotter than a petrol engine's. The
motor's three currents must make a field of constant strength that turns, and no
range-extender mode may drive the wheels from the engine.

To add an engine: write its model (if new) in `js/sim/`, a view in `js/draw/` and
register it in `js/draw/views.js`, then add its entry to `js/data/entries.js`.

## Model notes

Figures are schematic and not to scale. Boost, air charge, power and the floor-it
curves are teaching models with physically motivated shapes, not data for any real
engine, and so is the "push on the crank" graph, which counts only power strokes.
The supercharger shown is a positive-displacement (Roots) type; centrifugal
superchargers behave differently. Firing orders are examples: GM's LS-family order
for the cross-plane V8, a typical alternating order for the flat-plane V8, Subaru's
1-3-2-4 and Porsche's 1-6-2-4-3-5 for the boxers, an even-firing 60° V6, and an
even-firing W16 that rotates through its four rows. The
diesel thermometer uses ideal adiabatic compression from 27°C (16:1 against 10:1 for
petrol); the rotary uses Mazda 13B-like proportions with a simplified rotor flank. The
hybrid diagram is a generic series-parallel layout (like Honda e:HEV), not Toyota's
planetary power split, and the motor is drawn as a two-pole permanent-magnet machine.
For F1, the MGU-K figures (120 kW, 350 kW) come from the rules; engine power is not
published, so about 400 kW (2026, as the FIA describes it) and about 550 kW
(2014–2025, an estimate) are approximate, and the lap is stylised, not a real circuit.

References:

- [Garrett Motion — How a Turbo Works](https://www.garrettmotion.com/it/turbocharger-technology/how-a-turbo-works/basic/)
- [Cummins — How a Turbocharger Works](https://www.cummins.com/en-apac/components/turbochargers/how-a-turbocharger-works)
- [Magnuson — Supercharging FAQ](https://magnusonsuperchargers.com/pages/magnuson-101-supercharging-faq-for-beginners)

No analytics, accounts or backend. Language and theme are kept in `localStorage`
when available.
