import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DeckList } from './components/DeckList';
import { DeckModal } from './components/DeckModal';
import { DeckDetail } from './components/DeckDetail';
import { StudyMode } from './components/StudyMode';
import { SearchBar, DeckFilter } from './components/SearchBar';
import { Deck } from './types';
import { getDecks, addDeck, updateDeck, deleteDeck } from './utils/storage';
import { Plus } from 'lucide-react';
import './App.css';

export function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [activeStudyDeck, setActiveStudyDeck] = useState<Deck | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<DeckFilter>('all');

  useEffect(() => {
    // Load decks from localStorage
    const storedDecks = getDecks();
    setDecks(storedDecks);
  }, []);

  const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0);

  // Filtered decks computed in state without mutating original data
  const filteredDecks = decks.filter((deck) => {
    const matchesSearch = deck.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    if (!matchesSearch) return false;

    const cardCount = deck.cards ? deck.cards.length : 0;
    if (selectedFilter === 'empty') {
      return cardCount === 0;
    }
    if (selectedFilter === 'has_cards') {
      return cardCount > 0;
    }
    return true;
  });

  // Create Deck
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateDeck = (deckData: { name: string; description: string }) => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: deckData.name,
      description: deckData.description,
      cards: [],
      createdAt: Date.now(),
    };
    const updatedList = addDeck(newDeck);
    setDecks(updatedList);
    setIsCreateModalOpen(false);
  };

  // Open Deck Detail View
  const handleOpenDeckDetail = (deck: Deck) => {
    setSelectedDeck(deck);
  };

  // Update Deck (name, description, or cards)
  const handleUpdateDeck = (updatedDeck: Deck) => {
    const updatedList = updateDeck(updatedDeck);
    setDecks(updatedList);

    // Keep selectedDeck and activeStudyDeck synchronized
    if (selectedDeck?.id === updatedDeck.id) {
      setSelectedDeck(updatedDeck);
    }
    if (activeStudyDeck?.id === updatedDeck.id) {
      setActiveStudyDeck(updatedDeck);
    }
  };

  // Delete Deck with Confirmation
  const handleDeleteDeck = (deckId: string) => {
    const deckToDelete = decks.find((d) => d.id === deckId);
    if (!deckToDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the deck "${deckToDelete.name}"?\nThis will permanently delete the deck and all of its flashcards.`
    );

    if (confirmed) {
      const updatedList = deleteDeck(deckId);
      setDecks(updatedList);
      if (activeStudyDeck?.id === deckId) {
        setActiveStudyDeck(null);
      }
      if (selectedDeck?.id === deckId) {
        setSelectedDeck(null);
      }
    }
  };

  // Study Mode Actions
  const handleStartStudy = (deck: Deck) => {
    setActiveStudyDeck(deck);
  };

  const handleExitStudy = () => {
    setActiveStudyDeck(null);
  };

  const handleBackToDashboard = () => {
    setSelectedDeck(null);
  };

  return (
    <div className="app-container">
      <Navbar totalDecks={decks.length} totalCards={totalCards} />

      <main className="main-content">
        {/* View 1: Active Study Mode */}
        {activeStudyDeck ? (
          <StudyMode
            deck={activeStudyDeck}
            onBack={handleExitStudy}
            onDeckUpdated={handleUpdateDeck}
          />
        ) : selectedDeck ? (
          /* View 2: Deck Detail Page (Card Creation & Management) */
          <DeckDetail
            deck={selectedDeck}
            onBack={handleBackToDashboard}
            onUpdateDeck={handleUpdateDeck}
            onStartStudy={handleStartStudy}
          />
        ) : (
          /* View 3: Main Dashboard */
          <>
            <header className="dashboard-header">
              <h1 className="dashboard-title">Flashcard App</h1>
              <p className="dashboard-subtitle">
                Create custom flashcard decks, test your knowledge with active recall, and master any subject step-by-step.
              </p>
            </header>

            <section>
              <div className="section-header">
                <h2 className="section-title">Your Decks</h2>
                <button className="btn-primary" onClick={handleOpenCreateModal}>
                  <Plus size={18} />
                  Create New Deck
                </button>
              </div>

              {/* Search & Filter Controls */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />

              <DeckList
                decks={filteredDecks}
                onStudy={handleStartStudy}
                onEdit={handleOpenDeckDetail}
                onDelete={handleDeleteDeck}
                onCreateClick={handleOpenCreateModal}
              />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Flashcard App • Learn faster with active recall</p>
      </footer>

      {/* Create Deck Modal */}
      <DeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateDeck}
      />
    </div>
  );
}

export default App;
