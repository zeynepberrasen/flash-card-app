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
