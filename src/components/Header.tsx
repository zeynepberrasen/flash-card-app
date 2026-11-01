import React from 'react';
import { Layers } from 'lucide-react';

interface HeaderProps {
  totalDecks: number;
  totalCards: number;
}

export const Header: React.FC<HeaderProps> = ({ totalDecks, totalCards }) => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-group">
          <div className="logo-icon">
            <Layers size={22} />
          </div>
          <span className="logo-text">Flashcard App</span>
          <span className="logo-badge">v0.1</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span><strong>{totalDecks}</strong> Decks</span>
          <span>•</span>
          <span><strong>{totalCards}</strong> Cards</span>
        </div>
      </div>
    </header>
  );
};
