# Spore & Seek — Art Direction

## North star
A cozy, richly layered 16-bit fantasy RPG that feels like stepping into an illustrated storybook. The supplied references guide the art direction; they are not to be pasted in as flattened game assets.

## Visual principles
- Pixel art with crisp, intentionally clustered pixels and readable silhouettes.
- Chibi character scale with expressive faces and small, memorable details.
- Warm lantern lighting against pine, moss and twilight forest tones.
- Dense but legible scenery: flowers, mushrooms, shrubs, treehouses, water, bridges, crystals and distant architecture.
- Storybook UI: parchment panels, carved-wood surfaces, brass-gold trim, floral corner ornaments and warm serif titles.
- Each biome needs a distinct palette and prop language while retaining consistent outlines, shading and pixel scale.

## Palette tokens

| Token | Hex | Intended use |
|---|---|---|
| Pine | #183329 | Main dark surface |
| Deep pine | #10231D | HUD, shadows, night areas |
| Moss | #405F45 | Foliage, forest ground |
| Dusty rose | #D88D98 | Primary accent |
| Rose deep | #9C4D60 | Active controls and rare UI accent |
| Wine | #4B1E2B | Contrast, deep panels |
| Parchment | #F2E3C7 | Dialogues, cards, menus |
| Toasted cocoa | #60443B | Outlines, wood, text |
| Lantern gold | #E7B86C | Light, rewards, highlights |

## Character rules
- Twix: curious, lively, dark chestnut hair, rose-red mushroom cap, flower accents, warm cream and dusty-rose clothing.
- Leaf: gentle and observant, dark tousled hair, moss/leaf headwear, cream and sage clothing.
- Preserve identity across all views and animations: same face, hairline, hat, clothing silhouette, palette and body proportions.
- Minimum animation states: front/back/side idle, walk in four directions, interact, happy, tired and discovery.

## Environment rules
- Never flatten a playable arena into one background image.
- Separate ground, path, collision props, collectible objects, NPCs, foreground canopy and ambient effects.
- Animate water shimmer, foliage sway, lantern flicker, drifting spores, petals and fireflies.
- Decorative objects must not block player controls or cover interaction hotspots.

## NPC and pet rules
- No emoji placeholders.
- Every character has an individual silhouette, palette, role and expression.
- NPC dialogue uses parchment bubbles with a portrait, a name ribbon and clear choices.
- Pets have idle, follow, walk, happy and sleep states; each species has a distinct silhouette.

## UI rules
- Decorative serif for game/story titles; readable sans-serif for inputs and status labels.
- Reusable parchment card, rose active button, gold focus outline, inventory slot, dialogue bubble, quest panel and progress bar components.
- Keep game controls readable at mobile sizes and support reduced-motion preferences.

## Tool workflow
1. Canva — visual bible, moodboards and page-level UI concept exploration.
2. Figma — editable tokens, components, UI layouts, and animation timing once an editor seat is available.
3. Higgsfield — original character, pet, mushroom, NPC and arena concept/sprite asset production once account plan supports generation.
4. GitHub — versioned source, asset manifest, scene integration and build checks.

## Current limitation
The connected Figma account was reported as view-only and Higgsfield image generation required a Basic plan or higher. Therefore this commit uses original code-drawn pixel-style sprites and Phaser tweens as a visual foundation; it does not claim to contain final generated sprite atlases.
