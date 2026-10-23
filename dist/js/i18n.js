import { load, save } from './store.js';

// Copy is written as [中文, English] pairs throughout; `bi` picks the current one.
export let lang = load('enginelens-language') === 'en' ? 'en' : 'zh';
export const bi = pair => (Array.isArray(pair) ? pair[lang === 'zh' ? 0 : 1] : pair);
export const L = (zh, en) => (lang === 'zh' ? zh : en);
export function setLang(next) { lang = next; save('enginelens-language', next); }

export const ui = {
  home: ['首页', 'Home'], route: ['新手路线', 'Learning route'], glossary: ['术语表', 'Glossary'],
  theme: ['切换深色/浅色', 'Toggle dark / light'], skip: ['跳到主要内容', 'Skip to content'],
  play: ['播放', 'Play'], pause: ['暂停', 'Pause'], guided: ['导览', 'Guided'], free: ['连续播放', 'Free run'],
  prev: ['上一步', 'Previous step'], next: ['下一步', 'Next step'],
  speed: ['演示转速', 'Demo speed'], slowNote: ['画面已放慢', 'Slowed down for you'],
  presets: [['慢动作', 'Slow-mo'], ['怠速', 'Idle'], ['巡航', 'Cruise'], ['红线', 'Redline']],
  steps: ['步骤', 'Steps'], parts: ['点一点部件', 'Tap a part'], partsHint: ['点下面的名字，或者直接点动画里的部件。', 'Tap a name below, or the part itself in the animation.'],
  clearPart: ['取消选择', 'Clear'], pros: ['好在哪', 'Strengths'], cons: ['代价是什么', 'Trade-offs'],
  cars: ['你可能认识的车', 'Cars you may know'], myth: ['你可能听过的说法', 'You may have heard'],
  nextLesson: ['下一课', 'Next lesson'], backRoute: ['回到新手路线', 'Back to the route'],
  legendCold: ['冷空气', 'Fresh air'], legendSqueeze: ['被压缩', 'Squeezed'], legendFlame: ['燃烧', 'Burning'], legendHot: ['热废气', 'Hot exhaust'],
  model: ['示意动画 · 非工程比例 · 数值为教学模型', 'Schematic · not to scale · values are a teaching model'],
  rpm: ['发动机转速', 'Engine speed'], floor: ['地板油！', 'Floor it!'], tipIn: ['模拟一脚地板油', 'Floor the throttle'],
  balance: ['平衡轴', 'Balance shafts'], on: ['开', 'On'], off: ['关', 'Off'],
  altitude: ['海拔', 'Altitude'], sea: ['海平面', 'Sea level'], high: ['高原 3650 米', 'High altitude 3,650 m'],
  comingSoon: ['即将上线', 'Coming soon'], visited: ['已学', 'Done'], start: ['开始第一课', 'Start lesson one'],
  continue: ['继续学习', 'Continue'], progress: ['新手赛季进度', 'Rookie season progress'],
  chapter: ['第 {n} 章', 'Chapter {n}'], lesson: ['第 {n} 课', 'Lesson {n}'],
  footer: ['把发动机拆开、放慢、上色给你看。', 'Engines, opened up, slowed down and colour-coded.'],
  sources: ['原理参考与模型说明', 'References & model notes'],
  stepOf: ['第 {i} 步 / 共 {n} 步', 'Step {i} of {n}']
};
export const t = (key, vars = {}) => bi(ui[key]).replace(/\{(\w+)\}/g, (_, k) => vars[k]);
