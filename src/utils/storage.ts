import { Deck } from '../types';
import { sampleDecks } from '../data/sampleData';

const STORAGE_KEY = 'flashcard_app_decks';

/**
 * Get all decks from localStorage.
 * If no data exists, initializes localStorage with sample decks.
 */
export function getDecks(): Deck[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      saveDecks(sampleDecks);
      return sampleDecks;
    }
    return JSON.parse(data) as Deck[];
  } catch (error) {
    console.error('Error reading decks from localStorage:', error);
    return sampleDecks;
  }
}

/**
 * Save all decks to localStorage.
 */
export function saveDecks(decks: Deck[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch (error) {
    console.error('Error saving decks to localStorage:', error);
  }
}

/**
 * Add a new deck and save to localStorage.
 * Returns the updated list of decks.
 */
export function addDeck(deck: Deck): Deck[] {
  const currentDecks = getDecks();
  const updatedDecks = [...currentDecks, deck];
  saveDecks(updatedDecks);
  return updatedDecks;
}

/**
 * Update an existing deck by ID and save to localStorage.
 * Returns the updated list of decks.
 */
export function updateDeck(updatedDeck: Deck): Deck[] {
  const currentDecks = getDecks();
  const updatedDecks = currentDecks.map((deck) =>
    deck.id === updatedDeck.id ? updatedDeck : deck
  );
  saveDecks(updatedDecks);
  return updatedDecks;
}

/**
 * Delete a deck by ID and save to localStorage.
 * Returns the updated list of decks.
 */
export function deleteDeck(deckId: string): Deck[] {
  const currentDecks = getDecks();
  const updatedDecks = currentDecks.filter((deck) => deck.id !== deckId);
  saveDecks(updatedDecks);
  return updatedDecks;
}

// Helper aliases
export const getStoredDecks = getDecks;
export const saveStoredDecks = saveDecks;
