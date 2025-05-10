import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppFonts } from '../../../fonts';
import colors from '../../../theme/colors.js';
import { scaledFontWidth } from '../../../utils/AppUtils.js';
import { supabase } from '../../../utils/supabase.ts';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getUserId } from '../../../LocalStorage/index.js';
import { format } from 'date-fns';
import AppContainer from '../../../components/AppContainer';
import { useFocusEffect } from '@react-navigation/native';

// SAMPLE DATA
// const searchHistoryData = [
//     {
//         date: 'August 04, 2024',
//         results: [
//             { zipcode: '10452', resultCount: 8 },
//             { zipcode: '10455', resultCount: 3 },
//         ],
//     },
//     {
//         date: 'August 06, 2024',
//         results: [
//             { zipcode: '10459', resultCount: 15 },
//             { zipcode: '10110', resultCount: 12 },
//             { zipcode: '10116', resultCount: 4 },
//             { zipcode: '10101', resultCount: 2 },
//         ],
//     },
// ];

const formatZipcodeHistory = (data) => {
    const grouped = {};

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
};

const SearchHistoryScreen = () => {
    const [filterText, setFilterText] = useState('');

    const [selectedFilter, setSelectedFilter] = useState('date'); // default selected filter
    const [searchHistoryData, setSearchHistoryData] = useState([]); // full raw formatted data
    const [filteredData, setFilteredData] = useState([]);   // store the filtered data
    const [loading, setLoading] = useState(false);
    // const [filteredData, setFilteredData] = useState(searchHistoryData); 

    // Using useFocusEffect to fetch data when the screen is focused every time
    useFocusEffect(
        useCallback(() => {
            const getZipcodeHistoryForUser = async () => {

                setLoading(true);
                const userID = await getUserId();
                const { data, error } = await supabase
                    .from('zipcodes_history')
                    .select('*')
                    .eq('user_id', userID);

                if (error) {
                    console.error('Error fetching zipcode history:', error);
                    return null;
                }

                const formatted = formatZipcodeHistory(data);
                setSearchHistoryData(formatted);
                setFilteredData(formatted);

                setLoading(false);
            };

            getZipcodeHistoryForUser();

            // Optional: cleanup or cancel logic if needed
            return () => { };
        }, [])
    );

    //Filteration code for text filter
    useEffect(() => {
        if (selectedFilter === 'text') {
            const filteredByText = searchHistoryData.map((item) => ({
                ...item,
                results: item.results.filter((result) =>
                    result.zipcode.includes(filterText)
                ),
            })).filter(item => item.results.length > 0);
            setFilteredData(filteredByText);
        }
    }, [filterText, selectedFilter, searchHistoryData]);
    

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);

        if (filter !== 'text') {
            setFilterText('');
        }

        if (filter === 'date') {
            // Sort By date: sort dates in descending order
            const sortedByDate = [...searchHistoryData].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            setFilteredData(sortedByDate);

            // By date: no change in the original data
            // setFilteredData(searchHistoryData);
        } else if (filter === 'results') {
            // Sort By results: sort results by the total number of results in descending order 
            const sortedByResults = [...searchHistoryData].sort((a, b) => {
                const totalResultsA = a.results.reduce((acc, item) => acc + item.resultCount, 0);
                const totalResultsB = b.results.reduce((acc, item) => acc + item.resultCount, 0);
                return totalResultsB - totalResultsA;
            });
            setFilteredData(sortedByResults);
        }
        // else if (filter === 'text') {
        //     // Filter by text: Example filtering by zip code containing '10' as text
        //     const filteredByText = searchHistoryData.map((item) => ({
        //         ...item,
        //         results: item.results.filter((result) => result.zipcode.includes('01')),
        //     })).filter(item => item.results.length > 0); // Remove empty dates
        //     setFilteredData(filteredByText);
        // }
    };
    return (
        <AppContainer
            loading={loading}
            children={
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
                    {selectedFilter === 'text' && (
                        <TextInput
                            placeholder="Enter text..."
                            value={filterText}
                            onChangeText={setFilterText}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: 8,
                                borderRadius: 6,
                                marginTop: 2,
                                marginBottom: 12,
                                color: colors.textColor,
                            }}
                            placeholderTextColor="#aaa"
                        />
                    )}

                    {filteredData.length === 0 ? (
                        <Text style={{ textAlign: 'center', color: '#555', marginTop: 30, fontSize: scaledFontWidth(15) }}>
                            No records found
                        </Text>
                    ) : (
                        filteredData.map((historyItem, index) => (
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
                        ))
                    )}
                </ScrollView>
            }
        />
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
