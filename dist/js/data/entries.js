// Lesson content. Copy is [中文, English]. Steps with `at` are moments in the crank
// cycle (degrees); steps without it are a chain of cause and effect the guide walks
// through on a timer. `focus` names the parts the step puts under the lens.

export const CHAPTERS = [
  { n: 1, title: ['发动机怎么转', 'How an engine turns'], core: ['先看懂一个缸：它怎么吸气、出力、排气。', 'Start with one cylinder: how it breathes in, makes power and breathes out.'] },
  { n: 2, title: ['空气怎么进', 'How the air gets in'], core: ['发动机有多大劲，看每次能烧多少油；油要配够空气才能烧。三种方式，都在回答"怎么塞进更多空气"。', 'Power depends on how much fuel each cycle can burn, and fuel needs air to burn. All three answer one question: how do you get more air in?'] },
  { n: 3, title: ['气缸怎么排', 'How the cylinders line up'], core: ['一个缸不够用，就排一排、排成 V。怎么排，决定了它的体积、平顺和声音。', 'One cylinder is never enough. Line them up or fold them into a V: the layout sets size, smoothness and sound.'] },
  { n: 4, title: ['特殊结构', 'Different designs'], core: ['柴油靠压燃，转子没有活塞。', 'Diesels light by compression; rotaries have no pistons.'] },
  { n: 5, title: ['电动化', 'Going electric'], core: ['混动、增程、纯电、氢燃料：电在动力里占多大份量。', 'Hybrid, range extender, battery, hydrogen: how much of the work electricity does.'] },
  { n: 6, title: ['F1 动力单元', 'The F1 power unit'], core: ['1.6 升 V6 涡轮加大功率电机，油电大约各占一半。', 'A 1.6-litre turbo V6 plus a powerful motor, splitting the work roughly half and half.'] }
];

// Lessons that are planned but not built yet, shown on the route as "coming soon".
export const UPCOMING = [
  { chapter: 2, title: ['双增压与电动增压', 'Twincharging & e-boost'] },
  { chapter: 3, title: ['直列六缸', 'Inline-six'] }, { chapter: 3, title: ['V6', 'V6'] }, { chapter: 3, title: ['V12', 'V12'] },
  { chapter: 3, title: ['W16 / V16', 'W16 / V16'] }, { chapter: 3, title: ['水平对置', 'Boxer'] },
  { chapter: 4, title: ['柴油', 'Diesel'] }, { chapter: 4, title: ['转子', 'Rotary'] },
  { chapter: 5, title: ['混合动力', 'Hybrid'] }, { chapter: 5, title: ['增程', 'Range extender'] },
  { chapter: 5, title: ['纯电电机', 'Electric motor'] }, { chapter: 5, title: ['氢燃料电池', 'Fuel cell'] },
  { chapter: 6, title: ['2026 F1 动力单元', '2026 F1 power unit'] }
];

const tags = {
  inline: ['直列', 'Inline'], i3: ['直列三缸', 'Inline-3'], i4: ['直列四缸', 'Inline-4'], v6: ['V6', 'V6'], v8: ['V8', 'V8'], v8cross: ['V8 十字曲轴', 'Cross-plane V8'], v8flat: ['V8 平面曲轴', 'Flat-plane V8'],
  flat6: ['水平对置六缸', 'Flat-6'],
  na: ['自然吸气', 'Naturally aspirated'], turbo: ['涡轮', 'Turbo'], twin: ['双涡轮', 'Twin-turbo'], sc: ['机械增压', 'Supercharged'],
  turboHybrid: ['涡轮 + 电机', 'Turbo + motor']
};

