import React, { useState } from 'react';
import { Deck, Flashcard as FlashcardType } from '../types';
import { FlashcardForm } from './FlashcardForm';
import { X, Plus, Edit2, Trash2, Check, Save, Layers, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

interface DeckDetailModalProps {
  isOpen: boolean;
  deck: Deck | null;
  onClose: () => void;
  onUpdateDeck: (updatedDeck: Deck) => void;
}

export const DeckDetailModal: React.FC<DeckDetailModalProps> = ({
  isOpen,
  deck,
  onClose,
  onUpdateDeck,
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [cardError, setCardError] = useState<string | null>(null);

  // Deck info editing state
  const [isEditingDeckInfo, setIsEditingDeckInfo] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [deckError, setDeckError] = useState<string | null>(null);

  React.useEffect(() => {
    if (deck) {
      setDeckName(deck.name);
      setDeckDescription(deck.description || '');
    }
    setIsAddingCard(false);
    setEditingCardId(null);
    setIsEditingDeckInfo(false);
    setCardError(null);
    setDeckError(null);
  }, [deck, isOpen]);

  if (!isOpen || !deck) return null;

  // Deck info update
  const handleSaveDeckInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = deckName.trim();
    if (!trimmedName) {
      setDeckError('Deck name cannot be empty.');
      return;
    }

    const updatedDeck: Deck = {
      ...deck,
      name: trimmedName,
      description: deckDescription.trim(),
    };
    onUpdateDeck(updatedDeck);
    setIsEditingDeckInfo(false);
    setDeckError(null);
  };

  // Add Card
  const handleAddCard = (newCard: FlashcardType) => {
    const updatedDeck: Deck = {
      ...deck,
      cards: [...(deck.cards || []), newCard],
    };
    onUpdateDeck(updatedDeck);
    setIsAddingCard(false);
  };

  // Start Edit Card
  const handleStartEditCard = (card: FlashcardType) => {
    setEditingCardId(card.id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setCardError(null);
  };

  // Save Edit Card
  const handleSaveEditCard = (cardId: string) => {
    const trimmedQuestion = editQuestion.trim();
    const trimmedAnswer = editAnswer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      setCardError('Both question and answer are required.');
      return;
    }

    const updatedCards = (deck.cards || []).map((card) =>
      card.id === cardId
        ? { ...card, question: trimmedQuestion, answer: trimmedAnswer }
        : card
    );

    onUpdateDeck({
      ...deck,
      cards: updatedCards,
    });
    setEditingCardId(null);
    setCardError(null);
  };

  // Delete Card
  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      const updatedCards = (deck.cards || []).map((card) => card).filter((c) => c.id !== cardId);
      onUpdateDeck({
        ...deck,
        cards: updatedCards,
      });
      if (editingCardId === cardId) {
        setEditingCardId(null);
      }
    }
  };

  const cards = deck.cards || [];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Layers size={22} className="text-primary" />
            <h2 className="modal-title">Manage Deck</h2>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Deck Details Section */}
        <div className="deck-info-box">
          {isEditingDeckInfo ? (
            <form onSubmit={handleSaveDeckInfo} className="modal-form">
              {deckError && <div className="form-error">{deckError}</div>}
              <div className="form-group">
                <label className="form-label">Deck Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={deckName}
                  onChange={(e) => {
                    setDeckName(e.target.value);
                    if (deckError) setDeckError(null);
                  }}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditingDeckInfo(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={16} /> Save Deck Info
                </button>
              </div>
            </form>
          ) : (
            <div className="deck-info-view">
              <div className="deck-info-text">
                <h3 className="deck-info-title">{deck.name}</h3>
                <p className="deck-info-desc">
                  {deck.description || 'No description provided.'}
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setIsEditingDeckInfo(true)}
              >
                <Edit2 size={15} /> Edit Info
              </button>
            </div>
          )}
        </div>

        {/* Flashcards Section */}
        <div className="cards-manager-section">
          <div className="cards-manager-header">
            <h3 className="cards-manager-title">
              Flashcards <span className="badge-count">{cards.length}</span>
            </h3>

            {!isAddingCard && (
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => setIsAddingCard(true)}
              >
                <Plus size={16} /> Add Card
              </button>
            )}
          </div>

          {/* Add Card Form */}
          {isAddingCard && (
            <div className="card-form-wrapper">
              <FlashcardForm
                onSubmit={handleAddCard}
                onCancel={() => setIsAddingCard(false)}
              />
            </div>
          )}

          {/* Cards List */}
          {cards.length === 0 && !isAddingCard ? (
            <div className="empty-cards-box">
              <HelpCircle size={32} className="text-muted" />
              <p>No cards in this deck yet.</p>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => setIsAddingCard(true)}
              >
                <Plus size={16} /> Add your first flashcard
              </button>
            </div>
          ) : (
            <div className="cards-list">
              {cards.map((card, index) => (
                <div key={card.id} className="card-item-row">
                  {editingCardId === card.id ? (
                    <div className="card-edit-form">
                      {cardError && <div className="form-error">{cardError}</div>}
                      <div className="form-group">
                        <label className="form-label">Question</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Answer</label>
                        <textarea
                          className="form-textarea"
                          rows={3}
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => setEditingCardId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn-primary btn-sm"
                          onClick={() => handleSaveEditCard(card.id)}
                        >
                          <Check size={15} /> Save Card
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-item-index">#{index + 1}</div>
                      <div className="card-item-content">
                        <div className="card-item-field">
                          <span className="field-tag question">Q</span>
                          <span className="field-text">{card.question}</span>
                        </div>
                        <div className="card-item-field">
                          <span className="field-tag answer">A</span>
                          <span className="field-text">{card.answer}</span>
                        </div>
                        {(card.correctCount > 0 || card.incorrectCount > 0) && (
                          <div className="card-item-stats">
                            <span className="card-stat-pill known">
                              <CheckCircle2 size={12} /> {card.correctCount}
                            </span>
                            <span className="card-stat-pill unknown">
                              <XCircle size={12} /> {card.incorrectCount}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="card-item-actions">
                        <button
                          type="button"
                          className="btn-icon btn-edit"
                          onClick={() => handleStartEditCard(card)}
                          title="Edit card"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteCard(card.id)}
                          title="Delete card"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckDetailModal;
