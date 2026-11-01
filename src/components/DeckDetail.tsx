import React, { useState } from 'react';
import { Deck, Flashcard as FlashcardType } from '../types';
import { FlashcardForm } from './FlashcardForm';
import { ArrowLeft, Plus, BookOpen, Edit2, Trash2, Layers, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

interface DeckDetailProps {
  deck: Deck;
  onBack: () => void;
  onUpdateDeck: (updatedDeck: Deck) => void;
  onStartStudy: (deck: Deck) => void;
}

export const DeckDetail: React.FC<DeckDetailProps> = ({
  deck,
  onBack,
  onUpdateDeck,
  onStartStudy,
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardType | null>(null);

  const cards = deck.cards || [];

  // Add new card or update existing card
  const handleSaveCard = (card: FlashcardType) => {
    let updatedCards: FlashcardType[];

    const exists = cards.some((c) => c.id === card.id);
    if (exists) {
      // Update existing
      updatedCards = cards.map((c) => (c.id === card.id ? card : c));
    } else {
      // Add new card to deck
      updatedCards = [...cards, card];
    }

    const updatedDeck: Deck = {
      ...deck,
      cards: updatedCards,
    };

    onUpdateDeck(updatedDeck);
    setIsAddingCard(false);
    setEditingCard(null);
  };

  // Delete card with confirmation
  const handleDeleteCard = (cardId: string) => {
    const cardToDelete = cards.find((c) => c.id === cardId);
    const label = cardToDelete ? `"${cardToDelete.question.slice(0, 35)}..."` : 'this card';

    if (window.confirm(`Are you sure you want to delete ${label}?`)) {
      const updatedCards = cards.filter((c) => c.id !== cardId);
      const updatedDeck: Deck = {
        ...deck,
        cards: updatedCards,
      };

      onUpdateDeck(updatedDeck);

      if (editingCard?.id === cardId) {
        setEditingCard(null);
      }
    }
  };

  return (
    <div className="deck-detail-container">
      {/* Top Navigation & Actions */}
      <div className="deck-detail-nav">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Decks
        </button>

        {cards.length > 0 && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => onStartStudy(deck)}
          >
            <BookOpen size={18} />
            Study Deck ({cards.length})
          </button>
        )}
      </div>

      {/* Deck Header Info Card */}
      <div className="deck-hero-card">
        <div className="deck-hero-content">
          <div className="deck-hero-badge-row">
            <span className="deck-hero-badge">
              <Layers size={14} /> Deck Details
            </span>
            <span className="deck-hero-count">
              {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            </span>
          </div>

          <h1 className="deck-hero-title">{deck.name}</h1>
          <p className="deck-hero-desc">
            {deck.description || 'No description provided for this deck.'}
          </p>
        </div>
      </div>

      {/* Add / Edit Card Form Section */}
      {(isAddingCard || editingCard) && (
        <section className="form-card-section">
          <FlashcardForm
            onSubmit={handleSaveCard}
            onCancel={() => {
              setIsAddingCard(false);
              setEditingCard(null);
            }}
            initialCard={editingCard}
          />
        </section>
      )}

      {/* Flashcards List Header */}
      <section className="deck-cards-section">
        <div className="section-header">
          <h2 className="section-title">
            Flashcards ({cards.length})
          </h2>

          {!isAddingCard && !editingCard && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setEditingCard(null);
                setIsAddingCard(true);
              }}
            >
              <Plus size={18} />
              Add Flashcard
            </button>
          )}
        </div>

        {/* Empty State when no cards exist */}
        {cards.length === 0 && !isAddingCard ? (
          <div className="empty-state">
            <div className="empty-icon">
              <HelpCircle size={36} />
            </div>
            <h3 className="empty-title">No flashcards yet</h3>
            <p className="empty-description">
              Start adding questions and answers to "{deck.name}" to begin learning.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsAddingCard(true)}
            >
              <Plus size={18} />
              Add First Flashcard
            </button>
          </div>
        ) : (
          <div className="cards-grid-detail">
            {cards.map((card, index) => (
              <div key={card.id} className="card-item-card">
                <div className="card-item-top">
                  <span className="card-item-number">#{index + 1}</span>

                  <div className="card-item-actions">
                    <button
                      type="button"
                      className="btn-icon btn-edit"
                      onClick={() => {
                        setIsAddingCard(false);
                        setEditingCard(card);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      title="Edit flashcard"
                      aria-label="Edit flashcard"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteCard(card.id)}
                      title="Delete flashcard"
                      aria-label="Delete flashcard"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="card-side-block question-side">
                  <div className="card-side-label">Question</div>
                  <p className="card-side-text">{card.question}</p>
                </div>

                <div className="card-side-block answer-side">
                  <div className="card-side-label">Answer</div>
                  <p className="card-side-text">{card.answer}</p>
                </div>

                {(card.correctCount > 0 || card.incorrectCount > 0) && (
                  <div className="card-stats-footer">
                    <span className="indicator-pill known" title="Times correctly recalled">
                      <CheckCircle2 size={13} /> {card.correctCount} correct
                    </span>
                    <span className="indicator-pill unknown" title="Times missed">
                      <XCircle size={13} /> {card.incorrectCount} missed
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DeckDetail;
