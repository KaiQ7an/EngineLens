import { steadyBoost } from './induction.js';

// Twincharging, as in Volkswagen's 1.4 TSI: a clutch-driven supercharger feeds a turbo.
// Down low the supercharger supplies the boost; as the turbo comes in, the clutch
// lets go and a bypass valve routes air around the idle blower. Illustrative values.
export const HANDOVER = 3800; // rpm above which the supercharger is disengaged: the turbo alone reaches TARGET
export const TARGET = 0.85;   // bar the combined system aims for

export const superchargerOn = rpm => rpm < HANDOVER;
export function twinBoost(rpm) {
  const turbo = steadyBoost('turbo', rpm);
  if (!superchargerOn(rpm)) return turbo;
  // In series the supercharger tops up whatever the turbo cannot yet supply.
  return Math.min(TARGET, turbo + steadyBoost('super', rpm) * (1 - turbo / TARGET));
}
export const shares = rpm => {
  const total = twinBoost(rpm), turbo = Math.min(total, steadyBoost('turbo', rpm));
  return { total, turbo, super: total - turbo };
};

// Spin-up after flooring the throttle: an electric motor gets the compressor turning
// without waiting for exhaust, so its time constant is far shorter than a turbo's.
export const SPOOL = { turbo: 1.25, electric: 0.25 };
export const spool = (kind, t) => (t <= 0 ? 0 : 1 - Math.exp(-t / SPOOL[kind]));