export const LESSONS = [
  {
    id: 'four-stroke', chapter: 1, no: '1.1', view: 'fourStroke', kind: 'crank', next: 'na',
    eyebrow: 'HOW IT BREATHES',
    title: ['四冲程：发动机的一呼一吸', 'Four-stroke: how an engine breathes'],
    card: ['吸气、压缩、点火、排气。', 'Intake, compression, power, exhaust.'],
    lead: ['吸气、压缩、点火、排气：曲轴转两圈，这个缸出一次力。街上的汽油车、赛道上的 F1，都是这样转起来的。',
      'Intake, compression, power, exhaust: two turns of the crank, one push from the cylinder. Road cars and F1 cars alike run on this cycle.'],
    analogy: ['像起跑前那一口气：先深吸，憋住，猛地发力，再呼出去。图里每个小点代表一团空气，数一数，就知道吸进了多少。',
      'Like the breath before a sprint start: in, hold, explode, out. Each dot in the animation is a parcel of air, so you can count what goes in.'],
    steps: [
      { at: 90, until: 180, title: ['进气', 'Intake'], text: ['活塞往下走，缸里空出位置。进气门打开，新鲜空气（随后混入燃油）涌进来。', 'The piston drops and the intake valve opens. Fresh air rushes in to fill the space, and fuel joins it.'], focus: ['intake-valve', 'piston', 'intake-port'] },
      { at: 270, until: 350, title: ['压缩', 'Compression'], text: ['两个气门都关上，活塞往上顶，把空气挤进原来大约十分之一的空间。挤得越紧，等会儿推得越狠。', 'Both valves shut and the piston rises, squeezing the charge into about a tenth of the space. The tighter the squeeze, the harder the push to come.'], focus: ['chamber', 'piston'] },
      { at: 380, until: 540, title: ['做功', 'Power'], text: ['火花塞点火，混合气瞬间燃烧膨胀，把活塞狠狠推下去。四步里只有这一步在出力。', 'The spark plug fires. The burning mixture expands and slams the piston down. Only this one stroke makes power.'], focus: ['spark', 'chamber', 'piston'] },
      { at: 630, until: 720, title: ['排气', 'Exhaust'], text: ['排气门打开，活塞再往上走，把烧完的热废气推出去，给下一口新鲜空气腾地方。', 'The exhaust valve opens and the rising piston pushes the hot burnt gas out, clearing room for the next breath.'], focus: ['exhaust-valve', 'exhaust-port', 'piston'] }
    ],
    parts: {
      'intake-valve': { name: ['进气门', 'Intake valve'], text: ['空气的入口。只在吸气时打开，由上方的凸轮轴准时推开。', 'The way in for air. It opens only for intake, pushed open on time by the camshaft above.'] },
      'exhaust-valve': { name: ['排气门', 'Exhaust valve'], text: ['废气的出口，排气时打开。它泡在几百摄氏度的废气里工作。', 'The way out for exhaust. It opens for the exhaust stroke and works in gas hundreds of degrees hot.'] },
      spark: { name: ['火花塞', 'Spark plug'], text: ['活塞快到顶时打出一个电火花，点燃混合气。点火早几度、晚几度，动力都会明显不同。', 'It fires a spark just before the piston reaches the top. A few degrees early or late makes a real difference to power.'] },
      cams: { name: ['凸轮轴', 'Camshafts'], text: ['两根带凸起的轴，转到凸起时就把气门推开。它们只有曲轴一半的转速，因为每个气门两圈才开一次。', 'Two shafts with lobes that push the valves open. They turn at half crank speed, because each valve opens once every two turns.'] },
      piston: { name: ['活塞', 'Piston'], text: ['在缸里上下跑的"拳头"。燃烧的力量就推在它的顶上。', 'The fist that runs up and down the cylinder. Combustion pushes on its crown.'] },
      rod: { name: ['连杆', 'Connecting rod'], text: ['连接活塞和曲轴，把"往下推"传给曲轴。', 'Links the piston to the crank and passes the push down to it.'] },
      crank: { name: ['曲轴', 'Crankshaft'], text: ['把上下运动变成旋转：就像踩自行车，腿上下用力，脚踏却在转圈。', 'Turns up-and-down into rotation, like pedalling a bike: your legs push down, the pedals go round.'] },
      chamber: { name: ['燃烧室', 'Combustion chamber'], text: ['活塞顶和缸盖之间的空间。颜色代表气体正在经历什么：蓝是新鲜空气，紫是被压缩，黄是燃烧，橙是热废气。', 'The space above the piston. Its colour tells you what the gas is doing: blue fresh, violet squeezed, yellow burning, orange exhaust.'] }
    },
    pros: [
      ['效率高、省油，每一步都有专门的时间去做好。', 'Efficient: each job gets its own stroke.'],
      ['排放比二冲程干净得多，所以几乎所有汽车都用它。', 'Far cleaner than a two-stroke, which is why nearly every car uses it.'],
      ['能从怠速一路转到上万转：F1 引擎也是四冲程。', 'It can run from idle to well over 10,000 rpm. F1 engines are four-strokes too.']
    ],
    cons: [
      ['四步里只有一步出力，所以要靠多个缸接力才够平顺。', 'Only one stroke in four makes power, so it takes several cylinders taking turns to run smoothly.'],
      ['气门、凸轮轴、正时机构，零件多。', 'Valves, camshafts, timing gear: lots of parts.'],
      ['曲轴两圈才出一次力，同排量下单缸的"爆发次数"比二冲程少一半。', 'One power stroke every two turns: half as many as a two-stroke of the same size.']
    ],
    cars: [
      { name: ['丰田卡罗拉燃油版', 'Toyota Corolla (petrol)'], engine: ['排量与缸数因市场而异', 'Engine varies by market'], tags: [tags.inline, tags.na], why: ['街上最常见的四冲程家用车之一。', 'One of the most common four-stroke family cars on the road.'] },
      { name: ['马自达 MX-5', 'Mazda MX-5'], engine: ['2.0 Skyactiv-G', '2.0 Skyactiv-G'], tags: [tags.i4, tags.na], why: ['轻巧的后驱跑车，四冲程最纯粹的样子。', 'A light rear-drive roadster: the four-stroke at its purest.'] },
      { name: ['F1 赛车', 'Formula 1 car'], engine: ['1.6 升 V6 涡轮 + 电机（2026 规则）', '1.6 L V6 turbo + motor (2026 rules)'], tags: [tags.v6, tags.turboHybrid], why: ['顶级赛车的内燃机，转的也是这四步。', 'The top of motorsport still runs these same four strokes.'] }
    ],
    myth: {
      q: ['"排量 2.0" 到底是什么？', 'What does "2.0 litres" actually mean?'],
      a: ['活塞从最高点（上止点）走到最低点（下止点）扫过的空间，乘以缸数。2.0 升的四缸，每个缸扫过约 0.5 升，差不多一瓶矿泉水。', 'It is the space each piston sweeps from top to bottom, times the number of cylinders. A 2.0-litre four sweeps about 0.5 L per cylinder: roughly one bottle of water.']
    }
  },
  {
    id: 'na', chapter: 2, no: '2.1', view: 'na', kind: 'flow', next: 'turbo',
    eyebrow: 'NATURALLY ASPIRATED',
    title: ['自然吸气：靠大气压"推"进来', 'Naturally aspirated: pushed in by the atmosphere'],
    card: ['不加任何帮手，靠自己吸气。', 'No helper: the engine breathes on its own.'],
    lead: ['参数表上写"1.5L""2.0L"的，多半就是它。没有任何增压装置：活塞往下一走，缸里变"空"，外面的大气就把空气压了进来。', 'Most spec sheets reading "1.5L" or "2.0L" mean this. No booster: the piston drops, the cylinder empties, and the air outside pushes its way in.'],
    analogy: ['像用吸管喝饮料：你只是把吸管里的气吸走，真正把饮料压上来的是外面的大气压。', 'Like a drinking straw: you only lower the pressure; the atmosphere is what pushes the drink up.'],
    steps: [
      { title: ['活塞往下走', 'The piston drops'], text: ['活塞下行，缸里的气压变得比外面低一点。', 'As the piston moves down, the pressure in the cylinder falls a little below the air outside.'], focus: ['piston', 'chamber'] },
      { title: ['大气把空气压进来', 'The atmosphere pushes air in'], text: ['外面大约 1 个大气压的空气穿过滤清器，被"推"进缸里。空气不是被吸进去的，是被压进去的。', 'Outside air at about one atmosphere passes the filter and is pushed into the cylinder. Pushed, not sucked.'], focus: ['filter', 'intake-valve'] },
      { title: ['节气门管着进多少', 'The throttle sets how much'], text: ['你踩的油门，其实转的是这片节气门：开得越大，进气越顺，[[power|动力]]越大。', 'The pedal you press turns this throttle plate. The wider it opens, the easier air flows and the more power you get.'], focus: ['throttle'] },
      { title: ['上限：最多一个大气压', 'The limit: one atmosphere'], text: ['不管转多快，它最多只能把缸"装满"到外面的气压。想要更多空气，只能加大[[displacement|排量]]或者转得更快。', 'However fast it spins, it can only fill the cylinder up to outside pressure. For more air you need more displacement or more revs.'], focus: ['chamber'] },
      { title: ['废气直接排掉', 'Exhaust goes straight out'], text: ['烧完的废气又热又快，却从排气管直接排走了。下一课的涡轮，就是要把这份能量用起来。', 'The burnt gas leaves hot and fast, straight out of the exhaust. The turbo in the next lesson puts that energy to use.'], focus: ['exhaust-pipe'] }
    ],
    parts: {
      filter: { name: ['空气滤清器', 'Air filter'], text: ['挡住灰尘和沙粒，保护发动机。', 'Stops dust and grit getting into the engine.'] },
      throttle: { name: ['节气门', 'Throttle'], text: ['一片会转的圆片。你踩油门，就是在转它。', 'A rotating plate. Pressing the pedal turns it.'] },
      'intake-valve': { name: ['进气门', 'Intake valve'], text: ['只在吸气时打开的门。', 'Opens only during intake.'] },
      chamber: { name: ['气缸', 'Cylinder'], text: ['小圈代表空气。自然吸气每次最多吸满一个大气压的量。', 'Rings are air. An NA engine fills it to outside pressure at most.'] },
      piston: { name: ['活塞', 'Piston'], text: ['往下走制造低压，让空气流进来。', 'Moving down makes the low pressure that lets air flow in.'] },
      'exhaust-pipe': { name: ['排气管', 'Exhaust pipe'], text: ['废气从这里直接排走。', 'Exhaust leaves straight through here.'] }
    },
    pros: [
      ['油门反应直接、线性：踩多少就来多少。', 'Direct, linear response: you get what you press for.'],
      ['能转到很高转速，声音清脆，很多车迷就爱这个。', 'Revs high and sounds crisp; many enthusiasts love it for that.'],
      ['结构简单，零件少，更耐用。', 'Simple, fewer parts, durable.']
    ],
    cons: [
      ['同样排量下，力气最小。', 'The least power for its size.'],
      ['到了高原空气稀薄，动力明显下降：海拔每升高 1000 米大约少 10%。', 'Loses power in thin air: roughly 10% per 1,000 m of altitude.'],
      ['想要大动力只能加大排量，车更重也更费油。', 'More power means more displacement, weight and fuel.']
    ],
    cars: [
      { name: ['马自达 MX-5', 'Mazda MX-5'], engine: ['2.0 Skyactiv-G', '2.0 Skyactiv-G'], tags: [tags.i4, tags.na], why: ['轻巧、线性，自吸跑车的入门首选。', 'Light and linear: the classic first NA sports car.'] },
      { name: ['本田 S2000', 'Honda S2000'], engine: ['F20C 2.0', 'F20C 2.0'], tags: [tags.i4, tags.na], why: ['9000 转红线，高转自吸四缸的传奇。', 'A 9,000 rpm redline: a legendary high-revving four.'] },
      { name: ['保时捷 911 GT3', 'Porsche 911 GT3'], engine: ['4.0 水平对置六缸', '4.0 flat-six'], tags: [tags.flat6, tags.na], why: ['当代少数坚持高转自吸的性能车。', 'One of the few modern performance cars still high-revving and NA.'] },
      { name: ['丰田卡罗拉燃油版', 'Toyota Corolla (petrol)'], engine: ['排量因市场而异', 'Engine varies by market'], tags: [tags.inline, tags.na], why: ['身边最常见的自吸家用车。', 'The everyday NA family car.'] }
    ],
    myth: {
      q: ['"自吸更有驾驶乐趣"是真的吗？', 'Are naturally aspirated engines really more fun?'],
      a: ['部分是。没有涡轮要等，踩油门时动力立刻、线性地来，转速越高越有劲，这种手感很多人喜欢。但不一定更快：同排量的涡轮车通常更有力。', 'Partly. With no turbo to wait for, response is instant and linear and it pulls harder as it revs, which many drivers love. But not necessarily faster: a turbo engine of the same size usually makes more power.']
    }
  },
  {
    id: 'turbo', chapter: 2, no: '2.2', view: 'turbo', kind: 'flow', next: 'super',
    eyebrow: 'TURBOCHARGED',
    title: ['涡轮增压：让废气再干一份活', 'Turbocharged: putting exhaust to work'],
    card: ['用废气吹风车，把空气压进去。', 'Exhaust spins a fan that packs air in.'],
    lead: ['车尾的"T"就是它。排出去的废气先吹动一个风车（涡轮），同一根轴上的另一个风车（压气机）把空气压紧，再塞进缸里。F1 用的也是涡轮。', 'The "T" on the badge. Exhaust spins one fan (the turbine); a second fan on the same shaft (the compressor) packs air tight and forces it into the cylinder. F1 cars are turbocharged too.'],
    analogy: ['像用你呼出的气去转一个风车，再让风车帮你多吸几口气。', 'Like using your breath out to spin a fan that helps you breathe in more.'],
    steps: [
      { title: ['废气冲出气缸', 'Exhaust rushes out'], text: ['排气门一开，又热又快的废气冲进排气管。自然吸气就把它直接排掉了。', 'The exhaust valve opens and hot, fast gas rushes out. An NA engine just throws it away.'], focus: ['exhaust', 'chamber'] },
      { title: ['废气吹动涡轮', 'Exhaust spins the turbine'], text: ['废气先穿过涡轮，把它吹得飞快：每分钟能转十几万圈。', 'On its way out it spins the turbine, to well over 100,000 rpm.'], focus: ['turbine'] },
      { title: ['同一根轴带动压气机', 'One shaft drives the compressor'], text: ['涡轮和压气机装在同一根轴上：涡轮一转，压气机就跟着转。废气和新鲜空气走两条路，不会混在一起。', 'Turbine and compressor share a shaft. Exhaust and fresh air take separate paths and never mix.'], focus: ['shaft', 'compressor', 'turbine'] },
      { title: ['压气机把空气压紧', 'The compressor packs the air'], text: ['压气机把新鲜空气压缩，压力比外面高出零点几个大气压，这就是[[boost|增压]]。', 'The compressor squeezes fresh air above outside pressure; that extra is boost.'], focus: ['compressor'] },
      { title: ['中冷器给空气降温', 'The intercooler cools it'], text: ['空气被压缩会变热，热空气稀。[[intercooler|中冷器]]把它冷下来，变得更密。', 'Squeezing heats air, and hot air is thin. The intercooler cools it so it packs denser.'], focus: ['intercooler'] },
      { title: ['更多空气进缸', 'More air in every breath'], text: ['同一个缸，每次能塞进多得多的空气（数数小圈），就能多烧油、多出力。', 'The same cylinder now takes far more air per breath (count the rings), so it can burn more fuel and make more power.'], focus: ['chamber'] },
      { title: ['代价：迟滞', 'The catch: lag'], text: ['点"模拟一脚地板油"试试：涡轮要等废气把它吹快，增压慢半拍才上来，这就是[[lag|涡轮迟滞]]。', 'Press "Floor the throttle": the turbo waits for exhaust to spin it up, so boost arrives a beat late. That is turbo lag.'], focus: ['turbine', 'compressor'] }
    ],
    parts: {
      turbine: { name: ['涡轮', 'Turbine'], text: ['被废气吹转的轮子，泡在几百摄氏度的高温里。', 'The wheel the exhaust spins; it runs hundreds of degrees hot.'] },
      compressor: { name: ['压气机', 'Compressor'], text: ['和涡轮同轴的另一个轮子，负责把新鲜空气压紧。', 'The other wheel on the shaft; it packs fresh air tight.'] },
      shaft: { name: ['连接轴', 'Shaft'], text: ['把涡轮的转动传给压气机。转速极高，靠机油润滑和冷却。', 'Carries the turbine\'s spin to the compressor. Very fast, oiled and cooled.'] },
      intercooler: { name: ['中冷器', 'Intercooler'], text: ['给压缩后的热空气降温，空气越冷越密。', 'Cools the compressed air; colder air is denser.'] },
      wastegate: { name: ['废气旁通阀', 'Wastegate'], text: ['增压够了就打开，让一部分废气绕过涡轮。把转速拉高试试，看它打开。', 'Opens at full boost so some exhaust bypasses the turbine. Raise the rpm and watch it open.'] },
      bov: { name: ['泄压阀', 'Blow-off valve'], text: ['松油门时把多余的压缩空气放掉，那声"呲"就是它。', 'Lets surplus boost escape when you lift off: that "pssh".'] },
      chamber: { name: ['气缸', 'Cylinder'], text: ['小圈的数量就是每次吸进的空气量，和上一课的自然吸气比一比。', 'The rings show how much air each breath holds; compare with the last lesson.'] }
    },
    pros: [
      ['小排量出大力气：1.5T 常常有 2.0 升自吸的劲。', 'Big power from a small engine: a 1.5T often matches a 2.0 NA.'],
      ['更省油：平时温和地开，它就是一台小排量发动机。', 'Better economy: driven gently, it is just a small engine.'],
      ['到了高原掉动力少，涡轮能把稀薄的空气补回来。', 'Loses less at altitude: the turbo makes up for thin air.']
    ],
    cons: [
      ['有[[lag|迟滞]]：踩下油门，动力晚半拍才到。', 'Lag: power arrives a beat after you press.'],
      ['热量大，对机油和冷却要求高。', 'Lots of heat; harder on oil and cooling.'],
      ['结构复杂，管路和零件更多。', 'More pipes and parts, more complexity.']
    ],
    cars: [
      { name: ['大众高尔夫 GTI', 'Volkswagen Golf GTI'], engine: ['EA888 2.0T', 'EA888 2.0T'], tags: [tags.i4, tags.turbo], why: ['"小钢炮"的标杆，2.0T 的代表。', 'The benchmark hot hatch and the classic 2.0T.'] },
      { name: ['本田思域 Type R', 'Honda Civic Type R'], engine: ['K20C1 2.0T', 'K20C1 2.0T'], tags: [tags.i4, tags.turbo], why: ['前驱性能车的代表。', 'A front-drive performance icon.'] },
      { name: ['日产 GT-R（R35）', 'Nissan GT-R (R35)'], engine: ['VR38DETT 3.8 V6', 'VR38DETT 3.8 V6'], tags: [tags.v6, tags.twin], why: ['双涡轮 V6 的代表，每台发动机由一位匠人手工组装。', 'The twin-turbo V6 icon, each engine hand-built by one craftsman.'] },
      { name: ['丰田 GR Yaris', 'Toyota GR Yaris'], engine: ['G16E-GTS 1.6T', 'G16E-GTS 1.6T'], tags: [tags.i3, tags.turbo], why: ['三个缸也能很猛：小排量涡轮的极端例子。', 'Three cylinders and still fierce: small-turbo taken to the limit.'] }
    ],
    myth: {
      q: ['涡轮车一定有迟滞吗？', 'Do turbo cars always lag?'],
      a: ['原理上一定有，但现代涡轮做得更小更轻、控制更精确，日常几乎感觉不到。F1 甚至在 2014–2025 年用电机直接带动涡轮轴（MGU-H）来消除迟滞。', 'In principle yes, but modern turbos are small, light and well controlled, so in daily driving you barely notice. From 2014 to 2025 F1 even used an electric motor on the turbo shaft (the MGU-H) to remove it.']
    }
  },
  {
    id: 'super', chapter: 2, no: '2.3', view: 'super', kind: 'flow', next: 'throttle',
    eyebrow: 'SUPERCHARGED',
    title: ['机械增压：用皮带直接打气', 'Supercharged: a belt-driven air pump'],
    card: ['曲轴带动的打气泵，没有迟滞。', 'A crank-driven air pump with no lag.'],
    lead: ['曲轴通过一条皮带带动增压器：发动机转多快，它就转多快，直接把空气挤进缸里。一踩就有，但它要吃掉发动机自己的一部分力气。', 'A belt from the crank drives the supercharger, so it turns whenever the engine does and forces air straight in. Instant, but it eats some of the engine\'s own power.'],
    analogy: ['像边骑车边用脚踩一个打气筒：一踩就有气，可你得多花一份力。', 'Like working a foot pump while you ride: instant air, but it costs you effort.'],
    steps: [
      { title: ['曲轴带动皮带', 'The crank turns the belt'], text: ['曲轴前端有个皮带轮，发动机一转就拉动皮带。', 'A pulley on the front of the crank pulls the belt round.'], focus: ['pulley', 'belt'] },
      { title: ['皮带带动增压器', 'The belt drives the blower'], text: ['皮带另一头连着增压器，两者转速成固定比例：发动机转多快，它就转多快。', 'The other end drives the blower at a fixed ratio to engine speed.'], focus: ['belt', 'blower'] },
      { title: ['转子把空气挤进去', 'The rotors push air in'], text: ['两个互相咬合的转子像两只手，把空气一把一把往下推，压进进气管。', 'Two meshing rotors scoop air and push it down into the intake, like two hands.'], focus: ['blower'] },
      { title: ['马上就有增压', 'Boost right away'], text: ['因为是直接驱动，一踩油门立刻就有增压，低转速也很有劲。点"模拟一脚地板油"，和涡轮比比。', 'Driven directly, it boosts the instant you press, even at low rpm. Try "Floor the throttle" and compare with the turbo.'], focus: ['chamber'] },
      { title: ['代价：吃掉一些动力', 'The catch: it costs power'], text: ['带动增压器的力气来自曲轴本身，所以有一部分动力被它"吃掉"了，这叫[[parasitic|驱动损失]]。', 'The power to drive it comes from the crank itself, so it eats some output: parasitic loss.'], focus: ['parasitic', 'pulley'] }
    ],
    parts: {
      blower: { name: ['罗茨增压器', 'Roots blower'], text: ['两个三叶转子反向旋转，把空气推进去。这里画的是容积式；还有离心式，特性不一样。', 'Two three-lobe rotors turning opposite ways push air in. This is a positive-displacement type; centrifugal ones behave differently.'] },
      belt: { name: ['传动皮带', 'Drive belt'], text: ['把曲轴的转动传给增压器。', 'Carries the crank\'s rotation to the blower.'] },
      pulley: { name: ['皮带轮', 'Pulleys'], text: ['两个轮子的大小，决定了增压器比曲轴转得快多少。', 'Their sizes set how much faster the blower spins than the crank.'] },
      chamber: { name: ['气缸', 'Cylinder'], text: ['数数小圈：比自然吸气多，比全速的涡轮少一点。', 'Count the rings: more than NA, a little fewer than a turbo at full boost.'] },
      parasitic: { name: ['驱动损失', 'Parasitic loss'], text: ['读数里这一项：被增压器自己用掉的那部分动力。', 'This readout: the share of power the blower uses itself.'] }
    },
    pros: [
      ['没有迟滞，一踩就有。', 'No lag: boost the instant you press.'],
      ['低转速就有大[[torque|扭矩]]，起步特别有劲。', 'Strong torque from low rpm.'],
      ['那种独特的"呜呜"啸叫声。', 'That distinctive supercharger whine.']
    ],
    cons: [
      ['要吃掉发动机的一部分动力，所以更费油。', 'It eats engine power, so it uses more fuel.'],
      ['体积大，要装在发动机上方或旁边。', 'Bulky; it sits on or beside the engine.'],
      ['现在越来越少见，大多被涡轮和电动增压取代。', 'Increasingly rare, replaced by turbos and electric boost.']
    ],
    cars: [
      { name: ['道奇 Challenger SRT Hellcat', 'Dodge Challenger SRT Hellcat'], engine: ['6.2 HEMI V8', '6.2 HEMI V8'], tags: [tags.v8, tags.sc], why: ['美式机械增压的代表，啸叫声很有标志性。', 'The American supercharged icon, with a signature whine.'] },
      { name: ['福特 Mustang Shelby GT500', 'Ford Mustang Shelby GT500'], engine: ['5.2 V8', '5.2 V8'], tags: [tags.v8, tags.sc], why: ['机械增压 V8 的另一位代表。', 'Another supercharged V8 flagship.'] },
      { name: ['捷豹 F-Type R', 'Jaguar F-Type R'], engine: ['5.0 V8', '5.0 V8'], tags: [tags.v8, tags.sc], why: ['英式跑车里的机械增压 V8。', 'A British sports car with a supercharged V8.'] },
      { name: ['奔驰 C200 Kompressor', 'Mercedes-Benz C200 Kompressor'], engine: ['直列四缸', 'Inline-four'], tags: [tags.i4, tags.sc], why: ['车尾的 Kompressor 字样，指的就是机械增压。', 'The Kompressor badge meant supercharged.'] }
    ],
    myth: {
      q: ['机械增压和涡轮增压，哪个好？', 'Supercharger or turbo: which is better?'],
      a: ['各有取舍：机械增压反应快但费油，涡轮省油、出力大但有迟滞。现在主流是涡轮，因为油耗和排放法规越来越严。下一课的实验能直接对比。', 'It is a trade-off: a supercharger responds faster but costs fuel; a turbo is efficient and powerful but lags. Turbos dominate because economy and emissions rules keep tightening. The next lesson puts them side by side.']
    }
  },
  {
    id: 'throttle', chapter: 2, no: '2.4', view: 'throttle', kind: 'experiment', next: 'inline-4',
    eyebrow: 'THE FLOOR-IT TEST',
    title: ['踩油门实验：同一脚油门，三种反应', 'The floor-it test: one stomp, three responses'],
    card: ['三台发动机，同时踩下地板油。', 'Three engines, floored together.'],
    lead: ['三台都是 2.0 升、转速相同，只是进气方式不同。同时踩下地板油：看谁先来劲，谁最后最猛，谁被吃掉了一块。', 'Three 2.0-litre engines at the same speed, differing only in how they breathe. Floor them together: who responds first, who ends strongest, who pays a toll?'],
    analogy: ['像三位选手同时起跑：一位反应快但力气小，一位慢热但后程最猛，一位反应快却背着个包。', 'Like three sprinters at the gun: one quick but light, one slow to start but strongest late, one quick but carrying a backpack.'],
    steps: [
      { title: ['先收着油门巡航', 'Cruising on part throttle'], text: ['三台发动机以同样的转速巡航，现在都只吸进一部分空气。罐子里的小圈就是每次吸进的空气。', 'All three cruise at the same speed, each taking in only part of the air it could. The rings in each jar are the air per breath.'], focus: ['na-jar', 'turbo-jar', 'sc-jar'] },
      { title: ['一脚地板油', 'Floor it'], text: ['点「地板油！」。自然吸气和机械增压几乎立刻吸满；涡轮先像自吸一样，然后才把增压慢慢建立起来。', 'Press "Floor it!". The NA and supercharged engines fill almost at once; the turbo first breathes like an NA engine, then builds boost.'], focus: ['chart'] },
      { title: ['涡轮：慢半拍，后劲最大', 'The turbo: late, then strongest'], text: ['等废气把涡轮吹快，它的动力最后最高。这就是[[lag|迟滞]]和后劲。', 'Once exhaust spins it up, it ends up strongest: lag, then pull.'], focus: ['turbo-jar'] },
      { title: ['机械增压：马上有，但被吃掉一块', 'The supercharger: instant, minus a slice'], text: ['它一下就有增压，可读数里能看到被增压器自己用掉的那部分。', 'Boost is instant, but the readout shows the slice the blower uses itself.'], focus: ['sc-jar'] },
      { title: ['换到高原试试', 'Now try high altitude'], text: ['切到"高原 3650 米"再踩一次：自然吸气和机械增压都掉了三成多，涡轮能补回大部分。', 'Switch to 3,650 m and floor it again: NA and supercharged lose over a third, the turbo wins most of it back.'], focus: ['chart', 'turbo-jar'] }
    ],
    parts: {
      'na-jar': { name: ['自然吸气', 'Naturally aspirated'], text: ['最多吸满一个大气压。', 'Fills to outside pressure at most.'] },
      'turbo-jar': { name: ['涡轮增压', 'Turbocharged'], text: ['右上角的小风车就是涡轮：转得越快，压进去的空气越多。', 'The little fan is the turbo: the faster it spins, the more air it packs in.'] },
      'sc-jar': { name: ['机械增压', 'Supercharged'], text: ['红字是被增压器自己吃掉的动力。', 'The red figure is the power the blower takes for itself.'] },
      chart: { name: ['动力曲线', 'Power curve'], text: ['横轴是踩下油门后的时间，纵轴是动力，以海平面的自然吸气为 100%。', 'Time since the throttle opened, against power, with NA at sea level as 100%.'] },
      alt: { name: ['海拔', 'Altitude'], text: ['用下面的开关切到高原，空气只剩海平面的约三分之二，看三种进气方式各掉多少。', 'Switch to high altitude below: the air is about two-thirds as dense. See how much each one loses.'] }
    },
    pros: [
      ['想要线性、高转、好声音：自然吸气。', 'For linear response, high revs and sound: naturally aspirated.'],
      ['想要小排量大马力、还省油：涡轮。', 'For big power from a small, frugal engine: turbo.'],
      ['想要一踩就有、低转大扭矩：机械增压。', 'For instant shove and low-rpm torque: supercharger.']
    ],
    cons: [
      ['自然吸气：同排量力气最小，高原掉得最多。', 'NA: least power for its size, and the most lost at altitude.'],
      ['涡轮：有迟滞，热量大，结构复杂。', 'Turbo: lag, heat and complexity.'],
      ['机械增压：要吃掉动力，费油，体积大。', 'Supercharger: costs power and fuel, and it is bulky.']
    ],
    cars: [
      { name: ['马自达 MX-5', 'Mazda MX-5'], engine: ['2.0 Skyactiv-G', '2.0 Skyactiv-G'], tags: [tags.i4, tags.na], why: ['自然吸气的代表。', 'Standing in for naturally aspirated.'] },
      { name: ['大众高尔夫 GTI', 'Volkswagen Golf GTI'], engine: ['EA888 2.0T', 'EA888 2.0T'], tags: [tags.i4, tags.turbo], why: ['同样 2.0 升，涡轮的代表。', 'The same 2.0 litres, turbocharged.'] },
      { name: ['道奇 Challenger SRT Hellcat', 'Dodge Challenger SRT Hellcat'], engine: ['6.2 HEMI V8', '6.2 HEMI V8'], tags: [tags.v8, tags.sc], why: ['排量不同，只看它的进气方式：机械增压。', 'A different size; here it just stands for supercharging.'] }
    ],
    myth: {
      q: ['为什么高原上涡轮车更吃香？', 'Why do turbo cars cope better at altitude?'],
      a: ['高原空气稀，自然吸气每次吸进的空气就少了。涡轮按"压到多少"来控制，空气稀了它就转得更快、多压一点，大部分动力能补回来；机械增压只按固定倍数压，补不回来。', 'Thin air means an NA engine takes in less per breath. A turbo is controlled to a target pressure, so in thin air it simply spins faster and wins most of the power back; a positive-displacement supercharger only multiplies by a fixed ratio, so it cannot.']
    }
  },
  {
    id: 'inline-4', chapter: 3, no: '3.1', view: 'inline4', kind: 'crank', next: 'v8', speed: 18,
    eyebrow: 'INLINE-FOUR',
    title: ['直列四缸：四个缸排一排', 'Inline-four: four in a row'],
    card: ['最常见的布局，1-3-4-2 轮流点火。', 'The most common layout, firing 1-3-4-2.'],
    lead: ['街上大多数车都是它：四个缸排成一排，轮流出力，每转半圈就有一个缸在做功。前面几课的 MX-5、高尔夫 GTI、思域 Type R，都是直列四缸，只是进气方式不同。', 'Most cars on the road use it: four cylinders in a row taking turns, one power stroke every half turn. The MX-5, Golf GTI and Civic Type R from earlier lessons are all inline-fours that breathe differently.'],
    analogy: ['像四个人划同一条船：大家轮流用力，船就一直有人推着走。', 'Like four rowers in one boat taking turns to pull: there is always someone pushing.'],
    start: 10,
    steps: [
      { at: 20, until: 180, title: ['1 缸点火', 'Cylinder 1 fires'], text: ['1 缸做功的时候，2 缸在排气、3 缸在压缩、4 缸在进气：四个缸永远各干各的一步。', 'While 1 fires, 2 exhausts, 3 compresses and 4 breathes in: each cylinder is always on a different stroke.'], focus: ['cyl1', 'timeline'] },
      { at: 200, until: 360, title: ['3 缸点火', 'Cylinder 3 fires'], text: ['接着是 3 缸。[[firing-order|点火顺序]]是 1-3-4-2，每转半圈（180°）就有一个缸在出力。', 'Then cylinder 3. The firing order is 1-3-4-2: one power stroke every half turn (180°).'], focus: ['cyl3', 'timeline'] },
      { at: 380, until: 540, title: ['4 缸点火', 'Cylinder 4 fires'], text: ['注意：1 缸和 4 缸的活塞总是一起上下，2 缸和 3 缸则和它们正好相反。', 'Notice that pistons 1 and 4 always move together, and 2 and 3 move opposite them.'], focus: ['cyl4', 'cyl1', 'timeline'] },
      { at: 560, until: 720, title: ['2 缸点火', 'Cylinder 2 fires'], text: ['最后是 2 缸，然后循环。打开"加平衡轴"看右边的抖动表：直列四缸天生有一种每转两次的抖动，大排量四缸常用[[balance-shaft|平衡轴]]抵消它。', 'Finally cylinder 2, and round again. Turn on the balance shafts and watch the shake meter: an inline-four has a built-in shake twice per turn, which larger fours cancel with balance shafts.'], focus: ['cyl2', 'shake'] }
    ],
    parts: {
      cyl1: { name: ['1 缸', 'Cylinder 1'], text: ['离发动机前端最近的缸。', 'The cylinder nearest the front.'] },
      cyl2: { name: ['2 缸', 'Cylinder 2'], text: ['和 3 缸的活塞同步。', 'Moves in step with 3.'] },
      cyl3: { name: ['3 缸', 'Cylinder 3'], text: ['1 缸之后第二个点火。', 'Fires second, after 1.'] },
      cyl4: { name: ['4 缸', 'Cylinder 4'], text: ['和 1 缸的活塞同步，但晚一圈点火。', 'Moves with 1, but fires a turn later.'] },
      crank: { name: ['曲轴', 'Crankshaft'], text: ['一根轴连着四个曲拐：1、4 缸的朝一边，2、3 缸的朝另一边。', 'One shaft with four throws: 1 and 4 point one way, 2 and 3 the other.'] },
      timeline: { name: ['点火顺序', 'Firing order'], text: ['一个循环（两圈）里谁先谁后点火，红线是现在的位置。', 'Who fires when over one cycle (two turns); the red line is now.'] },
      shake: { name: ['抖动表', 'Shake meter'], text: ['四个活塞上下时留下的"不平衡"，每转两次。', 'The imbalance left by four pistons moving up and down, twice per turn.'] },
      balance: { name: ['平衡轴', 'Balance shafts'], text: ['以两倍转速反向旋转的配重轴，抵消抖动。', 'Weighted shafts spinning at twice crank speed in opposite directions, cancelling the shake.'] }
    },
    pros: [
      ['结构紧凑、零件少，便宜好造。', 'Compact, few parts, cheap to build.'],
      ['宽度窄，横着放进小车的发动机舱也没问题。', 'Narrow enough to fit sideways in a small car.'],
      ['配上涡轮，1.5–2.0 升就能有很强的动力。', 'With a turbo, 1.5–2.0 litres makes strong power.']
    ],
    cons: [
      ['天生有每转两次的二阶抖动，排量越大越明显。', 'A built-in secondary shake that grows with size.'],
      ['每转只有两次做功，不如六缸、八缸平顺。', 'Two power strokes per turn: less smooth than six or eight.'],
      ['声音偏单薄，不如多缸那么有气势。', 'Sounds thinner than engines with more cylinders.']
    ],
    cars: [
      { name: ['大众高尔夫 GTI', 'Volkswagen Golf GTI'], engine: ['EA888 2.0T', 'EA888 2.0T'], tags: [tags.i4, tags.turbo], why: ['直列四缸 + 涡轮，最常见的组合。', 'Inline-four plus turbo: the most common pairing.'] },
      { name: ['本田思域 Type R', 'Honda Civic Type R'], engine: ['K20C1 2.0T', 'K20C1 2.0T'], tags: [tags.i4, tags.turbo], why: ['高性能四缸的代表。', 'A high-performance four.'] },
      { name: ['马自达 MX-5', 'Mazda MX-5'], engine: ['2.0 Skyactiv-G', '2.0 Skyactiv-G'], tags: [tags.i4, tags.na], why: ['同样是四缸，换成自然吸气。', 'Also a four, but naturally aspirated.'] },
      { name: ['奔驰 C200 Kompressor', 'Mercedes-Benz C200 Kompressor'], engine: ['直列四缸', 'Inline-four'], tags: [tags.i4, tags.sc], why: ['四缸 + 机械增压。同一种布局，三种进气方式都有。', 'A four with a supercharger: one layout, all three ways to breathe.'] }
    ],
    myth: {
      q: ['"1.5T 三缸 / 2.0T 四缸"，缸数越多越好吗？', 'Are more cylinders always better?'],
      a: ['不一定。缸数多更平顺、声音更好，但更重、更贵、更费油。四缸是体积、成本和动力之间最平衡的选择，所以最常见。', 'Not necessarily. More cylinders run smoother and sound better, but weigh more, cost more and use more fuel. Four is the best balance of size, cost and power, which is why it is everywhere.']
    }
  },
  {
    id: 'v8', chapter: 3, no: '3.4', view: 'v8', kind: 'crank', speed: 14,
    eyebrow: 'CROSS-PLANE VS FLAT-PLANE V8',
    title: ['V8：同样八个缸，两种声音', 'V8: eight cylinders, two voices'],
    card: ['十字曲轴"突突"，平面曲轴尖啸。', 'Cross-plane burbles, flat-plane screams.'],
    lead: ['两排各四个缸，摆成 V 字。同样是 V8，美式肌肉车"突突突"，法拉利、Corvette Z06 却在尖啸。区别不在缸数，而在曲轴长什么样。', 'Two banks of four in a V. Some V8s burble like a muscle car, others scream like a Ferrari or a Corvette Z06. The difference is not the cylinder count but the shape of the crank.'],
    analogy: ['像两支鼓队：一支打着忽快忽慢的切分节奏，另一支每一下都均匀整齐。', 'Like two drum lines: one plays a lopsided, syncopated beat; the other hits every beat evenly.'],
    steps: [
      { title: ['先看曲轴形状', 'Look at the crank'], text: ['从端面看，左边的曲轴是个"十"字，四个曲拐指向四个方向；右边的是"一"字，只有两个方向。', 'Seen end-on, the left crank is a cross with throws in four directions; the right one is flat, with just two.'], focus: ['crank-cross', 'crank-flat'] },
      { title: ['两台都是每 90° 点一次火', 'Both fire every 90°'], text: ['八个缸轮流点火，整台发动机都是每转 90° 点一次火，这一点两者一样。', 'Eight cylinders take turns, so both engines fire every 90° overall.'], focus: ['banks-cross', 'banks-flat'] },
      { title: ['十字曲轴：一排里忽快忽慢', 'Cross-plane: uneven within a bank'], text: ['只看一排（一侧的排气管）：间隔是 180°、270°、180°、90°，忽快忽慢，于是有了 V8 那种低沉的"突突"声。', 'Within one bank (one exhaust pipe) the gaps run 180°, 270°, 180°, 90°: uneven, which gives the classic V8 burble.'], focus: ['timeline-cross'] },
      { title: ['平面曲轴：一排里均匀', 'Flat-plane: even within a bank'], text: ['每一排都是均匀的 180°，就像两台直列四缸并排，声音更高亢，像尖啸。', 'Each bank fires evenly every 180°, like two inline-fours side by side, so it sounds higher and screams.'], focus: ['timeline-flat'] },
      { title: ['各有代价', 'Each has a cost'], text: ['十字曲轴平衡好，但配重大、转不太高；平面曲轴更轻、转得更高，但抖动更明显。', 'The cross-plane is smoother but needs heavy counterweights and revs lower; the flat-plane is lighter and revs higher but shakes more.'], focus: ['crank-cross', 'crank-flat'] }
    ],
    parts: {
      'crank-cross': { name: ['十字曲轴', 'Cross-plane crank'], text: ['四个曲拐互成 90°，从端面看像个"十"字。示例点火顺序为 GM LS 系列的 1-8-7-2-6-5-4-3。', 'Four throws at 90° to each other, a cross seen end-on. The example uses the GM LS-family order 1-8-7-2-6-5-4-3.'] },
      'crank-flat': { name: ['平面曲轴', 'Flat-plane crank'], text: ['曲拐只朝两个方向，像一字。左右两排轮流点火。', 'Throws in only two directions. The banks alternate firing.'] },
      'banks-cross': { name: ['气缸（十字曲轴）', 'Cylinders (cross-plane)'], text: ['左右两排各四个缸，亮的是正在点火的缸。', 'Two banks of four; the lit one is firing.'] },
      'banks-flat': { name: ['气缸（平面曲轴）', 'Cylinders (flat-plane)'], text: ['同样八个缸，点火在两排之间来回切换。', 'Same eight cylinders, firing back and forth between the banks.'] },
      'timeline-cross': { name: ['点火节奏（十字）', 'Rhythm (cross-plane)'], text: ['每一排的点火间隔不均匀，红字标出了不等的间隔。', 'Uneven gaps within each bank, marked in red.'] },
      'timeline-flat': { name: ['点火节奏（平面）', 'Rhythm (flat-plane)'], text: ['每一排都是 180° 均匀点火。', 'Every bank fires evenly every 180°.'] }
    },
    pros: [
      ['八个缸每转四次做功，动力平顺又充沛。', 'Four power strokes per turn: smooth and strong.'],
      ['十字曲轴平衡极好，低转扭矩足，声音浑厚。', 'Cross-plane: superbly balanced, torquey, deep-voiced.'],
      ['平面曲轴更轻、转得更高，排气脉冲整齐，声音高亢。', 'Flat-plane: lighter, revs higher, even exhaust pulses, a high wail.']
    ],
    cons: [
      ['体积大、重，也更费油。', 'Big, heavy and thirsty.'],
      ['十字曲轴配重大，转速上限较低。', 'Cross-plane: heavy counterweights limit revs.'],
      ['平面曲轴有二阶抖动，没有十字曲轴那么平顺。', 'Flat-plane: secondary shake, less smooth.']
    ],
    cars: [
      { name: ['福特 Mustang GT', 'Ford Mustang GT'], engine: ['Coyote 5.0 V8', 'Coyote 5.0 V8'], tags: [tags.v8cross, tags.na], why: ['典型的十字曲轴美式 V8。', 'A classic cross-plane American V8.'] },
      { name: ['雪佛兰 Corvette Z06（C8）', 'Chevrolet Corvette Z06 (C8)'], engine: ['LT6 5.5 V8', 'LT6 5.5 V8'], tags: [tags.v8flat, tags.na], why: ['平面曲轴、高转自吸，声音像赛车。', 'Flat-plane and high-revving NA; it sounds like a race car.'] },
      { name: ['法拉利 F8 Tributo', 'Ferrari F8 Tributo'], engine: ['3.9 V8', '3.9 V8'], tags: [tags.v8flat, tags.twin], why: ['平面曲轴 + 双涡轮。', 'Flat-plane plus twin turbos.'] },
      { name: ['道奇 Challenger SRT Hellcat', 'Dodge Challenger SRT Hellcat'], engine: ['6.2 HEMI V8', '6.2 HEMI V8'], tags: [tags.v8cross, tags.sc], why: ['十字曲轴 + 机械增压。', 'Cross-plane plus a supercharger.'] }
    ],
    myth: {
      q: ['V8 的"突突"声是排气管调出来的吗？', 'Is the V8 burble just tuned into the exhaust?'],
      a: ['排气管能放大或修饰它，但根源在曲轴：十字曲轴让每一排的排气脉冲间隔不均，这种不规则的节奏就是"突突"声的来源。', 'The exhaust can amplify or shape it, but the root is the crank: a cross-plane gives each bank uneven exhaust pulses, and that lopsided rhythm is the burble.']
    }
  }
];

export const lessonById = id => LESSONS.find(l => l.id === id);
