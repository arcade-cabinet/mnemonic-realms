# Act I Script: Awakening

> Cross-references: [docs/story/structure.md](structure.md), [docs/story/characters.md](characters.md), [docs/world/geography.md](../world/geography.md), [docs/world/setting.md](../world/setting.md), [docs/world/vibrancy-system.md](../world/vibrancy-system.md), [docs/design/classes.md](../design/classes.md), [docs/design/combat.md](../design/combat.md), [docs/design/memory-system.md](../design/memory-system.md), [docs/design/progression.md](../design/progression.md), [docs/design/items-catalog.md](../design/items-catalog.md)

## Overview

Act I spans the **Everwick** and **Settled Lands** (see [geography.md](../world/geography.md)). The player arrives as a newly recognized Mnemonic Architect, learns all core mechanics, explores four surrounding zones, builds relationships with key NPCs, and faces the Act I climax when the Stagnation Clearing expands and freezes Hana.

**Emotional arc**: Wonder → Learning → Growing confidence → Shock

**Level range**: 1-10 (see [progression.md](../design/progression.md))

**Estimated playtime**: 4-6 hours

**Scenes**: 12 scenes covering all Act I content

### Tutorial Integration Map

| Scene | Mechanic Taught | Location |
|-------|----------------|----------|
| Scene 1 | Movement, interaction, dialogue | Everwick (Elder's House) |
| Scene 2 | Memory fragments, collection | Everwick (Memorial Garden) |
| Scene 3 | Combat basics, party system | Everwick (Training Ground) |
| Scene 4 | Remix, broadcast | Everwick (Hana's Workshop) |
| Scene 5 | Exploration, environmental storytelling | Heartfield |
| Scene 6 | Stagnation zones (observation only) | Heartfield (Stagnation Clearing) |
| Scene 7 | Side quests, shops, NPC relationships | Ambergrove |
| Scene 8 | Remix strategy, element matching | Millbrook |
| Scene 9 | Advanced combat, party tactics | Sunridge |
| Scene 10 | Stagnation breaking (first active break) | Heartfield |
| Scene 11 | Preserver encounter, stakes escalation | Heartfield |
| Scene 12 | Crisis response, solo action | Heartfield → Everwick |

---

## Scene 1: A Familiar Place

**Location**: Everwick — Elder's House (18, 10), then Central Square (12, 14)

**Trigger**: Game start, after class selection screen

**Characters**: Player, Artun

**Time of day**: Morning

### Narrative Context

The player character has lived in this village their whole life. They are not a stranger or a newcomer. This morning is different because Artun has asked them to come to his house — he has something to show them.

### Dialogue

*[The player spawns inside Elder's House. Artun stands by his desk, a leather-bound journal open before him. Bookshelves line every wall. Morning light streams through the window.]*

**Artun**: There you are. Come in, come in — careful of the stack by the door, I haven't shelved those yet.

**Artun**: I asked you here because something's been on my mind. Sit down? No? You young ones never sit.

**Artun**: You know how I study the Dissolved — the civilizations that came before us? Well, I found something in my journals that I should have noticed years ago.

*[Artun picks up the journal and holds it toward the player.]*

**Artun**: This passage describes a talent the Dissolved called "Mnemonic Architecture." The ability to see memory where others see only stone and air. To collect it, reshape it, give it back to the world.

**Artun**: Sound familiar?

*[Player has no dialogue options — this is narrated, not interactive. The player's reactions are expressed through gameplay choices later.]*

**Artun**: You've always noticed things the rest of us don't. The way the fountain shimmers when no one's watching. The humming from the Resonance Stones when you walk past. That time you told Khali her shop "felt happy" and she thought you were being poetic.

**Artun**: You weren't being poetic. You were perceiving memory energy. You're a Mnemonic Architect, and we just didn't have a word for it until now.

**Artun**: A traveler came through last month — a woman named Hana. She recognized it in you immediately. She's been waiting at her workshop for you to be ready.

**Artun**: But first — take this. It's been sitting in my collection for thirty years, and I think it's been waiting for you.

*[Artun holds out his hands. A warm amber glow rises from his palms.]*

**Artun**: This is a memory fragment. My first lesson — the day my own teacher showed me how to see the world as it really is. It's a joyful memory. I'd like you to have it.

*[The player receives **MF-01: Artun's First Lesson** (Joy / Neutral / Potency 2). See [items-catalog.md](../design/items-catalog.md).]*

> **SYSTEM**: You received a Memory Fragment: "Artun's First Lesson" (Joy, Neutral, ★★)

**Artun**: Now go find Hana. Her workshop is south of the square — the building with the amber lanterns. She'll teach you what I can't.

**Artun**: Oh — and take the scenic route through the Memorial Garden, would you? I have a feeling the stones there have something to show you.

### Player Actions

- Move through Elder's House (teaches basic movement)
- Exit to Everwick exterior (teaches door/transition interaction)
- Walk south through Central Square (teaches map navigation)

### Rewards / Consequences

- **Item received**: MF-01: Artun's First Lesson
- **Quest activated**: "Find Hana" (main quest marker on Hana's Workshop)
- **Optional**: Player can explore Everwick freely. Talking to Khali, Hark, Nyro triggers brief intro lines but no quests yet.

---

## Scene 2: The Memorial Garden

**Location**: Everwick — Memorial Garden (8, 16)

**Trigger**: Player enters the Memorial Garden tile area

**Characters**: Player (solo)

**Time of day**: Morning

### Narrative Context

The Memorial Garden is a small green space with three Resonance Stones — pillars of ancient amber-gold stone that hum when touched. The garden is tended but modest. Flowers grow in clusters between the stones. This is where the player learns to **collect** memory fragments from the environment.

### Dialogue

*[As the player enters the garden, the three Resonance Stones pulse gently with amber light. The nearest stone's glow intensifies as the player approaches.]*

> **SYSTEM**: The Resonance Stone pulses with warmth. Something lingers here — a memory, waiting to be noticed.

*[The player interacts with the first Resonance Stone.]*

> **SYSTEM**: You reach toward the stone. A faint image surfaces: a child placing wildflowers between the stones, humming a wordless tune. The memory crystallizes in your hand.

*[The player receives an unnamed fragment: Joy / Earth / Potency 1.]*

> **SYSTEM**: You collected a Memory Fragment! (Joy, Earth, ★)
> Memory fragments hold emotions and elements. You can view your collection in the Memory menu.

*[The second Resonance Stone:]*

> **SYSTEM**: Another memory: an old woman sitting beside this stone in the rain, speaking to it like a friend. Her words are too faint to hear, but the feeling is clear.

*[The player receives an unnamed fragment: Calm / Neutral / Potency 1.]*

*[The third Resonance Stone:]*

> **SYSTEM**: This stone holds something deeper. A brief flash: a group of people, hands joined around these very stones, singing a song that makes the garden bloom. You feel the song more than hear it.

*[The player receives an unnamed fragment: Awe / Wind / Potency 2.]*

> **SYSTEM**: You now carry 4 memory fragments. Artun mentioned Hana's Workshop — she can teach you what to do with them.

### Player Actions

- Interact with three Resonance Stones (teaches collection mechanic)
- Each stone produces a brief narrated vision and a fragment
- Player can examine fragments in the Memory menu (teaches menu navigation)

### Tutorial Integration

**Mechanic taught**: Memory collection. The player learns that Resonance Stones and memory-rich objects yield fragments when touched. Each fragment has an emotion, element, and potency. The system messages introduce the vocabulary without overwhelming.

### Rewards / Consequences

- **3 fragments collected**: Joy/Earth/1★, Calm/Neutral/1★, Awe/Wind/2★
- **Total fragments**: 4 (including MF-01 from Artun)
- **Memorial Garden flowers**: Begin a subtle bloom animation (vibrancy nudges from 60→62 due to ambient collection energy — not a broadcast, just proximity)

---

## Scene 3: Hana's Workshop

**Location**: Everwick — Hana's Workshop (8, 18)

**Trigger**: Player enters Hana's Workshop

**Characters**: Player, Hana

**Time of day**: Late morning

### Narrative Context

Hana has been waiting. Her workshop is cluttered with Resonance Stone fragments, half-finished instruments, journals, and a large amber table in the center — the Remix Table. Hana is mid-30s, practical, warm. She speaks like someone who enjoys her work and is pleased to share it.

### Dialogue

*[The player enters the workshop. Hana stands beside the Remix Table, polishing a small Resonance Stone.]*

**Hana**: You must be the one Artun keeps talking about. I'm Hana — Mnemonic Architect, freelance, currently between assignments.

**Hana**: He told me you can see the shimmer around Resonance Stones. Most people can't. That's the first sign of the talent.

**Hana**: Show me what you've collected.

*[The player's fragment inventory appears briefly on screen — a visual grid showing all 4 fragments.]*

**Hana**: Four fragments already? From the garden stones? Good instincts. You didn't force them — you just... noticed. That's exactly right.

**Hana**: I want to travel with you for a while, if that's all right. Artun tells me you're curious about the world beyond the village, and there are things I can teach you better in the field than in a workshop.

> **SYSTEM**: Hana joins the party! (Cleric — simplified moveset: Joyful Mending, Sorrowful Cleanse, Awestruck Ward)

**Hana**: Before we head out, let's get you properly introduced. Come to the Training Ground — north of the square. Best to learn the basics of defending yourself before we go anywhere interesting.

### Player Actions

- Enter Hana's Workshop (dialogue auto-triggers)
- View fragment inventory during the conversation (teaches Memory menu)
- Hana joins the party (teaches party system)

### Tutorial Integration

**Mechanic taught**: Party system. Hana joins as a companion (Cleric class, simplified). The player sees the party UI for the first time. Hana has 3 skills and stats that follow the Cleric growth formula at player level - 1 (see [progression.md](../design/progression.md)).

### Rewards / Consequences

- **Companion gained**: Hana (Cleric, simplified)
- **Quest updated**: "Learn to fight" (main quest marker on Training Ground)
- **Item received**: Architect's Signet (K-01) — Hana gives it offhandedly: "Almost forgot. This marks you as one of us. You'll need it to interact with Resonance Stones properly." See [items-catalog.md](../design/items-catalog.md).

---

## Scene 4: The Training Ground

**Location**: Everwick — Training Ground (8, 10)

**Trigger**: Player enters the Training Ground with Hana in the party

**Characters**: Player, Hana

**Time of day**: Midday

### Narrative Context

The Training Ground is an open dirt area with chalk markings and practice dummies. Hana runs the player through two training fights, then teaches remix and broadcast at the Workshop afterward.

### Part A: Combat Tutorial

**Hana**: See those practice dummies? They're enchanted with a bit of memory energy — enough to fight back. Don't worry, they can't actually hurt you much.

*[Tutorial combat encounter triggers: 2 Training Dummies (HP 20 each, ATK 3, DEF 2, no skills, no drops). This encounter cannot result in Game Over — if the player drops to 1 HP, the dummies stop attacking.]*

> **SYSTEM — COMBAT TUTORIAL**:
> - **Attack**: Strike with your weapon. Damage depends on your ATK stat.
> - **Skill**: Use a class ability. Your skills cost SP (Skill Points).
> - **Item**: Use a consumable from your inventory.
> - **Defend**: Reduce incoming damage and recover a little SP.

*[During combat, Hana acts on her own turns, demonstrating Joyful Mending if the player takes damage.]*

**Hana** *(in combat)*: I'll keep you standing. Focus on the dummies — try your class skill when you have SP for it.

*[After victory:]*

**Hana**: Not bad at all. You're a natural.

*[Second encounter triggers: 1 Meadow Sprite (HP 35, ATK 5, DEF 5, drops 15 XP, 8 gold — tutorial-level enemy from Heartfield's table). This is a real enemy, summoned by Hana for training.]*

**Hana**: Now a real one. This little sprite wandered in from the fields south of here. It won't go easy on you — but it won't go hard, either.

*[Combat proceeds normally. The player is expected to win easily with Hana healing.]*

**Hana**: Well done! You earned that. Sprites drop a little gold and sometimes... yes, there it is.

*[After victory, if the 10% fragment drop triggers (scripted to succeed for the tutorial): the player receives an unnamed fragment: Joy/Earth/1★.]*

> **SYSTEM**: Some enemies carry trace memories. Defeating them can release these as fragments. (Boss enemies always drop fragments.)

### Part B: Remix and Broadcast Tutorial

*[Scene transitions back to Hana's Workshop after combat.]*

**Hana**: Now for the real work. Come back to the Workshop — I want to show you the Remix Table.

*[At the Remix Table:]*

**Hana**: You've got a handful of small fragments. Individually, they're minor — barely a whisper of memory. But combined?

**Hana**: Place two fragments on the table. Same emotion works best for your first try.

> **SYSTEM**: Select 2 fragments of the same emotion to Remix. (The two Joy/Earth/1★ fragments are highlighted as a suggested combination.)

*[The player combines 2 Joy fragments → produces 1 Joy fragment of Potency 2.]*

> **SYSTEM**: Remix complete! Two fragments combined into a stronger one. Remixing consumes the input fragments — choose carefully.
> **SYSTEM**: Unlock: Remix Table Access (K-03). You can now use any Remix Table in the game.

**Hana**: Beautiful. Feel the difference? That fragment has weight to it now.

**Hana**: One more thing. The most important thing.

*[Hana takes the player's hand and guides it toward a small potted plant on the workshop windowsill. The plant is pale and drooping — vibrancy is muted.]*

**Hana**: Broadcasting. This is how Architects change the world. Hold a fragment and push it outward — into the plant, into the room, into anything that can receive it.

**Hana**: Try it. Use the fragment I gave you earlier — the memory of my first broadcast. It seems fitting.

*[The player selects MF-02: Hana's Warmth (Joy / Light / Potency 3) from inventory and broadcasts it at the potted plant. A warm amber wave pulses outward from the plant. It straightens, colors deepen, and small flowers bloom along its stem.]*

> **SYSTEM**: You broadcast "Hana's Warmth" into the workshop. Vibrancy in Everwick increased by +12! (potency 3 × 3 = 9, +3 emotion match [Joy resonates with Everwick])
> The world remembers what you shared.

**Hana** *(softly)*: That was my memory — the first time I ever did this, years ago. And now you've given it back to the world. Better than it was.

**Hana**: That's what we do. Collect. Remix. Broadcast. The world gets brighter. Ready to see what's beyond the village?

### Player Actions

- Fight 2 tutorial combats (teaches Attack, Skill, Item, Defend)
- Observe Hana's healing in combat (teaches party AI)
- Remix 2 fragments at the Remix Table (teaches Remix)
- Broadcast MF-02 into the workshop (teaches Broadcast)

### Tutorial Integration

**Mechanics taught**: Full combat system (Attack, Skill, Item, Defend, turn order, victory rewards). Remix (combining fragments, potency increase, input consumption). Broadcast (targeting, vibrancy gain, visual bloom). This is the scene where all three core memory operations are understood.

### Rewards / Consequences

- **XP gained**: ~30 (from the two tutorial encounters)
- **Gold gained**: ~8
- **Fragment lost**: MF-02 (consumed by broadcast)
- **Vibrancy change**: Everwick 60→72 (crosses into Vivid at 67 — the player's first tier transition, triggering a brief visual bloom across the village. Flowers cascade, fountain sparkles, lanterns brighten.)
- **Key item**: K-03 Remix Table Access
- **Quest completed**: "Learn to fight"
- **Quest activated**: "Explore the Settled Lands" (markers on Heartfield, Ambergrove, Millbrook exits)

---

## Scene 5: Heartfield — The Open World

**Location**: Heartfield (Settled Lands — south of Everwick)

**Trigger**: Player exits Everwick via the South Gate

**Characters**: Player, Hana, Heartfield NPCs (procedural farmers)

**Time of day**: Afternoon

### Narrative Context

The player leaves the village for the first time. Heartfield is rolling golden farmland — safe, warm, and visually inviting at its starting vibrancy of 55 (Normal tier). This scene is not a scripted encounter but a structured exploration segment with ambient dialogue and optional interactions.

### Dialogue

*[As the player exits through the South Gate onto the Heartfield road:]*

**Hana**: The Settled Lands. Everything south, east, and west of the village for a day's walk. It's well-remembered territory — people have been living here for generations.

**Hana**: But look at the edges. See how the fence line over there just... stops? Like someone forgot to finish it?

*[The camera briefly pans to the eastern edge of Heartfield, where a wooden fence dissolves into shimmer.]*

**Hana**: The world's young. It's still being built. Most people don't think about it — they're used to things appearing when they need them. But we see the seams.

*[The player is free to explore Heartfield. The following ambient interactions are available:]*

#### Heartfield Hamlet (15, 15)

4-5 farming families. Each NPC has personality-variant dialogue. Example interactions:

**Farmer (near wheat field)**: The wheat's coming in well this season. Sometimes I swear it grows faster when we're happy about the harvest. Silly, right?

**Farmer's child (near stream)**: I found a pretty stone by the water yesterday! It was humming. Do all stones hum?

**Traveling merchant (rotating stock, visits the hamlet)**: Seeds, tools, and the odd potion. I walk the Settled Lands — Heartfield, Ambergrove, Millbrook. You'll see me around.

#### The Old Windmill (30, 8)

*[An abandoned windmill on a hilltop. The sails creak in the wind. Inside, a faint amber glow emanates from the floor — a Dissolved memory deposit.]*

**Hana**: This windmill's been abandoned for years. But look — there's memory here. Dense memory, from something old.

*[The player can interact with the Dissolved memory deposit: a brief vision plays of a miller who lived here long ago, grinding wheat and singing. The vision dissolves into warmth.]*

> **SYSTEM**: You found a Dissolved memory deposit. These contain memories from civilizations that chose to dissolve into the land.

*[The player receives an unnamed fragment: Calm/Earth/2★.]*

*[Loot: Windmill Blade (W-DG-03, ATK +13, +10% crit) — found in a chest at the top of the windmill. Rogue-only.]*

#### Random Encounters

The player encounters tutorial-level enemies while exploring: Meadow Sprites (passive, provoked only) and Grass Serpents (ambush from tall wheat). These yield 15-30 XP and 8-15 gold each (see [progression.md](../design/progression.md)).

### Player Actions

- Explore Heartfield freely (open-world exploration)
- Talk to NPCs for flavor dialogue and micro-quest hooks
- Collect Dissolved fragment at the Old Windmill
- Fight 4-6 random encounters (reaching level 3-4)
- Discover the Stagnation Clearing (leads to Scene 6)

### Tutorial Integration

**Mechanic taught**: Open-world exploration. The player discovers that the world has secrets, Dissolved deposits, ambient NPC interactions, and optional loot. There are no quest markers for most of this — the world rewards curiosity.

### Rewards / Consequences

- **Level**: Player reaches ~3-4 through encounters
- **Fragments**: 1-2 from exploration
- **Items**: Windmill Blade (if Rogue), miscellaneous enemy drops
- **Gold**: ~100-150 from encounters

---

## Scene 6: The Stagnation Clearing

**Location**: Heartfield — Stagnation Clearing (35, 30)

**Trigger**: Player approaches the Stagnation Clearing tile area

**Characters**: Player, Hana

**Time of day**: Afternoon (same session as Scene 5)

### Narrative Context

The Stagnation Clearing is a 5x5 patch of crystallized grass and frozen butterflies at Heartfield's southeast corner. It is hauntingly beautiful — everything is preserved in perfect detail, but nothing moves. This is the player's first encounter with the Preservers' work.

### Dialogue

*[The player approaches the clearing. The ambient audio fades — wind dies, birdsong stops. A crystalline tinkling replaces it.]*

**Hana** *(stops walking)*: Wait. Do you feel that?

*[The screen subtly desaturates at the clearing's edge. A 2-tile stagnation border shimmers with crystal overlay.]*

**Hana**: This is a Stagnation Zone. Something — someone — froze this patch of the world. Time stopped here. Change stopped.

*[The player enters the clearing. Butterflies hang mid-flight, their wings half-caught between flaps. Grass blades lean into a wind that no longer blows. A small Resonance Stone at the clearing's center is coated in blue-white crystal.]*

**Hana**: Look at the butterflies. Perfect. Every wing-scale, every spot of color. Beautiful, isn't it?

**Hana**: ...

**Hana**: But they'll never land. They'll never fly anywhere new. They're just... frozen. Forever.

**Hana**: I've seen these before, in the Frontier. The Preservers do this — people who think the world is too fragile to change. They freeze things to "protect" them.

**Hana**: This is small. Just a clearing. But they're getting bolder. I've heard reports of larger zones in the hills north of here.

*[Hana kneels by the crystallized Resonance Stone.]*

**Hana**: We could break it. A single fragment broadcast into this stone would shatter the stasis. But...

**Hana**: Not yet. I want to show you more of the Settled Lands first. When we come back, you'll understand what you're doing — and why it matters.

> **SYSTEM**: You've discovered a Stagnation Zone. The Preservers freeze the world to prevent change. Architects can break these zones by broadcasting memory fragments. You'll return here when you're ready.

### Player Actions

- Enter the Stagnation Clearing (observation only — cannot interact with the frozen stone yet)
- Listen to Hana's explanation of Preservers and stagnation
- Leave the clearing (the player can return anytime but the stone remains locked until Scene 10)

### Tutorial Integration

**Mechanic taught**: Stagnation zone awareness. The player sees what the Preservers do before understanding how to counter it. The delay between seeing the problem (Scene 6) and solving it (Scene 10) is intentional — it gives the discovery weight and builds anticipation.

### Rewards / Consequences

- **None** — this is a narrative scene. No fragments, no XP, no items.
- **Emotional effect**: The clearing should feel wrong. The silence, the frozen beauty, the contrast with Heartfield's living warmth. The player should want to break this.

---

## Scene 7: Ambergrove — Forest of Echoes

**Location**: Ambergrove (Settled Lands — east of Everwick)

**Trigger**: Player exits Everwick via the East Gate (or arrives from Heartfield's cross-country path)

**Characters**: Player, Hana, Ambergrove NPCs (Woodcutter's Camp)

**Time of day**: Player-driven (no time restriction)

### Narrative Context

Ambergrove is a dense deciduous forest with canopy-filtered light, winding paths, and a sense of old, quiet wonder. Starting vibrancy 45 (Normal). The player explores more dangerous enemies, finds the Hearthstone Circle (a major Dissolved memory site), and begins the NPC side quest system.

### Key Interactions

#### Hearthstone Circle (20, 10)

*[A ring of standing Resonance Stones in a forest clearing — six amber pillars arranged in a circle, each humming a different note. The air shimmers with dissolved memory energy.]*

**Hana**: This is a Hearthstone Circle. Before the Dissolved chose to let go, they gathered in places like this. Their strongest memories are still here — more concentrated than anything in the village.

*[The player interacts with 3 of the 6 stones (the others are dormant, to be activated later). Each yields a fragment:]*

- Stone 1: Sorrow/Light/2★ — *A memory of farewell: people embracing before a long journey.*
- Stone 2: Awe/Wind/2★ — *A memory of first flight: someone discovering they could leap between treetops.*
- Stone 3: Joy/Earth/2★ — *A memory of planting: the first tree in what would become this forest.*

**Hana**: Three fragments from a single site — that's a rich deposit. The Dissolved who gathered here must have shared deep memories before they let go. We should use these wisely.

*[Loot: Hearthstone Staff (W-ST-03, INT +14, Sorrowful Cleanse heals bonus) — found by examining the central clearing between the stones. Cleric-only.]*

#### Amber Lake (30, 25)

*[A placid forest lake. At its center, half-submerged, a Resonance Stone hums deeply. The hum is audible from shore but the stone cannot be reached.]*

**Hana**: That stone in the lake... I can hear it from here. Can you?

**Hana**: It's dormant, but not empty. Whatever it's carrying is strong. Too strong for us right now — we'd need to be much further along in our training to handle a memory that dense.

> **SYSTEM**: The submerged Resonance Stone hums with immense memory energy. It cannot be activated until Act II.

#### Woodcutter's Camp (10, 30)

*[A small NPC settlement — 3 woodcutters living in simple cabins among the trees. They are friendly but concerned.]*

**Woodcutter Bren**: Welcome! Don't get many visitors. We're kept busy — the forest grows faster than we can map it. New paths appear overnight. Yesterday a whole grove sprouted where there was bare dirt.

**Woodcutter Halla**: Bren's exaggerating. Mostly. But there IS something strange in the east — past the canopy walkways, the trees start to... flicker? Like they can't decide whether they're real.

*[Side quest trigger:]*

**Woodcutter Mirren**: I lost my marking axe somewhere near the Canopy Path. It's got my initials carved in the handle — family piece. I'd go look myself, but those Thornback Beetles have been aggressive lately. Any chance you could find it?

> **QUEST**: "Mirren's Marking Axe" — Find the lost axe near the Eastern Canopy Path. Reward: Forest Weave armor (A-05, DEF +12, +10% evasion).

#### Encounters

Enemies: Forest Wisps (float between trees, magic attacks), Thornback Beetles (ground-based, armored). Difficulty: early game, harder than Heartfield. Yield 25-50 XP and 10-18 gold.

### Player Actions

- Explore Ambergrove (forest exploration, tighter paths than Heartfield's open fields)
- Collect 3 fragments from Hearthstone Circle
- Observe Amber Lake dormant stone (foreshadowing Act II)
- Accept side quest from Woodcutter's Camp
- Complete "Mirren's Marking Axe" (find the axe near Canopy Path, fight 2-3 Thornback Beetles)
- Fight 6-8 random encounters

### Tutorial Integration

**Mechanic taught**: Side quests and NPC relationships. The woodcutters introduce the idea that NPCs have problems the player can solve. Completing quests rewards items (not XP — quests give gold, items, and fragments, while XP comes from combat; see [progression.md](../design/progression.md)).

### Rewards / Consequences

- **Level**: Player reaches ~5-6
- **Fragments**: 3 from Hearthstone Circle, possible enemy drops
- **Items**: Hearthstone Staff (Cleric), Forest Weave armor (quest reward)
- **Gold**: ~200-250 cumulative
- **Quest completed**: "Mirren's Marking Axe"

---

## Scene 8: Millbrook — River of Memory

**Location**: Millbrook (Settled Lands — west of Everwick)

**Trigger**: Player exits Everwick via the West Gate (bridge crossing)

**Characters**: Player, Hana, Millbrook NPCs (town residents)

**Time of day**: Player-driven

### Narrative Context

Millbrook is the largest Settled Lands settlement — a proper riverside town with bridges, shops, and ~20 NPCs. Starting vibrancy 50 (Normal). The player encounters a more complex remix puzzle, a specialty shop, and the Upstream Falls secret area.

### Key Interactions

#### Millbrook Town (15, 15)

*[A bustling riverside town. Stone bridges cross the Brightwater River. Market stalls line the quay. NPCs walk between buildings with purpose.]*

**Hana**: Millbrook. More people here than anywhere outside the village. They've got a specialty shop — river-themed goods, mostly. And the bridge has a Resonance Stone built right into its keystone.

*[The Millbrook specialty shop is immediately accessible. Stock:]*
- Brightwater Saber (W-SW-04): 400g
- Riverside Crosier (W-ST-04): 380g
- Riverstone Plate (A-06): 450g
- Haste Seed (C-BF-04): 100g

*[Most of these are too expensive right now. The player has ~200-300g cumulative at this point. This encourages returning later or prioritizing.]*

**Shopkeeper Orin**: Welcome to Orin's Riverside Goods! Everything's river-sourced — the metal in those blades? Pulled from the riverbed. Sharp as the current and twice as pretty.

#### The Brightwater Bridge (20, 20)

*[The town's centerpiece — a large stone bridge with a Resonance Stone built into its keystone. The stone glows faintly.]*

**Hana**: This bridge has been here longer than the town. The stone in the keystone predates everything — it's Dissolved-era. The whole bridge was remembered into existence around it.

*[The player can interact with the keystone stone. It yields a fragment: Awe/Water/2★.]*

**Hana**: A water-and-awe fragment from a bridge stone. That makes sense — whoever remembered this bridge into being must have felt awe at what they were creating.

#### Upstream Falls (8, 5) — Secret Area

*[A waterfall at the map's northwest. Behind the falls, a shallow cave entrance is hidden. The player must walk through the waterfall's edge tiles to discover it.]*

> **SYSTEM**: You found a hidden passage behind the waterfall!

*[Inside: a Dissolved memory grotto. Luminous amber veins line the cave walls. Two high-potency fragments are embedded in the stone:]*

- Fury/Water/3★ — *A memory of a flood: not destructive, but the sheer force of water breaking through stone to create this waterfall.*
- Sorrow/Water/3★ — *A memory of a river changing course, leaving a village behind. Bittersweet: the village was saved by the change, but lost the river they loved.*

**Hana** *(if in the grotto)*: Three-star fragments. From the Dissolved era. These are powerful — don't waste them on small broadcasts. Save them for when you really need to push back against something.

#### Remix Strategy Moment

*[After collecting the water-element fragments, Hana offers remix guidance:]*

**Hana**: You've got several water-element fragments now, and some from different emotions. Want to try something?

**Hana**: If you remix two fragments of the same emotion, you get a stronger version of that emotion. But if you remix two different emotions... you can create compound feelings. Joy and fury become inspiration. Sorrow and awe become reverence.

**Hana**: There's no wrong answer. But matching the emotion to where you'll broadcast can make a big difference. Millbrook responds to joy — it's a happy place. The marsh to the south, if we ever go there, responds to sorrow.

> **SYSTEM**: Remix tip: match the fragment's emotion to the zone's resonant emotion for a bonus when broadcasting. See the Memory menu for zone emotion details.

#### Fisher's Rest (30, 30) — Fishing Minigame

*[A dock area at the southeast. An NPC offers fishing.]*

**Fisher Lane**: Try your luck? The river's full of memory-touched fish. Most are just fish, but sometimes they carry tiny fragments. Just between us — there's a rhythm to it. Cast, wait, feel the tug.

*[Fishing minigame: simple timing mechanic. 1 in 5 catches yields a fragment (Calm/Water/1★). The rest yield small gold (5-10g). The minigame is optional and infinitely repeatable.]*

#### Encounters

Enemies: River Nymphs (water magic, spawn near water tiles), Stone Crabs (armored, near riverbanks). Difficulty: early-mid game. Yield 25-50 XP and 12-20 gold.

### Player Actions

- Explore Millbrook town (market, shops, NPC dialogue)
- Collect fragments from the Brightwater Bridge and Upstream Falls
- Practice remix strategy with Hana's guidance
- Discover and explore the hidden grotto behind the waterfall
- Try the fishing minigame (optional)
- Fight 4-6 encounters

### Tutorial Integration

**Mechanic taught**: Remix strategy. The player learns about emotion-matching zones, compound emotions, and fragment conservation. The Millbrook specialty shop teaches economic awareness — items exist that the player can't yet afford, incentivizing return visits.

### Rewards / Consequences

- **Level**: Player reaches ~6-7
- **Fragments**: 3-4 (bridge stone, 2 from grotto, possible fishing/enemy drops)
- **Gold**: ~100-200 from encounters and fishing
- **Items**: Potentially a Millbrook shop weapon if the player has saved gold

---

## Scene 9: Sunridge — The World's Edge

**Location**: Sunridge (Settled Lands — north of Everwick, unlocks after returning to Village from Millbrook/Ambergrove)

**Trigger**: Player enters Sunridge from the Everwick north exit. Sunridge is accessible from the start of Act I but Hana recommends visiting last.

**Characters**: Player, Hana, Sunridge NPCs (Ridgetop Waystation), Preserver Scout (non-combat)

**Time of day**: Player-driven

### Narrative Context

Sunridge is the transition zone — wind-blown highlands where the player can see the Frontier's shimmer on the horizon. Starting vibrancy 40 (Normal, but lower than other Settled Lands). The enemies are harder, the Preserver Outpost introduces the antagonist faction directly, and the Wind Shrine hints at dormant gods.

### Key Interactions

#### Ridgetop Waystation (20, 20)

*[A small traveler's outpost on a plateau. 3 NPCs shelter behind a stone wall from the highland wind. A traveling merchant visits here.]*

**Waystation Keeper Holt**: Careful up here. The wind's stronger than it looks, and the creatures are tougher than down in the fields. Hawks, golems — nothing friendly.

**Traveling Merchant Sera** *(rotating stock, appears 50% of visits)*: I walk the border between the Settled Lands and whatever's beyond. Picked up some interesting things. Want to see?

*[Sera's stock: 2 random Tier 1 consumables at normal price, 1 random unnamed fragment (2★, random emotion/element) for 150g.]*

#### Wind Shrine (10, 8)

*[A ruined shrine on the highest point. Stone pillars frame a flat altar. The wind howls through gaps in the stone, creating an almost-musical sound. A Resonance Stone at the shrine's center vibrates intensely.]*

**Hana**: This shrine is old. Pre-Dissolved old. Whoever built this was trying to capture something — the wind itself, maybe.

*[The Resonance Stone cannot be activated — interacting with it produces a brief flash of sensation: a rush of speed, the ground falling away, a joyous shout lost in the wind. Then nothing.]*

> **SYSTEM**: The Resonance Stone vibrates with overwhelming energy. Something immense sleeps here — a memory too large for you to hold. Not yet.

**Hana**: Did you feel that? Speed. Motion. Joy of movement. Whatever's in that stone isn't just a memory — it's something alive. Dormant, but alive.

**Hana**: I've read about things like this in Artun's journals. He calls them "dormant gods." Prototypes — incomplete deities left behind by the Dissolved. If the right memories were channeled into them...

**Hana**: But that's far beyond what we can do right now. Let's keep it in mind and move on.

#### Preserver Outpost (32, 15)

*[A crystallized watchtower at Sunridge's eastern edge. The stone is coated in blue-white crystal, identical to the Stagnation Clearing but much larger — a full tower, 3 tiles tall, surrounded by a 3x3 crystal zone. A single Preserver Scout stands at attention outside the crystal perimeter.]*

*[As the player approaches within 5 tiles:]*

**Preserver Scout** *(raises a hand, palm outward — a stop gesture)*: Halt. This area is under preservation protocol. You may observe, but do not approach the watchtower.

**Hana**: Who are you?

**Preserver Scout**: I am a watcher for Grym. We maintain the borders — ensuring that the settled regions remain... stable. Unchanged. Safe.

**Hana**: You call this safe? You've frozen an entire watchtower.

**Preserver Scout** *(calmly)*: We've preserved it. This tower was built by a civilization that chose to dissolve. In a generation, their work would have crumbled. Now it will endure forever. Every stone, every chisel mark. Exactly as it was.

**Hana**: Exactly as it was. And never anything more.

**Preserver Scout**: That is the point.

*[The scout turns away. The conversation ends. The player cannot interact with the Preserver Outpost further — it cannot be cleared until Act II.]*

**Hana** *(after the scout leaves)*: The Preservers. That's who made the clearing in Heartfield. That's who's doing this.

**Hana**: They're not monsters. That scout was polite, even reasonable. But they want to freeze the whole world. Every stone, every river, every person — "exactly as it was."

**Hana**: We need to go back to Heartfield. I think it's time you learned to break a stagnation zone.

> **QUEST**: "Break the Stagnation Clearing" — Return to Heartfield's Stagnation Clearing and broadcast a memory fragment into the crystallized Resonance Stone.

#### The Threshold (20, 2)

*[The northern map edge. The grass becomes shorter, colors soften, shapes blur slightly.]*

> **SYSTEM**: Beyond this point lies the Frontier — the world's unfinished middle. The path north is blocked by a mountain pass that requires permission to traverse.

*[The mountain pass is physically passable but a scripted barrier prevents entry until Act II.]*

#### Encounters

Enemies: Highland Hawks (fast, evasive), Crag Golems (slow, high DEF). Difficulty: mid game — noticeably harder than Heartfield/Ambergrove. Yield 30-50 XP and 15-20 gold.

### Player Actions

- Explore Sunridge (elevated terrain, limited paths, windy)
- Visit Ridgetop Waystation (rest stop, merchant)
- Discover Wind Shrine (foreshadowing dormant gods / Kinesis)
- Confront Preserver Scout at the Outpost (dialogue only, no combat)
- Receive quest to return to Heartfield for stagnation breaking
- Fight 4-8 encounters against harder enemies

### Tutorial Integration

**Mechanic taught**: Advanced combat against tougher enemies (Highland Hawks test AGI; Crag Golems test DEF-piercing strategies). Introduction to the Preserver faction through direct dialogue — they are polite, principled, and wrong.

### Rewards / Consequences

- **Level**: Player reaches ~8-9
- **Fragments**: 0-1 (enemy drops only — no Resonance Stones yield here)
- **Gold**: ~200-300 from tougher encounters
- **Quest activated**: "Break the Stagnation Clearing"
- **Emotional effect**: The Preserver Scout should feel unsettling — reasonable tone, wrong conclusion. The player should want to prove them wrong.

---

## Scene 10: Breaking the Stagnation

**Location**: Heartfield — Stagnation Clearing (35, 30)

**Trigger**: Player returns to the Stagnation Clearing with the active quest "Break the Stagnation Clearing"

**Characters**: Player, Hana

**Time of day**: Late afternoon

### Narrative Context

The player returns to the clearing they first saw in Scene 6. Now they have the tools and understanding to break it. This is the first active use of broadcast as a weapon against stagnation.

### Dialogue

*[The player approaches the clearing. The silence descends again — wind dies, birdsong stops, crystalline tinkling.]*

**Hana**: Here we are. The Stagnation Clearing. Same as when we left it.

**Hana**: Here's what you need to do. The crystallized Resonance Stone at the center is the focal point — the Preservers anchor their stasis through it. Broadcasting a memory into that stone will overwhelm the stasis energy and shatter the crystal.

**Hana**: Any fragment will work here. This is a small zone — even a one-star fragment has enough warmth to break it. But use something you're willing to lose, because broadcasting consumes the fragment.

> **SYSTEM**: Approach the crystallized Resonance Stone and broadcast a memory fragment to break the Stagnation Zone. (Any fragment, potency 1+.)

*[The player stands before the crystal-coated stone and selects a fragment to broadcast. The broadcast animation plays — but different from the workshop's gentle bloom. This time:]*

*[The amber wave hits the crystal. For a moment, nothing happens. Then — hairline fractures race across the crystal surface. The cracks glow warm gold. The crystal SHATTERS outward in a burst of prismatic light. The sound returns all at once: wind, birdsong, insect hum, grass rustling. The butterflies flutter and scatter. The grass sways. Color floods back in.]*

> **SYSTEM**: Stagnation Zone broken! Heartfield vibrancy +10!

**Hana** *(grinning)*: There. That's what it looks like when the world starts breathing again.

*[The freed Resonance Stone yields a fragment: MF-03: Echo of the Stagnation (Sorrow / Dark / Potency 2). See [items-catalog.md](../design/items-catalog.md).]*

> **SYSTEM**: You received a Memory Fragment: "Echo of the Stagnation" (Sorrow, Dark, ★★) — a frozen butterfly's last moment before crystallization.

**Hana**: A sorrow fragment. The butterfly was afraid, at the end. It remembered flying, and then it couldn't.

**Hana**: Hold onto that one. Sorrow fragments are rare from the Settled Lands. And they're powerful against stagnation — nothing breaks a freeze like the memory of what the freeze took away.

**Hana**: We should head back to the village. Artun will want to hear about the Preservers.

### Player Actions

- Approach crystallized Resonance Stone
- Select and broadcast a fragment (any, potency 1+)
- Watch the stagnation-breaking animation
- Receive MF-03: Echo of the Stagnation

### Tutorial Integration

**Mechanic taught**: Stagnation breaking. The player learns the full loop: find a stagnation zone → identify the focal point → broadcast an appropriate fragment → zone shatters. Future stagnation zones have stricter requirements (specific emotions, elements, potency thresholds — see [vibrancy-system.md](../world/vibrancy-system.md)).

### Rewards / Consequences

- **Fragment consumed**: Whatever the player chose to broadcast
- **Fragment received**: MF-03: Echo of the Stagnation
- **Vibrancy change**: Heartfield +10 (55→65, approaching Vivid)
- **Heartfield state change**: Stagnation Clearing is permanently clear. The butterflies now fly freely. Flowers bloom where crystal was.
- **Preserver presence**: The Heartfield Preserver scout (1 scout) becomes hostile upon the zone breaking, but does not engage yet — they retreat. Heartfield's vibrancy decay stops (the Preserver is pushed back permanently).
- **Quest completed**: "Break the Stagnation Clearing"
- **Quest activated**: "Report to Artun" (return to Everwick)

---

## Scene 11: The Clearing Grows — Act I Climax Setup

**Location**: Everwick — Elder's House (18, 10), then Heartfield — Stagnation Clearing (35, 30)

**Trigger**: Player returns to Artun after breaking the stagnation zone

**Characters**: Player, Hana, Artun

**Time of day**: Evening

### Part A: Artun's Warning

*[The player enters Artun's house. He's at his desk, surrounded by open journals. He looks worried.]*

**Artun**: You broke the clearing. Good. Hana told me what you found — a Preserver scout, a frozen watchtower, the whole thing.

**Artun**: I wish I could say it's an isolated case. But I've been reading reports from travelers for months now. Stagnation zones in the Frontier. Whole settlements frozen. The Preservers are expanding.

**Artun**: There's something else. The clearing you broke — it wasn't just a clearing. It was a test. The Preservers were seeing how much they could freeze this close to a populated area. And now that you've broken it...

*[A rumble. The ground shakes. Through Artun's window, a pale blue light flares from the south.]*

**Artun**: ...they're pushing back.

### Part B: The Expansion

*[The scene cuts to Heartfield. The player and Hana run south from the Everwick, arriving to find the Stagnation Clearing has REGROWN — not just to its original size, but expanded. The 5x5 patch is now a 12x12 zone, engulfing part of the farmland. Crystal formations are growing in real time.]*

**Hana**: No. No, no — it's bigger. Much bigger. They're reinforcing it.

*[Heartfield farmers are running from the expanding crystal edge. One farmer — a woman the player may have spoken to in Scene 5 — is caught at the stagnation border, crystal creeping up her legs.]*

**Farmer Elda** *(terrified)*: I can't move! It's — cold — like my legs are forgetting how to —

**Hana**: I'll get her. You — stay back.

*[Hana rushes to the farmer. She kneels, places her hands on the crystal, and begins broadcasting — not a fragment, but raw memory energy. Amber light surges from her palms. The crystal around the farmer cracks and recedes.]*

**Farmer Elda** *(stumbling free)*: Thank — thank you —

**Hana**: Run. Get to the village. Everyone, GO.

*[The farmers scatter northward. Hana turns to the player.]*

**Hana**: The focal point's shifted. It's not the clearing stone anymore — the Preservers set up a new anchor deeper in the zone. I can see it — there, behind the crystal wall.

**Hana**: I'm going to break through. Stay here and —

*[Hana turns and runs into the expanding stagnation zone. She's broadcasting memory energy ahead of her, creating a corridor of warmth through the crystal. The player can see her amber glow moving deeper into the zone.]*

*[Then the glow stops.]*

*[A pulse of blue-white energy radiates outward from the zone's center. The crystal surges. The corridor Hana created freezes shut behind her.]*

*[Silence.]*

### Dialogue — The Freeze

*[The player runs to the stagnation border. Through the semi-transparent crystal wall, Hana is visible — frozen mid-stride, one hand extended, palm trailing amber light. Her expression is determined, not afraid. She was fighting, not fleeing.]*

> **SYSTEM**: Hana has been frozen by the Stagnation Zone.

*[The player hammers against the crystal (automatic action — no input required). It doesn't break. It doesn't even crack.]*

*[A voice speaks. Not from any visible source — it resonates from the crystal itself.]*

**Grym** *(echoing, calm, measured)*: I did not want this.

**Grym**: Your friend is brave. She pushed against the boundary, and the boundary pushed back. That is the nature of preservation — it resists change. It must, or it is nothing.

**Grym**: She is not harmed. She is... held. Every memory she carries, every breath she took, every thought she was thinking — all preserved. Perfectly. She will not age, will not suffer, will not fade. Is that not a kindness?

*[The crystal hums. Grym's voice fades.]*

*[The player receives a fragment — not from a stone, but from the emotional shockwave of the moment:]*

> **SYSTEM**: You received a Memory Fragment: "Hana's Scream" (Fury, Light, ★★★★) — the emotional shockwave of Hana's freezing. The player's most potent fragment yet — and the most painful.

*[See MF-04 in [items-catalog.md](../design/items-catalog.md).]*

### Player Actions

- Return to Artun (triggers Part A)
- Run to Heartfield (automatic cutscene transition for Part B)
- Witness the stagnation expansion
- Witness Hana's freezing (cutscene — no player agency during the freeze itself)
- Receive MF-04: Hana's Scream

### Rewards / Consequences

- **Companion lost**: Hana is frozen. She is removed from the party.
- **Fragment received**: MF-04: Hana's Scream (Fury/Light/4★) — the most powerful fragment the player has at this point
- **Heartfield vibrancy**: Drops sharply (65→40) as the expanded stagnation zone reasserts. Vibrancy floor: 40 (Preserver reinforcement cannot push below this — see [vibrancy-system.md](../world/vibrancy-system.md))
- **Emotional impact**: This is the Act I climax. The player has lost their mentor, companion, and friend. The tone shifts from wonder to determination.
- **Stagnation state**: The expanded zone is permanent until the player gains enough power to break it (requires a potency 3+ fragment, specific emotion — cannot be broken until the player reaches the Frontier and gains stronger fragments in Act II)

---

## Scene 12: A New Resolve

**Location**: Everwick — Elder's House, then Lookout Hill (12, 2)

**Trigger**: Immediately after Scene 11 (player returns to village automatically)

**Characters**: Player, Artun

**Time of day**: Night (first time the player sees the village at night — amber lanterns, softer lighting, quieter atmosphere)

### Dialogue

*[The player enters Artun's house. He is standing, not sitting — the first time the player has seen him on his feet.]*

**Artun**: I heard. Hana...

*[Beat.]*

**Artun**: She's alive. The crystal doesn't kill — I know that much from the Dissolved records. But breaking her free will take more than anything we have in the Settled Lands.

**Artun**: You'll need to go north. Into the Frontier — where the world is less formed, where the memory is thicker, where the Preservers are stronger. And where the dormant gods sleep.

**Artun**: Those gods, the ones the Dissolved left behind — they're the key. If you can recall even one of them, the surge of memory energy would be enough to shatter any stagnation zone on this side of the Sketch.

*[Artun walks to his desk and picks up a bundle of sealed letters.]*

**Artun**: I've been writing these for years. Letters about the Frontier — what I've learned from travelers, from the Dissolved records, from my own theories. Each one covers a different zone. Read them when you get there.

*[The player receives **K-02: Artun's Letters**. See [items-catalog.md](../design/items-catalog.md).]*

**Artun**: The mountain pass north of here — it's been closed for as long as I can remember. But after tonight, after what the Preservers did... I don't think anything's stopping you anymore. The world itself wants to grow. It'll open for someone with the will to walk through.

**Artun**: One more thing.

*[Artun reaches into his coat and produces a worn leather journal.]*

**Artun**: This was mine. My teacher gave it to me. And Hana gave hers to you — the Architect's Signet. But I think you need this more than I do now.

*[The player receives an unnamed fragment from Artun: Awe/Neutral/3★ — *Artun's memory of the night sky as a young man, standing on this hill, realizing the world was bigger than he could ever map.*]*

**Artun**: That's my favorite memory. The night I understood how much there was left to discover. Use it well.

**Artun**: Now go up to the Lookout Hill. Clear your head. And when you're ready — go north.

### Part B: The Lookout

*[The player climbs to Lookout Hill (12, 2). Night sky. Stars. The Everwick stretches below — amber lanterns glowing warm. Beyond the village, the Settled Lands roll southward in the dark. To the north, the Frontier is a faint shimmer on the horizon, barely visible against the starfield.]*

*[No dialogue. No system messages. Just the player standing on the hill, looking out. The village music plays its foundation layer only — a single acoustic guitar, soft and slow.]*

*[After 5 seconds of stillness, Artun's telescope (on the hill) glints. The player can interact with it.]*

> **SYSTEM** *(through telescope)*: To the north: the mountain pass, snow-dusted peaks, and beyond them — a vast, shimmering expanse where the world is still being written.
> To the south: Heartfield's golden fields, now scarred by a blue-white crystal mass that pulses slowly in the dark. Hana is in there. Somewhere.

*[The player can leave the hill at any time. When they do:]*

> **SYSTEM**: The mountain pass to the Frontier is now open. Act II: Expansion begins.
> Artun will remain in the village. He'll send companion volunteers to the Ridgetop Waystation when you're ready.

### Player Actions

- Talk to Artun (receive K-02 and a 3★ fragment)
- Climb to Lookout Hill (night vista — narrative moment)
- Look through telescope (optional — survey the world)
- Leave the hill to unlock Act II

### Rewards / Consequences

- **Items received**: K-02: Artun's Letters, Artun's 3★ fragment (Awe/Neutral)
- **Act II unlocked**: The mountain pass between Sunridge and Hollow Ridge is now open
- **Everwick state**: Night mode — lanterns lit, fewer NPCs outdoors, fireflies near Memorial Garden
- **Player level**: Should be ~9-10 at this point
- **Player inventory**: ~4-7 fragments, ~600-900g, Tier 1-2 weapon, Tier 1 armor, and various consumables
- **Party**: Solo (Hana frozen). Artun will join as a companion in Act II, Scene 2.

---

## Act I Summary

### Emotional Arc

| Phase | Scenes | Feeling |
|-------|--------|---------|
| Wonder | 1-4 | The world is bright, warm, full of secrets. Memory is a gift. |
| Learning | 5-8 | The player grows stronger, finds friends, discovers the world's beauty and its seams. |
| Growing confidence | 9-10 | The player can fight, remix, broadcast, break stagnation. They feel capable. |
| Shock | 11-12 | Everything the player learned wasn't enough to stop this. Hana is frozen. The stakes are real. The player must go further. |

### Tutorial Completion Checklist

| Mechanic | Introduced | Mastered |
|----------|-----------|----------|
| Movement and interaction | Scene 1 | Scene 1 |
| Memory collection | Scene 2 | Scene 5 |
| Party combat | Scene 4 (Part A) | Scene 7-9 |
| Remix | Scene 4 (Part B) | Scene 8 |
| Broadcast | Scene 4 (Part B) | Scene 10 |
| Stagnation breaking | Scene 6 (observe) / Scene 10 (active) | Scene 10 |
| Side quests | Scene 7 | Scene 7-8 |
| Shops and economy | Scene 8 | Scene 8-9 |
| NPC relationships | Scene 5 | Ongoing |
| Preserver awareness | Scene 6 (environmental) / Scene 9 (dialogue) | Scene 11 |

### Player State at Act I End

| Category | Value |
|----------|-------|
| Level | 9-10 |
| Gold | 600-900 |
| Memory fragments held | 4-7 (after broadcasts and remixes) |
| Named fragments | MF-01 (Artun's First Lesson), MF-03 (Echo of the Stagnation), MF-04 (Hana's Scream), plus Artun's 3★ |
| Key items | K-01 (Architect's Signet), K-02 (Artun's Letters), K-03 (Remix Table Access) |
| Party | Solo (Hana frozen). Artun joins early Act II. |
| Quests completed | ~4-6 (main quest line + 1-2 side quests) |
| Zones explored | Everwick, Heartfield, Ambergrove, Millbrook, Sunridge |
| Stagnation zones | 1 broken (original clearing), 1 active (expanded clearing — cannot be broken until Act II) |
| Vibrancy | Everwick: ~72+ (Vivid). Heartfield: 40-50 (Normal, reduced by expansion). Ambergrove: 45-55 (Normal). Millbrook: 50-55 (Normal). Sunridge: 40-42 (Normal). |

### Foreshadowing Planted

| Setup | Payoff (Act) |
|-------|-------------|
| Amber Lake dormant stone (Ambergrove) | Act II — related to a god recall |
| Wind Shrine / Kinesis hint (Sunridge) | Act II — Kinesis recall at Kinesis Spire |
| Preserver Outpost (Sunridge) | Act II — clearable encounter |
| Artun's Letters | Act II — zone-by-zone lore delivery |
| Grym's voice | Act II-III — primary antagonist confrontation |
| Eastern Canopy Path shimmer (Ambergrove) | Act II — transition to Frontier: Flickerveil |
| MF-04: Hana's Scream | Act II — powerful fragment for breaking the expanded stagnation |
| Dissolved civilizations (Old Windmill, Hearthstone Circle, grotto) | Act II — Depths dungeons expand on Dissolved lore |
