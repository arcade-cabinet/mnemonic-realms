/**
 * Mnemonic Realms — Combat UI
 *
 * React Native overlay component (NOT Skia) for split-screen encounters.
 * Top half: enemy sprites/names/HP bars.
 * Bottom half: command menu, target selection, message log.
 *
 * All combat logic lives in engine/encounters/ — this is ONLY rendering + hooks.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import type { CombatAction, Combatant, CombatState } from '../engine/encounters/types';
import { useGameTheme } from './theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CommandType = 'attack' | 'broadcast' | 'item' | 'defend' | 'flee';

export interface CombatUiProps {
  combatState: CombatState;
  onAction: (action: CombatAction) => void;
  onFlee: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Single enemy display: name + HP bar */
function EnemyCard({ enemy }: { enemy: Combatant }) {
  const { colors, radii, spacing, typography } = useGameTheme();
  const hpPercent = enemy.maxHp > 0 ? (enemy.hp / enemy.maxHp) * 100 : 0;
  const isDead = enemy.hp <= 0;

  return (
    <Animated.View
      entering={SlideInUp.duration(300)}
      style={[
        styles.enemyCard,
        {
          backgroundColor: colors.background.dark,
          borderRadius: radii.md,
          borderColor: isDead ? colors.text.muted : colors.primary[600],
          padding: spacing[2],
          opacity: isDead ? 0.4 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.enemyName,
          { color: colors.text.primary, fontSize: typography.fontSizes.sm },
        ]}
      >
        {enemy.name}
      </Text>
      {/* HP bar */}
      <View
        style={[
          styles.hpTrack,
          { backgroundColor: colors.background.deep, borderRadius: radii.sm },
        ]}
      >
        <View
          style={[
            styles.hpFill,
            {
              width: `${Math.max(0, hpPercent)}%`,
              backgroundColor: hpPercent < 25 ? colors.accent.danger : colors.accent.health,
              borderRadius: radii.sm,
            },
          ]}
        />
      </View>
      <Text
        style={[styles.hpText, { color: colors.text.secondary, fontSize: typography.fontSizes.xs }]}
      >
        {enemy.hp}/{enemy.maxHp}
      </Text>
    </Animated.View>
  );
}

/** Command button */
function CommandButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors, radii, spacing, typography } = useGameTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.commandButton,
        {
          backgroundColor: disabled ? colors.background.light : colors.background.dark,
          borderColor: disabled ? colors.text.muted : colors.primary[500],
          borderRadius: radii.md,
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[3],
        },
      ]}
    >
      <Text
        style={{
          color: disabled ? colors.text.muted : colors.text.primary,
          fontSize: typography.fontSizes.md,
          fontWeight: '700',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CombatUi({ combatState, onAction, onFlee }: CombatUiProps) {
  const { colors, radii, spacing, typography } = useGameTheme();
  const [selectedCommand, setSelectedCommand] = useState<CommandType | null>(null);
  const messageLogRef = useRef<ScrollView>(null);

  const enemies = useMemo(
    () => combatState.combatants.filter((c) => c.type === 'enemy'),
    [combatState.combatants],
  );

  const currentActor = combatState.turnOrder[combatState.currentTurnIndex];
  const isPlayerTurn = combatState.phase === 'player-turn';
  const isCombatOver =
    combatState.phase === 'victory' ||
    combatState.phase === 'defeat' ||
    combatState.phase === 'fled';

  // Recent messages (last 5)
  const recentMessages = useMemo(() => {
    const allMessages = combatState.turnResults.flatMap((r) => r.messages);
    return allMessages.slice(-5);
  }, [combatState.turnResults]);

  // Auto-scroll message log when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: recentMessages triggers scroll
  useEffect(() => {
    messageLogRef.current?.scrollToEnd({ animated: true });
  }, [recentMessages]);

  // Reset command selection when turn changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: turn/round changes reset selection
  useEffect(() => {
    setSelectedCommand(null);
  }, [combatState.currentTurnIndex, combatState.round]);

  const handleCommand = useCallback(
    (cmd: CommandType) => {
      if (cmd === 'flee') {
        onFlee();
        return;
      }
      if (cmd === 'defend') {
        onAction({ type: 'defend', actorId: currentActor });
        setSelectedCommand(null);
        return;
      }
      // Attack and broadcast need target selection
      setSelectedCommand(cmd);
    },
    [currentActor, onAction, onFlee],
  );

  const handleTargetSelect = useCallback(
    (targetId: string) => {
      if (!selectedCommand || !currentActor) return;
      onAction({
        type: selectedCommand === 'broadcast' ? 'broadcast' : 'attack',
        actorId: currentActor,
        targetId,
      });
      setSelectedCommand(null);
    },
    [selectedCommand, currentActor, onAction],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.surface }]}>
      {/* ── Top Half: Enemy Display ── */}
      <View style={[styles.enemySection, { borderBottomColor: colors.primary[700] }]}>
        <View style={styles.enemyRow}>
          {enemies.map((enemy) => (
            <Pressable
              key={enemy.id}
              onPress={() => selectedCommand && enemy.hp > 0 && handleTargetSelect(enemy.id)}
              disabled={!selectedCommand || enemy.hp <= 0}
            >
              <EnemyCard enemy={enemy} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Bottom Half: Commands + Messages ── */}
      <View style={styles.bottomSection}>
        {/* Message Log */}
        <ScrollView
          ref={messageLogRef}
          style={[
            styles.messageLog,
            {
              backgroundColor: colors.background.overlay,
              borderRadius: radii.sm,
              marginBottom: spacing[2],
            },
          ]}
        >
          {recentMessages.map((msg, i) => (
            <Animated.Text
              key={`${combatState.round}-${i}`}
              entering={FadeIn.duration(200)}
              style={[
                styles.messageText,
                { color: colors.text.secondary, fontSize: typography.fontSizes.sm },
              ]}
            >
              {msg}
            </Animated.Text>
          ))}
        </ScrollView>

        {/* Target Selection Prompt */}
        {selectedCommand && (
          <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)}>
            <Text
              style={[
                styles.targetPrompt,
                { color: colors.primary[300], fontSize: typography.fontSizes.md },
              ]}
            >
              Select a target...
            </Text>
          </Animated.View>
        )}

        {/* Combat End Banner */}
        {isCombatOver && (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={[
              styles.endBanner,
              { backgroundColor: colors.background.overlay, borderRadius: radii.lg },
            ]}
          >
            <Text
              style={{
                color:
                  combatState.phase === 'victory' ? colors.accent.success : colors.accent.danger,
                fontSize: typography.fontSizes['2xl'],
                fontWeight: '800',
                textAlign: 'center',
              }}
            >
              {combatState.phase === 'victory'
                ? 'Victory!'
                : combatState.phase === 'defeat'
                  ? 'Defeat...'
                  : 'Escaped!'}
            </Text>
          </Animated.View>
        )}

        {/* Command Buttons */}
        {isPlayerTurn && !selectedCommand && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.commandRow}>
            <CommandButton label="Attack" onPress={() => handleCommand('attack')} />
            <CommandButton label="Broadcast" onPress={() => handleCommand('broadcast')} />
            <CommandButton label="Item" onPress={() => handleCommand('item')} disabled />
            <CommandButton label="Defend" onPress={() => handleCommand('defend')} />
            <CommandButton label="Flee" onPress={() => handleCommand('flee')} />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  enemySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingVertical: 8,
  },
  enemyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  enemyCard: {
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
  },
  enemyName: {
    fontWeight: '700',
    marginBottom: 4,
  },
  hpTrack: {
    width: 60,
    height: 6,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
  },
  hpText: {
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  bottomSection: {
    flex: 1,
    padding: 8,
    justifyContent: 'flex-end',
  },
  messageLog: {
    maxHeight: 80,
    padding: 8,
  },
  messageText: {
    lineHeight: 18,
  },
  targetPrompt: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  endBanner: {
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  commandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  commandButton: {
    minWidth: 70,
    borderWidth: 1,
  },
});
