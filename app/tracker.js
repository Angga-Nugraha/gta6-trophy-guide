// tracker.js — saved checklist progress in localStorage, plus export / import.
// Storage key is versioned so a future format change never corrupts an old save.
export const STORAGE_KEY = 'leonida-legend-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const earned = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === true && /^\d+$/.test(key)) earned[key] = true;
    }
    return earned;
  } catch {
    return {};
  }
}

export function saveProgress(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(earned));
    return true;
  } catch {
    return false;
  }
}

export function isEarned(earned, trophyId) {
  return earned[String(trophyId)] === true;
}

export function toggleEarned(earned, trophyId) {
  const next = { ...earned };
  if (next[String(trophyId)]) delete next[String(trophyId)];
  else next[String(trophyId)] = true;
  return next;
}

export function countEarned(earned, trophies) {
  return trophies.filter((t) => isEarned(earned, t.id)).length;
}

export function countEarnedByGrade(earned, trophies) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (isEarned(earned, t.id)) counts[t.grade] += 1;
  return counts;
}

// Serialises progress for download: a small JSON file the user can keep or share.
export function exportProgress(earned) {
  return JSON.stringify(
    { app: 'leonida-legend', version: 1, exportedAt: new Date().toISOString(), earned: Object.keys(earned).map(Number).sort((a, b) => a - b) },
    null,
    2,
  );
}

// Parses an imported file. Accepts our own export shape and a plain {id: true} map.
export function importProgress(text) {
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) return fromIdList(parsed);
  if (parsed && Array.isArray(parsed.earned)) return fromIdList(parsed.earned);
  if (parsed && typeof parsed === 'object') return fromIdList(Object.entries(parsed).filter(([, v]) => v === true).map(([k]) => Number(k)));
  throw new Error('Unrecognised progress file');
}

function fromIdList(ids) {
  const earned = {};
  for (const id of ids) {
    const n = Number(id);
    if (Number.isInteger(n) && n >= 1 && n <= 55) earned[String(n)] = true;
  }
  return earned;
}

export function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
