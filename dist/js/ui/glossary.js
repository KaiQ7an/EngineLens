import { GLOSSARY } from '../data/glossary.js';
import { bi, t } from '../i18n.js';

export function glossaryPage() {
  const html = `
  <section class="glossary wrap">
    <p class="eyebrow"><span>${t('glossary')}</span> GLOSSARY</p>
    <h1 tabindex="-1">${bi(['听不懂的词，都在这里', 'Every word you might trip over'])}</h1>
    <p class="lead">${bi(['课程里带下划线的词，点一下就能看到这里的解释。', 'Underlined words in the lessons open these explanations.'])}</p>
    <dl>${GLOSSARY.map(g => `<div id="term-${g.id}"><dt>${bi(g.name)}</dt><dd>${bi(g.text)}</dd></div>`).join('')}</dl>
  </section>`;
  return { html, title: t('glossary') };
}
