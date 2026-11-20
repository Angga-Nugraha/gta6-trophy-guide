// detail.js — the per-trophy guide panel: official name / description / grade,
// the guide in this entry's own words, its named sources, and the honesty badge
// (confirmed / reported / disputed / unconfirmed) for methods the guides disagree on.
import { isEarned } from './tracker.js';

const STATUS_LABELS = {
  confirmed: 'Confirmed — the guides agree on this method',
  reported: 'Reported method — one guide only, not confirmed',
  disputed: 'Disputed method — the guides disagree',
  unconfirmed: 'Method unconfirmed — no reliable method exists yet',
};

const SOURCE_URLS = {
  PowerPyx: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
  GTABase: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series',
  'Insider Gaming': 'https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/',
  RadioTimes: 'https://www.radiotimes.com/technology/gaming/gta-6-trophies-achievements-list/',
  'Push Square': 'https://www.pushsquare.com/news/2026/11/gta-6-ps5-trophies-revealed-100percent-completion-needed-for-the-platinum',
};

function sourceLink(label) {
  for (const [name, url] of Object.entries(SOURCE_URLS)) {
    if (label.startsWith(name)) return { name: label, url };
  }
  return { name: label, url: null };
}

export function displayNameOf(trophy) {
  return trophy.displayName || trophy.name;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function renderDetail(container, trophy, earned, onToggle) {
  if (!trophy) {
    container.innerHTML = '<p class="empty">Select a trophy on the left to read its guide, sources and roadmap stage.</p>';
    return;
  }
  const earnedNow = isEarned(earned, trophy.id);
  const status = trophy.status || 'confirmed';
  const sources = (trophy.sources || []).map(sourceLink);
  const el = document.createElement('div');
  el.innerHTML = `
    <h2></h2>
    <p class="official"></p>
    <p class="badges"></p>
    <h3>Guide</h3>
    <p class="guide-text"></p>
    ${status !== 'confirmed' ? '<p class="status-note"></p>' : ''}
    ${trophy.missable ? '<p class="status-note missable-note"></p>' : ''}
    ${trophy.targetNote ? '<p class="target-note"></p>' : ''}
    <h3>Sources</h3>
    <ul class="sources"></ul>
    <button type="button" class="earn-btn"></button>
  `;
  el.querySelector('h2').textContent = displayNameOf(trophy);
  el.querySelector('.official').textContent = `“${trophy.description}” — ${gradeLabel(trophy.grade)} trophy${trophy.hidden ? ' · hidden on PS5 until earned' : ''} · roadmap stage ${trophy.stage}`;
  const badges = el.querySelector('.badges');
  badges.innerHTML = `<span class="badge ${trophy.grade}">${trophy.grade}</span>` +
    (trophy.hidden ? ' <span class="badge hidden">Hidden</span>' : '') +
    (trophy.missable ? ' <span class="badge missable">Potentially missable</span>' : '') +
    (status !== 'confirmed' ? ` <span class="badge ${status}">${status}</span>` : '');
  el.querySelector('.guide-text').textContent = trophy.guide;
  if (status !== 'confirmed') el.querySelector('.status-note').textContent = STATUS_LABELS[status] + '.';
  if (trophy.missable) el.querySelector('.missable-note').textContent = trophy.missableNote || 'Potentially missable — do it early to be safe.';
  if (trophy.targetNote) el.querySelector('.target-note').textContent = `Target: ${trophy.targetNote}.`;
  const list = el.querySelector('.sources');
  for (const s of sources) {
    const li = document.createElement('li');
    if (s.url) {
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      a.target = '_blank';
      a.rel = 'noopener';
      li.appendChild(a);
    } else {
      li.textContent = s.name;
    }
    list.appendChild(li);
  }
  const btn = el.querySelector('.earn-btn');
  btn.textContent = earnedNow ? '✓ Earned — click to unmark' : 'Mark as earned';
  btn.addEventListener('click', () => onToggle(trophy.id));
  container.replaceChildren(el);
}
