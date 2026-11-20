// filters.js — the checklist's search / kind / grade / earned filters and the
// spoiler toggle. A trophy is shown only when every active filter passes it.
export const KIND_LABELS = {
  story: 'Story',
  collectible: 'Collectible',
  activity: 'Activity',
  side: 'Side quest',
  misc: 'Misc',
};

export function defaultFilterState() {
  return { query: '', kind: 'all', grade: 'all', earned: 'all', hideSpoilers: true };
}

export function trophyMatchesFilter(trophy, state, earned) {
  if (state.kind === 'missable') {
    if (!trophy.missable) return false;
  } else if (state.kind !== 'all' && trophy.kind !== state.kind) {
    return false;
  }
  if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
  const hasEarned = earned[String(trophy.id)] === true;
  if (state.earned === 'earned' && !hasEarned) return false;
  if (state.earned === 'unearned' && hasEarned) return false;
  if (state.query) {
    const haystack = [trophy.displayName || trophy.name, trophy.name, trophy.description, trophy.guide, trophy.kind, trophy.grade]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(state.query.toLowerCase())) return false;
  }
  return true;
}

export function applyFilters(trophies, state, earned) {
  return trophies.filter((t) => trophyMatchesFilter(t, state, earned));
}

// Story trophies (the 12 hidden story ones) are spoilers until earned.
// While the toggle is on, their name and description render masked in the list.
export function isSpoilerMasked(trophy, state, earned) {
  return state.hideSpoilers && trophy.kind === 'story' && trophy.hidden && earned[String(trophy.id)] !== true;
}

export function spoilerLabel(trophy) {
  return `Hidden story trophy #${trophy.id} — earn it in-game to reveal`;
}
