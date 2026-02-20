/**
 * Mnemonic Realms — HUD Overlay
 *
 * Main HUD container positioned absolutely above the Skia game canvas.
 * Composes zone placard, HP bar, and vibrancy meter.
 * React Native component (NOT Skia) — uses pointerEvents="box-none"
 * so touch events pass through to the canvas below.
 *
 * TSX contains ONLY rendering + hooks. All logic lives in sub-components.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { HpBar } from './hud/hp-bar';
import { VibrancyMeter } from './hud/vibrancy-meter';
import type { VibrancyState } from './hud/vibrancy-utils';
import { ZonePlacard } from './hud/zone-placard';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HudProps {
  /** Current zone name — shown on area transitions. */
  zoneName?: string;
  /** Current HP. */
  hp: number;
  /** Maximum HP. */
  maxHp: number;
  /** Vibrancy level 0–100. */
  vibrancyLevel: number;
  /** Current area vibrancy state. */
  vibrancyState: VibrancyState;
  /** Whether to show the zone placard. */
  showZonePlacard?: boolean;
  /** Called when the zone placard finishes its animation. */
  onPlacardHidden?: () => void;
  /** Whether the HUD is in "key moment" mode (full opacity). */
  keyMoment?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default HUD opacity during exploration. */
const IDLE_OPACITY = 0.8;
/** HUD opacity during key moments. */
const KEY_MOMENT_OPACITY = 1.0;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Hud({
  zoneName,
  hp,
  maxHp,
  vibrancyLevel,
  vibrancyState,
  showZonePlacard = false,
  onPlacardHidden,
  keyMoment = false,
}: HudProps) {
  // Fade slightly during exploration, brighten during key moments
  const hudOpacity = useSharedValue(keyMoment ? KEY_MOMENT_OPACITY : IDLE_OPACITY);

  useEffect(() => {
    hudOpacity.value = withTiming(keyMoment ? KEY_MOMENT_OPACITY : IDLE_OPACITY, { duration: 400 });
  }, [keyMoment, hudOpacity]);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: hudOpacity.value,
  }));

  return (
    <Animated.View style={[styles.overlay, opacityStyle]} pointerEvents="box-none">
      {/* Top-left: HP bar */}
      <View style={styles.topLeft} pointerEvents="none">
        <HpBar current={hp} max={maxHp} />
      </View>

      {/* Zone placard — slides in from left */}
      {zoneName ? (
        <ZonePlacard zoneName={zoneName} visible={showZonePlacard} onHidden={onPlacardHidden} />
      ) : null}

      {/* Bottom-right: Vibrancy meter */}
      <View style={styles.bottomRight} pointerEvents="none">
        <VibrancyMeter level={vibrancyLevel} state={vibrancyState} />
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  topLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    maxWidth: 160,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
});
