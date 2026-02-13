/**
 * Type-safe helpers for RPG-JS GUI inject properties.
 * Vue Options API inject doesn't support TypeScript inference,
 * so we centralize the type assertions here instead of scattering
 * `(this as any)` casts across every component.
 */

// biome-ignore lint/suspicious/noExplicitAny: RPG-JS socket event payload
type SocketCallback = (...args: any[]) => void;

interface RpgSocket {
  on(event: string, cb: SocketCallback): void;
  emit(event: string, data: unknown): void;
}

export interface RpgSkillObject {
  id?: string;
  name?: string;
  description?: string;
  spCost?: number;
}

export interface RpgItemObject {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  consumable?: boolean;
  hpValue?: number;
  spValue?: number;
}

export interface RpgInventoryEntry {
  nb: number;
  item: RpgItemObject;
}

export interface RpgPlayerObject {
  hp?: number;
  sp?: number;
  gold?: number;
  level?: number;
  name?: string;
  param?: Record<string, number>;
  variables?: Record<string, unknown>;
  expForNextlevel?: number;
  exp?: number;
  skills?: RpgSkillObject[];
  items?: RpgInventoryEntry[];
  [key: string]: unknown;
}

interface Subscription {
  unsubscribe(): void;
}

interface RpgVmInjects {
  rpgGuiInteraction?: (guiId: string, name: string, data: unknown) => void;
  rpgGuiClose?: (name: string, data?: unknown) => void;
  rpgSocket?: () => RpgSocket;
  rpgCurrentPlayer?: {
    subscribe(cb: (state: { object: RpgPlayerObject }) => void): Subscription;
  };
}

/** Get typed RPG-JS inject helpers from a Vue component instance */
export function rpg(vm: unknown) {
  const self = vm as RpgVmInjects;
  return {
    /** Send a named interaction event to the server for a specific GUI */
    interact(guiId: string, name: string, data: unknown) {
      self.rpgGuiInteraction?.(guiId, name, data);
    },
    /** Close a GUI and optionally send data back to the server */
    close(guiId: string, data?: unknown) {
      self.rpgGuiClose?.(guiId, data);
    },
    /** Get the raw socket for listening to server events */
    socket(): RpgSocket {
      if (!self.rpgSocket) throw new Error('rpgSocket inject not available');
      return self.rpgSocket();
    },
    /** Subscribe to the current player's reactive state. Returns unsubscribe handle. */
    subscribePlayer(cb: (player: RpgPlayerObject) => void): Subscription | undefined {
      return self.rpgCurrentPlayer?.subscribe(({ object }) => cb(object));
    },
  };
}
