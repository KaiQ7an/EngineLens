// A three-phase motor. Three coil sets sit 120° apart around the stator, each fed a
// current 120° out of step with the next; together they make a field of constant
// strength that turns. Angles are electrical, in radians; one pole pair is drawn.
const TAU = Math.PI * 2;
export const COIL_AXES = [0, TAU / 3, 2 * TAU / 3];

export const phaseCurrents = e => COIL_AXES.map(axis => Math.cos(e - axis));

// The stator field: each coil pushes along its own axis in proportion to its current.
export function field(e) {
  const i = phaseCurrents(e);
  const x = i.reduce((s, v, k) => s + v * Math.cos(COIL_AXES[k]), 0);
  const y = i.reduce((s, v, k) => s + v * Math.sin(COIL_AXES[k]), 0);
  return { angle: Math.atan2(y, x), strength: Math.hypot(x, y) };
}

// A permanent-magnet rotor turns in step with the field. Driving, it trails the field
// by the load angle; regenerating, the wheels push it ahead and it becomes a generator.
export const LOAD_ANGLE = 25 * Math.PI / 180;
export const rotorAngle = (e, mode = 'drive') => e + (mode === 'regen' ? LOAD_ANGLE : -LOAD_ANGLE);
