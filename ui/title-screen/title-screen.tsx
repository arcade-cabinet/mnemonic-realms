/**
 * Mnemonic Realms — Title Screen
 *
 * React Native component (NOT Skia) for the title screen overlay.
 * Logo animation → menu → class selection → game start.
 *
 * All logic lives in title-logic.ts. This file is ONLY rendering + hooks.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useGameTheme } from '../theme';
import {
  CLASS_DATA,
  confirmClassSelection,
  createTitleState,
  getMenuOptions,
  selectClass,
  selectMenuOption,
} from './title-logic';
import type { MenuOption, TitleState } from './types';

// ── Props ────────────────────────────────────────────────────────────────────

export interface TitleScreenProps {
  /** Called when the player confirms a class and starts a new journey. */
  onStart: (className: string) => void;
  /** Called when the player chooses to continue a saved game. */
  onContinue: () => void;
  /** Whether a save file exists (enables "Continue" option). */
  hasSaveData: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const TITLE_TEXT = 'MNEMONIC REALMS';
const LETTER_DELAY_MS = 80;
const LOGO_HOLD_MS = 600;
const FADE_DURATION_MS = 400;
const STARTING_DELAY_MS = 800;

// ── Menu Labels ──────────────────────────────────────────────────────────────

const MENU_LABELS: Record<MenuOption, string> = {
  'new-journey': 'New Journey',
  continue: 'Continue',
  settings: 'Settings',
};

// ── Component ────────────────────────────────────────────────────────────────

