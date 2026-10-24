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
  speed: ['演示转速', 'Demo speed'],
  presets: [['慢动作', 'Slow-mo'], ['怠速', 'Idle'], ['巡航', 'Cruise'], ['红线', 'Redline']],
  parts: ['拆开看看', 'Take it apart'], clearPart: ['取消选择', 'Clear'],
  pros: ['好在哪', 'Strengths'], cons: ['代价是什么', 'Trade-offs'],
  cars: ['你可能见过的车', 'Cars you may know'], myth: ['常听到的说法', 'You may have heard'], related: ['接着看', 'Keep exploring'],
  model: ['示意动画 · 非工程比例 · 数值为示意模型', 'Schematic · not to scale · values are a teaching model'],
  rpm: ['发动机转速', 'Engine speed'], floor: ['地板油！', 'Floor it!'], tipIn: ['模拟一脚地板油', 'Floor the throttle'],
  altitude: ['海拔', 'Altitude'], sea: ['海平面', 'Sea level'], high: ['高原 3650 米', 'High altitude 3,650 m'],
  filter: ['筛选', 'Filter'], all: ['全部', 'All'], comingSoon: ['即将收录', 'Coming soon'],
  footer: ['把发动机拆开、放慢、上色给你看。', 'Engines, opened up, slowed down and colour-coded.']
};
export const t = (key, vars = {}) => bi(ui[key]).replace(/\{(\w+)\}/g, (_, k) => vars[k]);
