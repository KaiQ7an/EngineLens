// Gallery entries, one per engine or idea. Copy is [中文, English]. Steps with `at`
// are moments in the crank cycle (degrees); steps without it are a chain of cause and
// effect the narration walks through on a timer. `focus` names the parts it highlights.

export const GROUPS = [
  { id: 'basics', name: ['基本原理', 'The basics'], blurb: ['先看懂一个缸是怎么转起来的。', 'Start with how one cylinder works.'] },
  { id: 'induction', name: ['进气方式', 'How it breathes'], blurb: ['空气怎么进到缸里：自己吸，还是用涡轮、机械增压往里压。', 'How air gets in: drawn in, or forced in by a turbo or supercharger.'] },
  { id: 'layout', name: ['气缸布局', 'Cylinder layouts'], blurb: ['缸怎么排：直列、V 形、水平对置……决定了体积、平顺和声音。', 'How the cylinders are arranged, which sets size, smoothness and sound.'] },
  { id: 'special', name: ['特殊结构', 'Different designs'], blurb: ['和普通汽油机不一样的点火方式和结构。', 'Ways of lighting and turning that break from the usual petrol engine.'] },
  { id: 'electric', name: ['电动化', 'Going electric'], blurb: ['电在动力里占多大份量：从混动到纯电。', 'How much of the work electricity does, from hybrids to battery EVs.'] },
  { id: 'racing', name: ['赛道', 'On track'], blurb: ['顶级赛车用的动力。', 'What powers the top of motorsport.'] }
];

// Engines not in the atlas yet.
export const COMING = [];

const tags = {
  inline: ['直列', 'Inline'], i3: ['直列三缸', 'Inline-3'], i4: ['直列四缸', 'Inline-4'], v6: ['V6', 'V6'], v8: ['V8', 'V8'], v8cross: ['V8 十字曲轴', 'Cross-plane V8'], v8flat: ['V8 平面曲轴', 'Flat-plane V8'], i6: ['直列六缸', 'Inline-6'], v12: ['V12', 'V12'], flat4: ['水平对置四缸', 'Flat-4'],
  flat6: ['水平对置六缸', 'Flat-6'],
  na: ['自然吸气', 'Naturally aspirated'], turbo: ['涡轮', 'Turbo'], twin: ['双涡轮', 'Twin-turbo'], sc: ['机械增压', 'Supercharged'],
  turboHybrid: ['涡轮 + 电机', 'Turbo + motor'], twinHybrid: ['双涡轮 + 电机', 'Twin-turbo + motor'], naHybrid: ['自然吸气 + 电机', 'NA + motors'],
  diesel: ['柴油', 'Diesel'], rotor1: ['单转子', 'Single rotor'], rotor2: ['双转子', 'Twin rotor'], rotor4: ['四转子', 'Four rotor'], rangeExt: ['只发电（增程）', 'Generator only'],
  hybrid: ['混动', 'Hybrid'], phev: ['插电混动', 'Plug-in hybrid'], erev: ['增程', 'Range extender'], ev: ['纯电', 'Battery electric'],
  w16: ['W16', 'W16'], v16: ['V16', 'V16'], w12: ['W12', 'W12'], quad: ['四涡轮', 'Quad-turbo'],
  twincharged: ['双增压', 'Twincharged'], eboost: ['电动压气机', 'Electric compressor'], eturbo: ['电动涡轮', 'Electric turbo'],
  fcev: ['氢燃料电池', 'Fuel cell'], h2ice: ['烧氢内燃机', 'Hydrogen combustion']
};

