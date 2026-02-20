/**
 * Assemblage Testing — Fractal Verification at Every Level
 *
 * The same verification algebra at every layer of the onion:
 *   TILE     → Is this tile valid for its biome?
 *   ORGANISM → Can I reach every building from every entry?
 *   REGION   → Can I walk between every anchor?
 *   WORLD    → Can I reach every region from the start?
 *
 * Plus visual snapshots: build-time PNG renders at every level.
 * Words (docs) describe intent. Pixels (snapshots) verify reality.
 *
 * Architecture level: TESTING (cross-cutting)
 */

// Traversal verification
export {
  bfsFloodFill,
  formatReport,
  verifyFullConnectivity,
  verifyTraversal,
  type DisconnectedZone,
  type TargetResult,
  type TraversalReport,
} from './traversal-verifier';

// Visual rendering
export {
  renderASCII,
  renderGrid,
  renderToPNG,
  saveSnapshot,
  snapshotDir,
  writeSnapshot,
  type RenderOptions,
  type RenderOverlay,
} from './visual-renderer';

// DDL integrity
export {
  formatDDLReport,
  validateDDL,
  type DDLCheck,
  type DDLValidationReport,
} from './ddl-validator';
