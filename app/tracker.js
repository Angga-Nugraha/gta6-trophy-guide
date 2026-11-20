// Progress store: the earned set lives in localStorage, and moves as a JSON file
// on export and import. Nothing here touches the network.
export const PROGRESS_KEY = 'gta6-trophy-guide-progress-v1';
export const SPOILER_KEY = 'gta6-trophy-guide-spoilers-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSpoilersHidden() {
  // Spoilers are hidden by default; the toggle remembers the reader's choice.
  try {
    const raw = localStorage.getItem(SPOILER_KEY);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

export function saveSpoilersHidden(hidden) {
  try {
    localStorage.setItem(SPOILER_KEY, hidden ? '1' : '0');
  } catch {
    // Private mode or blocked storage: the toggle still works for this visit.
  }
}

export function downloadProgress(earned) {
  const payload = { app: 'leonida-legend-gta6-trophy-guide', exportedAt: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export async function readProgressFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) throw new Error('That file has no earned list in it.');
  const clean = ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55);
  if (clean.length === 0 && ids.length > 0) throw new Error('That file has no trophy ids between 1 and 55.');
  return new Set(clean);
}
