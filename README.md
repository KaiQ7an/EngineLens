# EngineLens

看懂每一口动力 — an interactive, bilingual (中文 / English) atlas of how engines work,
for people who love racing but have never opened an engine.

The home page is a wall of engines, each card a live blueprint drawing, filterable by
the basics, how the engine breathes and how its cylinders are laid out. Each engine
page puts its cutaway top-left with narrated captions. Air is drawn as dots you can
count: a turbo visibly packs more into the same cylinder.

## Engines

| Group | Engine | What you see |
| --- | --- | --- |
| The basics | Four-stroke | One cylinder, cams and valves on a 720° cycle dial |
| How it breathes | Naturally aspirated | The atmosphere pushing air past the throttle |
| | Turbocharged | Exhaust spinning the turbine, boost, intercooler, wastegate, lag |
| | Supercharged | Belt-driven Roots blower and the power it takes |
| | Floor-it test | Three 2.0-litre engines floored together, at sea level or 3,650 m |
| Cylinder layouts | Inline-four | Firing order 1-3-4-2, secondary shake and balance shafts |
| | Inline-six | 1-5-3-6-2-4, overlapping power strokes, a shake meter that stays still |
| | V6 | A 60° front section with split crank pins, banks taking turns |
| | V8 | Cross-plane vs flat-plane: crank shape, per-bank firing rhythm |
| | V12 | Two inline-sixes on one crank, three cylinders always pushing |
| | Boxer | Opposed pistons moving together, flat-four or flat-six, centre of gravity |
| Different designs | Diesel | Air-only intake, a hard squeeze to over 600°C, injector spray, glow plug |
| | Rotary | Epitrochoid housing, three chambers at once, 3 : 1 shaft to rotor |

W16, hybrids, EVs, fuel cells and the 2026 F1 power unit are listed as coming soon.

Each engine page has an identity card, parts you can tap (numbered callouts on the
drawing), strengths and trade-offs, cars you may know (tagged by layout and
induction), one common myth explained, and links to related engines. Dashed-underlined
terms open a glossary.

## Run locally

Requires Node.js 20 or newer. There are no dependencies and no build step.

```sh
npm run dev     # http://localhost:5173, reloads on changes in dist/
npm test        # simulation unit tests
npm run check   # syntax-check every module
```

Use `PORT=5174 npm run dev` to choose another port. The site is static and can be
served from `dist/` by any web server.

## How it is built

```
dist/
  index.html, style.css
  js/main.js            router, theme, language, animation loop
  js/sim/               pure, tested models: crank and valve timing, firing orders, boost,
                        diesel compression heating, Wankel rotary geometry
  js/draw/              canvas views, all drawn from a single crank angle
  js/data/              entry copy, cars and glossary as [中文, English] pairs
  js/ui/                gallery, engine page, glossary, term tooltips
tests/sim.test.js       node:test checks on the models
```

Every moving part is derived from one crank angle θ, so slowing down, pausing or
stepping never shows an impossible position. Piston motion uses the slider-crank
equation; valves follow a timing with 20° of overlap. The tests check each firing
order against its crank: V8 and V12 pins are shared by both banks, the V6 pins are
split, boxer pistons move out together, and the inline-six cancels its own shake.
The rotary's apexes are checked to stay on the housing, with one power stroke per
shaft turn; the diesel's compressed air must end hotter than a petrol engine's.

To add an engine: write its model (if new) in `js/sim/`, a view in `js/draw/` and
register it in `js/draw/views.js`, then add its entry to `js/data/entries.js`.

## Model notes

Figures are schematic and not to scale. Boost, air charge, power and the floor-it
curves are teaching models with physically motivated shapes, not data for any real
engine, and so is the "push on the crank" graph, which counts only power strokes.
The supercharger shown is a positive-displacement (Roots) type; centrifugal
superchargers behave differently. Firing orders are examples: GM's LS-family order
for the cross-plane V8, a typical alternating order for the flat-plane V8, Subaru's
1-3-2-4 and Porsche's 1-6-2-4-3-5 for the boxers, and an even-firing 60° V6. The
diesel thermometer uses ideal adiabatic compression from 27°C (16:1 against 10:1 for
petrol); the rotary uses Mazda 13B-like proportions with a simplified rotor flank.

References:

- [Garrett Motion — How a Turbo Works](https://www.garrettmotion.com/it/turbocharger-technology/how-a-turbo-works/basic/)
- [Cummins — How a Turbocharger Works](https://www.cummins.com/en-apac/components/turbochargers/how-a-turbocharger-works)
- [Magnuson — Supercharging FAQ](https://magnusonsuperchargers.com/pages/magnuson-101-supercharging-faq-for-beginners)

No analytics, accounts or backend. Language and theme are kept in `localStorage`
when available.
