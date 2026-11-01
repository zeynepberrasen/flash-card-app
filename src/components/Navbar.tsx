import React from 'react';
import { Layers } from 'lucide-react';

interface NavbarProps {
  totalDecks?: number;
  totalCards?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ totalDecks, totalCards }) => {
  return (
    <nav className="header">
      <div className="header-inner">
        <div className="logo-group">
          <div className="logo-icon">
            <Layers size={22} />
          </div>
          <span className="logo-text">Flashcard App</span>
        </div>

        {totalDecks !== undefined && totalCards !== undefined && (
          <div className="navbar-stats">
            <span><strong>{totalDecks}</strong> {totalDecks === 1 ? 'Deck' : 'Decks'}</span>
            <span className="dot-divider">•</span>
            <span><strong>{totalCards}</strong> {totalCards === 1 ? 'Card' : 'Cards'}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
