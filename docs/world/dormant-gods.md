# The Dormant Gods: Recall System

> Cross-references: [docs/world/factions.md](factions.md), [docs/world/setting.md](setting.md), [docs/world/geography.md](geography.md), [docs/world/vibrancy-system.md](vibrancy-system.md), [docs/design/memory-system.md](../design/memory-system.md), [docs/design/classes.md](../design/classes.md), [docs/story/characters.md](../story/characters.md), [docs/story/structure.md](../story/structure.md)

## Overview

The four dormant gods are the centerpiece of Act II. Each god is a **dormant prototype** — an unfinished deity created by a dissolved civilization that broke apart before completing the work (see [setting.md](setting.md)). Each god sleeps at a shrine in the Frontier, waiting for a Mnemonic Architect to recall them into a new, complete form.

The player recalls each god by broadcasting a memory fragment of a specific **emotion** into the god's shrine. The emotion used — **joy, fury, sorrow, or awe** — permanently determines the god's new identity, domain, and impact on the world. There are 16 possible recall outcomes across the four gods, and every combination produces a distinct world state.

Recall is **permanent and irreversible** within a single playthrough. The player cannot undo a recall or change a god's form once chosen. This creates meaningful choice: each recall reshapes the world in ways that cannot be experienced alongside the alternatives. With 4 gods × 4 emotions = 16 decisions (though only 4 are made per playthrough), replay value is enormous — no two playthroughs need to feel the same.

---

## The Recall Mechanic

### How Recall Works

1. The player discovers a dormant god's shrine in the Frontier (each shrine is marked as a key landmark in [geography.md](geography.md)).
2. Approaching the shrine triggers a **recall vision**: a 30-second cinematic sequence showing fragments of the dissolved civilization that created the god. The vision is narrated by Callum (via a letter the player receives before entering the Frontier — see [characters.md](../story/characters.md)).
3. The shrine presents the player with four pedestals, each marked with an emotion glyph: **Joy** (sun), **Fury** (flame), **Sorrow** (raindrop), **Awe** (star).
4. The player places a memory fragment of the chosen emotion type onto the corresponding pedestal. The fragment must be **potency 3 or higher** (ensures the player has engaged meaningfully with the memory system before making this permanent choice).
5. A **recall transformation** plays: the dormant god rises, reshapes, and assumes its new form. The surrounding zone immediately gains +15 vibrancy. The god speaks its new name and announces its domain.
6. The god becomes an **ambient presence** in the world — not a party member or summon, but a persistent force that changes the rules of the game in that god's area and beyond.

### Recall Order

The player can recall the four gods in **any order**. The gods' Frontier zones are accessible as soon as Act II begins (after the mountain pass north of the Village Hub opens following Lira's freezing — see [geography.md](geography.md)).

The **first god recalled** has additional significance: it determines the player's **subclass branch** (see [classes.md](../design/classes.md)):

| First Recall Emotion | Subclass Branch | Branch Character |
|---------------------|----------------|-----------------|
| Joy or Awe | Branch A: **Luminary** | Creative, supportive, community-focused abilities |
| Fury or Sorrow | Branch B: **Crucible** | Transformative, intense, individually powerful abilities |

This means the first recall is the most consequential single choice in the game: it shapes both the world AND the player character permanently.

### Fragment Requirements

Any fragment with the correct emotion and potency 3+ works for recall. The fragment's element does not matter — only the emotion. This simplifies the choice for the player: "What do I want this god to become?" rather than "Do I have the right fragment combination?"

The fragment is consumed in the recall. This costs the player a meaningful resource (a potency 3+ fragment is valuable), reinforcing that recall is a commitment, not a casual action.

---

## God I: Resonance — The Dormant God of Sound

### Origin

**Created by**: The **Choir of the First Dawn**, a civilization of musicians, vocalists, and acoustic architects. They believed the world was sung into existence — that reality was a chord still vibrating from the first note ever played. They built amphitheaters, resonance chambers, and standing stone arrays designed to capture and amplify the world's ambient sound.

**Why they dissolved**: The Choir reached a point where their collective song had become so complex that no single voice could hold it. Rather than simplify, they chose to dissolve their memories into the wind and stone, transforming themselves into the ambient soundscape of the world. Their final act was leaving Resonance — their unfinished god of sound — dormant at the heart of their greatest amphitheater, hoping that a future Architect would complete what they started.

**Their legacy**: The Resonance Stones scattered across the game world are the Choir's instruments. The ambient sounds the player hears in every zone — wind through grass, water over stone, birdsong in forests — are the Choir's dissolved memories, still singing.

### Dormant State

**Location**: Resonance's Amphitheater, Resonance Fields (25, 25) — see [geography.md](geography.md)

**Appearance**: A column of visible sound waves — concentric rings of shimmering air rising from the amphitheater's center. No physical body. The air hums with a deep, persistent note (A below middle C, 220 Hz) that vibrates every Resonance Stone on the map. Standing near the shrine, the player hears fragments of the Choir's final song — broken phrases, overlapping harmonies, a melody that never quite resolves.

**Discovery trigger**: The player must first visit the Listener's Camp (10, 35) in Resonance Fields and speak with the audiomancer NPCs. They explain that the humming has grown louder recently (since the player's actions have been raising vibrancy in the Frontier) and direct the player to the amphitheater. Approaching the shrine requires crossing a field of active Resonance Stones that produce dissonant sounds — the player must broadcast a memory fragment into three specific stones (in any order) to harmonize them and open the path.

### Recall Options

---

#### Joy → **Cantara, God of the Living Song**

**Domain**: Music, celebration, communal harmony, creative expression

**The Transformation**: Resonance's sound waves coalesce into a radiant figure made of golden light and visible melodies — notes streaming from its hands like ribbons. Cantara laughs (the first sound it makes is laughter), and every Resonance Stone in the zone rings in a major chord. The amphitheater transforms: stone seats sprout moss cushions, wildflowers bloom between the standing stones, and the persistent hum resolves into a warm, lilting melody.

**Passive World Effect**:
- Resonance Fields gains +10 vibrancy immediately (on top of the base +15 from recall)
- All Resonance Stones in every zone begin emitting soft, pleasant harmonics — their glow changes from amber to warm gold
- The background music in Resonance Fields permanently adds a vocal humming layer (like a distant chorus)
- Environmental memory fragment collection rate in Resonance Fields increases by 25% (the stones are more generous)

**Player Buff — "Song of the Heart"**:
- Passive: Party regenerates 3% of max HP per turn in combat (the song sustains them)
- Active (once per battle): "Cantara's Chorus" — all party members gain +15% to all stats for 3 turns

