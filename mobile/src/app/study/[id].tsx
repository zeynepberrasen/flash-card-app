import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Deck } from '../../types';
import { getDecks, recordCardReview } from '../../services/storage';
import { Flashcard3D } from '../../components/Flashcard3D';
import { ProgressStats } from '../../components/ProgressStats';
import { Colors, Radius, Shadows, Spacing } from '../../constants/theme';

export default function StudyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  useEffect(() => {
    async function loadDeck() {
      try {
        const allDecks = await getDecks();
        const found = allDecks.find((d) => d.id === id);
        setDeck(found || null);
      } catch (error) {
        console.error('Failed to load study deck:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDeck();
  }, [id]);

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
        <Text style={styles.emptyTitle}>Deck Not Found</Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cards = deck.cards || [];
  const totalCards = cards.length;
  const isCompleted = totalCards > 0 && currentIndex >= totalCards;
  const currentCard = cards[currentIndex];

  const progressPercent =
    totalCards > 0 ? Math.round((currentIndex / totalCards) * 100) : 0;

  const handleCorrect = async () => {
    setCorrectAnswers((prev) => prev + 1);
    if (currentCard) {
      await recordCardReview(deck.id, currentCard.id, true);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleIncorrect = async () => {
    setIncorrectAnswers((prev) => prev + 1);
    if (currentCard) {
      await recordCardReview(deck.id, currentCard.id, false);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
  };

  // Deck has 0 cards
  if (totalCards === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIconCircle}>
          <Feather name="book-open" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>This Deck is Empty</Text>
        <Text style={styles.emptySubtitle}>
          Add flashcards to "{deck.name}" before starting a study session.
        </Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>Back to Deck</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Session Completion View
  if (isCompleted) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.completionContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.completionCard}>
          <View style={styles.trophyIconCircle}>
            <Feather name="award" size={48} color={Colors.primary} />
          </View>

          <Text style={styles.completionTitle}>Session Complete!</Text>
          <Text style={styles.completionSubtitle}>
            Great job! You've reviewed all {totalCards} cards in{' '}
            <Text style={{ fontWeight: '700', color: Colors.text }}>
              {deck.name}
            </Text>
            .
          </Text>

          {/* Progress & Accuracy Stats */}
          <ProgressStats
            totalCards={totalCards}
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
          />

          <View style={styles.completionActions}>
            <TouchableOpacity
              style={styles.restartBtn}
              onPress={handleRestart}
              activeOpacity={0.8}
            >
              <Feather name="rotate-ccw" size={16} color={Colors.primary} />
              <Text style={styles.restartBtnText}>Study Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Feather name="check" size={16} color={Colors.textWhite} />
              <Text style={styles.actionBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Active Study Session
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.studyScrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Card */}
      <View style={styles.studyHeaderCard}>
        <View style={styles.studyHeaderRow}>
          <Text style={styles.deckNameLabel} numberOfLines={1}>
            {deck.name}
          </Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>
              Card {currentIndex + 1} of {totalCards}
            </Text>
          </View>
        </View>

        {/* Visual Progress Bar */}
        <View style={styles.progressBarSection}>
          <View style={styles.progressBarHeader}>
            <Text style={styles.progressBarLabel}>Progress</Text>
            <Text style={styles.progressBarPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>
      </View>

      {/* 3D Animated Card */}
      {currentCard && (
        <Flashcard3D
          card={currentCard}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}

      {/* Live score counter */}
      <View style={styles.liveScoreRow}>
        <View style={styles.liveScorePillKnown}>
          <Feather name="check" size={13} color={Colors.success} />
          <Text style={styles.liveScoreTextKnown}>{correctAnswers} known</Text>
        </View>
        <View style={styles.liveScorePillUnknown}>
          <Feather name="x" size={13} color={Colors.danger} />
          <Text style={styles.liveScoreTextUnknown}>
            {incorrectAnswers} need review
          </Text>
        </View>
      </View>
    </ScrollView>
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
  studyScrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  studyHeaderCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  studyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  deckNameLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  counterBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  counterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBarSection: {
    marginTop: Spacing.xs,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBarLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressBarPercent: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardSecondary,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  liveScoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  liveScorePillKnown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  liveScoreTextKnown: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  liveScorePillUnknown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.dangerLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
  },
  liveScoreTextUnknown: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
  completionContainer: {
    padding: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  completionCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  trophyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  completionSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  completionActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    marginTop: Spacing.lg,
  },
  restartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  restartBtnText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  actionBtnText: {
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    maxWidth: 260,
  },
});
