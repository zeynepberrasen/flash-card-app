import { Platform, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addUserInteractionListener } from 'expo-widgets';
import { Deck, FlashcardWidgetProps } from '../types';
import { getDecks, subscribeToStorageChanges } from './storage';
import { FlashcardWidget, initialWidgetProps } from '../widgets/FlashcardWidget';

const WIDGET_SELECTED_DECK_KEY = 'flashcard_widget_selected_deck_id';
const WIDGET_CARD_INDEX_KEY = 'flashcard_widget_current_card_index';

// Cache for avoiding unnecessary widget reload calls
let lastSyncedSnapshotJson: string | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let isInitialized = false;

/**
 * Options for synchronizing the widget.
 */
export interface WidgetSyncOptions {
  deckId?: string;
  cardIndex?: number;
  reveal?: boolean;
  force?: boolean;
  reason?: 'startup' | 'foreground' | 'storage_change' | 'user_action';
}

/**
 * Initialize widget synchronization and lifecycle listeners.
 * Handles:
 * 1. Startup refresh
 * 2. Foreground resume refresh (AppState 'active')
 * 3. Reactive storage updates when cards/decks are mutated
 * 4. User interaction events from the widget
 */
export function initWidgetService(): () => void {
  // 1. Refresh when the application starts
  syncWidget({ force: true, reason: 'startup' });

  // 2. Refresh when the application returns to the foreground
  let currentAppState = AppState.currentState;
  const appStateSubscription = AppState.addEventListener(
    'change',
    (nextAppState: AppStateStatus) => {
      if (
        currentAppState?.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App resumed from background - refresh widget to reflect any external changes
        debouncedSyncWidget({ reason: 'foreground' });
      }
      currentAppState = nextAppState;
    }
  );

  // 3. Subscribe to all deck and card mutations with debouncing to avoid refresh spam
  let unsubscribeStorage: (() => void) | undefined;
  if (!isInitialized) {
    unsubscribeStorage = subscribeToStorageChanges(() => {
      debouncedSyncWidget({ reason: 'storage_change' });
    });
    isInitialized = true;
  }

  // 4. Listen to native widget interactions (e.g. button taps)
  const cleanupWidgetListener = setupWidgetInteractionListener();

  return () => {
    appStateSubscription.remove();
    if (unsubscribeStorage) {
      unsubscribeStorage();
      isInitialized = false;
    }
    cleanupWidgetListener();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  };
}

/**
 * Debounced widget synchronizer to coalesce rapid changes (e.g. rapid card edits).
 */
export function debouncedSyncWidget(
  options?: WidgetSyncOptions,
  delayMs = 300
): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    syncWidget(options);
    debounceTimer = null;
  }, delayMs);
}

/**
 * Get the currently selected deck ID for the home screen widget.
 */
export async function getSelectedWidgetDeckId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(WIDGET_SELECTED_DECK_KEY);
  } catch (error) {
    console.error('Failed to get selected widget deck ID:', error);
    return null;
  }
}

/**
 * Persist the selected deck ID for the home screen widget.
 */
export async function setSelectedWidgetDeckId(deckId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(WIDGET_SELECTED_DECK_KEY, deckId);
    // Reset index to 0 when switching decks
    await setWidgetCardIndex(0);
    await syncWidget({ deckId, cardIndex: 0, force: true, reason: 'user_action' });
  } catch (error) {
    console.error('Failed to set selected widget deck ID:', error);
  }
}

/**
 * Get the current card index for the widget.
 */
export async function getWidgetCardIndex(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_CARD_INDEX_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch (error) {
    console.error('Failed to get widget card index:', error);
    return 0;
  }
}

/**
 * Set the current card index for the widget.
 */
export async function setWidgetCardIndex(index: number): Promise<void> {
  try {
    await AsyncStorage.setItem(WIDGET_CARD_INDEX_KEY, index.toString());
  } catch (error) {
    console.error('Failed to set widget card index:', error);
  }
}

/**
 * Synchronize the home screen widget with the user's latest decks and card selection.
 * Respects iOS daily budget and avoids redundant reload calls.
 */
