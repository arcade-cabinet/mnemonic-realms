/**
 * Mnemonic Realms — Inventory Screen
 *
 * React Native overlay component (NOT Skia) for viewing inventory and equipment.
 * Parchment-style background using theme tokens. Grid of items with equipment panel.
 *
 * All business logic lives in engine/inventory/. This file is rendering + hooks ONLY.
 */

import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';
import type { EquipmentSlots, GameItem, InventoryState } from '../engine/inventory/types.js';
import { useGameTheme } from './theme';

// ── Types ───────────────────────────────────────────────────────────────────

export interface InventoryScreenProps {
  /** Current inventory state. */
  inventory: InventoryState;
  /** Item registry: id → GameItem lookup. */
  items: Map<string, GameItem>;
  /** Called when player equips an item. */
  onEquip: (itemId: string, slot: keyof EquipmentSlots) => void;
  /** Called when player uses a consumable. */
  onUse: (itemId: string) => void;
  /** Called to close the screen. */
  onClose: () => void;
  /** Controls visibility. */
  visible: boolean;
}

interface InventoryEntry {
  itemId: string;
  count: number;
  item: GameItem | undefined;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getSlotForItem(item: GameItem): keyof EquipmentSlots | null {
  if (item.category === 'weapon') return 'weapon';
  if (item.category === 'armor') return 'armor';
  return null;
}

// ── Component ───────────────────────────────────────────────────────────────

export function InventoryScreen({
  inventory,
  items,
  onEquip,
  onUse,
  onClose,
  visible,
}: InventoryScreenProps) {
  const { colors, radii, spacing, typography } = useGameTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const entries: InventoryEntry[] = [];
  for (const [itemId, count] of inventory.items) {
    entries.push({ itemId, count, item: items.get(itemId) });
  }

  const selectedItem = selectedId ? items.get(selectedId) : undefined;
  const selectedSlot = selectedItem ? getSlotForItem(selectedItem) : null;

  const handleEquip = useCallback(() => {
    if (selectedId && selectedSlot) onEquip(selectedId, selectedSlot);
    setSelectedId(null);
  }, [selectedId, selectedSlot, onEquip]);

  const handleUse = useCallback(() => {
    if (selectedId) onUse(selectedId);
    setSelectedId(null);
  }, [selectedId, onUse]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={[styles.overlay, { backgroundColor: colors.background.overlay }]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background.dark,
            borderColor: colors.primary[700],
            borderRadius: radii.lg,
            padding: spacing[4],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.primary[400], fontSize: typography.fontSizes.xl },
            ]}
          >
            Inventory
          </Text>
          <Text
            style={[styles.gold, { color: colors.accent.gold, fontSize: typography.fontSizes.md }]}
          >
            {inventory.gold} G
          </Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: colors.text.muted, fontSize: typography.fontSizes.lg }}>✕</Text>
          </Pressable>
        </View>

        {/* Equipment Panel */}
        <View
          style={[styles.equipPanel, { borderColor: colors.primary[700], borderRadius: radii.md }]}
        >
          {(['weapon', 'armor', 'accessory'] as const).map((slot) => {
            const equippedId = inventory.equipment[slot];
            const equippedItem = equippedId ? items.get(equippedId) : undefined;
            return (
              <View key={slot} style={[styles.equipSlot, { borderColor: colors.background.light }]}>
                <Text
                  style={[
                    styles.slotLabel,
                    { color: colors.text.muted, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {slot.toUpperCase()}
                </Text>
                <Text
                  style={[
                    styles.slotValue,
                    { color: colors.text.primary, fontSize: typography.fontSizes.sm },
                  ]}
                >
                  {equippedItem?.name ?? '—'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Item Grid */}
        <FlatList
          data={entries}
          keyExtractor={(e) => e.itemId}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          style={styles.grid}
          renderItem={({ item: entry }) => {
            const isSelected = entry.itemId === selectedId;
            return (
              <Pressable
                onPress={() => setSelectedId(entry.itemId)}
                style={[
                  styles.itemCell,
                  {
                    backgroundColor: isSelected
                      ? colors.background.light
                      : colors.background.DEFAULT,
                    borderColor: isSelected ? colors.primary[500] : colors.background.light,
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Text
                  style={{ color: colors.text.primary, fontSize: typography.fontSizes.sm }}
                  numberOfLines={1}
                >
                  {entry.item?.name ?? entry.itemId}
                </Text>
                <Text style={{ color: colors.text.muted, fontSize: typography.fontSizes.xs }}>
                  ×{entry.count}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text style={{ color: colors.text.muted, textAlign: 'center', marginTop: spacing[4] }}>
              No items
            </Text>
          }
        />

        {/* Detail / Action Panel */}
        {selectedItem ? (
          <Animated.View
            entering={SlideInRight.duration(200)}
            style={[
              styles.detailPanel,
              {
                backgroundColor: colors.background.surface,
                borderColor: colors.primary[700],
                borderRadius: radii.md,
                padding: spacing[3],
              },
            ]}
          >
            <Text
              style={{
                color: colors.primary[300],
                fontSize: typography.fontSizes.md,
                fontWeight: '700',
              }}
            >
              {selectedItem.name}
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: typography.fontSizes.sm,
                marginTop: spacing[1],
              }}
            >
              {selectedItem.description}
            </Text>
            <View style={[styles.actionRow, { marginTop: spacing[2] }]}>
              {selectedSlot ? (
                <Pressable
                  onPress={handleEquip}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: colors.primary[700],
                      borderRadius: radii.sm,
                      paddingVertical: spacing[1],
                      paddingHorizontal: spacing[3],
                    },
                  ]}
                >
                  <Text style={{ color: colors.text.primary, fontSize: typography.fontSizes.sm }}>
                    Equip
                  </Text>
                </Pressable>
              ) : null}
              {selectedItem.category === 'consumable' ? (
                <Pressable
                  onPress={handleUse}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: colors.accent.stamina,
                      borderRadius: radii.sm,
                      paddingVertical: spacing[1],
                      paddingHorizontal: spacing[3],
                    },
                  ]}
                >
                  <Text style={{ color: colors.text.inverse, fontSize: typography.fontSizes.sm }}>
                    Use
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  container: {
    width: '90%',
    maxWidth: 480,
    maxHeight: '85%',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontWeight: '700', flex: 1 },
  gold: { fontWeight: '600', marginRight: 12 },
  closeBtn: { padding: 4 },
  equipPanel: {
    flexDirection: 'row',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    gap: 8,
  },
  equipSlot: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    alignItems: 'center',
  },
  slotLabel: { fontWeight: '600', marginBottom: 2 },
  slotValue: { textAlign: 'center' },
  grid: { flex: 1 },
  gridRow: { gap: 8, marginBottom: 8 },
  itemCell: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailPanel: { borderWidth: 1, marginTop: 12 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { alignItems: 'center' },
});
