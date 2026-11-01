export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
  correctCount: number;
  incorrectCount: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: number;
}

export interface StudyProgress {
  totalCards: number;
  completedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export type DeckFilter = 'all' | 'has_cards' | 'empty';

export interface FlashcardWidgetCardSummary {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardWidgetProps {
  deckId: string;
  deckName: string;
  cardId: string;
  question: string;
  answer: string;
  isRevealed: boolean;
  cardIndex: number;
  totalCards: number;
  hasCards: boolean;
  deepLinkUrl: string;
  cards: FlashcardWidgetCardSummary[];
}
