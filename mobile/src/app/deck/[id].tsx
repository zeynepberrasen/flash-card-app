import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Deck, Flashcard } from '../../types';
import { getDecks, deleteDeck, deleteCard } from '../../services/storage';
import {
  getSelectedWidgetDeckId,
  setSelectedWidgetDeckId,
  nextWidgetCard,
} from '../../services/widgetService';
import { Colors, Radius, Shadows, Spacing } from '../../constants/theme';

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWidgetDeck, setIsWidgetDeck] = useState(false);

  const loadDeck = useCallback(async () => {
    try {
      const [allDecks, pinnedId] = await Promise.all([
        getDecks(),
        getSelectedWidgetDeckId(),
      ]);
      const currentDeck = allDecks.find((d) => d.id === id);
      setDeck(currentDeck || null);
      setIsWidgetDeck(pinnedId === id);
    } catch (error) {
      console.error('Failed to load deck:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadDeck();
    }, [loadDeck])
  );

  const handleToggleWidgetDeck = async () => {
    if (!deck) return;
    await setSelectedWidgetDeckId(deck.id);
    setIsWidgetDeck(true);
    Alert.alert(
      'Widget Updated',
      `"${deck.name}" is now active on your Home Screen Flashcard Widget!`
    );
  };

  const handleNextWidgetCard = async () => {
    const updatedProps = await nextWidgetCard();
    Alert.alert(
      'Next Card Synced',
      `Widget is now showing card: "${updatedProps.question.slice(0, 35)}..."`
    );
  };

  const handleDeleteDeck = () => {
    if (!deck) return;
    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete "${deck.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDeck(deck.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleEditDeck = () => {
    if (!deck) return;
    router.push({
      pathname: '/modal/deck',
      params: { deckId: deck.id },
    });
  };

  const handleAddCard = () => {
    if (!deck) return;
    router.push({
      pathname: '/modal/card',
      params: { deckId: deck.id },
    });
  };

  const handleEditCard = (card: Flashcard) => {
    if (!deck) return;
    router.push({
      pathname: '/modal/card',
      params: {
        deckId: deck.id,
        cardId: card.id,
      },
    });
  };

  const handleDeleteCard = (cardId: string) => {
    if (!deck) return;
    const card = (deck.cards || []).find((c) => c.id === cardId);
    Alert.alert(
      'Delete Flashcard',
      `Delete "${card ? card.question.slice(0, 30) : 'this card'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteCard(deck.id, cardId);
            setDeck(updated);
          },
        },
      ]
    );
  };

  const handleStartStudy = () => {
    if (!deck || !deck.cards || deck.cards.length === 0) return;
    router.push({
      pathname: '/study/[id]',
      params: { id: deck.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!deck) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={40} color={Colors.danger} />
        <Text style={styles.notFoundTitle}>Deck Not Found</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>Return to Decks</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cards = deck.cards || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerComponent}>
            {/* Hero Deck Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroBadge}>
                  <Feather name="layers" size={13} color={Colors.primary} />
                  <Text style={styles.heroBadgeText}>DECK DETAILS</Text>
                </View>
                <Text style={styles.heroCountText}>
                  {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                </Text>
              </View>

              <Text style={styles.heroTitle}>{deck.name}</Text>
              <Text style={styles.heroDescription}>
                {deck.description || 'No description provided.'}
              </Text>

              {/* Study Action CTA */}
              <TouchableOpacity
                style={[
                  styles.studyHeroBtn,
                  cards.length === 0 && styles.studyHeroBtnDisabled,
                ]}
                onPress={handleStartStudy}
                disabled={cards.length === 0}
                activeOpacity={0.85}
              >
                <Feather
                  name="book-open"
                  size={18}
                  color={cards.length === 0 ? Colors.textLight : Colors.textWhite}
                />
                <Text
                  style={[
                    styles.studyHeroBtnText,
                    cards.length === 0 && styles.studyHeroBtnTextDisabled,
                  ]}
                >
                  {cards.length === 0 ? 'Add cards to study' : `Study Deck (${cards.length})`}
                </Text>
              </TouchableOpacity>

              {/* Home Widget Sync Card */}
              <View style={styles.widgetControlCard}>
                <View style={styles.widgetControlLeft}>
                  <Feather
                    name="layout"
                    size={18}
                    color={isWidgetDeck ? Colors.success : Colors.textSecondary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.widgetControlTitle}>
                      {isWidgetDeck ? 'Active on Home Widget' : 'Home Screen Widget'}
                    </Text>
                    <Text style={styles.widgetControlDesc} numberOfLines={2}>
                      {isWidgetDeck
                        ? 'Flashcards from this deck are active on your home widget.'
                        : 'Set this deck to display on your home screen widget.'}
                    </Text>
                  </View>
                </View>

                {isWidgetDeck ? (
                  cards.length > 1 && (
                    <TouchableOpacity
                      style={styles.widgetCycleBtn}
                      onPress={handleNextWidgetCard}
                      activeOpacity={0.8}
                    >
                      <Feather name="rotate-cw" size={12} color={Colors.primary} />
                      <Text style={styles.widgetCycleBtnText}>Next Card</Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <TouchableOpacity
                    style={styles.widgetPinBtn}
                    onPress={handleToggleWidgetDeck}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.widgetPinBtnText}>Show on Widget</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Manage Deck Controls */}
              <View style={styles.deckManageRow}>
                <TouchableOpacity
                  style={styles.deckManageBtn}
                  onPress={handleEditDeck}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={14} color={Colors.textSecondary} />
                  <Text style={styles.deckManageBtnText}>Edit Info</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deckManageBtn, styles.deckDeleteBtn]}
                  onPress={handleDeleteDeck}
                  activeOpacity={0.7}
                >
                  <Feather name="trash-2" size={14} color={Colors.danger} />
                  <Text style={[styles.deckManageBtnText, { color: Colors.danger }]}>
                    Delete Deck
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Flashcards List Header */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Flashcards ({cards.length})</Text>
              <TouchableOpacity
                style={styles.addCardBtn}
                onPress={handleAddCard}
                activeOpacity={0.8}
              >
                <Feather name="plus" size={16} color={Colors.textWhite} />
                <Text style={styles.addCardBtnText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.cardItem}>
            <View style={styles.cardItemHeader}>
              <View style={styles.indexPill}>
                <Text style={styles.indexPillText}>#{index + 1}</Text>
              </View>
              <View style={styles.cardItemActions}>
                <TouchableOpacity
                  style={styles.cardActionIconBtn}
                  onPress={() => handleEditCard(item)}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={15} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cardActionIconBtn, styles.cardDeleteIconBtn]}
                  onPress={() => handleDeleteCard(item.id)}
                  activeOpacity={0.7}
                >
                  <Feather name="trash-2" size={15} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Question side */}
            <View style={styles.cardFieldBlock}>
              <Text style={styles.fieldTagQuestion}>QUESTION</Text>
              <Text style={styles.fieldText}>{item.question}</Text>
            </View>

            {/* Answer side */}
            <View style={[styles.cardFieldBlock, styles.answerFieldBlock]}>
              <Text style={styles.fieldTagAnswer}>ANSWER</Text>
              <Text style={styles.fieldText}>{item.answer}</Text>
            </View>

            {/* Mastery Stats Indicator */}
            {(item.correctCount > 0 || item.incorrectCount > 0) && (
              <View style={styles.cardStatsFooter}>
                <View style={styles.statTagCorrect}>
                  <Feather name="check" size={12} color={Colors.success} />
                  <Text style={styles.statTagTextCorrect}>
                    {item.correctCount} correct
                  </Text>
                </View>
                <View style={styles.statTagIncorrect}>
                  <Feather name="x" size={12} color={Colors.danger} />
                  <Text style={styles.statTagTextIncorrect}>
                    {item.incorrectCount} missed
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="help-circle" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No flashcards yet</Text>
            <Text style={styles.emptySubtitle}>
              Start adding questions and answers to "{deck.name}" to begin learning.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={handleAddCard}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={16} color={Colors.textWhite} />
              <Text style={styles.emptyAddBtnText}>Add First Card</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    padding: Spacing.xl,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  backBtn: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  backBtnText: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  headerComponent: {
    marginBottom: Spacing.sm,
  },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  heroCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  heroDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  studyHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  studyHeroBtnDisabled: {
    backgroundColor: Colors.border,
  },
  studyHeroBtnText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  studyHeroBtnTextDisabled: {
    color: Colors.textLight,
  },
  widgetControlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  widgetControlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  widgetControlTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  widgetControlDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  widgetPinBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  widgetPinBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  widgetCycleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  widgetCycleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  deckManageRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  deckManageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deckDeleteBtn: {
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.dangerBorder,
  },
  deckManageBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
  },
  addCardBtnText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '600',
  },
  cardItem: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cardItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  indexPill: {
    backgroundColor: Colors.cardSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  indexPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  cardItemActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  cardActionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardDeleteIconBtn: {
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.dangerBorder,
  },
  cardFieldBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  answerFieldBlock: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  fieldTagQuestion: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldTagAnswer: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  cardStatsFooter: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  statTagCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statTagTextCorrect: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.success,
  },
  statTagIncorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statTagTextIncorrect: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.danger,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
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
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    maxWidth: 260,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  emptyAddBtnText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
});
