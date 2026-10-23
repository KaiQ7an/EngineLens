'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const words = {
  zh: {
    navExplore:'原理探索',navCompare:'横向对比',navFilm:'原理短片 ↗',hero:'看懂每一口<span>动力。</span>',heroSub:'空气如何进入发动机，决定了动力如何到来。<br>三种进气方式，一次看懂。',heroSide:'把看不见的气流，<br>变成看得懂的机械。',watch:'播放原理短片',watchMeta:'36 秒 · 动态演示 · 双语字幕',live:'实时机械演示',na:'自然吸气',turbo:'涡轮增压',super:'机械增压',drivenBy:'驱动来源',character:'动力性格',pause:'Ⅱ 暂停动画',resume:'▶ 继续动画',fresh:'新鲜空气',exhaust:'高温废气',mechanical:'机械连接',diagramNote:'结构示意 · 非工程比例',engineSpeed:'发动机转速',dragHint:'拖动滑块，观察气流变化',boost:'示意增压值',boostNote:'相对于大气压 · 教学模型',accelerate:'模拟急加速',commonGround:'先理解它们的共同点',commonTitle:'动力，始于呼吸。',commonDesc:'在燃油与控制策略匹配的条件下，更多氧气允许燃烧更多燃油，从而释放更多动力。三者的不同，在于谁来把空气送进去。',intake:'进气',intakeDesc:'空气进入气缸',compression:'压缩',compressionDesc:'活塞向上压缩混合气',power:'做功',powerDesc:'点火燃烧推动活塞',outlet:'排气',outletDesc:'废气离开气缸',cycleNote:'以四冲程火花点火发动机为例。进气、压缩、做功、排气构成一个完整循环。',compareLabel:'同一问题，三种答案',curveTitle:'不同的进气，<br>不同的节奏。',curveDesc:'自然吸气渐进释放；涡轮增压建立压力后更有力；容积式机械增压通常从低转速就能提供帮助。',torqueChart:'相对扭矩 / 转速',illustrative:'教学示意曲线',chartNote:'同排量、全负荷的概念对比，非实测数据。曲线取决于发动机设计、增压器类型与标定；不能用于车型性能判断。',dimension:'比较维度',bannerTitle:'把原理，放映出来。',bannerDesc:'三种结构，连续演示。全屏观看，跟随双语字幕理解动力。',sources:'原理参考与模型说明',sourceNote:'本页为简化教学可视化，不是发动机仿真软件。涡轮增压以废气驱动涡轮、同轴带动压气机；机械增压演示采用曲轴皮带驱动的容积式结构。实际机械增压器还包括离心式等，响应特性不同。自然吸气依靠进气压差，不使用增压器。增压数值和扭矩曲线均为示意，不对应任何量产车型。急加速模拟在固定转速下演示增压响应，不代表车辆加速测试。',footer:'让复杂机械，一目了然。',cinemaTitle:'原理短片 / 36 SEC',filmPause:'Ⅱ 暂停',filmPlay:'▶ 播放',replay:'↺ 重新播放',fullscreen:'⛶ 全屏',exitFull:'⛶ 退出全屏',filmNote:'无声演示 · 中英双语字幕 · 点击章节可跳转',response:'试着改变转速，或模拟一次急加速，观察进气系统的响应。',accelRunning:'急加速模拟中：观察压力如何建立。',responseNA:'自然吸气：没有增压器需要起转；进气仍受节气门与进气系统影响。',responseTurbo:'涡轮增压：废气能量增加后，涡轮逐步提速，增压压力随之建立。',responseSuper:'机械增压：皮带直接驱动容积式增压器，压力响应较快，但会消耗曲轴功率。'
  },
  en: {
    navExplore:'Explore',navCompare:'Compare',navFilm:'Watch the film ↗',hero:'A closer look.<br>A deeper <span>breath.</span>',heroSub:'How an engine breathes shapes how it delivers power.<br>Three ways in. One clear explanation.',heroSide:'Invisible airflow.<br>Visible engineering.',watch:'Watch the explainer',watchMeta:'36 seconds · Animated · Bilingual captions',live:'LIVE ENGINE SCHEMATIC',na:'Naturally aspirated',turbo:'Turbocharged',super:'Supercharged',drivenBy:'Airflow driven by',character:'Power delivery',pause:'Ⅱ Pause animation',resume:'▶ Resume animation',fresh:'Intake air',exhaust:'Exhaust gas',mechanical:'Mechanical link',diagramNote:'Schematic · Not to scale',engineSpeed:'Engine speed',dragHint:'Drag to explore the airflow',boost:'Illustrative boost',boostNote:'Above atmospheric pressure · Model',accelerate:'Simulate throttle tip-in',commonGround:'START WITH THE COMMON GROUND',commonTitle:'Power begins with a breath.',commonDesc:'With matching fueling and control, more oxygen allows more fuel to burn and more power to be released. The difference is how that air gets into the cylinders.',intake:'Intake',intakeDesc:'Air enters the cylinder',compression:'Compression',compressionDesc:'The piston compresses the charge',power:'Power',powerDesc:'Combustion pushes the piston down',outlet:'Exhaust',outletDesc:'Exhaust gas leaves the cylinder',cycleNote:'A four-stroke spark-ignition engine is shown. Intake, compression, power and exhaust form one complete cycle.',compareLabel:'ONE QUESTION. THREE ANSWERS.',curveTitle:'Different breaths.<br>Different rhythms.',curveDesc:'Naturally aspirated torque builds progressively. A turbo adds torque as boost builds. A positive-displacement supercharger typically helps from low engine speeds.',torqueChart:'Relative torque / Engine speed',illustrative:'ILLUSTRATIVE MODEL',chartNote:'Conceptual full-load comparison at equal displacement, not measured data. Curves depend on engine design, compressor type and calibration. Not a vehicle performance comparison.',dimension:'Characteristic',bannerTitle:'See the principles in motion.',bannerDesc:'Three systems. One continuous film. Fullscreen, with bilingual captions.',sources:'Technical references & model notes',sourceNote:'This is a simplified educational visualization, not an engine simulator. A turbo uses exhaust energy to drive a turbine linked to a compressor. The supercharger shown is a belt-driven, positive-displacement design; centrifugal and other designs have different response characteristics. Naturally aspirated engines rely on pressure differences without a boost compressor. Boost and torque values are illustrative, not production-engine data. The throttle-tip-in demo illustrates boost response at fixed RPM; it is not a vehicle acceleration test.',footer:'Complex machines. Clear understanding.',cinemaTitle:'THE EXPLAINER / 36 SEC',filmPause:'Ⅱ Pause',filmPlay:'▶ Play',replay:'↺ Replay',fullscreen:'⛶ Fullscreen',exitFull:'⛶ Exit fullscreen',filmNote:'Silent animation · Chinese & English captions · Click a chapter to jump',response:'Change the engine speed, or simulate throttle tip-in to see how each system responds.',accelRunning:'Throttle tip-in: watch how pressure builds.',responseNA:'Naturally aspirated: no boost compressor has to spool up. Response still depends on the throttle and intake system.',responseTurbo:'Turbocharged: more exhaust energy accelerates the turbo, building intake pressure over time.',responseSuper:'Supercharged: a belt drives the positive-displacement blower directly, delivering a fast response while drawing crankshaft power.'
  }
};
const systems = {
  na:{tag:'PRESSURE-DRIVEN',enName:'NATURALLY ASPIRATED',title:['靠自己，<br>深吸一口气。','A deep breath.<br>All on its own.'],desc:['活塞下行，使气缸内压力降低。外部空气在压差作用下，经进气道进入气缸，无需额外的增压装置。','As the piston moves down, cylinder pressure falls. A pressure difference brings outside air through the intake, without a boost compressor.'],drive:['进气压差','Pressure difference'],character:['线性、渐进','Progressive, linear'],insight:['“自然”不等于空气自己流入；让空气流动的是压力差。','“Natural” does not mean air moves by itself. A pressure difference drives the flow.']},
  turbo:{tag:'EXHAUST-DRIVEN',enName:'TURBOCHARGED',title:['让废气，<br>再做一次功。','Give exhaust<br>a second job.'],desc:['高温废气驱动涡轮旋转，通过同一根轴带动压气机。新鲜空气被压缩、冷却，再送入气缸。','Exhaust gas spins a turbine. A shared shaft drives the compressor, which pressurizes fresh air before it is cooled and fed to the cylinder.'],drive:['废气能量','Exhaust energy'],character:['增压建立后更有力','Stronger as boost builds'],insight:['废气与新鲜空气走不同的通道；传递能量的是中间的轴。','Exhaust and fresh air stay in separate paths. The connecting shaft transfers the energy.']},
  super:{tag:'CRANKSHAFT-DRIVEN',enName:'SUPERCHARGED',title:['随转随到，<br>直接给空气加压。','Direct drive.<br>Ready to breathe.'],desc:['曲轴通过皮带直接带动增压器，将更多空气送入发动机。这里演示的是容积式机械增压结构。','A belt connects the crankshaft to the supercharger, delivering more air to the engine. This example uses a positive-displacement blower.'],drive:['曲轴与传动皮带','Crankshaft via belt'],character:['低转响应直接','Responsive at low RPM'],insight:['更快建立压力的代价，是增压器本身需要消耗发动机的机械功率。','Fast boost response comes with a trade-off: the blower takes mechanical power from the engine.']}
};
const comparison = [
  [['空气如何进入','Air delivery'],['进气压差吸入','Intake pressure difference'],['压气机加压送入','Turbo compressor'],['容积式增压器送入','Positive-displacement blower']],
  [['增压器动力来源','Compressor drive'],['无增压器','No boost compressor'],['排气驱动涡轮','Exhaust-driven turbine'],['曲轴经皮带驱动','Belt from crankshaft']],
  [['响应特点','Response'],['通常线性、直接','Typically progressive'],['可能存在增压迟滞','May exhibit turbo lag'],['通常建立压力较快','Typically quick boost response']],
  [['主要取舍','Trade-off'],['动力提升更依赖排量与转速','Output relies more on displacement / RPM'],['热管理与控制更复杂','More heat / control complexity'],['驱动增压器消耗机械功','Blower draws crankshaft power']]
];
let lang='zh';try{lang=localStorage.getItem('enginelens-language')==='en'?'en':'zh';}catch{}
let mode='turbo',rpm=3000,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,clock=0,last=0,boostFactor=1,transient=-1;
const engine=$('#engine'),ec=engine.getContext('2d'),chart=$('#chart'),cc=chart.getContext('2d');
const cinema=$('#cinema'),film=$('#film'),fc=film.getContext('2d');
const filmBuffer=document.createElement('canvas');filmBuffer.width=1300;filmBuffer.height=650;const filmBufferContext=filmBuffer.getContext('2d');
let filmTime=0,filmPlaying=false;
const t=k=>words[lang][k]||k;
const bi=a=>a[lang==='zh'?0:1];
const modelBoost=(m,r)=>m==='na'?-.03:m==='turbo'?Math.min(.85,Math.max(0,(r-1500)/2300)*.85):.38+(r-1000)/5500*.32;
function applyLanguage(){
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  document.title=lang==='zh'?'EngineLens — 看懂每一口动力':'EngineLens — A closer look at power';
  $$('[data-i18n]').forEach(e=>{e.innerHTML=t(e.dataset.i18n)});
  $$('[data-lang]').forEach(e=>{const yes=e.dataset.lang===lang;e.classList.toggle('active',yes);e.setAttribute('aria-pressed',yes)});
  $('#comparison-body').innerHTML=comparison.map(row=>'<tr>'+row.map((cell,i)=>`<${i?'td':'th'}${i?'':' scope="row"'}>${bi(cell)}</${i?'td':'th'}>`).join('')+'</tr>').join('');
  $('#next-mode').ariaLabel=lang==='zh'?'下一种进气方式':'Next induction type';
  $('#close-film').ariaLabel=lang==='zh'?'关闭短片':'Close film';
  engine.ariaLabel=lang==='zh'?'发动机动态结构示意：展示进气、活塞、压气机与排气路径':'Animated engine schematic showing intake, piston, compressor and exhaust paths';
  updateMode();updatePause();updateFilmControls();drawChart();
}
function updateMode(){const s=systems[mode];$('#mode-tag').textContent=s.tag;$('#mode-title').innerHTML=bi(s.title);$('#mode-desc').textContent=bi(s.desc);$('#drive').textContent=bi(s.drive);$('#character').textContent=bi(s.character);$('#insight').textContent=bi(s.insight);$('#mode-count').textContent=`0${Object.keys(systems).indexOf(mode)+1} / 03`;$('#diagram-title').textContent=s.enName+' / SYSTEM VIEW';$$('[data-mode]').forEach(e=>{const yes=e.dataset.mode===mode;e.classList.toggle('active',yes);e.setAttribute('aria-pressed',yes)});$('#response').textContent=t('response');}
function chooseMode(m){mode=m;transient=-1;boostFactor=1;updateMode();drawChart();}
function updatePause(){$('#pause').textContent=t(paused?'resume':'pause');$('#pause').setAttribute('aria-pressed',paused);}
$$('[data-lang]').forEach(e=>e.addEventListener('click',()=>{lang=e.dataset.lang;try{localStorage.setItem('enginelens-language',lang)}catch{}applyLanguage();}));
$$('[data-mode]').forEach(e=>e.addEventListener('click',()=>chooseMode(e.dataset.mode)));
$('#next-mode').addEventListener('click',()=>{const modes=Object.keys(systems);chooseMode(modes[(modes.indexOf(mode)+1)%3]);});
$('#rpm').addEventListener('input',e=>{rpm=+e.target.value;$('#rpm-value').textContent=rpm.toLocaleString('en');drawChart();});
$('#pause').addEventListener('click',()=>{paused=!paused;updatePause();});
$('#accelerate').addEventListener('click',()=>{paused=false;updatePause();transient=0;boostFactor=0;$('#response').textContent=t('accelRunning');});

