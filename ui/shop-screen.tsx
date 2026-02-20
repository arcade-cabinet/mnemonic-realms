/**
 * Mnemonic Realms — Shop Screen
 *
 * React Native overlay component (NOT Skia) for buying and selling items.
 * Buy/sell tabs, item list with prices, quantity selector.
 *
 * All business logic lives in engine/inventory/shop.ts. Rendering + hooks ONLY.
 */

import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { GameItem, InventoryState } from '../engine/inventory/types.js';
import { useGameTheme } from './theme';

// ── Types ───────────────────────────────────────────────────────────────────

export interface ShopScreenProps {
  /** Current inventory state. */
  inventory: InventoryState;
  /** Items the shop sells. */
  shopItems: GameItem[];
  /** Called when player buys an item. */
  onBuy: (item: GameItem, quantity: number) => void;
  /** Called when player sells an item. */
  onSell: (itemId: string, quantity: number) => void;
  /** Called to close the shop. */
  onClose: () => void;
  /** Controls visibility. */
  visible: boolean;
}

type TabMode = 'buy' | 'sell';

// ── Component ───────────────────────────────────────────────────────────────

export function ShopScreen({
  inventory,
  shopItems,
  onBuy,
  onSell,
  onClose,
  visible,
}: ShopScreenProps) {
  const { colors, radii, spacing, typography } = useGameTheme();
  const [tab, setTab] = useState<TabMode>('buy');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Build sell list from inventory
  const sellEntries = Array.from(inventory.items.entries()).map(([id, count]) => ({ id, count }));

  const handleBuy = useCallback(() => {
    const item = shopItems.find((i) => i.id === selectedId);
    if (item) {
      onBuy(item, quantity);
      setQuantity(1);
      setSelectedId(null);
    }
  }, [selectedId, quantity, shopItems, onBuy]);

  const handleSell = useCallback(() => {
    if (selectedId) {
      onSell(selectedId, quantity);
      setQuantity(1);
      setSelectedId(null);
    }
  }, [selectedId, quantity, onSell]);

  const adjustQty = useCallback(
    (delta: number) => setQuantity((q) => Math.max(1, q + delta)),
    [],
  );

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
          <Text style={[styles.title, { color: colors.primary[400], fontSize: typography.fontSizes.xl }]}>
            Shop
          </Text>
          <Text style={[styles.gold, { color: colors.accent.gold, fontSize: typography.fontSizes.md }]}>
            {inventory.gold} G
          </Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: colors.text.muted, fontSize: typography.fontSizes.lg }}>✕</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { marginBottom: spacing[3] }]}>
          {(['buy', 'sell'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => { setTab(t); setSelectedId(null); setQuantity(1); }}
              style={[
                styles.tab,
                {
                  backgroundColor: tab === t ? colors.primary[700] : colors.background.DEFAULT,
                  borderRadius: radii.sm,
                  paddingVertical: spacing[1],
                  paddingHorizontal: spacing[4],
                },
              ]}
            >
              <Text style={{ color: tab === t ? colors.text.primary : colors.text.muted }}>
                {t === 'buy' ? 'Buy' : 'Sell'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Item List */}
        {tab === 'buy' ? (
          <FlatList
            data={shopItems}
            keyExtractor={(item) => item.id}
            style={styles.list}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedId;
              return (
                <Pressable
                  onPress={() => setSelectedId(item.id)}
                  style={[
                    styles.listItem,
                    {
                      backgroundColor: isSelected ? colors.background.light : 'transparent',
                      borderColor: isSelected ? colors.primary[500] : colors.background.light,
                      borderRadius: radii.sm,
                    },
                  ]}
                >
                  <Text style={{ color: colors.text.primary, flex: 1 }} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={{ color: colors.accent.gold }}>{item.price} G</Text>
                </Pressable>
              );
            }}
          />
        ) : (
          <FlatList
            data={sellEntries}
            keyExtractor={(e) => e.id}
            style={styles.list}
            renderItem={({ item: entry }) => {
              const isSelected = entry.id === selectedId;
              return (
                <Pressable
                  onPress={() => setSelectedId(entry.id)}
                  style={[
                    styles.listItem,
                    {
                      backgroundColor: isSelected ? colors.background.light : 'transparent',
                      borderColor: isSelected ? colors.primary[500] : colors.background.light,
                      borderRadius: radii.sm,
                    },
                  ]}
                >
                  <Text style={{ color: colors.text.primary, flex: 1 }} numberOfLines={1}>
                    {entry.id}
                  </Text>
                  <Text style={{ color: colors.text.muted }}>×{entry.count}</Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text style={{ color: colors.text.muted, textAlign: 'center', marginTop: spacing[4] }}>
                Nothing to sell
              </Text>
            }
          />
        )}

        {/* Quantity + Action */}
        {selectedId ? (
          <View
            style={[
              styles.actionPanel,
              {
                backgroundColor: colors.background.surface,
                borderColor: colors.primary[700],
                borderRadius: radii.md,
                padding: spacing[3],
                marginTop: spacing[3],
              },
            ]}
          >
            <View style={styles.qtyRow}>
              <Text style={{ color: colors.text.secondary, fontSize: typography.fontSizes.sm }}>
                Qty:
              </Text>
              <Pressable onPress={() => adjustQty(-1)} style={styles.qtyBtn}>
                <Text style={{ color: colors.text.primary, fontSize: typography.fontSizes.lg }}>
                  −
                </Text>
              </Pressable>
              <Text style={{ color: colors.text.primary, fontSize: typography.fontSizes.md, minWidth: 24, textAlign: 'center' }}>
                {quantity}
              </Text>
              <Pressable onPress={() => adjustQty(1)} style={styles.qtyBtn}>
                <Text style={{ color: colors.text.primary, fontSize: typography.fontSizes.lg }}>
                  +
                </Text>
              </Pressable>
            </View>
            <Pressable
              onPress={tab === 'buy' ? handleBuy : handleSell}
              style={[
                styles.confirmBtn,
                {
                  backgroundColor: tab === 'buy' ? colors.primary[700] : colors.accent.stamina,
                  borderRadius: radii.sm,
                  paddingVertical: spacing[2],
                  paddingHorizontal: spacing[4],
                },
              ]}
            >
              <Text style={{ color: colors.text.primary, fontWeight: '700' }}>
                {tab === 'buy' ? 'Buy' : 'Sell'}
              </Text>
            </Pressable>
          </View>
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
  tabRow: { flexDirection: 'row', gap: 8 },
  tab: { alignItems: 'center' },
  list: { flex: 1 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    marginBottom: 4,
  },
  actionPanel: { borderWidth: 1 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  qtyBtn: { paddingHorizontal: 8 },
  confirmBtn: { alignItems: 'center' },
});

