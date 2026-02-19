---
inclusion: auto
description: Product overview, core concept, and content source of truth for Mnemonic Realms
---

# Product Overview

Mnemonic Realms is a single-player 16-bit JRPG about memory as creative vitality. The game world is young and unfinished, growing more vivid as players discover and recall memory fragments.

The game runs entirely in the browser using RPG-JS in standalone mode (no multiplayer server required).

## Core Concept

- Memory fragments drive world vibrancy and progression
- 16-bit aesthetic with procedurally generated assets
- Single-player experience with no backend dependencies
- Deployed to GitHub Pages for browser-based play

## Content Source of Truth

All game content is authored in `docs/` as the game bible:
- Design specs (combat, classes, items, enemies, skills, UI)
- Story content (characters, dialogue, quests, act scripts)
- World building (theme, setting, factions, geography)
- Map layouts (overworld, dungeons, zones)

The GenAI pipeline (`gen/`) transforms these docs into game assets and code.
