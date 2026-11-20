// roadmap.js — the 3-stage roadmap to the Platinum, the missables page, and the
// 100% Completion checklist. All three are built from the trophy data, so the
// stages, the missable flag and the checklist lines can never drift from it.
export const STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Story first, collect as you go',
    hours: '~60–80 h',
    intro: 'Play the Prologue and Chapters 1–5. All 12 story trophies pop automatically. Do the one thing that might be missable in Chapter 1, and keep a manual save at the start and end of each chapter.',
    bullets: [
      'Do the Chapter 1 balcony meditation (Positive Mental Attitude) — see the Missables tab.',
      'Scan new vehicles with the WAiNK app and study new animals through binoculars as you pass them.',
      'Do optional missions as they appear — 100 are needed for 100%, and far more than 100 exist.',
      'Turn on progress, collectible and Criminal Profile notifications in Settings so counters stay visible.',
      'Do NOT use cheats — they disable trophies and saving. Do NOT push the Criminal Profile to Irredeemable: it is permanent and makes police far more aggressive.',
    ],
  },
  {
    stage: 2,
    title: 'Stage 2 — The 100% Completion grind',
    hours: '~100 h',
    intro: 'After the credits, the checklist appears at Progress, Stats, 100% Completion. Progress made during the story already counts. It is lenient — closer to 60% true completion — but it is the longest trophy by far.',
    bullets: [
      'Required in full: all robberies, all 8 bank vaults, all 39 gang operations, underwater discoveries, all shooting-range gold medals, all drone races, all 15 of Bret\u2019s Target Decks.',
      'Required in part: 100 optional missions, 200 of 277 vehicle scans, 100 of 255 animal studies, 15 of 18 meditations, 70 of 80 challenges, 300 stunts, 100 WAiNK scans.',
      'Most misc, crime and collectible trophies pop naturally during this stage.',
      'A Long Road (Gold) is the last big gate of this stage.',
    ],
  },
  {
    stage: 3,
    title: 'Stage 3 — Strangers & Freaks and misc cleanup',
    hours: '~10 h',
    intro: 'Stranger strands are NOT part of 100%, so finish them now, then sweep the remaining one-off trophies and money trophies.',
    bullets: [
      'Finish the 8 qualifying Strangers & Freaks strands (Kirk, Kyle, Yago and Pilot Pete are confirmed; watch the in-game counter for the rest).',
      'Finish leftover character questlines: Andy, Kenton, Billy, Randy, Tyrone, Bret.',
      'Sweep the one-offs: Catch Me If You Can, Challenging Tank, Ten Pin, The Truth Is Out There, Bad Luck, I Guess, Capital Offense, In The Beginning\u2026, Let\u2019s Go Bowling.',
      'Sweep the money trophies: Dime on the Dollar, Treat Yo Self, Little Boxes, On the Spot.',
      'Vice Got a Price! (Platinum) pops when the other 54 are done.',
    ],
  },
];

export const HUNDRED_LINES = [
  { label: 'All robberies', detail: 'Every robbery type, in full.' },
  { label: 'All 8 bank vaults', detail: 'Unlocks in Chapter 4; 5 vaults earn Maximum Withdrawal on the way.' },
  { label: 'All 39 gang operations', detail: '1 operation from each of 9 gangs earns Pest Control; all 39 are needed here.' },
  { label: 'Underwater discoveries', detail: 'In full — dive sites and shipwreck treasure.' },
  { label: 'All 42 shooting-range gold medals', detail: '12 ranges; also earns The Shootist.' },
  { label: 'All 42 drone races', detail: '14 locations; winning each location earns Top Fun.' },
  { label: 'All 15 of Bret\u2019s Target Decks', detail: 'Also the path to Fair Game.' },
  { label: '100 optional missions', detail: 'Far more than 100 exist — missed ones do not matter.' },
  { label: '200 of 277 vehicle scans', detail: 'WAiNK app; 100 scans earn Whip It Good.' },
  { label: '100 of 255 animal studies', detail: 'Study animals through binoculars.' },
  { label: '15 of 18 meditations', detail: 'Only 15 needed — but Positive Mental Attitude may need all 18.' },
  { label: '70 of 80 challenges', detail: '50 challenges earn One Last Thing.' },
  { label: '300 of 397 stunts', detail: '250 stunts earn Cunning Stunts.' },
  { label: '100 WAiNK scans', detail: 'Also earns You WAiNKer!.' },
];

