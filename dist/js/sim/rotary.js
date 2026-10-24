// Wankel rotary geometry. The housing is an epitrochoid; the rotor's centre orbits the
// eccentric shaft's centre at eccentricity e while the rotor itself turns at a third of
// the shaft speed, which keeps its three apexes on the housing wall. Angles in radians.
export const ROTOR = { R: 1, e: 0.15 }; // e/R close to Mazda's 13B (105 mm, 15 mm)
const TAU = Math.PI * 2;
const wrap2 = a => ((a % TAU) + TAU) % TAU;

export const housing = (alpha, { R, e } = ROTOR) => [e * Math.cos(3 * alpha) + R * Math.cos(alpha), e * Math.sin(3 * alpha) + R * Math.sin(alpha)];
export const rotorCentre = (phi, { e } = ROTOR) => [e * Math.cos(phi), e * Math.sin(phi)];
export const rotorAngle = phi => phi / 3;

// Housing parameter of apex k (0..2): the rotor angle plus a third of a turn per apex.
export const apexAlpha = (phi, k) => rotorAngle(phi) + TAU * k / 3;
export function apex(phi, k, g = ROTOR) {
  const [cx, cy] = rotorCentre(phi, g), a = apexAlpha(phi, k);
  return [cx + g.R * Math.cos(a), cy + g.R * Math.sin(a)];
}

// Each face of the rotor (between apex k and k + 1) carries its own chamber through all
// four strokes in one rotor turn, i.e. three shaft turns. The two waists of the housing
// sit at α = π/2 (ports: exhaust ends, intake begins) and 3π/2 (spark plugs).
export const STROKES = ['intake', 'compression', 'power', 'exhaust'];
export const faceMid = (phi, k) => apexAlpha(phi, k) + Math.PI / 3;
export const faceStroke = (phi, k) => Math.floor(wrap2(faceMid(phi, k) - Math.PI / 2) / (Math.PI / 2)) % 4;
// Progress through the current stroke, 0 → 1.
export const faceProgress = (phi, k) => (wrap2(faceMid(phi, k) - Math.PI / 2) % (Math.PI / 2)) / (Math.PI / 2);

// The rotor flank bulges outward; this is the bulge used for drawing and for volume.
export const FLANK_BULGE = 0.14;
export function flankPoint(phi, k, u, g = ROTOR) {
  const p = apex(phi, k, g), q = apex(phi, (k + 1) % 3, g), [cx, cy] = rotorCentre(phi, g);
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, d = Math.hypot(mx - cx, my - cy);
  const bulge = 4 * FLANK_BULGE * g.R * u * (1 - u);
  return [p[0] + (q[0] - p[0]) * u + (mx - cx) / d * bulge, p[1] + (q[1] - p[1]) * u + (my - cy) / d * bulge];
}

// Area of the chamber between face k and the housing wall (shoelace formula).
export function chamberArea(phi, k, g = ROTOR, n = 48) {
  const a0 = apexAlpha(phi, k), a1 = a0 + TAU / 3, pts = [];
  for (let i = 0; i <= n; i++) pts.push(housing(a0 + (a1 - a0) * i / n, g));
  for (let i = n; i >= 0; i--) pts.push(flankPoint(phi, k, i / n, g));
  let s = 0;
  for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += x1 * y2 - x2 * y1; }
  return Math.abs(s) / 2;
}
