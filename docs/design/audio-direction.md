# Audio Direction: Music, Sound Effects, and Vibrancy Audio Production Guide

> Cross-references: [docs/design/visual-direction.md](visual-direction.md), [docs/world/vibrancy-system.md](../world/vibrancy-system.md), [docs/world/geography.md](../world/geography.md), [docs/design/tileset-spec.md](tileset-spec.md)

## Overview

This document is the **complete audio production specification** for Mnemonic Realms. It covers every BGM track, the full SFX catalog, vibrancy-driven audio layering, and stagnation/combat audio effects. The audio system mirrors the visual brightening principle from [visual-direction.md](visual-direction.md): the world sounds sparse and delicate early on, then builds to rich, full orchestration as the player progresses.

The 4-layer vibrancy audio system is defined in [vibrancy-system.md](../world/vibrancy-system.md). This document adds the detailed production spec for each track and effect.

---

## Audio Architecture

### Delivery Format

| Property | Value |
|----------|-------|
| Format | OGG Vorbis (primary), MP3 (fallback) |
| Sample rate | 44.1 kHz |
| Bit depth | 16-bit |
| BGM loop | Seamless loop point marked in metadata |
| SFX | One-shot, no loop (unless noted) |
| Channel | Stereo (BGM), Mono (SFX) |

### Volume Hierarchy

| Channel | Default Volume | Player Adjustable |
|---------|---------------|-------------------|
| BGM | 70% | Yes (0-100%) |
| SFX | 85% | Yes (0-100%) |
| Ambient | 50% | Linked to BGM slider |
| UI | 80% | Linked to SFX slider |

### 4-Layer Vibrancy System (Summary)

Each zone BGM is composed as a 4-layer track. Layers activate based on zone vibrancy tier (see [vibrancy-system.md](../world/vibrancy-system.md) for full specification):

| Layer | Instruments | Active At | Fade In | Fade Out |
|-------|------------|-----------|---------|----------|
| Layer 1: Foundation | Solo instrument | Always (0+) | Instant | Never |
| Layer 2: Harmony | Second instrument + simple percussion | 34+ (Normal) | 4 seconds | 6 seconds |
| Layer 3: Ensemble | Full section | 67+ (Vivid) | 4 seconds | 6 seconds |
| Layer 4: Chorus | Choral voices, rich reverb | 85+ (high Vivid) | 4 seconds | 6 seconds |

All four layers are composed as stems of the same piece and must be harmonically compatible when any combination is active.

---

## BGM Catalog: Zone Themes

Each zone has one BGM track with 4 layers. Tracks are identified by `BGM-{zone code}`.

### BGM-VH: Everwick — "Hearth and Home"

| Property | Value |
|----------|-------|
| Tempo | 88 BPM |
| Key | G major |
| Time signature | 3/4 (waltz feel — warm, swaying, communal) |
| Mood | Warm, welcoming, safe. The sound of home. |
| Duration | 2:30 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Acoustic guitar (fingerpicked) | Simple arpeggio pattern. Warm, woody tone. The most "human" sound in the game. |
| 2: Harmony | Wooden flute + hand drum | Flute carries a gentle melody over guitar. Hand drum adds light rhythmic pulse on beats 1 and 3. |
| 3: Ensemble | String quartet (violin, viola, cello, bass) | Full arrangement. Strings double the melody, add countermelody. Cello provides bass line. Rich and welcoming. |
| 4: Chorus | Wordless choir (humming, "ahh") | Soft choral pad. Evokes a community singing together. Reverb adds warmth. |

### BGM-HF: Heartfield — "Golden Afternoon"

