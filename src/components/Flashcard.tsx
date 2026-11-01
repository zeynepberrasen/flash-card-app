import React, { useState, useEffect } from 'react';
import { Flashcard as FlashcardType } from '../types';
import { RotateCw, Check, X, Eye } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  onCorrect,
  onIncorrect,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state whenever the card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="flashcard-wrapper">
      <div className={`flashcard-scene ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="flashcard-3d">
          {/* Front Face - Question */}
          <div className="flashcard-face flashcard-face-front">
            <div className="card-face-badge badge-question">Question</div>

            <div className="card-face-body">
              <p className="card-text">{card.question}</p>
            </div>

            <div className="card-face-footer">
              <button
                type="button"
                className="btn-flip"
                onClick={handleFlip}
                title="Click to reveal answer"
              >
                <Eye size={18} />
                Show Answer
              </button>
            </div>
          </div>

          {/* Back Face - Answer */}
          <div className="flashcard-face flashcard-face-back">
            <div className="card-face-badge badge-answer">Answer</div>

            <div className="card-face-body">
              <p className="card-text">{card.answer}</p>
            </div>

            <div className="card-face-footer back-footer">
              <button
                type="button"
                className="btn-flip-back"
                onClick={handleFlip}
                title="Flip back to question"
              >
                <RotateCw size={15} />
                Question
              </button>

              <div className="study-response-actions">
                <button
                  type="button"
                  className="btn-response btn-incorrect"
                  onClick={() => {
                    onIncorrect();
                  }}
                >
                  <X size={18} />
                  I don't know
                </button>

                <button
                  type="button"
                  className="btn-response btn-correct"
                  onClick={() => {
                    onCorrect();
                  }}
                >
                  <Check size={18} />
                  I know this
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
