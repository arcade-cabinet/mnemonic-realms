# Audio Pipeline Research Report

> Research for Mnemonic Realms v2.0 audio implementation.
> Cross-references: [audio-direction.md](audio-direction.md), [visual-direction.md](visual-direction.md), [../world/vibrancy-system.md](../world/vibrancy-system.md)

---

## Executive Summary

**Recommendation: Hybrid approach -- curated OGG stems for BGM + Tone.js for dynamic playback/effects + jsfxr-generated SFX.**

The audio-direction.md spec calls for 67 audio assets (72 BGM stems, 32 SFX, 10 ambient loops) with a sophisticated 4-layer vibrancy system, stagnation audio effects (low-pass filter, tempo reduction, heavy reverb), and dynamic layer crossfading. This is a large but well-defined scope.

Pure procedural generation via Tone.js cannot achieve the orchestral, acoustic instrument quality the spec demands (solo violin, French horn, choir, acoustic guitar). Conversely, static audio files alone cannot deliver the dynamic vibrancy layer system or stagnation effects. The hybrid approach plays to each technology's strengths:

| Concern | Solution |
|---------|----------|
| BGM composition (72 stems) | Pre-authored OGG files (AI-generated via Suno/Udio or hand-composed) |
| Dynamic layer activation | Tone.js Players + Gain nodes, synchronized via Transport |
| Stagnation audio effects | Tone.js Filter, Reverb, playbackRate manipulation |
| SFX (32 effects) | jsfxr preset generation (build-time WAV export) + Howler.js playback |
| Ambient loops (10) | Pre-recorded OGG files, played via Howler.js/RPG-JS Sound |
| RPG-JS integration | Thin adapter bridging RPG-JS Sound decorator to Tone.js/Howler |

**Estimated total audio bundle size**: ~15-25 MB (OGG at 44.1kHz, 16-bit, 2-3 min loops). This is acceptable for a browser game with asset loading screens.

---

## Tone.js Capabilities Assessment

### Overview

Tone.js (v15.1.x, latest stable) is a Web Audio API framework for interactive music in the browser. It wraps the Web Audio API with musical abstractions: Transport (global timeline), Instruments (synths), Effects, and Signals.

**Bundle size**: ~150-200 KB minified + gzipped (full library). Tree-shakeable -- importing only Player, Transport, Gain, Filter, Reverb brings this to ~80-100 KB.

**npm weekly downloads**: ~228K (healthy, actively maintained).

### Relevant Capabilities

**1. Synchronized Multi-Track Playback (Critical for 4-Layer System)**

Tone.js provides `Tone.Player` for sample playback and `Tone.Transport` for global scheduling. Multiple Players can be started simultaneously and kept in sync:

```typescript
const layer1 = new Tone.Player('bgm-vh-layer1.ogg').toDestination();
const layer2 = new Tone.Player('bgm-vh-layer2.ogg');
const layer2Gain = new Tone.Gain(0).toDestination(); // muted initially
layer2.connect(layer2Gain);

// Start both at the same time
Tone.Transport.start();
layer1.start(0);
layer2.start(0);

// Fade in layer 2 when vibrancy crosses 34
layer2Gain.gain.rampTo(1, 4); // 4-second fade as spec requires
```

**2. Audio Effects (Critical for Stagnation Zones)**

Tone.js has built-in nodes that directly map to the stagnation effects from the spec:

| Spec Requirement | Tone.js Node | Notes |
|------------------|-------------|-------|
| Low-pass filter at 800 Hz | `Tone.Filter({ frequency: 800, type: 'lowpass', rolloff: -12 })` | Direct match |
| Tempo reduction to 0.7x | `player.playbackRate = 0.7` | Native Web Audio |
| Heavy reverb (80% wet) | `Tone.Reverb({ wet: 0.8 })` | Convolver-based |
| Crystal ambient loop | `Tone.Player` with loop=true | Straightforward |
| SFX muffling at 2000 Hz | `Tone.Filter({ frequency: 2000 })` on SFX bus | Route all SFX through bus |

**3. CrossFade**

`Tone.CrossFade` provides equal-power crossfading between two inputs, useful for zone transitions and the stagnation break sequence.

