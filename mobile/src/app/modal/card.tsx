import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getDecks, addCard, updateCard } from '../../services/storage';
import { Colors, Radius, Spacing } from '../../constants/theme';

export default function CardModalScreen() {
  const { deckId, cardId } = useLocalSearchParams<{
    deckId: string;
    cardId?: string;
  }>();
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(cardId);

  useEffect(() => {
    async function loadCardData() {
      if (deckId && cardId) {
        const decks = await getDecks();
        const deck = decks.find((d) => d.id === deckId);
        if (deck) {
          const card = (deck.cards || []).find((c) => c.id === cardId);
          if (card) {
            setQuestion(card.question);
            setAnswer(card.answer);
          }
        }
      }
    }
    loadCardData();
  }, [deckId, cardId]);

  const handleSave = async () => {
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion) {
      setError('Question cannot be empty.');
      return;
    }

    if (!trimmedAnswer) {
      setError('Answer cannot be empty.');
      return;
    }

    if (!deckId) {
      setError('Deck ID is missing.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && cardId) {
        const decks = await getDecks();
        const deck = decks.find((d) => d.id === deckId);
        const card = (deck?.cards || []).find((c) => c.id === cardId);
        if (card) {
          await updateCard(deckId, {
            ...card,
            question: trimmedQuestion,
            answer: trimmedAnswer,
          });
        }
      } else {
        await addCard(deckId, trimmedQuestion, trimmedAnswer);
      }
      router.back();
    } catch (err) {
      console.error('Failed to save card:', err);
      Alert.alert('Error', 'Failed to save flashcard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Feather
              name={isEditing ? 'edit-3' : 'plus-circle'}
              size={22}
              color={Colors.primary}
            />
            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Flashcard' : 'Add New Flashcard'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={15} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Question (Front Side) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.questionInput]}
            placeholder="e.g. What is polymorphism?"
            placeholderTextColor={Colors.textLight}
            value={question}
            onChangeText={(val) => {
              setQuestion(val);
              if (error) setError(null);
            }}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            autoFocus
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Answer (Back Side) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.answerInput]}
            placeholder="e.g. The ability of different classes to respond to the same message in different ways."
            placeholderTextColor={Colors.textLight}
            value={answer}
            onChangeText={(val) => {
              setAnswer(val);
              if (error) setError(null);
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Feather name="check" size={16} color={Colors.textWhite} />
            <Text style={styles.saveBtnText}>
              {isEditing ? 'Save Changes' : 'Save Card'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  closeBtn: {
    padding: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardSecondary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dangerLight,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  requiredStar: {
    color: Colors.danger,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 15,
    color: Colors.text,
  },
  questionInput: {
    height: 80,
  },
  answerInput: {
    height: 110,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
});
