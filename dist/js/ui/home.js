import { LESSONS, CHAPTERS, UPCOMING, lessonById } from '../data/lessons.js';
import { bi, t } from '../i18n.js';
import { W, H } from '../draw/kit.js';
import { drawPreview } from './preview.js';
import { rich } from './terms.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const num = l => 'L' + String(LESSONS.indexOf(l) + 1).padStart(2, '0');

export function homePage(visited) {
  const done = LESSONS.filter(l => visited.has(l.id)).length;
  const nextUp = LESSONS.find(l => !visited.has(l.id)) ?? LESSONS[0];
  const card = l => `
    <a class="lesson-card${visited.has(l.id) ? ' done' : ''}" href="#/${l.id}">
      <canvas width="${W / 2}" height="${H / 2}" data-preview="${l.id}" aria-hidden="true"></canvas>
      <span class="no">${num(l)}${visited.has(l.id) ? `<em>✓ ${t('visited')}</em>` : ''}</span>
      <b>${bi(l.title)}</b>
      <span>${bi(l.card)}</span>
    </a>`;

  const html = `
  <section class="hero wrap">
    <figure class="stage hero-stage">
      <canvas id="hero" width="${W * 1.5}" height="${H * 1.5}" role="img" aria-label="${bi(['一个发动机气缸正在吸气、压缩、点火、排气的动画', 'Animation of one engine cylinder breathing in, compressing, firing and exhausting'])}"></canvas>
    </figure>
    <div class="hero-copy">
      <p class="eyebrow"><span>EngineLens</span> ROOKIE SEASON</p>
      <h1>${bi(['把发动机拆开，<br>放慢，看懂。', 'Open the engine up.<br>Slow it down. Get it.'])}</h1>
      <p class="lead">${bi(['看比赛听到"V6 涡轮""自吸 V12"一头雾水？从一个缸开始，一课只讲一件事。蓝色是空气，橙色是废气，跟着小点走就行。', 'Hear "turbo V6" or "naturally aspirated V12" and draw a blank? Start with one cylinder, one idea per lesson. Blue is air, orange is exhaust: just follow the dots.'])}</p>
      <div class="cta">
        <a class="btn btn-accent" href="#/${nextUp.id}">${done ? t('continue') : t('start')} · ${bi(nextUp.title).split('：')[0].split(':')[0]}</a>
        <a class="btn" href="#/route">${t('route')}</a>
      </div>
      <div class="hook">
        <p class="hook-q">${bi(['车尾写着 1.5T？', 'A "1.5T" badge on the boot?'])}</p>
        <p>${rich(bi(['T 是 Turbo，涡轮增压；参数表上写 1.5L 的，多半是自然吸气。两者的区别，就在空气怎么进到缸里。', 'T is for turbo. A spec sheet that says 1.5L usually means naturally aspirated. The difference is how the air gets into the cylinder.']))}</p>
        <div class="hook-links"><a href="#/na"><b>1.5L</b>${bi(lessonById('na')?.title ?? ['自然吸气', 'Naturally aspirated'])}</a><a href="#/turbo"><b>1.5T</b>${bi(lessonById('turbo')?.title ?? ['涡轮增压', 'Turbocharged'])}</a></div>
      </div>
    </div>
  </section>
  <section class="route wrap" id="route">
    <div class="route-head">
      <div>
        <p class="eyebrow"><span>${t('route')}</span> ROOKIE SEASON</p>
        <h2>${bi(['新手赛季：六站，从一个缸到 F1', 'Rookie season: six rounds, from one cylinder to F1'])}</h2>
      </div>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${LESSONS.length}" aria-valuenow="${done}" aria-label="${t('progress')}">
        <span>${t('progress')}</span><b>${done} / ${LESSONS.length}</b><i style="--p:${done / LESSONS.length}"></i>
      </div>
    </div>
    ${CHAPTERS.map(ch => {
      const built = LESSONS.filter(l => l.chapter === ch.n);
      const soon = UPCOMING.filter(u => u.chapter === ch.n);
      return `
      <div class="round">
        <div class="round-head"><span class="rno">R${String(ch.n).padStart(2, '0')}</span><h3>${bi(ch.title)}</h3><p>${bi(ch.core)}</p></div>
        <div class="round-cards">
          ${built.map(card).join('')}
          ${soon.map(u => `<div class="lesson-card soon"><span class="no">${t('comingSoon')}</span><b>${bi(u.title)}</b></div>`).join('')}
        </div>
      </div>`;
    }).join('')}
  </section>`;

  function mount(root) {
    const hero = root.querySelector('#hero');
    const lesson = LESSONS[0];
    let theta = 30, time = 0;
    const previews = [...root.querySelectorAll('[data-preview]')].map(cv => {
      const l = lessonById(cv.dataset.preview);
      const p = { cv, l, theta: 90 + 137 * LESSONS.indexOf(l), live: false };
      drawPreview(cv, l, p.theta, 0);
      const card = cv.closest('a');
      card.addEventListener('mouseenter', () => { p.live = !reduced; });
      card.addEventListener('mouseleave', () => { p.live = false; });
      return p;
    });
    return {
      frame(dt) {
        if (document.hidden) return;
        time += dt;
        if (!reduced) theta += 40 * 6 * dt;
        drawPreview(hero, lesson, theta, time);
        for (const p of previews) if (p.live) { p.theta += 50 * 6 * dt; drawPreview(p.cv, p.l, p.theta, time); }
      }
    };
  }
  return { html, mount, title: '' };
}