// The geometry is deliberately schematic. Flow and linkage animation illustrate
// the mechanism; RPM, boost response and torque are educational model values.
const C={bg:'#172329',grid:'#9db7b407',cold:'#75c4d2',hot:'#ed714d',metal:'#aebdb8',dim:'#6d8586',green:'#92b79a'};
function txt(c,str,x,y,size=12,color=C.dim,align='left',weight='400'){c.fillStyle=color;c.textAlign=align;c.font=`${weight} ${size}px "DM Sans", "Noto Sans SC", sans-serif`;c.fillText(str,x,y);}
function line(c,pts,color,width=1){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function round(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function circle(c,x,y,r,fill,stroke){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function flow(c,pts,color,time,rate=1){c.lineCap='round';c.lineJoin='round';line(c,pts,'#8ca9aa25',22);line(c,pts,'#101d22',18);line(c,pts,color+'30',10);line(c,pts,color+'66',1);const segments=pts.slice(1).map((p,i)=>Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1]));const total=segments.reduce((a,b)=>a+b,0);for(let i=0;i<total/39;i++){let d=(i*39+time*34*rate)%total;for(let j=0;j<segments.length;j++){if(d<=segments[j]){const f=d/segments[j],x=pts[j][0]+(pts[j+1][0]-pts[j][0])*f,y=pts[j][1]+(pts[j+1][1]-pts[j][1])*f;circle(c,x,y,2.2,color);break;}d-=segments[j];}}}
function leader(c,str,x,y,tx,ty,color=C.dim,align='left'){txt(c,str,x,y,12,color,align);const sx=align==='right'?x-7:x+7;line(c,[[sx,y+8],[sx,ty-15],[tx,ty]],color+'55');circle(c,tx,ty,2,color);}
function wheel(c,x,y,r,angle,color){
  const g=c.createRadialGradient(x-20,y-20,3,x,y,r);g.addColorStop(0,'#526768');g.addColorStop(.6,'#2d4449');g.addColorStop(1,'#1b3036');circle(c,x,y,r+12,'#20353b','#496064');circle(c,x,y,r+5,g,color+'70');circle(c,x,y,r-6,'#172c32','#5a7474');
  c.save();c.translate(x,y);c.rotate(angle);for(let i=0;i<12;i++){c.rotate(Math.PI/6);c.beginPath();c.moveTo(8,-4);c.bezierCurveTo(20,-18,r-12,-20,r-4,-4);c.lineTo(r-14,5);c.quadraticCurveTo(20,-3,8,5);c.fillStyle=i%2?color+'85':color+'50';c.fill();c.strokeStyle=color+'90';c.lineWidth=.6;c.stroke();}circle(c,0,0,12,'#718986','#b6c7bc');circle(c,0,0,4,'#263f44');c.restore();
  for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(c,x+Math.cos(a)*(r+8),y+Math.sin(a)*(r+8),2,'#7a9290');}
}
function cooler(c,x,y){round(c,x-32,y-35,64,70,5,'#233c42','#597b7e');for(let i=-23;i<=23;i+=7)line(c,[[x+i,y-25],[x+i,y+25]],'#649ca17a',2);round(c,x-37,y-29,8,58,2,'#3f6369');round(c,x+29,y-29,8,58,2,'#3f6369');}
function cylinder(c,time){
  const phase=(time*.78)%(Math.PI*4),stroke=Math.floor(phase/Math.PI);const y=343+(1-Math.cos(phase))*27;const cx=560,cy=493,a=phase;const pin=[cx+Math.sin(a)*30,cy-Math.cos(a)*30];
  round(c,453,306,214,213,18,'#1d3036','#41585a');for(let xx of [463,657])for(let yy of [318,506]){circle(c,xx,yy,3,'#7b9592');circle(c,xx,yy,1,'#172329');}
  const wall=c.createLinearGradient(478,0,642,0);wall.addColorStop(0,'#465e61');wall.addColorStop(.13,'#2a4146');wall.addColorStop(.5,'#203238');wall.addColorStop(.87,'#2a4146');wall.addColorStop(1,'#465e61');round(c,478,325,164,135,3,wall,'#617e7e');
  const chamber=c.createLinearGradient(0,325,0,y);chamber.addColorStop(0,stroke===2?'#ee774d8a':stroke===0?'#6dbcca30':'#b7d9b012');chamber.addColorStop(1,'#192d3300');c.fillStyle=chamber;c.fillRect(487,326,146,Math.max(0,y-326));
  for(let i=0;i<8;i++){const px=493+i*17,py=331+((time*12+i*9)%Math.max(10,y-333));circle(c,px,py,1,stroke===2?'#f8aa6c66':'#8ac8d866');}
  circle(c,cx,cy,48,'#14262c','#436369');c.save();c.translate(cx,cy);c.rotate(a);round(c,-15,-37,30,74,14,'#496767','#8aa49f');circle(c,0,0,15,'#253d43','#8da8a0');c.restore();
  line(c,[pin,[cx,y+17]],'#162a30',16);line(c,[pin,[cx,y+17]],'#8aa6a0',10);line(c,[pin,[cx,y+17]],'#a3bab1',2);circle(c,...pin,10,'#648680','#a6c0b2');circle(c,...pin,4,'#213c42');
  const metal=c.createLinearGradient(490,0,630,0);metal.addColorStop(0,'#5c7a7a');metal.addColorStop(.35,'#c2cec0');metal.addColorStop(.7,'#a6bbae');metal.addColorStop(1,'#4a6c6d');round(c,488,y,144,34,3,metal,'#bdd0c0');for(let j=0;j<3;j++)line(c,[[489,y+5+j*5],[631,y+5+j*5]],'#2e4a50',2);circle(c,cx,y+24,7,'#445e60','#c4d4c3');
  round(c,474,310,172,13,2,'#577270','#9bb5aa');
  for(let [vx,isIntake] of [[510,true],[610,false]]){const open=(isIntake&&stroke===0)||(!isIntake&&stroke===3)?5:0;line(c,[[vx,287],[vx,325+open]],isIntake?C.cold:C.hot,3);line(c,[[vx-12,325+open],[vx+12,325+open]],isIntake?C.cold:C.hot,4);for(let s=0;s<4;s++)line(c,[[vx-5,295+s*4],[vx+5,297+s*4]],'#9eb2a3',1);}
  line(c,[[560,290],[560,329]],'#bec8b4',4);round(c,553,294,14,13,2,'#9dafa7');if(stroke===2&&phase%Math.PI<.5){c.save();c.shadowColor='#ffb25f';c.shadowBlur=30;line(c,[[560,325],[552,336],[565,337],[557,350]],'#ffd68b',3);c.restore();}
  txt(c,['INTAKE','COMPRESSION','POWER','EXHAUST'][stroke],560,563,11,stroke===2?C.hot:C.dim,'center');
  for(let i=0;i<4;i++)round(c,526+i*19,542,12,2,1,i===stroke?C.hot:'#355052');
}
function render(c,w,h,m,time,r=3000,factor=1){
  c.save();c.setTransform(1,0,0,1,0,0);c.fillStyle=C.bg;c.fillRect(0,0,w,h);c.scale(w/1040,h/580);
  c.strokeStyle=C.grid;c.lineWidth=.6;for(let x=20;x<1040;x+=40){c.beginPath();c.moveTo(x,15);c.lineTo(x,570);c.stroke()}for(let y=15;y<580;y+=40){c.beginPath();c.moveTo(15,y);c.lineTo(1025,y);c.stroke()}
  for(let [x,y] of [[38,35],[1002,35],[38,545],[1002,545]]){line(c,[[x-4,y],[x+4,y]],'#8ea7a344');line(c,[[x,y-4],[x,y+4]],'#8ea7a344');}
  const cn=(zh,en)=>lang==='zh'?zh:en;
  if(m==='turbo'){
    flow(c,[[72,155],[328,155]],C.cold,time,.8+r/3000);
    flow(c,[[400,225],[400,260],[260,260],[260,390],[430,390],[430,285],[510,285],[510,312]],C.cold,time,1+factor*r/3000);
    flow(c,[[610,312],[610,280],[785,280],[785,155],[697,155]],C.hot,time,1+r/3000);
    flow(c,[[625,83],[625,58],[938,58],[938,156]],C.hot,time,1+r/3000);
    line(c,[[400,155],[625,155]],'#4d6665',11);line(c,[[400,155],[625,155]],'#9fb7a8',2);
    wheel(c,400,155,58,time*(3+factor*6),C.cold);wheel(c,625,155,58,time*(3+factor*6),C.hot);cooler(c,260,337);
    txt(c,cn('空气滤清器','AIR FILTER'),106,111,11,C.dim);round(c,95,134,48,42,4,'#20373e','#4b737a');for(let i=103;i<140;i+=7)line(c,[[i,140],[i,170]],'#64969d',1);
    leader(c,cn('压气机','COMPRESSOR'),290,52,365,104,C.cold);leader(c,cn('涡轮','TURBINE'),742,65,666,110,C.hot,'right');
    txt(c,cn('同轴连接 / 废气与空气不混合','SHARED SHAFT / SEPARATE GAS PATHS'),512,245,9,C.dim,'center');
    leader(c,cn('中冷器','INTERCOOLER'),92,355,225,337,C.cold);txt(c,cn('新鲜空气进入','FRESH AIR IN'),72,206,11,C.cold);txt(c,cn('废气排出','EXHAUST OUT'),939,188,11,C.hot,'right');
    txt(c,cn('废气能量 → 旋转 → 空气增压','EXHAUST ENERGY → ROTATION → BOOST'),805,379,10,C.dim,'center');
  }else if(m==='na'){
    flow(c,[[76,214],[335,214],[335,285],[510,285],[510,312]],C.cold,time,1+r/3000);
    flow(c,[[610,312],[610,255],[844,255],[938,255]],C.hot,time,1+r/3000);
    round(c,120,189,67,50,5,'#243b40','#557d7e');for(let i=130;i<180;i+=8)line(c,[[i,197],[i,230]],'#77a6aa',2);
    circle(c,310,214,15,'#1b2d34','#75b5c0');line(c,[[302,201],[318,227]],C.cold,3);
    leader(c,cn('空气滤清器','AIR FILTER'),117,139,153,190,C.cold);leader(c,cn('节气门','THROTTLE'),334,139,311,200,C.cold);
    txt(c,cn('新鲜空气进入','FRESH AIR IN'),76,265,12,C.cold);txt(c,cn('废气直接排出','EXHAUST OUT'),938,303,12,C.hot,'right');
    txt(c,cn('无需额外增压器','NO BOOST COMPRESSOR'),562,119,17,'#adbfad','center');txt(c,cn('活塞下行 → 压力降低 → 空气流入','PISTON DOWN → PRESSURE DROP → AIR IN'),562,151,11,C.dim,'center');
    line(c,[[535,206],[535,247]],'#8bb2a34d');line(c,[[585,206],[585,247]],'#8bb2a34d');line(c,[[528,240],[535,247],[542,240]],'#8bb2a34d');line(c,[[578,240],[585,247],[592,240]],'#8bb2a34d');
  }else{
    flow(c,[[76,155],[324,155]],C.cold,time,1+r/3000);flow(c,[[476,155],[785,155],[785,258],[430,258],[430,285],[510,285],[510,312]],C.cold,time,1+r/3000);flow(c,[[610,312],[610,280],[889,280],[939,280]],C.hot,time,1+r/3000);
    cooler(c,706,258);
    line(c,[[370,192],[320,493],[368,493],[418,192]],'#7b91816b',6);c.save();c.setLineDash([9,9]);c.lineDashOffset=-time*35;line(c,[[370,192],[320,493],[368,493],[418,192]],'#a3b49d',1.5);c.restore();
    line(c,[[344,493],[560,493]],'#799488',5);circle(c,344,493,27,'#243b40','#78958b');circle(c,344,493,19,'#182c32','#57796f');circle(c,344+Math.sin(time)*17,493+Math.cos(time)*17,3,'#8ca794');
    round(c,318,99,164,112,24,'#29454b','#86a69d');
    for(let [x,reverse] of [[366,1],[432,-1]]){c.save();c.translate(x,155);c.rotate(time*2*reverse);for(let i=0;i<3;i++){c.rotate(Math.PI*2/3);c.beginPath();c.moveTo(0,-9);c.bezierCurveTo(17,-38,37,-30,20,-6);c.bezierCurveTo(17,6,5,12,0,9);c.fillStyle='#83b6ad75';c.fill();c.strokeStyle='#a2cec0';c.lineWidth=1;c.stroke();}circle(c,0,0,9,'#547f7b','#bdd4be');c.restore();}
    leader(c,cn('容积式增压器','POSITIVE-DISPLACEMENT BLOWER'),340,52,399,99,C.cold);
    leader(c,cn('曲轴传动皮带','CRANKSHAFT DRIVE BELT'),102,392,342,361,C.metal);
    txt(c,cn('新鲜空气进入','FRESH AIR IN'),76,207,12,C.cold);txt(c,cn('废气排出','EXHAUST OUT'),939,320,12,C.hot,'right');leader(c,cn('中冷器','INTERCOOLER'),879,219,738,258,C.cold,'right');
  }
  cylinder(c,time*(.7+r/4500));
  leader(c,cn('气缸与活塞','CYLINDER & PISTON'),816,439,639,405,C.metal,'right');
  txt(c,cn('曲轴','CRANKSHAFT'),711,512,11,C.dim);line(c,[[698,507],[610,493]],'#6d858655');
  c.restore();
}

