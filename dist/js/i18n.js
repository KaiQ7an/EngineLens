import { load, save } from './store.js';

// Copy is written as [中文, English] pairs throughout; `bi` picks the current one.
export let lang = load('enginelens-language') === 'en' ? 'en' : 'zh';
export const bi = pair => (Array.isArray(pair) ? pair[lang === 'zh' ? 0 : 1] : pair);
export const L = (zh, en) => (lang === 'zh' ? zh : en);
export function setLang(next) { lang = next; save('enginelens-language', next); }

export const ui = {
  gallery: ['图鉴', 'Atlas'], glossary: ['术语表', 'Glossary'],
  theme: ['切换深色/浅色', 'Toggle dark / light'], skip: ['跳到主要内容', 'Skip to content'],
  play: ['播放', 'Play'], pause: ['暂停', 'Pause'], guided: ['边看边讲', 'Narrated'], free: ['自由播放', 'Free run'],
  prev: ['上一段', 'Previous'], next: ['下一段', 'Next'],
  playback: ['播放速度', 'Playback'], slow: ['慢', 'Slow'], mid: ['中', 'Medium'], fast: ['快', 'Fast'],
  engineRpm: ['发动机转速（真实工况）', 'Engine speed (real)'],
  presets: [['怠速', 'Idle'], ['巡航', 'Cruise'], ['红线', 'Redline']],
  rate: ['在这个转速下，每个缸每秒点火 {fires} 次，转完一个循环只要 {ms} 毫秒。画面放慢了约 {slow} 倍。', 'At this speed each cylinder fires {fires} times a second and one cycle takes {ms} ms. The drawing runs about {slow}× slower.'],
  crankAngle: ['曲轴角', 'Crank angle'], scrubHint: ['拖动滑块或画面，亲手转曲轴', 'Drag here or on the drawing to turn the crank'],
  tdc: ['上止点', 'TDC'], bdc: ['下止点', 'BDC'], why: ['为什么', 'Why'],
  chooseStroke: ['选择冲程并暂停', 'Choose a stroke and pause'], exactAngle: ['精确定位曲轴角', 'Set an exact crank angle'],
  legend: ['颜色图例', 'Colour key'], boostedAir: ['增压空气', 'Boosted air'],
  keys: ['空格：播放 / 暂停　← →：逐步切换　点击角度刻度：精确停住', 'Space: play / pause · ← →: step through · Click an angle mark to stop exactly'],
  basicKeys: ['空格：播放 / 暂停　← →：逐步切换', 'Space: play / pause · ← →: step through'],
  parts: ['拆开看看', 'Take it apart'], clearPart: ['取消选择', 'Clear'],
  pros: ['好在哪', 'Strengths'], cons: ['代价是什么', 'Trade-offs'],
  cars: ['你可能见过的车', 'Cars you may know'], myth: ['常听到的说法', 'You may have heard'], related: ['接着看', 'Keep exploring'],
  model: ['示意动画 · 非工程比例 · 数值为示意模型', 'Schematic · not to scale · values are a teaching model'],
  rpm: ['发动机转速', 'Engine speed'], floor: ['地板油！', 'Floor it!'], tipIn: ['模拟一脚地板油', 'Floor the throttle'],
  altitude: ['海拔', 'Altitude'], sea: ['海平面', 'Sea level'], high: ['高原 3650 米', 'High altitude 3,650 m'],
  comingSoon: ['即将收录', 'Coming soon'],
  footer: ['把发动机拆开、放慢、上色给你看。', 'Engines, opened up, slowed down and colour-coded.']
};
export const t = (key, vars = {}) => bi(ui[key]).replace(/\{(\w+)\}/g, (_, k) => vars[k]);
