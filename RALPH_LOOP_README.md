# Ralph Loop for Mnemonic Realms

Autonomous spec execution system for Kiro-based development.

## Quick Start

```bash
# Run mobile deployment spec (up to 50 iterations)
./ralph-loop-kiro-specs-script.sh 50 mobile-deployment-and-pwa

# Run content spec (up to 50 iterations)
./ralph-loop-kiro-specs-script.sh 50 complete-game-content-and-creative-direction
```

## What is Ralph Loop?

Ralph Loop is an automated, iterative agent runner that executes Kiro specs autonomously. Instead of one-shot prompts, Ralph runs Kiro repeatedly in a loop where each iteration:

1. Picks ONE task from the spec
2. Implements it completely
3. Verifies exit criteria
4. Records learnings (corrections & patterns)
5. Moves to the next task

The agent learns from its mistakes across iterations, creating a self-correcting feedback loop.

## Project Structure

```
mnemonic-realms/
├── ralph-loop-kiro-specs-script.sh    # The loop runner
├── ralph-loop-kiro-specs-prompt.md    # Agent instructions
├── .ralph/
│   ├── PROMPT.md                      # Legacy Ralph config (for reference)
│   ├── fix_plan.md                    # High-level execution plan
│   └── ASSET_CURATION_GUIDE.md        # Phase 0 guide
└── .kiro/
    ├── steering/
    │   └── product.md                 # Product context
    └── specs/
        ├── mobile-deployment-and-pwa/
        │   ├── requirements.md
        │   ├── design.md
        │   ├── tasks.md
        │   ├── progress.md            # Auto-created: corrections & patterns
        │   ├── specs_time.md          # Auto-created: timing log
        │   └── summary.html           # Auto-generated on completion
        └── complete-game-content-and-creative-direction/
            ├── requirements.md
            ├── design.md
            ├── tasks.md
            ├── gap-analysis.md
            ├── progress.md            # Auto-created
            ├── specs_time.md          # Auto-created
            └── summary.html           # Auto-generated on completion
```

## Available Specs

### 1. mobile-deployment-and-pwa
Platform abstraction and multi-platform deployment (iOS, Android, PWA).

**Tasks:** 23 tasks covering:
- Platform detection and abstraction
- Storage layer (SQLite for mobile, sql.js for web)
- Haptics controller
- Capacitor configuration
- PWA manifest and service worker
- Network handling and performance optimization
- Build pipeline

**Estimated iterations:** 40-50

### 2. complete-game-content-and-creative-direction
Validation infrastructure and content completion.

**Tasks:** 24 tasks covering:
- Asset curation and organization (Phase 0 - NEW)
- Validation tools (visual, sprite, map, event, content)
- Enemy implementation (17 missing enemies)
- Visual consistency fixes
- Event placement verification
- Content completeness validation

**Estimated iterations:** 50-60

## Usage

### Basic Command

```bash
./ralph-loop-kiro-specs-script.sh <max_iterations> <specs_name>
```

### Arguments

- `max_iterations`: Maximum number of loop iterations (positive integer)
- `specs_name`: Name of spec directory under `.kiro/specs/`

### Iteration Modes

When you run the script, you'll be asked:

**Automatic mode (y):**
- Ralph runs through tasks back-to-back without pausing
- Good for well-defined specs where you trust the process
- Fastest execution

**Manual mode (n):**
- Ralph pauses after each iteration
- You press Enter to continue
- Good for reviewing changes incrementally
- Recommended for first run

### Example Sessions

**Mobile spec (automatic):**
```bash
./ralph-loop-kiro-specs-script.sh 50 mobile-deployment-and-pwa
# Choose 'y' for automatic mode
# Ralph will execute all 23 tasks autonomously
```

**Content spec (manual):**
```bash
./ralph-loop-kiro-specs-script.sh 60 complete-game-content-and-creative-direction
# Choose 'n' for manual mode
# Review progress.md after each task
# Press Enter to continue
```

## How It Works

### Phase-Based Execution

Each iteration follows 6 phases:

**Phase 1: Load Context**
- Reads steering files (product.md, etc.)
- Reads spec files (requirements.md, design.md, tasks.md)
- Reads progress.md (corrections & patterns from previous iterations)

**Phase 2: Pick ONE Task**
- Finds lowest-numbered incomplete task
- Records start time
- Reads referenced requirements and design details

**Phase 3: Understand Before Implementing**
- Reads existing source files
- Studies current patterns and conventions
- Re-reads Corrections section (mistakes to avoid)
- Re-reads Codebase Patterns section (conventions to follow)

**Phase 4: Implement**
- Implements the task and all subtasks
- Runs tests and type checks
- Fixes any failures
- Adds corrections immediately when errors occur

