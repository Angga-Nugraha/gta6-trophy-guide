// Detail panel: one trophy's official text, its guide in our own words, the
// method's confidence, its named sources as links, and its missable warning.
// Links open only when the reader follows them; the app fetches nothing.
import { isSpoilerMasked } from './filters.js';

const METHOD_LABELS = {
  reported: 'Method reported, not confirmed',
  disputed: 'Method disputed between guides',
  unconfirmed: 'Method unconfirmed',
};

export function renderDetail(panel, trophy, earned, spoilersHidden, onToggleEarned) {
  panel.replaceChildren();
  if (!trophy) {
    const hint = document.createElement('p');
    hint.className = 'detail-empty';
    hint.textContent = 'Select a trophy on the left to read its guide, its sources and when it can be missed.';
    panel.append(hint);
    return;
  }

  const masked = isSpoilerMasked(trophy, spoilersHidden, earned);
  const isEarned = earned.has(trophy.id);

  const title = document.createElement('h2');
  title.textContent = masked ? 'Hidden story trophy' : trophy.displayName ?? trophy.name;
  panel.append(title);

  const official = document.createElement('p');
  official.className = 'detail-official';
  if (masked) {
    official.textContent = 'Official name and description hidden until earned: turn spoilers off, or tick this trophy earned, to reveal them.';
  } else {
    const grade = document.createElement('strong');
    grade.textContent = trophy.grade[0].toUpperCase() + trophy.grade.slice(1);
    official.append('Official description: “', document.createTextNode(trophy.description), '” — ', grade);
  }
  panel.append(official);

  const meta = document.createElement('div');
  meta.className = 'detail-meta';
  const tags = [];
  tags.push({ text: trophy.grade, cls: '' });
  tags.push({ text: trophy.kind, cls: '' });
  if (trophy.hidden) tags.push({ text: 'Hidden on PS5', cls: 'hidden-tag' });
  if (trophy.chapter) tags.push({ text: `Chapter ${trophy.chapter}`, cls: '' });
  if (trophy.count) tags.push({ text: `Target: ${trophy.count.toLocaleString('en-US')}`, cls: '' });
  tags.push({ text: `Roadmap stage ${trophy.roadmap}`, cls: '' });
  if (trophy.missable === 'potential') tags.push({ text: 'Potentially missable', cls: 'missable' });
  if (trophy.missable === 'unknown') tags.push({ text: 'Missable: unknown', cls: 'missable' });
  if (trophy.method && METHOD_LABELS[trophy.method]) tags.push({ text: METHOD_LABELS[trophy.method], cls: `method-${trophy.method}` });
  for (const tag of tags) {
    const span = document.createElement('span');
    span.className = `tag ${tag.cls}`.trim();
    span.textContent = tag.text;
    meta.append(span);
  }
  panel.append(meta);

  if (trophy.missableNote) {
    const box = document.createElement('div');
    box.className = 'missable-box';
    box.textContent = trophy.missableNote;
    panel.append(box);
  }
  if (trophy.nameNote) {
    const note = document.createElement('p');
    note.textContent = trophy.nameNote;
    panel.append(note);
  }

  const guideHeading = document.createElement('h3');
  guideHeading.textContent = 'Guide';
  panel.append(guideHeading);
  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  guide.textContent = masked
    ? 'Spoiler hidden. The guide for a story trophy stays hidden until the trophy is earned or spoilers are switched off.'
    : trophy.guide;
  panel.append(guide);

  const sourcesHeading = document.createElement('h3');
  sourcesHeading.textContent = 'Sources';
  panel.append(sourcesHeading);
  const list = document.createElement('ul');
  list.className = 'source-list';
  for (const source of trophy.sources) {
    const item = document.createElement('li');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.name;
      item.append(link);
    } else {
      item.textContent = `${source.name} (named source, no link on file)`;
    }
    list.append(item);
  }
  const note = document.createElement('li');
  note.textContent = 'Names and descriptions are the official PS5 list as reproduced by these guides; no Rockstar or PlayStation trophy table was published to check against directly.';
  list.append(note);
  panel.append(list);

  const actions = document.createElement('div');
  actions.className = 'detail-actions';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = isEarned ? 'earned-now' : '';
  toggle.textContent = isEarned ? '✓ Earned — untick to remove' : 'Mark as earned';
  toggle.addEventListener('click', () => onToggleEarned(trophy.id));
  actions.append(toggle);
  panel.append(actions);
}