const curves={na:[.32,.41,.51,.61,.69,.74,.77,.76,.70,.61,.50,.40],turbo:[.34,.43,.63,.91,1.05,1.09,1.09,1.08,1.05,.99,.90,.80],super:[.60,.70,.79,.86,.92,.97,1.00,1.00,.98,.94,.88,.79]};
function drawChart(){const c=cc,w=1200,h=520;c.clearRect(0,0,w,h);const left=84,right=1148,top=36,bottom=442;
  for(let i=0;i<5;i++){const y=bottom-i*(bottom-top)/4;line(c,[[left,y],[right,y]],'#dce1d5',1);txt(c,(i*.3).toFixed(1),left-18,y+5,16,'#8e9c8b','right');}
  for(let i=0;i<6;i++){let x=left+i*(right-left)/5;txt(c,(1000+i*1100).toLocaleString('en'),x,480,15,'#8e9c8b','center');}
  txt(c,'RPM',right,516,14,'#8e9c8b','right');txt(c,lang==='zh'?'相对指数':'RELATIVE INDEX',left,20,12,'#8e9c8b');
  for(const m of ['na','super','turbo']){const arr=curves[m];const pts=arr.map((v,i)=>[left+i*(right-left)/(arr.length-1),bottom-v/1.2*(bottom-top)]);c.save();c.globalAlpha=mode===m?1:.6;line(c,pts,{na:'#8a979c',turbo:'#ed5937',super:'#528e78'}[m],mode===m?5:3);c.restore();}
  const x=left+(rpm-1000)/5500*(right-left);c.save();c.setLineDash([5,7]);line(c,[[x,top],[x,bottom]],'#9da895',1.5);c.restore();const pos=(rpm-1000)/500,i=Math.min(10,Math.floor(pos)),f=pos-i;for(const m of ['na','turbo','super']){const value=curves[m][i]*(1-f)+curves[m][i+1]*f;circle(c,x,bottom-value/1.2*(bottom-top),mode===m?7:5,{na:'#8a979c',turbo:'#ed5937',super:'#528e78'}[m],'#fcfcf8');}
}

