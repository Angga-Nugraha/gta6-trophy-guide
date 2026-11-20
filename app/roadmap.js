// Roadmap to the Platinum and the missables card: built from the trophies'
// roadmap stages in data/trophies.json, not from a second copy of the list.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Story first, collect as you go (about 60–80 hours)',
    body: 'Play the Prologue and Chapters 1–5. All 12 story trophies pop automatically. Do the ONE thing that might be missable in Chapter 1 (see Missables & warnings). While playing: scan new vehicles with the WAiNK app, study new animals through binoculars, do optional missions as they appear (100 are needed for 100%, and far more than 100 exist), meditate at spots you pass, and keep a manual save at the start and end of each chapter.',
  },
  {
    stage: 2,
    title: 'Stage 2 — 100% completion checklist (about 100 hours, the long grind)',
    body: 'After the credits, the checklist appears at Progress, Stats, 100% Completion. Progress made during the story already counts. Most misc, crime and collectible trophies pop naturally during this stage. A Long Road (Gold) is the last big gate; see the 100% checklist tab for exactly what it demands in full and in part.',
  },
  {
    stage: 3,
    title: 'Stage 3 — Strangers & Freaks and misc cleanup (about 10 hours)',
    body: 'Stranger strands are NOT part of 100%, so finish the 8 qualifying strands (Kirk, Kyle, Yago and Pilot Pete are confirmed) and any leftover character questlines. Then sweep the remaining one-off trophies and the money trophies. Vice Got a Price! (Platinum) pops when the other 54 are done.',
  },
];

export function renderRoadmap(container, trophies, earned) {
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const card = document.createElement('article');
    card.className = 'stage-card';
    const members = trophies.filter((t) => t.roadmap === stage.stage);
    const done = members.filter((t) => earned.has(t.id)).length;

    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `${done}/${members.length} earned in this stage`;
    heading.append(count);
    card.append(heading);

    const body = document.createElement('p');
    body.textContent = stage.body;
    card.append(body);

    const list = document.createElement('ul');
    list.className = 'stage-trophies';
    for (const trophy of members) {
      const item = document.createElement('li');
      if (earned.has(trophy.id)) item.className = 'done';
      item.textContent = `${trophy.displayName ?? trophy.name} (${trophy.grade})`;
      list.append(item);
    }
    card.append(list);
    container.append(card);
  }
}

export function renderMissableCard(card, trophies) {
  card.replaceChildren();
  const heading = document.createElement('h3');
  heading.textContent = 'The one trophy that might be missable: Positive Mental Attitude';
  card.append(heading);

  const warning = document.createElement('p');
  warning.textContent = 'Only one trophy in the whole list carries a missable flag, and even it is POTENTIALLY missable, unconfirmed. PowerPyx and GTABase both flag it; Push Square lists no known missables. Do the Chapter 1 balcony meditation to be safe, and keep a Chapter 1 save.';
  card.append(warning);

  const steps = document.createElement('p');
  steps.textContent = 'After the mission “Down to Earth”, talk to Lucia in the kitchen in the morning. She says she is going to meditate, walks to the balcony, and a prompt offers “Accept”. Do it: the spot is gone after Chapter 1, and it is not yet confirmed whether the trophy needs it. There are 18 meditation spots across 10 locations; meditating with both Jason and Lucia counts twice, and the final one needs both characters together (possible after Chapter 2’s “Coffee Break”).';
  card.append(steps);

  const unknown = document.createElement('p');
  unknown.textContent = 'One more trophy cannot be judged for missability at all: Bad Luck, I Guess. Its method is unknown in every guide checked, so nobody can say yet whether it can be missed. This guide shows it as “method unconfirmed” rather than inventing steps.';
  card.append(unknown);

  const count = document.createElement('p');
  count.textContent = `The other 54 trophies are not missable: ${trophies.filter((t) => t.missable === 'no').length} confirmed safe, 1 potentially missable, 1 unknown.`;
  card.append(count);
}
