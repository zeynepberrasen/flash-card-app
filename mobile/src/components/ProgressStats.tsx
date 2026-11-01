import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../constants/theme';

interface ProgressStatsProps {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  totalCards,
  correctAnswers,
  incorrectAnswers,
}) => {
  const answeredCount = correctAnswers + incorrectAnswers;
  const successPercentage =
    answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Total Cards */}
        <View style={styles.statBox}>
          <View style={[styles.iconContainer, { backgroundColor: Colors.primaryLight }]}>
            <Feather name="layers" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>{totalCards}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        {/* Correct Answers */}
        <View style={styles.statBox}>
          <View style={[styles.iconContainer, { backgroundColor: Colors.successLight }]}>
            <Feather name="check-circle" size={18} color={Colors.success} />
          </View>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            {correctAnswers}
          </Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>

        {/* Incorrect Answers */}
        <View style={styles.statBox}>
          <View style={[styles.iconContainer, { backgroundColor: Colors.dangerLight }]}>
            <Feather name="x-circle" size={18} color={Colors.danger} />
          </View>
          <Text style={[styles.statValue, { color: Colors.danger }]}>
            {incorrectAnswers}
          </Text>
          <Text style={styles.statLabel}>Missed</Text>
        </View>

        {/* Accuracy Rate */}
        <View style={styles.statBox}>
          <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
            <Feather name="percent" size={18} color="#7C3AED" />
          </View>
          <Text style={[styles.statValue, { color: '#7C3AED' }]}>
            {successPercentage}%
          </Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Visual Ratio Bar */}
      {answeredCount > 0 && (
        <View style={styles.barSection}>
          <View style={styles.ratioBarTrack}>
            <View
              style={[
                styles.ratioFillCorrect,
                { width: `${successPercentage}%` },
              ]}
            />
            <View
              style={[
                styles.ratioFillIncorrect,
                { width: `${100 - successPercentage}%` },
              ]}
            />
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>{successPercentage}% Known</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.legendText}>
                {100 - successPercentage}% Needs Review
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  barSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ratioBarTrack: {
    height: 8,
    borderRadius: Radius.full,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: Colors.cardSecondary,
  },
  ratioFillCorrect: {
    backgroundColor: Colors.success,
    height: '100%',
  },
  ratioFillIncorrect: {
    backgroundColor: Colors.danger,
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
