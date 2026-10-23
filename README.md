# EngineLens

看懂每一口动力 — interactive, bilingual (中文 / English) lessons on how engines work,
for people who love racing but have never opened an engine.

Every lesson puts a live blueprint cutaway top-left and walks through it one step
at a time. Air is drawn as dots you can count: a turbo visibly packs more into the
same cylinder.

## Lessons

| Round | Lesson | What you see |
| --- | --- | --- |
| 1 · How an engine turns | Four-stroke | One cylinder, cams and valves on a 720° cycle dial |
| 2 · How the air gets in | Naturally aspirated | The atmosphere pushing air past the throttle |
| | Turbocharged | Exhaust spinning the turbine, boost, intercooler, wastegate, lag |
| | Supercharged | Belt-driven Roots blower and the power it takes |
| | Floor-it test | Three 2.0-litre engines floored together, at sea level or 3,650 m |
| 3 · How the cylinders line up | Inline-four | Firing order 1-3-4-2, secondary shake and balance shafts |
| | V8 | Cross-plane vs flat-plane: crank shape, per-bank firing rhythm |

Rounds 3–6 (inline-six, V6, V12, boxer, diesel, rotary, hybrids, EVs, fuel cells and
the 2026 F1 power unit) appear on the learning route as coming soon.

Each lesson has a guided mode that pauses on every step, tappable parts with
numbered callouts, strengths and trade-offs, cars you may know (tagged by layout and
induction), and one common myth explained. Underlined terms open a glossary.

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
  js/sim/               pure, tested models: crank and valve timing, firing orders, boost
  js/draw/              canvas views, all drawn from a single crank angle
  js/data/              lesson copy, cars and glossary as [中文, English] pairs
  js/ui/                lesson page, home and learning route, glossary, term tooltips
tests/sim.test.js       node:test checks on the models
```

Every moving part is derived from one crank angle θ, so slowing down, pausing or
stepping never shows an impossible position. Piston motion uses the slider-crank
equation; valves follow a timing with 20° of overlap; the V8 crank throws are checked
against the firing order in the tests.

To add a lesson: write its model (if new) in `js/sim/`, a view in `js/draw/` and
register it in `js/draw/views.js`, then add its copy to `js/data/lessons.js`.

## Model notes

Figures are schematic and not to scale. Boost, air charge, power and the floor-it
curves are teaching models with physically motivated shapes, not data for any real
engine. The supercharger shown is a positive-displacement (Roots) type; centrifugal
superchargers behave differently. The V8 firing orders are examples: GM's LS-family
order for the cross-plane crank and a typical alternating order for the flat-plane.

References:

- [Garrett Motion — How a Turbo Works](https://www.garrettmotion.com/it/turbocharger-technology/how-a-turbo-works/basic/)
- [Cummins — How a Turbocharger Works](https://www.cummins.com/en-apac/components/turbochargers/how-a-turbocharger-works)
- [Magnuson — Supercharging FAQ](https://magnusonsuperchargers.com/pages/magnuson-101-supercharging-faq-for-beginners)

No analytics, accounts or backend. Language, theme and lesson progress are kept in
`localStorage` when available.
