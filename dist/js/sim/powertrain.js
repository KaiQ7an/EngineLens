// Energy paths of a hybrid or range-extender drivetrain, mode by mode. Each flow runs
// from its first component to its second; `battery` is +1 charging, -1 discharging.
export const FLOWS = {
  fuel: ['tank', 'engine'], 'engine-gen': ['engine', 'generator'], 'engine-wheels': ['engine', 'wheels'],
  'gen-battery': ['generator', 'battery'], 'gen-motor': ['generator', 'motor'],
  'battery-motor': ['battery', 'motor'], 'motor-battery': ['motor', 'battery'],
  'motor-wheels': ['motor', 'wheels'], 'wheels-motor': ['wheels', 'motor'], 'plug-battery': ['plug', 'battery']
};

export const MODES = {
  // Electric only: the battery drives the motor; the engine is off.
  ev: { flows: ['battery-motor', 'motor-wheels'], engine: false, clutch: false, battery: -1, speed: 30 },
  // Series: the engine only turns the generator; the motor drives the wheels.
  series: { flows: ['fuel', 'engine-gen', 'gen-motor', 'battery-motor', 'motor-wheels'], engine: true, clutch: false, battery: -1, speed: 60 },
  // Range extender running: the generator feeds the motor and tops up the battery.
  extend: { flows: ['fuel', 'engine-gen', 'gen-motor', 'gen-battery', 'motor-wheels'], engine: true, clutch: false, battery: 1, speed: 80 },
  // Parallel: a clutch lets the engine drive the wheels directly; the motor can help.
  parallel: { flows: ['fuel', 'engine-wheels', 'battery-motor', 'motor-wheels'], engine: true, clutch: true, battery: -1, speed: 110 },
  // Regenerative braking: the wheels turn the motor, which charges the battery.
  regen: { flows: ['wheels-motor', 'motor-battery'], engine: false, clutch: false, battery: 1, speed: 45 },
  // Parked and plugged in.
  plug: { flows: ['plug-battery'], engine: false, clutch: false, battery: 1, speed: 0 }
};

// Which components are doing something in a mode: anything a flow starts or ends at.
export function active(mode) {
  const on = new Set();
  for (const f of MODES[mode].flows) FLOWS[f].forEach(c => on.add(c));
  return on;
}
