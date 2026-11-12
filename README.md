# Spore & Seek 🍄
*A tiny foraging adventure.*

This repository currently contains the **first playable foundation** for the browser game described in the supplied game blueprint.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Current milestone

- React + TypeScript + Vite application shell.
- Phaser 3 Enchanted Forest scene.
- Twix / Leaf choice and outfit selection.
- One starter companion; the companion follows the player.
- WASD / arrow-key movement; E interacts with the nearest mushroom or Elder Willow.
- Ten mushroom placements in the first scene, backed by the 30-species data catalogue.
- Eat / Pack / Leave choices.
- Health, stamina, local inventory and 30-species journal.
- Elder Willow dialogue and a three-discovery starter quest with a coin reward.
- Pet Haven entry screen with simple pet-care actions.
- Browser-local account prototype and per-user save separation.

## Important limitations

This is **not yet the complete release** and must not be presented as the full 30-arena game.

- The current world, player, companion and NPC are placeholder Phaser shapes. The supplied art reference images have not yet been wired into the GitHub repository.
- The first scene is a playable prototype, not a complete collision-layered, animated arena.
- The character selection/outfit UI is a starter creator, not the full layered dress-up system.
- Pet Haven is currently an entry screen with prototype interactions, not yet an explorable treehouse.
- The account flow is browser-local only. It is not production authentication, cloud save, password recovery or multi-device login. Do not deploy it publicly with real accounts.
- The developer master password and test dashboard are intentionally not exposed in frontend code. A production implementation must use backend role checks, a private environment secret/hash, rate limiting and independent test saves.
- Level 2/3 progression, all 30 arena scenes, all NPCs, pet rescue/evolution, full quests/puzzles, and sprite extraction/animation remain future work.

## Planned build order

1. Extract the supplied Twix/Leaf, pet, mushroom and NPC references into individually cleaned transparent assets; create directional sprite atlases.
2. Build an actual Enchanted Forest tile/collision map and test interaction reachability.
3. Complete the data-driven quest, inventory, mushroom effect and save systems.
4. Build all Level 1 arenas and Pet Haven.
5. Add server-backed accounts and a protected developer dashboard.
6. Add arenas 13–30, their NPCs, quests, special mushrooms and progression.
7. Add automated gameplay tests, accessibility, audio, responsive controls and deployment.

## Safety note

Mushroom effects in the game are fictional. Nothing in the game should be interpreted as advice about identifying or eating real wild mushrooms.
