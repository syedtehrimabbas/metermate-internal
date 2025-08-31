import React, {useCallback} from 'react';
import {ScrollView, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import AppContainer from '../../../components/AppContainer';
import {styles} from './styles';
import {useSearchHistory} from './hooks/useSearchHistory';
import FilterBar from './components/FilterBar';
import HistoryDateGroup from './components/HistoryDateGroup';

const SearchHistoryScreen = () => {
  const {user} = useSelector((state: any) => state.userInfo.userObject);

  const {
    filteredData,
    loading,
    filterText,
    selectedFilter,
    setFilterText,
    setSelectedFilter,
    refreshHistory,
  } = useSearchHistory(user?.id);

  useFocusEffect(
    React.useCallback(() => {
      refreshHistory();
    }, [refreshHistory]),
  );

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter as any);
    if (filter !== 'text') {
      setFilterText('');
    }
  };
  const handleResultPress = useCallback((zipcode: string) => {
    console.log('Clicked zipcode:', zipcode);
    // We'll add navigation here in the next step
  }, []);
  return (
    <AppContainer loading={loading}>
      <ScrollView style={styles.container}>
        <Text style={styles.searchHistory}>Search history</Text>

        <FilterBar
          selectedFilter={selectedFilter}
          filterText={filterText}
          onFilterChange={handleFilterChange}
          onFilterTextChange={setFilterText}
        />
        {filteredData.length === 0 ? (
          <Text style={styles.emptyStateText}>No records found</Text>
        ) : (
          filteredData.map((historyItem, index) => (
            <HistoryDateGroup
              key={`${historyItem.date}-${index}`}
              historyItem={historyItem}
              onResultPress={handleResultPress}
            />
          ))
        )}
      </ScrollView>
    </AppContainer>
  );
};

export default SearchHistoryScreen;
