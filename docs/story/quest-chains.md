# Quest Chains: Complete Quest Specifications

> Cross-references: [docs/story/act1-script.md](act1-script.md), [docs/story/act2-script.md](act2-script.md), [docs/story/act3-script.md](act3-script.md), [docs/story/characters.md](characters.md), [docs/story/dialogue-bank.md](dialogue-bank.md), [docs/design/items-catalog.md](../design/items-catalog.md), [docs/design/enemies-catalog.md](../design/enemies-catalog.md), [docs/design/progression.md](../design/progression.md), [docs/design/memory-system.md](../design/memory-system.md), [docs/world/geography.md](../world/geography.md), [docs/world/dormant-gods.md](../world/dormant-gods.md)

## Overview

Every quest in Mnemonic Realms is documented here with exact triggers, objectives, rewards, and dependency chains. Quests are organized into three categories:

1. **Main Quests (MQ)** — 10 quests forming the critical path from tutorial to endgame. Cannot be skipped.
2. **Side Quests (SQ)** — 14 optional quests tied to NPCs, exploration, and memory broadcasting. Available based on progress.
3. **God Recall Quests (GQ)** — 4 quest chains (one per dormant god) with emotion-based branching into recall-specific side quests.

### Quest Design Principles

- **No XP from quests**: XP comes only from combat (see [progression.md](../design/progression.md)). Quest rewards are gold, items, fragments, and gameplay unlocks.
- **No failure states on main quests**: Main quests always have a path forward. Side quests and god quests can have failure conditions.
- **Dependency chains**: Quests unlock in a fixed order for main quests, and condition-based order for side quests and god quests.
- **Item IDs**: All reward items reference [items-catalog.md](../design/items-catalog.md) by exact ID.
- **Fragment rewards**: Listed as `(emotion / element / potency)` or by named fragment ID (MF-##).

---

## Main Quest Chain

The main quest chain spans all three acts and represents the player's journey from newly recognized Mnemonic Architect to the one who remixes the First Memory. Completing MQ-10 triggers the endgame bloom.

---

### MQ-01: The Architect's Awakening

**Act**: I (Tutorial) | **Level**: 1 | **Giver**: Callum | **Location**: Village Hub — Elder's House

**Trigger**: Automatic upon starting a new game and completing the opening cutscene.

**Objectives**:
1. Speak with Callum at the Elder's House (18, 10)
2. Receive the Architect's Signet (K-01) from Lira at her Workshop (8, 18)
3. Collect your first memory fragment from the Memorial Garden (8, 16) — Callum's First Lesson (MF-01)
4. Return to Callum and learn about Resonance Stones

**Rewards**: Architect's Signet (K-01), Callum's First Lesson (MF-01, joy/neutral/2), 50 gold

**Completion Dialogue**:
- Callum: "There it is — that glow in your palm. You can feel it, can't you? The world remembering through you. This is what an Architect does. We listen, we gather, and we give back."

**Failure Conditions**: None (tutorial quest).

**Unlocks**: MQ-02

**Dependencies**: None

---

### MQ-02: First Broadcast

**Act**: I (Tutorial) | **Level**: 1-2 | **Giver**: Lira | **Location**: Village Hub — Lira's Workshop

**Trigger**: Completing MQ-01.

**Objectives**:
1. Visit Lira at her Workshop (8, 18) and learn memory operations (Collect, Remix, Broadcast)
2. Collect 2 memory fragments from the Memorial Garden Resonance Stones
3. Use the Remix Table (K-03 unlock) to combine fragments
4. Broadcast a remixed fragment into the Memorial Garden's central Resonance Stone
5. Observe the vibrancy increase (Memorial Garden gains +5 vibrancy visually)

**Rewards**: Remix Table Access (K-03), Lira's Warmth (MF-02, joy/light/3), 80 gold

**Completion Dialogue**:
- Lira: "Did you feel that? The stone sang back to you. That's the world saying 'thank you.' Every fragment you share makes this place a little more alive."

**Failure Conditions**: None (tutorial quest).

**Unlocks**: MQ-03, SQ-01

**Dependencies**: MQ-01

---

### MQ-03: The Settled Lands

**Act**: I | **Level**: 2-6 | **Giver**: Callum | **Location**: Village Hub — Elder's House

**Trigger**: Completing MQ-02.

**Objectives**:
1. Speak with Callum at the Elder's House and receive exploration guidance
2. Visit all four Settled Lands sub-maps: Heartfield, Ambergrove, Millbrook, and Sunridge
3. Collect at least 5 memory fragments from across the Settled Lands
4. Defeat the training combat encounters in each zone (at least 1 combat per sub-map)
5. Return to Callum and share what you've found

**Rewards**: 200 gold, 1 unnamed fragment (joy/earth/2), Callum's Letters (K-02)

**Completion Dialogue**:
- Callum: "You've seen it now — how the world changes at the edges. Those shimmering boundaries aren't natural decay. Something is holding the world back from growing. I've written down everything I know about the lands beyond. Take my letters. When you reach the Frontier, read the one for whatever zone you're in."

**Failure Conditions**: None.

**Unlocks**: MQ-04, SQ-02, SQ-03, SQ-04

**Dependencies**: MQ-02

---

### MQ-04: The Stagnation

**Act**: I (Climax) | **Level**: 6-10 | **Giver**: Automatic (story event) | **Location**: Heartfield — Stagnation Clearing (35, 30)

**Trigger**: After completing MQ-03, a story event triggers when the player next enters Heartfield. Lira is at the Stagnation Clearing investigating.

**Objectives**:
1. Travel to the Stagnation Clearing in Heartfield (35, 30)
2. Witness Lira investigating the expanding stagnation zone
3. Encounter the Preserver patrol — survive the combat encounter (2x Preserver Scout, cannot lose; if defeated, Lira shields the player and the encounter ends)
4. Watch the climax cutscene: Lira is caught at the stagnation zone's edge and frozen mid-sentence
5. Collect Lira's Scream (MF-04, fury/light/4) from the ground where she was frozen
6. Broadcast a potency 2+ fragment into the Stagnation Clearing's edge to halt the expansion (any emotion/element)
7. Return to Callum at the Village Hub

**Rewards**: Lira's Scream (MF-04, fury/light/4), Echo of the Stagnation (MF-03, sorrow/dark/2), 150 gold

**Completion Dialogue**:
- Callum: "Lira... No. She can't — she was just... Listen to me. The Frontier. The answers are in the Frontier. Those Preservers — they think freezing the world is kindness. I'm opening the mountain pass. Go north. Find the old shrine sites. And find a way to undo what they've done to Lira."

**Failure Conditions**: None (the combat encounter auto-resolves if the player is defeated).

**Unlocks**: MQ-05, SQ-05 (mountain pass north of Village Hub opens, granting access to the Frontier)

**Dependencies**: MQ-03

---

### MQ-05: Into the Frontier

**Act**: II | **Level**: 10-12 | **Giver**: Callum | **Location**: Village Hub — Lookout Hill

**Trigger**: Completing MQ-04. The mountain pass north of Village Hub is now open.

**Objectives**:
1. Speak with Callum at the Lookout Hill (12, 2) to receive Frontier briefing
2. Cross the mountain pass north into Hollow Ridge
3. Reach the Ridgewalker Camp (15, 25) in Hollow Ridge and speak with Petra
4. Learn about the dormant gods from Petra's introduction
5. Visit at least one other Frontier zone (Shimmer Marsh, Flickerveil, or Resonance Fields)

**Rewards**: 300 gold, Stasis Breaker x3 (C-SC-04)

**Completion Dialogue**:
- Petra: "You're the Architect Callum wrote about. Good — we've been waiting. There are four places in the Frontier where the land itself is... dreaming. Old gods, unfinished, waiting for someone who can remember them into being. The Preservers want them to stay asleep forever. I think you should wake them up."

**Failure Conditions**: None.

**Unlocks**: MQ-06, GQ-01, GQ-02, GQ-03, GQ-04, SQ-06, SQ-07, SQ-08, SQ-09

**Dependencies**: MQ-04

---

### MQ-06: Recall the First God

**Act**: II | **Level**: 12-16 | **Giver**: Any dormant god shrine | **Location**: Any Frontier dormant god shrine

**Trigger**: Completing MQ-05. The player must complete at least one god recall quest chain (GQ-01 through GQ-04) to advance.

**Objectives**:
1. Discover a dormant god's shrine in the Frontier (any of the four)
2. Complete the shrine's approach challenge (see individual GQ entries)
3. Choose an emotion (joy/fury/sorrow/awe) and recall the god using a potency 3+ fragment of that emotion
4. Witness the god's transformation

**Rewards**: Determined by which god is recalled and which emotion is chosen (see God Recall Quests section). All recalls grant: +15 vibrancy to the god's zone, the god's passive world effect and player buff, and subclass unlock (first recall only — see [progression.md](../design/progression.md)).

**Completion Dialogue**: Varies by god and emotion (see [dormant-gods.md](../world/dormant-gods.md) and [dialogue-bank.md](dialogue-bank.md)).

**Failure Conditions**: None (the player can always find or collect the required fragment).

**Unlocks**: MQ-07 (after at least 1 god recalled). MQ-07 also requires completing SQ-05.

**Dependencies**: MQ-05, at least one GQ chain completed

---

### MQ-07: The Curator's Endgame

**Act**: II (Climax) | **Level**: 16-20 | **Giver**: Callum (automatic event) | **Location**: Village Hub — Elder's House

**Trigger**: After recalling at least 1 god AND completing SQ-05, Callum sends word that he's discovered the Preservers' true plan.

**Objectives**:
1. Return to the Village Hub and speak with Callum at the Elder's House
2. Learn that the Curator has found the First Memory and intends to crystallize it (freezing the world permanently)
3. Speak with Aric (Preserver scout encountered during the conversation) who confirms the plan and reveals the Preserver Fortress location in the Undrawn Peaks
4. Recall at least 2 total gods (if only 1 recalled, must recall a second before proceeding)
5. Return to Callum to receive the expedition plan

**Rewards**: 500 gold, High Potion x5 (C-HP-03), Mana Surge x3 (C-SP-03)

**Completion Dialogue**:
- Callum: "The First Memory. The original seed that started everything. If the Curator crystallizes it, the world doesn't just stop growing — it stops being a world. It becomes a museum. Beautiful. Perfect. Dead. You need to reach it first. The fortress is in the Undrawn Peaks — through the Sketch. It's unfinished land out there. You'll have to remember it into existence as you go."

**Failure Conditions**: None.

**Unlocks**: MQ-08

**Dependencies**: MQ-06, SQ-05 completed, at least 2 god recalls total

---

### MQ-08: Through the Sketch

**Act**: III | **Level**: 20-24 | **Giver**: Callum | **Location**: The Sketch — accessed from Frontier zone edges

**Trigger**: Completing MQ-07.

**Objectives**:
1. Enter the Sketch from any Frontier zone's outer boundary
2. Navigate the Half-Drawn Forest by broadcasting memory fragments to solidify the terrain (3 broadcasts required, any fragment potency 2+)
3. Cross the Luminous Wastes by following the faint Resonance Stone trail (5 stones must be activated in sequence)
4. Reach the Undrawn Peaks zone boundary
5. Survive at least 2 Sketch enemy encounters (Sketch Phantoms, Wireframe Drakes)
6. Broadcast a potency 3+ fragment at the Crystalline Fortress Gate to make the entrance solid enough to enter

**Rewards**: 400 gold, Sketchweave Cloak (A-13, found in Half-Drawn Forest as a Living Sketch reward)

**Completion Dialogue**:
- Narrator: "The fortress shimmers into focus before you. Crystal walls catch light that shouldn't exist this far from the settled world. The Preservers built this place at the edge of reality itself — where the world hasn't decided what it wants to be yet. Inside, the First Memory waits. And so does the Curator."

**Failure Conditions**: None (the player always has enough fragments from normal gameplay to complete the broadcasts).

**Unlocks**: MQ-09

**Dependencies**: MQ-07

---

### MQ-09: The Preserver Fortress

**Act**: III | **Level**: 24-28 | **Giver**: Automatic | **Location**: Preserver Fortress (3 floors)

**Trigger**: Completing MQ-08 (entering the fortress).

**Objectives**:
1. Navigate Preserver Fortress Floor 1: Crystal Gallery
   - Defeat or avoid 3 Preserver agent patrols
   - Solve the resonance puzzle (broadcast matching emotion fragments into 3 crystal receptacles to open the inner door)
   - Find the Phoenix Feather (C-SP-10) in F1's hidden alcove
2. Navigate Preserver Fortress Floor 2: Archive of Perfection
   - Witness the frozen perfect moments on display (narrative vignettes, no combat)
   - Collect the Curator's Grief (MF-09, sorrow/dark/5) from the central archive pedestal
   - Defeat the Preserver Captain boss guarding the F2-F3 stairway
3. Navigate Preserver Fortress Floor 3: First Memory Chamber
   - Confront the Curator in the final dialogue sequence (see [act3-script.md](act3-script.md), Scene 10)
   - The Curator's confrontation is resolved through dialogue, not combat — the player uses recalled god arguments and collected memories to challenge the Curator's philosophy
   - If the player has the Curator's Doubt (K-13, from Prisma's "The Many-Colored Truth"), an additional dialogue option shortens the encounter
   - Collect the First Memory (MF-10, calm/neutral/5)