**Phase 5: Verify Exit Criteria**
- Confirms all exit criteria are satisfied
- Verifies design constraints are met
- Goes back and fixes if anything is missing

**Phase 6: Update Tracking**
- Marks task complete in tasks.md
- Appends progress entry to progress.md
- Adds new patterns to Codebase Patterns section
- Records timing to specs_time.md

### Self-Correction System

The `Corrections` section in `progress.md` is a lookup table of mistakes and fixes:

```markdown
## Corrections

- ❌ `npm test` → ✅ `npm run test:unit` (project uses separate test scripts)
- ❌ `import { foo } from 'lib'` → ✅ `import { foo } from 'lib/index.js'` (ESM requires explicit extensions)
- ❌ UNRESOLVED: [description of issue that couldn't be fixed after 5 attempts]
```

Every iteration reads this before doing any work and never repeats a listed mistake.

### Codebase Patterns

The `Codebase Patterns` section accumulates conventions:

```markdown
## Codebase Patterns

**Project Structure & Modules**
- Test files use `.test.ts` suffix, located in `tests/unit/`
- Platform code goes in `src/platform/`, storage in `src/storage/`

**Testing**
- Run tests with `npm run test:unit`
- Use Vitest for unit tests, fast-check for property tests
- Property tests must run minimum 100 iterations
```

## Monitoring Progress

### During Execution

Watch the console output for:
- Current iteration number
- Task being implemented
- Test results
- Error messages

### Between Iterations (Manual Mode)

Check these files:
- `progress.md` - See what was implemented, corrections added
- `specs_time.md` - See timing for each task
- `tasks.md` - See which tasks are complete

### After Completion

When all tasks are done, Ralph generates `summary.html`:
- Visual dashboard with task tree
- Timing table
- Corrections and patterns (collapsible)
- Overall status and metrics

## Tips

### Setting max_iterations

- Set to at least the number of tasks + 20% buffer
- Mobile spec: 23 tasks → use 30-50 iterations
- Content spec: 24 tasks → use 30-60 iterations
- Failed tasks may retry, so buffer is important

### First Run Recommendations

1. Start with manual mode to understand the flow
2. Review progress.md after first few tasks
3. Check that corrections look reasonable
4. Switch to automatic mode once confident

### If Ralph Gets Stuck

If a task is marked `[F]` (failed):
1. Read the progress entry for that task
2. Check the UNRESOLVED correction
3. Fix the issue manually
4. Update tasks.md to mark it `[ ]` (incomplete)
5. Re-run Ralph

### Improving Results

The more context you provide, the better:
- Keep `.kiro/steering/product.md` up to date
- Add project-specific patterns to progress.md early
- Document common corrections as you discover them

## Completion

When all tasks are complete:
1. Ralph generates `summary.html` in the spec directory
2. Console shows: `✅ All tasks complete!`
3. Script exits with code 0
4. Output includes: `<promise>COMPLETE</promise>`

Open `summary.html` in a browser to see:
- Task completion tree (hover for details)
- Timing breakdown
- Corrections and patterns
- Overall metrics

## Troubleshooting

### "No specs named 'X' found"
- Check spelling of spec name
- List available specs: `ls .kiro/specs/`
- Use exact directory name

### "Max iterations reached"
- Increase max_iterations value
- Check progress.md to see how far it got
- Resume by re-running with same spec name

### Tests failing repeatedly
- Check Corrections section in progress.md
- May need to add correction manually
- Verify test commands in package.json

### Script won't execute
- Make sure it's executable: `chmod +x ralph-loop-kiro-specs-script.sh`
- Check you have kiro-cli installed: `which kiro-cli`

## Advanced Usage

### Running Both Specs in Parallel

You can run both specs simultaneously in different terminals:

```bash
# Terminal 1
./ralph-loop-kiro-specs-script.sh 50 mobile-deployment-and-pwa

# Terminal 2
./ralph-loop-kiro-specs-script.sh 60 complete-game-content-and-creative-direction
```

Note: Phase 0 (asset curation) in content spec should complete before mobile spec starts using assets.

### Resuming After Interruption

If you stop Ralph mid-execution:
1. Check tasks.md to see last completed task
2. Check progress.md for any partial work
3. Re-run with same command - Ralph picks up where it left off

### Custom Steering Files

Add project-specific context:
- `.kiro/steering/structure.md` - Project structure conventions
- `.kiro/steering/tech.md` - Tech stack and tooling

Ralph will automatically read these if they exist.

## License

Apache License 2.0

## Credits

Based on the Ralph Loop technique by the Kiro community.
Adapted for Mnemonic Realms spec-driven development.
