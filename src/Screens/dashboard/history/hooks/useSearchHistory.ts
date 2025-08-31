import {useState, useEffect, useCallback} from 'react';
import {supabase} from '../../../../utils/supabase';
import {format} from 'date-fns';
import {HistoryItem, FilterType} from '../types';

export const useSearchHistory = (userId: string) => {
  const [searchHistoryData, setSearchHistoryData] = useState<HistoryItem[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('date');

  const formatZipcodeHistory = useCallback((data: any[]): HistoryItem[] => {
    const grouped: Record<string, Array<{zipcode: string; resultCount: number}>> = {};

    data.forEach(item => {
      const dateKey = format(new Date(item.created_at), 'MMMM dd, yyyy');

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push({
        zipcode: item.zipcode,
        resultCount: item.results,
      });
    });

    return Object.keys(grouped).map(date => ({
      date,
      results: grouped[date],
    }));
  }, []);

  const fetchSearchHistory = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('zipcodes_history')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const formatted = formatZipcodeHistory(data || []);
      setSearchHistoryData(formatted);
      setFilteredData(formatted);
    } catch (error) {
      console.error('Error fetching search history:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, formatZipcodeHistory]);

  useEffect(() => {
    if (selectedFilter === 'text' && filterText) {
      const filteredByText = searchHistoryData
        .map(item => ({
          ...item,
          results: item.results.filter(result =>
            result.zipcode.includes(filterText),
          ),
        }))
        .filter(item => item.results.length > 0);
      setFilteredData(filteredByText);
    } else if (selectedFilter === 'date') {
      const sortedByDate = [...searchHistoryData].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      setFilteredData(sortedByDate);
    } else if (selectedFilter === 'results') {
      const sortedByResults = [...searchHistoryData].sort((a, b) => {
        const totalResultsA = a.results.reduce(
          (acc, item) => acc + item.resultCount,
          0,
        );
        const totalResultsB = b.results.reduce(
          (acc, item) => acc + item.resultCount,
          0,
        );
        return totalResultsB - totalResultsA;
      });
      setFilteredData(sortedByResults);
    } else {
      setFilteredData(searchHistoryData);
    }
  }, [selectedFilter, filterText, searchHistoryData]);

  return {
    filteredData,
    loading,
    filterText,
    selectedFilter,
    setFilterText,
    setSelectedFilter,
    refreshHistory: fetchSearchHistory,
  };
};