**Rewards**: Curator's Grief (MF-09), The First Memory (MF-10), 800 gold, Memory-Woven Plate (A-14, found in Depths L5 treasure chest — accessible via a shortcut from the Fortress basement)

**Completion Dialogue**:
- The Curator: "You've walked through my gallery. You've seen what perfection looks like. And you still choose... change?"
- Player: "Change isn't the enemy of beauty. It's the source of it."
- The Curator: "Then show me. Remix the First Memory. Show me what comes after perfection."

**Failure Conditions**: If the player is defeated by the Preserver Captain, they respawn at F2's entrance with full HP/SP.

**Unlocks**: MQ-10

**Dependencies**: MQ-08

---

### MQ-10: The First Memory Remix

**Act**: III (Finale) | **Level**: 28-30 | **Giver**: Automatic | **Location**: Preserver Fortress — First Memory Chamber

**Trigger**: Completing MQ-09 (acquiring the First Memory).

**Objectives**:
1. Use the Remix Table in the First Memory Chamber to combine the First Memory (MF-10) with any player-held fragment
2. Create World's New Dawn (MF-11, joy/light/5)
3. Broadcast World's New Dawn at the chamber's central Resonance Stone
4. Watch the Endgame Bloom: all zones jump to vibrancy 95, all recalled gods fully awaken, the world transforms
5. View the epilogue sequence: the Preservers become archivists (not jailers), Lira is unfrozen, the world's edge sketches new land into existence

**Rewards**: World's New Dawn (MF-11), game completion, New Game+ unlocked

**Completion Dialogue**:
- Lira (unfrozen, blinking): "I... I can feel it. The whole world, singing. What did you do?"
- Player: "I reminded it what it's for."
- Callum: "The edge... look at the edge. It's still going. Still growing. You didn't finish the world. You taught it how to finish itself."

**Failure Conditions**: None (the remix always succeeds).

**Unlocks**: New Game+ (retain all fragments, equipment, and god recall states; enemies scale to higher levels; new dialogue options reference the first playthrough)

**Dependencies**: MQ-09

---

### Main Quest Dependency Chain

```
MQ-01 → MQ-02 → MQ-03 → MQ-04 → MQ-05 → MQ-06 → MQ-07 → MQ-08 → MQ-09 → MQ-10
                                      ↓         ↑              ↑
                                    GQ-01-04   SQ-05          (2+ gods recalled)
```

---

## Side Quests

