import React, { useState } from 'react';
import { Deck } from '../types';
import { Flashcard } from './Flashcard';
import { ProgressStats } from './ProgressStats';
import { ArrowLeft, RotateCcw, Award } from 'lucide-react';

interface StudyModeProps {
  deck: Deck;
  onBack: () => void;
  onDeckUpdated?: (updatedDeck: Deck) => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({ deck, onBack, onDeckUpdated }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const cards = deck.cards || [];
  const totalCards = cards.length;
  const isCompleted = totalCards > 0 && currentIndex >= totalCards;
  const currentCard = cards[currentIndex];

  // Progress calculations
  const progressPercent = totalCards > 0 
    ? Math.round((currentIndex / totalCards) * 100) 
    : 0;

  const handleCorrect = () => {
    setCorrectAnswers((prev) => prev + 1);

    // Track card stats and update deck in storage
    if (currentCard && onDeckUpdated) {
      const updatedCards = cards.map((c) =>
        c.id === currentCard.id ? { ...c, correctCount: (c.correctCount || 0) + 1 } : c
      );
      onDeckUpdated({ ...deck, cards: updatedCards });
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleIncorrect = () => {
    setIncorrectAnswers((prev) => prev + 1);

    // Track card stats and update deck in storage
    if (currentCard && onDeckUpdated) {
      const updatedCards = cards.map((c) =>
        c.id === currentCard.id ? { ...c, incorrectCount: (c.incorrectCount || 0) + 1 } : c
      );
      onDeckUpdated({ ...deck, cards: updatedCards });
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
  };

  // If the deck has no cards
  if (totalCards === 0) {
    return (
      <div className="study-container">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Decks
        </button>

        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <h3 className="empty-title">This deck is empty</h3>
          <p className="empty-description">
            Add some flashcards to "{deck.name}" before starting a study session.
          </p>
          <button type="button" className="btn-primary" onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isCompleted) {
    return (
      <div className="study-container">
        <div className="completion-card">
          <div className="completion-icon-wrapper">
            <Award size={48} />
          </div>

          <h2 className="completion-title">Session Complete!</h2>
          <p className="completion-subtitle">
            Great job! You've reviewed all cards in <strong>{deck.name}</strong>.
          </p>

          {/* Clean Progress & Accuracy Statistics Component */}
          <div style={{ width: '100%', maxWidth: '520px', margin: '1rem 0' }}>
            <ProgressStats
              totalCards={totalCards}
              correctAnswers={correctAnswers}
              incorrectAnswers={incorrectAnswers}
            />
          </div>

          <div className="completion-actions">
            <button type="button" className="btn-secondary" onClick={handleRestart}>
              <RotateCcw size={18} />
              Study Again
            </button>
            <button type="button" className="btn-primary" onClick={onBack}>
              <ArrowLeft size={18} />
              Back to Decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-container">
      {/* Top Header & Navigation */}
      <div className="study-header">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Exit Study
        </button>

        <div className="study-deck-title">
          <span>Studying:</span>
          <strong>{deck.name}</strong>
        </div>

        <div className="card-counter">
          Card <strong>{currentIndex + 1}</strong> / {totalCards}
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="study-progress-container">
        <div className="study-progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Flashcard */}
      <div className="study-card-area">
        <Flashcard
          card={currentCard}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      </div>

      {/* Quick live score indicator */}
      <div className="study-live-indicators">
        <span className="indicator-pill known">
          ✓ {correctAnswers} known
        </span>
        <span className="indicator-pill unknown">
          ✕ {incorrectAnswers} need review
        </span>
      </div>
    </div>
  );
};

export default StudyMode;
