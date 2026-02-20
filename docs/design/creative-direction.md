# Creative Direction

## YOU ARE THE CREATIVE DIRECTOR

This is NOT a technical exercise. This is a living game world. Every name, every label, every interaction, every map must feel like part of an organic, inhabited world. **If something reads like a design-doc placeholder, a wireframe label, or a programmer's shorthand — OWN THE GAP. Fix it. Name it. Make it real.**

## The Mandate

1. **Every place needs a real name.** "Village Hub" is not a village. "Map 2" is not a destination. Use compound-word naming following established conventions (Heartfield, Ambergrove, Millbrook, Sunridge, Everwick).

2. **Every NPC needs personality.** Generic dialogue like "Welcome to the shop" is not acceptable. NPCs have histories, opinions, and speech patterns documented in `docs/story/characters.md` and `docs/story/dialogue-bank.md`.

3. **Every event should feel authored.** "You examine the quest-board" is a placeholder. Describe what the player actually sees, hears, and feels.

4. **No confirmation needed.** When you find a gap in creative quality, fix it immediately. Document your decision in the Creative Decisions Log below so future agents understand the reasoning.

5. **Think like a player, not a developer.** Would a player say "I'm in the Village Hub"? No. They'd say "I'm in Everwick." Would a player read "You examine the rs-ew-01"? No. They'd read about a glowing resonance stone pulsing with warmth.

## Zone Naming Convention

All zones use **compound English words**: [descriptor] + [geographic feature].

| Zone | Name Parts | Meaning |
|------|-----------|---------|
| Everwick | ever + wick | The eternal settlement |
| Heartfield | heart + field | Warm farmland |
| Ambergrove | amber + grove | Golden forest |
| Millbrook | mill + brook | Watermill on the stream |
| Sunridge | sun + ridge | Sun-washed highlands |

Future zones should follow this pattern. If the design docs use a placeholder, create a proper name.

## Creative Decisions Log

Document all creative decisions here so any agent can understand what was decided and why.

| Decision | Rationale | Date |
|----------|-----------|------|
| "Village Hub" -> **Everwick** | Placeholder name. "Ever" = enduring/eternal (most-remembered place), "wick" = Old English for settlement (Warwick, Berwick). Follows compound-word pattern of surrounding zones. | 2026-02-19 |
| Event prefix `vh` -> `ew` | Resonance stones `rs-ew-*`, chests `ch-ew-*` match the new map ID. | 2026-02-19 |
| BGM ID stays `bgm-vh` | Audio file IDs are internal, not player-facing. Renaming audio files is a separate concern. | 2026-02-19 |
| JSON DDL over TypeScript for scenes | Scene definitions are DATA, not code. JSON + Zod validation = parseable, diffable, generatable. TypeScript map compositions become compiled output, not hand-authored source. | 2026-02-19 |
| Markdown parser generates scene DDL | The act scripts in `docs/story/` are the narrative source of truth. The parser (`gen/assemblage/parser/act-script-parser.ts`) extracts structured data and generates `gen/ddl/scenes/act{N}.json`. Re-run when docs change. | 2026-02-19 |
| Scene compiler replaces hand-authored maps | The compiler reads scene DDL + map DDL -> produces MapComposition objects. The `gen/assemblage/maps/*.ts` files will be deprecated as scene DDL is populated with assemblage refs. | 2026-02-19 |
| Awakening starts in Artun's study | Act 1 Script says player spawns in Elder's House. Old awakening-intro said "village square" -- wrong. Rewritten: morning light, cedar ink, bookshelves. Player is LOCAL, not a stranger. | 2026-02-19 |
| No `[Tutorial]` brackets in dialogue | Tutorial text should feel in-world. "The Resonance Stones outside are louder than usual" teaches exploration without a wireframe label. The world teaches; the UI doesn't. | 2026-02-19 |
| Quest notifications as feelings | "Quest Started: The Architect's Awakening" replaced with "Something stirs at the edge of your awareness." The system still fires `startQuest()`, but the player reads atmosphere, not a design doc. | 2026-02-19 |
| NPC sprites use real character names | `npc_callum` -> `npc_artun`, `npc_lira` -> `npc_hana`, etc. Legacy aliases in `client/characters/aliases.ts` remain for backward compat. | 2026-02-19 |
| Resonance stones carry unique memories | Each stone has a distinct memory tied to its location: fountain stone = children playing, garden stones = Dissolved ceremony + wildflowers + equinox hymn, scholar's stone = young Artun studying. No two stones read the same. | 2026-02-19 |
| Villager dialogue is vibrancy-reactive | Three tiers (muted <=33, normal 34-66, vivid >=67) with world-specific observations. Villagers notice the fountain light, the wheat height, the metal singing. Not generic filler. | 2026-02-19 |
| Stagnation zone is state-reactive | Heartfield's clearing stone + anchor have different text before and after breaking (`STAGNATION_CLEARING_BROKEN` flag). Child NPC dialogue shifts from wonder to celebration. | 2026-02-19 |
| Treasure chests tell micro-stories | Each chest has environmental context: miller's strongbox, farmer's emergency cache, traveler's dropped satchel. Not "You found a chest!" | 2026-02-19 |
| Dialogue files renamed to real characters | `lira-*.ts` -> `hana-*.ts`, `callum-*.ts` -> `artun-*.ts`, etc. Internal codebase should reflect the authored world, not development placeholders. | 2026-02-19 |
| Tilesets reorganized by domain | Pack-based dirs (`exteriors/premium/`) -> domain-based (`village/`, `fortress/`, `sketch-realm/`, etc.). Palettes no longer reference `-premium` paths. | 2026-02-19 |
