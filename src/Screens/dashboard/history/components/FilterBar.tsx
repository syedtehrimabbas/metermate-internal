import React from 'react';
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import {styles} from '../styles';
import {FilterType} from '../types';

interface FilterBarProps {
  selectedFilter: FilterType;
  filterText: string;
  onFilterChange: (filter: FilterType) => void;
  onFilterTextChange: (text: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  filterText,
  onFilterChange,
  onFilterTextChange,
}) => {
  const filters: {id: FilterType; label: string}[] = [
    {id: 'date', label: 'By date'},
    {id: 'results', label: 'By results'},
    {id: 'text', label: 'Filter text'},
  ];

  return (
    <>
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterText,
              selectedFilter === filter.id && styles.activeFilter,
            ]}
            onPress={() => onFilterChange(filter.id)}>
            <Text
              style={{
                fontSize: 12,
                color:
                  selectedFilter === filter.id
                    ? '#000000'
                    : 'rgba(0, 0, 0, 0.5)',
              }}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedFilter === 'text' && (
        <TextInput
          placeholder="Enter text..."
          value={filterText}
          onChangeText={onFilterTextChange}
          style={styles.filterInput}
          placeholderTextColor="#aaa"
        />
      )}
    </>
  );
};

export default FilterBar;
