# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun bounty](https://make.fun/badge/bounty/gta6-trophy-guide-01)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun live](https://make.fun/badge/live/gta6-trophy-guide-01)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun entry](https://make.fun/badge/entry/gta6-trophy-guide-01)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden), built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) ($250, free entry, top 50 paid).

## What it is

- **Checklist** of all 55 trophies with official name, description and grade, saved in the browser (localStorage) with export to a file and import back.
- **Filters** by kind (story / missable / collectibles / activities / side quests / misc), grade, earned state, and free-text search.
- **Spoiler toggle** that masks the 12 hidden story trophies — name and description stay hidden until the trophy is earned.
- **Cited guides**: every trophy has a guide written in this entry's own words, with its sources named beside it (PowerPyx, GTABase, Insider Gaming, Radio Times, Push Square). Methods the guides disagree on are labelled **reported**, **disputed** or **unconfirmed** — never presented as fact.
- **3-stage roadmap to the Platinum** (~200 h, difficulty 4/10): story first, the 100% Completion grind, then Strangers & Freaks and misc cleanup.
- **Missables page**: only one trophy is flagged — Positive Mental Attitude is *potentially* missable (the Chapter 1 balcony meditation). The other 54 stay earnable in post-story free roam.
- **100% Completion checklist**: the 14 lines A Long Road actually requires, tickable and saved.

## Honesty notes

- All 55 trophies are offline single-player. There are no online trophies.
- Cheats disable trophies and saving — keep cheats off for a trophy run.
- Trophy 12 is shown in full in the guide (*Tits Ass Drug Money*); its data name keeps the asterisked spelling most outlets print.
- For *You Gotta Know When to Get Off* this guide uses the majority wording, “Complete the final mission.” Some outlets word it “Complete Chapter 5” — same unlock.
- No Rockstar logo, artwork or game screenshots anywhere. The look is this guide's own.

## Run it

Static files, no build step. Serve `app/` with any static server:

```sh
cd app && python3 -m http.server 8080
```

Then open http://localhost:8080 — it works with the network off. The app fetches only its own `data/trophies.json` and loads no external resource.

## Hand in

`main.ts` (Node 22+, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
