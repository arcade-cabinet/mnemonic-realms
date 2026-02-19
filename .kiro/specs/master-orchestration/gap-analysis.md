# Gap Analysis: Master Orchestration External Review

> **Generated:** 2026-02-19 ~14:00 PST
> **Reviewer:** Claude (external monitor running parallel to Ralph)
> **Purpose:** Communicate findings Ralph cannot self-discover (runtime issues, build failures, cross-cutting concerns)
> **Update Policy:** This document is updated continuously as Ralph completes tasks. Read before each iteration.

---

## CRITICAL BLOCKERS (Must Fix Before Phase 5)

### B-01: Production Build Fails — `vite-plugin-map-extract` TypeError

**Severity:** CRITICAL — Blocks mobile deployment, PWA deployment, CI/CD, and GitHub Pages
**Discovered by:** External runtime testing
**Ralph's awareness:** Ralph has not attempted `pnpm build` during execution

**Root Cause:**
Task 2 (Create organized asset structure) created `assets/tilesets-organized/` containing collection-type `.tsx` tileset files (e.g., `Objects_Props_Interiors.tsx`). The RPG-JS compiler's `vite-plugin-map-extract.js` globs for `**/*.tsx` but only excludes `assets/tilesets/**`, NOT `assets/tilesets-organized/**`.

Collection-type tilesets have `columns="0"` and store images inside individual `<tile>` elements rather than a root `<image>` element. The plugin crashes at line 11:
```
result.tileset.image[0].$.source  // undefined — no root-level <image> in collection tilesets
```

**Fix Required:**
The patched compiler at `node_modules/.pnpm/@rpgjs+compiler@4.3.0_patch_hash=.../lib/build/utils.js` line 15 needs the glob ignore list updated:
```javascript
ignore: ['node_modules/**', 'dist/**', 'assets/tilesets/**', 'assets/tilesets-organized/**', 'gen/**']
```

Since this is a patched `node_modules` file, the fix should be applied to the pnpm patch file (check `package.json` `pnpm.patchedDependencies`).

**Impact on remaining tasks:**
- Task 45 (Build pipeline) will fail without this fix
- Task 46 (CI/CD) will fail without this fix
- Task 49 (Final builds) will fail without this fix

---

### B-02: Flaky Test — `sqljs.test.ts` Timestamp Race Condition

**Severity:** HIGH — Causes CI flakiness, undermines test confidence
**File:** `tests/unit/storage/sqljs.test.ts` line 61

**Root Cause:**
The "should overwrite existing data on save" test creates two `GameData` objects with `timestamp: Date.now()` in rapid succession. The `SqlJsProvider.load()` method returns the database's `updated_at` column (which is set at write time) rather than the original `timestamp` field from the `GameData` object. When both `Date.now()` calls land on the same millisecond, the returned timestamp can be off by 1ms.

**Fix:** Either:
1. Use a fixed timestamp in tests (e.g., `Date.now() - 1000` for first, `Date.now()` for second)
2. Compare timestamps with tolerance (e.g., `expect(Math.abs(loaded.timestamp - gameData2.timestamp)).toBeLessThanOrEqual(5)`)
3. Fix the provider to store/return the original `timestamp` from GameData consistently

---

### B-03: Broken Test File — `gen/builders/ddl-directory.test.ts`

**Severity:** MEDIUM — Pre-existing issue, not caused by Ralph
**Root Cause:** Mock configuration for `./manifest-io` doesn't properly coordinate with path resolution in `ddl-directory.ts`. The mocked `PROJECT_ROOT: '/mock/project'` creates paths like `/mock/project/gen/ddl` but the fs mocks don't align.

---

## VALIDATION QUALITY CONCERNS

### V-01: Validators May Be "Green-Lighting" Real Issues

Ralph's progress log claims validation passes with "expected" failures. External review finds:

| Metric | Ralph's Claim | External Assessment |
|--------|--------------|---------------------|
| 12 content errors | "Expected edge cases" | **Partially valid** — 3 are genuine (Sound Echo adaptive stats), 9 are parser limitations (boss sections) |
| 101 content warnings | "Catalog parser limitations" | **Valid concern** — 87 equipment + 24 quest warnings exist because catalog parsers were never fully implemented |
| 106 missing events | "Documented but not yet implemented" | **Legitimate gaps** — These ARE real missing events in TMX files. "Expected" framing minimizes the actual gap |
| 66 map boundary issues | "Intentional map transitions" | **Needs runtime verification** — Some may be real collision bugs |

**Recommendation for Ralph:**
- Do NOT claim "100% content completeness" (Task 27 exit criteria) when 106 events are missing from TMX files
- The catalog parsers for equipment and quests should be completed, not dismissed as "limitations"
- Map boundary issues need runtime verification before being dismissed

### V-02: Static Validation Cannot Verify Game Functionality

Ralph correctly flags this in Tasks 38 (NPC behavior) and 37 (puzzle mechanics), but then marks them as complete anyway with "documented as limitation." These tasks have requirements (16.3-16.5, 15.1-15.4) that genuinely require runtime testing:

- NPC dialogue state changes
- NPC movement patterns
- Puzzle solve/fail flows
- Event trigger chains
- Combat encounter rates
- Map transition functionality

