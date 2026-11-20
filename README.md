# Leonida Legend — GTA VI Trophy Guide & Tracker (PS5)

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Angga-Nugraha/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Angga-Nugraha/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden; 0 online), built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Every trophy** with its official name, description and grade, plus a guide in our own words that names its sources (PowerPyx, GTABase, Insider Gaming, RadioTimes, Push Square).
- **Tracker**: tick trophies off; progress is saved in the browser (localStorage) and can be exported to a file and imported back.
- **Filters** by kind (story, missable, collectibles, activities, side quests, misc & crime), grade, earned state, and full-text search.
- **Spoiler setting** that hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the Platinum** in three stages, a **missables page** (only Positive Mental Attitude is flagged, as potentially missable and unconfirmed), and the **100% completion checklist** behind A Long Road.
- **Honest uncertainty**: methods the guides disagree on or have not confirmed (Bad Luck, I Guess; The Truth Is Out There; Ten Pin; In The Beginning…; Capital Offense; Fair Game) are labelled reported, disputed or unconfirmed instead of presented as fact.

## Run it

Serve `app/` with any static server and open `app/index.html` in desktop Chrome. It works with the network off: it loads only its own files and makes no network request. No build step, no dependencies.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Notes

- Unofficial fan-made guide. Not affiliated with, endorsed by or connected to Rockstar Games, Take-Two Interactive or PlayStation. All artwork, layout and guide text are original; trophy names and descriptions are shown as PlayStation publishes them. No Rockstar artwork, logo or font is used.
- One trophy name is listed by PlayStation with asterisks (`T**s Ass Drug Money`); the guide keeps that exact spelling as the trophy name and notes the uncensored spelling used by some guides.
- License: MIT (see `LICENSE`).
