/**
 * Mnemonic Realms — HP Bar
 *
 * Red gradient health bar with low-HP flash effect.
 * React Native component (NOT Skia) for HUD overlay.
 *
 * Pure calculation helpers are exported for unit testing.
 */

import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useGameTheme } from '../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HpBarProps {
  /** Current HP. */
  current: number;
  /** Maximum HP. */
  max: number;
}

// Re-export pure helpers from utility module (testable without React)
export { computeHpPercent, isLowHp, LOW_HP_THRESHOLD } from './hp-utils';

import { computeHpPercent, isLowHp } from './hp-utils';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HpBar({ current, max }: HpBarProps) {
  const { colors, radii, spacing, typography } = useGameTheme();
  const percent = computeHpPercent(current, max);
  const low = isLowHp(current, max);

  // Low-HP flash animation
  const flashOpacity = useSharedValue(1);

  useEffect(() => {
    if (low) {
      flashOpacity.value = withRepeat(
        withSequence(withTiming(0.4, { duration: 300 }), withTiming(1, { duration: 300 })),
        -1,
        false,
      );
    } else {
      flashOpacity.value = withTiming(1, { duration: 150 });
    }
  }, [low, flashOpacity]);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <View style={[styles.container, { borderRadius: radii.sm }]}>
      {/* Track */}
      <View
        style={[
          styles.track,
          {
            backgroundColor: colors.background.dark,
            borderRadius: radii.sm,
          },
        ]}
      >
        {/* Fill */}
        <Animated.View
          style={[
            styles.fill,
            flashStyle,
            {
              width: `${percent}%`,
              backgroundColor: low ? colors.accent.danger : colors.accent.health,
              borderRadius: radii.sm,
            },
          ]}
        />
      </View>

      {/* Numeric display */}
      <Text
        style={[
          styles.label,
          {
            color: colors.text.primary,
            fontSize: typography.fontSizes.xs,
            marginLeft: spacing[1],
          },
        ]}
      >
        {current}/{max}
      </Text>
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
    minWidth: 100,
  },
  track: {
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  label: {
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
});