export const ENTRIES = [
  {
    id: 'four-stroke', group: 'basics', view: 'fourStroke', kind: 'crank',
    eyebrow: 'HOW IT BREATHES',
    name: ['四冲程', 'Four-stroke'],
    tagline: ['发动机的一呼一吸', 'How an engine breathes'],
    facts: [[['工作方式', 'Cycle'], ['吸气 → 压缩 → 做功 → 排气', 'Intake → compression → power → exhaust']], [['曲轴', 'Crank'], ['转两圈，出一次力', 'Two turns per power stroke']], [['常见于', 'Found in'], ['几乎所有汽油车，包括 F1', 'Nearly every petrol car, F1 included']]],
    card: ['吸气、压缩、点火、排气。', 'Intake, compression, power, exhaust.'],
    lead: ['吸气、压缩、点火、排气：曲轴转两圈，这个缸出一次力。街上的汽油车、赛道上的 F1，都是这样转起来的。',
      'Intake, compression, power, exhaust: two turns of the crank, one push from the cylinder. Road cars and F1 cars alike run on this cycle.'],
    analogy: ['像起跑前那一口气：先深吸，憋住，猛地发力，再呼出去。图里每个小点代表一团空气，数一数，就知道吸进了多少。',
      'Like the breath before a sprint start: in, hold, explode, out. Each dot in the animation is a parcel of air, so you can count what goes in.'],
    // The guide stops at each dead centre, where one stroke ends and the next begins.
    scrub: 'strokes', playback: 'slow', hold: 2.6,
    steps: [
      { at: 0, until: 180, tone: 'intake', title: ['进气', 'Intake'],
        text: ['活塞从[[tdc|上止点]]往下走，进气门打开，新鲜空气（混着燃油）被吸进缸里。', 'The piston moves down from [[tdc|top dead centre]] with the intake valve open, drawing in fresh air (and fuel).'],
        why: ['活塞让出空间，缸里的压力比外面低，空气就自己涌进来，像拉开针筒一样。', 'As the piston makes room, the pressure inside drops below the air outside, so air rushes in, like pulling back a syringe.'],
        focus: ['intake-valve', 'piston', 'intake-port'] },
      { at: 180, until: 360, tone: 'squeeze', title: ['压缩', 'Compression'],
        text: ['活塞从[[bdc|下止点]]往上走，进气门稍后关闭。随后两个气门保持关闭，混合气被压紧；快到顶时火花塞点火。', 'The piston rises from [[bdc|bottom dead centre]] and the intake valve closes shortly afterwards. Both valves then stay shut as the charge is compressed; the spark fires just before the top.'],
        why: ['挤得越紧（[[compression-ratio|压缩比]]越高），燃烧时压力升得越高，推活塞就越狠。提前一点点火，是因为火焰要一点时间才能烧旺。', 'The tighter the squeeze (the higher the [[compression-ratio|compression ratio]]), the higher the pressure when it burns. The spark comes a little early because the flame takes a moment to build.'],
        focus: ['chamber', 'piston', 'spark'] },
      { at: 360, until: 540, tone: 'burn', title: ['做功', 'Power'],
        text: ['混合气猛烈燃烧、膨胀，把活塞从上止点一路推到下止点，曲轴被推着转起来。', 'The burning charge expands and drives the piston all the way from top to bottom, turning the crank.'],
        why: ['四个冲程里只有这一下在出力。其余三步靠飞轮的惯性、以及其他缸的做功带过去。', 'This is the only stroke of the four that makes power. The flywheel and the other cylinders carry the engine through the rest.'],
        focus: ['chamber', 'piston', 'crank'] },
      { at: 540, until: 720, tone: 'exhaust', title: ['排气', 'Exhaust'],
        text: ['排气门打开，活塞往上走，把烧完的废气推出缸外。', 'The exhaust valve opens and the rising piston pushes the burnt gas out.'],
        why: ['不清空废气，下一口新鲜空气就进不来。快到顶时进气门提前打开（[[valve-overlap|气门重叠]]），气流顺势把剩下的废气带走。', 'Unless the cylinder is cleared, the next breath has no room. Near the top the intake valve opens early ([[valve-overlap|valve overlap]]) and the moving gas sweeps out what is left.'],
        focus: ['exhaust-valve', 'exhaust-port', 'piston'] }
    ],
    parts: {
      'intake-valve': { name: ['进气门', 'Intake valve'], text: ['空气的入口。主要在进气行程打开，并会提前开启、延迟关闭；由上方凸轮轴控制。', 'The way in for air. It opens around the intake stroke, with early opening and late closing controlled by the camshaft.'] },
      'exhaust-valve': { name: ['排气门', 'Exhaust valve'], text: ['废气的出口，排气时打开。它泡在几百摄氏度的废气里工作。', 'The way out for exhaust. It opens for the exhaust stroke and works in gas hundreds of degrees hot.'] },
      spark: { name: ['火花塞', 'Spark plug'], text: ['活塞快到顶时打出一个电火花，点燃混合气。点火早几度、晚几度，动力都会明显不同。', 'It fires a spark just before the piston reaches the top. A few degrees early or late makes a real difference to power.'] },
      cams: { name: ['凸轮轴', 'Camshafts'], text: ['两根带凸起的轴，转到凸起时就把气门推开。它们只有曲轴一半的转速，因为每个气门两圈才开一次。', 'Two shafts with lobes that push the valves open. They turn at half crank speed, because each valve opens once every two turns.'] },
      piston: { name: ['活塞', 'Piston'], text: ['在缸里上下跑的"拳头"。燃烧的力量就推在它的顶上。', 'The fist that runs up and down the cylinder. Combustion pushes on its crown.'] },
      rod: { name: ['连杆', 'Connecting rod'], text: ['连接活塞和曲轴，把"往下推"传给曲轴。', 'Links the piston to the crank and passes the push down to it.'] },
      crank: { name: ['曲轴', 'Crankshaft'], text: ['把上下运动变成旋转：就像踩自行车，腿上下用力，脚踏却在转圈。', 'Turns up-and-down into rotation, like pedalling a bike: your legs push down, the pedals go round.'] },
      chamber: { name: ['燃烧室', 'Combustion chamber'], text: ['活塞顶和缸盖之间的空间。小点的颜色就是气体此刻的状态：青色圈是新鲜空气，黄色圈是被压缩，橙色是正在燃烧，灰色是废气。', 'The space above the piston. The dots show what the gas is doing: cyan rings are fresh air, yellow rings squeezed charge, orange burning, grey exhaust.'] }
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
    id: 'na', group: 'induction', view: 'na', kind: 'flow',
    eyebrow: 'NATURALLY ASPIRATED',
    name: ['自然吸气', 'Naturally aspirated'],
    tagline: ['靠大气压"推"进来', 'Pushed in by the atmosphere'],
    facts: [[['进气方式', 'Induction'], ['自然吸气', 'Naturally aspirated']], [['增压', 'Boost'], ['无，最多 1 个大气压', 'None: one atmosphere at most']], [['参数表上', 'On spec sheets'], ['写成 "L"，如 2.0L', 'Written "L", as in 2.0L']]],
    card: ['不加任何帮手，靠自己吸气。', 'No helper: the engine breathes on its own.'],
    lead: ['参数表上写"1.5L""2.0L"的，多半就是它。没有任何增压装置：活塞往下一走，缸里变"空"，外面的大气就把空气压了进来。', 'Most spec sheets reading "1.5L" or "2.0L" mean this. No booster: the piston drops, the cylinder empties, and the air outside pushes its way in.'],
    analogy: ['像用吸管喝饮料：你只是把吸管里的气吸走，真正把饮料压上来的是外面的大气压。', 'Like a drinking straw: you only lower the pressure; the atmosphere is what pushes the drink up.'],
    steps: [
      { title: ['活塞往下走', 'The piston drops'], text: ['活塞往下走，缸里空出位置，气压变得比外面低一点。', 'The piston moves down, making room, and the pressure inside falls a little below the air outside.'],
        why: ['空气总是从压力高的地方流向低的地方，这一点压差就是空气进缸的动力。', 'Air always flows from high pressure to low, and that small difference is what moves air into the cylinder.'], focus: ['piston', 'chamber'] },
      { title: ['大气把空气压进来', 'The atmosphere pushes air in'], text: ['外面大约 1 个大气压的空气穿过滤清器，进到缸里。', 'Outside air at about one atmosphere passes the filter into the cylinder.'],
        why: ['准确地说，空气不是被"吸"进去的，而是被外面的大气"压"进去的。所以海拔越高、空气越稀，自然吸气越没劲。', 'Strictly, the air is not sucked in but pushed in by the atmosphere outside, which is why a naturally aspirated engine loses power high up, where the air is thin.'], focus: ['filter', 'intake-valve'] },
      { title: ['节气门管着进多少', 'The throttle sets how much'], text: ['你踩的油门，其实转的是这片节气门：开得越大，进的空气越多。', 'The pedal you press turns this throttle plate: the wider it opens, the more air gets in.'],
        why: ['发动机按空气的多少配油，空气多才能多烧油，所以节气门开多大，直接决定了[[power|动力]]有多大。', 'The engine meters fuel to the air, and more air lets it burn more fuel, so the throttle opening sets the [[power|power]].'], focus: ['throttle'] },
      { title: ['上限：最多一个大气压', 'The limit: one atmosphere'], text: ['不管转多快，它最多只能把缸"装满"到外面的气压。', 'However fast it spins, it can only fill the cylinder up to outside pressure.'],
        why: ['想要更多空气，就只能加大[[displacement|排量]]、转得更快，或者用增压器先把空气压一压。', 'For more air you need more [[displacement|displacement]], more revs, or a booster that squeezes the air first.'], focus: ['chamber'] },
      { title: ['废气直接排掉', 'Exhaust goes straight out'], text: ['烧完的废气又热又快，从排气管直接排走了。', 'The burnt gas leaves hot and fast, straight out of the exhaust.'],
        why: ['这股废气里还有不少能量，涡轮增压就是要把它用起来。', 'That gas still carries plenty of energy, and a turbo is a way to put it to use.'], focus: ['exhaust-pipe'] }
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
    id: 'turbo', group: 'induction', view: 'turbo', kind: 'flow',
    eyebrow: 'TURBOCHARGED',
    name: ['涡轮增压', 'Turbocharged'],
    tagline: ['让废气再干一份活', 'Putting exhaust to work'],
    facts: [[['进气方式', 'Induction'], ['涡轮增压', 'Turbocharged']], [['靠什么驱动', 'Driven by'], ['废气', 'Exhaust gas']], [['参数表上', 'On spec sheets'], ['写成 "T"，如 1.5T', 'Written "T", as in 1.5T']], [['常见于', 'Found in'], ['大多数新车、F1', 'Most new cars, and F1']]],
    card: ['用废气吹风车，把空气压进去。', 'Exhaust spins a fan that packs air in.'],
    lead: ['车尾的"T"就是它。排出去的废气先吹动一个风车（涡轮），同一根轴上的另一个风车（压气机）把空气压紧，再塞进缸里。F1 用的也是涡轮。', 'The "T" on the badge. Exhaust spins one fan (the turbine); a second fan on the same shaft (the compressor) packs air tight and forces it into the cylinder. F1 cars are turbocharged too.'],
    analogy: ['像用你呼出的气去转一个风车，再让风车帮你多吸几口气。', 'Like using your breath out to spin a fan that helps you breathe in more.'],
    steps: [
      { title: ['废气冲出气缸', 'Exhaust rushes out'], text: ['排气门一开，又热又快的废气冲进排气管。', 'The exhaust valve opens and hot, fast gas rushes into the exhaust.'],
        why: ['自然吸气会把这股能量直接排掉，涡轮增压则先拿它来干活。', 'An NA engine throws that energy away; a turbo puts it to work first.'], focus: ['exhaust', 'chamber'] },
      { title: ['废气吹动涡轮', 'Exhaust spins the turbine'], text: ['废气先穿过涡轮，把它吹得飞快：每分钟能转十几万圈。', 'On its way out the gas spins the turbine, to well over 100,000 rpm.'],
        why: ['涡轮的叶片像风车，废气流得越急，它转得越快；发动机转速越高，废气就越多越急。', 'The turbine is a windmill for exhaust: the faster the gas, the faster it spins, and higher revs mean more, faster gas.'], focus: ['turbine'] },
      { title: ['同一根轴带动压气机', 'One shaft drives the compressor'], text: ['涡轮和压气机装在同一根轴上：涡轮一转，压气机就跟着转。', 'The turbine and compressor share one shaft, so when one turns, so does the other.'],
        why: ['废气和新鲜空气走两条分开的路，从不混在一起，只是通过这根轴把能量传过去。', 'Exhaust and fresh air take separate paths and never mix; only the shaft carries energy across.'], focus: ['shaft', 'compressor', 'turbine'] },
      { title: ['压气机把空气压紧', 'The compressor packs the air'], text: ['压气机把新鲜空气压缩，压力比外面高出零点几个大气压。', 'The compressor squeezes fresh air to a few tenths of a bar above outside pressure.'],
        why: ['高出来的这部分就是[[boost|增压]]：同样大的缸，每次能塞进更多空气。', 'That extra is [[boost|boost]]: the same cylinder can take in more air each time.'], focus: ['compressor'] },
      { title: ['中冷器给空气降温', 'The intercooler cools it'], text: ['被压缩的空气先穿过[[intercooler|中冷器]]，降了温再进发动机。', 'The squeezed air passes through the [[intercooler|intercooler]] and cools before it reaches the engine.'],
        why: ['空气一压就会变热，热空气稀；冷下来更密，每次进缸的空气就更多。', 'Squeezing heats air, and hot air is thin; cooled, it is denser, so more of it fits in each breath.'], focus: ['intercooler'] },
      { title: ['更多空气进缸', 'More air in every breath'], text: ['同一个缸，每次塞进的空气多了很多（数数小圈）。', 'The same cylinder now takes in far more air each breath (count the rings).'],
        why: ['空气多了就能多喷油、多烧油，所以小排量也能有大[[power|动力]]，这就是"1.5T"能顶上更大排量自吸的原因。', 'More air lets it burn more fuel, so a small engine makes big [[power|power]]: that is how a "1.5T" matches a larger naturally aspirated engine.'], focus: ['chamber'] },
      { title: ['代价：迟滞', 'The catch: lag'], text: ['点"模拟一脚地板油"试试：增压要慢半拍才上来。', 'Press "Floor the throttle": the boost arrives a beat late.'],
        why: ['涡轮要等更多废气把它吹快，压气机才压得动，这段等待就是[[lag|涡轮迟滞]]。', 'The turbo has to wait for more exhaust to spin it up before the compressor can do its job; that wait is [[lag|turbo lag]].'], focus: ['turbine', 'compressor'] }
    ],
    parts: {
      turbine: { name: ['涡轮', 'Turbine'], text: ['被废气吹转的轮子，泡在几百摄氏度的高温里。', 'The wheel the exhaust spins; it runs hundreds of degrees hot.'] },
      compressor: { name: ['压气机', 'Compressor'], text: ['和涡轮同轴的另一个轮子，负责把新鲜空气压紧。', 'The other wheel on the shaft; it packs fresh air tight.'] },
      shaft: { name: ['连接轴', 'Shaft'], text: ['把涡轮的转动传给压气机。转速极高，靠机油润滑和冷却。', 'Carries the turbine\'s spin to the compressor. Very fast, oiled and cooled.'] },
      intercooler: { name: ['中冷器', 'Intercooler'], text: ['给压缩后的热空气降温，空气越冷越密。', 'Cools the compressed air; colder air is denser.'] },
      wastegate: { name: ['废气旁通阀', 'Wastegate'], text: ['增压够了就打开，让一部分废气绕过涡轮。把转速拉高试试，看它打开。', 'Opens at full boost so some exhaust bypasses the turbine. Raise the rpm and watch it open.'] },
      bov: { name: ['泄压阀', 'Blow-off valve'], text: ['松油门时把多余的压缩空气放掉，那声"呲"就是它。', 'Lets surplus boost escape when you lift off: that "pssh".'] },
      chamber: { name: ['气缸', 'Cylinder'], text: ['小圈的数量就是每次吸进的空气量，和自然吸气比一比。', 'The rings show how much air each breath holds; compare with naturally aspirated.'] }
    },
    pros: [
      ['小排量出大力气：1.5T 常常有 2.0 升自吸的劲。', 'Big power from a small engine: a 1.5T often matches a 2.0 NA.'],
      ['小排量增压在温和工况下可能更省油；实际油耗仍取决于车型、负荷和驾驶方式。', 'Downsized turbo engines can save fuel at light load; actual consumption depends on the vehicle, load and driving style.'],
      ['到了高原掉动力少，涡轮能把稀薄的空气补回来。', 'Loses less at altitude: the turbo makes up for thin air.']
    ],
    cons: [
      ['有[[lag|迟滞]]：踩下油门，动力晚半拍才到。', '[[lag|Lag]]: power arrives a beat after you press.'],
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
    id: 'super', group: 'induction', view: 'super', kind: 'flow',
    eyebrow: 'SUPERCHARGED',
    name: ['机械增压', 'Supercharged'],
    tagline: ['用皮带直接打气', 'A belt-driven air pump'],
    facts: [[['进气方式', 'Induction'], ['机械增压', 'Supercharged']], [['靠什么驱动', 'Driven by'], ['曲轴 + 皮带', 'Crank and belt']], [['特点', 'Character'], ['没有迟滞', 'No lag']], [['常见于', 'Found in'], ['美式 V8 肌肉车（越来越少）', 'American V8s (now rare)']]],
    card: ['曲轴带动的打气泵，没有迟滞。', 'A crank-driven air pump with no lag.'],
    lead: ['曲轴通过一条皮带带动增压器：发动机转多快，它就转多快，直接把空气挤进缸里。一踩就有，但它要吃掉发动机自己的一部分力气。', 'A belt from the crank drives the supercharger, so it turns whenever the engine does and forces air straight in. Instant, but it eats some of the engine\'s own power.'],
    analogy: ['像边骑车边用脚踩一个打气筒：一踩就有气，可你得多花一份力。', 'Like working a foot pump while you ride: instant air, but it costs you effort.'],
    steps: [
      { title: ['曲轴带动皮带', 'The crank turns the belt'], text: ['曲轴前端有个皮带轮，发动机一转就拉动皮带。', 'A pulley on the front of the crank pulls the belt round as the engine turns.'],
        why: ['增压器的动力直接来自曲轴，不用等废气。', 'The blower takes its power straight from the crank, with no waiting for exhaust.'], focus: ['pulley', 'belt'] },
      { title: ['皮带带动增压器', 'The belt drives the blower'], text: ['皮带另一头连着增压器，两者转速成固定比例。', 'The other end of the belt drives the blower at a fixed ratio to engine speed.'],
        why: ['发动机转多快，它就转多快，所以增压跟着转速走，非常好预料。', 'It turns exactly as fast as the engine tells it to, so its boost follows the revs and is easy to predict.'], focus: ['belt', 'blower'] },
      { title: ['转子把空气挤进去', 'The rotors push air in'], text: ['两个互相咬合的转子像两只手，把空气一把一把往下推，压进进气管。', 'Two meshing rotors scoop air and push it down into the intake, like two hands.'],
        why: ['这种罗茨式增压器每转一圈都推出固定的一份空气，推得比发动机吸得快，进气管里的压力就升上去了。', 'A Roots blower moves a fixed slug of air every turn; it pushes faster than the engine draws, so pressure builds in the intake.'], focus: ['blower'] },
      { title: ['马上就有增压', 'Boost right away'], text: ['点"模拟一脚地板油"：增压几乎立刻就到了。', 'Press "Floor the throttle": boost arrives almost at once.'],
        why: ['增压器和曲轴是硬连在一起的，转速一上来增压就上来，低转速也很有劲。可以和涡轮比比。', 'It is tied directly to the crank, so boost comes with the revs, strong even low down. Compare it with the turbo.'], focus: ['chamber'] },
      { title: ['代价：吃掉一些动力', 'The catch: it costs power'], text: ['看读数里"被增压器吃掉"的那一项。', 'Look at the share "taken by blower" in the readout.'],
        why: ['带动增压器的力气来自曲轴本身，有一部分动力被它自己用掉了，这叫[[parasitic|驱动损失]]。', 'The power to drive it comes from the crank itself, so it uses up some of the output: [[parasitic|parasitic loss]].'], focus: ['parasitic', 'pulley'] }
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
      ['低转速就有大[[torque|扭矩]]，起步特别有劲。', 'Strong [[torque|torque]] from low rpm.'],
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
      a: ['各有取舍：机械增压反应快但费油，涡轮省油、出力大但有迟滞。现在主流是涡轮，因为油耗和排放法规越来越严。去看看踩油门对比，三者并排。', 'It is a trade-off: a supercharger responds faster but costs fuel; a turbo is efficient and powerful but lags. Turbos dominate because economy and emissions rules keep tightening. The floor-it test puts them side by side.']
    }
  },
  {
    id: 'throttle', group: 'induction', view: 'throttle', kind: 'experiment',
    eyebrow: 'THE FLOOR-IT TEST',
    name: ['踩油门对比', 'Floor-it test'],
    tagline: ['同一脚油门，三种反应', 'One stomp, three responses'],
    facts: [[['对比', 'Comparing'], ['自吸 / 涡轮 / 机械增压', 'NA / turbo / supercharged']], [['条件', 'Set-up'], ['都是 2.0 升，同样转速', 'All 2.0 litres, same rpm']], [['可以切换', 'Switch'], ['海平面 / 3650 米', 'Sea level / 3,650 m']]],
    card: ['三台发动机，同时踩下地板油。', 'Three engines, floored together.'],
    lead: ['三台都是 2.0 升、转速相同，只是进气方式不同。同时踩下地板油：看谁先来劲，谁最后最猛，谁被吃掉了一块。', 'Three 2.0-litre engines at the same speed, differing only in how they breathe. Floor them together: who responds first, who ends strongest, who pays a toll?'],
    analogy: ['像三位选手同时起跑：一位反应快但力气小，一位慢热但后程最猛，一位反应快却背着个包。', 'Like three sprinters at the gun: one quick but light, one slow to start but strongest late, one quick but carrying a backpack.'],
    steps: [
      { title: ['先收着油门巡航', 'Cruising on part throttle'], text: ['三台 2.0 升发动机以同样的转速巡航，现在都只吸进一部分空气。', 'Three 2.0-litre engines cruise at the same speed, each taking in only part of the air it could.'],
        why: ['罐子里的小圈就是每次吸进的空气。巡航时节气门只开一点，三台差不多。', 'The rings in each jar are the air per breath. With the throttle only part open, all three are about the same.'], focus: ['na-jar', 'turbo-jar', 'sc-jar'] },
      { title: ['一脚地板油', 'Floor it'], text: ['点「地板油！」。自然吸气和机械增压几乎立刻吸满；涡轮先和自吸一样，然后才慢慢建立增压。', 'Press "Floor it!". The NA and supercharged engines fill almost at once; the turbo first breathes like an NA engine, then builds boost.'],
        why: ['节气门一开，空气马上能进来；可涡轮要等废气把它吹快，才能压进更多空气。', 'Opening the throttle lets air in straight away, but the turbo must wait for exhaust to spin it up before it can pack in more.'], focus: ['chart'] },
      { title: ['涡轮：慢半拍，后劲最大', 'The turbo: late, then strongest'], text: ['涡轮慢半拍，但最后动力最高。', 'The turbo is late, but ends up strongest.'],
        why: ['它用本来白白排掉的废气能量来增压，不从曲轴拿力气。这就是[[lag|迟滞]]换来的后劲。', 'It boosts with exhaust energy that would otherwise be wasted, taking nothing from the crank: the pull you get in return for the [[lag|lag]].'], focus: ['turbo-jar'] },
      { title: ['机械增压：马上有，但被吃掉一块', 'The supercharger: instant, minus a slice'], text: ['机械增压一下就有增压，但读数里能看到被它自己用掉的那部分。', 'The supercharger boosts instantly, but its readout shows the slice it uses itself.'],
        why: ['它靠曲轴带动，增压越高吃掉的动力越多，所以最后的净动力比涡轮低一些。', 'It is driven by the crank, and the more it boosts the more it takes, so its net power ends a little below the turbo\'s.'], focus: ['sc-jar'] },
      { title: ['换到高原试试', 'Now try high altitude'], text: ['切到"高原 3650 米"再踩一次：自然吸气和机械增压都掉了三成多，涡轮能补回大部分。', 'Switch to 3,650 m and floor it again: the NA and supercharged engines lose over a third, while the turbo wins most of it back.'],
        why: ['高原空气稀，每口吸进的都少。机械增压只能按固定比例放大，涡轮却能转得更快，把空气压回接近海平面的水平。', 'Thin air means less in every breath. A supercharger can only multiply it by a fixed ratio, but a turbo can spin faster and pack it back up to nearly sea-level levels.'], focus: ['chart', 'turbo-jar'] }
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
    id: 'twincharge', group: 'induction', view: 'twin', kind: 'flow',
    eyebrow: 'TWINCHARGING & E-BOOST',
    name: ['双增压与电动增压', 'Twincharging & e-boost'],
    tagline: ['机械增压补低转，涡轮管高转', 'Supercharger down low, turbo up top'],
    facts: [[['组合', 'Combines'], ['机械增压 + 涡轮，或电机带动压气机', 'Supercharger + turbo, or a motor-driven compressor']], [['目的', 'Aim'], ['消除迟滞，全转速都有劲', 'No lag, boost at every rpm']], [['常见于', 'Found in'], ['大众 1.4 TSI、沃尔沃 T6、AMG SL 43', 'VW 1.4 TSI, Volvo T6, AMG SL 43']]],
    card: ['两种增压接力，或者用电机消除迟滞。', 'Two boosters in relay, or a motor that kills lag.'],
    lead: ['涡轮怕低转速，机械增压怕高转速，那就两个一起上：低转速时机械增压先顶上，转速上来后交给涡轮。另一种思路更直接：用电机把压气机或涡轮先转起来，叫电动增压。', 'A turbo struggles at low revs, a supercharger at high revs, so use both: the supercharger covers the bottom and the turbo takes over as the revs rise. The more direct idea is to spin the compressor or turbo with an electric motor: electric boost.'],
    analogy: ['像接力赛：起跑交给爆发力强的选手，后程交给耐力好的选手。', 'Like a relay: the explosive starter runs the first leg, the endurance runner the rest.'],
    steps: [
      { rpm: 1500, title: ['低转速：机械增压先顶上', 'Low revs: the supercharger steps in'], text: ['转速低，涡轮还转不起来；离合器把机械增压接上，马上就有增压。', 'At low revs the turbo cannot spin up yet, so a clutch engages the supercharger for instant boost.'],
        why: ['低转速时废气太少，吹不动涡轮；机械增压靠曲轴带动，不受这个限制。', 'There is too little exhaust at low revs to drive the turbo, but the supercharger runs off the crank and does not care.'], focus: ['sc', 'clutch'] },
      { rpm: 2800, title: ['中转速：两个一起', 'Mid revs: both together'], text: ['涡轮转起来了，两个增压器串联：机械增压先压一次，涡轮再压一次。', 'The turbo is spinning up and the two work in series: the supercharger squeezes first, then the turbo.'],
        why: ['交接的这段转速里两个一起工作，增压不会出现断档。', 'Working together through the handover, they leave no dip in boost.'], focus: ['sc', 'turbo'] },
      { rpm: 5000, title: ['高转速：交给涡轮', 'High revs: over to the turbo'], text: ['转速高了，离合器松开、旁通阀打开，空气绕过机械增压，只用涡轮。', 'At high revs the clutch lets go and a bypass valve opens, so the air skips the supercharger and the turbo works alone.'],
        why: ['这时废气足够让涡轮独自干活；让机械增压歇着，它就不再吃发动机的力气。', 'By now there is exhaust enough for the turbo alone, and resting the supercharger stops it eating engine power.'], focus: ['turbo', 'bypass'] },
      { rpm: 3000, title: ['结果：全转速都有劲', 'The result: boost everywhere'], text: ['看左下的曲线：合在一起，从低转到高转的增压都很饱满。', 'The curve bottom left shows strong boost from low revs to high.'],
        why: ['每个增压器只在自己擅长的转速段工作，互相补上对方的短处，所以没有明显的空档。', 'Each works only where it is best, covering the other\'s weak spot, so there is no obvious gap.'], focus: ['chart'] },
      { rpm: 2000, title: ['另一种办法：电动增压', 'The other way: electric boost'], text: ['另一种办法是用电机直接把压气机（或涡轮轴）转起来。点"模拟一脚地板油"，看右下谁先到位。', 'The other way is to spin the compressor (or the turbo shaft) with an electric motor. Press "Floor the throttle" and see which arrives first, bottom right.'],
        why: ['电机一通电就转，不用等废气，所以几乎没有迟滞；代价是要一套更强的电气系统。', 'A motor spins the moment it is powered, with no waiting for exhaust, so there is almost no lag; the price is a stronger electrical system.'], focus: ['eboost'] }
    ],
    parts: {
      sc: { name: ['机械增压器', 'Supercharger'], text: ['由曲轴经皮带驱动，低转速就能马上增压。', 'Belt-driven from the crank, it boosts instantly at low revs.'] },
      clutch: { name: ['电磁离合器', 'Clutch'], text: ['需要时把机械增压接上，不需要时松开，免得白白吃动力。', 'Engages the supercharger when needed and lets go when not, so it does not waste power.'] },
      bypass: { name: ['旁通阀', 'Bypass valve'], text: ['机械增压歇着的时候打开，让空气绕过它直接去涡轮。', 'Opens when the supercharger rests, letting air go around it to the turbo.'] },
      turbo: { name: ['涡轮增压器', 'Turbocharger'], text: ['废气驱动，转速越高越有劲。', 'Exhaust-driven, stronger as the revs rise.'] },
      chart: { name: ['增压曲线', 'Boost curves'], text: ['虚线是单独用一种增压，黄线是两个合起来。', 'The dashed lines are each booster alone; the yellow line is both together.'] },
      eboost: { name: ['电动增压', 'Electric boost'], text: ['电机直接带动压气机或涡轮轴，几乎没有迟滞。', 'A motor drives the compressor or turbo shaft directly, with almost no lag.'] }
    },
    pros: [
      ['从低转到高转都有增压，几乎没有迟滞。', 'Boost from low to high revs with almost no lag.'],
      ['小排量也能兼顾低转扭矩和高转功率。', 'Even a small engine gets both low-rev torque and top-end power.'],
      ['电动增压还能和 48V 轻混系统配合。', 'Electric boost pairs well with 48 V mild-hybrid systems.']
    ],
    cons: [
      ['两套增压系统，结构复杂、成本高。', 'Two boost systems: complex and costly.'],
      ['机械增压和涡轮的交接需要精细控制。', 'The handover between supercharger and turbo needs careful control.'],
      ['电动增压需要更强的电气系统。', 'Electric boost needs a stronger electrical system.']
    ],
    cars: [
      { name: ['大众高尔夫 1.4 TSI 双增压', 'VW Golf 1.4 TSI Twincharger'], engine: ['1.4 TSI', '1.4 TSI'], tags: [tags.i4, tags.twincharged], why: ['把双增压带进普通家用车。', 'Brought twincharging to an everyday car.'] },
      { name: ['沃尔沃 XC90 T6', 'Volvo XC90 T6'], engine: ['2.0 Drive-E', '2.0 Drive-E'], tags: [tags.i4, tags.twincharged], why: ['2.0 升四缸，同时用机械增压和涡轮。', 'A 2.0-litre four with both a supercharger and a turbo.'] },
      { name: ['奥迪 SQ7 TDI', 'Audi SQ7 TDI'], engine: ['4.0 V8 TDI', '4.0 V8 TDI'], tags: [tags.v8, tags.eboost], why: ['量产车上最早用电动压气机的车型之一。', 'One of the first production cars with an electric compressor.'] },
      { name: ['梅赛德斯-AMG SL 43', 'Mercedes-AMG SL 43'], engine: ['2.0 四缸', '2.0 inline-four'], tags: [tags.i4, tags.eturbo], why: ['电动废气涡轮，技术来自 F1。', 'An electric exhaust gas turbocharger, with technology from F1.'] }
    ],
    myth: {
      q: ['电动涡轮和 F1 的 MGU-H 有关系吗？', 'Is an e-turbo related to F1\'s MGU-H?'],
      a: ['有。AMG 的电动废气涡轮就是从 F1 技术来的：涡轮轴上装一个电机，起步时用它把涡轮转起来消除迟滞。F1 在 2014–2025 年用的 MGU-H 也是这个思路，还能反过来发电。', 'Yes. AMG\'s electric exhaust gas turbocharger comes from F1: a motor on the turbo shaft spins it up to kill lag. F1\'s MGU-H (2014–2025) worked the same way, and could generate too.']
    }
  },
  {
    id: 'inline-4', group: 'layout', view: 'inline4', kind: 'crank', scrub: 'angle', speed: 18,
    eyebrow: 'INLINE-FOUR',
    name: ['直列四缸', 'Inline-four'],
    tagline: ['四个缸排一排', 'Four in a row'],
    facts: [[['布局', 'Layout'], ['直列', 'Inline']], [['缸数', 'Cylinders'], ['4', '4']], [['点火顺序', 'Firing order'], ['1-3-4-2', '1-3-4-2']], [['常见于', 'Found in'], ['大多数家用车和小钢炮', 'Most family cars and hot hatches']]],
    card: ['最常见的布局，1-3-4-2 轮流点火。', 'The most common layout, firing 1-3-4-2.'],
    lead: ['街上大多数车都是它：四个缸排成一排，轮流出力，每转半圈就有一个缸在做功。MX-5、高尔夫 GTI、思域 Type R 都是直列四缸，只是进气方式不同。', 'Most cars on the road use it: four cylinders in a row taking turns, one power stroke every half turn. The MX-5, Golf GTI and Civic Type R are all inline-fours that breathe differently.'],
    analogy: ['像四个人划同一条船：大家轮流用力，船就一直有人推着走。', 'Like four rowers in one boat taking turns to pull: there is always someone pushing.'],
    start: 10,
    // The guide stops as each cylinder fires, at its own top dead centre.
    steps: [
      { at: 0, until: 180, tone: 'burn', title: ['1 缸点火', 'Cylinder 1 fires'],
        text: ['1 缸到达上止点、点火做功。同一时刻，2 缸在排气，3 缸在压缩，4 缸在进气。', 'Cylinder 1 reaches the top and fires. At the same moment 2 is exhausting, 3 compressing and 4 breathing in.'],
        why: ['四个缸互相错开一个冲程，就能轮流出力：任何时候都有一个缸在做功。', 'With the four a stroke apart, they take turns: one of them is always making power.'],
        focus: ['cyl1', 'timeline'] },
      { at: 180, until: 360, tone: 'burn', title: ['3 缸点火', 'Cylinder 3 fires'],
        text: ['曲轴转了半圈（180°），轮到 3 缸点火。[[firing-order|点火顺序]]是 1-3-4-2。', 'Half a turn (180°) later it is cylinder 3\'s turn. The [[firing-order|firing order]] is 1-3-4-2.'],
        why: ['不按 1-2-3-4 的顺序，是为了让相邻的缸尽量不接连发力，曲轴和轴承受力更均匀。', 'It is not 1-2-3-4 so that neighbouring cylinders do not fire back to back, which spreads the load along the crank and its bearings.'],
        focus: ['cyl3', 'timeline'] },
      { at: 360, until: 540, tone: 'burn', title: ['4 缸点火', 'Cylinder 4 fires'],
        text: ['4 缸点火。注意 1 缸和 4 缸的活塞总是一起上下，2 缸和 3 缸正好和它们相反。', 'Cylinder 4 fires. Notice that pistons 1 and 4 always move together, and 2 and 3 move opposite them.'],
        why: ['1、4 缸的曲拐朝同一个方向，2、3 缸朝相反方向，所以总是两个一起上、两个一起下，大部分惯性力互相抵消。', 'Throws 1 and 4 point the same way and 2 and 3 the opposite way, so two pistons always rise as two fall, cancelling most of the shake.'],
        focus: ['cyl4', 'cyl1', 'timeline'] },
      { at: 540, until: 720, tone: 'burn', title: ['2 缸点火', 'Cylinder 2 fires'],
        text: ['最后是 2 缸，然后回到 1 缸。打开"加平衡轴"，看右边的抖动表。', 'Finally cylinder 2, then back to 1. Turn on the balance shafts and watch the shake meter.'],
        why: ['活塞在上半程比下半程跑得快，这一点抵消不掉，于是直列四缸每转会抖两次。大排量四缸常用两根[[balance-shaft|平衡轴]]把它抵消。', 'A piston moves faster in the top half of its stroke than the bottom, and that does not cancel, so an inline-four shakes twice per turn. Larger fours cancel it with [[balance-shaft|balance shafts]].'],
        focus: ['cyl2', 'shake'] }
    ],
    parts: {
      cyl1: { name: ['1 缸', 'Cylinder 1'], text: ['离发动机前端最近的缸。', 'The cylinder nearest the front.'] },
      cyl2: { name: ['2 缸', 'Cylinder 2'], text: ['和 3 缸的活塞同步。', 'Moves in step with 3.'] },
      cyl3: { name: ['3 缸', 'Cylinder 3'], text: ['1 缸之后第二个点火。', 'Fires second, after 1.'] },
      cyl4: { name: ['4 缸', 'Cylinder 4'], text: ['和 1 缸的活塞同步，但晚一圈点火。', 'Moves with 1, but fires a turn later.'] },
      crank: { name: ['曲轴', 'Crankshaft'], text: ['一根轴连着四个曲拐：1、4 缸的朝一边，2、3 缸的朝另一边。', 'One shaft with four throws: 1 and 4 point one way, 2 and 3 the other.'] },
      timeline: { name: ['点火顺序', 'Firing order'], text: ['一个循环（两圈）里谁先谁后点火，红线是现在的位置。', 'Who fires when over one cycle (two turns); the red line is now.'] },
      shake: { name: ['抖动表', 'Shake meter'], text: ['四个活塞上下时留下的"不平衡"，每转两次。', 'The imbalance left by four pistons moving up and down, twice per turn.'] },
      balance: { name: ['平衡轴', 'Balance shafts'], text: ['以两倍转速反向旋转的配重轴，抵消抖动。', 'Weighted shafts spinning at twice crank speed in opposite directions, cancelling the shake.'] },
      push: { name: ['推力曲线', 'Push graph'], text: ['四个缸的做功正好首尾相接，所以推力会一次次掉到零：这就是四缸不如六缸顺的原因。', 'The four power strokes just touch end to end, so the push drops to zero between them: that is why a four feels less smooth than a six.'] }
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
    id: 'inline-6', group: 'layout', view: 'inline6', kind: 'crank', scrub: 'angle', speed: 16,
    eyebrow: 'INLINE-SIX',
    name: ['直列六缸', 'Inline-six'],
    tagline: ['天生平顺', 'Born smooth'],
    facts: [[['布局', 'Layout'], ['直列', 'Inline']], [['缸数', 'Cylinders'], ['6', '6']], [['点火顺序', 'Firing order'], ['1-5-3-6-2-4', '1-5-3-6-2-4']], [['常见于', 'Found in'], ['宝马、丰田 Supra', 'BMW, Toyota Supra']]],
    card: ['六缸一排，抖动自己抵消。', 'Six in a row; the shakes cancel themselves.'],
    lead: ['在直列四缸后面再加两个缸：六个缸排一排，每转 120° 就有一个缸点火。它的抖动会自己互相抵消，连平衡轴都不用。宝马和丰田 Supra 的招牌就是它。', 'Add two cylinders to an inline-four: six in a row, one firing every 120°. Its shakes cancel each other out, with no balance shafts needed. It is the signature of BMW and the Toyota Supra.'],
    analogy: ['像六个人划同一条船，前三个和后三个的动作像照镜子一样对称，船身一点也不晃。', 'Like six rowers where the front three mirror the back three: the boat does not rock at all.'],
    start: 10,
    // The guide stops as each cylinder fires, at its own top dead centre.
    steps: [
      { at: 0, until: 120, tone: 'burn', title: ['1 缸点火', 'Cylinder 1 fires'],
        text: ['1 缸点火。[[firing-order|点火顺序]]是 1-5-3-6-2-4，每转 120° 就有一个缸点火。', 'Cylinder 1 fires. The [[firing-order|firing order]] is 1-5-3-6-2-4: one firing every 120°.'],
        why: ['六个缸分一个 720° 的循环，间隔就是 120°，比四缸的 180° 更密，动力更连贯。', 'Six cylinders share a 720° cycle, so they are 120° apart, closer than a four\'s 180°, and the power flows more evenly.'],
        focus: ['cyl1', 'timeline'] },
      { at: 120, until: 240, tone: 'burn', title: ['5 缸点火', 'Cylinder 5 fires'],
        text: ['5 缸点火时，1 缸还在做功。看上面的推力曲线：它从不掉到零。', 'When 5 fires, cylinder 1 is still pushing. The push graph above never drops to zero.'],
        why: ['每个缸做功要持续 180°，间隔却只有 120°，前后两个缸的做功总有重叠。', 'Each power stroke lasts 180° but they come every 120°, so consecutive ones always overlap.'],
        focus: ['cyl5', 'push'] },
      { at: 240, until: 360, tone: 'burn', title: ['3 缸点火', 'Cylinder 3 fires'],
        text: ['3 缸点火。看活塞：1 和 6、2 和 5、3 和 4 两两一起上下，前三缸和后三缸像照镜子。', 'Cylinder 3 fires. Pistons move in pairs, 1 with 6, 2 with 5, 3 with 4: the front three mirror the back three.'],
        why: ['镜像排列让前后两半的摇摆互相抵消，整根曲轴不会像跷跷板一样晃。', 'The mirror image makes the two halves cancel each other\'s rocking, so the crank does not see-saw.'],
        focus: ['cyl3', 'cyl4'] },
      { at: 360, until: 480, tone: 'burn', title: ['6 缸点火', 'Cylinder 6 fires'],
        text: ['6 缸点火。右边的抖动表一动不动。', 'Cylinder 6 fires. The shake meter on the right stays still.'],
        why: ['四缸那种每转两次的抖动，在六个缸里被完全抵消了，所以直六不用[[balance-shaft|平衡轴]]也很顺。', 'The twice-per-turn shake of a four cancels out completely across six, so an inline-six is smooth without [[balance-shaft|balance shafts]].'],
        focus: ['cyl6', 'shake'] },
      { at: 480, until: 600, tone: 'burn', title: ['2 缸点火', 'Cylinder 2 fires'],
        text: ['2 缸点火。看看整台发动机有多长。', 'Cylinder 2 fires. Look at how long the whole engine is.'],
        why: ['代价是长：六个缸排一排，一般只能纵向放在长长的车头里，宝马和丰田 Supra 就是这样。', 'The cost is length: six in a row usually has to sit lengthwise under a long bonnet, as in BMWs and the Toyota Supra.'],
        focus: ['cyl2', 'crank'] },
      { at: 600, until: 720, tone: 'burn', title: ['4 缸点火', 'Cylinder 4 fires'],
        text: ['最后是 4 缸，然后回到 1 缸，循环重复。', 'Finally cylinder 4, then back to cylinder 1, and round again.'],
        why: ['曲轴转两圈，六个缸各点一次火，正好是一个完整的四冲程循环。', 'In two turns of the crank each of the six fires once: exactly one four-stroke cycle.'],
        focus: ['cyl4', 'timeline'] }
    ],
    parts: {
      cyl1: { name: ['1 缸', 'Cylinder 1'], text: ['和 6 缸一起上下。', 'Moves with cylinder 6.'] },
      cyl2: { name: ['2 缸', 'Cylinder 2'], text: ['和 5 缸一起上下。', 'Moves with cylinder 5.'] },
      cyl3: { name: ['3 缸', 'Cylinder 3'], text: ['和 4 缸一起上下。', 'Moves with cylinder 4.'] },
      cyl4: { name: ['4 缸', 'Cylinder 4'], text: ['和 3 缸一起上下，但晚一圈点火。', 'Moves with 3, but fires a turn later.'] },
      cyl5: { name: ['5 缸', 'Cylinder 5'], text: ['和 2 缸一起上下。', 'Moves with cylinder 2.'] },
      cyl6: { name: ['6 缸', 'Cylinder 6'], text: ['和 1 缸一起上下。', 'Moves with cylinder 1.'] },
      crank: { name: ['曲轴', 'Crankshaft'], text: ['一根长轴连着六个曲拐，分成三对，互相差 120°。', 'One long shaft with six throws in three pairs, 120° apart.'] },
      timeline: { name: ['点火顺序', 'Firing order'], text: ['一个循环（两圈）里谁先谁后点火，红线是现在的位置。', 'Who fires when over one cycle (two turns); the red line is now.'] },
      push: { name: ['推力曲线', 'Push graph'], text: ['六个缸的做功互相重叠，推力从不掉到零。和直列四缸那一页比一比。', 'Six overlapping power strokes keep the push from ever dropping to zero. Compare with the inline-four.'] },
      shake: { name: ['抖动表', 'Shake meter'], text: ['直六的一阶、二阶惯性力都能自己抵消，所以指针不动。', 'An inline-six cancels its primary and secondary forces, so the needle stays still.'] }
    },
    pros: [
      ['一阶、二阶抖动都能自己抵消，不用平衡轴，天生平顺。', 'Primary and secondary forces cancel: smooth by nature, no balance shafts.'],
      ['每 120° 一次做功，做功互相重叠，动力连绵不断。', 'A power stroke every 120°, overlapping, so the pull never lets up.'],
      ['声音顺滑，配上涡轮也很容易出大马力。', 'A silky sound, and it takes a turbo well.']
    ],
    cons: [
      ['很长，横着放不下，大多只能纵向放。', 'Long: it rarely fits sideways, so it usually sits lengthwise.'],
      ['曲轴长，容易产生扭转振动，要专门减振。', 'A long crank is prone to twisting vibration and needs damping.'],
      ['比四缸更重、更贵。', 'Heavier and more expensive than a four.']
    ],
    cars: [
      { name: ['宝马 M3', 'BMW M3'], engine: ['S58 3.0', 'S58 3.0'], tags: [tags.i6, tags.twin], why: ['宝马直六的代表作。', 'BMW\'s signature inline-six.'] },
      { name: ['丰田 GR Supra', 'Toyota GR Supra'], engine: ['B58 3.0', 'B58 3.0'], tags: [tags.i6, tags.turbo], why: ['用的是宝马 B58 直六。', 'Powered by BMW\'s B58 inline-six.'] },
      { name: ['日产 Skyline GT-R（R34）', 'Nissan Skyline GT-R (R34)'], engine: ['RB26DETT 2.6', 'RB26DETT 2.6'], tags: [tags.i6, tags.twin], why: ['日本性能车的传奇直六。', 'A legendary Japanese inline-six.'] }
    ],
    myth: {
      q: ['为什么都说直六是"最完美"的布局？', 'Why is the inline-six called "perfect"?'],
      a: ['因为它的一阶、二阶惯性力和力矩都能自己抵消，不用平衡轴就很平顺。"完美"说的是平衡，不是最快；它的缺点是太长。', 'Because its primary and secondary forces and couples all cancel, so it runs smoothly with no balance shafts. "Perfect" means balance, not speed; its weakness is length.']
    }
  },
  {
    id: 'v6', group: 'layout', view: 'v6', kind: 'crank', scrub: 'angle', speed: 16,
    eyebrow: 'V6',
    name: ['V6', 'V6'],
    tagline: ['把六个缸折成 V 字', 'Six cylinders folded into a V'],
    facts: [[['布局', 'Layout'], ['V 形，这里画的是 60°', 'V, drawn here at 60°']], [['缸数', 'Cylinders'], ['6', '6']], [['点火间隔', 'Firing interval'], ['120°', '120°']], [['常见于', 'Found in'], ['GT-R、法拉利 296、F1', 'GT-R, Ferrari 296, F1']]],
    card: ['短小紧凑，F1 用的也是它。', 'Short and compact, and what F1 uses.'],
    lead: ['把直列六缸从中间折起来：两排、各三个缸，摆成 V 字。长度只有直六的一半，什么车头都塞得进。F1 赛车用的就是 1.6 升 V6 涡轮。', 'Fold an inline-six in half: two banks of three in a V. Half the length of an inline-six, it fits almost anywhere. F1 cars run a 1.6-litre turbo V6.'],
    analogy: ['像把一条长凳折成两张短凳并排放：能坐的人一样多，占的地方短了一半。', 'Like folding one long bench into two short ones side by side: the same seats in half the length.'],
    steps: [
      { title: ['两排各三个缸', 'Two banks of three'], text: ['从正前方看，两排气缸成 60° 夹角，共用一根曲轴。', 'From the front, two banks sit 60° apart and share one crankshaft.'],
        why: ['两排并起来，六个缸只占三个缸的长度。', 'Side by side, six cylinders take up the length of three.'],
        focus: ['front', 'banks'] },
      { title: ['两排轮流点火', 'The banks take turns'], text: ['左右两排交替点火，整台发动机每 120° 点一次火。', 'The banks fire alternately, one firing every 120° for the whole engine.'],
        why: ['每一排自己隔 240° 才点一次，两排一交错，就和直六一样均匀。', 'Each bank alone fires only every 240°; interleaved, they are as even as an inline-six.'],
        focus: ['timeline', 'banks'] },
      { title: ['曲拐错开一点', 'Offset crank pins'], text: ['看左边：两根连杆连在曲轴上不同的位置，也就是曲拐错开了。', 'On the left, the two rods sit on different crank pins: the pins are offset.'],
        why: ['60° 夹角配上错开的曲拐，六个缸才能每 120° 均匀点火。', 'With a 60° V, offset pins are what let the six fire evenly every 120°.'],
        focus: ['front'] },
      { title: ['推力和直六一样', 'As much push as a six'], text: ['看推力曲线：六个缸的做功同样互相重叠。', 'The push graph shows six power strokes overlapping.'],
        why: ['做功持续 180°、间隔 120°，所以总有缸在推，几乎和直六一样平顺。', 'Each lasts 180° and they come every 120°, so something is always pushing, almost as smoothly as an inline-six.'],
        focus: ['push'] },
      { title: ['短，所以好装', 'Short, so it fits'], text: ['只有直六一半长，可以横着放进普通轿车，也能放在跑车座椅后面。', 'Half as long as an inline-six, it fits sideways in a family car or behind a sports car\'s seats.'],
        why: ['代价是不如直六天生平衡，常常需要[[balance-shaft|平衡轴]]。', 'The cost is that it is less naturally balanced than an inline-six, so it often needs a [[balance-shaft|balance shaft]].'],
        focus: ['front', 'rhythm'] }
    ],
    parts: {
      front: { name: ['正面剖视', 'Front section'], text: ['从正前方看到的两排第一个缸，共用一根曲轴。', 'The front cylinder of each bank, seen head-on, sharing one crankshaft.'] },
      banks: { name: ['两排气缸', 'The two banks'], text: ['每排三个缸，亮起的是正在点火的缸。', 'Three per bank; the lit one is firing.'] },
      timeline: { name: ['点火顺序', 'Firing order'], text: ['左右两排交替，每 120° 一次。', 'The banks alternate, one firing every 120°.'] },
      push: { name: ['推力曲线', 'Push graph'], text: ['六个缸互相接力，推力不会掉到零。', 'Six cylinders relay, so the push never drops out.'] },
      rhythm: { name: ['每排的节奏', 'Rhythm per bank'], text: ['单看一排，它每 240° 点一次火，很均匀。', 'Within one bank it fires every 240°, evenly.'] }
    },
    pros: [
      ['短小紧凑，横着放、竖着放都行。', 'Compact enough to sit sideways or lengthwise.'],
      ['六缸的平顺和动力，体积接近四缸。', 'Six-cylinder smoothness and power in nearly a four\'s space.'],
      ['比直六矮、重心低，适合中置跑车和赛车。', 'Lower than an inline-six, which suits mid-engined cars and racers.']
    ],
    cons: [
      ['不如直六天生平衡，常常需要平衡轴或特殊的曲轴。', 'Less naturally balanced than an inline-six; often needs a balance shaft or special crank.'],
      ['两个缸盖、两套凸轮轴，零件更多、更贵。', 'Two cylinder heads and two sets of cams: more parts, more cost.'],
      ['比直列发动机更宽。', 'Wider than an inline engine.']
    ],
    cars: [
      { name: ['日产 GT-R（R35）', 'Nissan GT-R (R35)'], engine: ['VR38DETT 3.8', 'VR38DETT 3.8'], tags: [tags.v6, tags.twin], why: ['60° 双涡轮 V6，每台由一位匠人手工组装。', 'A 60° twin-turbo V6, each hand-built by one craftsman.'] },
      { name: ['法拉利 296 GTB', 'Ferrari 296 GTB'], engine: ['3.0 V6', '3.0 V6'], tags: [tags.v6, tags.twinHybrid], why: ['120° 夹角，两个涡轮装在 V 字中间，再加电机。', 'A 120° V with both turbos inside the vee, plus a motor.'] },
      { name: ['F1 赛车', 'Formula 1 car'], engine: ['1.6 升 90° V6', '1.6 L 90° V6'], tags: [tags.v6, tags.turboHybrid], why: ['规则规定的 V6 涡轮，再配大功率电机。', 'A rules-mandated turbo V6 paired with a powerful motor.'] }
    ],
    myth: {
      q: ['V6 是"缩水版"的 V8 吗？', 'Is a V6 just a downgraded V8?'],
      a: ['不是。选 V6 往往是为了体积和效率：配上涡轮，V6 能比老式 V8 更有力。GT-R 和 F1 就是例子。', 'No. A V6 is usually chosen for size and efficiency, and with turbos it can out-muscle an older V8. The GT-R and F1 are proof.']
    }
  },
  {
    id: 'v8', group: 'layout', view: 'v8', kind: 'crank', scrub: 'angle', speed: 14,
    eyebrow: 'CROSS-PLANE VS FLAT-PLANE V8',
    name: ['V8', 'V8'],
    tagline: ['同样八个缸，两种声音', 'Eight cylinders, two voices'],
    facts: [[['布局', 'Layout'], ['V 形 90°', '90° V']], [['缸数', 'Cylinders'], ['8', '8']], [['曲轴', 'Crank'], ['十字 / 平面', 'Cross-plane / flat-plane']], [['常见于', 'Found in'], ['美式肌肉车、超跑', 'Muscle cars and supercars']]],
    card: ['十字曲轴"突突"，平面曲轴尖啸。', 'Cross-plane burbles, flat-plane screams.'],
    lead: ['两排各四个缸，摆成 V 字。同样是 V8，美式肌肉车"突突突"，法拉利、Corvette Z06 却在尖啸。区别不在缸数，而在曲轴长什么样。', 'Two banks of four in a V. Some V8s burble like a muscle car, others scream like a Ferrari or a Corvette Z06. The difference is not the cylinder count but the shape of the crank.'],
    analogy: ['像两支鼓队：一支打着忽快忽慢的切分节奏，另一支每一下都均匀整齐。', 'Like two drum lines: one plays a lopsided, syncopated beat; the other hits every beat evenly.'],
    steps: [
      { title: ['先看曲轴形状', 'Look at the crank'], text: ['从端面看，左边的曲轴是"十"字，四个曲拐指向四个方向；右边是"一"字，只有两个方向。', 'Seen end-on, the left crank is a cross with throws in four directions; the right one is flat, with just two.'],
        why: ['曲拐的方向决定每个缸什么时候到顶，也就决定了点火的节奏和声音。', 'Where the throws point decides when each cylinder reaches the top, and so the firing rhythm and the sound.'],
        focus: ['crank-cross', 'crank-flat'] },
      { title: ['两台都是每 90° 点一次火', 'Both fire every 90°'], text: ['八个缸轮流点火，两台发动机整体都是每转 90° 点一次火。', 'Eight cylinders take turns, so both engines fire every 90° overall.'],
        why: ['八个缸分一个 720° 的循环，间隔就是 90°，这和曲轴形状无关。', 'Eight cylinders sharing a 720° cycle are 90° apart, whatever the crank looks like.'],
        focus: ['banks-cross', 'banks-flat'] },
      { title: ['十字曲轴：一排里忽快忽慢', 'Cross-plane: uneven within a bank'], text: ['只看一排（一侧的排气管）：间隔是 180°、270°、180°、90°。', 'Within one bank (one exhaust pipe) the gaps run 180°, 270°, 180°, 90°.'],
        why: ['同一侧排气管里的废气脉冲忽快忽慢，于是有了 V8 那种低沉、不均匀的"突突"声。', 'The pulses in each exhaust pipe come unevenly, which gives the classic deep V8 burble.'],
        focus: ['timeline-cross'] },
      { title: ['平面曲轴：一排里均匀', 'Flat-plane: even within a bank'], text: ['每一排都是均匀的 180°，就像两台直列四缸并排。', 'Each bank fires evenly every 180°, like two inline-fours side by side.'],
        why: ['每侧的排气脉冲均匀，声音更高亢、像尖啸，排气也更容易调得顺畅。', 'Even pulses in each exhaust give a higher, screaming sound, and the exhaust is easier to tune.'],
        focus: ['timeline-flat'] },
      { title: ['各有代价', 'Each has a cost'], text: ['十字曲轴平衡好，但配重大、转不太高；平面曲轴更轻、转得更高，但抖动更明显。', 'The cross-plane is smoother but needs heavy counterweights and revs lower; the flat-plane is lighter and revs higher but shakes more.'],
        why: ['十字曲轴靠很重的配重抵消抖动；平面曲轴像两台直四，也带着直四那种每转两次的抖动。', 'The cross-plane cancels its shake with heavy weights; the flat-plane behaves like two inline-fours, twice-per-turn shake included.'],
        focus: ['crank-cross', 'crank-flat'] }
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
  },
  {
    id: 'v12', group: 'layout', view: 'v12', kind: 'crank', scrub: 'angle', redline: 9000, speed: 12,
    eyebrow: 'V12',
    name: ['V12', 'V12'],
    tagline: ['两台直六，背靠背', 'Two inline-sixes back to back'],
    facts: [[['布局', 'Layout'], ['V 形 60°', '60° V']], [['缸数', 'Cylinders'], ['12', '12']], [['点火间隔', 'Firing interval'], ['60°', '60°']], [['常见于', 'Found in'], ['法拉利、兰博基尼、劳斯莱斯', 'Ferrari, Lamborghini, Rolls-Royce']]],
    card: ['每 60° 点一次火，顺滑得像电机。', 'A firing every 60°, as smooth as a motor.'],
    lead: ['V12 就是两台直列六缸共用一根曲轴。每转 60° 就有一个缸点火，任何时候都有三个缸同时在推，所以它顺滑得像电机，高转时的声音像交响乐。', 'A V12 is two inline-sixes sharing one crankshaft. A cylinder fires every 60°, so three are always pushing at once: smooth as an electric motor, and at high revs it sings.'],
    analogy: ['像一场接力赛，任何时候跑道上都有三个人同时在跑：速度永远不会断档。', 'Like a relay with three runners always on the track: the pace never drops.'],
    steps: [
      { title: ['两排各六个缸', 'Two banks of six'], text: ['每一排就是一台直列六缸，两排成 60° 夹角，共用一根曲轴。', 'Each bank is an inline-six; the two sit 60° apart on one crank.'],
        why: ['两台天生平衡的直六合在一起，长度却只有一台直六那么长。', 'It joins two naturally balanced inline-sixes in the length of one.'],
        focus: ['front', 'banks'] },
      { title: ['每 60° 点一次火', 'A firing every 60°'], text: ['十二个缸轮流点火：每转 60° 就有一个新的缸开始做功，左右两排交替。', 'Twelve cylinders take turns: a new power stroke every 60°, alternating banks.'],
        why: ['12 个缸分一个 720° 的循环，间隔只有 60°，所以 V12 高转时的声音密得像交响乐。', 'Twelve sharing a 720° cycle are only 60° apart, which is why a V12 at high revs sounds so dense, almost like one note.'],
        focus: ['timeline'] },
      { title: ['三个缸同时在推', 'Three pushing at once'], text: ['看推力曲线：几乎是一条平线。', 'The push graph is almost flat.'],
        why: ['每个缸做功持续 180°，间隔却只有 60°，任何时候都有三个缸一起在推。', 'Each power stroke lasts 180° but they come every 60°, so three cylinders are always pushing together.'],
        focus: ['push'] },
      { title: ['完美平衡', 'Perfect balance'], text: ['两排各自都是平衡的直六。', 'Each bank is a balanced inline-six.'],
        why: ['两个平衡的整体合在一起还是平衡的，所以 V12 完全不需要[[balance-shaft|平衡轴]]。', 'Two balanced halves make a balanced whole, so a V12 needs no [[balance-shaft|balance shafts]] at all.'],
        focus: ['banks', 'rhythm'] },
      { title: ['代价：又大又贵', 'The cost: big and expensive'], text: ['十二个缸、四根凸轮轴，又长又重。', 'Twelve cylinders and four camshafts make it long and heavy.'],
        why: ['零件多、油耗高，所以只出现在顶级跑车和豪华车上，现在也大多加上了电机。', 'All those parts and all that fuel keep it to supercars and limousines, and it now often comes with motors added.'],
        focus: ['front'] }
    ],
    parts: {
      front: { name: ['正面剖视', 'Front section'], text: ['每排第一个缸，共用一个曲拐。', 'The front cylinder of each bank, sharing one crank pin.'] },
      banks: { name: ['两排气缸', 'The two banks'], text: ['每排六个缸，亮起的是正在点火的缸。', 'Six per bank; the lit one is firing.'] },
      timeline: { name: ['点火顺序', 'Firing order'], text: ['十二个缸，每 60° 一次。', 'Twelve cylinders, one every 60°.'] },
      push: { name: ['推力曲线', 'Push graph'], text: ['任何时候都有三个缸在推，曲线几乎是平的。', 'Three always pushing, so the curve is almost flat.'] },
      rhythm: { name: ['每排的节奏', 'Rhythm per bank'], text: ['单看一排，就是一台每 120° 点火的直六。', 'Each bank on its own is an inline-six firing every 120°.'] }
    },
    pros: [
      ['几乎完美的平衡和顺滑。', 'Near-perfect balance and smoothness.'],
      ['同时有三个缸在推，动力没有断档。', 'Three cylinders always pushing: no gaps in the pull.'],
      ['高转时的声音，被很多人认为是最好听的发动机声。', 'At high revs, to many ears, the best engine sound there is.']
    ],
    cons: [
      ['又长又重，车头要做得很长。', 'Long and heavy; the car needs a long nose.'],
      ['零件多，造价和维护都很贵。', 'Lots of parts: expensive to build and maintain.'],
      ['油耗高，越来越难通过排放法规，很多加上了电机。', 'Thirsty and hard to get through emissions rules, so many now add motors.']
    ],
    cars: [
      { name: ['法拉利 12Cilindri', 'Ferrari 12Cilindri'], engine: ['6.5 V12', '6.5 V12'], tags: [tags.v12, tags.na], why: ['法拉利前置自吸 V12 的延续。', 'Ferrari\'s front-engined, naturally aspirated V12 lives on.'] },
      { name: ['兰博基尼 Revuelto', 'Lamborghini Revuelto'], engine: ['6.5 V12', '6.5 V12'], tags: [tags.v12, tags.naHybrid], why: ['自吸 V12 加三个电机的插电混动。', 'A naturally aspirated V12 with three motors, as a plug-in hybrid.'] },
      { name: ['劳斯莱斯 Phantom', 'Rolls-Royce Phantom'], engine: ['6.75 V12', '6.75 V12'], tags: [tags.v12, tags.twin], why: ['豪华车用它，看中的是安静和顺滑。', 'Luxury cars choose it for silence and smoothness.'] }
    ],
    myth: {
      q: ['F1 以前也用过 V12 吗？', 'Did F1 ever use V12s?'],
      a: ['用过。上世纪 90 年代法拉利等车队跑过自吸 V12，后来规则先后改成 V10、V8，现在是 1.6 升 V6 涡轮加电机。', 'Yes. In the 1990s Ferrari and others raced naturally aspirated V12s; the rules later moved to V10s, then V8s, and now 1.6-litre turbo V6s with motors.']
    }
  },
  {
    id: 'w16', group: 'layout', view: 'w16', kind: 'crank', scrub: 'angle', speed: 12,
    eyebrow: 'W16',
    name: ['W16', 'W16'],
    tagline: ['两台窄角 V8，拼成一个 W', 'Two narrow V8s folded into a W'],
    facts: [[['布局', 'Layout'], ['W 形：两个窄角 VR8 摆成 V 字', 'W: two narrow-angle VR8s in a V']], [['缸数', 'Cylinders'], ['16', '16']], [['点火间隔', 'Firing interval'], ['45°', '45°']], [['常见于', 'Found in'], ['布加迪 Veyron、Chiron', 'Bugatti Veyron, Chiron']]],
    card: ['16 个缸塞进 V8 的长度。', 'Sixteen cylinders in a V8\'s length.'],
    lead: ['16 个缸排成一排会长得离谱，于是布加迪把它们分成 4 排：每两排挤在一起组成一个夹角很小的"VR8"，两个 VR8 再摆成 V 字，从正面看就像字母 W。整台发动机只有 V8 那么长。', 'Sixteen cylinders in a row would be absurdly long, so Bugatti split them into four rows: each pair of rows forms a narrow-angle "VR8", and the two VR8s sit in a V, so from the front it looks like a W. The whole engine is only as long as a V8.'],
    analogy: ['像把一摞书错开着斜靠在一起：同样多的书，占的书架短得多。', 'Like stacking books staggered and leaning together: the same number of books on a much shorter shelf.'],
    steps: [
      { title: ['四排气缸', 'Four rows of cylinders'], text: ['从正前方看，16 个缸分成 4 排：每两排只差 15°，组成一个 VR8；两个 VR8 之间再成 90°。', 'From the front, sixteen cylinders sit in four rows: each pair of rows is only 15° apart, forming a VR8, and the two VR8s are 90° apart.'],
        why: ['两排挨得这么近，可以共用一个缸盖，所以一个 VR8 比普通 V8 窄得多。', 'Rows that close can share one cylinder head, so each VR8 is far narrower than a normal V8.'],
        focus: ['front'] },
      { title: ['为什么要这样排', 'Why pack it like that'], text: ['16 个缸排成直列会长得离谱，排成 V16 也很长。', 'Sixteen in a row would be absurdly long, and even a V16 is long.'],
        why: ['W 布局把 16 个缸压到和一台 V8 差不多长，才塞得进一台跑车。', 'The W packs sixteen into roughly a V8\'s length, short enough to fit in a sports car.'],
        focus: ['front', 'banks'] },
      { title: ['每 45° 点一次火', 'A firing every 45°'], text: ['16 个缸轮流点火，每转 45° 就有一个缸开始做功。', 'Sixteen cylinders take turns: a new power stroke every 45°.'],
        why: ['做功持续 180°、间隔 45°，任何时候都有 4 个缸在推，推力曲线几乎是一条平线。', 'Each lasts 180° and they come every 45°, so four are always pushing and the push graph is almost flat.'],
        focus: ['timeline', 'push'] },
      { title: ['四个涡轮', 'Four turbos'], text: ['布加迪的 W16 配了四个涡轮：低转速先用两个，转速上来后四个一起工作。', 'Bugatti\'s W16 has four turbos: two at low revs, all four as the revs rise.'],
        why: ['低转速废气少，只推两个涡轮能更快起压，减少[[lag|涡轮迟滞]]；高转速再用四个，吹进足够的空气。', 'At low revs there is little exhaust, and feeding it to two turbos builds boost sooner, cutting [[lag|turbo lag]]; at high revs all four are needed for enough air.'],
        focus: ['turbos'] },
      { title: ['代价：极其复杂', 'The cost: extreme complexity'], text: ['16 个缸、4 个涡轮，散热和结构都极其复杂。', 'Sixteen cylinders and four turbos make cooling and structure extremely complex.'],
        why: ['所以它又重又贵，只出现在顶级超跑上。布加迪的下一代 Tourbillon 已经换成了自然吸气 V16 加电机。', 'So it is heavy and costly, found only in hypercars. Bugatti\'s next car, the Tourbillon, switches to a naturally aspirated V16 with motors.'],
        focus: ['front', 'turbos'] }
    ],
    parts: {
      front: { name: ['正面剖视', 'Front section'], text: ['每排第一个缸，四个围着同一根曲轴。', 'The front cylinder of each row, all four around one crankshaft.'] },
      banks: { name: ['四排气缸', 'Four rows'], text: ['A、B 是左边的 VR8，C、D 是右边的；亮起的是正在点火的缸。', 'A and B make the left VR8, C and D the right; the lit one is firing.'] },
      timeline: { name: ['点火顺序', 'Firing order'], text: ['16 个缸，每 45° 一次。这里画的是一种均匀点火的示例顺序。', 'Sixteen cylinders, one every 45°. The order drawn is an even-firing example.'] },
      push: { name: ['推力曲线', 'Push graph'], text: ['任何时候都有 4 个缸在推。和 V12、直列四缸那几页比一比。', 'Four always pushing; compare with the V12 and the inline-four.'] },
      turbos: { name: ['四个涡轮', 'Four turbos'], text: ['低转速先用两个，转速上来后四个一起，兼顾响应和最大功率。', 'Two at low revs, all four higher up, for both response and top-end power.'] }
    },
    pros: [
      ['16 个缸的大排量和平顺，长度却和 V8 差不多。', 'The displacement and smoothness of sixteen cylinders in roughly a V8\'s length.'],
      ['任何时候都有 4 个缸在推，动力极其连贯。', 'Four cylinders always pushing: extremely seamless power.'],
      ['配上四个涡轮，能做出量产车里罕见的超高功率。', 'With four turbos, power rarely seen in a production car.']
    ],
    cons: [
      ['结构极其复杂，造价和维护都极贵。', 'Hugely complex, and very expensive to build and maintain.'],
      ['发热量巨大，需要大量散热器。', 'Huge heat output that needs many radiators.'],
      ['又宽又重，只适合顶级超跑。', 'Wide and heavy: only for hypercars.']
    ],
    cars: [
      { name: ['布加迪 Veyron', 'Bugatti Veyron'], engine: ['8.0 W16', '8.0 W16'], tags: [tags.w16, tags.quad], why: ['第一台用 W16 的量产车。', 'The first production car with a W16.'] },
      { name: ['布加迪 Chiron', 'Bugatti Chiron'], engine: ['8.0 W16', '8.0 W16'], tags: [tags.w16, tags.quad], why: ['W16 的巅峰之作。', 'The W16 at its peak.'] },
      { name: ['布加迪 Tourbillon', 'Bugatti Tourbillon'], engine: ['8.3 V16', '8.3 V16'], tags: [tags.v16, tags.naHybrid], why: ['布加迪的下一代：改用自然吸气 V16 加三个电机。', 'Bugatti\'s next chapter: a naturally aspirated V16 with three motors.'] },
      { name: ['宾利 Continental GT（W12）', 'Bentley Continental GT (W12)'], engine: ['6.0 W12', '6.0 W12'], tags: [tags.w12, tags.twin], why: ['同样是 W 布局，12 个缸，2024 年停产。', 'The same W idea with twelve cylinders; production ended in 2024.'] }
    ],
    myth: {
      q: ['W16 就是两台 V8 拼在一起吗？', 'Is a W16 just two V8s bolted together?'],
      a: ['差不多：它是两个窄角的 VR8 摆成 V 字。但它们共用一个曲轴箱和一根曲轴，并不是把两台发动机简单连起来。', 'Close: it is two narrow-angle VR8s set in a V. But they share one crankcase and one crankshaft; it is not two engines coupled together.']
    }
  },
  {
    id: 'boxer', group: 'layout', view: 'boxer', kind: 'crank', scrub: 'angle', speed: 16,
    eyebrow: 'BOXER',
    name: ['水平对置', 'Boxer'],
    tagline: ['活塞面对面出拳', 'Pistons trading punches'],
    facts: [[['布局', 'Layout'], ['水平对置（180°）', 'Horizontally opposed (180°)']], [['缸数', 'Cylinders'], ['4 或 6', '4 or 6']], [['特点', 'Character'], ['又扁又低，重心低', 'Flat and low']], [['常见于', 'Found in'], ['保时捷 911、斯巴鲁', 'Porsche 911, Subaru']]],
    card: ['平躺的发动机，重心低。', 'An engine lying flat, with a low centre of gravity.'],
    lead: ['把 V 字一直张开到 180°，两排气缸就平躺在曲轴两边。相对的两个活塞同时向外、同时向内，像拳击手对打，所以叫 Boxer。保时捷 911 和斯巴鲁一直在用。', 'Open a V all the way to 180° and the two banks lie flat either side of the crank. Opposite pistons punch out and pull back together, like boxers, hence the name. Porsche\'s 911 and Subaru have used it for decades.'],
    analogy: ['像两个人隔着桌子同时伸手、同时收手：力气互相抵消，桌子一点不晃。', 'Like two people across a table reaching out and pulling back at the same moment: the forces cancel and the table stays still.'],
    steps: [
      { title: ['平躺的两排气缸', 'Two banks lying flat'], text: ['从正前方看，气缸横躺在曲轴两边，整台发动机又宽又扁。', 'From the front, the cylinders lie flat either side of the crank: wide and low.'],
        why: ['对面两个缸的曲拐方向相反，所以它们的活塞会同时往外、同时往里，下一步就能看到。', 'Opposite cylinders have throws pointing opposite ways, so their pistons move out and in together, as the next step shows.'],
        focus: ['front'] },
      { title: ['同时向外，同时向内', 'Out together, in together'], text: ['相对的两个活塞总是同时往外推、同时往回收，像在拍手。', 'Opposite pistons always move out together and back together, like clapping.'],
        why: ['一个往左、一个往右，惯性力大小相等、方向相反，正好互相抵消，所以对置发动机很平顺。', 'One goes left as the other goes right, so their forces are equal and opposite and cancel: a boxer runs smoothly.'],
        focus: ['front', 'banks'] },
      { title: ['重心很低', 'A low centre of gravity'], text: ['看下面的对比：对置发动机比直列矮一大截。', 'In the comparison below, the boxer stands far lower than an inline engine.'],
        why: ['发动机扁，就能装得更低，整车重心跟着降低，过弯时车身更稳。', 'A flat engine sits lower, bringing the car\'s centre of gravity down for steadier cornering.'],
        focus: ['cog'] },
      { title: ['四缸还是六缸', 'Four or six'], text: ['用下面的开关切换：斯巴鲁 BRZ 和丰田 GR86 是对置四缸，保时捷 911 是对置六缸。', 'Use the switch below: the Subaru BRZ and Toyota GR86 have a flat-four, the Porsche 911 a flat-six.'],
        why: ['六个缸的做功重叠得更多，所以六缸的推力曲线更平顺。', 'Six power strokes overlap more, so the six\'s push graph is smoother.'],
        focus: ['push', 'timeline'] },
      { title: ['代价：很宽', 'The cost: width'], text: ['发动机很宽，占满了发动机舱两侧。', 'It is wide, filling the sides of the engine bay.'],
        why: ['火花塞之类的零件藏在两侧，保养更麻烦；车头也得做得够宽才装得下。', 'Spark plugs and the like are tucked away at the sides, which makes servicing harder, and the car must be wide enough at the front to fit it.'],
        focus: ['front'] }
    ],
    parts: {
      front: { name: ['正面剖视', 'Front section'], text: ['相对的一对气缸，各有一个曲拐，方向正好相反。', 'One opposed pair, each on its own crank pin, pointing opposite ways.'] },
      banks: { name: ['两排气缸', 'The two banks'], text: ['同一列上下两个格子就是一对相对的缸：看它们的活塞是不是一起动。', 'Each column is one opposed pair: watch their pistons move together.'] },
      cog: { name: ['重心对比', 'Centre of gravity'], text: ['同样的发动机，躺平以后重心更低。', 'The same engine laid flat sits with a lower centre of gravity.'] },
      timeline: { name: ['点火顺序', 'Firing order'], text: ['对置四缸每 180° 一次，对置六缸每 120° 一次。', 'A flat-four fires every 180°, a flat-six every 120°.'] },
      push: { name: ['推力曲线', 'Push graph'], text: ['切换四缸和六缸，看曲线有什么变化。', 'Switch between four and six and watch the curve change.'] }
    },
    pros: [
      ['相对活塞的惯性力互相抵消，运转平顺。', 'Opposed pistons cancel each other\'s forces, so it runs smoothly.'],
      ['又扁又低，整车重心低，操控好。', 'Flat and low, giving the car a low centre of gravity and good handling.'],
      ['很短，可以低低地装在车尾或车头。', 'Short, so it can sit low at either end of the car.']
    ],
    cons: [
      ['很宽，占用发动机舱两侧的空间。', 'Wide, crowding the sides of the engine bay.'],
      ['两个缸盖，零件和维修成本更高。', 'Two cylinder heads: more parts and costlier servicing.'],
      ['对置四缸仍有一点摇摆，不如对置六缸完美。', 'A flat-four still rocks slightly; a flat-six is fully balanced.']
    ],
    cars: [
      { name: ['保时捷 911 Carrera', 'Porsche 911 Carrera'], engine: ['3.0 水平对置六缸', '3.0 flat-six'], tags: [tags.flat6, tags.twin], why: ['911 从诞生起就是后置水平对置。', 'The 911 has had a rear-mounted boxer since day one.'] },
      { name: ['保时捷 911 GT3', 'Porsche 911 GT3'], engine: ['4.0 水平对置六缸', '4.0 flat-six'], tags: [tags.flat6, tags.na], why: ['高转自吸的对置六缸。', 'A high-revving, naturally aspirated flat-six.'] },
      { name: ['斯巴鲁 BRZ / 丰田 GR86', 'Subaru BRZ / Toyota GR86'], engine: ['FA24 2.4', 'FA24 2.4'], tags: [tags.flat4, tags.na], why: ['两家合作的后驱跑车，同一台对置四缸。', 'A jointly developed rear-drive coupé sharing one flat-four.'] },
      { name: ['斯巴鲁 WRX', 'Subaru WRX'], engine: ['FA24 2.4T', 'FA24 2.4T'], tags: [tags.flat4, tags.turbo], why: ['拉力赛出身的涡轮对置四缸。', 'A rally-bred turbocharged flat-four.'] }
    ],
    myth: {
      q: ['斯巴鲁那种"噗噗"声，是水平对置带来的吗？', 'Is the Subaru "burble" a boxer thing?'],
      a: ['不完全是。那种不均匀的声音主要来自老款斯巴鲁的不等长排气歧管，而不是水平对置本身；换成等长排气以后，声音就变均匀了。', 'Not exactly. That uneven sound came mostly from older Subarus\' unequal-length exhaust headers, not the boxer layout itself; with equal-length headers it evens out.']
    }
  },
  {
    id: 'diesel', group: 'special', view: 'diesel', kind: 'crank', scrub: 'strokes', redline: 4500, speed: 18,
    eyebrow: 'DIESEL',
    name: ['柴油机', 'Diesel'],
    tagline: ['没有火花塞，压得够狠就自己着', 'No spark plug: squeeze hard enough and it lights itself'],
    facts: [[['点火方式', 'Ignition'], ['压燃（没有火花塞）', 'Compression (no spark plug)']], [['压缩比', 'Compression ratio'], ['约 15–20（汽油机约 10–13）', 'About 15–20 (petrol 10–13)']], [['常见于', 'Found in'], ['皮卡、越野车、卡车', 'Pickups, 4×4s and trucks']]],
    card: ['不点火，靠把空气压到滚烫。', 'No spark: it squeezes air until it is scorching.'],
    lead: ['柴油机也是四个冲程，但它吸进来的只有空气。活塞把空气压得比汽油机狠得多，空气被压到六百多度，这时喷进柴油，油雾一碰到热空气就自己烧起来。这就是[[compression-ignition|压燃]]，所以它没有火花塞。', 'A diesel runs the same four strokes, but breathes in air alone. It squeezes that air far harder than a petrol engine, to over 600°C, then sprays in diesel, which lights the moment it meets the hot air. That is [[compression-ignition|compression ignition]], so there is no spark plug.'],
    analogy: ['像用打气筒狠狠地打气，筒身会发烫：把空气压得够紧，热量就够把柴油点着。', 'Like a bike pump that gets hot when you pump hard: squeeze air tightly enough and it gets hot enough to light diesel.'],
    scrub: 'strokes', playback: 'slow', hold: 2.6,
    steps: [
      { at: 0, until: 180, tone: 'intake', title: ['只吸空气', 'Air only'],
        text: ['活塞从[[tdc|上止点]]往下走，进气门打开。和汽油机不同，柴油机这时只吸进纯空气，一滴油都没有。', 'The piston moves down from [[tdc|top dead centre]] with the intake valve open. Unlike a petrol engine, a diesel takes in air alone, with no fuel at all.'],
        why: ['油要等到最后一刻才喷进去：要是提前混进去，压缩到一半就会自己着火。', 'The fuel waits until the last moment: mixed in early, it would light itself halfway through the squeeze.'],
        focus: ['intake-valve', 'chamber', 'intake-port'] },
      { at: 180, until: 360, tone: 'squeeze', title: ['狠狠压缩', 'A hard squeeze'],
        text: ['两个气门关上，活塞从[[bdc|下止点]]往上顶，把空气压到大约十六分之一。看右边的温度计：空气被压到超过 600°C。', 'Both valves close and the piston rises from [[bdc|bottom dead centre]], squeezing the air to about a sixteenth of its volume. Watch the thermometer: the air passes 600°C.'],
        why: ['空气被压缩就会变热，压得越狠越烫。柴油机的[[compression-ratio|压缩比]]大约 16，汽油机只有 10 左右，所以只有柴油机能热到让燃油自己着火。', 'Squeezing air heats it, and the harder the squeeze the hotter it gets. A diesel\'s [[compression-ratio|compression ratio]] is about 16 against a petrol engine\'s 10 or so, so only a diesel gets hot enough to light its fuel.'],
        focus: ['chamber', 'thermo', 'piston'] },
      { at: 360, until: 540, tone: 'burn', title: ['喷油，自己着火', 'Inject, and it lights itself'],
        text: ['快到顶时，喷油嘴把柴油喷成细雾。滚烫的空气一碰到油雾就自己烧起来，把活塞推下去。', 'Just before the top the injector sprays a fine mist of diesel. The scorching air lights it on contact, and the burn drives the piston down.'],
        why: ['这就是[[compression-ignition|压燃]]，不需要火花塞。柴油机推得早、推得猛，所以低转速就有很大的[[torque|扭矩]]。', 'This is [[compression-ignition|compression ignition]]: no spark plug needed. A diesel pushes early and hard, which is why it has big [[torque|torque]] at low revs.'],
        focus: ['injector', 'chamber', 'piston'] },
      { at: 540, until: 720, tone: 'exhaust', title: ['排气', 'Exhaust'],
        text: ['排气门打开，活塞往上走，把废气推出去，和汽油机一样。', 'The exhaust valve opens and the rising piston pushes the burnt gas out, just as in a petrol engine.'],
        why: ['清空了缸，下一口纯空气才进得来。柴油燃烧容易产生颗粒（黑烟），所以排气里还装着颗粒捕集器。', 'Only an empty cylinder has room for the next breath of air. Burning diesel tends to make soot, so the exhaust also carries a particulate filter.'],
        focus: ['exhaust-valve', 'exhaust-port', 'piston'] }
    ],
    parts: {
      injector: { name: ['喷油嘴', 'Injector'], text: ['在缸顶正中间，压缩快结束时用极高的压力把柴油喷成雾。它代替了火花塞的位置。', 'Sits at the centre of the head and sprays diesel as a mist at very high pressure near the top of compression. It takes the spark plug\'s place.'] },
      'glow-plug': { name: ['预热塞', 'Glow plug'], text: ['天冷时发动机还是冷的，压缩也不够热，预热塞会先把燃烧室加热，帮它点着。', 'On a cold morning the compression is not hot enough yet, so the glow plug heats the chamber to help it start.'] },
      'intake-valve': { name: ['进气门', 'Intake valve'], text: ['只放空气进来，燃油不从这里进。', 'Lets in air only; fuel does not come this way.'] },
      'exhaust-valve': { name: ['排气门', 'Exhaust valve'], text: ['排气时打开。', 'Opens for the exhaust stroke.'] },
      chamber: { name: ['燃烧室', 'Combustion chamber'], text: ['比汽油机的小得多：空间越小，压得越狠，空气越烫。', 'Much smaller than a petrol engine\'s: the tighter the space, the harder the squeeze and the hotter the air.'] },
      piston: { name: ['活塞', 'Piston'], text: ['顶上有一个凹坑（燃烧碗），让喷进来的油雾和空气搅在一起。', 'Its crown has a bowl that swirls the fuel mist into the air.'] },
      thermo: { name: ['温度计', 'Thermometer'], text: ['缸内空气被压缩时的温度（示意）。柴油机能压到 600 多度，汽油机大约 480 度。', 'The air temperature as it is squeezed (a model). A diesel reaches over 600°C, a petrol engine about 480°C.'] },
      'exhaust-port': { name: ['排气管', 'Exhaust'], text: ['现代柴油车的排气里有颗粒捕集器，专门拦下黑烟。', 'Modern diesels have a particulate filter in the exhaust to trap soot.'] }
    },
    pros: [
      ['省油：同样一箱油，柴油机能跑得更远。', 'Frugal: it goes further on a tank.'],
      ['低转速扭矩大，拖车、越野、拉货都很有劲。', 'Huge low-rev torque for towing, off-road and hauling.'],
      ['结构结实，寿命长。', 'Built tough and long-lived.']
    ],
    cons: [
      ['转速不高，声音粗，振动大。', 'Low revs, a gruff sound and more vibration.'],
      ['排放里氮氧化物和颗粒多，需要复杂的尾气处理。', 'More NOx and soot, needing complex exhaust treatment.'],
      ['为了扛住高压，发动机更重、更贵。', 'Heavier and more expensive, to withstand the pressure.']
    ],
    cars: [
      { name: ['丰田 Hilux / Land Cruiser', 'Toyota Hilux / Land Cruiser'], engine: ['1GD-FTV 2.8', '1GD-FTV 2.8'], tags: [tags.i4, tags.diesel, tags.turbo], why: ['澳洲路上最常见的皮卡和越野车之一。', 'One of the most common pickups and 4×4s on Australian roads.'] },
      { name: ['福特 Ranger', 'Ford Ranger'], engine: ['3.0 V6', '3.0 V6'], tags: [tags.v6, tags.diesel, tags.turbo], why: ['V6 柴油皮卡。', 'A V6 diesel pickup.'] },
      { name: ['奥迪 R10 TDI', 'Audi R10 TDI'], engine: ['5.5 V12', '5.5 V12'], tags: [tags.v12, tags.diesel, tags.twin], why: ['2006 年勒芒 24 小时冠军，第一台赢下勒芒的柴油赛车。', 'Won Le Mans in 2006, the first diesel to do so.'] }
    ],
    myth: {
      q: ['柴油车一定冒黑烟吗？', 'Do diesels always smoke?'],
      a: ['老柴油车加速时冒黑烟，是油喷多了烧不完。现代柴油机用高压共轨精确喷油，排气里还有颗粒捕集器，正常情况下几乎看不到烟。', 'Old diesels smoked under load because fuel was not burning completely. Modern ones meter fuel precisely with high-pressure common-rail injection and trap soot in a particulate filter, so you rarely see smoke.']
    }
  },
  {
    id: 'rotary', group: 'special', view: 'rotary', kind: 'crank', speed: 24,
    eyebrow: 'WANKEL ROTARY',
    name: ['转子发动机', 'Rotary'],
    tagline: ['没有活塞，三角形在画圈', 'No pistons, just a triangle going round'],
    facts: [[['运动方式', 'Motion'], ['只有旋转，没有往复活塞', 'All rotation, no pistons']], [['转速比', 'Speed ratio'], ['偏心轴 3 圈 : 转子 1 圈', 'Shaft 3 turns : rotor 1']], [['做功', 'Power strokes'], ['偏心轴每转一圈，每个转子一次', 'One per rotor per shaft turn']], [['常见于', 'Found in'], ['马自达 RX-7、RX-8', 'Mazda RX-7, RX-8']]],
    card: ['一个三角转子，四个冲程同时进行。', 'One triangular rotor, all four strokes at once.'],
    lead: ['转子发动机（汪克尔发动机）没有上下跑的活塞：一个三角形的转子在一个"花生形"的缸里画圈，三个面各自围出一个腔，同时在进气、压缩、做功、排气。马自达把它做成了传奇。', 'A rotary (Wankel) engine has no pistons going up and down: a triangular rotor orbits inside a peanut-shaped housing, and each of its three faces seals off a chamber that is breathing in, squeezing, firing or exhausting, all at once. Mazda made it a legend.'],
    analogy: ['像一扇三角形的旋转门：转一圈，三个隔间都依次经过入口、压紧、点火和出口。', 'Like a three-sided revolving door: one turn carries each compartment past the entrance, the squeeze, the spark and the exit.'],
    steps: [
      { title: ['三角转子在画圈', 'A triangle going round'], text: ['转子的三个角始终贴着花生形的缸壁，把空间隔成三个腔。', 'The rotor\'s three tips always touch the peanut-shaped housing, dividing it into three chambers.'],
        why: ['转子一边绕着偏心轴画圈一边自转，每个腔就跟着一胀一缩，就像活塞在缸里上下一样。', 'As the rotor circles the eccentric shaft and turns, each chamber grows and shrinks, just as a cylinder does when its piston moves.'], focus: ['rotor', 'housing'] },
      { title: ['三个腔同时在干活', 'Three chambers at work'], text: ['同一时刻，一个腔在进气，一个在压缩或做功，一个在排气。每个腔里都写着它正在做什么。', 'At any moment one chamber is breathing in, one compressing or firing, one exhausting. Each chamber is labelled with what it is doing.'],
        why: ['四冲程的四步在这里不是在同一个地方轮流做，而是在缸壁的不同位置同时发生。', 'The four strokes do not take turns in one place here; they happen at once, in different parts of the housing.'], focus: ['rotor', 'intake', 'exhaust'] },
      { title: ['挤到最小时点火', 'Spark at the squeeze'], text: ['腔被挤到最小时，正好转到右边的火花塞旁：火花一点，燃气推着转子继续转。', 'A chamber is squeezed smallest just as it reaches the spark plugs on the right; they fire and the burning gas pushes the rotor on.'],
        why: ['这时腔里的空间最小、气体压得最紧，和活塞发动机在[[tdc|上止点]]附近点火是同一个道理。', 'That is when the space is smallest and the charge tightest, the same reason a piston engine fires near [[tdc|top dead centre]].'], focus: ['spark', 'rotor'] },
      { title: ['3 : 1', '3 : 1'], text: ['中间的偏心轴转三圈，转子才转一圈。盯着黄色的轴标记和白色的转子标记，数一数。', 'The eccentric shaft in the middle turns three times for each turn of the rotor. Watch the yellow shaft marker and the white rotor marker, and count.'],
        why: ['转子里的内齿圈和中间的固定齿轮齿数是 3 : 2，正是它们把转子"管"得只转轴的三分之一。', 'The rotor\'s ring gear and the fixed gear at the centre are 3 : 2, and that holds the rotor to a third of the shaft\'s speed.'], focus: ['shaft', 'gears'] },
      { title: ['每转一圈做一次功', 'One power stroke per turn'], text: ['偏心轴每转一圈，就有一个腔在做功。', 'Each turn of the shaft brings one power stroke.'],
        why: ['这和两缸四冲程发动机一样多，体积却小得多，所以转子发动机又小巧又能转高。', 'That is as many as a two-cylinder four-stroke in a much smaller package, which is why a rotary is so compact and revs so freely.'], focus: ['shaft', 'spark'] },
      { title: ['代价：密封片', 'The catch: the seals'], text: ['三个角上的密封片要一直贴着缸壁滑动，容易磨损。', 'The tip seals slide against the housing all the time and wear.'],
        why: ['燃烧室又长又扁，烧得不够充分，所以更费油，还会消耗一点机油。', 'The long, thin chamber burns less completely, so it uses more fuel and a little oil.'], focus: ['seals'] }
    ],
    parts: {
      rotor: { name: ['三角转子', 'Rotor'], text: ['相当于活塞：三个面各推着一个腔，面上的凹坑是燃烧的地方。', 'It plays the piston\'s role: each face works one chamber, and the recess in each face is where the charge burns.'] },
      housing: { name: ['缸体（花生形）', 'Housing'], text: ['内壁是一种叫"外旋轮线"的曲线，正好让转子的三个角一直贴着它。', 'Its inner wall is an epitrochoid, the curve that keeps all three rotor tips touching it.'] },
      shaft: { name: ['偏心轴', 'Eccentric shaft'], text: ['相当于曲轴：转子套在它偏心的轴颈上，推着它转。', 'It plays the crank\'s role: the rotor rides on its off-centre journal and pushes it round.'] },
      gears: { name: ['相位齿轮', 'Phasing gears'], text: ['固定齿轮和转子里的内齿圈是 2 : 3，正是它们让转子只转轴的三分之一。', 'A fixed gear and the rotor\'s internal ring gear, 2 : 3, hold the rotor to a third of shaft speed.'] },
      spark: { name: ['火花塞（两个）', 'Spark plugs'], text: ['燃烧室又长又扁，所以用前后两个火花塞，烧得更完全。', 'The chamber is long and thin, so two plugs fire to burn it more fully.'] },
      intake: { name: ['进气口', 'Intake port'], text: ['开在缸体侧面，转子转过时自动打开、关上，不需要气门。', 'Cut into the housing; the rotor uncovers and covers it as it passes, so there are no valves.'] },
      exhaust: { name: ['排气口', 'Exhaust port'], text: ['同样没有气门，转子转过就打开。', 'Also valveless: the rotor opens it as it goes by.'] },
      seals: { name: ['顶端密封片', 'Apex seals'], text: ['三个角上的密封片把三个腔隔开，是转子发动机最关键、也最容易磨损的零件。', 'The seals at the three tips keep the chambers apart: the rotary\'s most critical and most worn part.'] }
    },
    pros: [
      ['零件少、体积小、重量轻：没有气门，也没有凸轮轴。', 'Few parts, small and light: no valves, no camshafts.'],
      ['只有旋转没有往复，非常顺滑，能转得很高。', 'All rotation, nothing reciprocating: very smooth and high-revving.'],
      ['同样的体积，功率大。', 'Strong power for its size.']
    ],
    cons: [
      ['顶端密封片会磨损，寿命和可靠性一直是老问题。', 'Apex seal wear: a long-standing reliability issue.'],
      ['燃烧室长而扁，油耗高、排放难达标。', 'A long, thin chamber hurts economy and emissions.'],
      ['设计上要消耗一点机油来润滑密封片。', 'By design it burns a little oil to lubricate the seals.']
    ],
    cars: [
      { name: ['马自达 RX-7（FD）', 'Mazda RX-7 (FD)'], engine: ['13B-REW', '13B-REW'], tags: [tags.rotor2, tags.twin], why: ['双转子加顺序双涡轮，转子跑车的代表。', 'Twin rotors with sequential twin turbos: the rotary sports car.'] },
      { name: ['马自达 RX-8', 'Mazda RX-8'], engine: ['Renesis 13B-MSP', 'Renesis 13B-MSP'], tags: [tags.rotor2, tags.na], why: ['自然吸气的双转子，侧面进排气口。', 'A naturally aspirated twin-rotor with side ports.'] },
      { name: ['马自达 787B', 'Mazda 787B'], engine: ['R26B', 'R26B'], tags: [tags.rotor4, tags.na], why: ['1991 年勒芒冠军，至今唯一用转子赢下勒芒的赛车。', 'Won Le Mans in 1991, still the only rotary-powered winner.'] },
      { name: ['马自达 MX-30 R-EV', 'Mazda MX-30 R-EV'], engine: ['8C', '8C'], tags: [tags.rotor1, tags.rangeExt], why: ['单转子不驱动车轮，只负责发电。', 'A single rotor that drives no wheels and only generates power.'] }
    ],
    myth: {
      q: ['"转子烧机油"是故障吗？', 'Is a rotary burning oil a fault?'],
      a: ['不是。转子发动机会故意把少量机油喷进燃烧室，润滑三个角上的密封片，所以消耗机油是设计如此；需要的是定期检查和补充。', 'No. A rotary deliberately meters a little oil into the chambers to lubricate the apex seals, so using oil is by design; it just needs checking and topping up.']
    }
  },
  {
    id: 'hybrid', group: 'electric', view: 'hybrid', kind: 'scene',
    eyebrow: 'HYBRID',
    name: ['混合动力', 'Hybrid'],
    tagline: ['发动机和电机分工合作', 'Engine and motor sharing the work'],
    facts: [[['动力来源', 'Power from'], ['发动机 + 电机', 'Engine + motor']], [['电池', 'Battery'], ['小（HEV），或大、能插电（PHEV）', 'Small (HEV), or large and pluggable (PHEV)']], [['常见于', 'Found in'], ['丰田普锐斯、本田 e:HEV、比亚迪 DM-i', 'Toyota Prius, Honda e:HEV, BYD DM-i']]],
    card: ['谁推车轮、谁在充电，看路况切换。', 'Who drives and who charges changes with the road.'],
    lead: ['混动车既有发动机，也有电机和一块电池。它会按路况在几种工作方式之间切换：起步用电，加速时发动机发电，高速时发动机直接推车轮，刹车时把动能收回来。F1 赛车和勒芒冠军也都是混动。', 'A hybrid has an engine, a motor and a battery, and switches between ways of working as you drive: electric to pull away, the engine generating when you accelerate, the engine driving the wheels at speed, and energy recovered when you brake. F1 cars and Le Mans winners are hybrids too.'],
    analogy: ['像一支接力队：起步交给短跑好的电机，长距离交给耐力好的发动机，下坡时还能把力气存起来。', 'Like a relay team: the motor, quick off the mark, takes the start; the engine, built for endurance, takes the long stretch; and downhill, the energy gets saved for later.'],
    steps: [
      { mode: 'ev', title: ['起步：纯电', 'Pulling away: electric'], text: ['低速起步时发动机不工作，电池给电机供电，电机推着车走。', 'At low speed the engine stays off; the battery powers the motor, which drives the car.'],
        why: ['发动机在低速、小负荷时效率最低，交给电机更安静、更省油。', 'An engine is least efficient at low speed and light load, so leaving it to the motor is quieter and saves fuel.'], focus: ['battery', 'motor', 'wheels'] },
      { mode: 'series', title: ['加速：发动机发电', 'Accelerating: the engine generates'], text: ['需要更多力气时，发动机启动、带动发电机，它发的电和电池的电一起送给电机。', 'For more push the engine starts and turns the generator; its electricity and the battery\'s both feed the motor.'],
        why: ['这时发动机还不直接推车轮，可以待在效率高的转速上，车速的变化交给电机去应付。', 'The engine still does not drive the wheels, so it can stay at an efficient speed while the motor deals with changes in road speed.'], focus: ['engine', 'generator', 'motor'] },
      { mode: 'parallel', title: ['高速巡航：发动机直驱', 'Cruising: the engine drives'], text: ['上了高速，离合器结合，发动机直接通过齿轮推车轮；电机需要时再帮一把。', 'At motorway speed a clutch engages and the engine drives the wheels through gears; the motor helps when needed.'],
        why: ['稳定的高速是发动机效率最高的时候，直接推车轮，比先发电再驱动少了一道转换损失。', 'Steady high speed is where an engine is most efficient, and driving the wheels directly skips the losses of turning its work into electricity and back.'], focus: ['engine', 'clutch', 'wheels'] },
      { mode: 'regen', title: ['刹车：动能回收', 'Braking: recovering energy'], text: ['松油门或刹车时，车轮反过来带着电机转，电机变成发电机，给电池充电。', 'Lift off or brake and the wheels turn the motor, which becomes a generator and charges the battery.'],
        why: ['普通车刹车时，动能全变成刹车片上的热；[[regen|动能回收]]把其中一部分存回电池，下次起步再用。', 'An ordinary car turns that energy into brake heat; [[regen|regenerative braking]] stores some of it in the battery for the next pull-away.'], focus: ['wheels', 'motor', 'battery'] },
      { mode: 'plug', title: ['插电混动：电池更大', 'Plug-in: a bigger battery'], text: ['[[phev|插电混动（PHEV）]]的电池更大，还能插电充电。', 'A [[phev|plug-in hybrid (PHEV)]] has a bigger battery that you can charge from the wall.'],
        why: ['电池够大，日常通勤几乎可以全用电跑，只有长途才用到发动机；普通混动（HEV）没有充电口，电全靠发动机和刹车回收。', 'With enough battery, daily commutes can be almost all electric and the engine is for long trips; a regular hybrid (HEV) has no charge port and gets its electricity only from the engine and braking.'], focus: ['plug', 'battery'] }
    ],
    parts: {
      engine: { name: ['发动机', 'Engine'], text: ['只在它效率高的时候才工作，其余时间熄火。', 'Runs only when it is efficient, and switches off otherwise.'] },
      generator: { name: ['发电机', 'Generator'], text: ['被发动机带着转，把动力变成电。', 'Turned by the engine, it makes electricity.'] },
      motor: { name: ['驱动电机', 'Drive motor'], text: ['大部分时候是它在推车轮；刹车时又变成发电机。', 'Drives the wheels most of the time, and turns generator when you brake.'] },
      battery: { name: ['电池', 'Battery'], text: ['普通混动的电池很小，靠发动机和刹车回收来充电。', 'In a regular hybrid it is small and charged by the engine and braking.'] },
      clutch: { name: ['离合器', 'Clutch'], text: ['高速时结合，让发动机直接推车轮。', 'Engages at speed so the engine can drive the wheels directly.'] },
      wheels: { name: ['车轮', 'Wheels'], text: ['刹车时，车轮的动能可以被电机收回来。', 'When braking, their energy can be recovered by the motor.'] },
      plug: { name: ['充电口', 'Charge port'], text: ['只有插电混动（PHEV）才有。', 'Only plug-in hybrids (PHEV) have one.'] },
      tank: { name: ['油箱', 'Fuel tank'], text: ['发动机的燃料，混动车照样要加油。', 'Fuel for the engine: a hybrid still needs filling up.'] }
    },
    pros: [
      ['城市里大量用电，油耗明显更低。', 'Much lower fuel use in town, where it runs on electricity a lot.'],
      ['刹车的能量不再白白变成热量，而是存回电池。', 'Braking energy goes back into the battery instead of turning into heat.'],
      ['不用担心续航，加油就能继续跑。', 'No range anxiety: just fill up and keep going.']
    ],
    cons: [
      ['两套动力系统，结构复杂、成本更高。', 'Two power systems: more complex and more expensive.'],
      ['电池和电机增加了重量。', 'The battery and motor add weight.'],
      ['长途高速时，省油的优势变小。', 'On long motorway runs the fuel saving shrinks.']
    ],
    cars: [
      { name: ['丰田普锐斯', 'Toyota Prius'], engine: ['THS 混动系统', 'Toyota Hybrid System'], tags: [tags.hybrid], why: ['用一组行星齿轮把发动机的力分给发电机和车轮，是量产混动车的开山之作。', 'A planetary gearset splits the engine\'s power between the generator and the wheels; the hybrid that started it all.'] },
      { name: ['本田 CR-V / 雅阁 e:HEV', 'Honda CR-V / Accord e:HEV'], engine: ['e:HEV', 'e:HEV'], tags: [tags.hybrid], why: ['大多数时候电机驱动，高速时离合器让发动机直驱，和图里的方式一样。', 'Mostly motor-driven, with a clutch for direct engine drive at speed, as in the diagram.'] },
      { name: ['比亚迪秦 PLUS DM-i', 'BYD Qin PLUS DM-i'], engine: ['DM-i', 'DM-i'], tags: [tags.phev], why: ['以电为主的插电混动。', 'A plug-in hybrid that leans on electricity.'] },
      { name: ['丰田 GR010 HYBRID', 'Toyota GR010 HYBRID'], engine: ['V6 双涡轮 + 电机', 'Twin-turbo V6 + motor'], tags: [tags.v6, tags.twinHybrid], why: ['勒芒 24 小时冠军赛车，混动也能赢比赛。', 'A Le Mans winner: hybrids win races too.'] }
    ],
    myth: {
      q: ['混动车要插电充电吗？', 'Do hybrids need plugging in?'],
      a: ['普通混动（HEV）不用，它的电全靠发动机和刹车回收；只有插电混动（PHEV）才需要、也可以插电。', 'A regular hybrid (HEV) does not: its electricity comes from the engine and braking. Only a plug-in hybrid (PHEV) needs, or can use, a plug.']
    }
  },
  {
    id: 'erev', group: 'electric', view: 'erev', kind: 'scene',
    eyebrow: 'RANGE EXTENDER',
    name: ['增程式', 'Range extender'],
    tagline: ['发动机只发电，从不推车轮', 'The engine only generates, never drives'],
    facts: [[['推车轮的', 'Drives the wheels'], ['只有电机', 'Only the motor']], [['发动机的工作', 'Engine\'s job'], ['只负责发电', 'Generating electricity']], [['常见于', 'Found in'], ['理想、问界、马自达 MX-30 R-EV', 'Li Auto, AITO, Mazda MX-30 R-EV']]],
    card: ['开起来是电车，发动机只当发电机。', 'Drives like an EV; the engine is just a generator.'],
    lead: ['增程车开起来就是一台电动车：推车轮的永远是电机。车上那台发动机和车轮之间没有任何连接，它唯一的工作就是在电量低的时候发电。', 'A range extender drives like an electric car: the motor always turns the wheels. Its engine has no link to the wheels at all; its only job is to make electricity when the battery runs low.'],
    analogy: ['像一台随车带着的充电宝加小发电机：电够的时候用电池，电不够了发电机就开工。', 'Like an EV that carries its own generator: it runs on the battery, and when that runs low, the generator gets to work.'],
    steps: [
      { mode: 'ev', title: ['电量足时：纯电', 'Charged: pure electric'], text: ['电池电量足的时候，它就是一台电动车，发动机一直不启动。', 'With a charged battery it is simply an electric car; the engine never starts.'],
        why: ['车轮永远只由电机驱动，所以开起来和纯电车一样安静、顺滑。', 'The wheels are only ever driven by the motor, so it drives as quietly and smoothly as an EV.'], focus: ['battery', 'motor', 'wheels'] },
      { mode: 'extend', title: ['电量低了：发动机发电', 'Low battery: the engine generates'], text: ['电量降到一定程度，发动机启动，但它只带动发电机：电送去电机，多的存进电池。', 'When charge runs low the engine starts, but only to turn the generator; the electricity feeds the motor and the surplus tops up the battery.'],
        why: ['这里的发动机就像一个车载充电宝，把油变成电，让车能继续跑长途。', 'Here the engine is just a generator on board, turning fuel into electricity so the car can keep going on long trips.'], focus: ['engine', 'generator', 'battery'] },
      { mode: 'extend', title: ['发动机不接车轮', 'No link to the wheels'], text: ['发动机和车轮之间根本没有机械连接。', 'There is no mechanical link at all between engine and wheels.'],
        why: ['所以它可以一直待在最省油的转速上，不用跟着车速变；代价是高速巡航时多了一道"油→电→车轮"的转换损失。', 'So it can sit at its most efficient speed whatever the car is doing; the cost, when cruising fast, is the extra step from fuel to electricity to wheels.'], focus: ['engine', 'no-link'] },
      { mode: 'regen', title: ['刹车回收', 'Braking recovery'], text: ['刹车时电机变成发电机，把能量送回电池，和纯电车一样。', 'When braking the motor becomes a generator and sends energy back to the battery, just as in an EV.'],
        why: ['电机本身就能当发电机，回收能量几乎不用额外的零件。', 'The motor doubles as a generator, so recovering energy needs almost no extra parts.'], focus: ['wheels', 'motor', 'battery'] },
      { mode: 'plug', title: ['回家插电', 'Plug in at home'], text: ['回家插电充满，日常基本用不上发动机。', 'Charge it at home and daily driving rarely needs the engine.'],
        why: ['增程车的电池比普通混动大得多，大部分里程都能用更便宜的电来跑。', 'Its battery is much bigger than a regular hybrid\'s, so most miles can run on cheaper electricity.'], focus: ['plug', 'battery'] }
    ],
    parts: {
      engine: { name: ['发动机（增程器）', 'Engine (range extender)'], text: ['只带动发电机，可以一直在最省油的转速工作。', 'It only turns the generator, so it can stay at its most efficient speed.'] },
      generator: { name: ['发电机', 'Generator'], text: ['把发动机的转动变成电。', 'Turns the engine\'s rotation into electricity.'] },
      motor: { name: ['驱动电机', 'Drive motor'], text: ['唯一推车轮的部件。', 'The only thing that drives the wheels.'] },
      battery: { name: ['电池', 'Battery'], text: ['比混动大得多，可以插电充电。', 'Much bigger than a hybrid\'s, and pluggable.'] },
      'no-link': { name: ['没有连接', 'No link'], text: ['这就是增程和混动最大的区别：发动机永远不直接推车轮。', 'The key difference from a hybrid: the engine never drives the wheels.'] },
      wheels: { name: ['车轮', 'Wheels'], text: ['只由电机驱动。', 'Driven by the motor alone.'] },
      plug: { name: ['充电口', 'Charge port'], text: ['回家插电，日常大多用电跑。', 'Plug in at home and most daily driving is electric.'] },
      tank: { name: ['油箱', 'Fuel tank'], text: ['给增程器用，长途时才派上用场。', 'Fuel for the range extender, for long trips.'] }
    },
    pros: [
      ['开起来就是电车：安静、平顺、起步快。', 'Drives like an EV: quiet, smooth and quick off the line.'],
      ['长途不用找充电桩，加油就行。', 'Long trips need no charging stops: just refuel.'],
      ['发动机只在最省油的转速工作。', 'The engine runs only at its most efficient speed.']
    ],
    cons: [
      ['长途高速时要先发电再驱动，绕了一道，油耗未必低。', 'On long motorway runs it generates then drives, an extra step that is not always frugal.'],
      ['同时带着发动机和大电池，车更重。', 'Carrying both an engine and a big battery makes it heavy.'],
      ['发动机启动时，安静的电车会突然有了发动机声。', 'When the engine starts, the quiet EV suddenly has an engine note.']
    ],
    cars: [
      { name: ['理想 L9 / L6', 'Li Auto L9 / L6'], engine: ['增程', 'Range extender'], tags: [tags.erev], why: ['把增程做成主流的大型 SUV。', 'Large SUVs that made range extenders mainstream.'] },
      { name: ['问界 M9', 'AITO M9'], engine: ['增程（另有纯电版）', 'Range extender (EV version too)'], tags: [tags.erev], why: ['同一款车同时提供增程和纯电版本。', 'Offered as both a range extender and a pure EV.'] },
      { name: ['马自达 MX-30 R-EV', 'Mazda MX-30 R-EV'], engine: ['8C 单转子', '8C single rotor'], tags: [tags.rotor1, tags.erev], why: ['用一台小小的转子发动机当增程器。', 'Uses a small rotary engine as its range extender.'] }
    ],
    myth: {
      q: ['增程车是不是"油改电"的过渡产品？', 'Is a range extender just a stopgap?'],
      a: ['在充电还不方便的地方，它确实很实用：开起来是电车，长途不用担心充电。但先发电再驱动电机，长途高速的油耗未必比混动低。', 'Where charging is patchy it is genuinely practical: it drives like an EV and long trips need no charging stops. But generating electricity to drive a motor is not always more frugal than a hybrid on long motorway runs.']
    }
  },
  {
    id: 'ev', group: 'electric', view: 'motor', kind: 'crank', speed: 20,
    eyebrow: 'ELECTRIC MOTOR',
    name: ['纯电电机', 'Electric motor'],
    tagline: ['转动的磁场，拽着转子跑', 'A turning field pulling the rotor round'],
    facts: [[['动力来源', 'Power from'], ['电池 → 电控 → 电机', 'Battery → inverter → motor']], [['会动的部件', 'Moving parts'], ['只有转子在转', 'Only the rotor turns']], [['扭矩', 'Torque'], ['从 0 转起就是最大', 'Full from zero rpm']], [['常见于', 'Found in'], ['特斯拉、小米 SU7、保时捷 Taycan', 'Tesla, Xiaomi SU7, Porsche Taycan']]],
    card: ['三组线圈轮流通电，磁场带着转子转。', 'Three coils take turns; the field drags the rotor round.'],
    lead: ['电动车没有发动机，只有电机。三组线圈轮流通电，在电机里造出一个会转的磁场，转子上的磁铁就被它一直拽着转。没有爆炸、没有气门，一踩就是最大扭矩。', 'An electric car has no engine, only a motor. Three sets of coils take turns carrying current and make a magnetic field that turns; the magnets on the rotor are pulled round after it. No explosions, no valves, and full torque the instant you press.'],
    analogy: ['像一圈人轮流举起手里的磁铁：中间的指南针就会跟着一圈一圈地转。', 'Like a ring of people taking turns to raise a magnet: the compass needle in the middle follows them round and round.'],
    steps: [
      { mode: 'drive', title: ['三组线圈', 'Three sets of coils'], text: ['外圈的定子上有三组线圈（A、B、C），由电池经过[[inverter|电控（逆变器）]]供电。圆点表示电流朝外，叉表示朝里。', 'The stator round the outside carries three coil sets (A, B, C), fed from the battery through the [[inverter|inverter]]. A dot means current coming out of the page, a cross going in.'],
        why: ['电池给的是直流电，电机要的是三相交流电；电控负责转换，并决定电机转多快、出多大力。', 'The battery gives direct current but the motor wants three-phase alternating current; the inverter converts it and decides how fast the motor turns and how hard it pushes.'], focus: ['stator', 'inverter'] },
      { mode: 'drive', title: ['轮流通电', 'Taking turns'], text: ['三组线圈的电流像三条错开 120° 的波浪，看右边的波形。', 'The three currents are waves 120° apart; see the waveforms on the right.'],
        why: ['一组最强时，另外两组正在变弱或变强，三组接力，合起来的效果始终一样强。', 'As one peaks the others fade or build, so the three take turns and their combined effect stays equally strong.'], focus: ['waves', 'stator'] },
      { mode: 'drive', title: ['磁场在转', 'The field turns'], text: ['三组线圈合在一起，造出一个一直在转的磁场（黄色箭头），而线圈本身一动不动。', 'Together the coils make a magnetic field that keeps turning (the yellow arrow), while the coils themselves never move.'],
        why: ['不用电刷、也不用换向器就能让磁场转起来，这正是三相电机结构简单、耐用的原因。', 'Turning the field with no brushes or commutator is why a three-phase motor is so simple and durable.'], focus: ['field'] },
      { mode: 'drive', title: ['转子被拽着转', 'The rotor is pulled round'], text: ['转子上的永磁铁被转动的磁场吸着走，稍稍落后一点，于是转子跟着转、带动车轮。', 'The rotor\'s permanent magnets are drawn after the turning field, trailing it slightly, so the rotor turns and drives the wheels.'],
        why: ['电控加大电流，磁场就"拽"得更狠，[[torque|扭矩]]也更大，而且从零转速就有，所以电车起步特别猛。', 'Raise the current and the field pulls harder, giving more [[torque|torque]], and it is there from standstill, which is why EVs launch so hard.'], focus: ['rotor', 'field'] },
      { mode: 'regen', title: ['反过来就是发电机', 'Run backwards, it is a generator'], text: ['松开油门时，车轮带着转子转，转子跑到了磁场前面，电机变成发电机，把电送回电池。', 'Lift off and the wheels push the rotor ahead of the field; the motor becomes a generator and sends current back to the battery.'],
        why: ['同一台电机，转子落后时是电动机，领先时就是发电机。这就是[[regen|动能回收]]，也是"单踏板"的原理。', 'The same machine is a motor when the rotor trails and a generator when it leads. That is [[regen|regenerative braking]], and the idea behind one-pedal driving.'], focus: ['rotor', 'inverter', 'battery'] }
    ],
    parts: {
      stator: { name: ['定子（线圈）', 'Stator'], text: ['固定不动的外圈，上面绕着三组线圈。', 'The fixed outer ring, wound with three sets of coils.'] },
      rotor: { name: ['转子（永磁铁）', 'Rotor'], text: ['中间转动的部分，上面装着永磁铁，带着车轮转。', 'The turning part in the middle, carrying permanent magnets and driving the wheels.'] },
      field: { name: ['旋转磁场', 'Rotating field'], text: ['线圈不动，磁场却在转：这就是三相交流电的妙处。', 'The coils stay still, yet the field turns: that is the trick of three-phase current.'] },
      waves: { name: ['三相电流', 'Three-phase current'], text: ['三条错开 120° 的正弦波，竖线是现在的位置。', 'Three sine waves 120° apart; the vertical line is now.'] },
      inverter: { name: ['电控（逆变器）', 'Inverter'], text: ['把电池的直流电变成三相交流电，控制电机转多快、出多大力。', 'Turns the battery\'s direct current into three-phase current, controlling the motor\'s speed and torque.'] },
      battery: { name: ['电池', 'Battery'], text: ['驱动时放电，回收时充电。', 'Discharges to drive, charges when regenerating.'] }
    },
    pros: [
      ['一踩就是最大扭矩，起步极快。', 'Full torque from standstill: fierce launches.'],
      ['会动的部件极少，安静，几乎不用保养。', 'Very few moving parts: quiet and nearly maintenance-free.'],
      ['效率高，能把九成以上的电能变成动力，还能回收刹车的能量。', 'Highly efficient, turning over 90% of the electrical energy into motion, and it recovers braking energy.']
    ],
    cons: [
      ['电池又重又贵，续航受电池限制。', 'Batteries are heavy and expensive, and they limit range.'],
      ['长时间满功率会发热，需要好的冷却。', 'Sustained full power makes heat that needs good cooling.'],
      ['充电比加油慢。', 'Charging takes longer than refuelling.']
    ],
    cars: [
      { name: ['特斯拉 Model 3', 'Tesla Model 3'], engine: ['永磁同步磁阻电机', 'PM synchronous reluctance motor'], tags: [tags.ev], why: ['把电动车带进主流的车型之一。', 'One of the cars that took EVs mainstream.'] },
      { name: ['小米 SU7', 'Xiaomi SU7'], engine: ['超级电机', 'HyperEngine'], tags: [tags.ev], why: ['自研的高转速电机，每分钟能转两万多转。', 'An in-house high-speed motor that spins past 20,000 rpm.'] },
      { name: ['保时捷 Taycan', 'Porsche Taycan'], engine: ['前后双电机', 'Twin motors'], tags: [tags.ev], why: ['后轴带两挡变速箱，在电动车里很少见。', 'A two-speed gearbox on the rear axle, rare among EVs.'] }
    ],
    myth: {
      q: ['电动车为什么起步这么快？', 'Why do EVs launch so hard?'],
      a: ['因为电机从 0 转开始就能输出最大扭矩，不用像发动机那样先转起来，也不用等换挡。', 'Because a motor delivers full torque from zero rpm: no revving up as an engine must, and no gearchanges to wait for.']
    }
  },
  {
    id: 'fuel-cell', group: 'electric', view: 'fuelcell', kind: 'scene',
    eyebrow: 'HYDROGEN FUEL CELL',
    name: ['氢燃料电池', 'Hydrogen fuel cell'],
    tagline: ['氢和氧发电，只排出水', 'Hydrogen and oxygen make electricity; only water comes out'],
    facts: [[['燃料', 'Fuel'], ['高压氢气', 'High-pressure hydrogen']], [['怎么发电', 'How it works'], ['氢和氧在电堆里反应，不燃烧', 'Hydrogen and oxygen react in a stack, without burning']], [['排放', 'Emissions'], ['只有水', 'Only water']], [['常见于', 'Found in'], ['丰田 Mirai、现代 Nexo', 'Toyota Mirai, Hyundai Nexo']]],
    card: ['车上自己发电的电动车，只排出水。', 'An EV that makes its own electricity, emitting only water.'],
    lead: ['燃料电池车其实是一台电动车，只是电不是从插头来，而是车上自己"发"的：氢气和空气里的氧气在电堆里反应，直接产生电，副产品只有水。加满一次氢只要几分钟。', 'A fuel-cell car is really an electric car whose electricity is made on board rather than from a plug: hydrogen and oxygen from the air react in the stack and produce electricity directly, with only water left over. Refuelling takes minutes.'],
    analogy: ['像一块不用充电的电池：只要一直加氢，它就一直有电。', 'Like a battery that never needs charging: keep feeding it hydrogen and it keeps making electricity.'],
    steps: [
      { title: ['氢气进左边', 'Hydrogen in on the left'], text: ['氢气从高压储罐送进电堆的左边（负极）。', 'Hydrogen flows from the high-pressure tank into the left side of the stack (the anode).'],
        why: ['氢气非常轻，要压到几百个大气压，车上才装得下够跑几百公里的量。', 'Hydrogen is so light it must be compressed to hundreds of atmospheres for a car to carry enough for a few hundred kilometres.'], focus: ['tank', 'anode'] },
      { title: ['拆成质子和电子', 'Split into protons and electrons'], text: ['催化剂把每个氢分子拆开，变成两个质子（H⁺）和两个电子（e⁻）。', 'A catalyst splits each hydrogen molecule into two protons (H⁺) and two electrons (e⁻).'],
        why: ['催化剂（通常是铂）让这一步在常温下就能发生，完全不需要燃烧。', 'The catalyst, usually platinum, makes this happen at everyday temperatures, with no burning at all.'], focus: ['anode', 'membrane'] },
      { title: ['质子穿膜，电子绕路', 'Protons cross, electrons go round'], text: ['中间的膜只让质子穿过去；电子过不去，只能绕外面的电路走。', 'The membrane in the middle lets only protons through; electrons have to take the circuit outside.'],
        why: ['正是这股被逼着绕路的电子流形成了电流，带动电机。', 'That forced detour of electrons is the current, and it drives the motor.'], focus: ['membrane', 'circuit'] },
      { title: ['和氧结合成水', 'Combining with oxygen into water'], text: ['在右边（正极），质子、电子和空气里的氧气汇合，变成水，从排气口滴出来。', 'On the right (the cathode), protons, electrons and oxygen from the air meet and become water, which drips out of the exhaust.'],
        why: ['整个过程只排出水，没有二氧化碳；不过氢气本身是怎么生产的，决定了它到底有多环保。', 'The only exhaust is water, with no CO₂; how the hydrogen itself was made decides how clean it really is.'], focus: ['cathode', 'water'] },
      { title: ['整台车', 'The whole car'], text: ['真实的电堆由几百片这样的单元叠在一起，发的电送给电机。', 'A real stack layers hundreds of these cells, and its electricity goes to the motor.'],
        why: ['每片只能发不到 1 伏的电，叠起来才够用；车上还有一块小电池做缓冲，刹车时回收能量、加速时帮忙。', 'Each cell gives less than a volt, so they are stacked up; a small battery buffers them, recovering braking energy and helping under acceleration.'], focus: ['circuit', 'tank'] }
    ],
    parts: {
      tank: { name: ['氢罐', 'Hydrogen tank'], text: ['碳纤维缠绕的高压储罐。', 'A carbon-fibre-wound high-pressure tank.'] },
      anode: { name: ['负极（氢气侧）', 'Anode'], text: ['氢气在这里被催化剂拆成质子和电子。', 'Where the catalyst splits hydrogen into protons and electrons.'] },
      membrane: { name: ['质子交换膜', 'Proton exchange membrane'], text: ['只让质子通过，挡住电子，逼电子走外面的电路。', 'Lets protons through but blocks electrons, forcing them round the outside circuit.'] },
      cathode: { name: ['正极（空气侧）', 'Cathode'], text: ['质子、电子和氧气在这里结合成水。', 'Where protons, electrons and oxygen combine into water.'] },
      circuit: { name: ['外部电路', 'Outside circuit'], text: ['电子绕道走的路，也就是驱动电机的电流。', 'The electrons\' detour, which is the current that drives the motor.'] },
      water: { name: ['排出的水', 'Water out'], text: ['唯一的排放物。', 'The only emission.'] }
    },
    pros: [
      ['唯一的排放是水。', 'The only emission is water.'],
      ['加氢几分钟，续航和燃油车接近。', 'Refuels in minutes, with range close to a petrol car.'],
      ['开起来和纯电车一样安静平顺。', 'As quiet and smooth to drive as an EV.']
    ],
    cons: [
      ['加氢站非常少。', 'Very few hydrogen stations.'],
      ['氢的生产、压缩和运输都很耗能，"绿氢"还很贵。', 'Making, compressing and transporting hydrogen takes a lot of energy, and green hydrogen is still expensive.'],
      ['电堆要用铂这样的贵金属做催化剂，成本高。', 'The stack needs precious-metal catalysts such as platinum, which keeps costs high.']
    ],
    cars: [
      { name: ['丰田 Mirai', 'Toyota Mirai'], engine: ['燃料电池电堆 + 电机', 'Fuel-cell stack + motor'], tags: [tags.fcev], why: ['量产燃料电池车的代表。', 'The best-known production fuel-cell car.'] },
      { name: ['现代 Nexo', 'Hyundai Nexo'], engine: ['燃料电池电堆 + 电机', 'Fuel-cell stack + motor'], tags: [tags.fcev], why: ['燃料电池 SUV。', 'A fuel-cell SUV.'] },
      { name: ['丰田氢燃料卡罗拉赛车', 'Toyota hydrogen Corolla race car'], engine: ['1.6 三缸涡轮，烧氢', '1.6 turbo three, burning hydrogen'], tags: [tags.i3, tags.h2ice], why: ['对照：它是直接"烧"氢的内燃机，不是燃料电池，在日本超级耐力赛里跑。', 'For contrast: an engine that burns hydrogen, not a fuel cell; it races in Japan\'s Super Taikyu series.'] }
    ],
    myth: {
      q: ['燃料电池车会像氢气球一样爆炸吗？', 'Can a fuel-cell car explode like a hydrogen balloon?'],
      a: ['氢罐用碳纤维缠绕，能承受很高的压力，还要通过碰撞和火烧测试；氢气比空气轻得多，一旦泄漏会很快向上散开。它的安全标准和其他新能源车一样严格。', 'The tanks are carbon-fibre wound to hold very high pressure and must pass crash and fire tests; hydrogen is much lighter than air and disperses upward quickly if it leaks. The safety standards are as strict as for other new-energy cars.']
    }
  },
  {
    id: 'f1-2026', group: 'racing', view: 'f1', kind: 'crank', speed: 30,
    eyebrow: 'F1 POWER UNIT 2026',
    name: ['F1 动力单元', 'F1 power unit'],
    tagline: ['2026：油电差不多一半一半', '2026: roughly half fuel, half electric'],
    facts: [[['发动机', 'Engine'], ['1.6 升 90° V6 + 一个涡轮', '1.6 L 90° V6, one turbo']], [['电机', 'Motor'], ['MGU-K 350 kW（之前 120 kW）', 'MGU-K 350 kW (was 120 kW)']], [['取消', 'Dropped'], ['MGU-H', 'MGU-H']], [['燃料', 'Fuel'], ['100% 可持续燃料', '100% sustainable fuel']]],
    card: ['1.6 升 V6 涡轮 + 350 kW 电机。', '1.6-litre turbo V6 plus a 350 kW motor.'],
    lead: ['F1 赛车用的不叫发动机，叫"动力单元"：一台 1.6 升 V6 涡轮，加上电机和电池。2026 年的新规则把电机功率提到 350 kW，内燃机降到约 400 kW，油和电差不多各占一半，同时取消了 MGU-H，并改用 100% 可持续燃料。', 'An F1 car runs a "power unit", not just an engine: a 1.6-litre turbo V6 plus a motor and a battery. The 2026 rules raise the motor to 350 kW and bring the engine down to about 400 kW, so fuel and electricity share the work roughly half and half. The MGU-H is dropped, and the fuel is 100% sustainable.'],
    analogy: ['像一个短跑运动员背着一个能充电的助推器：刹车时把力气存进去，出弯和直道上再放出来。', 'Like a sprinter wearing a rechargeable booster: it stores energy under braking and gives it back out of corners and down the straights.'],
    steps: [
      { title: ['1.6 升 V6 涡轮', 'A 1.6-litre turbo V6'], text: ['发动机部分还是 1.6 升、90° 夹角的 V6，带一个涡轮。', 'The engine is still a 1.6-litre 90° V6 with one turbo.'],
        why: ['这套基本结构从 2014 年沿用至今，2026 年变的主要是电的部分和燃料。', 'That layout has carried over from 2014; what changes in 2026 is mainly the electric side and the fuel.'], focus: ['ice', 'turbo'] },
      { title: ['油电差不多一半一半', 'Roughly half and half'], text: ['2026 年起，[[mgu-k|MGU-K]] 从 120 kW 提到 350 kW，内燃机降到约 400 kW。', 'From 2026 the [[mgu-k|MGU-K]] jumps from 120 kW to 350 kW, and the engine drops to about 400 kW.'],
        why: ['这样一来，最大功率里电占了将近一半，电池怎么充、什么时候放，变得和发动机一样重要。', 'That makes electricity nearly half the peak power, so how the battery is charged and when it is spent matter as much as the engine.'], focus: ['split', 'mguk'] },
      { zone: 'brake', title: ['刹车时充电', 'Harvesting under braking'], text: ['进弯刹车时，MGU-K 反过来当发电机，把车的动能变成电，经过控制电子存进电池。', 'Braking into a corner, the MGU-K turns generator and sends the car\'s energy through the control electronics into the battery.'],
        why: ['这部分能量本来会变成刹车盘上的热；收回来，出弯时就能再用。', 'That energy would otherwise become heat in the brakes; stored, it can be used again out of the corner.'], focus: ['mguk', 'es', 'lap'] },
      { zone: 'deploy', title: ['出弯和直道放电', 'Deploying out of corners'], text: ['出弯加速和直道上，电池把电送回 MGU-K，和发动机一起推车。', 'Out of corners and down the straights the battery feeds the MGU-K, which pushes alongside the engine.'],
        why: ['电池能存的电有限，用完了就只剩发动机，所以每一圈在哪里放电都要提前算好。', 'The battery only holds so much, and once it is spent only the engine is left, so where to deploy is planned lap by lap.'], focus: ['mguk', 'es', 'lap'] },
      { title: ['取消 MGU-H', 'No more MGU-H'], text: ['2014–2025 年，涡轮轴上还有一个 [[mgu-h|MGU-H]]，2026 年被取消。点下面的"2014–2025"对比一下。', 'From 2014 to 2025 the turbo shaft also carried an [[mgu-h|MGU-H]]; 2026 drops it. Tap "2014–2025" below to compare.'],
        why: ['它能从废气里回收能量、消除涡轮迟滞，但又贵又复杂，对公路车也没多大用处；取消它能降低成本，也方便新厂商加入。', 'It recovered energy from the exhaust and killed turbo lag, but it was costly, complex and of little use to road cars; dropping it cuts cost and makes it easier for new manufacturers to join.'], focus: ['turbo', 'mguh'] },
      { title: ['100% 可持续燃料', '100% sustainable fuel'], text: ['燃料必须是 100% 可持续燃料，而且按能量限流。', 'The fuel must be 100% sustainable, and its flow is capped by energy.'],
        why: ['限制的是每小时烧进去多少能量，而不是多少公斤，这样不同配方的燃料才站在同一条起跑线上。', 'The limit is how much energy goes in per hour, not how many kilograms, which keeps different fuel recipes on equal terms.'], focus: ['fuel', 'ice'] }
    ],
    parts: {
      ice: { name: ['内燃机（V6）', 'Combustion engine (V6)'], text: ['1.6 升、90° 夹角的 V6，按规则 2026 年最大功率降到约 400 kW。', 'A 1.6-litre 90° V6; under the 2026 rules it makes about 400 kW at most.'] },
      turbo: { name: ['涡轮增压器', 'Turbocharger'], text: ['一个涡轮，废气吹动涡轮端，带动压气机。', 'One turbo: exhaust spins the turbine, which drives the compressor.'] },
      mguh: { name: ['MGU-H', 'MGU-H'], text: ['"热能回收电机"，装在涡轮轴上。2014–2025 年使用，2026 年取消。', 'The heat motor-generator on the turbo shaft. Used 2014–2025, dropped for 2026.'] },
      mguk: { name: ['MGU-K', 'MGU-K'], text: ['"动能回收电机"，和曲轴连在一起：刹车时发电，加速时出力。2026 年功率从 120 kW 提高到 350 kW。', 'The kinetic motor-generator, geared to the crankshaft: it harvests under braking and pushes under acceleration. Up from 120 kW to 350 kW in 2026.'] },
      ce: { name: ['控制电子（CE）', 'Control electronics'], text: ['管理电在电机和电池之间怎么流。', 'Manages how electricity moves between the motor and the battery.'] },
      es: { name: ['电池（ES）', 'Energy store'], text: ['储存回收来的电，在需要时放出来。', 'Stores harvested energy and releases it when needed.'] },
      split: { name: ['功率分配', 'Power split'], text: ['点下面的年代按钮，比较 2014–2025 和 2026 的油电比例。', 'Tap the era buttons below to compare the split in 2014–2025 and 2026.'] },
      lap: { name: ['一圈的充放电', 'Energy over a lap'], text: ['黄色是刹车区，在这里充电；其余地方放电。曲线只是示意，不对应某条赛道。', 'Yellow marks the braking zones, where it harvests; elsewhere it deploys. A stylised lap, not a real circuit.'] },
      fuel: { name: ['可持续燃料', 'Sustainable fuel'], text: ['不来自石油的燃料，按能量限制流量。', 'Fuel not made from crude oil, with flow capped by energy.'] }
    },
    pros: [
      ['电的比重大大提高，和量产车的电动化方向更接近。', 'Far more electric power, in step with how road cars are electrifying.'],
      ['取消昂贵复杂的 MGU-H，让新厂商更容易加入：奥迪和福特（与红牛合作）都在 2026 年入局。', 'Dropping the costly, complex MGU-H opened the door to newcomers: Audi, and Ford with Red Bull, arrive in 2026.'],
      ['100% 可持续燃料，让内燃机也能走向低碳。', '100% sustainable fuel puts the combustion engine on a low-carbon path.']
    ],
    cons: [
      ['电池一圈能放的电有限，长直道末端可能不够用，所以 2026 赛车配了可调的主动空气动力学来减阻。', 'Energy per lap is limited and can run short at the end of long straights, so 2026 cars pair the power unit with active aerodynamics to cut drag.'],
      ['没有了 MGU-H，涡轮迟滞的问题又回来了，要靠别的办法弥补。', 'Without the MGU-H, turbo lag is back and has to be handled other ways.'],
      ['车手和车队要更精细地管理每一圈的充放电。', 'Drivers and teams have to manage harvesting and deployment more carefully every lap.']
    ],
    carsTitle: ['2026 年的动力单元供应商', '2026 power unit suppliers'],
    cars: [
      { name: ['梅赛德斯', 'Mercedes'], engine: ['供应：梅赛德斯、迈凯伦、威廉姆斯、Alpine', 'Supplies Mercedes, McLaren, Williams, Alpine'], tags: [tags.v6, tags.turboHybrid], why: ['混动时代（2014 年起）最成功的动力单元厂商。', 'The most successful manufacturer of the hybrid era (since 2014).'] },
      { name: ['法拉利', 'Ferrari'], engine: ['供应：法拉利、哈斯、凯迪拉克', 'Supplies Ferrari, Haas, Cadillac'], tags: [tags.v6, tags.turboHybrid], why: ['唯一从 1950 年起每个赛季都参加 F1 的车队，自己造动力单元。', 'The only team in every season since 1950, and it builds its own power unit.'] },
      { name: ['本田', 'Honda'], engine: ['供应：阿斯顿·马丁', 'Supplies Aston Martin'], tags: [tags.v6, tags.turboHybrid], why: ['2026 年起成为阿斯顿·马丁的厂商合作伙伴。', 'Aston Martin\'s works partner from 2026.'] },
      { name: ['奥迪', 'Audi'], engine: ['供应：奥迪', 'Supplies Audi'], tags: [tags.v6, tags.turboHybrid], why: ['接手索伯车队，以厂商身份进入 F1。', 'Took over Sauber to enter as a works team.'] },
      { name: ['红牛福特', 'Red Bull Ford'], engine: ['供应：红牛、Racing Bulls', 'Supplies Red Bull Racing, Racing Bulls'], tags: [tags.v6, tags.turboHybrid], why: ['红牛第一次自己造动力单元，福特支持电气化部分。', 'Red Bull\'s first in-house power unit, with Ford supporting the electrical side.'] }
    ],
    myth: {
      q: ['"油电各一半"是什么意思？', 'What does "half and half" mean?'],
      a: ['说的是最大功率：内燃机约 400 kW，MGU-K 350 kW。但电池能存的电有限，电机不能整圈都满功率，所以车队要算好每一圈在哪里充电、在哪里放电。', 'It refers to peak power: about 400 kW from the engine and 350 kW from the MGU-K. The battery holds only so much, so the motor cannot run flat out all lap; teams plan where to harvest and where to deploy.']
    }
  }
];

export const entryById = id => ENTRIES.find(e => e.id === id);
