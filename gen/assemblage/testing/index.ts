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

// DDL integrity
export {
  type DDLCheck,
  type DDLValidationReport,
  formatDDLReport,
  validateDDL,
} from './ddl-validator';
// Traversal verification
export {
  bfsFloodFill,
  type DisconnectedZone,
  formatReport,
  type TargetResult,
  type TraversalReport,
  verifyFullConnectivity,
  verifyTraversal,
} from './traversal-verifier';
// Visual rendering
export {
  type RenderOptions,
  type RenderOverlay,
  renderASCII,
  renderGrid,
  renderToPNG,
  saveSnapshot,
  snapshotDir,
  writeSnapshot,
} from './visual-renderer';
