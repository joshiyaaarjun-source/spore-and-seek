# Spore & Seek 🍄
*A tiny foraging adventure.*

This repository contains the first playable foundation and a new original pixel-art visual pass.

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

## Current playable foundation

- React + TypeScript + Vite application shell.
- Phaser 3 Enchanted Forest scene.
- Twix / Leaf character selection and outfit selection.
- Starter companion selection and following companion.
- WASD / arrow-key movement; E interacts with the nearest mushroom or Elder Willow.
- Ten mushroom placements in the first scene, backed by the 30-species catalogue.
- Eat / Pack / Leave choices.
- Health, stamina, local inventory and 30-species journal.
- Elder Willow dialogue and a three-discovery starter quest with a coin reward.
- Pet Haven entry screen with prototype pet-care actions.
- Browser-local account prototype and per-user save separation.

## Visual direction

The visual system is guided by the user's supplied Spore & Seek references, not copied from them:

- Detailed, crisp pixel-art / 16-bit cozy fantasy RPG.
- Chibi silhouettes for Twix, Leaf, pets and NPCs.
- Warm parchment, dusty rose, mushroom red, pine green, cocoa and lantern-gold.
- Storybook borders, layered environments, tiny flowers, water shimmer, lantern glow and drifting fireflies.
- UI typography uses a decorative serif for story headings and a readable sans-serif for controls.
- Game scene art is layered in code so walkable areas, collectible mushrooms, characters and NPCs remain interactive.

See `docs/ART_DIRECTION.md` for the current art rules and production pipeline.

## Art pipeline status

- Canva: a six-page editable Spore & Seek art-direction bible was created.
- Figma: the connected seat reports view-only access, so a design file could not be edited from this session.
- Higgsfield: reference images uploaded successfully, but image generation was rejected because the connected account requires a Basic plan or higher. No paid job was submitted.
- The current pixel sprites are original code-drawn vector pixel art and should be treated as a visual foundation, not final character sprite atlases.

## Important limitations

This is **not yet the complete release** and must not be presented as the full 30-arena game.

- The first scene is a playable prototype, not a complete collision-layered tilemap.
- The character creator is a starter preview, not the full layered dress-up system.
- Pet Haven is currently a prototype entry screen, not yet an explorable treehouse.
- The account flow is browser-local only. It is not production authentication, cloud save, password recovery or multi-device login. Do not deploy it publicly with real accounts.
- Developer master access and test dashboard are not exposed in frontend code. A production implementation must use backend role checks, a private environment secret/hash, rate limiting and independent test saves.
- Levels 2 and 3, all 30 arena scenes, all NPCs, pet rescue/evolution, full quests/puzzles, and production sprite atlases remain future work.

## Planned build order

1. Replace code-drawn character placeholders with approved, consistent directional sprite atlases.
2. Build a real Enchanted Forest tile/collision map and test interaction reachability.
3. Complete the data-driven quest, inventory, mushroom effect and save systems.
4. Build all Level 1 arenas and Pet Haven.
5. Add server-backed accounts and a protected developer dashboard.
6. Add arenas 13–30, their NPCs, quests, special mushrooms and progression.
7. Add automated gameplay tests, accessibility, audio, responsive controls and deployment.

## Safety note

Mushroom effects in the game are fictional. Nothing in the game should be interpreted as advice about identifying or eating real wild mushrooms.
