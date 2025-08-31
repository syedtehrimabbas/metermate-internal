import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles';
import {HistoryItem} from '../types';
import SearchResultItem from './SearchResultItem';

interface HistoryDateGroupProps {
  historyItem: HistoryItem;
  onResultPress: (zipcode: string) => void;
}

const HistoryDateGroup: React.FC<HistoryDateGroupProps> = ({historyItem,onResultPress}) => (
  <View>
    <Text style={styles.dateText}>{historyItem.date}</Text>
    {historyItem.results.map((result, idx) => (
      <SearchResultItem key={`${historyItem.date}-${idx}`} result={result} onPress={() => onResultPress(result.zipcode)} />
    ))}
  </View>
);

export default HistoryDateGroup;
