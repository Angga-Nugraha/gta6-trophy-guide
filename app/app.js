// Leonida Legend: bootstrap, list rendering, tabs, and wiring for the
// tracker, filters, detail panel and roadmap. Loads only data/trophies.json,
// a file of this app, and nothing else.
import { loadEarned, saveEarned, loadSpoilersHidden, saveSpoilersHidden, downloadProgress, readProgressFile } from './tracker.js';
import { trophyMatches, isSpoilerMasked, describeFilter } from './filters.js';
import { renderDetail } from './detail.js';
import { renderRoadmap, renderMissableCard } from './roadmap.js';

const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detailPanel');
const listMetaEl = document.getElementById('listMeta');
const filterNoteEl = document.getElementById('filterNote');
const earnedCountEl = document.getElementById('earnedCount');
const progressFillEl = document.getElementById('progressFill');
const progressBarEl = document.getElementById('progressBarWrap');
const progressSubEl = document.getElementById('progressSub');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('gradeFilter');
const earnedFilterEl = document.getElementById('earnedFilter');
const spoilerEl = document.getElementById('spoilerToggle');

const state = { kind: 'all', grade: 'all', earned: 'all', query: '' };
let trophies = [];
let earned = loadEarned();
let spoilersHidden = loadSpoilersHidden();
let selectedId = 31; // Positive Mental Attitude: the one missable trophy, shown first.

const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

function gradeCounts() {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const trophy of trophies) {
    counts[trophy.grade][1] += 1;
    if (earned.has(trophy.id)) counts[trophy.grade][0] += 1;
  }
  return counts;
}

function renderProgress() {
  const total = trophies.length;
  earnedCountEl.textContent = String(earned.size);
  progressFillEl.style.width = total ? `${(earned.size / total) * 100}%` : '0%';
  progressBarEl.setAttribute('aria-valuenow', String(earned.size));
  const counts = gradeCounts();
  progressSubEl.textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${GRADE_LABELS[g]} ${counts[g][0]}/${counts[g][1]}`)
    .join(' · ');
}

function toggleEarned(id) {
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  saveEarned(earned);
  renderAll();
}

function trophyRow(trophy) {
  const masked = isSpoilerMasked(trophy, spoilersHidden, earned);
  const row = document.createElement('li');
  row.className = `trophy-row${earned.has(trophy.id) ? ' earned' : ''}${selectedId === trophy.id ? ' selected' : ''}`;

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.id);
  box.setAttribute('aria-label', `Earned: ${masked ? 'hidden story trophy' : trophy.name}`);
  // 'click', not 'change': the row's own click handler re-renders the list,
  // which would detach this checkbox before a 'change' event could fire.
  box.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleEarned(trophy.id);
  });
  row.append(box);

  const badge = document.createElement('span');
  badge.className = `grade-badge grade-${trophy.grade}`;
  badge.textContent = GRADE_LABELS[trophy.grade];
  row.append(badge);

  const text = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'trophy-name';
  if (masked) {
    const mask = document.createElement('span');
    mask.className = 'spoiler-mask';
    mask.textContent = 'Hidden story trophy — earn it to reveal';
    name.append(mask);
  } else {
    name.textContent = trophy.displayName ?? trophy.name;
  }
  text.append(name);
  const desc = document.createElement('div');
  desc.className = 'trophy-desc';
  desc.textContent = masked ? 'Story spoiler hidden. Switch spoilers off, or tick it earned, to see the official description.' : trophy.description;
  text.append(desc);
  const tags = document.createElement('div');
  tags.className = 'trophy-tags';
  const tagDefs = [{ text: trophy.kind, cls: '' }];
  if (trophy.hidden) tagDefs.push({ text: 'Hidden on PS5', cls: 'hidden-tag' });
  if (trophy.missable === 'potential') tagDefs.push({ text: 'Potentially missable', cls: 'missable' });
  if (trophy.missable === 'unknown') tagDefs.push({ text: 'Method unconfirmed', cls: 'missable' });
  if (trophy.method === 'reported') tagDefs.push({ text: 'Method reported', cls: 'method-reported' });
  if (trophy.method === 'disputed') tagDefs.push({ text: 'Method disputed', cls: 'method-disputed' });
  for (const def of tagDefs) {
    const tag = document.createElement('span');
    tag.className = `tag ${def.cls}`.trim();
    tag.textContent = def.text;
    tags.append(tag);
  }
  text.append(tags);
  row.append(text);

  const guideBtn = document.createElement('button');
  guideBtn.type = 'button';
  guideBtn.className = 'guide-btn';
  guideBtn.textContent = 'Guide';
  guideBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    selectedId = trophy.id;
    renderAll();
  });
  row.append(guideBtn);

  row.addEventListener('click', () => {
    selectedId = trophy.id;
    renderAll();
  });
  return row;
}

function renderList() {
  listEl.replaceChildren();
  const shown = trophies.filter((t) => trophyMatches(t, state, earned));
  for (const trophy of shown) listEl.append(trophyRow(trophy));
  listMetaEl.textContent = describeFilter(state, shown.length, trophies.length);
  const onlineNote = 'Online trophies: none. This list has 0 online trophies, so there is no online filter.';
  filterNoteEl.textContent = state.kind === 'missable'
    ? 'Missable filter: Positive Mental Attitude (potentially missable) and Bad Luck, I Guess (method unknown, missability unjudged). Every other trophy is safe in post-story free roam.'
    : onlineNote;
}

function renderAll() {
  renderProgress();
  renderList();
  const selected = trophies.find((t) => t.id === selectedId) ?? null;
  renderDetail(detailEl, selected, earned, spoilersHidden, toggleEarned);
  renderRoadmap(document.getElementById('roadmapStages'), trophies, earned);
  renderMissableCard(document.getElementById('missableCard'), trophies);
}

function switchTab(name) {
  for (const button of document.querySelectorAll('.tab')) {
    button.classList.toggle('active', button.dataset.tab === name);
  }
  for (const view of document.querySelectorAll('.view')) {
    view.hidden = view.id !== `view-${name}`;
  }
}

function wireControls() {
  document.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.kind = chip.dataset.kind;
      document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
      renderList();
    });
  });
  searchEl.addEventListener('input', () => {
    state.query = searchEl.value.trim().toLowerCase();
    renderList();
  });
  gradeEl.addEventListener('change', () => {
    state.grade = gradeEl.value;
    renderList();
  });
  earnedFilterEl.addEventListener('change', () => {
    state.earned = earnedFilterEl.value;
    renderList();
  });
  spoilerEl.checked = spoilersHidden;
  spoilerEl.addEventListener('change', () => {
    spoilersHidden = spoilerEl.checked;
    saveSpoilersHidden(spoilersHidden);
    renderAll();
  });
  document.getElementById('exportBtn').addEventListener('click', () => downloadProgress(earned));
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      earned = await readProgressFile(file);
      saveEarned(earned);
      renderAll();
    } catch (error) {
      alert(`Could not import that file: ${error.message}`);
    }
    event.target.value = '';
  });
}

async function boot() {
  const response = await fetch('data/trophies.json');
  const doc = await response.json();
  trophies = doc.trophies;
  wireControls();
  renderAll();
}

boot();
