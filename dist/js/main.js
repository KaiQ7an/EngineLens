import { lang, setLang, t } from './i18n.js';
import { load, save } from './store.js';
import { entryById } from './data/entries.js';
import { entryPage } from './ui/entry.js';
import { homePage } from './ui/home.js';
import { glossaryPage } from './ui/glossary.js';
import { installTerms } from './ui/terms.js';
import { setPalette } from './draw/kit.js';

const app = document.getElementById('app');
const root = document.documentElement;
let page = null;

// ── Theme: follows the system until the visitor picks one ──
const systemDark = matchMedia('(prefers-color-scheme: dark)');
let theme = load('enginelens-theme');
const currentTheme = () => theme ?? (systemDark.matches ? 'dark' : 'light');
function applyTheme() {
  if (theme) root.dataset.theme = theme; else delete root.dataset.theme;
  setPalette(currentTheme());
  page?.invalidate?.();
  document.querySelector('meta[name=theme-color]').content = currentTheme() === 'dark' ? '#081427' : '#eef2f8';
  document.getElementById('theme').setAttribute('aria-pressed', currentTheme() === 'dark');
}
document.getElementById('theme').addEventListener('click', () => {
  theme = currentTheme() === 'dark' ? 'light' : 'dark';
  save('enginelens-theme', theme); applyTheme();
});
systemDark.addEventListener('change', applyTheme);

function chrome() {
  root.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  document.getElementById('theme').setAttribute('aria-label', t('theme'));
}

function route() {
  let name = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (name === 'explorer') name = 'turbo';   // links into the earlier single-page version
  if (name === 'compare') name = 'throttle';
  let p;
  if (name === 'glossary') p = glossaryPage();
  else if (entryById(name)) p = entryPage(name);
  else p = homePage();
  page?.stop?.();
  chrome();
  app.innerHTML = p.html;
  document.title = (p.title ? p.title + ' · ' : '') + 'EngineLens';
  const section = name === 'glossary' ? 'glossary' : '';
  document.querySelectorAll('.top nav a').forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#/' + section));
  page = p.mount ? p.mount(app) : null;
  if (name === 'atlas' || name === 'route') document.getElementById('atlas')?.scrollIntoView();
  else scrollTo(0, 0);
  if (entryById(name) || name === 'glossary') app.querySelector('h1')?.focus({ preventScroll: true });
}

document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => { setLang(b.dataset.lang); route(); }));
addEventListener('hashchange', route);
addEventListener('keydown', e => {
  const el = e.target;
  if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing || el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
  if (e.key === ' ' && el.closest('button, a')) return;
  if (page?.key?.(e)) e.preventDefault();
});

let last = 0;
function tick(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0);
  last = now;
  page?.frame?.(dt);
  requestAnimationFrame(tick);
}

installTerms();
applyTheme();
route();
requestAnimationFrame(tick);
document.fonts?.ready.then(() => { page?.invalidate?.(); page?.frame?.(0); });