| Property | Value |
|----------|-------|
| Tempo | 72 BPM |
| Key | D major |
| Time signature | 4/4 |
| Mood | Pastoral, content, unhurried. Rolling fields and gentle work. |
| Duration | 2:15 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Wooden flute (recorder-like) | Simple pastoral melody, leaping intervals. Breathy, natural tone. |
| 2: Harmony | Acoustic guitar + light percussion (shaker) | Guitar provides chordal support. Shaker adds organic rhythm like wind through wheat. |
| 3: Ensemble | Oboe + string trio (violin, viola, cello) | Oboe takes over melody, strings provide warm harmonic bed. Feels like a painting coming to life. |
| 4: Chorus | Female solo voice (wordless "la la") | Intimate, not choral. One voice singing to the fields. Gentle vibrato. |

### BGM-AG: Ambergrove — "Dappled Paths"

| Property | Value |
|----------|-------|
| Tempo | 80 BPM |
| Key | E minor (relative major: G) |
| Time signature | 6/8 (compound time — gentle lilting, forest-walk feel) |
| Mood | Mysterious, enchanted, curious. Wonder at every turn. |
| Duration | 2:45 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Harp (arpeggiated) | Flowing broken chords, bell-like tone. Creates the sense of dappled light. |
| 2: Harmony | Clarinet + light triangle | Clarinet weaves a meandering melody through the harp arpeggios. Triangle accents create "sparkle" moments. |
| 3: Ensemble | French horn + string section | Horn adds grandeur. Strings swell and recede like forest canopy in wind. |
| 4: Chorus | Choir (mixed voices, "ooh") | Ethereal, reverb-heavy. Evokes the forest's ancient memory. |

### BGM-MB: Millbrook — "Brightwater Dance"

| Property | Value |
|----------|-------|
| Tempo | 104 BPM |
| Key | A major |
| Time signature | 4/4 |
| Mood | Lively, flowing, prosperous. River energy, market bustle. |
| Duration | 2:00 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Fiddle (folk style) | Jaunty melody with slides and double-stops. The liveliest foundation instrument. |
| 2: Harmony | Tin whistle + bodhrán drum | Whistle harmonizes with fiddle. Bodhrán provides driving Celtic-style pulse. |
| 3: Ensemble | Accordion + bass + full percussion | Accordion adds harmonic richness. Upright bass grounds the rhythm. Tambourine and hand claps layer in. |
| 4: Chorus | Group vocals (call-and-response) | Spirited "hey!" responses. Feels like a riverside festival. |

### BGM-SR: Sunridge — "Wind at the Threshold"

| Property | Value |
|----------|-------|
| Tempo | 68 BPM |
| Key | Bb major |
| Time signature | 4/4 |
| Mood | Expansive, windswept, determined. Open sky and distant horizons. |
| Duration | 2:30 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Pan pipes (breathy, airy) | Long sustained notes with gentle ornaments. Evokes wind across highlands. |
| 2: Harmony | Low strings (cello) + wind chime | Cello provides slow-moving bass. Wind chime adds random metallic sparkle (actual randomized timing). |
| 3: Ensemble | French horn + full strings | Horn melody soars. Strings swell like a dramatic vista reveal. |
| 4: Chorus | Male choir (humming, low register) | Grounding, earthy, determined. The sound of endurance. |

### BGM-SM: Shimmer Marsh — "Twilight Reflections"

| Property | Value |
|----------|-------|
| Tempo | 56 BPM |
| Key | F# minor |
| Time signature | 5/4 (asymmetric — creates unease without being hostile) |
| Mood | Reflective, eerie, melancholic beauty. Memory-haunted waters. |
| Duration | 3:00 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Oboe (solo, low register) | Slow, mournful melody. Slightly breathy. The loneliest sound. |
| 2: Harmony | Harp + water sound samples | Harp provides sparse chords. Subtle water drip and ripple samples woven in as rhythmic elements. |
| 3: Ensemble | String section (muted) + bass clarinet | Muted strings create shimmering harmonic wash. Bass clarinet adds dark undercurrent. |
| 4: Chorus | Choir (soprano, distant, reverb-heavy) | Sounds like singing heard from underwater. Ethereal and haunting. |

### BGM-HR: Hollow Ridge — "Stone and Flame"

