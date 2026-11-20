// app.js — wires the guide together: loads data/trophies.json (the app's only
// fetch, a relative file of its own), renders the checklist, and connects the
// tracker, the filters, the detail panel and the roadmap tabs.
import { loadProgress, saveProgress, toggleEarned, isEarned, countEarned, countEarnedByGrade, exportProgress, importProgress, downloadFile } from './tracker.js';
import { defaultFilterState, applyFilters, isSpoilerMasked, spoilerLabel, KIND_LABELS } from './filters.js';
import { renderDetail, displayNameOf, gradeLabel } from './detail.js';
import { renderRoadmap, renderMissables, renderHundred, HUNDRED_LINES } from './roadmap.js';

const HUNDRED_KEY = 'leonida-legend-hundred-v1';

let trophies = [];
let earned = loadProgress();
let filterState = defaultFilterState();
let selectedId = null;
let hundredChecked = loadHundred();

function loadHundred() {
  try {
    const raw = localStorage.getItem(HUNDRED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveHundred() {
  try { localStorage.setItem(HUNDRED_KEY, JSON.stringify(hundredChecked)); } catch { /* storage full or blocked; checklist still works this session */ }
}

const listEl = document.querySelector('#trophy-list');
const detailEl = document.querySelector('#detail');
const resultLine = document.querySelector('#result-line');
const progressCount = document.querySelector('#progress-count');
const progressPct = document.querySelector('#progress-pct');
const progressFill = document.querySelector('#progress-fill');
const progressGrades = document.querySelector('#progress-grades');

function gradeTotals() {
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) totals[t.grade] += 1;
  return totals;
}

function renderProgress() {
  const done = countEarned(earned, trophies);
  const pct = trophies.length ? Math.round((done / trophies.length) * 100) : 0;
  progressCount.textContent = `${done} of ${trophies.length} earned`;
  progressPct.textContent = `${pct}%`;
  progressFill.style.width = `${pct}%`;
  const byGrade = countEarnedByGrade(earned, trophies);
  const totals = gradeTotals();
  progressGrades.textContent = `Platinum ${byGrade.platinum}/${totals.platinum} · Gold ${byGrade.gold}/${totals.gold} · Silver ${byGrade.silver}/${totals.silver} · Bronze ${byGrade.bronze}/${totals.bronze}`;
}

function statusBadge(trophy) {
  if (trophy.status === 'reported') return '<span class="badge reported">Reported</span>';
  if (trophy.status === 'disputed') return '<span class="badge disputed">Disputed</span>';
  if (trophy.status === 'unconfirmed') return '<span class="badge unconfirmed">Unconfirmed</span>';
  return '';
}

function renderList() {
  const shown = applyFilters(trophies, filterState, earned);
  resultLine.textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  listEl.replaceChildren();
  for (const trophy of shown) {
    const masked = isSpoilerMasked(trophy, filterState, earned);
    const li = document.createElement('li');
    li.className = 'trophy' + (isEarned(earned, trophy.id) ? ' earned' : '') + (selectedId === trophy.id ? ' selected' : '');
    const top = document.createElement('div');
    top.className = 'trophy-top';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'trophy-check';
    check.checked = isEarned(earned, trophy.id);
    check.setAttribute('aria-label', `Mark ${displayNameOf(trophy)} as earned`);
    check.addEventListener('change', () => {
      earned = toggleEarned(earned, trophy.id);
      saveProgress(earned);
      renderProgress();
      renderList();
      renderDetail(detailEl, selectedTrophy(), earned, onToggleFromDetail);
    });
    const head = document.createElement('div');
    head.className = 'trophy-head';
    const name = document.createElement('h3');
    name.className = 'trophy-name';
    const nameBtn = document.createElement('button');
    nameBtn.type = 'button';
    nameBtn.textContent = masked ? spoilerLabel(trophy) : displayNameOf(trophy);
    nameBtn.addEventListener('click', () => {
      selectedId = trophy.id;
      renderList();
      renderDetail(detailEl, trophy, earned, onToggleFromDetail);
    });
    name.appendChild(nameBtn);
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    if (masked) {
      const mask = document.createElement('span');
      mask.className = 'spoiler-mask';
      mask.textContent = trophy.description;
      desc.appendChild(mask);
    } else {
      desc.textContent = trophy.description;
    }
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.innerHTML = `<span class="badge ${trophy.grade}">${trophy.grade}</span>` +
      `<span class="badge">${KIND_LABELS[trophy.kind] || trophy.kind}</span>` +
      (trophy.hidden ? '<span class="badge hidden">Hidden</span>' : '') +
      (trophy.missable ? '<span class="badge missable">Potentially missable</span>' : '') +
      (trophy.targetNote ? `<span class="badge target"></span>` : '') +
      statusBadge(trophy);
    const targetBadge = meta.querySelector('.badge.target');
    if (targetBadge) targetBadge.textContent = trophy.targetNote;
    head.appendChild(name);
    head.appendChild(desc);
    head.appendChild(meta);
    if (!masked) {
      const preview = document.createElement('p');
      preview.className = 'trophy-guide-preview';
      preview.textContent = trophy.guide;
      head.appendChild(preview);
    }
    top.appendChild(check);
    top.appendChild(head);
    li.appendChild(top);
    listEl.appendChild(li);
  }
  if (shown.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'trophy';
    empty.textContent = 'No trophies match these filters. Clear the search or widen the filters.';
    listEl.appendChild(empty);
  }
}

function selectedTrophy() {
  return trophies.find((t) => t.id === selectedId) || null;
}

function onToggleFromDetail(id) {
  earned = toggleEarned(earned, id);
  saveProgress(earned);
  renderProgress();
  renderList();
  renderDetail(detailEl, selectedTrophy(), earned, onToggleFromDetail);
}

function rerenderAll() {
  renderProgress();
  renderList();
  renderDetail(detailEl, selectedTrophy(), earned, onToggleFromDetail);
}

function bindControls() {
  document.querySelector('#search').addEventListener('input', (e) => {
    filterState.query = e.target.value;
    renderList();
  });
  document.querySelector('#kind-filter').addEventListener('change', (e) => {
    filterState.kind = e.target.value;
    renderList();
  });
  document.querySelector('#grade-filter').addEventListener('change', (e) => {
    filterState.grade = e.target.value;
    renderList();
  });
  document.querySelector('#earned-filter').addEventListener('change', (e) => {
    filterState.earned = e.target.value;
    renderList();
  });
  document.querySelector('#spoiler-toggle').addEventListener('change', (e) => {
    filterState.hideSpoilers = e.target.checked;
    renderList();
  });
  document.querySelector('#export-btn').addEventListener('click', () => {
    downloadFile('leonida-legend-progress.json', exportProgress(earned));
  });
  document.querySelector('#import-file').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      earned = importProgress(text);
      saveProgress(earned);
      rerenderAll();
    } catch {
      resultLine.textContent = 'That file could not be imported — it is not a Leonida Legend progress file.';
    }
    e.target.value = '';
  });
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => {
        t.classList.toggle('active', t === tab);
        if (t === tab) t.setAttribute('aria-current', 'page');
        else t.removeAttribute('aria-current');
      });
      const name = tab.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.hidden = panel.id !== `tab-${name}`;
        panel.classList.toggle('active', panel.id === `tab-${name}`);
      });
    });
  });
}

function refreshHundred() {
  renderHundred(document.querySelector('#hundred-root'), hundredChecked, (i) => {
    hundredChecked = { ...hundredChecked, [i]: !hundredChecked[i] };
    if (!hundredChecked[i]) delete hundredChecked[i];
    saveHundred();
    refreshHundred();
  });
}

async function init() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`Could not load trophy data (${response.status})`);
  const data = await response.json();
  trophies = data.trophies;
  bindControls();
  renderRoadmap(document.querySelector('#roadmap-root'), trophies);
  renderMissables(document.querySelector('#missables-root'), trophies);
  refreshHundred();
  rerenderAll();
}

init().catch((err) => {
  listEl.innerHTML = '';
  const li = document.createElement('li');
  li.className = 'trophy';
  li.textContent = `The trophy data could not be loaded: ${err.message}`;
  listEl.appendChild(li);
});
