import React from 'react';
import { Deck } from '../types';
import { DeckCard } from './DeckCard';
import { Layers } from 'lucide-react';

interface DeckListProps {
  decks: Deck[];
  onStudy: (deck: Deck) => void;
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
  onCreateClick?: () => void;
}

export const DeckList: React.FC<DeckListProps> = ({
  decks,
  onStudy,
  onEdit,
  onDelete,
  onCreateClick,
}) => {
  if (decks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Layers size={40} />
        </div>
        <h3 className="empty-title">No decks yet</h3>
        <p className="empty-description">
          Create your first flashcard deck to start learning and tracking your progress.
        </p>
        {onCreateClick && (
          <button className="btn-primary" onClick={onCreateClick}>
            Create Deck
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="decks-grid">
      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          onStudy={onStudy}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DeckList;
