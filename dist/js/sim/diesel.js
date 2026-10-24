import { wrap, pistonDrop } from './kinematics.js';

// A diesel runs the same four strokes but breathes air alone, squeezes it far harder,
// and lights the fuel by heat instead of a spark. Values are a teaching model.
export const DIESEL_CR = 16;
export const PETROL_CR = 10;
const GAMMA = 1.4, INTAKE_K = 300; // intake air at about 27°C

// Fuel is sprayed in from just before compression TDC until early in the power stroke.
export const INJECT = { from: 352, to: 384 };
export function injection(theta) {
  const a = wrap(theta);
  if (a < INJECT.from || a >= INJECT.to) return 0;
  return Math.sin(Math.PI * (a - INJECT.from) / (INJECT.to - INJECT.from));
}
// The spray lights as soon as it meets the hot air: the burn starts a few degrees in.
export const IGNITE = 358;

// Air temperature in °C while the charge is being squeezed (adiabatic compression),
// from the cylinder volume at crank angle θ. Outside compression it is not modelled.
export function compressionTemp(theta, cr = DIESEL_CR, r = 40, l = 150) {
  const a = wrap(theta);
  if (a < 180 || a > 360) return null;
  const swept = 2 * r, clearance = swept / (cr - 1);
  const volume = clearance + pistonDrop(a, r, l);
  const ratio = (clearance + swept) / volume;
  return INTAKE_K * ratio ** (GAMMA - 1) - 273;
}

// Diesel fuel self-ignites somewhere above about 210°C in air.
export const AUTOIGNITION_C = 210;