**4. Synthesis Capabilities**

Tone.js includes synthesizers (Synth, FMSynth, AMSynth, PolySynth, NoiseSynth) with oscillator waveforms (sine, square, sawtooth, triangle, fmsquare). These can produce:
- Chiptune/8-bit sounds (square/pulse waves)
- FM synthesis tones (metallic, bell-like)
- Noise-based effects (wind, static)

However, Tone.js synthesis **cannot** produce convincing acoustic instruments (violin, flute, French horn, choir, acoustic guitar). The audio-direction spec overwhelmingly calls for acoustic/orchestral timbres. Synthesis is useful only for:
- UI SFX (chimes, clicks, error tones)
- Crystal/glass effects in stagnation zones
- The "harmonic overtone series" foundation in BGM-DM5
- Supplementary ambient textures

### Limitations

1. **No acoustic instrument synthesis**: Cannot generate realistic violin, cello, choir, etc. This rules out procedural BGM generation for most tracks.
2. **CPU cost of ConvolverNode**: The reverb effect is the most expensive node. Limit to 1-2 active convolver instances.
3. **Mobile autoplay restrictions**: `Tone.start()` must be called from a user gesture. This is already handled by the title screen interaction.
4. **No built-in sequencer/composition engine**: Tone.js provides scheduling primitives but not a composition algorithm. Writing a generative music engine from scratch is a multi-month endeavor.

### Verdict on Pure Procedural

**Pure Tone.js procedural generation is not viable for this spec.** The spec calls for specific acoustic instruments (acoustic guitar fingerpicked, solo violin with vibrato, French horn, duduk, glass armonica) that require high-quality sampled audio. Tone.js synthesis produces electronic/chiptune timbres, not orchestral ones.

However, Tone.js is **excellent** as the dynamic playback engine for pre-recorded stems: synchronized multi-track playback, gain automation, filter/reverb effects, and transport-synced scheduling.

---

## Free Audio Library Survey

### BGM Sources

#### OpenGameArt.org