export async function syncWidget(
  options?: WidgetSyncOptions
): Promise<FlashcardWidgetProps> {
  try {
    const decks = await getDecks();

    // Handle Empty All-Decks State
    if (decks.length === 0) {
      const emptyProps: FlashcardWidgetProps = {
        deckId: '',
        deckName: 'No Decks',
        cardId: '',
        question: 'No decks available',
        answer: 'Open the app to create your first flashcard deck!',
        isRevealed: false,
        cardIndex: 0,
        totalCards: 0,
        hasCards: false,
        deepLinkUrl: 'mobile://',
        cards: [],
      };

      updateWidgetIfChanged(emptyProps, options?.force);
      return emptyProps;
    }

    // 1. Determine active deck
    let activeDeck: Deck | undefined;
    const targetDeckId = options?.deckId || (await getSelectedWidgetDeckId());

    if (targetDeckId) {
      activeDeck = decks.find((d) => d.id === targetDeckId);
    }

    // Fallback: Pick first deck with cards, or first deck if all empty
    if (!activeDeck) {
      activeDeck = decks.find((d) => (d.cards?.length || 0) > 0) || decks[0];
      if (activeDeck) {
        await AsyncStorage.setItem(WIDGET_SELECTED_DECK_KEY, activeDeck.id);
      }
    }

    const cards = activeDeck.cards || [];
    const totalCards = cards.length;
    const hasCards = totalCards > 0;

    // 2. Determine card index (avoid out-of-bounds or invalid index on deleted cards)
    let cardIndex = options?.cardIndex ?? (await getWidgetCardIndex());
    if (totalCards > 0) {
      if (cardIndex >= totalCards || cardIndex < 0) {
        cardIndex = 0;
      }
    } else {
      cardIndex = 0;
    }
    await AsyncStorage.setItem(WIDGET_CARD_INDEX_KEY, cardIndex.toString());

    // 3. Current Card
    const currentCard = hasCards ? cards[cardIndex] : null;

    const widgetProps: FlashcardWidgetProps = {
      deckId: activeDeck.id,
      deckName: activeDeck.name,
      cardId: currentCard ? currentCard.id : '',
      question: currentCard ? currentCard.question : 'No cards in this deck yet',
      answer: currentCard ? currentCard.answer : 'Open the app to add flashcards.',
      isRevealed: options?.reveal ?? false,
      cardIndex,
      totalCards,
      hasCards,
      deepLinkUrl: `mobile://deck/${activeDeck.id}`,
      cards: cards.map((c) => ({
        id: c.id,
        question: c.question,
        answer: c.answer,
      })),
    };

    // 4. Platform-specific update with scheduled timeline for iOS & snapshot for Android
    updateWidgetWithTimeline(widgetProps, cards, cardIndex, options?.force);

    return widgetProps;
  } catch (error) {
    console.error('Error synchronizing widget:', error);
    return initialWidgetProps;
  }
}

/**
 * Updates the widget natively.
 * - On iOS: If the deck has multiple cards, schedules timeline entries into the future
 *   (e.g. 1-hour increments for the next several cards) so WidgetKit can advance cards natively
 *   without requiring active background execution.
 * - On Android: Updates the Glance snapshot.
 * - Compares payload with last synced snapshot to avoid unnecessary reloads.
 */
function updateWidgetWithTimeline(
  props: FlashcardWidgetProps,
  cards: { id: string; question: string; answer: string }[],
  startIndex: number,
  force = false
): void {
  const serialized = JSON.stringify(props);
  if (!force && lastSyncedSnapshotJson === serialized) {
    // Content is identical; avoid unnecessary widget refresh to conserve battery and budget
    return;
  }

  try {
    if (Platform.OS === 'ios' && props.hasCards && cards.length > 1) {
      // iOS Scheduled Timeline Refresh:
      // Schedule successive entries every 1 hour (up to min(totalCards, 6) entries)
      // This allows the device OS to natively rotate cards at system-allocated intervals.
      const now = Date.now();
      const count = Math.min(cards.length, 6);
      const entries = [];

      for (let i = 0; i < count; i++) {
        const nextIdx = (startIndex + i) % cards.length;
        const card = cards[nextIdx];
        const entryProps: FlashcardWidgetProps = {
          ...props,
          cardIndex: nextIdx,
          cardId: card.id,
          question: card.question,
          answer: card.answer,
          isRevealed: false,
        };

        entries.push({
          date: new Date(now + i * 60 * 60 * 1000), // Hourly progression
          props: entryProps,
        });
      }

      FlashcardWidget.updateTimeline(entries);
    } else {
      FlashcardWidget.updateSnapshot(props);
    }

    FlashcardWidget.reload();
    lastSyncedSnapshotJson = serialized;
  } catch (err) {
    console.warn('Native widget update failed:', err);
  }
}

function updateWidgetIfChanged(props: FlashcardWidgetProps, force = false): void {
  const serialized = JSON.stringify(props);
  if (!force && lastSyncedSnapshotJson === serialized) {
    return;
  }
  try {
    FlashcardWidget.updateSnapshot(props);
    FlashcardWidget.reload();
    lastSyncedSnapshotJson = serialized;
  } catch (err) {
    console.warn('Widget snapshot update failed:', err);
  }
}

/**
 * Cycle to the next card in the active widget deck without repeating cards unnecessarily.
 */
export async function nextWidgetCard(): Promise<FlashcardWidgetProps> {
  const currentIndex = await getWidgetCardIndex();
  return syncWidget({ cardIndex: currentIndex + 1, reveal: false, force: true, reason: 'user_action' });
}

/**
 * Listen for user interactions from the home screen widget.
 */
export function setupWidgetInteractionListener(): () => void {
  try {
    const subscription = addUserInteractionListener((event) => {
      console.log('Widget interaction received:', event);
      // When the user taps the reveal button, the widget toggles isRevealed
      // natively. Avoid resetting isRevealed back to false!
      if (event?.target === 'reveal') {
        return;
      }
      // Synchronize in-app state with the latest card when interaction occurs
      syncWidget({ force: true, reason: 'user_action' });
    });

    return () => {
      subscription.remove();
    };
  } catch (error) {
    console.warn('Widget interaction listener not supported on this platform:', error);
    return () => {};
  }
}
