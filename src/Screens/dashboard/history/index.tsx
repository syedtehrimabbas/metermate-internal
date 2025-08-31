import React, {useCallback} from 'react';
import {ScrollView, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import AppContainer from '../../../components/AppContainer';
import {styles} from './styles';
import {useSearchHistory} from './hooks/useSearchHistory';
import FilterBar from './components/FilterBar';
import HistoryDateGroup from './components/HistoryDateGroup';
import {supabase} from '../../../utils/supabase.ts';

const SearchHistoryScreen = ({navigation}) => {
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
  const handleResultPress = useCallback(async (zipcode: any) => {
    console.log('Clicked zipcode:', zipcode);
    if (zipcode.provider_uuid == null) {
      console.error('Provider uuid is null');
    } else {
      const {data, error} = await supabase
        .from('energy_providers')
        .select('*')
        .eq('uuid', zipcode.provider_uuid)
        .single();
      if (error) {
        console.error('Error fetching provider:', error);
      } else {
        navigation.navigate('ProviderDetailsScreen', {provider: data});
      }
    }
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
            [...filteredData].reverse().map((historyItem, index) => (
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