Side quests are optional content tied to NPC relationships, exploration, and memory broadcasting. They provide gold, items, fragments, and world-enrichment. Completing side quests is never required for the main quest chain, but they significantly enhance the player's power and world vibrancy.

---

### SQ-01: The Memorial Garden

**Act**: I | **Level**: 2-4 | **Giver**: Maren (shopkeeper) | **Location**: Village Hub — General Shop

**Trigger**: Completing MQ-02. Maren mentions the Memorial Garden looks "dimmer than it used to."

**Objectives**:
1. Speak with Maren at the General Shop (18, 16) about the garden's fading
2. Broadcast 3 memory fragments (any type, any potency) into the Memorial Garden's three Resonance Stones
3. Return to Maren and show her the blooming garden

**Rewards**: 120 gold, Minor Potion x5 (C-HP-01), Mana Drop x3 (C-SP-01)

**Completion Dialogue**:
- Maren: "Oh! Oh, look at that. The flowers are actually... they're glowing! I haven't seen the garden like this since I was a girl. Thank you, Architect. The village needed this. I needed this."

**Failure Conditions**: None.

**Unlocks**: Maren's shop gains one additional Tier 1 item in stock (Smoke Bomb, C-SP-05, if not already available).

**Dependencies**: MQ-02

---

### SQ-02: The Windmill Mystery

**Act**: I | **Level**: 3-5 | **Giver**: Heartfield Hamlet farmer NPC | **Location**: Heartfield — Heartfield Hamlet (15, 15)

**Trigger**: Completing MQ-03. A farmer mentions the Old Windmill has been "groaning at night."

**Objectives**:
1. Speak with the farmer at Heartfield Hamlet (15, 15)
2. Travel to the Old Windmill (30, 8)
3. Enter the windmill and defeat the Dissolved Memory encounter inside (2x Meadow Sprite + 1x Forest Wisp, buffed to level 4-5)
4. Collect the memory fragment sealed in the windmill's grinding stone
5. Return to the farmer with the fragment

**Rewards**: 100 gold, Windmill Blade (W-DG-03, ATK +13, +10% critical hit), 1 unnamed fragment (awe/wind/2)

**Completion Dialogue**:
- Farmer: "The groaning's stopped. Whatever was caught in there... you freed it. That blade was stuck in the grinding stone — been there since before my grandparents settled here. Feels right that you should have it."

**Failure Conditions**: None.

**Dependencies**: MQ-03

---

### SQ-03: The Woodcutter's Dilemma

**Act**: I | **Level**: 4-6 | **Giver**: Woodcutter NPC | **Location**: Ambergrove — Woodcutter's Camp (10, 30)

**Trigger**: Completing MQ-03. The woodcutter reports trees growing faster than they can map.

**Objectives**:
1. Speak with the woodcutter at Woodcutter's Camp (10, 30)
2. Investigate 3 rapid-growth sites in Ambergrove (marked on map after speaking to the woodcutter)
3. At each site, broadcast a memory fragment to stabilize the growth (any fragment, any potency)
4. Defeat the Thornback Beetle nest at the third site (3x Thornback Beetle)
5. Return to the woodcutter

**Rewards**: 150 gold, Forest Weave (A-05, DEF +12, +10% evasion, Rogue: +15%), 1 unnamed fragment (calm/earth/2)

**Completion Dialogue**:
- Woodcutter: "The forest's calmer now. Still growing, but... peacefully. Like it's breathing instead of gasping. This weave — made it from the Ambergrove bark. Tougher than leather and lighter than cloth. Should serve you well out there."

**Failure Conditions**: None.

**Dependencies**: MQ-03

---

### SQ-04: Upstream Secrets

**Act**: I | **Level**: 5-7 | **Giver**: Fisher NPC | **Location**: Millbrook — Fisher's Rest (30, 30)

**Trigger**: Completing MQ-03. A fisher reports strange lights behind the Upstream Falls.

**Objectives**:
1. Speak with the fisher at Fisher's Rest (30, 30) in Millbrook
2. Travel to Upstream Falls (8, 5)
3. Find the hidden cave behind the waterfall (walk through the falls at tile (8, 6))
4. Navigate the dissolved memory grotto (3 rooms, light puzzle: broadcast fragments into 2 Resonance Stones to illuminate the path)
5. Collect the 2 high-potency fragments at the grotto's end
6. Return to the fisher

**Rewards**: 180 gold, 2 unnamed fragments (sorrow/water/3 and awe/water/3), Hearthstone Staff (W-ST-03, INT +14, Sorrowful Cleanse also heals INT x 0.3)

**Completion Dialogue**:
- Fisher: "You went behind the falls? And came back? The last person who tried that was my grandmother. She said the cave sang to her. Glad to know it's still singing."

**Failure Conditions**: None.

**Dependencies**: MQ-03

---

### SQ-05: Aric's Doubt

**Act**: I-II | **Level**: 8-12 | **Giver**: Aric (Preserver scout) | **Location**: Sunridge — Preserver Outpost (32, 15)

