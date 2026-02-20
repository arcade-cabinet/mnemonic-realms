import { inject, RpgClientEngine } from '@rpgjs/client';
import { Graphics } from 'pixi.js';

// E-UI-01: Dialogue Typewriter Effect
export function typewriterText(
  element: HTMLElement,
  text: string,
  speed = 30,
): { skip: () => void; promise: Promise<void> } {
  let index = 0;
  let skipped = false;
  element.textContent = '';

  const promise = new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (skipped) {
        element.textContent = text;
        clearInterval(interval);
        resolve();
        return;
      }
      if (index < text.length) {
        element.textContent += text[index];
        index++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });

  return {
    skip: () => {
      skipped = true;
    },
    promise,
  };
}

// E-UI-02: Combat Vignette Overlay
export function applyVignette(container: HTMLElement) {
  container.style.position = 'relative';
  const vignette = document.createElement('div');
  vignette.style.cssText = `
    position: absolute; inset: 0; pointer-events: none; z-index: 100;
    background: radial-gradient(ellipse at center, transparent 50%, rgba(20, 15, 10, 0.5) 100%);
  `;
  container.appendChild(vignette);
  return { cleanup: () => vignette.remove() };
}

// E-UI-03: Menu Transitions
export function slideIn(
  element: HTMLElement,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'right',
  duration = 200,
) {
  const offsets: Record<string, string> = {
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
    top: 'translateY(-100%)',
    bottom: 'translateY(100%)',
  };
  element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
  element.style.transform = offsets[direction];
  element.style.opacity = '0';
  requestAnimationFrame(() => {
    element.style.transform = 'translate(0, 0)';
    element.style.opacity = '1';
  });
}

export function slideOut(
  element: HTMLElement,
  direction: 'left' | 'right' = 'left',
  duration = 200,
): Promise<void> {
  const offsets: Record<string, string> = {
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
  };
  element.style.transition = `transform ${duration}ms ease-in, opacity ${duration}ms ease-in`;
  element.style.transform = offsets[direction];
  element.style.opacity = '0';
  return new Promise((r) => setTimeout(r, duration));
}

export function crossFade(outEl: HTMLElement, inEl: HTMLElement, duration = 150) {
  outEl.style.transition = `opacity ${duration}ms ease`;
  inEl.style.transition = `opacity ${duration}ms ease`;
  outEl.style.opacity = '0';
  inEl.style.opacity = '0';
  setTimeout(() => {
    inEl.style.opacity = '1';
  }, duration / 2);
}

export function toastNotification(
  message: string,
  color = '#daa520',
  duration = 3000,
): { cleanup: () => void } {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; top: 20px; right: -400px; padding: 12px 20px;
    background: rgba(20, 15, 10, 0.9); color: ${color}; border: 1px solid ${color};
    font-family: serif; font-size: 14px; z-index: 10000; border-radius: 4px;
    transition: right 0.4s ease-out, opacity 0.3s ease;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.right = '20px';
  });
  const timeout = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
  return {
    cleanup: () => {
      clearTimeout(timeout);
      toast.remove();
    },
  };
}

// E-UI-04: Vibrancy Tier Transition HUD Flash
export function vibrancyTierNotification(zoneName: string, tier: string) {
  const colors: Record<string, string> = { muted: '#8899aa', normal: '#ccbb88', vivid: '#daa520' };
  const color = colors[tier] ?? '#daa520';
  toastNotification(
    `${zoneName} has reached ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`,
    color,
    2500,
  );
}

// Canvas-based vignette for PixiJS (alternative to CSS)
export function pixiVignette() {
  const client = inject(RpgClientEngine);
  const gfx = new Graphics();
  const w = 480,
    h = 320;
  // Draw concentric rects with increasing alpha
  for (let i = 0; i < 15; i++) {
    const inset = i * 8;
    const alpha = (i / 15) * 0.4;
    gfx.beginFill(0x140f0a, alpha);
    gfx.drawRect(inset, inset, w - inset * 2, h - inset * 2);
    gfx.endFill();
  }
  gfx.zIndex = 9500;
  client.renderer.stage.addChild(gfx);
  return {
    cleanup: () => {
      gfx.removeFromParent();
      gfx.destroy();
    },
  };
}
