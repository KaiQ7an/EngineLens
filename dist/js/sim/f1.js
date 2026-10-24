// The F1 power unit, 2014–2025 against 2026. MGU-K power is set by the rules
// (120 kW, then 350 kW); combustion-engine power is not published, so those
// figures are approximate (the FIA quotes about 400 kW for 2026).
export const ERAS = {
  2026: { ice: 400, k: 350, mguH: false, label: '2026' },
  2014: { ice: 550, k: 120, mguH: true, label: '2014–2025' }
};
export const electricShare = era => ERAS[era].k / (ERAS[era].ice + ERAS[era].k);

// One stylised lap as zones along the distance p (0 → 1). On straights and corner
// exits the battery deploys through the MGU-K; in braking zones it harvests.
export const LAP = [
  { to: 0.16, zone: 'deploy' }, { to: 0.22, zone: 'top' }, { to: 0.30, zone: 'brake' }, { to: 0.37, zone: 'corner' },
  { to: 0.50, zone: 'deploy' }, { to: 0.56, zone: 'brake' }, { to: 0.63, zone: 'corner' }, { to: 0.80, zone: 'deploy' },
  { to: 0.86, zone: 'top' }, { to: 0.93, zone: 'brake' }, { to: 1, zone: 'corner' }
];
const wrap1 = p => ((p % 1) + 1) % 1;
export function zoneAt(p) {
  const x = wrap1(p);
  const i = LAP.findIndex(z => x < z.to);
  return { ...LAP[i], from: i ? LAP[i - 1].to : 0, index: i };
}

// A smooth speed trace (km/h) through the zones, for drawing only.
const KNOTS = [[0, 150], [0.16, 300], [0.22, 320], [0.30, 110], [0.37, 120], [0.50, 270], [0.56, 95], [0.63, 110], [0.80, 305], [0.86, 330], [0.93, 100], [1, 150]];
export function speedAt(p) {
  const x = wrap1(p);
  const i = KNOTS.findIndex(([q]) => q > x);
  const [x0, v0] = KNOTS[i - 1], [x1, v1] = KNOTS[i];
  const f = (x - x0) / (x1 - x0), s = f * f * (3 - 2 * f);
  return v0 + (v1 - v0) * s;
}

// Electrical flow in each zone: +1 deploying to the wheels, -1 harvesting, 0 idle.
// Near top speed deployment tails off, so the flow there is weaker.
export const FLOW = { deploy: 1, top: 0.4, brake: -1, corner: 0.2 };
