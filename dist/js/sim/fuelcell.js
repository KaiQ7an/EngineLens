// A proton-exchange-membrane fuel cell: 2 H₂ + O₂ → 2 H₂O, with no burning.
// At the anode each H₂ splits into two protons and two electrons; the protons cross
// the membrane, the electrons take the outside circuit, and at the cathode they all
// meet oxygen to make water.
export function reaction(h2) {
  return { o2: h2 / 2, water: h2, protons: 2 * h2, electrons: 2 * h2 };
}

// Where a particle is in its journey (0 → 1), for drawing: hydrogen comes in on the
// left, protons cross the middle, electrons go round the top, water leaves on the right.
export const STAGES = ['hydrogen', 'split', 'cross', 'water'];
export const stageAt = f => STAGES[Math.min(3, Math.floor(((f % 1) + 1) % 1 * 4))];