| Property | Value |
|----------|-------|
| Tempo | 76 BPM |
| Key | D minor |
| Time signature | 4/4 |
| Mood | Determined, epic, challenging. Mountains demand respect. |
| Duration | 2:30 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | French horn (solo) | Bold, resolute melody. Interval leaps evoke ascent. Moderate reverb (mountain echo). |
| 2: Harmony | Timpani + low strings (cello/bass) | Timpani on downbeats creates weight. Strings provide harmonic foundation. |
| 3: Ensemble | Full brass section + snare drum | Trumpet and trombone join horn. Snare adds military precision. Epic scope without bombast. |
| 4: Chorus | Male choir (powerful, "ah" and "oh") | Driving, heroic. The mountains sing back. |

### BGM-FV: Flickerveil — "Between Worlds"

| Property | Value |
|----------|-------|
| Tempo | 66 BPM |
| Key | Ab major |
| Time signature | 3/4 |
| Mood | Ethereal, shifting, gently uncanny. Reality is soft here. |
| Duration | 2:45 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Celesta (music box timbre) | Delicate, crystalline melody. Notes slightly detuned (2 cents sharp) for uncanny effect. |
| 2: Harmony | Vibraphone + soft pad synth | Vibraphone adds bell-like sustain. Pad synth creates gentle warmth. |
| 3: Ensemble | String section (legato, tremolo) + glockenspiel | Tremolo strings create shimmer. Glockenspiel punctuates phrase ends. |
| 4: Chorus | Child-like voices (wordless "la") | Small choir, pure and simple. Reverb creates vast space. |

### BGM-RF: Resonance Fields — "The Standing Stones"

