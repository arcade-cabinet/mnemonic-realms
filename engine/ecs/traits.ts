import { trait } from 'koota';

// ── Position (tile coordinates) ──────────────────────────────────────────────
export const Position = trait({ x: 0, y: 0 });

// ── Rendering ────────────────────────────────────────────────────────────────
export const Sprite = trait({ sheet: '', frame: 0, width: 16, height: 16 });
export const Facing = trait({ direction: 'down' as 'up' | 'down' | 'left' | 'right' });

// ── Physics ──────────────────────────────────────────────────────────────────
export const Velocity = trait({ x: 0, y: 0 });

// ── Tags (no data) ──────────────────────────────────────────────────────────
export const Player = trait();
export const Npc = trait();
export const Collidable = trait();
export const Interactable = trait();

// ── Behavior ─────────────────────────────────────────────────────────────────
export const Dialogue = trait({
  id: '',
  lines: null as string[] | null,
  portrait: '',
});

export const AiState = trait({
  state: 'idle' as 'idle' | 'patrol' | 'follow',
});

export const PatrolPath = trait({
  points: null as { x: number; y: number }[] | null,
  currentIndex: 0,
});

// ── Game state ───────────────────────────────────────────────────────────────
export const Health = trait({ current: 0, max: 0 });

export const Inventory = trait({
  items: null as string[] | null,
});

export const QuestFlags = trait({
  flags: null as Record<string, boolean> | null,
});

export const AreaVibrancy = trait({ level: 0 });

// ── Interactive objects ──────────────────────────────────────────────────────
export const Chest = trait({
  contents: null as string[] | null,
  opened: false,
});

export const ResonanceStone = trait({
  stoneId: '',
  discovered: false,
  message: '',
});

// ── World transitions ────────────────────────────────────────────────────────
export const Transition = trait({
  targetMap: '',
  targetX: 0,
  targetY: 0,
});

export const Trigger = trait({
  eventId: '',
  condition: '',
});
