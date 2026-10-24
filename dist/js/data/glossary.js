// Plain-language definitions. Lesson copy links to them with [[id|shown text]].
export const GLOSSARY = [
  { id: 'displacement', name: ['排量', 'Displacement'], text: ['所有活塞从上止点走到下止点扫过的空间加起来。"2.0T" 里的 2.0 就是它，单位是升。', 'The total space all the pistons sweep from top to bottom. The "2.0" in "2.0T" is this, in litres.'] },
  { id: 'tdc', name: ['上止点', 'Top dead centre (TDC)'], text: ['活塞走到最高点、准备掉头往下的那一刻。', 'The moment the piston reaches the top and turns back down.'] },
  { id: 'bdc', name: ['下止点', 'Bottom dead centre (BDC)'], text: ['活塞走到最低点、准备掉头往上的那一刻。', 'The moment the piston reaches the bottom and turns back up.'] },
  { id: 'compression-ratio', name: ['压缩比', 'Compression ratio'], text: ['活塞在最低点和最高点时，缸内空间相差几倍。普通汽油机大约 10–13 倍，柴油机更高。', 'How many times bigger the cylinder space is with the piston at the bottom than at the top. Around 10–13 for petrol engines, higher for diesels.'] },
  { id: 'afr', name: ['空燃比', 'Air-fuel ratio'], text: ['空气和燃油的质量比例。汽油完全燃烧大约要 14.7 份空气配 1 份油，所以想多烧油，就得先多进空气。', 'The mass ratio of air to fuel. Petrol burns completely at about 14.7 parts air to 1 part fuel, so burning more fuel means getting more air in first.'] },
  { id: 'torque', name: ['扭矩', 'Torque'], text: ['发动机"拧"的力气，决定你踩下油门时的推背感。单位是牛·米（N·m）。', 'How hard the engine twists. It is the shove you feel when you press the throttle. Measured in N·m.'] },
  { id: 'power', name: ['功率（马力）', 'Power (horsepower)'], text: ['扭矩乘以转速：同样的力气，转得越快，做功越快。它决定了车能跑多快。', 'Torque times engine speed: the same twist, delivered faster. It decides how fast the car can go.'] },
  { id: 'rpm', name: ['转速（rpm）', 'Engine speed (rpm)'], text: ['曲轴每分钟转多少圈。家用车怠速约 800 转，F1 发动机能转到一万多转。', 'Crank revolutions per minute. A road car idles around 800 rpm; an F1 engine spins past 10,000.'] },
  { id: 'redline', name: ['红线', 'Redline'], text: ['转速表上的红色区域，发动机允许的最高转速。', 'The red zone on the tachometer: the highest speed the engine is allowed to run.'] },
  { id: 'firing-order', name: ['点火顺序', 'Firing order'], text: ['多缸发动机里各缸轮流点火的先后次序，比如直列四缸常见的 1-3-4-2。它影响平顺性和声音。', 'The order the cylinders take turns firing, such as 1-3-4-2 in many inline-fours. It shapes smoothness and sound.'] },
  { id: 'boost', name: ['增压值', 'Boost'], text: ['进气被压到比外面大气压高出多少，常用 bar 表示。+1.0 bar 大约就是两倍大气压。', 'How far above outside air pressure the intake is pushed, usually in bar. +1.0 bar is roughly twice atmospheric pressure.'] },
  { id: 'lag', name: ['涡轮迟滞', 'Turbo lag'], text: ['踩下油门后，涡轮要等废气把它吹快才有增压，这段"慢半拍"就是迟滞。', 'The delay after you press the throttle while exhaust gas spins the turbo up to speed.'] },
  { id: 'intercooler', name: ['中冷器', 'Intercooler'], text: ['空气被压缩会变热，热空气稀。中冷器像个散热片，把它降温变密，再送进发动机。', 'Compressing air heats it, and hot air is thin. The intercooler is a radiator that cools and densifies it before the engine.'] },
  { id: 'wastegate', name: ['废气旁通阀', 'Wastegate'], text: ['增压够了就打开，让一部分废气绕过涡轮，防止增压过高。', 'Opens once boost is high enough, letting some exhaust bypass the turbine so boost does not climb too far.'] },
  { id: 'bov', name: ['泄压阀', 'Blow-off valve'], text: ['松油门时节气门突然关上，压缩好的空气没处去，就从这里放掉。"呲"的一声就是它。', 'When the throttle snaps shut, the pressurised air has nowhere to go and escapes here. That "pssh" is this valve.'] },
  { id: 'valve-overlap', name: ['气门重叠', 'Valve overlap'], text: ['排气快结束时进气门已经开始打开，两个门同时开着一小会儿，利用气流把废气"带"出去。', 'Near the end of exhaust the intake valve starts opening, so both are open briefly and the moving gas helps scavenge the cylinder.'] },
  { id: 'balance-shaft', name: ['平衡轴', 'Balance shaft'], text: ['带偏心配重、跟着曲轴转的轴，用来抵消发动机天生的抖动。', 'A shaft with offset weights that turns with the crank to cancel out vibration the engine makes by design.'] },
  { id: 'compression-ignition', name: ['压燃', 'Compression ignition'], text: ['不用火花塞，靠把空气压到滚烫，让喷进来的燃油自己着火。柴油机就是这样点火的。', 'No spark plug: the air is squeezed until it is hot enough to light the fuel sprayed into it. It is how diesels ignite.'] },
  { id: 'regen', name: ['动能回收', 'Regenerative braking'], text: ['减速时让电机反过来当发电机，把车的动能变成电存进电池，而不是全变成刹车片上的热。', 'Slowing down by running the motor as a generator, so the car\'s energy goes back into the battery instead of turning into brake heat.'] },
  { id: 'inverter', name: ['电控（逆变器）', 'Inverter'], text: ['把电池的直流电变成电机要的三相交流电，并控制电机转多快、出多大力。', 'Turns the battery\'s direct current into the three-phase current a motor needs, and controls its speed and torque.'] },
  { id: 'phev', name: ['插电混动（PHEV）', 'Plug-in hybrid (PHEV)'], text: ['电池更大、可以插电充电的混动车，日常短途可以基本只用电。', 'A hybrid with a bigger battery you can charge from a plug, so short daily trips can be almost all electric.'] },
  { id: 'mgu-k', name: ['MGU-K', 'MGU-K'], text: ['F1 动力单元里和曲轴相连的电机：刹车时发电，加速时出力。2026 年起最大 350 kW。', 'The F1 power unit\'s motor-generator geared to the crankshaft: it harvests under braking and pushes under acceleration, up to 350 kW from 2026.'] },
  { id: 'mgu-h', name: ['MGU-H', 'MGU-H'], text: ['2014–2025 年 F1 动力单元里装在涡轮轴上的电机，能从废气回收能量、消除涡轮迟滞。2026 年取消。', 'The motor-generator on the turbo shaft of 2014–2025 F1 power units; it recovered exhaust energy and removed turbo lag. Dropped in 2026.'] },
  { id: 'parasitic', name: ['驱动损失', 'Parasitic loss'], text: ['机械增压器靠曲轴带动，所以要"吃掉"发动机的一部分动力。', 'A supercharger is driven by the crank, so it eats some of the engine\'s own power.'] }
];

export const termById = id => GLOSSARY.find(g => g.id === id);