| Property | Value |
|----------|-------|
| Tempo | 48 BPM (slowest in game) |
| Key | C Lydian mode (#4 — mystical, transcendent) |
| Time signature | Free time (no strict meter — breathing, organic pulse) |
| Mood | Sacred, resonant, awe-inspiring. Ancient sound made present. |
| Duration | 3:30 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Singing bowl / drone (sustained) | Deep, sustained harmonic tone. Evolves slowly. The stone itself singing. |
| 2: Harmony | Duduk (Armenian double-reed) + light bells | Duduk provides ancient melody. Bells ring at irregular intervals like stone reverberations. |
| 3: Ensemble | Full string section (slow legato) + low brass | Strings create massive, slow-moving chord progressions. Low brass rumbles. |
| 4: Chorus | Mixed choir (polyphonic, Renaissance-style) | Overlapping vocal lines create complex harmony. The sound of many dissolved voices merging. |

### BGM-LW: Luminous Wastes — "Unwritten Song"

| Property | Value |
|----------|-------|
| Tempo | 60 BPM |
| Key | E major |
| Time signature | 4/4 |
| Mood | Stark, luminous, beautiful emptiness. The world's potential before realization. |
| Duration | 3:00 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Solo violin (high register) | Thin, pure, exposed. A single voice in vast space. Slight vibrato. |
| 2: Harmony | Piano (sparse, sustain pedal) | Widely spaced chords, lots of silence between. Sustain pedal creates harmonic bleed. |
| 3: Ensemble | Chamber strings (violin, viola, cello) | Restrained arrangement. Cello provides warmth below violin. Viola fills middle. |
| 4: Chorus | Solo soprano (wordless, distant) | Achingly beautiful. One voice answering the violin. |

### BGM-UP: Undrawn Peaks — "The Wireframe Cathedral"

| Property | Value |
|----------|-------|
| Tempo | 52 BPM |
| Key | C minor |
| Time signature | 4/4 |
| Mood | Austere, majestic, contemplative. Geometric grandeur. |
| Duration | 2:45 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Solo cello (low register) | Dark, resonant, meditative. Long bow strokes. The sound of carved stone. |
| 2: Harmony | Bassoon + tam-tam (soft) | Bassoon doubles cello an octave above. Tam-tam swells add weight at phrase boundaries. |
| 3: Ensemble | Full orchestra (slow, heavy) | Full strings, brass, and woodwinds in a massive, slow chorale. The mountains given voice. |
| 4: Chorus | Bass choir (low, rumbling "om") | Deep and grounding. The wireframe cathedral resonates. |

### BGM-HDF: Half-Drawn Forest — "Sketched Lullaby"

| Property | Value |
|----------|-------|
| Tempo | 64 BPM |
| Key | F major |
| Time signature | 3/4 |
| Mood | Tender, growing, patient. A song waiting to be finished. |
| Duration | 2:30 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Music box (actual music box timbre) | Simple lullaby melody. Intentionally "incomplete" — phrase endings leave notes hanging. |
| 2: Harmony | Acoustic guitar (nylon string) | Fills in harmonic support, "completing" the music box phrases. |
| 3: Ensemble | String quartet (pizzicato → arco) | Starts pizzicato (playful, sketch-like), transitions to arco (filled in, complete). |
| 4: Chorus | Children's choir (soft, wordless humming) | The most emotionally vulnerable audio in the game. Growth made audible. |

### BGM-DEP: Depths (General) — "Fossil Songs"

Used for Depths Levels 1-3. Levels 4-5 have unique themes.

| Property | Value |
|----------|-------|
| Tempo | 60 BPM |
| Key | G minor |
| Time signature | 4/4 |
| Mood | Ancient, echoing, introspective. Memory fossils humming. |
| Duration | 2:30 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Contrabass (arco, sustained) | Deep, cavernous tone. Heavy reverb simulates underground acoustics. |
| 2: Harmony | Vibraphone + distant dripping samples | Vibraphone adds light in the dark. Water drips provide organic rhythm. |
| 3: Ensemble | Muted strings + bass clarinet | Muted strings create intimate texture. Bass clarinet weaves through. |
| 4: Chorus | Low voices (humming, octave unison) | Ancient voices preserved in stone. |

### BGM-SL4: The Songline (Depths Level 4) — "Final Verse"

| Property | Value |
|----------|-------|
| Tempo | 72 BPM (increases to 84 in final room) |
| Key | D major |
| Time signature | 4/4 |
| Mood | Joyful, bittersweet, culminating. A civilization's last composition. |
| Duration | 3:00 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Solo flute (concert) | Pure, clear melody. The dissolved civilization's voice. |
| 2: Harmony | Harp + celesta | Creates shimmering, crystalline support. Memory given sound. |
| 3: Ensemble | Full chamber orchestra | Rich, warm, celebratory. The song finally has all its instruments. |
| 4: Chorus | Full mixed choir (singing the melody with the flute) | The civilization sings along. Wordless but profoundly human. |

### BGM-DM5: The Deepest Memory (Depths Level 5) — "Before the Beginning"

| Property | Value |
|----------|-------|
| Tempo | 44 BPM (slowest track) |
| Key | A Aeolian → A major (modal shift at boss) |
| Time signature | Free time |
| Mood | Primordial, vast, awe. The world's first sound. |
| Duration | 4:00 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Harmonic overtone series (synthesized) | Not a traditional instrument — a slowly evolving harmonic series. The sound the world made when it first existed. |
| 2: Harmony | Glass armonica + distant bell | Otherworldly, ethereal. Bell tolls at irregular intervals. |
| 3: Ensemble | Full orchestra (extremely slow, building) | The grandest arrangement. Takes 30+ seconds to reach full volume. Overwhelming when fully active. |
| 4: Chorus | Full choir (building from silence to fortissimo) | Wordless. Pure emotional power. The world remembering itself. |

### BGM-PF: Preserver Fortress — "Frozen Perfection"

| Property | Value |
|----------|-------|
| Tempo | 64 BPM |
| Key | Db major (enharmonic with C#, creating tonal ambiguity) |
| Time signature | 4/4 |
| Mood | Cold, pristine, unsettling beauty. Perfect and therefore wrong. |
| Duration | 3:00 loop |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1: Foundation | Glass harmonica (sustained) | Beautiful, eerie, inhuman. Crystal resonance. Grym's preferred instrument. |
| 2: Harmony | Celesta + pizzicato strings | Celesta adds crystalline precision. Pizzicato strings are metronomically perfect (no human rubato). |
| 3: Ensemble | Full strings (non-vibrato, exact intonation) | Deliberately sterile perfection. Beautiful but lacks warmth. The uncanny valley of music. |
| 4: Chorus | Soprano choir (perfect unison, no variation) | All voices exactly identical. Beautiful but mechanical. The sound of frozen memory. |

---

## Combat BGM

Combat music overrides zone BGM. Vibrancy influences layer count in normal battles (see [vibrancy-system.md](../world/vibrancy-system.md)).

### BGM-BTL: Normal Battle — "Clash of Memories"

| Property | Value |
|----------|-------|
| Tempo | 120 BPM |
| Key | E minor |
| Time signature | 4/4 |
| Mood | Upbeat, energetic, adventurous. Fighting is exciting, not grim. |
| Duration | 1:45 loop |

| Layer | Active At | Instruments | Description |
|-------|-----------|------------|-------------|
| 1 | Always | Snare drum + bass drum + electric bass | Driving rhythm foundation. |
| 2 | Muted+ | Brass (trumpet, horn) + rhythm guitar | Melody and harmonic power. The "main theme" of battle. |
| 3 | Normal+ | Full strings (fast bowing) + wind section | Orchestral weight and drama. |
| 4 | Vivid | Choir + full percussion (cymbal, tam-tam) | Maximum intensity. The world itself fights with you. |

**Intro**: 4-beat drum fill before first loop (only on encounter start, not on loop repeat).

### BGM-BOSS: Boss Battle — "Remembered Promise"

| Property | Value |
|----------|-------|
| Tempo | 140 BPM |
| Key | D minor |
| Time signature | 7/8 (asymmetric — creates urgency and unpredictability) |
| Mood | Epic, urgent, heroic. The stakes are real. |
| Duration | 2:30 loop |
| Vibrancy | All 4 layers always active — bosses get full music regardless of zone vibrancy |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1 | Timpani + bass drum + low brass | Thunderous rhythmic foundation. Weight and power. |
| 2 | Full brass + full strings | Heroic melody. Ascending phrases that build tension. |
| 3 | Choir (mixed, powerful) + full percussion | Voices add gravitas. Cymbal crashes punctuate phase transitions. |
| 4 | Solo violin (soaring above orchestra) | The player's theme. Rises above the orchestral storm. |

**Phase transition**: 2-beat silence, then timpani roll into new section at higher pitch (+2 semitones). Each boss phase gets increasingly intense.

### BGM-PVB: Preserver Battle — "Crystallized Resistance"

| Property | Value |
|----------|-------|
| Tempo | 100 BPM (deliberately slower than normal battle) |
| Key | Db minor (matches Fortress zone) |
| Time signature | 4/4 |
| Mood | Tense, controlled, crystalline. The Preservers don't rage — they constrain. |
| Duration | 2:00 loop |
| Vibrancy | Deliberately stripped — Preservers "freeze" even the battle music |

| Layer | Instruments | Description |
|-------|------------|-------------|
| 1 | Glass harmonica + crystalline percussion (tuned glass, wind chimes) | Cold, precise rhythm. |
| 2 | Distorted version of the current zone's BGM foundation instrument | The Preservers corrupt familiar sounds. Subtle — the player should recognize their zone's theme being frozen. |
| 3 | Muted strings (non-vibrato) + bass drum (damped) | Tension without warmth. Every note is controlled. |
| 4 | Single sustained choir note (no movement) | One frozen chord. A memory of music, not actual music. |

---

## Event and Cutscene Music

### BGM-TITLE: Title Screen — "First Light"

| Property | Value |
|----------|-------|
| Tempo | 76 BPM |
| Key | C major (simplest, purest key) |
| Duration | 1:30 loop |
| Instruments | Music box → piano → strings → choir (builds over 45 seconds) |
| Mood | Gentle, inviting, full of potential. A world waiting to begin. |

### BGM-GAMEOVER: Game Over — "Fading Echo"

| Property | Value |
|----------|-------|
| Tempo | 40 BPM |
| Key | F minor |
| Duration | 0:20 (no loop, plays once) |
| Instruments | Solo cello, descending phrase. Final note sustained with reverb fade. |
| Mood | Melancholic but not punishing. A pause, not an ending. |

### BGM-VICTORY: Battle Victory — "Memory Claimed"

| Property | Value |
|----------|-------|
| Tempo | 120 BPM |
| Key | G major |
| Duration | 0:08 (fanfare, no loop) |
| Instruments | Brass fanfare (trumpet + horn), cymbal crash, brief string flourish. |
| Mood | Triumphant, warm. Classic JRPG victory jingle. |

### BGM-LEVELUP: Level Up — "Growing Brighter"

| Property | Value |
|----------|-------|
| Tempo | 100 BPM |
| Key | D major |
| Duration | 0:05 (sting, no loop) |
| Instruments | Ascending harp arpeggio + choral "ahh" + bell chime at peak. |
| Mood | Warm accomplishment. |

### BGM-RECALL: God Recall — "Awakening"

| Property | Value |
|----------|-------|
| Tempo | Building from 60 → 120 BPM over 30 seconds |
| Key | Matches recalled god's zone key |
| Duration | 0:45 (one-shot, plays during recall animation) |
| Instruments | Recalled god's foundation instrument (solo) → adds layers rapidly → full orchestra + choir at climax |
| Mood | Transcendent. The most powerful audio moment in the game. |

### BGM-BLOOM: Endgame Bloom — "World's New Dawn"

| Property | Value |
|----------|-------|
| Tempo | Building from 44 → 88 BPM |
| Key | C major → modulates through all zone keys → resolves to A major |
| Duration | 2:00 (one-shot, plays during final vibrancy bloom) |
| Instruments | Begins with single music box note → rapidly adds every foundation instrument from every zone → full orchestra → full choir → silence → one final warm chord |
| Mood | The entire game's audio arc compressed into 2 minutes. Devastating emotional payoff. |

### BGM-CREDITS: Credits — "What We Remember"

| Property | Value |
|----------|-------|
| Tempo | 80 BPM |
| Key | G major (same as Everwick) |
| Duration | 4:00 (full credits length) |
| Instruments | Acoustic guitar (Everwick theme) → adds each zone's foundation instrument one by one → builds to full orchestra → final section is just guitar again |
| Mood | Nostalgic, complete, grateful. A journey remembered. |

---

## Sound Effects Catalog (32 Effects)

### UI / System SFX

| ID | Name | Description | Duration |
|----|------|-------------|----------|
| SFX-UI-01 | Menu open | Soft parchment unfurl, brief paper rustle | 0.3s |
| SFX-UI-02 | Menu close | Reverse of open, soft thud | 0.2s |
| SFX-UI-03 | Cursor move | Light tap, wooden button click | 0.1s |
| SFX-UI-04 | Confirm | Warm chime, bell-like (G note) | 0.3s |
| SFX-UI-05 | Cancel | Soft low thud, not harsh | 0.2s |
| SFX-UI-06 | Error/invalid | Two quick low taps | 0.2s |
| SFX-UI-07 | Shop purchase | Coin clink + register ding | 0.4s |
| SFX-UI-08 | Equip item | Metallic slide + click | 0.3s |

### Combat SFX

| ID | Name | Description | Duration |
|----|------|-------------|----------|
| SFX-CBT-01 | Physical hit (light) | Quick blade slash through air | 0.2s |
| SFX-CBT-02 | Physical hit (heavy) | Weighty impact, slight echo | 0.3s |
| SFX-CBT-03 | Magic cast | Rising crystalline tone, sparkle | 0.5s |
| SFX-CBT-04 | Heal | Warm ascending chime, bell harmonics | 0.6s |
| SFX-CBT-05 | Critical hit | SFX-CBT-02 + glass shatter accent | 0.4s |
| SFX-CBT-06 | Miss / dodge | Quick wind swoosh, no impact | 0.2s |
| SFX-CBT-07 | Stasis inflicted | Ice crystallization crackle, frozen chord | 0.5s |
| SFX-CBT-08 | Poison inflicted | Wet bubble, slight hiss | 0.3s |
| SFX-CBT-09 | Buff applied | Ascending warm tone, golden sparkle | 0.4s |
| SFX-CBT-10 | Debuff applied | Descending cold tone, slight dissonance | 0.4s |
| SFX-CBT-11 | Enemy death | Brief dissolve, amber mote scatter | 0.5s |
| SFX-CBT-12 | Party member KO | Dull thud + brief reverb, melancholic | 0.4s |

### Memory System SFX

| ID | Name | Description | Duration |
|----|------|-------------|----------|
| SFX-MEM-01 | Fragment collect | Golden chime ascending, warm. Pitch rises with fragment potency (1★=C4, 5★=C6). | 0.5s |
| SFX-MEM-02 | Fragment remix | Two tones swirl together, flash, resolve to new tone | 0.8s |
| SFX-MEM-03 | Broadcast (small) | Gentle expanding ring tone, like a stone in still water | 1.0s |
| SFX-MEM-04 | Broadcast (large) | Larger version, deeper tone, wave of warmth | 1.5s |
| SFX-MEM-05 | Vibrancy tier change | Musical sting: 3-note ascending chord (zone instrument). Distinct from level-up. | 0.6s |
| SFX-MEM-06 | Stagnation break | Crystal shatter + warm flood. Dramatic — the opposite of stasis. | 1.0s |

### Overworld / Environment SFX

| ID | Name | Description | Duration |
|----|------|-------------|----------|
| SFX-ENV-01 | Door open | Wooden creak, soft | 0.4s |
| SFX-ENV-02 | Chest open | Lid creak + slight sparkle | 0.5s |
| SFX-ENV-03 | NPC interact | Soft chime, welcoming | 0.2s |
| SFX-ENV-04 | Resonance Stone hum | Deep sustained hum when player approaches. Loops while nearby. | Looping |
| SFX-ENV-05 | Zone transition | Brief whoosh, fade in new ambient | 0.8s |
| SFX-ENV-06 | Save point | Warm ascending arpeggio + bell | 0.6s |

---

## Stagnation Zone Audio Effects

Within stagnation zones, all audio is modified regardless of zone vibrancy (see [vibrancy-system.md](../world/vibrancy-system.md)):

| Effect | Technical Description |
|--------|----------------------|
| Layer suppression | All BGM layers above Layer 1 are muted |
| Low-pass filter | Layer 1 filtered at 800 Hz cutoff, 12dB/octave slope |
| Tempo reduction | Layer 1 playback speed reduced to 0.7x |
| Heavy reverb | Reverb wet/dry mix increased to 80% (from default 30%) |
| Crystal ambient | Looping ambient layer added: crystalline tinkling, like ice wind chimes. Volume 40%. |
| SFX muffling | All SFX gain a low-pass filter at 2000 Hz while in stagnation zone |
| Footstep change | Player footstep SFX changes to a sharp crystal-tap sound |

### Stagnation Break Audio Sequence (1-shot, 3 seconds)

1. **0.0s**: Crystal shatter SFX (SFX-MEM-06) — loud, dramatic
2. **0.0-0.5s**: All audio effects (filter, slow, reverb) rapidly normalize
3. **0.5-2.0s**: BGM layers 2, 3, 4 fade in at 2x normal speed (2 seconds instead of 4)
4. **2.0-3.0s**: A unique "freedom chord" — all zone instruments play a single major chord together, then resolve to normal BGM loop
5. **3.0s+**: Crystal ambient loop stops. Normal audio resumes.

---

## Ambient Sound Layers

Each biome has a looping ambient sound layer that plays under the BGM at low volume.

| Biome | Ambient Sound | Volume | Notes |
|-------|---------------|--------|-------|
| Village | Distant chatter, birdsong, occasional rooster | 30% | Muted: chatter only. Vivid: + children laughing, festival sounds. |
| Grassland | Wind through grass, insect hum, distant bird | 25% | Muted: wind only. Vivid: + bird variety, cricket chorus. |
| Forest | Rustling leaves, bird calls, distant woodpecker | 30% | Muted: light rustle. Vivid: + owl, squirrel chatter, stream. |
| Mountain | Wind howl, distant rockfall, eagle cry | 25% | Muted: wind only. Vivid: + waterfall, goat bells. |
| Riverside | Flowing water, splashing, distant waterwheel | 35% | Muted: gentle flow. Vivid: + fish splash, laughter, market sounds. |
| Wetland | Frog chorus, dripping water, insect buzz | 30% | Muted: drip only. Vivid: + full frog chorus, firefly hum. |
| Plains | Wind whisper, stone resonance hum, grass rustle | 20% | Muted: wind. Vivid: + complex stone harmonics, bird song. |
| Dungeon | Dripping water, distant rumble, echo | 25% | Muted: drip. Vivid: + singing crystal, memory whispers. |
| Sketch | Near silence. Faint pen-on-paper scratching. | 10% | Muted: silence. Vivid: + faint color-filling sound (unique). |
| Stagnation | Crystal tinkling, frozen wind, dead silence between tinks | 20% | Overrides biome ambient. Always this sound in stagnation. |

---

## Track Count Summary

| Category | Tracks | Notes |
|----------|--------|-------|
| Zone BGM | 15 | 4 layers each = 60 audio stems |
| Combat BGM | 3 | Normal, Boss, Preserver (4 layers each = 12 stems) |
| Event/Cutscene | 7 | Title, Game Over, Victory, Level Up, God Recall, Bloom, Credits |
| SFX | 32 | UI (8), Combat (12), Memory (6), Environment (6) |
| Ambient loops | 10 | One per biome + stagnation |
| **Total** | **67 audio assets** | (72 stems + 32 SFX + 10 ambients = 114 files) |

---

## GenAI Audio Production Notes

### Production Order

1. **Zone BGM Layer 1 (Foundation)** — Establish each zone's identity with solo instruments
2. **Zone BGM Layers 2-4** — Build up from established foundations
3. **Combat BGM** — Ensure battle themes feel distinct from exploration
4. **Event music** — Title, Victory, Level Up, Credits
5. **SFX** — Generate after BGM to ensure tonal consistency
6. **Ambient loops** — Last, matched to zone moods

### Key Constraints

- All BGM layers must be harmonically compatible (same key, same tempo, same loop length)
- Layer activation must be seamless — no clicks, pops, or tempo shifts when layers add/remove
- All loops must be seamless (zero-crossing points at loop boundaries)
- SFX must not clash tonally with any zone BGM (avoid tritone intervals with common zone keys)
- Stagnation audio effects must be achievable with Web Audio API (low-pass filter, playback rate change, reverb convolution)
- Maximum simultaneous audio tracks: 6 (BGM 4 layers + ambient + SFX). Plan for this limit.

### Mood Validation

For each generated track, verify:

- [ ] Matches the mood keyword specified in the track table
- [ ] Foundation instrument matches the specified solo instrument
- [ ] Tempo matches spec (within ±2 BPM)
- [ ] Key matches spec
- [ ] Loop is seamless
- [ ] All 4 layers sound good independently AND in any combination
- [ ] Stagnation modification sounds correctly eerie (not just "quieter")
- [ ] No dissonance between zone BGM and ambient layer
- [ ] Combat themes feel appropriately energetic/tense
- [ ] Victory/Level Up jingles are satisfyingly brief and warm
