/**
 * Mnemonic Realms — Zone Placard
 *
 * Shows zone name when entering a new area.
 * Drifts in from left, holds, then dissolves out.
 * React Native component (NOT Skia) for HUD overlay.
 *
 * Timing constants are exported for unit testing.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useGameTheme } from '../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ZonePlacardProps {
  /** Name of the zone to display. */
  zoneName: string;
  /** Whether the placard should be visible. */
  visible: boolean;
  /** Optional callback when the dissolve-out animation completes. */
  onHidden?: () => void;
}

// Re-export timing constants from utility module (testable without React)
export { DISSOLVE_OUT_MS, DRIFT_IN_MS, HOLD_MS, TOTAL_PLACARD_MS } from './placard-timing';

import { DISSOLVE_OUT_MS, DRIFT_IN_MS, HOLD_MS } from './placard-timing';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ZonePlacard({ zoneName, visible, onHidden }: ZonePlacardProps) {
  const { colors, radii, spacing, typography, shadows } = useGameTheme();

  const translateX = useSharedValue(-200);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Drift in
      translateX.value = withTiming(0, { duration: DRIFT_IN_MS });
      opacity.value = withSequence(
        // Fade in
        withTiming(1, { duration: DRIFT_IN_MS }),
        // Hold
        withDelay(
          HOLD_MS,
          // Dissolve out
          withTiming(0, { duration: DISSOLVE_OUT_MS }, (finished) => {
            if (finished && onHidden) {
              runOnJS(onHidden)();
            }
          }),
        ),
      );
    } else {
      translateX.value = -200;
      opacity.value = 0;
    }
  }, [visible, translateX, opacity, onHidden]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  if (!visible && opacity.value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animStyle,
        shadows.md,
        {
          backgroundColor: colors.background.overlay,
          borderRadius: radii.md,
          borderColor: colors.primary[600],
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[4],
        },
      ]}
    >
      <View style={styles.accentBar} />
      <Animated.Text
        style={[
          styles.zoneName,
          {
            color: colors.text.primary,
            fontSize: typography.fontSizes.lg,
          },
        ]}
      >
        {zoneName}
      </Animated.Text>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 48,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  accentBar: {
    width: 3,
    height: 20,
    backgroundColor: '#FFC107',
    marginRight: 8,
    borderRadius: 2,
  },
  zoneName: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
