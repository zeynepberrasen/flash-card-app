import React from 'react';
import { CheckCircle2, XCircle, Layers, Percent } from 'lucide-react';

interface ProgressStatsProps {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  totalCards,
  correctAnswers,
  incorrectAnswers,
}) => {
  const answeredCount = correctAnswers + incorrectAnswers;

  // Safe percentage calculation to avoid division by zero or NaN
  const successPercentage = answeredCount > 0
    ? Math.round((correctAnswers / answeredCount) * 100)
    : 0;

  return (
    <div className="progress-stats-container">
      <div className="stats-grid">
        {/* Total Cards */}
        <div className="stats-box total">
          <div className="stats-box-icon">
            <Layers size={20} />
          </div>
          <div className="stats-box-content">
            <span className="stats-box-value">{totalCards}</span>
            <span className="stats-box-label">Total Cards</span>
          </div>
        </div>

        {/* Correct Answers */}
        <div className="stats-box success">
          <div className="stats-box-icon">
            <CheckCircle2 size={20} />
          </div>
          <div className="stats-box-content">
            <span className="stats-box-value">{correctAnswers}</span>
            <span className="stats-box-label">Correct</span>
          </div>
        </div>

        {/* Incorrect Answers */}
        <div className="stats-box danger">
          <div className="stats-box-icon">
            <XCircle size={20} />
          </div>
          <div className="stats-box-content">
            <span className="stats-box-value">{incorrectAnswers}</span>
            <span className="stats-box-label">Incorrect</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="stats-box rate">
          <div className="stats-box-icon">
            <Percent size={20} />
          </div>
          <div className="stats-box-content">
            <span className="stats-box-value">{successPercentage}%</span>
            <span className="stats-box-label">Success Rate</span>
          </div>
        </div>
      </div>

      {/* Visual Proportion Bar (pure CSS) */}
      {answeredCount > 0 && (
        <div className="stats-ratio-section">
          <div className="stats-ratio-bar">
            <div
              className="ratio-fill correct"
              style={{ width: `${successPercentage}%` }}
              title={`Correct: ${correctAnswers} (${successPercentage}%)`}
            />
            <div
              className="ratio-fill incorrect"
              style={{ width: `${100 - successPercentage}%` }}
              title={`Incorrect: ${incorrectAnswers} (${100 - successPercentage}%)`}
            />
          </div>
          <div className="stats-ratio-legend">
            <span className="legend-item success">
              <span className="legend-dot" /> {successPercentage}% Correct
            </span>
            <span className="legend-item danger">
              <span className="legend-dot" /> {100 - successPercentage}% Needs Practice
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressStats;
