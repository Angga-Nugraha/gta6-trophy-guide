// Leonida Legend — make.fun hand-in program (Node 22+, standard library only).
//
// What it does: copies this repository's app/ and screenshots/ into the output
// directory and writes output/dossier.json with the vendored make.fun library
// (vendor/makefun-frontend.ts, left untouched). The dossier is what the judge
// reads: the screenshots, the first load's files and bytes, and the source.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader MAKEFUN_OUTPUT_DIR is unset and /output is used instead.
// The two runs must produce identical bytes, so nothing here depends on the
// clock, the environment, or the order the filesystem happens to list files.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const REPO_ROOT = fileURLToPath(new URL('.', import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps, as the kit documents them: the dossier text cap, the
// screenshot count and size caps, and the app size caps. An entry past any of
// them is refused here with the library's own words, exactly as the gate would.
const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function copyEntryTree() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  cpSync(join(REPO_ROOT, 'app'), join(OUTPUT_DIR, 'app'), { recursive: true });
  mkdirSync(join(OUTPUT_DIR, 'screenshots'), { recursive: true });
  const shots = join(REPO_ROOT, 'screenshots');
  if (existsSync(shots)) {
    cpSync(shots, join(OUTPUT_DIR, 'screenshots'), { recursive: true });
  }
}

function writeDossier() {
  const dossier = buildDossier(OUTPUT_DIR, DOSSIER_OPTIONS);
  writeFileSync(join(OUTPUT_DIR, 'dossier.json'), dossier);
}

copyEntryTree();
writeDossier();