export function renderRoadmap(root, trophies) {
  const el = document.createElement('div');
  el.innerHTML = '<h2>Roadmap to the Platinum</h2><p>Difficulty 4/10, about 200 hours in total. Three stages, in order — built from the official descriptions and the 100% checklist.</p>';
  for (const s of STAGES) {
    const stageTrophies = trophies.filter((t) => t.stage === s.stage);
    const section = document.createElement('section');
    section.className = 'stage';
    const h = document.createElement('h3');
    h.innerHTML = '';
    h.textContent = `${s.title} `;
    const hours = document.createElement('span');
    hours.className = 'stage-hours';
    hours.textContent = s.hours;
    h.appendChild(hours);
    section.appendChild(h);
    const intro = document.createElement('p');
    intro.textContent = s.intro;
    section.appendChild(intro);
    const ul = document.createElement('ul');
    for (const b of s.bullets) {
      const li = document.createElement('li');
      li.textContent = b;
      ul.appendChild(li);
    }
    section.appendChild(ul);
    const count = document.createElement('p');
    count.className = 'stage-trophies';
    count.textContent = `Trophies in this stage (${stageTrophies.length}): ${stageTrophies.map((t) => t.displayName || t.name).join(', ')}.`;
    section.appendChild(count);
    el.appendChild(section);
  }
  root.replaceChildren(el);
}

export function renderMissables(root, trophies) {
  const flagged = trophies.filter((t) => t.missable);
  const el = document.createElement('div');
  el.innerHTML = '<h2>Missable trophies</h2><p>Only one trophy is flagged as potentially missable. Every other trophy stays earnable in post-story free roam.</p>';
  const warn = document.createElement('div');
  warn.className = 'warn-box';
  warn.innerHTML = '<h3>Do this in Chapter 1 — before it is gone</h3>';
  const warnText = document.createElement('p');
  warnText.textContent = 'After the mission \u201cDown to Earth\u201d, talk to Lucia in the kitchen in the morning. She says she is going to meditate, walks to the balcony, and a prompt offers \u201cAccept\u201d. Do it. The spot is gone after Chapter 1, and it is not yet confirmed whether the trophy needs it — so do it to be safe, and keep a Chapter 1 save.';
  warn.appendChild(warnText);
  el.appendChild(warn);
  for (const t of flagged) {
    const card = document.createElement('article');
    card.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = t.displayName || t.name;
    card.appendChild(h);
    const p = document.createElement('p');
    p.textContent = t.guide;
    card.appendChild(p);
    const note = document.createElement('p');
    note.className = 'stage-trophies';
    note.textContent = t.missableNote || '';
    card.appendChild(note);
    el.appendChild(card);
  }
  const safe = document.createElement('p');
  safe.textContent = `The other ${trophies.length - flagged.length} trophies are not missable: story trophies are automatic, and side questlines, robberies, collectibles, activities and challenges all stay available after the story. Counters are cumulative.`;
  el.appendChild(safe);
  root.replaceChildren(el);
}

export function renderHundred(root, checked, onToggleLine) {
  const el = document.createElement('div');
  const done = HUNDRED_LINES.filter((_, i) => checked[i]).length;
  const h = document.createElement('h2');
  h.textContent = `100% Completion checklist — ${done} of ${HUNDRED_LINES.length} lines done`;
  el.appendChild(h);
  const intro = document.createElement('p');
  intro.textContent = 'What A Long Road actually requires. Unlocks after the story at Progress, Stats, 100% Completion. Tick lines off as you finish them — this checklist is saved in your browser too.';
  el.appendChild(intro);
  HUNDRED_LINES.forEach((line, i) => {
    const row = document.createElement('label');
    row.className = 'checkline';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = !!checked[i];
    box.addEventListener('change', () => onToggleLine(i));
    const text = document.createElement('span');
    text.className = 'checkline-text';
    const strong = document.createElement('strong');
    strong.textContent = line.label;
    const span = document.createElement('span');
    span.textContent = line.detail;
    text.appendChild(strong);
    text.appendChild(span);
    row.appendChild(box);
    row.appendChild(text);
    el.appendChild(row);
  });
  root.replaceChildren(el);
}
