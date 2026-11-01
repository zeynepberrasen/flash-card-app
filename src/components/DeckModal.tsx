import React, { useState, useEffect } from 'react';
import { Deck } from '../types';
import { X, Save, FolderPlus, Edit3 } from 'lucide-react';

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deckData: { name: string; description: string }) => void;
  initialDeck?: Deck | null;
}

export const DeckModal: React.FC<DeckModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDeck,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialDeck);

  useEffect(() => {
    if (initialDeck) {
      setName(initialDeck.name);
      setDescription(initialDeck.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [initialDeck, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Deck name cannot be empty.');
      return;
    }

    onSave({
      name: trimmedName,
      description: description.trim(),
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            {isEditing ? <Edit3 size={20} className="text-primary" /> : <FolderPlus size={20} className="text-primary" />}
            <h2 className="modal-title">{isEditing ? 'Edit Deck' : 'Create New Deck'}</h2>
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

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="deck-name" className="form-label">
              Deck Name <span className="required-star">*</span>
            </label>
            <input
              id="deck-name"
              type="text"
              className="form-input"
              placeholder="e.g., French 101, Python Basics"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="deck-description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="deck-description"
              className="form-textarea"
              rows={3}
              placeholder="What topics or concepts does this deck cover?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              {isEditing ? 'Save Changes' : 'Create Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeckModal;
