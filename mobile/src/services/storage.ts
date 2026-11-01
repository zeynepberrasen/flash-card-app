import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck, Flashcard } from '../types';
import { sampleDecks } from '../data/sampleData';

const STORAGE_KEY = 'flashcard_app_decks';

type StorageChangeListener = () => void;
const changeListeners: StorageChangeListener[] = [];

/**
 * Subscribe to changes in decks storage (useful for syncing widgets & UI).
 */
export function subscribeToStorageChanges(listener: StorageChangeListener): () => void {
  changeListeners.push(listener);
  return () => {
    const idx = changeListeners.indexOf(listener);
    if (idx !== -1) changeListeners.splice(idx, 1);
  };
}

function notifyStorageChange(): void {
  changeListeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error('Storage change listener error:', err);
    }
  });
}

/**
 * Retrieve all decks from AsyncStorage.
 * If no decks are saved yet, initializes AsyncStorage with sample decks.
 */
export async function getDecks(): Promise<Deck[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      await saveDecks(sampleDecks);
      return sampleDecks;
    }
    const parsed = JSON.parse(raw) as Deck[];
    return Array.isArray(parsed) ? parsed : sampleDecks;
  } catch (error) {
    console.error('Error reading decks from AsyncStorage:', error);
    return sampleDecks;
  }
}

/**
 * Persist decks array into AsyncStorage and notify listeners.
 */
export async function saveDecks(decks: Deck[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    notifyStorageChange();
  } catch (error) {
    console.error('Error saving decks to AsyncStorage:', error);
    throw error;
  }
}

/**
 * Create and add a new deck.
 */
export async function addDeck(name: string, description: string): Promise<Deck> {
  const currentDecks = await getDecks();
  const newDeck: Deck = {
    id: `deck-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    description: description.trim(),
    cards: [],
    createdAt: Date.now(),
  };

  const updatedDecks = [newDeck, ...currentDecks];
  await saveDecks(updatedDecks);
  return newDeck;
}

/**
 * Update an existing deck's name, description, or cards.
 */
export async function updateDeck(updatedDeck: Deck): Promise<Deck> {
  const currentDecks = await getDecks();
  const updatedDecks = currentDecks.map((d) =>
    d.id === updatedDeck.id ? updatedDeck : d
  );
  await saveDecks(updatedDecks);
  return updatedDeck;
}

/**
 * Delete a deck by its ID.
 */
export async function deleteDeck(deckId: string): Promise<void> {
  const currentDecks = await getDecks();
  const updatedDecks = currentDecks.filter((d) => d.id !== deckId);
  await saveDecks(updatedDecks);
}

/**
 * Add a new flashcard to a deck.
 */
export async function addCard(
  deckId: string,
  question: string,
  answer: string
): Promise<Deck> {
  const currentDecks = await getDecks();
  const targetDeck = currentDecks.find((d) => d.id === deckId);
  if (!targetDeck) throw new Error(`Deck with id ${deckId} not found`);

  const newCard: Flashcard = {
    id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    question: question.trim(),
    answer: answer.trim(),
    createdAt: Date.now(),
    correctCount: 0,
    incorrectCount: 0,
  };

  const updatedDeck: Deck = {
    ...targetDeck,
    cards: [...(targetDeck.cards || []), newCard],
  };

  await updateDeck(updatedDeck);
  return updatedDeck;
}

/**
 * Update an existing flashcard in a deck.
 */
export async function updateCard(
  deckId: string,
  cardToUpdate: Flashcard
): Promise<Deck> {
  const currentDecks = await getDecks();
  const targetDeck = currentDecks.find((d) => d.id === deckId);
  if (!targetDeck) throw new Error(`Deck with id ${deckId} not found`);

  const updatedCards = (targetDeck.cards || []).map((c) =>
    c.id === cardToUpdate.id ? cardToUpdate : c
  );

  const updatedDeck: Deck = {
    ...targetDeck,
    cards: updatedCards,
  };

  await updateDeck(updatedDeck);
  return updatedDeck;
}

/**
 * Delete a flashcard from a deck.
 */
export async function deleteCard(
  deckId: string,
  cardId: string
): Promise<Deck> {
  const currentDecks = await getDecks();
  const targetDeck = currentDecks.find((d) => d.id === deckId);
  if (!targetDeck) throw new Error(`Deck with id ${deckId} not found`);

  const updatedCards = (targetDeck.cards || []).filter((c) => c.id !== cardId);

  const updatedDeck: Deck = {
    ...targetDeck,
    cards: updatedCards,
  };

  await updateDeck(updatedDeck);
  return updatedDeck;
}

/**
 * Record study recall feedback (correct / incorrect) for a specific card.
 */
export async function recordCardReview(
  deckId: string,
  cardId: string,
  isCorrect: boolean
): Promise<Deck> {
  const currentDecks = await getDecks();
  const targetDeck = currentDecks.find((d) => d.id === deckId);
  if (!targetDeck) throw new Error(`Deck with id ${deckId} not found`);

  const updatedCards = (targetDeck.cards || []).map((c) => {
    if (c.id === cardId) {
      return {
        ...c,
        correctCount: isCorrect ? c.correctCount + 1 : c.correctCount,
        incorrectCount: !isCorrect ? c.incorrectCount + 1 : c.incorrectCount,
      };
    }
    return c;
  });

  const updatedDeck: Deck = {
    ...targetDeck,
    cards: updatedCards,
  };

  await updateDeck(updatedDeck);
  return updatedDeck;
}
