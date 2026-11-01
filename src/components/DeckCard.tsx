import React from 'react';
import { Deck } from '../types';
import { BookOpen, Edit2, Trash2 } from 'lucide-react';

interface DeckCardProps {
  deck: Deck;
  onStudy: (deck: Deck) => void;
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  onStudy,
  onEdit,
  onDelete,
}) => {
  const cardCount = deck.cards ? deck.cards.length : 0;

  return (
    <div className="deck-card">
      <div
        className="deck-content clickable-area"
        onClick={() => onEdit(deck)}
        title="Click to view and manage flashcards"
      >
        <div className="deck-header">
          <h3 className="deck-title">{deck.name}</h3>
          <span className="deck-count">
            {cardCount} {cardCount === 1 ? 'card' : 'cards'}
          </span>
        </div>
        <p className="deck-description">
          {deck.description || 'No description provided.'}
        </p>
      </div>

      <div className="deck-actions">
        <button
          className="btn-study"
          onClick={() => onStudy(deck)}
          title="Study cards in this deck"
        >
          <BookOpen size={16} />
          Study
        </button>

        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(deck)}
          title="Manage cards & deck"
          aria-label="Manage cards & deck"
        >
          <Edit2 size={16} />
        </button>

        <button
          className="btn-icon btn-delete"
          onClick={() => onDelete(deck.id)}
          title="Delete deck"
          aria-label="Delete deck"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default DeckCard;
