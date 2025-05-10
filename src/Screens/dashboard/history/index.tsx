import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppFonts} from '../../../fonts';
import colors from '../../../theme/colors.js';
import {scaledFontWidth} from '../../../utils/AppUtils.js';

const searchHistoryData = [
    {
        date: 'August 04, 2024',
        results: [
            {zipcode: '10452', resultCount: 8},
            {zipcode: '10455', resultCount: 3},
        ],
    },
    {
        date: 'August 06, 2024',
        results: [
            {zipcode: '10459', resultCount: 15},
            {zipcode: '10110', resultCount: 12},
            {zipcode: '10116', resultCount: 4},
            {zipcode: '10101', resultCount: 2},
        ],
    },
];

const SearchHistoryScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState('date'); // default selected filter
    const [filteredData, setFilteredData] = useState(searchHistoryData); // store the filtered data
    // Handle filter change
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);

        if (filter === 'date') {
            // By date: no change in the original data
            setFilteredData(searchHistoryData);
        } else if (filter === 'results') {
            // By results: sort results by the total number of results in descending order
            const sortedByResults = [...searchHistoryData].sort((a, b) => {
                const totalResultsA = a.results.reduce((acc, item) => acc + item.resultCount, 0);
                const totalResultsB = b.results.reduce((acc, item) => acc + item.resultCount, 0);
                return totalResultsB - totalResultsA;
            });
            setFilteredData(sortedByResults);
        } else if (filter === 'text') {
            // Filter by text: Example filtering by zip code containing '10' as text
            const filteredByText = searchHistoryData.map((item) => ({
                ...item,
                results: item.results.filter((result) => result.zipcode.includes('10')),
            })).filter(item => item.results.length > 0); // Remove empty dates
            setFilteredData(filteredByText);
        }
    };
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.searchHistory}>Search history</Text>

            {/* Filter Options */}
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => handleFilterChange('date')}>
                    <Text style={[styles.filterText, selectedFilter === 'date' && styles.activeFilter]}>
                        By date
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterChange('results')}>
                    <Text style={[styles.filterText, selectedFilter === 'results' && styles.activeFilter]}>
                        By results
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterChange('text')}>
                    <Text style={[styles.filterText, selectedFilter === 'text' && styles.activeFilter]}>
                        Filter text
                    </Text>
                </TouchableOpacity>
            </View>


            {filteredData.map((historyItem, index) => (
                <View key={index}>
                    <Text style={styles.dateText}>{historyItem.date}</Text>
                    {historyItem.results.map((resultItem, idx) => (
                        <View key={idx} style={styles.resultItem}>
                            <Text style={styles.zipcodeText}>Zipcode <Text
                                style={{
                                    color: colors.textColor,
                                    fontFamily: AppFonts.inter_regular
                                }}>{resultItem.zipcode}</Text></Text>
                            <Text style={styles.zipcodeText}>Results <Text
                                style={{
                                    color: colors.textColor,
                                    fontFamily: AppFonts.inter_regular
                                }}>{String(resultItem.resultCount).padStart(2, '0')}</Text></Text>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F6F7F3',
            padding: 16,
        },
        searchHistory: {
            fontSize: scaledFontWidth(28),
            letterSpacing: -0.6,
            lineHeight: 34,
            fontWeight: '500',
            fontFamily: AppFonts.inter_regular,
            color: colors.textColor,
        },
        filterContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 16,
            width: '70%',
        },
        filterText: {
            fontFamily: AppFonts.general_regular,
            color: 'rgba(0, 0, 0, 0.5)',
            fontSize: scaledFontWidth(12),
            padding: 10,
            borderRadius: 100,
            backgroundColor: 'rgba(233, 233, 233, 0.3)',
        },
        activeFilter: {
            fontFamily: AppFonts.inter_regular,
            backgroundColor: colors.accentColor,
            borderRadius: 100,
            color: colors.textColor,
        },
        dateText: {
            fontFamily: AppFonts.inter_regular,
            fontSize: scaledFontWidth(16),
            color: colors.textColor,
            marginVertical: 8,
        },
        resultItem:
            {
                borderRadius: 16,
                backgroundColor:
                    '#fff',
                flex:
                    1,
                width:
                    '100%',
                height:
                    56,
                padding:
                    12,
                flexDirection:
                    'row',
                justifyContent:
                    'space-between',
                alignItems:
                    'center',
                marginBottom:
                    10,
            }
        ,
        zipcodeText: {
            fontFamily: AppFonts.general_regular,
            fontSize:
                scaledFontWidth(14),
            color:
                'rgba(0, 0, 0, 0.7)',
        }
    })
;

export default SearchHistoryScreen;
