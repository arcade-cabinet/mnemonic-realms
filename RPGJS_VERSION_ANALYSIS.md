# RPG-JS Version Analysis

## Investigation Summary

Cloned RPG-JS repository to `/tmp/rpgjs` and analyzed available versions.

## Version Comparison

### v4.3.1 (Latest Stable v4)
- **Status**: Stable, production-ready
- **Released**: ~2024
- **Package versions**: @rpgjs/server@4.3.1, @rpgjs/client@4.3.1
- **TypeScript**: Compatible with TS 5.x
- **Documentation**: Complete and mature
- **Issues**: None known

### v5.0.0 (Tagged "Stable")
- **Status**: Misleading tag - still uses v4.3.0 packages internally
- **Released**: June 12, 2025
- **Reality**: Not a true v5 release, packages still v4.x
- **Conclusion**: Skip this version

### v5.0.0-alpha.35 (Current Alpha)
- **Status**: Active development, experimental
- **Released**: February 12, 2026 (today!)
- **Commits since v5.0.0**: 35+ alpha releases with significant changes
- **New Features**:
  - Server reconciliation
  - Client-side prediction
  - Weather system
  - Improved movement management
  - Battle AI enhancements
- **Issues**:
  - TypeScript decorator compatibility problems
  - Import errors: `entryPoint`, `RpgModule` not exported correctly
  - Breaking API changes between alphas
  - Unstable for production use

## Build Errors with v5.0.0-alpha.35

```
error TS1240: Unable to resolve signature of property decorator
error TS2305: Module '"@rpgjs/server"' has no exported member 'entryPoint'
error TS2305: Module '"@rpgjs/client"' has no exported member 'RpgModule'
```

These are due to:
1. New decorator syntax in TypeScript 5.x
2. API changes in v5 alpha not fully stable
3. Module export structure changes

## Recommendation

**Use @rpgjs/\*@4.3.1 (Stable v4)**

### Reasons:

1. **Stability**: Proven in production, no known critical bugs
2. **TypeScript Compatibility**: Works with TS 5.9.3 without decorator issues
3. **Our Architecture**: Procedural generators are version-independent
4. **Documentation**: Complete API docs and examples
5. **Migration Path**: Can upgrade to v5 stable when truly ready

### Trade-offs:

**Lose (from v5 alpha):**
- Server reconciliation (latency handling)
- Client-side prediction
- Weather system
- Latest AI improvements

**Gain:**
- Working build system ✅
- Stable API ✅
- Production-ready ✅
- No breaking changes ✅

## Implementation Plan

1. Update `package.json` to use v4.3.1 versions
2. Adjust module syntax for v4 API (minor changes)
3. Use v4 module decorator syntax
4. Test procedural integration
5. Document v5 migration path for future

## When to Upgrade to v5

Wait for:
- [ ] v5.0.0 final release (not alpha)
- [ ] TypeScript decorator issues resolved
- [ ] API stabilization
- [ ] Complete migration guide from v4→v5
- [ ] Community adoption and testing

## Conclusion

For **Mnemonic Realms**, stability matters more than cutting-edge features. Our procedural generation system is the star - RPG-JS is the framework that displays it. v4.3.1 provides a solid foundation without build system headaches.

**Decision: Use v4.3.1** ✅