export function TitleScreen({ onStart, onContinue, hasSaveData }: TitleScreenProps) {
  const theme = useGameTheme();
  const [state, setState] = useState<TitleState>(() => createTitleState(hasSaveData));
  const menuOptions = useMemo(() => getMenuOptions(hasSaveData), [hasSaveData]);

  // Logo letter-by-letter reveal
  const [visibleLetters, setVisibleLetters] = useState(0);
  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Phase opacity animations
  const logoOpacity = useSharedValue(1);
  const menuOpacity = useSharedValue(0);
  const classOpacity = useSharedValue(0);
  const startingOpacity = useSharedValue(0);

  // ── Logo Animation ───────────────────────────────────────────────────────

  useEffect(() => {
    if (state.phase !== 'logo') return;

    if (visibleLetters < TITLE_TEXT.length) {
      logoTimerRef.current = setTimeout(() => {
        setVisibleLetters((prev) => prev + 1);
      }, LETTER_DELAY_MS);
    } else {
      // All letters visible — hold, then transition to menu
      logoTimerRef.current = setTimeout(() => {
        logoOpacity.value = withTiming(0, { duration: FADE_DURATION_MS });
        menuOpacity.value = withDelay(
          FADE_DURATION_MS,
          withTiming(1, { duration: FADE_DURATION_MS }),
        );
        setState((prev) => ({ ...prev, phase: 'menu' }));
      }, LOGO_HOLD_MS);
    }

    return () => {
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    };
  }, [state.phase, visibleLetters, logoOpacity, menuOpacity]);

  // ── Phase Transition Effects ─────────────────────────────────────────────

  useEffect(() => {
    if (state.phase === 'class-select') {
      menuOpacity.value = withTiming(0, { duration: FADE_DURATION_MS });
      classOpacity.value = withDelay(
        FADE_DURATION_MS,
        withTiming(1, { duration: FADE_DURATION_MS }),
      );
    }
  }, [state.phase, menuOpacity, classOpacity]);

  useEffect(() => {
    if (state.phase === 'starting') {
      classOpacity.value = withTiming(0, { duration: FADE_DURATION_MS });
      menuOpacity.value = withTiming(0, { duration: FADE_DURATION_MS });
      startingOpacity.value = withDelay(
        FADE_DURATION_MS,
        withTiming(1, { duration: FADE_DURATION_MS }),
      );
    }
  }, [state.phase, classOpacity, menuOpacity, startingOpacity]);

  // ── Starting Phase Callback ──────────────────────────────────────────────

  const startingTriggered = useRef(false);

  useEffect(() => {
    if (state.phase !== 'starting' || startingTriggered.current) return;
    startingTriggered.current = true;

    const result = confirmClassSelection(state);
    const timer = setTimeout(() => {
      if (result) {
        onStart(result.className);
      } else {
        // Continue path — no class selection needed
        onContinue();
      }
    }, STARTING_DELAY_MS);

    return () => clearTimeout(timer);
  }, [state, onStart, onContinue]);

  // ── Keyboard Input ───────────────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKey = (e: KeyboardEvent) => {
      if (state.phase === 'menu') {
        handleMenuKey(e.key);
      } else if (state.phase === 'class-select') {
        handleClassKey(e.key);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handleMenuKey = useCallback(
    (key: string) => {
      if (key === 'ArrowUp') {
        setState((prev) => ({
          ...prev,
          selectedMenu: Math.max(0, prev.selectedMenu - 1),
        }));
      } else if (key === 'ArrowDown') {
        setState((prev) => ({
          ...prev,
          selectedMenu: Math.min(menuOptions.length - 1, prev.selectedMenu + 1),
        }));
      } else if (key === 'Enter' || key === ' ') {
        setState((prev) => {
          const option = menuOptions[prev.selectedMenu];
          if (!option) return prev;
          return selectMenuOption(prev, option);
        });
      }
    },
    [menuOptions],
  );

  const handleClassKey = useCallback(
    (key: string) => {
      if (key === 'ArrowLeft') {
        setState((prev) => selectClass(prev, prev.selectedClass - 1));
      } else if (key === 'ArrowRight') {
        setState((prev) => selectClass(prev, prev.selectedClass + 1));
      } else if (key === 'Enter' || key === ' ') {
        setState((prev) => ({ ...prev, phase: 'starting' }));
      } else if (key === 'Escape' || key === 'Backspace') {
        classOpacity.value = withTiming(0, { duration: FADE_DURATION_MS });
        menuOpacity.value = withDelay(
          FADE_DURATION_MS,
          withTiming(1, { duration: FADE_DURATION_MS }),
        );
        setState((prev) => ({ ...prev, phase: 'menu', selectedMenu: 0 }));
      }
    },
    [classOpacity, menuOpacity],
  );

  // ── Animated Styles ────────────────────────────────────────────────────────

  const logoAnimStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }));
  const menuAnimStyle = useAnimatedStyle(() => ({ opacity: menuOpacity.value }));
  const classAnimStyle = useAnimatedStyle(() => ({ opacity: classOpacity.value }));
  const startAnimStyle = useAnimatedStyle(() => ({ opacity: startingOpacity.value }));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.deep }]}>
      {/* Logo Phase */}
      {(state.phase === 'logo' || state.phase === 'menu') && (
        <Animated.View style={[styles.centered, logoAnimStyle]}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.primary[500],
                fontSize: theme.typography.fontSizes['4xl'],
              },
            ]}
          >
            {TITLE_TEXT.slice(0, visibleLetters)}
            <Text style={{ color: 'transparent' }}>{TITLE_TEXT.slice(visibleLetters)}</Text>
          </Text>
        </Animated.View>
      )}

      {/* Menu Phase */}
      {state.phase === 'menu' && (
        <Animated.View style={[styles.menu, menuAnimStyle]}>
          {menuOptions.map((option, i) => {
            const isSelected = i === state.selectedMenu;
            return (
              <Pressable
                key={option}
                onPress={() => setState((prev) => selectMenuOption(prev, option))}
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary[700]
                      : theme.colors.background.surface,
                    borderRadius: theme.radii.md,
                    paddingVertical: theme.spacing[2],
                    paddingHorizontal: theme.spacing[4],
                    marginVertical: theme.spacing[1],
                  },
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? theme.colors.text.inverse : theme.colors.text.primary,
                    fontSize: theme.typography.fontSizes.lg,
                    textAlign: 'center',
                  }}
                >
                  {MENU_LABELS[option]}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      )}

      {/* Class Select Phase */}
      {state.phase === 'class-select' && (
        <Animated.View style={[styles.classSelect, classAnimStyle]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSizes['2xl'],
                marginBottom: theme.spacing[4],
              },
            ]}
          >
            Choose Your Path
          </Text>
          <View style={styles.classRow}>
            {CLASS_DATA.map((cls, i) => {
              const isSelected = i === state.selectedClass;
              return (
                <Pressable
                  key={cls.id}
                  onPress={() => setState((prev) => selectClass(prev, i))}
                  style={[
                    styles.classCard,
                    {
                      borderColor: isSelected
                        ? theme.colors.primary[500]
                        : theme.colors.background.light,
                      borderWidth: isSelected ? 2 : 1,
                      borderRadius: theme.radii.lg,
                      backgroundColor: theme.colors.background.surface,
                      padding: theme.spacing[3],
                      marginHorizontal: theme.spacing[1],
                    },
                  ]}
                >
                  {/* Color swatch */}
                  <View
                    style={[
                      styles.swatch,
                      {
                        backgroundColor: cls.color,
                        borderRadius: theme.radii.full,
                      },
                    ]}
                  />
                  <Text
                    style={{
                      color: theme.colors.text.primary,
                      fontSize: theme.typography.fontSizes.lg,
                      textAlign: 'center',
                      marginTop: theme.spacing[2],
                    }}
                  >
                    {cls.name}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.text.muted,
                      fontSize: theme.typography.fontSizes.xs,
                      textAlign: 'center',
                      marginTop: theme.spacing[1],
                    }}
                  >
                    {cls.accent}
                  </Text>
                  {isSelected && (
                    <Text
                      style={{
                        color: theme.colors.primary[300],
                        fontSize: theme.typography.fontSizes.sm,
                        fontStyle: 'italic',
                        textAlign: 'center',
                        marginTop: theme.spacing[2],
                      }}
                    >
                      &ldquo;{cls.quote}&rdquo;
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
          {/* Confirm / Back row */}
          <View style={[styles.actionRow, { marginTop: theme.spacing[4] }]}>
            <Pressable
              onPress={() => {
                classOpacity.value = withTiming(0, { duration: FADE_DURATION_MS });
                menuOpacity.value = withDelay(
                  FADE_DURATION_MS,
                  withTiming(1, { duration: FADE_DURATION_MS }),
                );
                setState((prev) => ({ ...prev, phase: 'menu', selectedMenu: 0 }));
              }}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: theme.colors.background.light,
                  borderRadius: theme.radii.md,
                  paddingVertical: theme.spacing[2],
                  paddingHorizontal: theme.spacing[4],
                },
              ]}
            >
              <Text style={{ color: theme.colors.text.primary }}>Back</Text>
            </Pressable>
            <Pressable
              onPress={() => setState((prev) => ({ ...prev, phase: 'starting' }))}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: theme.colors.primary[700],
                  borderRadius: theme.radii.md,
                  paddingVertical: theme.spacing[2],
                  paddingHorizontal: theme.spacing[4],
                  marginLeft: theme.spacing[2],
                },
              ]}
            >
              <Text style={{ color: theme.colors.text.inverse }}>Begin</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Starting Phase */}
      {state.phase === 'starting' && (
        <Animated.View style={[styles.centered, startAnimStyle]}>
          <Text
            style={{
              color: theme.colors.primary[300],
              fontSize: theme.typography.fontSizes.xl,
            }}
          >
            Preparing journey...
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  menu: {
    alignItems: 'center',
    width: '60%',
    maxWidth: 320,
  },
  menuItem: {
    width: '100%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  classSelect: {
    alignItems: 'center',
    width: '90%',
    maxWidth: 800,
  },
  classRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  classCard: {
    width: 160,
    alignItems: 'center',
  },
  swatch: {
    width: 32,
    height: 32,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionBtn: {
    minWidth: 80,
    alignItems: 'center',
  },
});
