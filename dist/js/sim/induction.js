// Educational models of how much air each induction system delivers. The shapes are
// physically motivated, but every number is illustrative, not data for a real engine.

export const P_SEA = 1.013; // ambient pressure at sea level, bar absolute
export const ALTITUDES = {
  sea: { metres: 0, pressure: P_SEA },
  high: { metres: 3650, pressure: 0.645 } // roughly Lhasa, standard atmosphere
};

// Steady boost (bar above ambient) at full throttle across engine speed.
export function steadyBoost(mode, rpm) {
  if (!Number.isFinite(rpm)) throw new RangeError('RPM must be finite');
  if (rpm <= 0) return 0;
  if (mode === 'na') return -0.03;
  if (mode === 'turbo') return Math.min(0.85, Math.max(0, (rpm - 1500) / 2300) * 0.85);
  return Math.max(0, Math.min(0.7, 0.38 + (rpm - 1000) / 5500 * 0.32)) * Math.min(1, rpm / 800);
}

// The wastegate opens once the turbo reaches its boost limit.
export const wastegateOpen = rpm => steadyBoost('turbo', rpm) >= 0.85;

// Fraction of steady boost reached t seconds after flooring the throttle.
export function tipIn(mode, t) {
  if (mode === 'turbo') return (1 - Math.exp(-Math.max(0, t) / 0.9)) ** 2;
  // Direct mechanical drive has no turbine spool-up delay. Manifold filling is separate.
  if (mode === 'super') return 1;
  return 1;
}

// Air packed into the cylinder per cycle, relative to a naturally aspirated engine.
export const airCharge = boost => (P_SEA + boost) / (P_SEA - 0.03);

// ── Throttle experiment ─────────────────────────────────────────────
// Three 2.0-litre engines hold a fixed speed. At t = 0 the throttle snaps fully open.

const CRUISE = 0.35;      // manifold pressure / ambient at part throttle
const FULL = 0.97;        // manifold pressure / ambient at full throttle, no boost
const BLOWER_RATIO = 1.5; // a positive-displacement blower multiplies pressure by a fixed ratio
const TURBO_TARGET = 1.8; // bar absolute the wastegate holds
const TURBO_MAX_RATIO = 2.6;

const fill = (t, tau) => (t <= 0 ? 0 : 1 - Math.exp(-t / tau));

// Absolute intake manifold pressure, bar.
export function manifold(mode, t, ambient = P_SEA) {
  const breathing = ambient * (CRUISE + (FULL - CRUISE) * fill(t, 0.08));
  if (mode === 'na') return breathing;
  if (mode === 'super') return ambient * (CRUISE + (FULL * BLOWER_RATIO - CRUISE) * fill(t, 0.15));
  // A turbo engine breathes like a naturally aspirated one until exhaust flow spools the
  // turbine up. Thin air at altitude means it must spin faster, so it takes longer.
  const target = Math.min(TURBO_TARGET, TURBO_MAX_RATIO * ambient * FULL);
  const spool = fill(t - 0.1, 0.9 * Math.sqrt(P_SEA / ambient));
  return breathing + Math.max(0, target - ambient * FULL) * spool ** 2;
}

export const gauge = (mode, t, ambient = P_SEA) => manifold(mode, t, ambient) - ambient;

// Power the blower takes from the crankshaft, in the same units as power().
export function parasitic(mode, t, ambient = P_SEA) {
  if (mode !== 'super') return 0;
  const ratio = manifold(mode, t, ambient) / (ambient * FULL);
  return Math.max(0, 0.22 * (ratio - 1) * ambient / P_SEA);
}

// Net power relative to the naturally aspirated engine at sea level, full throttle.
// Turbo engines run a little less compression, so off boost they make slightly less.
export function power(mode, t, ambient = P_SEA) {
  const air = manifold(mode, t, ambient) / (P_SEA * FULL);
  if (mode === 'turbo') return air * 0.95;
  return air - parasitic(mode, t, ambient);
}