| Resource | License | Coverage | Quality | Notes |
|----------|---------|----------|---------|-------|
| [16-bit (J)RPG Free Music Pack](https://opengameart.org/content/16-bit-jrpg-free-music-pack) | CC-BY | Partial (town, battle, overworld) | Good | SNES-inspired, but not layered stems |
| [CC0 Retro Music](https://opengameart.org/content/cc0-retro-music) | CC0 | Limited | Medium | 8-bit focused, not orchestral |
| [RPG::Music](https://opengameart.org/content/rpgmusic) | Varies | Medium | Varies | Collection of RPG tracks |
| [10 Track Modern Chiptune Demo](https://opengameart.org/content/10-track-modern-chiptune-demo) (Dec 2025) | CC0 | Limited | Good | Modern chiptune, not SNES orchestral |
| [Chiptune Battle Music](https://opengameart.org/content/chiptune-battle-music) | Varies | Battle only | Good | Useful for combat |

**Limitation**: No existing free collection provides 4-layer stems. All are single mixed tracks. The vibrancy layer system requires stems to be authored specifically.

#### itch.io

| Resource | License | Coverage | Quality | Notes |
|----------|---------|----------|---------|-------|
| [High Quality 16-bit RPG Music](https://itch.io/game-assets/free/tag-16-bit/tag-music) (28 tracks) | CC0 | Good RPG coverage | High | SNES-style, single tracks |
| [Chiptune Adventure Music Pack](https://philipzubarik.itch.io/chiptune-adventure-music-pack) (11 tracks) | Free | Adventure/RPG | Good | WAV + MP3, loopable |
| [FREE Music Loop Bundle](https://tallbeard.itch.io/music-loop-bundle) | Free | General game | Medium | Various genres |
| [Free Chiptune/Retro Music Pack](https://justfreegames.itch.io/free-music) | Free | General | Medium | Mixed quality |

**Best for**: Placeholder audio during development, ambient loops, and potentially the simpler BGM tracks. None provide layered stems.

#### Freesound.org

Freesound is strongest for **ambient loops and SFX**, not composed BGM:
- Rich collections of nature ambience (forest, water, wind, birds)
- Environmental sounds (door creaks, footsteps, crystals)
- CC0 and CC-BY licensed

**Best for**: The 10 ambient loops specified in the audio direction (village chatter, forest rustling, wind, water, etc.).

### SFX Sources

| Resource | License | Coverage | Notes |
|----------|---------|----------|-------|
| [jsfxr / sfxr.me](https://sfxr.me/) | CC0 (generated) | Full SFX coverage | **Best option**: procedural SFX generator with presets for all 32 spec'd effects |
| [ChipTone](https://sfbgames.itch.io/chiptone) | CC0 (generated) | Full SFX coverage | Alternative to jsfxr, more control |
| [RPG Sound Pack](https://opengameart.org/content/rpg-sound-pack) | CC0 | RPG-specific | Pre-made RPG SFX |
| [CC0 Sound Effects](https://opengameart.org/content/cc0-sound-effects) | CC0 | General game | Large collection |

**Recommendation**: Use **jsfxr** (npm: `jsfxr`) for all 32 SFX. It runs in the browser or as a build tool, generates WAV from preset parameters, and covers every SFX type in the spec (chimes, hits, explosions, UI clicks, magic effects). Parameters can be stored as JSON and regenerated deterministically.

### Ambient Loop Sources

Freesound.org and OpenGameArt have excellent ambient loop coverage:
- Forest ambience, river sounds, wind, village bustle -- all available in CC0
- Can be downloaded as OGG/WAV at required quality (44.1kHz, 16-bit)
- 10 loops at ~30 seconds each = minimal bundle size (~2-3 MB)

---

## RPG-JS Audio Integration

### Current System

RPG-JS 4.3.0 uses **Howler.js** internally for audio playback. The integration works through:

1. **Client-side `@Sound` decorator** (`@rpgjs/client`): Registers audio files with an ID
   ```typescript
   @Sound({ id: 'town-bgm', sound: require('./sound/town.ogg') })
   export class TownBgm {}
   ```

2. **`RpgSound` singleton** (`@rpgjs/client`): Wraps Howler.js with `play(id)`, `stop(id)`, `get(id)` methods. Lazy-instantiates `Howl` objects on first play.

3. **Server-side `player.playSound(id)`**: Triggers client-side playback via RPC.

4. **Map-level sounds**: The `@MapData` decorator accepts a `sounds: string[]` property for auto-playing BGM/BGS when a map loads.

### Howler.js Capabilities (Already Bundled)

Since RPG-JS already includes Howler.js (~7 KB gzipped), we get:
- Audio playback (OGG, MP3, WAV, WebM)
- Looping, volume control, fade
- Audio sprites (multiple sounds in one file)
- Web Audio API backend with HTML5 Audio fallback
- Spatial audio (3D panning) via optional plugin

### Integration Strategy

**Do NOT replace Howler.js.** Instead, build a **parallel Tone.js audio engine** that handles the advanced features (4-layer sync, stagnation effects, dynamic mixing) while using RPG-JS's existing Sound system for simple one-shot playback (SFX, ambient loops).

```
Architecture:

  RPG-JS Sound (@Sound decorator)    Tone.js Audio Engine
  ================================   =====================
  - One-shot SFX (32 effects)        - 4-layer BGM playback
  - Ambient loops (10 biomes)        - Vibrancy gain automation
  - Victory/LevelUp jingles          - Stagnation effects chain
  - Simple playback via Howler.js     - Zone transition crossfade
                                      - Combat music switching
                                      - God Recall / Bloom sequences
```

**Bridge pattern**: A `MnemonicAudioManager` class coordinates both systems:
- Listens to game events (zone change, vibrancy update, combat start/end, stagnation enter/exit)
- Routes simple sounds to RPG-JS Sound
- Routes complex layered music to Tone.js engine
- Manages the overall volume hierarchy (BGM 70%, SFX 85%, Ambient 50%, UI 80%)

---

## Architecture Recommendation

### Recommended Architecture: Hybrid Stem Playback

```
Build Pipeline:

  Audio Assets (OGG stems)           SFX Presets (JSON)
  authored externally                jsfxr parameters
         |                                |
         v                                v
  assets/audio/bgm/                  build: generate WAV
    vh-layer1.ogg                    assets/audio/sfx/
    vh-layer2.ogg                      ui-confirm.wav
    vh-layer3.ogg                      cbt-hit-light.wav
    vh-layer4.ogg                      ...
    ...
         |                                |
         v                                v
  Tone.js Players (runtime)          RPG-JS Sound / Howler.js
  synchronized via Transport         one-shot playback
         |                                |
         v                                v
  GainNodes per layer                 Direct to AudioContext
  Filter/Reverb for stagnation       destination
         |                                |
         +-----------+-------------------+
                     |
                     v
              AudioContext.destination
```

### Integration with GenAI Manifest Pipeline

The audio pipeline fits naturally into the existing GenAI asset manifest pattern:

1. **Audio manifest** (`audio-manifest.json`): Declares all 114 audio files with metadata (ID, path, format, loop points, vibrancy layer, zone association)
2. **Gemini code generation**: Can generate Tone.js instrument routing code from the manifest (e.g., "create 4 Players for zone VH, connect through gain nodes, set up vibrancy thresholds"). This is a code-generation task, not a music-generation task.
3. **Suno/Udio for BGM stems**: AI music generators can produce the 72 BGM stems from text prompts derived from the audio-direction spec. Each layer is generated as a separate stem with matching tempo, key, and loop length.

### Can Gemini Generate Tone.js Instrument Definitions?

**Yes, but for routing code, not for music composition.** Gemini can:
- Read the audio-direction.md spec
- Generate the `MnemonicAudioManager` class with correct gain routing, filter chains, and vibrancy thresholds
- Generate manifest files mapping zone IDs to stem file paths
- Generate stagnation effect presets (filter frequency, reverb wet, playback rate)

Gemini should **not** be used to generate actual audio content or Tone.js synthesis patches for BGM. The spec requires acoustic instrument quality that only sampled audio can deliver.

### Build/Bundle Strategy

**Pre-rendered OGG files (not runtime synthesis).**

| Asset Type | Format | Count | Est. Size Each | Est. Total |
|------------|--------|-------|----------------|------------|
| BGM stems | OGG Vorbis, 44.1kHz, stereo | 72 | 150-300 KB | ~15 MB |
| Combat BGM stems | OGG Vorbis | 12 | 200-400 KB | ~3 MB |
| Event music | OGG Vorbis | 7 | 100-500 KB | ~2 MB |
| SFX | WAV, mono | 32 | 5-30 KB | ~0.5 MB |
| Ambient loops | OGG Vorbis, mono | 10 | 100-200 KB | ~1.5 MB |
| **Total** | | **133** | | **~22 MB** |

Lazy loading by zone: only load the current zone's 4 stems + combat stems + SFX. Estimated per-zone audio load: ~2-3 MB.

---

## Cost/Effort Comparison

### Option A: Pure Procedural (Tone.js Only)

| Aspect | Assessment |
|--------|------------|
| Quality | LOW -- cannot produce acoustic/orchestral timbres |
| Bundle size | SMALL (~100 KB code, no audio files) |
| Development effort | VERY HIGH -- requires writing a generative composition engine |
| Vibrancy system | EASY -- gain control is trivial with synthesis |
| Stagnation effects | EASY -- filter/reverb directly on synth chain |
| Time estimate | Months of composition engine development |
| **Verdict** | **Not viable** for this spec's acoustic instrument requirements |

### Option B: Pure Curated (Pre-Mixed Tracks)

| Aspect | Assessment |
|--------|------------|
| Quality | HIGH -- authored tracks match spec exactly |
| Bundle size | LARGE (~50+ MB if separate tracks per vibrancy tier) |
| Development effort | LOW (for code), HIGH (for authoring 67+ tracks) |
| Vibrancy system | POOR -- would need 3 separate mixes per zone (muted/normal/vivid) |
| Stagnation effects | IMPOSSIBLE without Web Audio API manipulation |
| Time estimate | Weeks of music production, minimal code |
| **Verdict** | **Cannot deliver** the dynamic vibrancy or stagnation effects |

### Option C: Hybrid Stems (Recommended)

| Aspect | Assessment |
|--------|------------|
| Quality | HIGH -- authored stems + dynamic mixing |
| Bundle size | MODERATE (~22 MB total, ~3 MB per zone) |
| Development effort | MEDIUM -- Tone.js routing + stem authoring |
| Vibrancy system | EXCELLENT -- gain-controlled layer activation |
| Stagnation effects | EXCELLENT -- Tone.js Filter/Reverb/playbackRate |
| Time estimate | 1-2 weeks Tone.js integration code, ongoing stem production |
| **Verdict** | **Best fit** for the audio-direction.md spec |

### Development Phases

1. **Phase 1: Infrastructure** (can start now)
   - `MnemonicAudioManager` class with Tone.js integration
   - 4-layer gain routing with vibrancy thresholds
   - Stagnation effect chain
   - Zone transition crossfade logic
   - RPG-JS bridge (game events to audio manager)

2. **Phase 2: SFX** (can start now, parallel)
   - Define all 32 SFX as jsfxr presets
   - Build script to export WAV files
   - Register with RPG-JS Sound decorator

3. **Phase 3: Placeholder BGM** (parallel with Phase 1)
   - Source CC0 tracks from OpenGameArt/itch.io for each zone
   - Single-layer placeholders to test the pipeline
   - Ambient loops from Freesound.org

4. **Phase 4: Production BGM** (after visual assets)
   - Generate 72 BGM stems via AI music tools (Suno/Udio) or commission
   - Each zone: 4 stems, same key/tempo/loop-length, harmonically compatible
   - Combat, event, and credits music
   - Validate against mood/instrument spec in audio-direction.md

---

## Key Technical Decisions

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| Primary BGM engine | Tone.js (Player + Gain + Filter) | Only option that supports dynamic layer activation + stagnation effects |
| SFX engine | RPG-JS Sound (Howler.js) | Already bundled, perfect for one-shot playback |
| SFX generation | jsfxr (build-time) | CC0, deterministic, covers all 32 SFX types |
| BGM format | OGG Vorbis stems | Best compression-to-quality ratio for web |
| Loading strategy | Per-zone lazy loading | Keeps initial load small (~3 MB per zone) |
| Stagnation effects | Tone.js effect chain (runtime) | Cannot be pre-baked; must respond to game state |
| Ambient loops | Howler.js via RPG-JS Sound | Simple looping, no dynamic effects needed |
| Audio manifest | JSON file in GenAI pipeline | Consistent with existing asset pipeline pattern |

---

## Appendix: Key Links

### Libraries
- [Tone.js](https://tonejs.github.io/) -- Web Audio framework (MIT license)
- [Howler.js](https://howlerjs.com/) -- Audio playback library (MIT, bundled with RPG-JS)
- [jsfxr](https://sfxr.me/) -- Procedural SFX generator (CC0 output)
- [ChipTone](https://sfbgames.itch.io/chiptone) -- Alternative SFX generator (CC0 output)

### Free Audio Resources
- [OpenGameArt - 16-bit JRPG Music Pack](https://opengameart.org/content/16-bit-jrpg-free-music-pack)
- [OpenGameArt - CC0 Music](https://opengameart.org/content/cc0-music-0)
- [OpenGameArt - RPG Sound Pack](https://opengameart.org/content/rpg-sound-pack)
- [itch.io - Free 16-bit Audio](https://itch.io/game-assets/free/tag-16-bit/tag-audio)
- [itch.io - Free Chiptune Music](https://itch.io/game-assets/free/tag-chiptune/tag-music)
- [Freesound.org](https://freesound.org/) -- Ambient loops and environmental SFX

### Reference
- [Dynamic Game Music with Web Audio](https://cschnack.de/blog/2020/webaudio/) -- Stem synchronization technique
- [Web Audio for Games (web.dev)](https://web.dev/articles/webaudio-games) -- Google's game audio guide
- [Tone.js Performance Wiki](https://github.com/Tonejs/Tone.js/wiki/Performance) -- Optimization tips
- [RPG-JS Sound Docs](https://docs.rpgjs.dev/commands/common.html) -- playSound API
