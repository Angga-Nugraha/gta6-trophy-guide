// Filter rules for the trophy list: kind chips, grade, earned state and search.
// The "missable" chip shows every trophy whose missable flag is not "no":
// Positive Mental Attitude (potentially missable) and Bad Luck, I Guess
// (method unknown, so missability cannot be judged). "Activities" covers the
// activity and stunt kinds; there is no online kind in this list at all.
export const KIND_LABELS = {
  all: 'All 55',
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectibles',
  activity: 'Activities',
  side: 'Side quests',
  misc: 'Misc & crime',
};

export function kindMatches(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable !== 'no';
  if (kind === 'activity') return trophy.kind === 'activity' || trophy.kind === 'stunt';
  return trophy.kind === kind;
}

export function trophyMatches(trophy, state, earned) {
  if (!kindMatches(trophy, state.kind)) return false;
  if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
  if (state.earned === 'earned' && !earned.has(trophy.id)) return false;
  if (state.earned === 'todo' && earned.has(trophy.id)) return false;
  if (state.query) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(state.query)) return false;
  }
  return true;
}

export function isSpoilerMasked(trophy, spoilersHidden, earned) {
  return spoilersHidden && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function describeFilter(state, shown, total) {
  const bits = [];
  if (state.kind !== 'all') bits.push(KIND_LABELS[state.kind]);
  if (state.grade !== 'all') bits.push(state.grade);
  if (state.earned === 'todo') bits.push('not earned yet');
  if (state.earned === 'earned') bits.push('earned only');
  if (state.query) bits.push(`matching "${state.query}"`);
  const what = bits.length ? bits.join(' · ') : 'all trophies';
  return `Showing ${shown} of ${total} — ${what}.`;
}
