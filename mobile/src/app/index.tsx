import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Deck, DeckFilter } from '../types';
import { getDecks, deleteDeck } from '../services/storage';
import {
  getSelectedWidgetDeckId,
  setSelectedWidgetDeckId,
} from '../services/widgetService';
import { DeckCard } from '../components/DeckCard';
import { SearchBar } from '../components/SearchBar';
import { Colors, Radius, Shadows, Spacing } from '../constants/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<DeckFilter>('all');
  const [widgetDeckId, setWidgetDeckId] = useState<string | null>(null);

  // Load decks and widget settings on focus
  const loadData = useCallback(async () => {
    try {
      const [data, pinnedDeckId] = await Promise.all([
        getDecks(),
        getSelectedWidgetDeckId(),
      ]);
      setDecks(data);
      setWidgetDeckId(pinnedDeckId);
    } catch (error) {
      console.error('Failed to load decks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Set active deck on home widget
  const handleSetWidgetDeck = async (deckId: string) => {
    const deck = decks.find((d) => d.id === deckId);
    await setSelectedWidgetDeckId(deckId);
    setWidgetDeckId(deckId);
    Alert.alert(
      'Widget Updated',
      `"${deck ? deck.name : 'Deck'}" is now active on your Home Screen Flashcard Widget!`
    );
  };

  // Delete Deck with confirmation
  const handleDeleteDeck = (deckId: string) => {
    const deck = decks.find((d) => d.id === deckId);
    if (!deck) return;

    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete "${deck.name}"? All ${deck.cards?.length || 0} cards will be permanently removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDeck(deckId);
            loadData();
          },
        },
      ]
    );
  };

  // Navigation handlers
  const handleStudy = (deck: Deck) => {
    router.push({
      pathname: '/study/[id]',
      params: { id: deck.id },
    });
  };

  const handleManage = (deck: Deck) => {
    router.push({
      pathname: '/deck/[id]',
      params: { id: deck.id },
    });
  };

  const handleCreateDeck = () => {
    router.push('/modal/deck');
  };

  // Filtered Decks
  const filteredDecks = decks.filter((deck) => {
    const matchesSearch = deck.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());
    if (!matchesSearch) return false;

    const count = deck.cards ? deck.cards.length : 0;
    if (selectedFilter === 'empty') return count === 0;
    if (selectedFilter === 'has_cards') return count > 0;
    return true;
  });

  const totalCards = decks.reduce(
    (sum, deck) => sum + (deck.cards?.length || 0),
    0
  );
  const totalMastered = decks.reduce((sum, deck) => {
    const mastered = (deck.cards || []).filter(
      (c) => c.correctCount > c.incorrectCount && c.correctCount > 0
    ).length;
    return sum + mastered;
  }, 0);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading decks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDecks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DeckCard
              deck={item}
              onStudy={handleStudy}
              onManage={handleManage}
              onDelete={handleDeleteDeck}
              isWidgetDeck={item.id === widgetDeckId}
              onSetWidgetDeck={handleSetWidgetDeck}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.headerComponent}>
              {/* Stats Overview Banner */}
              <View style={styles.statsBanner}>
                <View style={styles.statBannerItem}>
                  <Text style={styles.statBannerValue}>{decks.length}</Text>
                  <Text style={styles.statBannerLabel}>Decks</Text>
                </View>
                <View style={styles.statBannerDivider} />
                <View style={styles.statBannerItem}>
                  <Text style={styles.statBannerValue}>{totalCards}</Text>
                  <Text style={styles.statBannerLabel}>Cards</Text>
                </View>
                <View style={styles.statBannerDivider} />
                <View style={styles.statBannerItem}>
                  <Text
                    style={[styles.statBannerValue, { color: Colors.success }]}
                  >
                    {totalMastered}
                  </Text>
                  <Text style={styles.statBannerLabel}>Mastered</Text>
                </View>
              </View>

              {/* Title & Quick Add Row */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Your Decks</Text>
                <TouchableOpacity
                  style={styles.headerAddBtn}
                  onPress={handleCreateDeck}
                  activeOpacity={0.8}
                >
                  <Feather name="plus" size={16} color={Colors.textWhite} />
                  <Text style={styles.headerAddBtnText}>New Deck</Text>
                </TouchableOpacity>
              </View>

              {/* Search & Filter */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="layers" size={36} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>
                {searchTerm || selectedFilter !== 'all'
                  ? 'No matching decks found'
                  : 'No decks yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm || selectedFilter !== 'all'
                  ? 'Try adjusting your search query or filter options.'
                  : 'Create your first flashcard deck to start learning and tracking your active recall.'}
              </Text>
              {!searchTerm && selectedFilter === 'all' && (
                <TouchableOpacity
                  style={styles.emptyActionBtn}
                  onPress={handleCreateDeck}
                  activeOpacity={0.8}
                >
                  <Feather name="plus" size={18} color={Colors.textWhite} />
                  <Text style={styles.emptyActionBtnText}>Create First Deck</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateDeck}
        activeOpacity={0.85}
        accessibilityLabel="Create New Deck"
      >
        <Feather name="plus" size={24} color={Colors.textWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 90, // Leave room for FAB
  },
  headerComponent: {
    marginBottom: Spacing.sm,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...Shadows.sm,
  },
  statBannerItem: {
    alignItems: 'center',
    flex: 1,
  },
  statBannerValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  statBannerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  statBannerDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
  },
  headerAddBtnText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.md,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  emptyActionBtnText: {
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});
