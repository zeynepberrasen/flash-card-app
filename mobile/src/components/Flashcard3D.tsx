import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Flashcard } from '../types';
import { Colors, Radius, Shadows, Spacing } from '../constants/theme';

interface Flashcard3DProps {
  card: Flashcard;
  onCorrect: () => void;
  onIncorrect: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width - Spacing.xl * 2, 420);

export const Flashcard3D: React.FC<Flashcard3DProps> = ({
  card,
  onCorrect,
  onIncorrect,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Reset flip state when card changes
  useEffect(() => {
    animatedValue.setValue(0);
    setIsFlipped(false);
  }, [card.id]);

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(true);
    }
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
  };

  return (
    <View style={styles.container}>
      {/* Front Face - Question */}
      <Animated.View
        style={[styles.card, styles.cardFront, frontAnimatedStyle]}
        pointerEvents={isFlipped ? 'none' : 'auto'}
      >
        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.questionBadge]}>
            <Text style={styles.questionBadgeText}>QUESTION</Text>
          </View>
          <TouchableOpacity
            style={styles.hintIconBtn}
            onPress={flipCard}
            activeOpacity={0.7}
          >
            <Feather name="rotate-cw" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.cardText}>{card.question}</Text>
        </View>

        <TouchableOpacity
          style={styles.revealBtn}
          onPress={flipCard}
          activeOpacity={0.8}
        >
          <Feather name="eye" size={18} color={Colors.primary} />
          <Text style={styles.revealBtnText}>Tap to reveal answer</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Back Face - Answer */}
      <Animated.View
        style={[styles.card, styles.cardBack, backAnimatedStyle]}
        pointerEvents={isFlipped ? 'auto' : 'none'}
      >
        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.answerBadge]}>
            <Text style={styles.answerBadgeText}>ANSWER</Text>
          </View>
          <TouchableOpacity
            style={styles.flipBackBtn}
            onPress={flipCard}
            activeOpacity={0.7}
          >
            <Feather name="rotate-ccw" size={14} color={Colors.textSecondary} />
            <Text style={styles.flipBackText}>Question</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.cardText}>{card.answer}</Text>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.incorrectBtn]}
            onPress={onIncorrect}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={18} color={Colors.danger} />
            <Text style={styles.incorrectBtnText}>I don't know</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.correctBtn]}
            onPress={onCorrect}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark" size={18} color={Colors.textWhite} />
            <Text style={styles.correctBtnText}>I know this</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 380,
    alignSelf: 'center',
    marginVertical: Spacing.lg,
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  cardFront: {
    backgroundColor: Colors.card,
  },
  cardBack: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  questionBadge: {
    backgroundColor: Colors.primaryLight,
  },
  questionBadgeText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  answerBadge: {
    backgroundColor: '#EDE9FE',
  },
  answerBadgeText: {
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  hintIconBtn: {
    padding: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardSecondary,
  },
  flipBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: Colors.cardSecondary,
  },
  flipBackText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderFocus,
  },
  revealBtnText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  incorrectBtn: {
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
  },
  incorrectBtnText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  correctBtn: {
    backgroundColor: Colors.success,
  },
  correctBtnText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
});
