import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Deck } from '../types';
import { Colors, Radius, Shadows, Spacing } from '../constants/theme';

interface DeckCardProps {
  deck: Deck;
  onStudy: (deck: Deck) => void;
  onManage: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
  isWidgetDeck?: boolean;
  onSetWidgetDeck?: (deckId: string) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  onStudy,
  onManage,
  onDelete,
  isWidgetDeck,
  onSetWidgetDeck,
}) => {
  const cardCount = deck.cards ? deck.cards.length : 0;
  const masteredCount = (deck.cards || []).filter(
    (c) => c.correctCount > c.incorrectCount && c.correctCount > 0
  ).length;

  return (
    <View style={styles.cardContainer}>
      {/* Clickable Header & Content Area */}
      <TouchableOpacity
        style={styles.contentArea}
        onPress={() => onManage(deck)}
        activeOpacity={0.7}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleWithBadge}>
            <Text style={styles.deckTitle} numberOfLines={1}>
              {deck.name}
            </Text>
            {isWidgetDeck && (
              <View style={styles.widgetActivePill}>
                <Feather name="layout" size={11} color="#4338CA" />
                <Text style={styles.widgetActivePillText}>Widget Deck</Text>
              </View>
            )}
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {cardCount} {cardCount === 1 ? 'card' : 'cards'}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {deck.description || 'No description provided.'}
        </Text>

        <View style={styles.statsRow}>
          {cardCount > 0 && (
            <View style={styles.statPill}>
              <Feather name="check-circle" size={12} color={Colors.success} />
              <Text style={styles.statPillText}>
                {masteredCount}/{cardCount} mastered
              </Text>
            </View>
          )}

          {onSetWidgetDeck && !isWidgetDeck && (
            <TouchableOpacity
              style={styles.setWidgetBtn}
              onPress={() => onSetWidgetDeck(deck.id)}
              activeOpacity={0.7}
            >
              <Feather name="layout" size={12} color={Colors.primary} />
              <Text style={styles.setWidgetBtnText}>Show on Widget</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Action Footer */}
      <View style={styles.actionsFooter}>
        <TouchableOpacity
          style={[
            styles.studyButton,
            cardCount === 0 && styles.studyButtonDisabled,
          ]}
          onPress={() => onStudy(deck)}
          disabled={cardCount === 0}
          activeOpacity={0.8}
        >
          <Feather
            name="book-open"
            size={16}
            color={cardCount === 0 ? Colors.textLight : Colors.textWhite}
          />
          <Text
            style={[
              styles.studyButtonText,
              cardCount === 0 && styles.studyButtonTextDisabled,
            ]}
          >
            Study
          </Text>
        </TouchableOpacity>

        <View style={styles.iconButtonsGroup}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onManage(deck)}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.deleteIconButton]}
            onPress={() => onDelete(deck.id)}
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={16} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  contentArea: {
    padding: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  titleWithBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  widgetActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  widgetActivePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
  },
  countBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    flexWrap: 'wrap',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  setWidgetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  setWidgetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.cardSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  studyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  studyButtonDisabled: {
    backgroundColor: Colors.border,
  },
  studyButtonText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  studyButtonTextDisabled: {
    color: Colors.textLight,
  },
  iconButtonsGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteIconButton: {
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.dangerBorder,
  },
});