const filmCaptions={
  na:[['活塞下行，气缸压力降低。','The piston moves down. Cylinder pressure falls.'],['空气在压差作用下进入气缸。','A pressure difference draws fresh air into the cylinder.'],['没有增压器，动力通常更渐进。','No boost compressor. Typically progressive delivery.']],
  turbo:[['排出的废气，先驱动涡轮。','Outgoing exhaust gas drives the turbine.'],['同一根轴，带动另一侧的压气机。','A shared shaft turns the compressor on the other side.'],['空气加压、冷却后，进入发动机。','Air is pressurized, cooled, then fed to the engine.']],
  super:[['曲轴的旋转，通过皮带传递。','The crankshaft transfers rotation through a belt.'],['增压器直接得到动力，推动空气。','The blower is driven directly, moving more air.'],['响应直接，也需要消耗机械功率。','Quick response comes at a cost in mechanical power.']]
};
function drawFilm(){const scene=Math.min(2,Math.floor(filmTime/12)),m=['na','turbo','super'][scene],part=filmTime-scene*12;fc.fillStyle=C.bg;fc.fillRect(0,0,1600,900);render(filmBufferContext,1300,650,m,filmTime*2,3000,Math.min(1,part/3));fc.drawImage(filmBuffer,150,80);
  fc.fillStyle='#172329';fc.fillRect(0,0,1600,120);fc.fillRect(0,720,1600,180);
  txt(fc,`0${scene+1} / 03`,75,65,18,C.hot);txt(fc,words.zh[m],175,67,31,'#d8e3d9','left','600');txt(fc,systems[m].enName,1525,64,18,C.dim,'right');
  const caption=filmCaptions[m][Math.min(2,Math.floor(part/4))];txt(fc,caption[0],800,777,27,'#e3ebdf','center','500');txt(fc,caption[1],800,824,21,'#90a5a2','center');txt(fc,'SCHEMATIC / EDUCATIONAL MODEL · ENGINE LENS',800,871,12,'#577475','center');
  $$('[data-scene]').forEach((el,i)=>{el.style.setProperty('--progress',Math.max(0,Math.min(1,(filmTime-i*12)/12)));});$('#film-time').textContent=`00:${String(Math.floor(filmTime)).padStart(2,'0')} / 00:36`;
}
function updateFilmControls(){$('#film-pause').textContent=t(filmTime>=36?'replay':filmPlaying?'filmPause':'filmPlay');$('#fullscreen').textContent=t(document.fullscreenElement?'exitFull':'fullscreen');}
function openFilm(){filmTime=0;filmPlaying=true;cinema.showModal();updateFilmControls();drawFilm();}
$$('[data-film]').forEach(e=>e.addEventListener('click',openFilm));
$('#close-film').addEventListener('click',()=>cinema.close());
cinema.addEventListener('close',()=>{filmPlaying=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});});
cinema.addEventListener('click',e=>{if(e.target===cinema){const r=cinema.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)cinema.close();}});
$('#film-pause').addEventListener('click',()=>{if(filmTime>=36)filmTime=0;filmPlaying=!filmPlaying;updateFilmControls();});
$$('[data-scene]').forEach(e=>e.addEventListener('click',()=>{filmTime=+e.dataset.scene*12;filmPlaying=true;updateFilmControls();drawFilm();}));
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await cinema.requestFullscreen();}catch{$('#film-note').textContent=lang==='zh'?'当前浏览器不支持全屏，请使用窗口最大化观看。':'Fullscreen is unavailable here. Maximize the browser window to watch.';}});
document.addEventListener('fullscreenchange',updateFilmControls);
cinema.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===cinema){e.preventDefault();$('#film-pause').click();}});

function tick(now){const dt=Math.min(.06,(now-last)/1000||0);last=now;if(!document.hidden){if(!paused)clock+=dt;
  if(transient>=0){transient+=dt;boostFactor=mode==='turbo'?1-Math.exp(-transient/1.25):mode==='super'?1-Math.exp(-transient/.15):1;if(transient>4){transient=-1;boostFactor=1;$('#response').textContent=t({na:'responseNA',turbo:'responseTurbo',super:'responseSuper'}[mode]);}}
  $('#boost-value').textContent=(modelBoost(mode,rpm)*boostFactor).toFixed(2);render(ec,engine.width,engine.height,mode,clock,rpm,boostFactor);
  if(cinema.open){if(filmPlaying){filmTime=Math.min(36,filmTime+dt);if(filmTime>=36){filmPlaying=false;updateFilmControls();}}drawFilm();}
}requestAnimationFrame(tick);}
applyLanguage();requestAnimationFrame(tick);
