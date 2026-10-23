import { termById } from '../data/glossary.js';
import { bi } from '../i18n.js';

// Turn [[id|text]] markers in lesson copy into glossary buttons.
export const rich = str => str.replace(/\[\[([\w-]+)\|([^\]]+)\]\]/g,
  (_, id, shown) => `<button type="button" class="term" data-term="${id}">${shown}</button>`);
export const plain = str => str.replace(/\[\[[\w-]+\|([^\]]+)\]\]/g, '$1');

// One shared popover for every term on the page: hover or focus to peek, click to pin.
let tip, pinned = null;
function show(btn) {
  const term = termById(btn.dataset.term);
  if (!term) return;
  tip.innerHTML = `<b>${bi(term.name)}</b><span>${bi(term.text)}</span><a href="#/glossary">${bi(['查看全部术语 →', 'All terms →'])}</a>`;
  tip.hidden = false;
  const r = btn.getBoundingClientRect(), w = Math.min(300, innerWidth - 24);
  tip.style.width = w + 'px';
  tip.style.left = Math.max(12, Math.min(innerWidth - w - 12, r.left + r.width / 2 - w / 2)) + 'px';
  const below = r.bottom + 10, h = tip.offsetHeight;
  tip.style.top = (below + h > innerHeight - 8 ? r.top - h - 10 : below) + 'px';
}
function hide() { if (!pinned) tip.hidden = true; }

export function installTerms() {
  tip = document.createElement('div');
  tip.className = 'term-tip'; tip.hidden = true; tip.setAttribute('role', 'tooltip');
  document.body.append(tip);
  document.addEventListener('mouseover', e => { const b = e.target.closest?.('.term'); if (b && !pinned) show(b); });
  document.addEventListener('mouseout', e => { if (e.target.closest?.('.term') && !pinned) hide(); });
  document.addEventListener('focusin', e => { const b = e.target.closest?.('.term'); if (b) show(b); });
  document.addEventListener('focusout', e => { if (e.target.closest?.('.term')) hide(); });
  document.addEventListener('click', e => {
    const b = e.target.closest?.('.term');
    if (b) { pinned = pinned === b ? null : b; if (pinned) show(b); else hide(); return; }
    if (!e.target.closest?.('.term-tip')) { pinned = null; hide(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { pinned = null; hide(); } });
  addEventListener('scroll', () => { pinned = null; hide(); }, { passive: true });
}
