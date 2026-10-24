import { ENTRIES, GROUPS, COMING, entryById } from '../data/entries.js';
import { bi, t } from '../i18n.js';
import { W, H, fitCanvas } from '../draw/kit.js';
import { drawPreview } from './preview.js';
import { cardHTML, mountCards } from './cards.js';
import { rich } from './terms.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// The atlas: a featured engine running top-left, then one section per category.
export function homePage() {
  const featured = entryById('four-stroke');
  const html = `
  <section class="hero wrap">
    <figure class="stage hero-stage">
      <canvas id="hero" width="${W * 1.5}" height="${H * 1.5}" role="img" aria-label="${bi(['一个发动机气缸正在吸气、压缩、点火、排气的动画', 'Animation of one engine cylinder breathing in, compressing, firing and exhausting'])}"></canvas>
      <figcaption class="hero-cap"><a href="#/${featured.id}">${bi(featured.name)} · ${bi(featured.tagline)} →</a></figcaption>
    </figure>
    <div class="hero-copy">
      <p class="eyebrow"><span>EngineLens</span> ${bi(['发动机图鉴', 'THE ENGINE ATLAS'])}</p>
      <h1>${bi(['把发动机拆开，<br>放慢，看懂。', 'Open the engine up.<br>Slow it down. Get it.'])}</h1>
      <p class="lead">${bi(['看比赛时听到"V6 涡轮""自吸 V12"一头雾水？挑一台发动机点进去：蓝图会动，空气是一个个小圈，跟着它们走就看懂了。', 'Hear "turbo V6" or "naturally aspirated V12" and draw a blank? Pick an engine: the blueprint moves, air is drawn as rings, and you just follow them.'])}</p>
      <div class="hook">
        <p class="hook-q">${bi(['车尾写着 1.5T？', 'A "1.5T" badge on the boot?'])}</p>
        <p>${rich(bi(['T 是 Turbo，涡轮增压；参数表上写 1.5L 的，多半是自然吸气。两者的区别，就在空气怎么进到缸里。', 'T is for turbo. A spec sheet that says 1.5L usually means naturally aspirated. The difference is how the air gets into the cylinder.']))}</p>
        <div class="hook-links"><a href="#/na"><b>1.5L</b>${bi(entryById('na').name)}</a><a href="#/turbo"><b>1.5T</b>${bi(entryById('turbo').name)}</a></div>
      </div>
    </div>
  </section>
  <section class="atlas wrap" id="atlas">
    <div class="atlas-head">
      <h2>${bi(['发动机图鉴', 'The engine atlas'])}<small>${ENTRIES.length}</small></h2>
      <nav class="group-nav" aria-label="${bi(['分类', 'Categories'])}">
        ${GROUPS.map(g => `<button type="button" data-jump="${g.id}">${bi(g.name)}<span>${ENTRIES.filter(e => e.group === g.id).length}</span></button>`).join('')}
      </nav>
    </div>
    ${GROUPS.map((g, i) => {
      const list = ENTRIES.filter(e => e.group === g.id);
      return `
      <section class="group" id="group-${g.id}">
        <div class="group-head">
          <span class="gno">${String(i + 1).padStart(2, '0')}</span>
          <h3>${bi(g.name)}</h3>
          <p>${bi(g.blurb)}</p>
        </div>
        <div class="wall${list.length === 1 ? ' wall-feature' : ''}">${list.map(cardHTML).join('')}</div>
      </section>`;
    }).join('')}
    ${COMING.length ? `<div class="coming"><span>${t('comingSoon')}</span>${COMING.map(c => `<i>${bi(c)}</i>`).join('')}</div>` : ''}
  </section>`;

  function mount(root) {
    const hero = root.querySelector('#hero');
    const cards = mountCards(root);
    // Category buttons jump to their section; the route stays on the atlas.
    root.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => {
      root.querySelector('#group-' + b.dataset.jump).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }));
    let theta = 30, time = 0, heroVisible = true;
    const io = 'IntersectionObserver' in window && new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; });
    if (io) io.observe(hero);
    return {
      frame(dt) {
        if (document.hidden) return;
        time += dt;
        if (!reduced) theta += 32 * 6 * dt;
        if (heroVisible) { fitCanvas(hero); drawPreview(hero, featured, theta, time, 1000 / hero.clientWidth); }
        cards.frame(dt);
      },
      stop() { cards.stop(); if (io) io.disconnect(); }
    };
  }
  return { html, mount, title: '' };
}
