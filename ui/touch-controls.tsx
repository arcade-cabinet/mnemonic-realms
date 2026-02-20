/**
 * Mnemonic Realms — Touch Controls
 *
 * React Native overlay component (NOT Skia) for virtual d-pad and action buttons.
 * Sits above the Skia game canvas via absolute positioning.
 *
 * Layout:
 *  - D-pad: bottom-left corner (4 directional buttons in cross pattern)
 *  - Action button: bottom-right (large circle — interact/confirm)
 *  - Cancel button: above action (smaller circle — back/menu)
 *
 * Uses built-in Pressable (no react-native-gesture-handler dependency).
 */

import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DirectionIntent } from '../engine/input.js';
import { useGameTheme } from './theme';
import { DIR_INTENT, type DPadDir, ZERO_INTENT } from './touch-intent';

// Re-export pure helpers so consumers can import from either module.
export { type DPadDir, dpadToIntent } from './touch-intent';

// ── Types ───────────────────────────────────────────────────────────────────

export interface TouchControlsProps {
  /** Called when d-pad direction changes (including release → {0,0}). */
  onDirectionChange: (intent: DirectionIntent) => void;
  /** Called on action button tap (interact/confirm). */
  onAction: () => void;
  /** Called on cancel button tap (back/menu). */
  onCancel: () => void;
  /** Whether the touch controls are visible. */
  visible: boolean;
}

// ── Constants ───────────────────────────────────────────────────────────────

const DPAD_SIZE = 48;
const DPAD_GAP = 2;
const ACTION_SIZE = 56;
const CANCEL_SIZE = 40;
const OPACITY_DEFAULT = 0.6;
const OPACITY_PRESSED = 0.9;

// ── Sub-components ──────────────────────────────────────────────────────────

function DPadButton({
  dir,
  label,
  onPressIn,
  onPressOut,
  color,
}: {
  dir: DPadDir;
  label: string;
  onPressIn: (dir: DPadDir) => void;
  onPressOut: () => void;
  color: string;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => {
        setPressed(true);
        onPressIn(dir);
      }}
      onPressOut={() => {
        setPressed(false);
        onPressOut();
      }}
      style={[
        styles.dpadButton,
        { backgroundColor: color, opacity: pressed ? OPACITY_PRESSED : OPACITY_DEFAULT },
      ]}
    >
      <Text style={styles.dpadLabel}>{label}</Text>
    </Pressable>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function TouchControls({
  onDirectionChange,
  onAction,
  onCancel,
  visible,
}: TouchControlsProps) {
  const { colors } = useGameTheme();
  const activeDirRef = useRef<DPadDir | null>(null);
  const [actionPressed, setActionPressed] = useState(false);
  const [cancelPressed, setCancelPressed] = useState(false);

  const btnColor = colors.primary[700];

  const handleDirPress = useCallback(
    (dir: DPadDir) => {
      activeDirRef.current = dir;
      onDirectionChange(DIR_INTENT[dir]);
    },
    [onDirectionChange],
  );

  const handleDirRelease = useCallback(() => {
    activeDirRef.current = null;
    onDirectionChange(ZERO_INTENT);
  }, [onDirectionChange]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* D-pad — bottom left */}
      <View style={styles.dpadContainer}>
        <View style={styles.dpadRow}>
          <View style={styles.dpadSpacer} />
          <DPadButton
            dir="up"
            label="▲"
            onPressIn={handleDirPress}
            onPressOut={handleDirRelease}
            color={btnColor}
          />
          <View style={styles.dpadSpacer} />
        </View>
        <View style={styles.dpadRow}>
          <DPadButton
            dir="left"
            label="◀"
            onPressIn={handleDirPress}
            onPressOut={handleDirRelease}
            color={btnColor}
          />
          <View style={styles.dpadCenter} />
          <DPadButton
            dir="right"
            label="▶"
            onPressIn={handleDirPress}
            onPressOut={handleDirRelease}
            color={btnColor}
          />
        </View>
        <View style={styles.dpadRow}>
          <View style={styles.dpadSpacer} />
          <DPadButton
            dir="down"
            label="▼"
            onPressIn={handleDirPress}
            onPressOut={handleDirRelease}
            color={btnColor}
          />
          <View style={styles.dpadSpacer} />
        </View>
      </View>

      {/* Action + Cancel — bottom right */}
      <View style={styles.actionContainer}>
        <Pressable
          onPressIn={() => setCancelPressed(true)}
          onPressOut={() => {
            setCancelPressed(false);
            onCancel();
          }}
          style={[
            styles.cancelButton,
            {
              backgroundColor: btnColor,
              opacity: cancelPressed ? OPACITY_PRESSED : OPACITY_DEFAULT,
            },
          ]}
        >
          <Text style={styles.actionLabel}>✕</Text>
        </Pressable>
        <Pressable
          onPressIn={() => setActionPressed(true)}
          onPressOut={() => {
            setActionPressed(false);
            onAction();
          }}
          style={[
            styles.actionButton,
            {
              backgroundColor: btnColor,
              opacity: actionPressed ? OPACITY_PRESSED : OPACITY_DEFAULT,
            },
          ]}
        >
          <Text style={styles.actionLabel}>A</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dpadContainer: {
    width: DPAD_SIZE * 3 + DPAD_GAP * 2,
    height: DPAD_SIZE * 3 + DPAD_GAP * 2,
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: DPAD_GAP,
    marginBottom: DPAD_GAP,
  },
  dpadButton: {
    width: DPAD_SIZE,
    height: DPAD_SIZE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadLabel: {
    color: '#FFF8E1',
    fontSize: 18,
    fontWeight: '700',
  },
  dpadSpacer: {
    width: DPAD_SIZE,
    height: DPAD_SIZE,
  },
  dpadCenter: {
    width: DPAD_SIZE,
    height: DPAD_SIZE,
  },
  actionContainer: {
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    width: CANCEL_SIZE,
    height: CANCEL_SIZE,
    borderRadius: CANCEL_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#FFF8E1',
    fontSize: 18,
    fontWeight: '700',
  },
});