**NPC Behavior Changes**:
- NPCs across the world become more social and talkative. Village Hub NPCs gather in the Central Square more often. Frontier settlers tell more stories.
- Musician NPCs appear in every settlement (Village Hub, Heartfield Hamlet, Millbrook, Ridgewalker Camp, Flickering Village, Listener's Camp). They play instruments and the player can interact with them for bonus lore and small joy-type fragments.
- The Listener's Camp audiomancers become Cantara's devoted followers and offer advanced memory-listening training (new interaction type: "listen to a stone" reveals hidden fragment locations in adjacent zones).

**Side Quests Unlocked**:
1. **"The Unfinished Symphony"** — Cantara asks the player to find 5 musical memory fragments (scattered across the world in specific Resonance Stone locations) and return them to the amphitheater. Completing this "composes" a world-song: a 30-second musical sequence plays, and every zone in the game gains +3 vibrancy. Reward: 1 potency-5 joy fragment, 500 gold, and Cantara's Baton (key item that increases broadcast vibrancy gain by +2 in any zone).
2. **"Cantara's Troubadours"** — Recruit 3 musician NPCs from different settlements to form a traveling performance troupe. Once formed, the troupe travels between settlements on a weekly cycle, raising each settlement's vibrancy by +2 per visit. Reward: 300 gold, 1 potency-3 joy fragment, and a permanent +5% XP bonus when fighting in a zone the troupe has visited.

---

#### Fury → **Tempestus, God of the Thundersong**

**Domain**: Storms, righteous anger, the shattering power of sound, upheaval

**The Transformation**: Resonance's sound waves compress into a dense, crackling form — a figure of black stormclouds lit from within by constant lightning. Tempestus roars (the first sound is a deafening thunderclap), and every Resonance Stone in the zone splits with a crack, releasing stored sound as visible shockwaves. The amphitheater darkens: storm clouds gather overhead, rain falls sideways, and the standing stones become lightning rods crackling with energy.

**Passive World Effect**:
- Resonance Fields becomes a permanent stormscape — dramatic clouds, periodic lightning strikes (cosmetic, non-damaging), wind that bends the grass flat
- Preserver reinforcement rate in Resonance Fields and all adjacent Frontier zones is halved (the storm disrupts their crystallization process)
- The Preserver Cathedral (40, 15) weakens: its silence field shrinks from 10-tile radius to 5-tile radius, making it easier to break
- Thunder echoes are audible in all Frontier zones as a faint ambient rumble

**Player Buff — "Thunderstrike"**:
- Passive: All physical attacks have a 15% chance to chain lightning to one additional enemy, dealing 40% of the original damage as lightning element
- Active (once per battle): "Tempestus's Roar" — AoE thunder damage to all enemies equal to 150% of the player's ATK, with a 30% chance to inflict Stun (1 turn)

**NPC Behavior Changes**:
- Frontier NPCs become emboldened and militant. Ridgewalker Camp settlers arm themselves and begin patrolling their perimeter. Flickering Village residents reinforce their buildings against Preserver incursion.
- NPCs who were previously intimidated by Preservers now openly criticize them. New dialogue options appear where NPCs share fury-type fragments they'd been hoarding "in case someone was brave enough to use them."
- The Listener's Camp audiomancers become storm-listeners, tracking Preserver movements by the "silences" they create in the ambient soundscape. They provide tactical intelligence for Preserver encounters.

**Side Quests Unlocked**:
1. **"The Storm Wall"** — Tempestus directs the player to build a lightning barrier around a Frontier settlement (player's choice: Ridgewalker Camp or Flickering Village). Requires broadcasting 3 fury-type fragments into 3 Resonance Stones surrounding the settlement. Once complete, Preserver agents cannot enter the protected settlement, and the zone's vibrancy floor increases by +10 permanently. Reward: 400 gold, 1 potency-4 fury fragment, and Storm Aegis (accessory: +10 DEF, lightning immunity).
2. **"The Shattered Silence"** — Assault the Preserver Cathedral directly. Tempestus provides a "Thunderstone" (key item) that, when placed at the Cathedral's base, shatters its crystalline structure in a climactic combat encounter (3 Preserver agents + 1 Preserver Captain, all weakened by the ongoing storm). Breaking the Cathedral permanently eliminates all Preserver presence in Resonance Fields and raises the zone's vibrancy by +20. Reward: 600 gold, 2 potency-4 fragments (1 fury, 1 awe), and the Conductor's Rod (weapon: staff, ATK +35, 20% chance to inflict Stun).

---

#### Sorrow → **Tacet, God of the Necessary Silence**

**Domain**: Quiet, introspection, the space between sounds, rest, the grief that precedes renewal

**The Transformation**: Resonance's sound waves thin and scatter into absolute stillness. For 5 seconds, the game goes completely silent — no music, no ambient sound, nothing. Then Tacet appears: a translucent figure of deep blue-purple light, barely visible, made of the shapes that sound leaves behind when it stops. Tacet does not speak. Instead, words appear as glowing text floating in the air around it. The amphitheater transforms: the standing stones develop deep carvings (visible only in the silence), and a soft, crystalline moss covers the ground, muffling all footsteps.

**Passive World Effect**:
- Resonance Fields becomes a place of profound quiet — ambient sound is reduced to near-silence, with only the faintest wind
- All stagnation zones in the game weaken: Preserver reinforcement rate is reduced by 50% everywhere (Tacet's silence interferes with the crystallization frequency the Preservers use)
- The background music in Resonance Fields becomes a single, sustained, hauntingly beautiful tone (a glass harmonica note that cycles through subtle overtones)
- Hidden passages throughout the game world become detectable — Tacet's silence reveals "sound shadows" (visual markers appearing near hidden entrances, treasure, and secret Resonance Stones)

**Player Buff — "Veil of Silence"**:
- Passive: Player gains +20% evasion. All enemies suffer -15% accuracy when attacking the player (the silence makes the player harder to track)
- Active (once per battle): "Tacet's Hush" — silence all enemies for 2 turns (enemies cannot use magic/special abilities, only basic attacks)

**NPC Behavior Changes**:
- NPCs become more contemplative and measured. Dialogue becomes shorter but denser — NPCs share deeper, more personal memories. Previously guarded NPCs (the Marsh Hermit Wynn, Callum during his reflective moments) open up with new, lore-rich dialogue.
- The Listener's Camp audiomancers become "Silence Readers" — they can now detect dissolved civilization memories by listening to what's NOT there. They offer a new service: analyzing any memory fragment the player brings them and revealing its hidden backstory (bonus lore text per fragment).
- Preserver agents in the world become visibly unsettled. Their dialogue changes from confident to questioning. Some express doubt about the Curator's plan.

**Side Quests Unlocked**:
1. **"The Silent Path"** — Tacet reveals that there is a hidden route through any stagnation zone that doesn't require force to traverse — a path of perfect silence that the Preservers' crystals cannot detect. The player must find and walk 3 Silent Paths (one in Shimmer Marsh's Stagnation Bog, one in Hollow Ridge's Shattered Pass, one in Resonance Fields' Cathedral perimeter). Each path is invisible until the player is within 3 tiles, revealed by Tacet's "sound shadow" markers. Walking the paths doesn't break the stagnation but lets the player access areas behind them without combat. Reward: 350 gold, 1 potency-4 sorrow fragment, and Silent Tread (accessory: encounter rate reduced by 50% while equipped).
2. **"Voices in the Void"** — Tacet asks the player to visit 4 specific Resonance Stones across the world (one in each Frontier zone) and listen to the silence between their tones. At each stone, a dissolved civilization ghost appears and shares a memory fragment unique to this quest — memories of why their civilizations chose to dissolve. These are the game's deepest lore fragments: each is potency 5 and emotion "calm" (a rare emotion type not normally found in the wild). Reward: 4 potency-5 calm fragments, 500 gold, and the Whisper Robe (armor: DEF +15, +30% resistance to all status effects).

---

#### Awe → **Harmonia, God of the Perfect Chord**

**Domain**: Balance, universal resonance, the harmony between all elements and emotions, synthesis

**The Transformation**: Resonance's sound waves fold inward and expand simultaneously — a pulse that synchronizes with the player's heartbeat (the screen subtly pulses). Harmonia emerges as a figure of prismatic sound-light: a form made of interlocking geometric patterns that shift and rotate, each facet a different color representing a different element and emotion. Harmonia sings a single chord that contains all the notes the Choir of the First Dawn ever played. The amphitheater transforms: the standing stones arrange into a perfect circle, each stone emitting a different tone, and the air between them shimmers with visible harmonic patterns.

**Passive World Effect**:
- All Resonance Stones in every zone in the game begin humming in concert — a faint but universal ambient harmony
- Fragment collection rate from Resonance Stones increases by 30% everywhere (the stones resonate more freely)
- The vibrancy broadcast formula gains a permanent +2 bonus in all zones (see [vibrancy-system.md](vibrancy-system.md)) — effectively making every fragment more powerful
- Resonance Fields' background music becomes a complex, evolving polyphonic piece that incorporates motifs from every other zone's BGM

**Player Buff — "Perfect Chord"**:
- Passive: Elemental matching bonuses in combat are doubled (e.g., fire vs. ice normally deals 1.5x → now deals 2.0x). This affects both player attacks and enemy vulnerabilities.
- Active (once per battle): "Harmonia's Resonance" — for 3 turns, every attack the party makes triggers a "harmonic echo" that deals 25% bonus damage of the target's weakest element

**NPC Behavior Changes**:
- NPCs across the world become more cooperative. Faction tensions ease: Frontier settlers and visiting Preserver agents engage in cautious dialogue instead of hostility.
- New "Harmonist" NPCs appear at each Frontier settlement — scholars who study the balance between preservation and growth. They offer philosophical dialogue and give the player neutral-emotion fragments.
- The Listener's Camp audiomancers achieve their lifelong goal of hearing the world's "fundamental tone." Their camp becomes a pilgrimage site — additional NPCs arrive, making it a proper settlement with a shop.

**Side Quests Unlocked**:
1. **"The Harmonist's Attunement"** — Harmonia asks the player to tune 7 Resonance Stones across the world to the same harmonic frequency. The stones are located in: Village Hub (Central Square fountain), Heartfield (Old Windmill), Ambergrove (Hearthstone Circle), Millbrook (Brightwater Bridge keystone), Shimmer Marsh (Verdance's Hollow — if Verdance has been recalled, this becomes a joint shrine interaction), Hollow Ridge (Wind Shrine), and Flickerveil (Resonance Archive). Each stone requires the player to broadcast a specific element-type fragment (the element matching the stone's zone biome affinity — see [vibrancy-system.md](vibrancy-system.md)). When all 7 are tuned, a global vibrancy pulse fires: +5 vibrancy to every zone in the game. Reward: 500 gold, 1 potency-5 awe fragment, and Harmonia's Tuning Fork (key item: doubles the broadcast radius of all future memory broadcasts).
2. **"The Accord"** — Harmonia proposes establishing a neutral meeting ground where Mnemonic Architects and Preservers can negotiate. The player must find a Preserver agent willing to talk (there is one in each Frontier zone — they're marked by slightly different crystal coloring after Harmonia's recall). Convincing 2 of the 4 agents to attend the meeting triggers a unique dialogue scene at Resonance's Amphitheater where the foundations of a truce are laid. This has narrative consequences in Act III: Preserver agents in the final dungeon are less hostile, and one Preserver NPC switches sides during the Fortress infiltration. Reward: 400 gold, 1 potency-4 calm fragment, and the Accord Pendant (accessory: Preserver enemies deal 15% less damage to the wearer).

---

## God II: Verdance — The Dormant God of Growth

### Origin

**Created by**: The **Rootwalkers**, a civilization of cultivators, herbalists, and ecological architects. They didn't just farm — they shaped entire biomes, coaxing forests from bare stone and raising wetland ecosystems from dry plains. They understood that growth isn't just "things getting bigger" — it's ecosystems finding balance, species adapting, life finding a way.

**Why they dissolved**: The Rootwalkers believed they'd done their work. The world's biomes were established, the soil was fertile, the seeds were planted. Continuing to manage everything would have made them gardeners forever, never letting the garden grow wild. They dissolved their memories into the soil, roots, and living things, trusting the world to grow on its own. Their final act was leaving Verdance — an unfinished god of growth — dormant in their deepest, most vibrant glade, a last gift for whoever came next.

**Their legacy**: Every forest, marsh, and grassland in the game exists because the Rootwalkers planted its first seeds. The impossible greenery of Verdance's Hollow — vivid growth surrounded by muted marsh — is the last place their concentrated memory lingers.

### Dormant State

**Location**: Verdance's Hollow, Shimmer Marsh (25, 35) — see [geography.md](geography.md)

**Appearance**: A massive half-formed tree trunk, 10 tiles wide at the base, rising 5 tiles into the air before ending in an unfinished crown of branches that trail off into nothing. The bark is deep brown shot through with veins of vivid green light that pulse slowly, like a heartbeat. Roots extend 15 tiles in every direction, glowing beneath the marsh water. The air around the trunk smells of rain and new growth. Small shoots and seedlings sprout wherever the roots surface, even through the muted marsh soil.

**Discovery trigger**: The player must first speak to the Marsh Hermit Wynn (12, 15) in Shimmer Marsh. Wynn has been studying the hollow for years and explains that the tree is not dead — it's waiting. The player must clear a path through dense marsh vegetation (requires broadcasting an earth or water element fragment into a blocked root cluster at (20, 30) to make the roots retract and reveal the path to the shrine).

### Recall Options

---

#### Joy → **Floriana, God of the Endless Bloom**

**Domain**: Abundance, flourishing life, celebration of growth, fertility, generosity

**The Transformation**: The half-formed tree explodes upward — bark spiraling, branches unfurling, leaves cascading in a shower of gold and green. Floriana emerges from the canopy as a figure woven from flowering vines, petals, and dappled sunlight. She laughs (like wind through blossoming branches), and the entire Shimmer Marsh erupts: dormant seeds sprout, flowers bloom across every surface, the marsh water clears to reveal a garden beneath. The tree completes itself into a towering, blooming giant visible from adjacent zones.

**Passive World Effect**:
- Shimmer Marsh gains +10 vibrancy immediately (on top of base +15)
- All outdoor zones gain a subtle "bloom" effect: additional flower tiles appear at zone edges, spreading inward over time (cosmetic, 1-2 new flower patches per zone per game-hour)
- Consumable items found in the wild (potions, herbs) have their healing value increased by 25% globally
- The Stagnation Bog (40, 10) in Shimmer Marsh weakens: its crystallized plants begin to crack as roots push through from beneath, reducing its break requirement to any potency 2+ fragment

**Player Buff — "Verdant Embrace"**:
- Passive: At the end of each combat turn, the player and all allies heal 2% of max HP (regeneration from ambient growth energy)
- Active (once per battle): "Floriana's Garden" — create a 3-turn zone of healing on the battlefield. All allies standing in it heal 15% of max HP per turn. Enemies standing in it take 5% of max HP as damage (thorns).

**NPC Behavior Changes**:
- Farming and gardening NPCs across the world become more productive. Heartfield farmers report record harvests. Millbrook's riverside vegetation flourishes. New "gardener" NPCs appear in settlements, offering plant-based consumables at discount prices.
- Wynn the Marsh Hermit is overjoyed and becomes Floriana's first acolyte. He relocates to Verdance's Hollow (now a blooming glade) and offers advanced herbalism quests.
- Wild animals become less hostile in zones adjacent to Shimmer Marsh. Some overworld enemies in Settled Lands zones become non-aggressive (they're too well-fed to bother with combat).

**Side Quests Unlocked**:
1. **"The Rootway"** — Floriana reveals that the Rootwalkers planted a network of underground root tunnels connecting every zone in the game. Most are blocked by stagnation or decay. The player must broadcast earth-type fragments into 4 root nodes (one in each Settled Lands sub-map: Heartfield, Ambergrove, Millbrook, Sunridge) to reactivate the Rootway. Once open, it functions as a fast-travel network: the player can travel between any two activated root nodes instantly by entering the tunnel at one end. Reward: 500 gold, the Rootway fast-travel system (permanent gameplay upgrade), and 1 potency-4 joy fragment.
2. **"Floriana's Feast"** — Floriana asks the player to organize a harvest festival in the Village Hub. Requires: 3 earth-type fragments (broadcast into the Memorial Garden), 2 joy-type fragments (broadcast into the Central Square), and convincing 5 NPCs from different settlements to attend. The festival itself is a 2-minute cinematic sequence of celebration, music, and feasting. Afterward: Village Hub permanently gains +5 vibrancy, all shops in the game restock with one additional rare item each, and a new NPC merchant ("The Festival Trader") appears at the Village Hub offering unique consumables. Reward: 400 gold, 1 potency-5 joy fragment.

---

#### Fury → **Thornweald, God of the Wild Overgrowth**

**Domain**: Untamed nature, aggressive growth, reclamation, the fury of life pushing through obstacles

**The Transformation**: The half-formed tree doesn't bloom — it erupts. Thorns erupt from the bark, each one as long as a sword. Vines whip outward, cracking stone and marsh ice alike. Thornweald rises from the trunk as a jagged, angular figure of twisted wood and razor-sharp bark, crowned with brambles that drip sap like molten amber. He snarls (like roots cracking pavement), and the marsh responds: vegetation aggressively reclaims every surface, vines strangle the crystallized edges of the Stagnation Bog, and the tree becomes a fortress of thorns.

**Passive World Effect**:
- Shimmer Marsh gains +10 vibrancy, but the increase manifests as aggressive, wild growth rather than gentle blooming — the marsh becomes a dense, verdant tangle
- Stagnation zones across the game begin to crack: plant life pushes through the crystal in all stagnation zones, reducing their Preserver reinforcement rate by 25% globally
- Thorny vegetation appears as new obstacles in Frontier zones: cosmetic, but enemies in Frontier zones have -10% evasion (the undergrowth tangles their movement)
- The Stagnation Bog in Shimmer Marsh auto-breaks over the course of 10 in-game minutes (vines shatter the crystals) — no fragment required

**Player Buff — "Thorn Barrier"**:
- Passive: When the player takes physical damage, the attacker receives 20% of that damage as thorn retaliation (earth element)
- Active (once per battle): "Thornweald's Wrath" — AoE attack dealing 120% of player's ATK as earth damage to all enemies, with a 40% chance to inflict Poison (3 turns, 5% max HP per turn)

**NPC Behavior Changes**:
- Nature-aligned NPCs become fierce advocates for expansion. Woodcutter's Camp (Ambergrove) workers refuse to cut trees and instead help the forest grow. Frontier settlers build with living wood rather than cutting timber.
- Wynn the Marsh Hermit becomes alarmed at the aggressive growth but ultimately accepts it as "nature's answer to stagnation." He offers quests to help direct Thornweald's energy productively rather than destructively.
- Preserver agents in Shimmer Marsh and adjacent zones retreat to more defensible positions. Their dialogue reveals fear of the "wild god."

**Side Quests Unlocked**:
1. **"The Reclamation"** — Thornweald demands that the player liberate a Preserver-held zone by unleashing wild growth. Choose one: Sunridge's Preserver Outpost, the Shattered Pass in Hollow Ridge, or the Resonance Archive in Flickerveil. The player broadcasts 3 earth+fury fragments into the zone's perimeter. Vines assault the crystalline structures in a combat encounter where the player fights alongside summoned vine creatures against Preserver agents. The zone is permanently cleared and vibrancy jumps +15. Reward: 500 gold, 1 potency-4 fury fragment, and Thornweald's Gauntlet (accessory: +10 ATK, thorn retaliation damage increased to 30%).
2. **"The Living Wall"** — Thornweald proposes growing a barrier of thorns along the Frontier-Sketch boundary to prevent Preservers from crystallizing the unfinished land. The player must collect 5 earth-type fragments and broadcast them at 5 specific boundary points (one per Frontier/Sketch border tile). Once complete, a wall of living thorns appears along the boundary. Preserver agents can no longer freely cross between Frontier and Sketch zones, and any Preserver encounters in Frontier zones after this point have one fewer enemy. Reward: 400 gold, 1 potency-3 earth fragment, and permanent -1 enemy from all Preserver patrol encounters in the Frontier.

---

#### Sorrow → **Autumnus, God of the Falling Leaf**

**Domain**: Natural cycles, necessary endings, the beauty of decay that enables renewal, composting the old to feed the new

**The Transformation**: The half-formed tree doesn't grow upward. Its bark develops the deep russet of autumn. The half-formed branches extend, but they're already shedding — golden and crimson leaves spiral downward in an endless, slow cascade. Autumnus steps from the trunk as a figure of layered autumn hues: amber, russet, deep gold, warm brown. His face is gentle, weary, wise. He sighs (like the last warm wind before winter), and the marsh transforms: the aggressive green mutes to autumnal warmth, the water turns the color of tea, and the ground is carpeted in soft, decomposing leaves that glow faintly with memory energy.

**Passive World Effect**:
- Shimmer Marsh gains +10 vibrancy, manifesting as an eternal autumn — warm colors, falling leaves, a sense of peaceful endings
- Dissolved civilization memories across the entire game become easier to access: all Resonance Stones yield +1 potency on fragments collected from them (minimum 1, maximum 5)
- The Depths gain a subtle warm glow: dungeon zones feel less foreboding, more like visiting an ancestor's home. Depths enemy encounter rate decreases by 15% (the dissolved memories are more at peace)
- The Stagnation Bog in Shimmer Marsh doesn't break violently — instead, the crystals slowly dissolve over 15 in-game minutes, leaving behind a clear pool containing 2 potency-4 sorrow fragments

**Player Buff — "Cycle's Gift"**:
- Passive: When an enemy is defeated, the player recovers SP equal to 10% of the enemy's max HP (the defeated enemy's life energy feeds the cycle)
- Active (once per battle): "Autumnus's Harvest" — sacrifice 20% of the player's current HP to deal 200% of that amount as damage to a single target. If the target is defeated by this attack, the player recovers all sacrificed HP plus 10% more.

**NPC Behavior Changes**:
- Elder NPCs (Callum, Wynn, the Ridgewalker Camp elders) become reflective and share deeper memories they'd been holding back — stories of loss, change, and acceptance. These conversations yield unique sorrow-type fragments (1 per elder NPC, potency 3-4).
- Wynn the Marsh Hermit finds peace with his decades of solitary research. He shares his life's work with the player: a comprehensive map of all dissolved civilization memory deposits in the game (reveals hidden fragment locations in all Depths levels).
- Young NPCs across settlements begin asking philosophical questions about growth and endings. New dialogue options appear that are gentler, more reflective.

**Side Quests Unlocked**:
1. **"The Composting"** — Autumnus explains that some memories are too old and too heavy to be useful in their current form. The player must find 3 "burdened" Resonance Stones (in Depths Levels 2, 3, and 4) that are overloaded with ancient memory and "compost" them by broadcasting sorrow-type fragments into each one. This breaks down the dense old memories into lighter, more usable forms: each composted stone releases 2 potency-3 fragments of random emotion (6 total). The composted stones also begin functioning as rest points in the Depths (full HP/SP restore). Reward: 6 potency-3 fragments, 400 gold, and Autumnus's Mantle (armor: DEF +20, +15% resistance to fire and ice, SP cost of all skills reduced by 10%).
2. **"The Last Rootwalker"** — Autumnus reveals that one Rootwalker did not fully dissolve. A single consciousness lingers in the deepest root beneath Verdance's Hollow — not alive, not dissolved, but stuck in between. The player must descend through a hidden root passage (revealed by Autumnus) into a one-room underground space where the Last Rootwalker's memory echo waits. A dialogue-only encounter: the Rootwalker shares the story of the dissolution decision, the fear, the acceptance, and asks the player to help them complete the process. The player broadcasts a sorrow fragment into the echo, and the Last Rootwalker dissolves peacefully, leaving behind a potency-5 calm fragment and a final message: "Tell the new god I'm proud." Reward: 1 potency-5 calm fragment, 500 gold, and the Rootwalker's Seed (key item: when planted at any zone's central point, permanently raises that zone's vibrancy by +5, single use).

---

#### Awe → **Sylvanos, God of the Deep Root**

**Domain**: Ancient wisdom, interconnection, the hidden network beneath the surface, mycorrhizal intelligence, patience

**The Transformation**: The half-formed tree completes itself not by growing upward but by growing downward. The roots plunge deeper, and the ground in a 10-tile radius becomes translucent — the player can see the root network spreading beneath the marsh like a nervous system, glowing amber-green. The trunk thickens and develops intricate bark patterns: maps, circuits, branching paths. Sylvanos emerges from within the trunk as a figure of ancient wood and bioluminescent fungal growth, eyes like deep amber, moving slowly and deliberately. He speaks (in a voice like roots creaking) with the measured cadence of something very old and very patient.

**Passive World Effect**:
- Shimmer Marsh gains +10 vibrancy, manifesting as a deepening of the marsh's ecology — new plant species appear, the water develops bioluminescent qualities, mushroom rings grow around the roots
- A root network becomes visible on the minimap in all outdoor zones: faint glowing lines connecting Resonance Stones to each other. This reveals the shortest path between any two Resonance Stones (exploration aid)
- Memory fragments broadcast into any zone spread their vibrancy bonus to one adjacent zone at 50% effectiveness (the root network carries the memory energy underground)
- The marsh's water gains healing properties: standing in water tiles in Shimmer Marsh regenerates 1% HP per second (outside of combat)

**Player Buff — "Root Sense"**:
- Passive: The player can detect hidden items, secret passages, and buried Resonance Stones within a 5-tile radius (indicated by a subtle glow on the ground). This works in all zones.
- Active (once per battle): "Sylvanos's Embrace" — target one ally. For 3 turns, they are rooted in place (cannot move to a different battle position) but gain +30% DEF, +30% INT, and immunity to knockback/displacement effects.

**NPC Behavior Changes**:
- Scholar and researcher NPCs become more knowledgeable. Callum gains new dialogue explaining connections between dissolved civilizations he hadn't previously understood. Wynn develops new theories about how the Rootwalker network functioned.
- "Root Speaker" NPCs appear at 3 locations (Heartfield, Ambergrove, Millbrook) — these are people who have learned to communicate through the root network. They offer inter-zone message delivery and can relay information about events happening in distant zones (gameplay utility: tells the player about Preserver movements, new quest triggers, and vibrancy changes in zones they haven't recently visited).
- Underground creatures become less hostile: Depths enemies have a 15% chance to be non-aggressive (the root network calms them).

**Side Quests Unlocked**:
1. **"The Mycorrhizal Map"** — Sylvanos asks the player to fully map the root network by visiting and activating root nodes in 6 locations (Village Hub Memorial Garden, Heartfield Windmill, Ambergrove Hearthstone Circle, Millbrook Upstream Falls, Shimmer Marsh Verdance's Hollow center, and Flickerveil Resonance Archive). Each activation requires broadcasting an earth-type fragment into the node. Once complete, the entire root network becomes permanently visible on the world map, and the player gains the ability to "pulse" the network once per game-hour: sending a vibrancy wave that gives +1 vibrancy to every zone simultaneously. Reward: 500 gold, 1 potency-5 awe fragment, and the Rootmap Pendant (accessory: +15% gold from all sources, as the root network guides you to hidden caches).
2. **"The Patient Cure"** — Sylvanos reveals that the root network extends even beneath stagnation zones, and that slow, patient growth can dissolve crystallization from below — no violence needed. The player must visit 3 stagnation zones and broadcast earth+calm fragments into the ground (not the crystal focal points). Over the next 30 in-game minutes per zone, roots slowly crack the crystals from beneath, and the stagnation zone breaks peacefully (no combat encounter). This method is slower than force but yields bonus rewards: each peacefully broken zone releases 1 extra potency-4 fragment and the frozen NPCs within express gratitude rather than confusion. Reward: 3 potency-4 fragments (1 per zone), 400 gold, and Sylvanos's Blessing (permanent passive: all healing received is increased by 15%).

---

## God III: Luminos — The Dormant God of Light

### Origin

**Created by**: The **Radiant Lens**, a civilization of astronomers, artists, and light-weavers. They mapped every star, charted the movement of light through the atmosphere, and built cities of crystalline towers that captured and redirected sunlight to illuminate the deepest shadows. They believed that light was the medium of truth — that anything illuminated was understood, and anything understood could be improved.

**Why they dissolved**: The Radiant Lens realized that their obsessive illumination was leaving no room for mystery. By lighting every corner, they'd made the world knowable but unsurprising. They dissolved their memories into the light itself — sunbeams, starlight, the ambient glow of the unfinished world — so that future generations could discover things for themselves. Their final act was leaving Luminos dormant in their greatest light-gathering grove, a prism of compressed luminance waiting to be refracted into something new.

**Their legacy**: The luminous quality of the unfinished world — the soft glow of the Sketch, the warm amber of memory energy, the sparkle of vivid-tier zones — is all Radiant Lens memory, dissolved into the world's light.

### Dormant State

**Location**: Luminos Grove, Flickerveil (20, 20) — see [geography.md](geography.md)

**Appearance**: A column of pure white light descending from a gap in the forest canopy, as if the sky had a hole and was pouring concentrated daylight into this single clearing. At the column's center, a suspended prism — a geometric crystal roughly human-sized — rotates slowly, splitting the light into faint rainbow patterns on the surrounding trees. The prism hums at a frequency too high to hear but felt as warmth on the skin. Approaching it causes the player's shadow to multiply — one shadow per nearby tree, all pointing different directions.

**Discovery trigger**: The player must first visit the Flickering Village (35, 30) in Flickerveil and speak with the village elder, a woman named Solen who has studied the grove for her entire life. She gives the player a "Light Lens" (key item) — a polished crystal that, when held up in the grove, focuses the scattered light beams into a coherent path leading to the prism's base. Without the lens, the light column is blinding and the player cannot approach within 5 tiles.

### Recall Options

---

#### Joy → **Solara, God of the Golden Dawn**

**Domain**: Hope, clarity, new beginnings, the warmth of first light, revelation through gentleness

**The Transformation**: The prism absorbs the light column entirely, goes dark for 1 second, then detonates outward in a burst of warm golden light. Solara emerges as a figure of liquid sunrise — gold, peach, and soft rose, with hair that streams upward like flames made of dawn light. She smiles (the first expression is a smile so warm the screen's color temperature shifts), and the grove transforms: every tree in Flickerveil catches the golden light and holds it, the flickering between real and sketch stabilizes, and the forest settles into permanent autumn-gold warmth.

**Passive World Effect**:
- Flickerveil gains +10 vibrancy and the flickering effect stabilizes: trees no longer oscillate between rendered and sketch. The forest becomes permanently golden-lit, like an eternal sunrise.
- All zones in the game gain a subtle warm tint during the "daytime" cycle — the ambient lighting shifts from neutral to golden
- The Flickering Village stabilizes completely: buildings stop shimmering and become solid. 4 new NPCs arrive (attracted by the stability), turning it into a proper settlement with a shop and inn.
- Visibility in all zones increases: the player can see enemy sprites from 2 tiles farther away (effectively extending the "visible on overworld" bonus from vivid zones to all zones)

**Player Buff — "Dawn's Clarity"**:
- Passive: The player gains +15% accuracy on all attacks and +10% critical hit chance (Solara's light reveals weak points)
- Active (once per battle): "Solara's Radiance" — illuminate the battlefield for 3 turns. All allies gain +20% accuracy, all enemies lose any invisibility/stealth effects, and hidden enemy weaknesses are revealed (element vulnerability displayed above enemy sprites).

**NPC Behavior Changes**:
- NPCs become optimistic and proactive. Frontier settlers begin expansion projects. The Flickering Village residents start building a road toward the Settled Lands. Ridgewalker Camp begins constructing a proper waystation.
- Solen (Flickerveil elder) becomes Solara's high priestess and offers a new service: "Light Reading" — she can analyze any memory fragment and predict what world effect broadcasting it at a specific location would have (tells the player exact vibrancy gain before committing the fragment).
- Children NPCs appear in settlements for the first time (the world is stable enough for families to feel safe raising kids). They offer simple, joyful quests with small but unique rewards.

**Side Quests Unlocked**:
1. **"The First Sunrise"** — Solara asks the player to climb to the Apex (20, 5) in the Undrawn Peaks and broadcast a joy-type fragment at the highest point in the game. Doing so creates a "sunrise beacon" — a permanent golden light visible from every outdoor zone in the game, appearing as a small sun-like dot on the northern horizon. This beacon has a gameplay effect: in every zone, vibrancy decay from Preserver reinforcement is reduced by 1 point per tick (the light weakens their crystallization). Reward: 600 gold, 1 potency-5 joy fragment, and the Sunstone Ring (accessory: +10 INT, +10 AGI, dawn attacks — the first attack each combat deals 25% bonus light damage).
2. **"Solara's Lanterns"** — light lanterns in 5 settlements (Village Hub, Heartfield, Millbrook, Ridgewalker Camp, Flickering Village) by broadcasting light-element fragments into designated lamp posts. Once all 5 are lit, the settlements gain permanent "nighttime" illumination (no gameplay change but significant visual upgrade: warm lantern glow, fireflies, cozy atmosphere), and each settlement's shop permanently adds one new rare item to its stock. Reward: 400 gold, 5 unique light-element fragments (potency 2, useful for future broadcasts), and the Lantern Keeper's Cloak (armor: DEF +12, immunity to Blind status).

---

#### Fury → **Pyralis, God of the Searing Truth**

**Domain**: Purification, burning away falsehood, the fury of light that cannot be denied, exposure

**The Transformation**: The prism doesn't split the light — it focuses it into a single searing beam that cuts across the grove, burning a straight line through the canopy. Pyralis emerges from the beam: a figure of white-hot light, sharp-edged and angular, with eyes like twin suns. He speaks (voice like a magnifying glass focusing sunlight to a point): "What hides in shadow rots. I am the burning eye." The grove transforms: the flickering stops, but not gently — the sketch-outlines are burned away, leaving only the solid, real trees standing in harsh, brilliant light. Shadows are razor-sharp.

**Passive World Effect**:
- Flickerveil gains +10 vibrancy, but the aesthetic becomes stark and high-contrast — brilliant light, deep shadows, no soft edges
- Preserver agents across all zones become visible on the overworld map (marked with a light-red indicator). They can no longer hide within stagnation zones or ambush the player.
- Stagnation zones in Flickerveil are weakened: the Resonance Archive's Preserver garrison loses its defensive advantage (the archive's occupation bonus is nullified — Preserver agents there fight at normal strength instead of boosted)
- All "hidden" items, passages, and interactable objects in the game gain a subtle glowing outline, making exploration more transparent

**Player Buff — "Searing Gaze"**:
- Passive: All light-element attacks deal 25% bonus damage. Enemies afflicted with Blind take 15% more damage from all sources.
- Active (once per battle): "Pyralis's Judgment" — single-target light attack dealing 200% of player's INT as light damage. If the target has any buffs, they are all removed before damage is calculated.

**NPC Behavior Changes**:
- NPCs become more honest and direct. Dialogue that was previously evasive or cautious becomes blunt. NPCs who were hiding secrets reveal them (several minor NPCs have small hidden quest hooks that only become visible after Pyralis's recall).
- Solen (Flickerveil elder) becomes conflicted — she loves that the flickering is gone but fears Pyralis's harshness. Her dialogue explores the tension between truth and gentleness.
- Preserver agents who encounter the player begin with a new dialogue option: "We know you can see us. There's no point hiding." Some agents offer information in exchange for being left alone (yields fragments and tactical intel).

**Side Quests Unlocked**:
1. **"The Burning Archive"** — Pyralis demands the liberation of the Resonance Archive (10, 10) in Flickerveil. The Preserver garrison (3 agents + defenses) is weakened by Pyralis's light and can be challenged directly. The battle is easier than normal (agents have -20% stats due to the searing light exposing their weaknesses). Upon clearing the archive, the player gains access to all 5 fragments within and the archive becomes a permanent lore library — visiting it allows the player to "read" any dissolved memory fragment for bonus backstory text. Reward: 5 collectible fragments (potency 3-5 mix), 500 gold, and the Lens of Truth (accessory: +15 INT, reveals enemy HP bars permanently, critical hits deal 20% bonus damage).
2. **"Shadows of the Curator"** — Pyralis reveals that the Curator has been projecting "shadow agents" — illusory Preservers that aren't real but consume the player's time and resources. These shadow agents are found in 3 locations (one in Shimmer Marsh, one in Hollow Ridge, one in Resonance Fields). The player must travel to each location and use Pyralis's light to expose them (broadcast a light-element fragment at each shadow). Exposing all 3 reveals a hidden message from the Curator, providing early insight into the Curator's true motivation and the location of a secret Depths entrance. Reward: 400 gold, 1 potency-4 fury fragment, and early access to a Depths Level 5 shortcut.

---

#### Sorrow → **Vesperis, God of the Twilight**

**Domain**: Transitions, endings that aren't death, the bittersweet beauty of fading light, dusk, acceptance

**The Transformation**: The column of light slowly dims — not going out, but softening into the warm, amber-purple spectrum of sunset. Vesperis emerges from the fading prism as a figure of twilight colors: deep purple, amber, rose-gold. Her form is translucent at the edges, as if she's always on the verge of dissolving into the light she governs. She speaks (voice like a lullaby at the end of a long day): "Not every light needs to blaze. Some lights are kindest when they soften." The grove transforms: the harsh flickering becomes a gentle pulse, like breathing, and the forest settles into a permanent golden-hour glow.

**Passive World Effect**:
- Flickerveil gains +10 vibrancy, manifesting as a permanent twilight atmosphere — warm amber light, long shadows, fireflies at all times
- The entire game's ambient lighting gains a subtle sunset warmth. The sky in all zones shifts slightly toward golden-hour tones.
- Dissolved memory encounters in the Depths become non-hostile: dissolved ghosts that would normally fight now speak first, offering dialogue and fragments before combat (player can choose to fight or accept their offerings peacefully)
- The Veil's Edge (48, 25) transition between Flickerveil and the Sketch softens: the abrupt 3-4 tile transition becomes a gradual 10-tile gradient, making the boundary less jarring and the Sketch less alienating

**Player Buff — "Twilight Grace"**:
- Passive: When any ally drops below 25% HP, they automatically receive a heal equal to 15% of their max HP (once per battle per ally). This triggers without using a turn.
- Active (once per battle): "Vesperis's Lament" — all enemies have their ATK and INT reduced by 25% for 3 turns (the twilight saps their aggression).

**NPC Behavior Changes**:
- NPCs become gentler and more reflective. Callum shares memories of his youth that he normally keeps private. Frontier NPCs stop framing everything as a fight against the Preservers and start talking about coexistence.
- Solen (Flickerveil elder) weeps with relief — the twilight is what she always believed the grove should become. She offers the player a unique "Twilight Meditation" interaction that fully restores HP/SP and grants a temporary +10% XP boost for 10 minutes.
- Preserver agents in Flickerveil become visibly conflicted. 2 of the 3 garrison agents approach the player for voluntary dialogue, expressing doubts about the Curator's absolute stance. One offers to defect.

**Side Quests Unlocked**:
1. **"The Defector"** — One Preserver agent (name: Elyn) from the Flickerveil garrison approaches the player after Vesperis's recall and asks to leave the Preservers. The player must escort Elyn safely to the Flickering Village (avoiding 2 Preserver ambush encounters along the way). Once safe, Elyn provides detailed intelligence about the Preserver Fortress layout (reveals the map layout of Floor 1 in the Act III final dungeon, giving the player advance knowledge). Elyn becomes a permanent NPC at the Flickering Village, offering Preserver-history lore and selling unique items: Crystal Dust (consumable, 200g, removes all debuffs) and Stasis Shard (consumable, 150g, freezes one enemy for 1 turn). Reward: 400 gold, 1 potency-4 sorrow fragment, Elyn's intelligence report (key item), and access to Elyn's shop.
2. **"The Twilight Vigil"** — Vesperis asks the player to hold a vigil at each of the 4 dormant god shrine locations (including ones not yet recalled). At each shrine, the player broadcasts a sorrow-type fragment and witnesses a "twilight vision" — a 30-second cinematic showing the dissolved civilization that created that god during their final moments before dissolution. These visions are among the game's most emotionally resonant content: each one shows people choosing to let go, not in despair but in trust. Completing all 4 vigils grants a deep understanding of why civilizations dissolve. Reward: 500 gold, 4 unique lore entries (permanently viewable in the memory collection menu), 1 potency-5 sorrow fragment, and Vesperis's Lantern (key item: when used at any Resonance Stone, reveals the full emotional spectrum of all fragments that stone contains, allowing the player to choose before collecting).

---

#### Awe → **Prisma, God of the Living Spectrum**

**Domain**: Diversity of light, refraction, the idea that one truth becomes many truths when viewed from different angles, wonder

**The Transformation**: The prism shatters into a thousand fragments — but instead of falling, each shard becomes a beam of a different color, spiraling outward in a double helix. Prisma coalesces from the spiral: a figure of constantly shifting rainbow light, no two moments the same color, features that seem to change depending on the angle of view. She speaks (voice that harmonizes with itself in multiple tones simultaneously): "One light enters the prism. Many colors emerge. Both are true." The grove transforms: every surface becomes subtly prismatic — bark, leaves, water, stone all catch light in unexpected colors. The flickering doesn't stop but becomes beautiful: trees shift between different fully-rendered color palettes rather than between rendered and sketch.

**Passive World Effect**:
- Flickerveil gains +10 vibrancy, manifesting as a prismatic wonderland — every surface refracts light into soft rainbow edges
- The emotion-matching system becomes more flexible globally: fragments with "partial" emotion matches (see [vibrancy-system.md](vibrancy-system.md)) now count as full matches for broadcast bonus calculations (+3 instead of +1)
- Memory fragment collection from all sources gains a 15% chance to yield a "prismatic" variant: a fragment that counts as ALL emotion types simultaneously. Prismatic fragments are extremely valuable for both broadcasting and recall.
- The Flickering Village develops a unique property: its buildings now shift between different architectural styles (thatch → stone → crystal → wood) on a slow cycle, each version functional and beautiful

**Player Buff — "Spectral Shift"**:
- Passive: The player's attacks randomly cycle between all element types each turn (fire → water → wind → earth → light → dark). This makes the player unpredictable — there is always a chance of hitting an enemy's weakness.
- Active (once per battle): "Prisma's Refraction" — for 3 turns, every attack the party makes is duplicated as a second hit of the opposing element (fire attack also hits as water, light attack also hits as dark, etc.). Each hit deals 60% of normal damage.

**NPC Behavior Changes**:
- NPCs become curious and experimental. Frontier settlers try new building techniques, new crops, new social arrangements. The Flickering Village becomes a hub of innovation.
- Solen (Flickerveil elder) is delighted and becomes a "Prism Scholar" — she begins cataloging all the different ways light behaves in the world, offering unique lore each time the player visits.
- Some NPCs develop the ability to see Resonance Stone memory content without touching the stones (a visual echo that plays near the stone's surface). These NPCs can preview fragment contents before the player collects them.

**Side Quests Unlocked**:
1. **"The Spectrum Walk"** — Prisma asks the player to experience every biome in the game through her prismatic lens. The player must visit 7 biome types (village, grassland, forest, riverside, mountain, marsh, plains) and broadcast a light-element fragment in each. At each location, the biome temporarily shifts to a prismatic variant for 30 seconds — a visual feast showing the biome in all its potential color states simultaneously. Each visit yields a unique "spectrum fragment" (potency 3, prismatic emotion type). Collecting all 7 and bringing them to Luminos Grove unlocks a global visual upgrade: subtle rainbow shimmer on all vivid-tier tiles. Reward: 7 prismatic fragments, 500 gold, and the Kaleidoscope Lens (accessory: +10 INT, +10 AGI, prismatic fragment drop rate doubled to 30%).
2. **"The Many-Colored Truth"** — Prisma reveals that the Curator's worldview is monochromatic — they see only one "correct" state for each memory. The player must find 4 "frozen perspectives" in stagnation zones (one per Frontier stagnation zone). Each frozen perspective is a crystallized moment that the Curator considers "perfect." The player broadcasts a prismatic or light-element fragment into each one, causing it to refract into multiple versions — showing that the "perfect" moment actually contained many interpretations. This doesn't break the stagnation zone but plants seeds of doubt in the crystal structure. In Act III, these seeds cause visual cracks in the Preserver Fortress walls. Reward: 400 gold, 4 prismatic fragments, and the Curator's Doubt (key item: in the final confrontation with the Curator, provides a unique dialogue option that makes the Curator hesitate, removing one phase from the final encounter).

---

## God IV: Kinesis — The Dormant God of Motion

### Origin

**Created by**: The **Peregrine Road**, a civilization of explorers, engineers, and kinetic artists. They weren't settlers — they were eternal travelers. They carved the world's first mountain passes, bridged its first rivers, and mapped routes that would become trade roads. They believed that stillness was a kind of death, and that true life was motion: the flow of water, the migration of animals, the drift of clouds, the pulse of the earth itself.

**Why they dissolved**: The Peregrine Road never stayed in one place long enough to build a permanent civilization. When they'd mapped every route and bridged every gap, they faced a paradox: to stop moving was to die, but there was nowhere left to go. They dissolved their memories into the world's kinetic forces — wind currents, tidal patterns, tectonic shifts, the spinning of weather systems — ensuring that the world itself would never stop moving, even after they were gone. Their final act was leaving Kinesis dormant atop their highest spire, a monument to motion frozen in a single, vibrating moment.

**Their legacy**: The wind that shapes the Frontier, the river that feeds Millbrook, the seismic energy beneath Hollow Ridge, and the subtle currents that cause the Sketch to shimmer and shift — all of these are the Peregrine Road's dissolved memories, still moving.

### Dormant State

**Location**: Kinesis Spire, Hollow Ridge (25, 10) — see [geography.md](geography.md)

**Appearance**: A towering natural rock pillar, 3 tiles wide and 8 tiles tall, visibly vibrating. The stone surface is covered in carved route-maps: spiraling paths, branching roads, and directional arrows etched by the Peregrine Road. Small rocks orbit the spire's peak in a slow ellipse. The ground within 5 tiles shakes rhythmically — not violently, but like a steady heartbeat transmitted through the stone. Approaching the spire, the player's movement speed increases slightly (10% boost), as if the god's dormant energy is accelerating everything nearby.

**Discovery trigger**: The player must first visit the Ridgewalker Camp (15, 25) in Hollow Ridge and speak with the camp leader, a woman named Petra who has spent her life studying the Spire from a safe distance. She gives the player a pair of "Kinetic Boots" (key item) — weighted boots that prevent the player from being knocked off the increasingly unstable path leading to the spire's base. Without the boots, the vibrating terrain forces the player back every 3 tiles (a gentle push, not damage — the god is rejecting approach, not attacking).

### Recall Options

---

#### Joy → **Jubila, God of the Joyful Stride**

**Domain**: Dance, celebration of movement, the joy of the journey, speed as expression, liberation

**The Transformation**: The Spire stops vibrating. For one held-breath moment, everything is still. Then Jubila leaps from the peak — a figure of golden wind and spinning momentum, feet never touching ground, body traced by afterimages in every color of motion: amber speed-lines, green flowing curves, blue spiral trails. She laughs (a sound like feet drumming on a festival stage), and the entire mountain range responds: rocks begin to dance, shifting into new formations. The Ridgewalker Camp's tents flap in a sudden warm wind. The mountain pass smooths — not flat, but flowing, like a road that was always meant to be there.

**Passive World Effect**:
- Hollow Ridge gains +10 vibrancy, manifesting as dynamic, kinetic terrain — rocks gently orbit each other, wind visibly spirals, paths pulse with faint golden light indicating the "best route"
- Player movement speed increases by 15% in all outdoor zones (permanent)
- The Shattered Pass (35, 30) in Hollow Ridge becomes traversable without puzzle-solving — the frozen rocks simply move aside, creating a clear path. (The puzzle is bypassed, not solved — the stasis remains but the path through it opens.)
- Fast travel between discovered zones becomes available: the player can "stride" between any two visited zone entrances (2-second transition, no animation, just a golden flash)

**Player Buff — "Swift Stride"**:
- Passive: The player always acts first in combat (guaranteed first turn, overriding AGI calculations). +20% evasion from the constant motion.
- Active (once per battle): "Jubila's Dance" — the player performs 3 rapid attacks against random enemies, each dealing 60% of normal ATK damage. If all 3 hit the same target, bonus 50% damage on the third hit.

**NPC Behavior Changes**:
- NPCs become more active and mobile. Settlers travel between settlements more frequently. NPCs who were previously static (staying in one building) now roam their zones, making them more interesting to encounter.
- Petra (Ridgewalker Camp leader) becomes Jubila's champion and begins organizing "Road Festivals" — celebrations of movement where NPCs from multiple settlements gather at rotating locations. Each festival is a mini-event with unique dialogue and a chance to earn joy-type fragments.
- A new NPC type appears: "Striders" — traveling merchants who move between all settlements on a daily cycle. Each Strider carries unique inventory that changes with each visit.

**Side Quests Unlocked**:
1. **"The Peregrine Circuit"** — Jubila challenges the player to run a circuit of the entire world: visit one landmark in every zone without resting or using fast travel. The circuit visits: Village Hub (Central Square) → Heartfield (Old Windmill) → Ambergrove (Hearthstone Circle) → Millbrook (Brightwater Bridge) → Sunridge (Wind Shrine) → Hollow Ridge (Kinesis Spire) → Shimmer Marsh (Verdance's Hollow) → Flickerveil (Luminos Grove) → Resonance Fields (Resonance's Amphitheater). Completing the circuit in one run (enemies can be fought or avoided, no timer) earns: 600 gold, 1 potency-5 joy fragment, and the Peregrine Boots (accessory: +20 AGI, +25% movement speed, immune to Slow status).
2. **"The Road That Remembers"** — Jubila reveals that the Peregrine Road carved a single, continuous path through the entire world that has been overgrown and forgotten. The player must find and clear 5 road markers (hidden in each Frontier zone + 1 in the Settled Lands). Each marker requires broadcasting a wind-element fragment to reveal the next section of road. Once all 5 are cleared, the Peregrine Road reappears as a visible golden path on all outdoor maps — following it grants +10% XP while on the road. Reward: 500 gold, the visible road (permanent exploration aid), and the Wayfinder's Compass (key item: always points toward the nearest uncollected memory fragment).

---

#### Fury → **Tecton, God of the Avalanche**

**Domain**: Unstoppable force, tectonic power, the fury of motion that reshapes landscapes, upheaval

**The Transformation**: The Spire cracks. Not shatters — cracks, like an egg, and something enormous pushes outward. Tecton emerges as a figure of fractured stone and molten seams: a giant (twice the player's height) made of mountain rock with veins of liquid amber flowing between the plates. He steps off the Spire's peak and the mountain shakes — not an earthquake, but a statement. "Everything moves. Nothing resists me forever." The surrounding mountains groan and shift: new passes crack open, the Shattered Pass unfreezes violently (ice and crystal exploding outward), and the entire Hollow Ridge map gains visible tectonic stress lines.

**Passive World Effect**:
- Hollow Ridge gains +10 vibrancy, manifesting as raw geological power — steam vents, visible fault lines glowing amber, rock faces that slowly shift between visits
- All stagnation zones develop visible cracks (cosmetic in zones not yet broken, but narratively significant — the crystal is straining under tectonic pressure)
- The Shattered Pass (35, 30) is completely broken open: the stagnation zone shatters without player intervention, yielding 2 bonus potency-3 fragments from the rubble
- A permanent seismic rumble is audible in all mountain and underground zones (subtle, adds atmosphere)

**Player Buff — "Tectonic Force"**:
- Passive: All physical attacks deal 10% bonus earth damage. Attacks against enemies with active shields/barriers deal 30% bonus damage (Tecton's force breaks through defenses).
- Active (once per battle): "Tecton's Quake" — AoE earth attack dealing 130% of player's ATK to all enemies. 50% chance to inflict Stagger (enemy loses next turn). Destroys any terrain-based enemy advantages.

**NPC Behavior Changes**:
- Mountain-dwelling NPCs become bolder and more ambitious. Ridgewalker Camp begins construction of a proper fortress. The camp doubles in size as new settlers arrive, attracted by the tectonic energy and Tecton's protection.
- Petra (Ridgewalker Camp leader) becomes Tecton's war-chief and begins training a militia. She offers combat training quests that yield XP bonuses.
- Underground Depths entrances become easier to find: tectonic shifts have exposed hidden passages, and all Depths entrances are now visible on the minimap (even ones the player hasn't discovered).

**Side Quests Unlocked**:
1. **"The Mountain's March"** — Tecton commands the player to literally reshape terrain. Choose one zone (Shimmer Marsh, Flickerveil, or Resonance Fields) and broadcast 3 earth+fury fragments into specific tectonic fault points. The zone's terrain permanently shifts: new paths open, a new hill or ridge forms (creating high ground with tactical advantages in combat), and a new Depths entrance is carved open (shortcut to deeper dungeon levels). The reshaped zone gains +5 vibrancy from the raw creative energy. Reward: 500 gold, 1 potency-4 fury fragment, and the Earthshaker Hammer (weapon: mace, ATK +40, AoE attacks have +15% area of effect).
2. **"Tecton's Challenge"** — Tecton respects strength. He challenges the player to defeat 3 "immovable" enemies — special elite monsters stationed at mountain passes and cave entrances that have been blocking travel routes. Each is a solo boss encounter: a Stone Colossus (high HP, high DEF, slow), a Crystal Warden (Preserver construct, stasis attacks), and a Petrified Drake (dormant dragon that Tecton's quake awakened). Defeating all 3 clears the travel routes permanently (new shortcuts between zones). Reward: 600 gold, 3 potency-4 fragments (earth, fire, dark), and Tecton's Fist (accessory: +15 STR, +15 DEF, critical hits cause a minor earthquake visual effect and +25% critical damage).

---

#### Sorrow → **Errantis, God of the Fading Footprint**

**Domain**: Entropy, the sorrow of journeys ended, wandering, the inevitable dissolution of all paths, acceptance of impermanence

**The Transformation**: The Spire's vibration slows. The orbiting rocks lose their orbit and drift away, each in a different direction, each leaving a faint amber trail that fades. Errantis materializes not from the Spire but from the trails — gathering like mist from the paths of things that have moved on. He is a figure of soft blue-gray, translucent, with trailing afterimages that take 3 seconds to fade. He walks (the first thing he does is walk, slowly, in a circle) and where his feet touch, the stone shows the footprints of everyone who ever stood there, fading like breath on glass. "Every road ends. Every step fades. But the walking mattered."

**Passive World Effect**:
- Hollow Ridge gains +10 vibrancy, but softly — the harsh mountain edges round, the wind calms, the terrain becomes more welcoming but subtly melancholic
- Across all zones, faint "memory trails" appear on the ground: translucent amber footprints showing paths that dissolved civilization NPCs once walked. These are cosmetic but lead to hidden Resonance Stones and fragment deposits (gentle exploration guide)
- Depths dungeons become less maze-like: "ghost paths" appear on dungeon floors, showing the routes previous explorers took. This reduces confusion in dungeon navigation.
- The Peregrine Road's dissolved memories become more accessible: 5 previously hidden fragments in Hollow Ridge become collectible (appearing near the Spire)

**Player Buff — "Fading Step"**:
- Passive: After the player moves to a new position in combat, they gain 25% evasion for 1 turn (afterimages confuse enemies). +15% chance to escape from combat encounters.
- Active (once per battle): "Errantis's Trail" — leave a "memory trail" in the player's current position. For 3 turns, any ally standing on the trail gains +20% to all stats. The trail fades after 3 turns.

**NPC Behavior Changes**:
- Traveler and explorer NPCs share stories of journeys they've taken and places they've been. Dialogue becomes wistful but warm — not depressing, more "remember that amazing sunset on the road?"
- Petra (Ridgewalker Camp leader) begins keeping a journal of all the routes the Ridgewalkers have discovered. She shares excerpts with the player (lore entries about the world's hidden paths and secret places).
- Dissolved memory encounters in the world become more vivid and detailed: Resonance Ghosts linger longer and share more complete memories before fading.

**Side Quests Unlocked**:
1. **"The Footprints of the Peregrine"** — Errantis asks the player to follow the memory trails of the Peregrine Road's last explorer — a Rootwalker who walked from the Village Hub to the edge of the Sketch in the civilization's final days. The trail passes through 6 zones (Village Hub → Sunridge → Hollow Ridge → Resonance Fields → Shimmer Marsh → Luminous Wastes). At each stop, the player finds a "Peregrine Fragment" — a potency-4 sorrow fragment with unique lore text describing the explorer's thoughts at that point in the journey. The final fragment at Luminous Wastes is potency 5 and describes the explorer choosing to dissolve at the world's edge, watching new land sketch itself into existence. Reward: 6 fragments (5 potency-4 + 1 potency-5), 500 gold, and the Peregrine's Journal (key item: reveals all hidden items and passages in any zone the player has visited for more than 5 minutes).
2. **"The Rest Stop"** — Errantis asks the player to create a place of rest for weary travelers at the Ridgewalker Camp. Requires broadcasting 2 sorrow-type and 1 calm-type fragment into designated spots in the camp. The camp gains a "Memorial Waypoint" — a stone marker with the names of all dissolved civilizations. This waypoint functions as a full rest point (HP/SP restore) and a fast travel anchor. Additionally, visiting the waypoint triggers a unique 20-second cinematic each time: a different dissolved memory plays, showing a moment of peace from a vanished civilization. There are 10 unique memories that cycle. Reward: 350 gold, 1 potency-3 calm fragment, and the Waypoint network gains a new node (if Floriana's Rootway is active, the Memorial Waypoint connects to it automatically).

---

#### Awe → **Vortis, God of the Eternal Momentum**

**Domain**: Perpetual motion, the awe of unstoppable forces, orbits, cycles that never end, cosmic scale

**The Transformation**: The Spire's vibration intensifies until the entire pillar is a blur. The orbiting rocks accelerate into visible rings — like a miniature planetary system. Vortis coalesces from the spinning energy: a figure of pure motion, body defined by orbiting particles of stone, light, and wind, never standing still, always rotating, always moving. Every surface of her body traces a different orbital path. She doesn't speak words — she creates them from the arrangement of her orbiting components, letters forming in the spaces between moving stones: "EVERYTHING IS IN ORBIT. NOTHING TRULY STOPS." The Spire becomes a permanent kinetic sculpture: orbiting stone rings at multiple speeds, visible from adjacent zones.

**Passive World Effect**:
- Hollow Ridge gains +10 vibrancy, manifesting as a perpetual kinetic energy field — floating rocks, spiral wind patterns, visible force lines in the air
- All combat speed mechanics increase: the turn counter advances 15% faster globally (battles are shorter, more intense)
- The player gains a permanent "momentum" mechanic: consecutive actions of the same type (3 attacks in a row, 3 heals in a row) gain increasing effectiveness (+5% per consecutive same-type action, caps at +25%)
- Hollow Ridge's zone connections improve: travel between Hollow Ridge and adjacent zones is instantaneous (no transition animation)

**Player Buff — "Orbital Force"**:
- Passive: The player gains a stacking "Momentum" counter in combat. Each consecutive attack adds +1 Momentum (max 5). Each point of Momentum adds +5% ATK. Momentum resets to 0 if the player uses a non-attack action (healing, item, defend).
- Active (once per battle): "Vortis's Orbit" — creates a shield of orbiting stones around one ally for 3 turns. The shield absorbs up to 40% of the ally's max HP in damage. Any melee attacker hitting the shielded ally takes 15% reflected damage.

**NPC Behavior Changes**:
- NPCs become fascinated by momentum and cycles. Settlers begin building windmills, water wheels, and other kinetic devices. The aesthetic of Frontier settlements shifts toward "things that move."
- Petra (Ridgewalker Camp leader) becomes a philosopher of motion, offering deep dialogue about how all change is movement and all movement is change. She develops a new training technique: "Momentum Sparring" — the player can practice combat at the camp for a +10% AGI buff lasting 30 in-game minutes.
- New "Courier" NPCs appear who run between settlements at high speed, carrying messages and small items. They offer a delivery service: the player can send items to any settlement's shop for later pickup.

**Side Quests Unlocked**:
1. **"The Perpetual Engine"** — Vortis challenges the player to build a kinetic sculpture at each of the 4 Frontier dormant god shrine locations (including shrines where gods have already been recalled — the sculptures orbit the existing shrine). Each sculpture requires: 1 wind-element fragment + 1 earth-element fragment broadcast at the shrine's base. Once all 4 are built, they form a linked orbital system: visible beams of kinetic energy connect all 4 shrines across the Frontier. This "engine" generates a permanent +1 vibrancy per game-hour to all Frontier zones (passive, ongoing, cumulative). Reward: 500 gold, 1 potency-5 awe fragment, and the Gyroscope Charm (accessory: +15 AGI, immune to knockback, Momentum counter cap increased from 5 to 8).
2. **"The Unstoppable Run"** — Vortis asks the player to prove that nothing can stop them. A timed challenge: reach the Crystalline Fortress Gate in the Undrawn Peaks from Kinesis Spire in under 3 minutes of real time. The route crosses through hostile territory (Hollow Ridge → Undrawn Peaks) with enemies that must be avoided (combat would take too much time). Completing the run under time earns the reward; there's no penalty for failure and it can be retried. Reward: 400 gold, 1 potency-4 awe fragment, and Vortis's Streak (weapon: dagger, ATK +30, AGI +20, each consecutive hit in the same combat adds +10% ATK to the next hit, no cap).

---

## Replay Value and Permanent Consequences

### Why Recall Is Permanent

Recall is irreversible because the god is **completed** — the unfinished prototype is given a final form. You cannot un-bake bread. The emotion used to recall a god permanently defines its identity. This mirrors the game's core theme: growth and change are permanent. You can't go back to what was. You can only choose what comes next.

This also prevents "save-scumming the optimal god." The game is designed so that every recall option is valuable and no option is strictly better than another. Different options open different gameplay possibilities, narrative paths, and side quests. The "best" choice is always the one the player is most excited about.

### Combinatorial Space

With 4 gods × 4 emotion options:
- Each playthrough makes 4 recall decisions
- Total possible god-state combinations: 4^4 = **256 distinct world configurations**
- Each configuration produces a unique combination of: passive world effects, player buffs, NPC behavior states, and available side quests
- Some side quests interact across gods (e.g., Floriana's Rootway connects to Sylvanos's root network; Harmonia's Accord interacts with Vesperis's Defector)

### Cross-God Interactions

When multiple gods are recalled, their effects stack and sometimes synergize:

| Combination | Synergy Effect |
|-------------|---------------|
| Cantara (Joy) + Floriana (Joy) | "Joyful World" — all NPC dialogue gains bonus warmth lines. Global vibrancy +3. |
| Tempestus (Fury) + Thornweald (Fury) | "Nature's Wrath" — Preserver reinforcement rate reduced to zero in all Frontier zones. |
| Tacet (Sorrow) + Autumnus (Sorrow) | "Gentle Fading" — all dissolved memory encounters become peaceful (no combat). Depths enemy encounter rate -30%. |
| Harmonia (Awe) + Prisma (Awe) | "Perfect Spectrum" — prismatic fragment drop rate increased to 40%. All emotion bonuses maximized. |
| Tempestus (Fury) + Tecton (Fury) | "Unstoppable Storm" — stagnation zones in the Frontier auto-break over time (15 minutes each, all simultaneously). |
| Tacet (Sorrow) + Vesperis (Sorrow) | "Twilight Silence" — the Preserver Fortress's first floor can be navigated without any combat encounters. |
| Solara (Joy) + Jubila (Joy) | "Dancing Dawn" — movement speed +30%, all zones gain golden-hour lighting permanently. |
| Sylvanos (Awe) + Vortis (Awe) | "The Living World" — the root network and orbital engine combine: +2 vibrancy per game-hour to all zones. |

These synergies are **not documented in-game** — they are emergent discoveries for observant players, adding another layer of replay experimentation.

### Narrative Impact on Act III

The gods recalled during Act II directly affect the Preserver Fortress (final dungeon) experience in Act III:

- **God aesthetics** appear in the fortress: if Floriana was recalled, vines crack through the crystal walls. If Tecton was recalled, tectonic fractures run through the floors. If Tacet was recalled, zones of silence disrupt Preserver patrols.
- **God-buffed dialogue** with the Curator: each recalled god provides a unique argument the player can make during the final confrontation. Recalling all 4 gods with the same emotion type triggers a special Curator response acknowledging the player's consistency (emotional commitment dialogue).
- **Endgame bloom**: when the First Memory is remixed, each recalled god fully awakens simultaneously. Their combined energy drives the global vibrancy surge to 95 (see [vibrancy-system.md](vibrancy-system.md)). The specific visual quality of the bloom depends on which gods were recalled and how.

---

## Summary Table

| God | Domain | Location | Joy Recall | Fury Recall | Sorrow Recall | Awe Recall |
|-----|--------|----------|------------|-------------|---------------|------------|
| Resonance | Sound | Resonance Fields (25, 25) | Cantara, God of the Living Song | Tempestus, God of the Thundersong | Tacet, God of the Necessary Silence | Harmonia, God of the Perfect Chord |
| Verdance | Growth | Shimmer Marsh (25, 35) | Floriana, God of the Endless Bloom | Thornweald, God of the Wild Overgrowth | Autumnus, God of the Falling Leaf | Sylvanos, God of the Deep Root |
| Luminos | Light | Flickerveil (20, 20) | Solara, God of the Golden Dawn | Pyralis, God of the Searing Truth | Vesperis, God of the Twilight | Prisma, God of the Living Spectrum |
| Kinesis | Motion | Hollow Ridge (25, 10) | Jubila, God of the Joyful Stride | Tecton, God of the Avalanche | Errantis, God of the Fading Footprint | Vortis, God of the Eternal Momentum |
