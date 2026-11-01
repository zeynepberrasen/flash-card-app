import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DeckFilter } from '../types';
import { Colors, Radius, Spacing } from '../constants/theme';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  selectedFilter: DeckFilter;
  onFilterChange: (filter: DeckFilter) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}) => {
  const filters: { id: DeckFilter; label: string }[] = [
    { id: 'all', label: 'All Decks' },
    { id: 'has_cards', label: 'With Cards' },
    { id: 'empty', label: 'Empty' },
  ];

  return (
    <View style={styles.container}>
      {/* Input container */}
      <View style={styles.inputWrapper}>
        <Feather name="search" size={18} color={Colors.textLight} />
        <TextInput
          style={styles.input}
          placeholder="Search decks..."
          placeholderTextColor={Colors.textLight}
          value={searchTerm}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsRow}
      >
        {filters.map((f) => {
          const isSelected = selectedFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.filterPill,
                isSelected && styles.filterPillSelected,
              ]}
              onPress={() => onFilterChange(f.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isSelected && styles.filterPillTextSelected,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 15,
    color: Colors.text,
  },
  clearBtn: {
    padding: 4,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterPillTextSelected: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
});
