/**
 * Mnemonic Realms — Vibrancy Meter
 *
 * Subtle area-state indicator in the bottom-right corner.
 * Visual changes based on vibrancy state: dim/glowing/bright.
 * React Native component (NOT Skia) for HUD overlay.
 *
 * State mapping helper is exported for unit testing.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useGameTheme } from '../theme';

// Re-export types and helpers from utility module (testable without React)
export type { VibrancyState, VibrancyVisual } from './vibrancy-utils';
export { vibrancyStateVisual } from './vibrancy-utils';

import type { VibrancyState } from './vibrancy-utils';
import { vibrancyStateVisual } from './vibrancy-utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VibrancyMeterProps {
  /** Vibrancy level 0–100. */
  level: number;
  /** Current area vibrancy state. */
  state: VibrancyState;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VibrancyMeter({ level, state }: VibrancyMeterProps) {
  const { colors, radii, spacing, typography } = useGameTheme();
  const visual = vibrancyStateVisual(state);

  // Pulse animation for partial state
  const pulseOpacity = useSharedValue(visual.opacity);

  useEffect(() => {
    if (visual.pulses) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(visual.opacity * 0.5, { duration: 1200 }),
          withTiming(visual.opacity, { duration: 1200 }),
        ),
        -1,
        false,
      );
    } else {
      pulseOpacity.value = withTiming(visual.opacity, { duration: 300 });
    }
  }, [visual.pulses, visual.opacity, pulseOpacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const clampedLevel = Math.max(0, Math.min(100, level));

  return (
    <View
      style={[styles.container, { borderRadius: radii.md, padding: spacing[1] }]}
      accessibilityLabel={`${visual.label}: ${clampedLevel}%`}
      accessibilityRole="progressbar"
    >
      {/* Glowing dot indicator */}
      <Animated.View
        style={[
          styles.dot,
          animStyle,
          {
            backgroundColor: visual.color,
            borderColor: state === 'remembered' ? colors.primary[400] : colors.background.light,
            borderRadius: radii.full,
          },
        ]}
      />

      {/* Tiny level text */}
      <Animated.Text
        style={[
          styles.levelText,
          {
            color: colors.text.muted,
            fontSize: typography.fontSizes.xs,
            marginLeft: spacing[1],
          },
        ]}
      >
        {clampedLevel}
      </Animated.Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderWidth: 1,
  },
  levelText: {
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
});
