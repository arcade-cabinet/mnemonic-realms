/**
 * Mnemonic Realms — Vibrancy Meter Pure Utilities
 *
 * State-to-visual mapping for the vibrancy meter.
 * No React/Reanimated imports — safe for unit testing.
 */

export type VibrancyState = 'forgotten' | 'partial' | 'remembered';

export interface VibrancyVisual {
  /** Indicator color. */
  color: string;
  /** Base opacity (0–1). */
  opacity: number;
  /** Whether the indicator should pulse/glow. */
  pulses: boolean;
  /** Human-readable label for accessibility. */
  label: string;
}

/** Map a vibrancy state to its visual configuration. */
export function vibrancyStateVisual(state: VibrancyState): VibrancyVisual {
  switch (state) {
    case 'forgotten':
      return {
        color: '#0A0A14',
        opacity: 0.4,
        pulses: false,
        label: 'Forgotten',
      };
    case 'partial':
      return {
        color: '#6A3D7D',
        opacity: 0.7,
        pulses: true,
        label: 'Partial Memory',
      };
    case 'remembered':
      return {
        color: '#FFC107',
        opacity: 1.0,
        pulses: false,
        label: 'Remembered',
      };
  }
}
