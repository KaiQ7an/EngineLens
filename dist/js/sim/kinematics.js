// Crank angle θ is in degrees. θ = 0 is top dead centre (TDC) at the start of the
// intake stroke, and one four-stroke cycle spans 720° (two crank revolutions).
export const CYCLE = 720;
export const STROKES = ['intake', 'compression', 'power', 'exhaust'];

export const wrap = (a, m = CYCLE) => ((a % m) + m) % m;
const rad = d => d * Math.PI / 180;

// Slider-crank geometry: distance from the crank centre to the piston pin.
export function pinHeight(theta, r, l) {
  const s = Math.sin(rad(theta));
  return r * Math.cos(rad(theta)) + Math.sqrt(l * l - r * r * s * s);
}

// How far the piston has dropped below TDC: 0 at TDC, 2r at bottom dead centre.
export const pistonDrop = (theta, r, l) => r + l - pinHeight(theta, r, l);

export const strokeIndex = theta => Math.floor(wrap(theta) / 180);
export const strokeAt = theta => STROKES[strokeIndex(theta)];
// Progress through the current stroke, 0 → 1.
export const strokeProgress = theta => (wrap(theta) % 180) / 180;

// Teaching valve timing: each valve stays open for 230° of crank rotation and
// both are open for 20° around the exhaust TDC (valve overlap).
export const VALVES = {
  intake: { centre: 105, duration: 230 },
  exhaust: { centre: 615, duration: 230 }
};

// Valve lift from 0 (closed) to 1 (fully open).
export function valveLift(theta, kind) {
  const { centre, duration } = VALVES[kind];
  const d = wrap(theta - centre + 360) - 360;
  if (Math.abs(d) >= duration / 2) return 0;
  return Math.cos(Math.PI * d / duration) ** 2;
}

export const valvesOverlap = theta => valveLift(theta, 'intake') > 0 && valveLift(theta, 'exhaust') > 0;

// The spark fires 10° before the compression TDC at 360°.
export const SPARK = 350;
export const sparkGlow = theta => {
  const d = wrap(theta) - SPARK;
  return d >= 0 && d < 18 ? 1 - d / 18 : 0;
};

// Brightness of the burning charge: peaks just after TDC, fades by the end of the power stroke.
export function burnGlow(theta) {
  const a = wrap(theta);
  if (a < SPARK || a >= 540) return 0;
  if (a < 370) return (a - SPARK) / 20;
  return Math.max(0, 1 - (a - 370) / 150);
}

// The camshaft turns once for every two crank revolutions.
export const camAngle = theta => theta / 2;
