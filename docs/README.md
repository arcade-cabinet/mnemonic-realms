# Mnemonic Realms Documentation

Welcome to the Mnemonic Realms documentation hub. This directory contains comprehensive documentation for the game's vision, architecture, and design.

## Documentation Structure

### 📖 Vision
High-level product vision, game concept, and player experience design.

- **[GAME_VISION.md](vision/GAME_VISION.md)** - Complete game vision document
  - Core concept and seed philosophy
  - Visual style and aesthetic goals
  - Gameplay systems overview
  - Technical vision
  - Success metrics and development phases

### 🏗️ Architecture
Technical architecture, system design, and implementation details.

- **[SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md)** - Complete system architecture
  - Technology stack decisions
  - Architecture layers (Presentation, Generation, Game Engine)
  - Data flow and integration points
  - Deployment architecture
  - Performance and security considerations

### 🎮 Design
Detailed game systems, mechanics, formulas, and interactions.

- **[GAME_SYSTEMS.md](design/GAME_SYSTEMS.md)** - Comprehensive game systems design
  - Character system (stats, classes, skills)
  - Combat mechanics and damage calculation
  - Loot system and item generation
  - World generation and biomes
  - NPC and quest systems
  - UI/UX design specifications

### 📝 Development Log
Chronological record of development progress, decisions, and milestones.

- **[DEVLOG.md](DEVLOG.md)** - Development log with detailed changelog
  - Major milestones and implementations
  - Technical decisions log
  - Lessons learned
  - Performance metrics
  - Next steps and roadmap

## Quick Links

### For Players
- [What is Mnemonic Realms?](vision/GAME_VISION.md#executive-summary)
- [How does the seed system work?](vision/GAME_VISION.md#the-seed-philosophy)
- [What's the visual style?](vision/GAME_VISION.md#visual-style)
- [What gameplay features exist?](design/GAME_SYSTEMS.md#core-game-loop)

### For Developers
- [Architecture overview](architecture/SYSTEM_ARCHITECTURE.md#high-level-overview)
- [Tech stack decisions](architecture/SYSTEM_ARCHITECTURE.md#technology-choices)
- [ECS system details](architecture/SYSTEM_ARCHITECTURE.md#entity-component-system)
- [Development roadmap](DEVLOG.md#next-steps-prioritized)

### For Contributors
- [Current development status](DEVLOG.md#current-state)
- [Known issues](DEVLOG.md#known-issues)
- [Next steps](DEVLOG.md#next-steps-prioritized)
- [How to contribute](../README.md#contributing)

## Document Metadata

All documentation files include YAML frontmatter with:
- **title**: Document title
- **version**: Document version (semantic versioning)
- **date**: Last update date (YYYY-MM-DD)
- **authors**: List of contributors
- **status**: Active, Draft, Deprecated, or Archived
- **tags**: Categorization tags

Example:
```yaml
---
title: "Document Title"
version: 1.0.0
date: 2026-02-12
authors: ["author1", "author2"]
status: "Active"
tags: ["tag1", "tag2"]
---
```

## Documentation Standards

### Writing Style
- Clear and concise language
- Technical accuracy
- Examples and code snippets where relevant
- Diagrams and flowcharts for complex systems
- Cross-references between documents

### Update Policy
- Update docs when implementing changes
- Increment version on significant changes
- Update date on every edit
- Add to changelog/devlog for major updates

### Review Process
- All docs reviewed before merging
- Technical accuracy verified
- Links checked for validity
- Examples tested and verified

## Additional Resources

### Root Level Documentation
- [README.md](../README.md) - Main project README with quick start
- [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) - Implementation summary
- [ARCHITECTURE_DECISION.md](../ARCHITECTURE_DECISION.md) - Key architecture decision
- [RPGJS_VERSION_ANALYSIS.md](../RPGJS_VERSION_ANALYSIS.md) - RPG-JS version comparison
- [RPGJS_STANDALONE_EVALUATION.md](../RPGJS_STANDALONE_EVALUATION.md) - Standalone mode analysis
- [NEXTJS_RPGJS_EVALUATION.md](../NEXTJS_RPGJS_EVALUATION.md) - Next.js integration evaluation

### External Resources
- [RPG-JS Documentation](https://docs.rpgjs.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [ecsy Documentation](https://ecsy.io/docs/)
- [seedrandom Documentation](https://www.npmjs.com/package/seedrandom)

## Version History

### v1.0.0 (2026-02-12)
- Initial documentation structure
- Complete vision, architecture, and design docs
- Development log with comprehensive changelog
- Document index and navigation

---

**Status**: 📚 Documentation Complete and Active
**Last Updated**: 2026-02-12
**Next Review**: As needed with major feature additions
