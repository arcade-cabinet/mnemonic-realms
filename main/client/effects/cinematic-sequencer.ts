import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';

export interface CinematicStep {
  at: number;
  action: () => void | Promise<void>;
}

export interface CinematicOptions {
  steps: CinematicStep[];
  duration: number;
  onTick?: (t: number) => void;
  onComplete?: () => void;
}

let activeCinematic: { cancel: () => void } | null = null;

export function playCinematic(opts: CinematicOptions): Promise<void> {
  activeCinematic?.cancel();

  return new Promise((resolve) => {
    const { steps, duration, onTick, onComplete } = opts;
    const sorted = [...steps].sort((a, b) => a.at - b.at);
    const start = performance.now();
    let fired = 0;
    let cancelled = false;

    const handle = {
      cancel: () => {
        cancelled = true;
        resolve();
      },
    };
    activeCinematic = handle;

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: cinematic tick loop has inherent branching
    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / duration, 1);

      while (fired < sorted.length && sorted[fired].at <= elapsed) {
        sorted[fired].action();
        fired++;
      }

      onTick?.(t);

      if (t < 1) requestAnimationFrame(tick);
      else {
        while (fired < sorted.length) {
          sorted[fired].action();
          fired++;
        }
        onComplete?.();
        if (activeCinematic === handle) activeCinematic = null;
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

export function cancelCinematic() {
  activeCinematic?.cancel();
}

export function tweenValue(
  from: number,
  to: number,
  duration: number,
  update: (v: number) => void,
  ease?: (t: number) => number,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const e = ease ?? ((t: number) => t);
    const tick = () => {
      const t = Math.min((performance.now() - start) / duration, 1);
      update(from + (to - from) * e(t));
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

export function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}
export function easeIn(t: number) {
  return t * t;
}
export function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function screenShake(intensity = 3, duration = 300): Promise<void> {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return Promise.resolve();

  const vp = scene.viewport;
  const ox = vp.x;
  const oy = vp.y;

  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      const t = Math.min((performance.now() - start) / duration, 1);
      const amp = intensity * (1 - t);
      vp.x = ox + (Math.random() - 0.5) * amp * 2;
      vp.y = oy + (Math.random() - 0.5) * amp * 2;
      if (t < 1) requestAnimationFrame(tick);
      else {
        vp.x = ox;
        vp.y = oy;
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

export function cameraPan(toX: number, toY: number, duration: number): Promise<void> {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return Promise.resolve();
  const vp = scene.viewport;
  const sx = vp.x,
    sy = vp.y;
  return tweenValue(
    0,
    1,
    duration,
    (t) => {
      vp.x = sx + (toX - sx) * t;
      vp.y = sy + (toY - sy) * t;
    },
    easeInOut,
  );
}
