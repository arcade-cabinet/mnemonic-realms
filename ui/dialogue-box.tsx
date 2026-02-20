/**
 * Mnemonic Realms — Dialogue Box
 *
 * React Native overlay component (NOT Skia) for NPC/story dialogue.
 * Sits above the Skia game canvas via absolute positioning.
 *
 * Features:
 *  - Character portrait on left
 *  - Speaker name in accent color
 *  - Typewriter text body
 *  - Choice options slide in when text completes
 *  - Pulsing advance indicator (▼) when text is done and no choices
 *  - Frosted glass background using theme semi-transparent colors
 */

import { useCallback, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeOut,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTypewriter } from './hooks/use-typewriter';
import { useGameTheme } from './theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DialogueChoice {
  text: string;
  onSelect: () => void;
}

export interface DialogueBoxProps {
  /** Speaker's display name. */
  speaker: string;
  /** Optional portrait image URI. */
  portrait?: string;
  /** Full dialogue text to reveal via typewriter. */
  text: string;
  /** Optional choices shown after text completes. */
  choices?: DialogueChoice[];
  /** Called when player taps to advance (no choices). */
  onAdvance?: () => void;
  /** Controls visibility of the dialogue box. */
  visible: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Pulsing ▼ indicator shown when text is complete and no choices. */
function AdvanceIndicator() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.3, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      false,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.Text style={[styles.advanceIndicator, animStyle]}>▼</Animated.Text>;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DialogueBox({
  speaker,
  portrait,
  text,
  choices,
  onAdvance,
  visible,
}: DialogueBoxProps) {
  const { colors, radii, spacing, typography } = useGameTheme();
  const { displayedText, isComplete, complete } = useTypewriter(text);

  const handlePress = useCallback(() => {
    if (!isComplete) {
      complete();
    } else if (!choices?.length && onAdvance) {
      onAdvance();
    }
  }, [isComplete, complete, choices, onAdvance]);

  if (!visible) return null;

  const hasChoices = choices && choices.length > 0;

  return (
    <AnimatedPressable
      entering={SlideInDown.duration(300)}
      exiting={FadeOut.duration(200)}
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: colors.background.overlay,
          borderRadius: radii.lg,
          borderColor: colors.primary[700],
          padding: spacing[3],
        },
      ]}
    >
      <View style={styles.topRow}>
        {/* Portrait */}
        {portrait ? (
          <Image
            source={{ uri: portrait }}
            style={[
              styles.portrait,
              {
                borderRadius: radii.md,
                borderColor: colors.primary[600],
              },
            ]}
          />
        ) : null}

        {/* Text column */}
        <View style={styles.textColumn}>
          <Text
            style={[
              styles.speakerName,
              {
                color: colors.primary[400],
                fontSize: typography.fontSizes.md,
              },
            ]}
          >
            {speaker}
          </Text>

          <Text
            style={[
              styles.bodyText,
              {
                color: colors.text.primary,
                fontSize: typography.fontSizes.md,
              },
            ]}
          >
            {displayedText}
          </Text>
        </View>
      </View>

      {/* Choices — slide in after text completes */}
      {isComplete && hasChoices ? (
        <View style={[styles.choicesRow, { marginTop: spacing[2] }]}>
          {choices.map((choice, idx) => (
            <Animated.View key={choice.text} entering={SlideInDown.delay(idx * 80).duration(250)}>
              <Pressable
                onPress={choice.onSelect}
                style={[
                  styles.choiceButton,
                  {
                    backgroundColor: colors.background.dark,
                    borderColor: colors.primary[600],
                    borderRadius: radii.md,
                    paddingVertical: spacing[1],
                    paddingHorizontal: spacing[3],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.choiceText,
                    {
                      color: colors.text.primary,
                      fontSize: typography.fontSizes.sm,
                    },
                  ]}
                >
                  {choice.text}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      ) : null}

      {/* Advance indicator — only when text done and no choices */}
      {isComplete && !hasChoices ? (
        <View style={styles.advanceRow}>
          <AdvanceIndicator />
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderWidth: 1,
    zIndex: 100,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  portrait: {
    width: 56,
    height: 56,
    borderWidth: 2,
    marginRight: 12,
  },
  textColumn: {
    flex: 1,
  },
  speakerName: {
    fontWeight: '700',
    marginBottom: 4,
  },
  bodyText: {
    lineHeight: 20,
  },
  choicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceButton: {
    borderWidth: 1,
  },
  choiceText: {
    fontWeight: '600',
  },
  advanceRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  advanceIndicator: {
    color: '#FFD54F',
    fontSize: 14,
  },
});
