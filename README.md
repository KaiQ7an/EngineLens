# EngineLens

看懂每一口动力。An interactive, bilingual visual guide to how engines breathe.

## Run locally

Requires Node.js 20 or newer. No dependency installation or build step is needed.

```sh
npm run dev
```

Open <http://localhost:5173>. Changes inside `dist/` reload the preview automatically.
Use `PORT=5174 npm run dev` to choose another port.

```sh
npm run check
```

## Experience

- Chinese / English interface with a remembered language preference.
- Animated Canvas 2D schematics of natural aspiration, turbocharging and belt-driven positive-displacement supercharging.
- RPM slider, pause control and illustrative throttle-tip-in response.
- Relative torque comparison and a four-stroke cycle overview.
- A 36-second, three-chapter explainer with bilingual captions, chapter navigation, pause / replay and fullscreen playback. Silent; no export functionality.
- Responsive layout and keyboard-accessible controls. Main animation starts paused when the OS requests reduced motion.

## Files

| File | Purpose |
| --- | --- |
| `dist/index.html` | Page structure |
| `dist/style.css` | Responsive design |
| `dist/app.js` | Translations, mechanical drawing, interaction, charts and film |
| `server.mjs` | Local HTTP server with live reload |

The site is buildless and can be served from `dist/` by a static web server. Google Fonts are optional; system fonts are used if unavailable. No analytics, accounts or backend database are included.

## Model scope

All boost values, torque curves and response timing are conceptual teaching aids, not measured engine data or predictions. The supercharger example is a positive-displacement design; centrifugal superchargers behave differently. The intake and exhaust paths in the turbo schematic are separate and linked mechanically by a shared shaft. Geometries are simplified and not to scale.

Technical references:

- [Garrett Motion — How a Turbo Works](https://www.garrettmotion.com/it/turbocharger-technology/how-a-turbo-works/basic/)
- [Cummins — How a Turbocharger Works](https://www.cummins.com/en-apac/components/turbochargers/how-a-turbocharger-works)
- [Magnuson — Supercharging FAQ](https://magnusonsuperchargers.com/pages/magnuson-101-supercharging-faq-for-beginners)

## Validation

Check JavaScript syntax with `npm run check`. In the browser, verify each induction mode, the RPM range, tip-in response, animation pause, language switching, film chapters and replay. Check both a narrow viewport and desktop width. Playback fullscreen depends on browser support and an explicit user click.
