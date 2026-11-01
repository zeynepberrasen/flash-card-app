import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export type DeckFilter = 'all' | 'empty' | 'has_cards';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: DeckFilter;
  onFilterChange: (filter: DeckFilter) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="search-filter-container">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search decks by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Selector */}
      <div className="filter-select-wrapper">
        <Filter size={16} className="filter-icon" />
        <select
          className="filter-select"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value as DeckFilter)}
        >
          <option value="all">All decks</option>
          <option value="has_cards">Decks with cards</option>
          <option value="empty">Empty decks</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
