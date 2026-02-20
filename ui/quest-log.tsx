/**
 * Mnemonic Realms — Quest Log ("Callum's Journal")
 *
 * React Native overlay component (NOT Skia) for viewing quest progress.
 * Styled as a parchment journal with warm amber tones.
 *
 * Features:
 *  - Two tabs: Active Quests / Completed Quests
 *  - Active quests highlight the current objective
 *  - Completed quests show checkmarks
 *  - Parchment background with warm gold trim
 */

import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';
import type { QuestState } from '../engine/save/types.js';
import type { QuestDdl } from '../gen/schemas/ddl-quests.js';
import { useGameTheme } from './theme';

// ── Types ───────────────────────────────────────────────────────────────────

type TabId = 'active' | 'completed';

export interface QuestLogProps {
  /** Quest tracker state keyed by questId. */
  quests: Record<string, QuestState>;
  /** Quest DDL metadata keyed by questId. */
  questData: Map<string, QuestDdl>;
  /** Called when player closes the quest log. */
  onClose: () => void;
  /** Controls visibility. */
  visible: boolean;
}

// ── Sub-components ──────────────────────────────────────────────────────────

const AnimatedView = Animated.createAnimatedComponent(View);

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, radii, spacing, typography } = useGameTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        {
          backgroundColor: active ? colors.primary[700] : colors.background.dark,
          borderColor: colors.primary[600],
          borderRadius: radii.md,
          paddingVertical: spacing[1],
          paddingHorizontal: spacing[3],
        },
      ]}
    >
      <Text
        style={{
          color: active ? colors.text.inverse : colors.text.secondary,
          fontSize: typography.fontSizes.sm,
          fontWeight: '700',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function QuestEntry({
  quest,
  ddl,
  isCompleted,
}: {
  quest: QuestState;
  ddl: QuestDdl | undefined;
  isCompleted: boolean;
}) {
  const { colors, spacing, typography, radii } = useGameTheme();
  const questName = ddl?.name ?? quest.questId;
  const category = ddl?.category ?? 'side';
  const categoryLabel =
    category === 'main' ? '★ Main' : category === 'god-recall' ? '✦ God Recall' : '○ Side';

  return (
    <AnimatedView
      entering={SlideInRight.duration(200)}
      style={[
        styles.questEntry,
        {
          backgroundColor: colors.background.dark,
          borderColor: isCompleted ? colors.accent.success : colors.primary[600],
          borderRadius: radii.md,
          padding: spacing[3],
          marginBottom: spacing[2],
        },
      ]}
    >
      <View style={styles.questHeader}>
        <Text
          style={[
            styles.questName,
            {
              color: isCompleted ? colors.accent.success : colors.primary[300],
              fontSize: typography.fontSizes.md,
              textDecorationLine: isCompleted ? 'line-through' : 'none',
            },
          ]}
        >
          {isCompleted ? '✓ ' : ''}
          {questName}
        </Text>
        <Text style={{ color: colors.text.muted, fontSize: typography.fontSizes.xs }}>
          {categoryLabel}
        </Text>
      </View>

      {quest.objectives.map((obj) => {
        const desc = ddl?.objectives[obj.index]?.description ?? `Objective ${obj.index + 1}`;
        const isCurrent = !isCompleted && !obj.completed;
        const isDone = obj.completed || isCompleted;
        return (
          <View key={obj.index} style={[styles.objectiveRow, { marginTop: spacing[1] }]}>
            <Text
              style={{
                color: isDone
                  ? colors.text.muted
                  : isCurrent
                    ? colors.primary[400]
                    : colors.text.secondary,
                fontSize: typography.fontSizes.sm,
              }}
            >
              {isDone ? '  ✓ ' : isCurrent ? '  ► ' : '  ○ '}
              {desc}
            </Text>
          </View>
        );
      })}
    </AnimatedView>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function QuestLog({ quests, questData, onClose, visible }: QuestLogProps) {
  const { colors, radii, spacing, typography, shadows } = useGameTheme();
  const [activeTab, setActiveTab] = useState<TabId>('active');
  const handleTab = useCallback((tab: TabId) => setActiveTab(tab), []);

  const activeQuests = Object.values(quests).filter((q) => q.status === 'active');
  const completedQuests = Object.values(quests).filter((q) => q.status === 'completed');
  const displayed = activeTab === 'active' ? activeQuests : completedQuests;

  if (!visible) return null;

  return (
    <AnimatedView
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={[styles.overlay, { backgroundColor: colors.background.overlay }]}
    >
      <View
        style={[
          styles.journal,
          {
            backgroundColor: colors.background.surface,
            borderColor: colors.primary[700],
            borderRadius: radii.lg,
            padding: spacing[4],
            ...shadows.lg,
          },
        ]}
      >
        {/* Title bar */}
        <View style={[styles.titleRow, { marginBottom: spacing[3] }]}>
          <Text
            style={{
              color: colors.primary[300],
              fontSize: typography.fontSizes.xl,
              fontWeight: '700',
            }}
          >
            Callum's Journal
          </Text>
          <Pressable onPress={onClose} style={[styles.closeButton, { borderRadius: radii.sm }]}>
            <Text style={{ color: colors.text.muted, fontSize: typography.fontSizes.lg }}>✕</Text>
          </Pressable>
        </View>

        {/* Tab bar */}
        <View style={[styles.tabRow, { marginBottom: spacing[3], gap: spacing[2] }]}>
          <TabButton
            label={`Active (${activeQuests.length})`}
            active={activeTab === 'active'}
            onPress={() => handleTab('active')}
          />
          <TabButton
            label={`Completed (${completedQuests.length})`}
            active={activeTab === 'completed'}
            onPress={() => handleTab('completed')}
          />
        </View>

        {/* Quest list */}
        <ScrollView style={styles.questList} showsVerticalScrollIndicator={false}>
          {displayed.length === 0 ? (
            <Text
              style={{
                color: colors.text.muted,
                fontSize: typography.fontSizes.md,
                textAlign: 'center',
                marginTop: spacing[4],
              }}
            >
              {activeTab === 'active' ? 'No active quests' : 'No completed quests'}
            </Text>
          ) : (
            displayed.map((quest) => (
              <QuestEntry
                key={quest.questId}
                quest={quest}
                ddl={questData.get(quest.questId)}
                isCompleted={quest.status === 'completed'}
              />
            ))
          )}
        </ScrollView>
      </View>
    </AnimatedView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  journal: {
    width: '90%',
    maxWidth: 480,
    maxHeight: '80%',
    borderWidth: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 4,
  },
  tabRow: {
    flexDirection: 'row',
  },
  tabButton: {
    borderWidth: 1,
  },
  questList: {
    flex: 1,
  },
  questEntry: {
    borderWidth: 1,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questName: {
    fontWeight: '700',
    flex: 1,
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
