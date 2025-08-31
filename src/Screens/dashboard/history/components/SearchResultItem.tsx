import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../styles';
import {SearchResult} from '../types';

interface SearchResultItemProps {
  result: SearchResult;
  onPress: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({result,onPress}) => (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.resultItem}>
            <Text style={styles.zipcodeText}>
                Zipcode{' '}
                <Text style={styles.resultText}>
                    {result.zipcode}
                </Text>
            </Text>
            <Text style={styles.zipcodeText}>
                Results{' '}
                <Text style={styles.resultText}>
                    {String(result.resultCount).padStart(2, '0')}
                </Text>
            </Text>
        </View>
    </TouchableOpacity>
);

export default SearchResultItem;