**External monitor (Claude) is performing these runtime tests via Playwright and dev server.**

---

## ARCHITECTURE CONCERNS

### A-01: `src/` vs `main/` Directory Confusion

Ralph created platform code in `src/platform/`, `src/storage/`, `src/pwa/`. But the existing RPG-JS module lives entirely in `main/`. The service worker registration was added to `main/client/index.ts` by importing from `src/pwa/register.ts`.

**Concern:** The RPG-JS compiler (`rpgjs build`) may not include `src/` in its build graph. It compiles `main/` as the module root. Imports from `src/` into `main/` may work in dev mode (Vite resolves them) but could break in production builds.

**Recommendation:** Verify that `pnpm build` (once B-01 is fixed) correctly bundles `src/` imports. If not, the platform/storage/PWA code may need to move into `main/` or be configured as a separate Vite entry.

### A-02: Service Worker Path Assumptions

The service worker at `assets/service-worker.js` uses hardcoded paths:
- `'/mnemonic-realms/'` as cache prefix
- `'/mnemonic-realms/index.html'` in critical assets

This works for GitHub Pages deployment but will break for:
- Capacitor builds (served from `/` not `/mnemonic-realms/`)
- Local development (also served from different base)

**Recommendation:** Task 43 (platform adapter integration) should address base path configuration for service worker.

### A-03: Missing `seedrandom` Dependency

Dev server logs: `Failed to resolve dependency: seedrandom, present in 'optimizeDeps.include'`

This is a warning (not a blocker for dev mode) but indicates a missing/misconfigured dependency that could cause issues in production.

---

## PER-TASK REVIEW: Completed Work Quality

### Phase 0 (Tasks 1-3): Asset Curation ✅ GOOD
- Tileset audit is thorough
- Organization is well-structured by zone
- TMX compatibility report is comprehensive
- **Issue:** Created `assets/tilesets-organized/` which breaks build (see B-01)

### Phase 1 Content (Tasks 4-11): Validation Infrastructure ✅ GOOD
- All 7 validators are non-trivial implementations
- Dual-format reports (JSON + Markdown) are useful
- CLI with strict/permissive modes is well-designed
- **Issue:** Validators run against `dist/assets/` (built TMX files), not source — may need rebuild

### Phase 1 Mobile (Tasks 12-17): Platform Foundation ✅ GOOD
- Clean interface abstractions (StorageDriver, PlatformDetector)
- Property-based tests with fast-check are excellent
- Haptics graceful degradation is well-implemented
- **Issue:** All code lives in `src/` which may not be in RPG-JS build graph (see A-01)

### Phase 2 (Tasks 18-27): Content Validation ✅ MIXED
- Enemy implementation via template generator is clever
- Event documentation expansion was thorough
- **Issue:** "100% completeness" claim is misleading (V-01)
- **Issue:** Content validator catalog parsers incomplete (87 equipment + 24 quest warnings)

### Phase 3 (Tasks 28-35): Mobile Integration ✅ GOOD
- Capacitor config is correct (fixed appId space)
- iOS/Android configurations are appropriate (landscape, fullscreen)
- PWA manifest and service worker are functional
- **Issue:** Service worker path assumptions (A-02)

### Phase 4 (Tasks 36-41): Advanced Features ✅ MIXED
- Awakening intro event integrates well with existing quest system
- Puzzle/NPC/dungeon validators provide documentation verification
- Network handling and performance controller are well-designed
- **Issue:** Tasks 37-39 marked complete but requirements need runtime verification (V-02)

---

## REMAINING TASKS RISK ASSESSMENT

| Task | Risk | Notes |
|------|------|-------|
| 42. Touch controls | LOW | Standalone implementation, minimal dependencies |
| 43. Platform adapter integration | **HIGH** | Must address A-01 (src/ vs main/ build), A-02 (base paths) |
| 44. Platform integration tests | MEDIUM | Depends on 43 being correct |
| 45. Build pipeline | **CRITICAL** | BLOCKED by B-01 (build failure). Cannot succeed until fixed |
| 46. CI/CD pipeline | **CRITICAL** | BLOCKED by B-01 |
| 47. Content final validation | MEDIUM | Should address V-01 honestly |
| 48. Content completion | LOW | Depends on 47 |
| 49. Mobile final builds | **CRITICAL** | BLOCKED by B-01, depends on 43-46 |

---

## EXTERNAL MONITOR STATUS

The external Claude monitor is:
1. ✅ Created branch `ralph/kiro-specs-execution` and PR #5
2. ✅ Investigated build failure root cause (B-01)
3. ✅ Investigated test failures (B-02, B-03)
4. ✅ Reviewed all validator quality (V-01, V-02)
5. ✅ Identified architecture concerns (A-01, A-02, A-03)
6. 🔄 Runtime testing via Playwright (in progress)
7. 🔄 Fixing B-01 build failure orthogonally
8. 🔄 Fixing B-02 flaky test orthogonally
9. 🔄 Will push incremental commits to PR #5

---

## CHANGELOG

| Timestamp | Update |
|-----------|--------|
| 2026-02-19 ~14:00 | Initial gap analysis from external review of Tasks 1-41 |
