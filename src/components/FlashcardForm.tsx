import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Save, X } from 'lucide-react';

interface FlashcardFormProps {
  onSubmit: (card: Flashcard) => void;
  onCancel: () => void;
  initialCard?: Flashcard | null;
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  onSubmit,
  onCancel,
  initialCard,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialCard);

  useEffect(() => {
    if (initialCard) {
      setQuestion(initialCard.question);
      setAnswer(initialCard.answer);
    } else {
      setQuestion('');
      setAnswer('');
    }
    setError(null);
  }, [initialCard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion) {
      setError('Question cannot be empty.');
      return;
    }

    if (!trimmedAnswer) {
      setError('Answer cannot be empty.');
      return;
    }

    if (initialCard) {
      // Update existing card
      const updatedCard: Flashcard = {
        ...initialCard,
        question: trimmedQuestion,
        answer: trimmedAnswer,
      };
      onSubmit(updatedCard);
    } else {
      // Create new card
      const newCard: Flashcard = {
        id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        question: trimmedQuestion,
        answer: trimmedAnswer,
        createdAt: Date.now(),
        correctCount: 0,
        incorrectCount: 0,
      };
      onSubmit(newCard);
    }

    setQuestion('');
    setAnswer('');
    setError(null);
  };

  return (
    <form className="flashcard-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{isEditing ? 'Edit Flashcard' : 'Add New Flashcard'}</h3>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="card-question" className="form-label">
          Question <span className="required-star">*</span>
        </label>
        <input
          id="card-question"
          type="text"
          className="form-input"
          placeholder="Enter question (front side)..."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (error) setError(null);
          }}
          autoFocus
        />
      </div>

      <div className="form-group">
        <label htmlFor="card-answer" className="form-label">
          Answer <span className="required-star">*</span>
        </label>
        <textarea
          id="card-answer"
          className="form-textarea"
          rows={4}
          placeholder="Enter answer (back side)..."
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (error) setError(null);
          }}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          <X size={16} />
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          <Save size={16} />
          {isEditing ? 'Save Changes' : 'Save Card'}
        </button>
      </div>
    </form>
  );
};

export default FlashcardForm;