**Trigger**: After MQ-04 (Lira's freezing). Aric appears near the Sunridge Preserver Outpost and initiates conversation.

**Objectives**:
1. Speak with Aric at the Sunridge Preserver Outpost perimeter (32, 15)
2. Listen to Aric's confession: he's questioning the Preservers' mission after witnessing Lira's freezing
3. Collect 3 memory fragments of different emotions (any element, potency 2+) and show them to Aric
4. Return to Aric after at least 1 in-game day has passed (he needs time to process)
5. Aric shares Preserver intelligence: the Curator's location and the fortress's general direction

**Rewards**: 250 gold, Stasis Breaker x5 (C-SC-04), Curator's Manifesto (K-06), 1 unnamed fragment (sorrow/dark/3)

**Completion Dialogue**:
- Aric: "I joined the Preservers because I was afraid of losing things I loved. The Curator promised that nothing would ever change. But watching that woman freeze... that wasn't preservation. That was theft. Take this manifesto. Understand what the Curator believes. Then decide for yourself whether they're right."

**Failure Conditions**: None.

**Unlocks**: Required for MQ-07 trigger (combined with at least 1 god recall).

**Dependencies**: MQ-04

---

### SQ-06: The Marsh Hermit's Request

**Act**: II | **Level**: 11-14 | **Giver**: Wynn | **Location**: Shimmer Marsh — Marsh Hermit's Hut (12, 15)

**Trigger**: Completing MQ-05 and entering Shimmer Marsh.

**Objectives**:
1. Speak with Wynn at the Marsh Hermit's Hut (12, 15)
2. Collect 3 water-element memory fragments from Shimmer Marsh (any emotion, potency 2+)
3. Broadcast the fragments into 3 dormant marsh Resonance Stones (marked by Wynn on the map)
4. Defeat the Mire Crawler ambush at the third stone (2x Mire Crawler + 1x Echo Toad)
5. Return to Wynn with the data (he's been measuring vibrancy changes)

**Rewards**: 300 gold, Hermit's Robe (A-07, DEF +14, +20% SP regen from Defend, Cleric/Mage: +25%), Marsh Hermit's Crook (W-ST-05, INT +26, SP cost of all heals reduced by 15%)

**Completion Dialogue**:
- Wynn: "Fascinating. The vibrancy readings are exactly as I hypothesized — the marsh remembers itself in waves, not lines. Each broadcast creates a ripple. Here, take this robe and crook. I made them from marsh-woven fiber. They'll serve you better than they serve an old hermit who never leaves his hut."

**Failure Conditions**: None.

**Dependencies**: MQ-05

---

### SQ-07: Petra's Ridgewalkers

**Act**: II | **Level**: 12-15 | **Giver**: Petra | **Location**: Hollow Ridge — Ridgewalker Camp (15, 25)

**Trigger**: Completing MQ-05 and visiting Ridgewalker Camp.

**Objectives**:
1. Speak with Petra at Ridgewalker Camp (15, 25)
2. Escort a Ridgewalker scouting party through the Shattered Pass approach (3 patrol encounters: each is 2x Preserver Scout)
3. Reach the Shattered Pass entrance (35, 30) and assess the stagnation zone
4. Report back to Petra with your findings

**Rewards**: 350 gold, Ridgewalker's Coat (A-08, DEF +20, +10% ATK, wind resistance +15%), Kinetic Boots (K-05)

**Completion Dialogue**:
- Petra: "So the pass is fully crystallized. Can't push through without breaking the stasis. But now we know what we're dealing with. Take these boots — I had them made for the Spire approach, but you'll need them more than I will. And this coat — Ridgewalker-weave. Keeps you warm, keeps you alive."

**Failure Conditions**: If all escort NPCs are defeated during the patrol encounters, the quest resets to objective 2 (Petra sends another party).

**Dependencies**: MQ-05

---

### SQ-08: Solen's Light Studies

**Act**: II | **Level**: 13-16 | **Giver**: Solen | **Location**: Flickerveil — Flickering Village (35, 30)

**Trigger**: Completing MQ-05 and visiting Flickerveil.

**Objectives**:
1. Speak with Solen at the Flickering Village (35, 30)
2. Investigate 4 flickering anomalies in Flickerveil (marked on map; at each one, observe the flicker pattern for 5 seconds)
3. Broadcast a light-element fragment at the strongest anomaly (near the Resonance Archive at (10, 10))
4. Defeat the Preserver patrol guarding the archive perimeter (2x Preserver Agent + 1x Crystal Sentinel)
5. Return to Solen with the observational data

**Rewards**: 350 gold, Light Lens (K-04), Prism Wand (W-WD-04, INT +21, Eureka Moment always hits weakness), 1 unnamed fragment (awe/light/3)

**Completion Dialogue**:
- Solen: "The flickering is the light trying to choose between what the Preservers want it to be and what it wants to become. This lens — I've polished it my whole life, waiting for someone who could use it. The grove where Luminos sleeps... you'll need it to approach without going blind."

**Failure Conditions**: None.

**Dependencies**: MQ-05

---

### SQ-09: The Listener's Camp

**Act**: II | **Level**: 13-16 | **Giver**: Audiomancer NPC | **Location**: Resonance Fields — Listener's Camp (10, 35)

**Trigger**: Completing MQ-05 and visiting Resonance Fields.

**Objectives**:
1. Speak with the lead audiomancer at the Listener's Camp (10, 35)
2. Learn about the Amphitheater's humming and the Resonance Stones' behavior
3. Harmonize 3 specific Resonance Stones along the path to the Amphitheater (broadcast a wind-element or neutral fragment into each)
4. Reach the Amphitheater entrance (25, 25) — the path opens once the stones are harmonized
5. Return to the Listener's Camp and report

**Rewards**: 300 gold, Resonance Tuner (W-WD-05, INT +27, Memory Wave AoE includes back-row), 1 unnamed fragment (awe/wind/3)

**Completion Dialogue**:
- Audiomancer: "You harmonized the approach stones. We've been trying for decades — decades! The hum is clearer now. Resonance is closer to waking. This tuner was calibrated to the Amphitheater's frequency. In your hands, it'll amplify more than sound."

**Failure Conditions**: None.

**Dependencies**: MQ-05

---

### SQ-10: The Depths Expedition

**Act**: II | **Level**: 14-18 | **Giver**: Callum | **Location**: Village Hub — Elder's House (via letter after MQ-05)

**Trigger**: After completing MQ-05 and reaching level 14+. Callum sends a letter about the Depths entrance he's discovered.

**Objectives**:
1. Speak with Callum at the Elder's House about the Depths
2. Travel to the Depths entrance in the Village Hub Memorial Garden (hidden passage at (8, 17), revealed after MQ-05)
3. Navigate Depths Level 1 (5 rooms, see [dungeon-depths.md](../maps/dungeon-depths.md) when authored)
4. Defeat the Depths L1 floor guardian boss
5. Collect the dissolved memory fragment from the guardian's chamber
6. Return to Callum

**Rewards**: 400 gold, Frontier Guard (A-09, DEF +25, +15% stasis resistance), 2 unnamed fragments (sorrow/dark/3 and awe/neutral/3)

**Completion Dialogue**:
- Callum: "The Depths... I've read about them my entire life. The dissolved civilizations stored their densest memories underground — the things too important to scatter on the wind. What you found down there is just the beginning. There are deeper levels. More memories. And more danger."

**Failure Conditions**: None (can retry the boss if defeated).

**Dependencies**: MQ-05, player level 14+

---

### SQ-11: Torvan's Masterwork

**Act**: II-III | **Level**: 15-20 | **Giver**: Torvan (blacksmith) | **Location**: Village Hub — Blacksmith (18, 18)

**Trigger**: Village Hub vibrancy reaches 70+ (Vivid tier). Torvan mentions he's ready to forge "something worthy."

**Objectives**:
1. Speak with Torvan at the Blacksmith (18, 18)
2. Collect 3 rare materials:
   - 1 Crag Golem core (dropped by Crag Golems in Sunridge, 15% chance, or guaranteed from the Sunridge elite encounter)
   - 1 Crystal Shard (dropped by Preserver Agents, 10% chance, or guaranteed from any Preserver Captain)
   - 1 Dissolved Metal (found in Depths Level 2 treasure chest)
3. Bring the materials to Torvan
4. Wait 1 in-game day for Torvan to forge (can leave and return)
5. Collect the masterwork weapon (class-specific)

**Rewards**: 1 class-specific Tier 3 weapon (the player chooses which class weapon to forge):
- Knight: Frontier Greatsword (W-SW-06, ATK +35, +15% vs. Preserver)
- Cleric: Luminary's Scepter (W-ST-06, INT +33, Group Mending +20%)
- Mage: Arcane Catalyst (W-WD-06, INT +34, Elemental Storm +20%)
- Rogue: Phantom Edge (W-DG-06, ATK +32, Vanishing Act 3 turns)

**Completion Dialogue**:
- Torvan: "There. My finest work. Those materials you brought — I've never worked with anything like them. The Crag Golem's core gives it weight, the crystal gives it edge, and the dissolved metal... it hums. Like the weapon remembers what it's supposed to be."

**Failure Conditions**: None (materials are farmable).

**Dependencies**: Village Hub vibrancy 70+

---

### SQ-12: Ren's Dream Visions

**Act**: II-III | **Level**: 16-22 | **Giver**: Ren (innkeeper) | **Location**: Village Hub — Inn: The Bright Hearth (20, 14)

**Trigger**: After completing MQ-05, resting at the inn triggers Dissolved dream sequences. After the 3rd rest, Ren comments on the player's restless sleep.

**Objectives**:
1. Speak with Ren at the Inn (20, 14) about the dream visions
2. Rest at the inn 5 total times (including prior rests), watching a unique dissolved civilization dream each time
3. After the 5th dream, a dream fragment materializes in the player's inventory
4. Broadcast the dream fragment at the Inn's hearth Resonance Stone (hidden behind the fireplace, revealed after dream 5)
5. Witness the hearth stone activate — a permanent lore projection showing highlights of dissolved civilizations

**Rewards**: 250 gold, Memory Incense x3 (C-BF-05, grants Inspired +20% all stats), 1 unnamed fragment (calm/neutral/4)

**Completion Dialogue**:
- Ren: "I always knew there was something behind that fireplace. When I was a child, I'd press my ear against the stones and hear... humming. I think it was waiting for the right dreams. Yours."

**Failure Conditions**: None.

**Dependencies**: MQ-05, 5 inn rests

---

### SQ-13: The Dissolved Choir's Instruments

**Act**: II-III | **Level**: 18-24 | **Giver**: Audiomancer NPC | **Location**: Resonance Fields — Listener's Camp (10, 35)

**Trigger**: After completing SQ-09 and recalling Resonance (any emotion via GQ-01).

**Objectives**:
1. Return to the Listener's Camp after Resonance's recall
2. The lead audiomancer reports that the recalled god's energy has awakened hidden instruments in the Resonance Stones
3. Find 5 Choir Instruments scattered across the game world (hidden Resonance Stones in: Heartfield Old Windmill, Ambergrove Hearthstone Circle, Millbrook Upstream Falls, Sunridge Wind Shrine, Village Hub Central Square Fountain)
4. At each location, interact with the activated Resonance Stone to collect the instrument (no combat required, but reaching some requires navigating enemies)
5. Bring all 5 instruments to the Amphitheater (25, 25)

**Rewards**: 500 gold, Broadcast Amplifier x3 (C-SP-08), 1 unnamed fragment (awe/wind/4)

**Completion Dialogue**:
- Audiomancer: "Five instruments. Five voices of the Choir, found after all this time. When you placed them in the Amphitheater, I heard it — just for a moment — the song they sang at the end. It wasn't sad. It was... proud. Like parents watching their child take a first step."

**Failure Conditions**: None.

**Dependencies**: SQ-09, GQ-01 completed (any emotion)

---

### SQ-14: The Stagnation Breaker

**Act**: III | **Level**: 22-26 | **Giver**: Callum | **Location**: Village Hub — Elder's House

**Trigger**: After completing MQ-07. Callum has been researching a way to free Lira.

**Objectives**:
1. Speak with Callum at the Elder's House about freeing Lira
2. Callum's research indicates that broadcasting a potency 4+ joy fragment directly into Lira's frozen form at the Stagnation Clearing might work
3. Travel to Heartfield Stagnation Clearing (35, 30)
4. Defeat the Preserver reinforcements guarding Lira's frozen form (2x Preserver Agent + 1x Preserver Captain)
5. Broadcast a potency 4+ joy fragment into Lira's frozen form
6. The stasis cracks but doesn't fully break — Lira partially awakens and speaks a single message before refreezing
7. Return to Callum with the message: "The First Memory. It's the key to everything."

**Rewards**: 500 gold, Elixir x2 (C-HP-04), 1 unnamed fragment (fury/light/4)

**Completion Dialogue**:
- Callum: "She spoke? She actually... 'The First Memory is the key.' Then that confirms it. The Curator isn't just preserving the world — they're using the First Memory as the anchor for all stasis. Free the First Memory, and every frozen thing in the world unfreezes. Including Lira."

**Failure Conditions**: None (Lira's partial awakening always triggers; the message provides narrative motivation for MQ-08+).

**Dependencies**: MQ-07

---

### Side Quest Dependency Summary

| Quest | Depends On | Unlocked By |
|-------|-----------|-------------|
| SQ-01 | MQ-02 | Completing first broadcast tutorial |
| SQ-02 | MQ-03 | Visiting Heartfield |
| SQ-03 | MQ-03 | Visiting Ambergrove |
| SQ-04 | MQ-03 | Visiting Millbrook |
| SQ-05 | MQ-04 | Lira's freezing event |
| SQ-06 | MQ-05 | Entering Shimmer Marsh |
| SQ-07 | MQ-05 | Visiting Ridgewalker Camp |
| SQ-08 | MQ-05 | Visiting Flickerveil |
| SQ-09 | MQ-05 | Visiting Resonance Fields |
| SQ-10 | MQ-05, Lv14+ | Callum's letter about the Depths |
| SQ-11 | Village vibrancy 70+ | Torvan's masterwork offer |
| SQ-12 | MQ-05, 5 inn rests | Dream sequence accumulation |
| SQ-13 | SQ-09, GQ-01 | Post-recall Resonance Stone activation |
| SQ-14 | MQ-07 | Callum's research into freeing Lira |

---

## God Recall Quest Chains

Each dormant god has a quest chain that guides the player from discovery to recall. The base chain (GQ-##) covers approaching the shrine and performing the recall. After recall, the god's chosen emotion unlocks 2 emotion-specific side quests (documented in [dormant-gods.md](../world/dormant-gods.md) and summarized here with quest structure).

All god recall quests become available after MQ-05. The player can complete them in any order. The first god recalled also determines the player's subclass branch (see [progression.md](../design/progression.md)).

---

### GQ-01: The Song Dormant (Resonance)

**Act**: II | **Level**: 12-16 | **Giver**: Audiomancer NPCs | **Location**: Resonance Fields

**Trigger**: Completing MQ-05 and SQ-09 (harmonizing the approach stones).

**Objectives**:
1. Enter the Amphitheater (25, 25) in Resonance Fields
2. Witness the recall vision: fragments of the Choir of the First Dawn's final performance (30-second cinematic)
3. Collect the Choir's Final Note (MF-05, awe/wind/4) from the vision
4. Choose an emotion pedestal: Joy (sun), Fury (flame), Sorrow (raindrop), or Awe (star)
5. Place a potency 3+ fragment matching the chosen emotion onto the pedestal
6. Witness Resonance's transformation into its new form

**Rewards**: MF-05 (collected during vision), +15 vibrancy to Resonance Fields, god's passive world effect + player buff (see [dormant-gods.md](../world/dormant-gods.md)), subclass unlock (if first recall)

**Completion Dialogue**: Varies by emotion choice:
- **Joy (Cantara)**: "I am Cantara — the Living Song! Can you hear it? The world is humming along. Let's make it a symphony."
- **Fury (Tempestus)**: "I am Tempestus — the Thundersong! The silence ends. Every crystal that dares to muffle the world's voice will shatter."
- **Sorrow (Tacet)**: Words appear in glowing text: "I am Tacet. The Necessary Silence. Listen to what you cannot hear. That is where truth lives."
- **Awe (Harmonia)**: "I am Harmonia — the Perfect Chord. Every note the Choir ever sang lives in me now. In balance. In wonder."

**Failure Conditions**: None.

**Unlocks**: 2 recall-specific side quests (see below)

**Dependencies**: MQ-05, SQ-09

#### Recall-Specific Quests (Resonance)

**Joy → "The Unfinished Symphony" + "Cantara's Troubadours"**

*GQ-01-J1: The Unfinished Symphony*
- **Giver**: Cantara | **Level**: 14-18
- **Objectives**: Find 5 musical memory fragments in specific Resonance Stone locations (1 per Settled Lands sub-map + 1 in Village Hub). Return all 5 to the Amphitheater.
- **Rewards**: 500 gold, 1 fragment (joy/wind/5), Cantara's Baton (K-07, broadcast vibrancy +2)

*GQ-01-J2: Cantara's Troubadours*
- **Giver**: Cantara | **Level**: 16-20
- **Objectives**: Recruit 3 musician NPCs from Heartfield, Millbrook, and Ridgewalker Camp. Convince each via dialogue (no combat). Form the traveling troupe.
- **Rewards**: 300 gold, 1 fragment (joy/neutral/3), permanent +5% XP in zones the troupe visits

**Fury → "The Storm Wall" + "The Shattered Silence"**

*GQ-01-F1: The Storm Wall*
- **Giver**: Tempestus | **Level**: 14-18
- **Objectives**: Choose a settlement to protect (Ridgewalker Camp or Flickering Village). Broadcast 3 fury-type fragments into 3 perimeter Resonance Stones. Settlement becomes Preserver-proof; zone vibrancy floor +10.
- **Rewards**: 400 gold, 1 fragment (fury/wind/4), Storm Aegis (ACC-01, +10 DEF, lightning immunity)

*GQ-01-F2: The Shattered Silence*
- **Giver**: Tempestus | **Level**: 18-22
- **Objectives**: Receive Thunderstone (K-15). Place it at the Preserver Cathedral base. Fight 3x Preserver Agent + 1x Preserver Captain (weakened by storm). Destroy the Cathedral.
- **Rewards**: 600 gold, 2 fragments (fury/4 + awe/4), Conductor's Rod (weapon: staff, ATK +35, 20% stun chance)
- **Failure Conditions**: If defeated, can retry; Tempestus maintains the storm.

**Sorrow → "The Silent Path" + "Voices in the Void"**

*GQ-01-S1: The Silent Path*
- **Giver**: Tacet | **Level**: 14-18
- **Objectives**: Find and walk 3 Silent Paths (Shimmer Marsh Stagnation Bog, Hollow Ridge Shattered Pass, Resonance Fields Cathedral perimeter). Each path is invisible until within 3 tiles.
- **Rewards**: 350 gold, 1 fragment (sorrow/wind/4), Silent Tread (ACC-02, encounter rate -50%)

*GQ-01-S2: Voices in the Void*
- **Giver**: Tacet | **Level**: 18-22
- **Objectives**: Visit 4 specific Resonance Stones (1 per Frontier zone). Listen to the silence at each. Witness dissolved civilization ghosts and collect their memories.
- **Rewards**: 4 fragments (calm/5 each), 500 gold, Whisper Robe (armor: DEF +15, +30% status resistance)

**Awe → "The Harmonist's Attunement" + "The Accord"**

*GQ-01-A1: The Harmonist's Attunement*
- **Giver**: Harmonia | **Level**: 14-18
- **Objectives**: Tune 7 Resonance Stones across the world (Village Hub fountain, Heartfield Windmill, Ambergrove Hearthstone Circle, Millbrook Bridge, Shimmer Marsh Verdance's Hollow, Hollow Ridge Wind Shrine, Flickerveil Archive). Each requires a biome-matched element fragment.
- **Rewards**: 500 gold, 1 fragment (awe/neutral/5), Harmonia's Tuning Fork (K-08, doubles broadcast radius), global +5 vibrancy pulse

*GQ-01-A2: The Accord*
- **Giver**: Harmonia | **Level**: 18-22
- **Objectives**: Find a willing Preserver agent in 2 of the 4 Frontier zones. Convince them to attend a neutral meeting at the Amphitheater. Witness the truce dialogue.
- **Rewards**: 400 gold, 1 fragment (calm/neutral/4), Accord Pendant (ACC-04, Preservers deal -15% damage). Act III impact: Fortress agents less hostile, 1 Preserver NPC switches sides.

---

### GQ-02: The Root Dormant (Verdance)

**Act**: II | **Level**: 12-16 | **Giver**: Wynn | **Location**: Shimmer Marsh

**Trigger**: Completing MQ-05 and SQ-06 (Wynn's marsh research).

**Objectives**:
1. Speak with Wynn at the Marsh Hermit's Hut (12, 15) about Verdance's Hollow
2. Clear the path to Verdance's Hollow (25, 35) by broadcasting an earth or water element fragment into the blocked root cluster at (20, 30)
3. Enter Verdance's Hollow and witness the recall vision: the Rootwalkers planting the world's first forests
4. Collect Rootwalker's Seedling (MF-06, joy/earth/4)
5. Choose an emotion and recall Verdance using a potency 3+ matching fragment
6. Witness Verdance's transformation

**Rewards**: MF-06 (collected during vision), +15 vibrancy to Shimmer Marsh, god's passive world effect + player buff

**Completion Dialogue**: Varies by emotion:
- **Joy (Floriana)**: Floriana laughs like wind through blossoming branches. "Life! Beautiful, abundant, unstoppable life! The marsh is a garden now. And so is the rest of the world, if you let me help."
- **Fury (Thornweald)**: Thornweald snarls like roots cracking pavement. "The crystal-lovers froze my roots. Now my roots freeze THEM. Nothing stops growth. Nothing."
- **Sorrow (Autumnus)**: Autumnus sighs like the last warm wind before winter. "The leaves must fall so the seeds can find the soil. I am the ending that makes beginning possible."
- **Awe (Sylvanos)**: Sylvanos speaks like roots creaking. "The network remembers. Every root. Every connection. The world is not separate places — it is one living system."

**Failure Conditions**: None.

**Unlocks**: 2 recall-specific side quests

**Dependencies**: MQ-05, SQ-06

#### Recall-Specific Quests (Verdance)

**Joy → "The Rootway" + "Floriana's Feast"**

*GQ-02-J1: The Rootway*
- **Giver**: Floriana | **Level**: 14-18
- **Objectives**: Broadcast earth-type fragments into 4 root nodes (Heartfield, Ambergrove, Millbrook, Sunridge). Each reactivates a section of the Rootwalker tunnel network.
- **Rewards**: 500 gold, 1 fragment (joy/earth/4), Rootway fast-travel system (permanent)

*GQ-02-J2: Floriana's Feast*
- **Giver**: Floriana | **Level**: 16-20
- **Objectives**: Broadcast 3 earth + 2 joy fragments into Village Hub locations. Convince 5 NPCs from different settlements to attend. Witness the harvest festival cinematic.
- **Rewards**: 400 gold, 1 fragment (joy/earth/5), Village Hub +5 vibrancy, Festival Trader NPC, all shops gain 1 rare restock

**Fury → "The Reclamation" + "The Living Wall"**

*GQ-02-F1: The Reclamation*
- **Giver**: Thornweald | **Level**: 14-18
- **Objectives**: Choose a Preserver-held zone (Sunridge Outpost, Shattered Pass, or Resonance Archive). Broadcast 3 earth+fury fragments. Fight alongside vine summons vs. Preserver agents. Zone cleared, vibrancy +15.
- **Rewards**: 500 gold, 1 fragment (fury/earth/4), Thornweald's Gauntlet (ACC-05, +10 ATK, thorn retaliation 30%)

*GQ-02-F2: The Living Wall*
- **Giver**: Thornweald | **Level**: 18-22
- **Objectives**: Collect 5 earth-type fragments. Broadcast at 5 Frontier-Sketch boundary points. Thorn wall grows, blocking Preserver cross-zone movement.
- **Rewards**: 400 gold, 1 fragment (earth/neutral/3), permanent -1 enemy from Preserver patrols

**Sorrow → "The Composting" + "The Last Rootwalker"**

*GQ-02-S1: The Composting*
- **Giver**: Autumnus | **Level**: 14-18
- **Objectives**: Find 3 burdened Resonance Stones (Depths Levels 2, 3, 4). Broadcast sorrow-type fragments to "compost" dense old memories. Stones become rest points.
- **Rewards**: 6 fragments (potency 3, random emotions), 400 gold, Autumnus's Mantle (armor: DEF +20, +15% fire/ice resistance, -10% SP costs)

*GQ-02-S2: The Last Rootwalker*
- **Giver**: Autumnus | **Level**: 18-22
- **Objectives**: Descend through hidden root passage in Verdance's Hollow. Dialogue-only encounter with the Last Rootwalker memory echo. Broadcast a sorrow fragment to complete their dissolution.
- **Rewards**: 1 fragment (calm/earth/5), 500 gold, Rootwalker's Seed (K-09, plant at any zone center for +5 vibrancy, single use)

**Awe → "The Mycorrhizal Map" + "The Patient Cure"**

*GQ-02-A1: The Mycorrhizal Map*
- **Giver**: Sylvanos | **Level**: 14-18
- **Objectives**: Activate root nodes at 6 locations (Village Hub Memorial Garden, Heartfield Windmill, Ambergrove Hearthstone Circle, Millbrook Upstream Falls, Shimmer Marsh Verdance's Hollow, Flickerveil Resonance Archive). Earth-type fragment at each.
- **Rewards**: 500 gold, 1 fragment (awe/earth/5), Rootmap Pendant (ACC-06, +15% gold), permanent root network on world map, vibrancy pulse ability (+1 all zones per game-hour)

*GQ-02-A2: The Patient Cure*
- **Giver**: Sylvanos | **Level**: 18-22
- **Objectives**: Visit 3 stagnation zones. Broadcast earth+calm fragments into the ground (not crystal focal points). Wait 30 in-game minutes each. Roots crack crystals peacefully.
- **Rewards**: 3 fragments (potency 4, 1 per zone), 400 gold, Sylvanos's Blessing (permanent passive: +15% healing received)

---

### GQ-03: The Light Dormant (Luminos)

**Act**: II | **Level**: 12-16 | **Giver**: Solen | **Location**: Flickerveil

**Trigger**: Completing MQ-05 and SQ-08 (receiving the Light Lens from Solen).

**Objectives**:
1. Equip the Light Lens (K-04) and travel to Luminos Grove (20, 20) in Flickerveil
2. Use the Light Lens to focus the scattered light beams into a coherent path
3. Approach the dormant prism at the grove's center
4. Witness the recall vision: the Radiant Lens discovering how to focus light into truth
5. Collect Radiant Lens Theorem (MF-07, awe/light/4)
6. Choose an emotion and recall Luminos using a potency 3+ matching fragment
7. Witness Luminos's transformation

**Rewards**: MF-07 (collected during vision), +15 vibrancy to Flickerveil, god's passive world effect + player buff

**Completion Dialogue**: Varies by emotion:
- **Joy (Solara)**: Solara smiles, and the color temperature shifts to warm gold. "Dawn. Every dawn is a promise that the dark was temporary. I am that promise."
- **Fury (Pyralis)**: Pyralis speaks like focused sunlight. "What hides in shadow rots. I am the burning eye. Nothing will stay hidden from us."
- **Sorrow (Vesperis)**: Vesperis speaks like a lullaby. "Not every light needs to blaze. Some lights are kindest when they soften. I am the twilight between."
- **Awe (Prisma)**: Prisma harmonizes with herself. "One light enters the prism. Many colors emerge. Both are true."

**Failure Conditions**: None.

**Unlocks**: 2 recall-specific side quests

**Dependencies**: MQ-05, SQ-08

#### Recall-Specific Quests (Luminos)

**Joy → "The First Sunrise" + "Solara's Lanterns"**

*GQ-03-J1: The First Sunrise*
- **Giver**: Solara | **Level**: 14-18
- **Objectives**: Climb to the Apex (20, 5) in Undrawn Peaks. Broadcast a joy-type fragment. Create the sunrise beacon (visible from all outdoor zones, reduces vibrancy decay by 1/tick globally).
- **Rewards**: 600 gold, 1 fragment (joy/light/5), Sunstone Ring (ACC-07, +10 INT, +10 AGI, first attack each combat +25% light damage)

*GQ-03-J2: Solara's Lanterns*
- **Giver**: Solara | **Level**: 16-20
- **Objectives**: Light lanterns in 5 settlements (Village Hub, Heartfield, Millbrook, Ridgewalker Camp, Flickering Village) by broadcasting light-element fragments.
- **Rewards**: 400 gold, 5 light-element fragments (potency 2), Lantern Keeper's Cloak (ACC-09, DEF +12, immune to Blind), each shop gains 1 new rare item

**Fury → "The Burning Archive" + "Shadows of the Curator"**

*GQ-03-F1: The Burning Archive*
- **Giver**: Pyralis | **Level**: 14-18
- **Objectives**: Assault the Resonance Archive (10, 10) in Flickerveil. Fight weakened Preserver garrison (3 agents, -20% stats). Clear and claim the archive as a permanent lore library.
- **Rewards**: 5 fragments (potency 3-5 mix), 500 gold, Lens of Truth (ACC-08, +15 INT, enemy HP bars visible, crit +20%)

*GQ-03-F2: Shadows of the Curator*
- **Giver**: Pyralis | **Level**: 18-22
- **Objectives**: Expose 3 shadow agents (illusory Preservers) in Shimmer Marsh, Hollow Ridge, and Resonance Fields by broadcasting light-element fragments at each.
- **Rewards**: 400 gold, 1 fragment (fury/light/4), early access to Depths L5 shortcut, Curator's hidden motivation revealed

**Sorrow → "The Defector" + "The Twilight Vigil"**

*GQ-03-S1: The Defector*
- **Giver**: Elyn (Preserver agent) | **Level**: 14-18
- **Objectives**: After Vesperis recall, escort Elyn from the Flickerveil garrison to Flickering Village. Survive 2 Preserver ambush encounters along the route.
- **Rewards**: 400 gold, 1 fragment (sorrow/light/4), Elyn's Intelligence Report (K-14, reveals Fortress F1 layout), Elyn's shop unlocked (Crystal Dust C-SP-06, Stasis Shard C-SP-07)

*GQ-03-S2: The Twilight Vigil*
- **Giver**: Vesperis | **Level**: 18-22
- **Objectives**: Hold a vigil at all 4 dormant god shrine locations. At each, broadcast a sorrow-type fragment and witness the twilight vision (30-second cinematic of the dissolved civilization's final moments).
- **Rewards**: 500 gold, 4 permanent lore entries, 1 fragment (sorrow/light/5), Vesperis's Lantern (K-10, reveals fragment emotional spectrum at Resonance Stones)

**Awe → "The Spectrum Walk" + "The Many-Colored Truth"**

*GQ-03-A1: The Spectrum Walk*
- **Giver**: Prisma | **Level**: 14-18
- **Objectives**: Visit 7 biome types (village, grassland, forest, riverside, mountain, marsh, plains). Broadcast a light-element fragment in each. Collect 7 spectrum fragments. Return to Luminos Grove.
- **Rewards**: 7 prismatic fragments (potency 3), 500 gold, Kaleidoscope Lens (ACC-03, +10 INT, +10 AGI, prismatic drop rate doubled)

*GQ-03-A2: The Many-Colored Truth*
- **Giver**: Prisma | **Level**: 18-22
- **Objectives**: Find 4 frozen perspectives in Frontier stagnation zones. Broadcast prismatic or light fragments to refract each into multiple interpretations. Seeds of doubt planted in crystal structure.
- **Rewards**: 400 gold, 4 prismatic fragments, Curator's Doubt (K-13, unique final confrontation dialogue option that removes 1 encounter phase)

---

### GQ-04: The Motion Dormant (Kinesis)

**Act**: II | **Level**: 12-16 | **Giver**: Petra | **Location**: Hollow Ridge

**Trigger**: Completing MQ-05 and SQ-07 (receiving the Kinetic Boots from Petra).

**Objectives**:
1. Equip the Kinetic Boots (K-05) and travel to Kinesis Spire (25, 10) in Hollow Ridge
2. Navigate the vibrating approach path (boots prevent knockback; without them, the player is pushed back every 3 tiles)
3. Reach the Spire's base
4. Witness the recall vision: the Peregrine Road carving the world's first mountain passes
5. Collect Peregrine's First Step (MF-08, fury/fire/4)
6. Choose an emotion and recall Kinesis using a potency 3+ matching fragment
7. Witness Kinesis's transformation

**Rewards**: MF-08 (collected during vision), +15 vibrancy to Hollow Ridge, god's passive world effect + player buff

**Completion Dialogue**: Varies by emotion:
- **Joy (Jubila)**: Jubila laughs like feet drumming a festival stage. "Move! Dance! The world is a road and every step is a celebration! Why are you standing still?"
- **Fury (Tecton)**: Tecton slams a fist. The mountain shakes. "Everything moves. Nothing resists me forever. The crystals. The Preservers. Even mountains bow."
- **Sorrow (Errantis)**: Errantis walks in a slow circle. "Every road ends. Every step fades. But the walking mattered."
- **Awe (Vortis)**: Vortis's orbiting components spell out: "EVERYTHING IS IN ORBIT. NOTHING TRULY STOPS."

**Failure Conditions**: None.

**Unlocks**: 2 recall-specific side quests

**Dependencies**: MQ-05, SQ-07

#### Recall-Specific Quests (Kinesis)

**Joy → "The Peregrine Circuit" + "The Road That Remembers"**

*GQ-04-J1: The Peregrine Circuit*
- **Giver**: Jubila | **Level**: 14-18
- **Objectives**: Run a circuit visiting 1 landmark in every zone (9 total: Village Hub → Heartfield → Ambergrove → Millbrook → Sunridge → Hollow Ridge → Shimmer Marsh → Flickerveil → Resonance Fields) without resting or fast travel.
- **Rewards**: 600 gold, 1 fragment (joy/fire/5), Peregrine Boots (ACC-10, +20 AGI, +25% move speed, immune to Slow)
- **Failure Conditions**: Using a rest point or fast travel resets progress. Can retry immediately.

*GQ-04-J2: The Road That Remembers*
- **Giver**: Jubila | **Level**: 16-20
- **Objectives**: Find and clear 5 road markers (1 per Frontier zone + 1 in Settled Lands). Broadcast a wind-element fragment at each to reveal the next road section.
- **Rewards**: 500 gold, Peregrine Road visible on all maps (+10% XP while on the road), Wayfinder's Compass (K-12, points to nearest uncollected fragment)

**Fury → "The Mountain's March" + "Tecton's Challenge"**

*GQ-04-F1: The Mountain's March*
- **Giver**: Tecton | **Level**: 14-18
- **Objectives**: Choose a zone (Shimmer Marsh, Flickerveil, or Resonance Fields). Broadcast 3 earth+fury fragments at tectonic fault points. Zone terrain reshapes: new paths, new Depths entrance, zone vibrancy +5.
- **Rewards**: 500 gold, 1 fragment (fury/earth/4), Earthshaker Hammer (ACC-11, weapon override: ATK +40, AoE +15%, Knight only)

*GQ-04-F2: Tecton's Challenge*
- **Giver**: Tecton | **Level**: 18-22
- **Objectives**: Defeat 3 elite monsters at mountain passes/cave entrances: Stone Colossus, Crystal Warden, Petrified Drake. Solo boss encounters. Each clears a travel route permanently.
- **Rewards**: 600 gold, 3 fragments (earth/4, fire/4, dark/4), Tecton's Fist (ACC-12, +15 ATK, +15 DEF, crit +25%)
- **Failure Conditions**: Defeat respawns the player at the encounter entrance. Can retry.

**Sorrow → "The Footprints of the Peregrine" + "The Rest Stop"**

*GQ-04-S1: The Footprints of the Peregrine*
- **Giver**: Errantis | **Level**: 14-18
- **Objectives**: Follow the memory trail of the Peregrine Road's last explorer through 6 zones (Village Hub → Sunridge → Hollow Ridge → Resonance Fields → Shimmer Marsh → Luminous Wastes). Collect Peregrine Fragments at each stop.
- **Rewards**: 6 fragments (5x potency-4 sorrow + 1x potency-5 sorrow), 500 gold, Peregrine's Journal (K-11, reveals hidden items/passages in visited zones)

*GQ-04-S2: The Rest Stop*
- **Giver**: Errantis | **Level**: 16-20
- **Objectives**: Broadcast 2 sorrow + 1 calm fragment into designated spots at Ridgewalker Camp. Create the Memorial Waypoint (rest point + fast travel anchor + rotating cinematic memories).
- **Rewards**: 350 gold, 1 fragment (calm/neutral/3), Memorial Waypoint (connects to Rootway if Floriana active)

**Awe → "The Perpetual Engine" + "The Unstoppable Run"**

*GQ-04-A1: The Perpetual Engine*
- **Giver**: Vortis | **Level**: 14-18
- **Objectives**: Build kinetic sculptures at all 4 Frontier god shrine locations. Each requires 1 wind + 1 earth fragment broadcast at the shrine base. Once complete, linked orbital beams generate +1 vibrancy/game-hour to all Frontier zones.
- **Rewards**: 500 gold, 1 fragment (awe/fire/5), Gyroscope Charm (ACC-13, +15 AGI, immune to knockback, Momentum cap +3)

*GQ-04-A2: The Unstoppable Run*
- **Giver**: Vortis | **Level**: 18-22
- **Objectives**: Timed challenge: reach the Crystalline Fortress Gate in Undrawn Peaks from Kinesis Spire in under 3 minutes real time. No combat (must avoid enemies).
- **Rewards**: 400 gold, 1 fragment (awe/fire/4), Vortis's Streak (weapon: dagger, ATK +30, AGI +20, stacking +10% ATK per consecutive hit)
- **Failure Conditions**: Timer expires. Can retry immediately, no penalty.

---

## God Recall Quest Dependency Summary

```
MQ-05 (Frontier access)
  ├─ SQ-09 → GQ-01 (Resonance) → 2 emotion-specific quests
  ├─ SQ-06 → GQ-02 (Verdance)  → 2 emotion-specific quests
  ├─ SQ-08 → GQ-03 (Luminos)   → 2 emotion-specific quests
  └─ SQ-07 → GQ-04 (Kinesis)   → 2 emotion-specific quests
```

Each god recall chain requires its corresponding Frontier exploration side quest (SQ-06 through SQ-09) as a prerequisite. The exploration quests provide the key items and knowledge needed to approach each shrine.

---

## Cross-God Quest Interactions

Some recall-specific quests interact when multiple gods are recalled:

| Quest A | Quest B | Interaction |
|---------|---------|-------------|
| GQ-02-J1 (Rootway) | GQ-04-S2 (Rest Stop) | Memorial Waypoint auto-connects to Rootway |
| GQ-02-A1 (Mycorrhizal Map) | GQ-04-A1 (Perpetual Engine) | Root network + orbital engine = +2 vibrancy/hour all zones |
| GQ-01-A2 (The Accord) | GQ-03-S1 (The Defector) | Both reduce Preserver hostility in Act III; combined: 2 Preservers switch sides during Fortress |
| GQ-03-A2 (Many-Colored Truth) | MQ-09 (Fortress) | Curator's Doubt removes 1 encounter phase from final confrontation |
| GQ-03-F2 (Shadows of Curator) | MQ-09 (Fortress) | Depths L5 shortcut + Curator motivation revealed early |
| GQ-03-S1 (The Defector) | MQ-09 (Fortress) | K-14 reveals Fortress F1 layout before entering |

---

## Complete Quest Count Summary

| Category | Count | Notes |
|----------|-------|-------|
| Main Quests | 10 | MQ-01 through MQ-10 |
| Side Quests | 14 | SQ-01 through SQ-14 |
| God Recall Quests (base) | 4 | GQ-01 through GQ-04 |
| God Recall Sub-quests | 8 per playthrough (2 per god x 4 gods) | 32 total across all emotions, 8 per playthrough |
| **Total per playthrough** | **36** | 10 main + 14 side + 4 base god + 8 recall-specific |
| **Total unique quests** | **60** | Including all 32 emotion-specific variants |

---

## Master Dependency Chain

```
START
  │
  MQ-01 (Architect's Awakening)
  │
  MQ-02 (First Broadcast) ─── SQ-01 (Memorial Garden)
  │
  MQ-03 (Settled Lands) ──┬── SQ-02 (Windmill Mystery)
  │                        ├── SQ-03 (Woodcutter's Dilemma)
  │                        └── SQ-04 (Upstream Secrets)
  │
  MQ-04 (The Stagnation) ──── SQ-05 (Aric's Doubt) ──────────────────────┐
  │                                                                        │
  MQ-05 (Into the Frontier) ──┬── SQ-06 (Marsh Hermit) → GQ-02 (Verdance)│
  │                            ├── SQ-07 (Ridgewalkers) → GQ-04 (Kinesis) │
  │                            ├── SQ-08 (Light Studies) → GQ-03 (Luminos)│
  │                            ├── SQ-09 (Listener's Camp) → GQ-01 (Resonance)
  │                            ├── SQ-10 (Depths, Lv14+)                  │
  │                            ├── SQ-11 (Torvan, vibrancy 70+)           │
  │                            └── SQ-12 (Dream Visions, 5 rests)         │
  │                                                                        │
  MQ-06 (First God Recall) ←── requires ≥1 GQ complete                    │
  │                                                                        │
  MQ-07 (Curator's Endgame) ←── requires SQ-05 + ≥2 gods recalled ────────┘
  │                          └── SQ-13 (Choir's Instruments, after GQ-01)
  │                          └── SQ-14 (Stagnation Breaker)
  │
  MQ-08 (Through the Sketch)
  │
  MQ-09 (Preserver Fortress)
  │
  MQ-10 (First Memory Remix) → END / New Game+
```
