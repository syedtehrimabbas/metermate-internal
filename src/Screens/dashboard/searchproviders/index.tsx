import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppImages } from '../../../images';
import colors from '../../../theme/colors.js';
import Colors from '../../../theme/colors.js';
import { getScaledHeight, scaledFontWidth } from '../../../utils/AppUtils.js';
import { hp } from '../../../utils/Dimension.js';
import { AppFonts } from '../../../fonts';
import { supabase } from '../../../utils/supabase.ts';
import { getUserId } from '../../../LocalStorage/index.js';
import AppContainer from '../../../components/AppContainer';

const SearchElectricProviders = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [zipcodes, setZipcodes] = useState([]);
    const [filteredZipcodes, setFilteredZipcodes] = useState([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [providers, setProviders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);
    const dummyLogo = AppImages.dummy_company_logo_one; // Placeholder for logo path
    const [lastSelectedZipcode, setLastSelectedZipcode] = useState(''); // State to store the last selected zipcode
    const [loading, setLoading] = useState(false);

    // Fetch zip codes from Supabase
    useEffect(() => {
        const fetchZipcodes = async () => {
            const { data, error } = await supabase.from('provider_zipcodes').select('*');
            if (error) {
                console.error('Error fetching zip codes:', error);
            } else {
                setZipcodes(data);
                setFilteredZipcodes(data);
            }
        };

        fetchZipcodes();
    }, []);

    // Fetch energy providers from Supabase
    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true)
            const { data, error } = await supabase.from('energy_providers').select('*');
            if (error) {
                console.error('Error fetching energy providers:', error);
                setLoading(false)
            } else {
                setLoading(false)
                setProviders(data);
                setFilteredProviders(data);
            }
        };

        fetchProviders();
    }, []);

    const handleSearch = (text) => {
        setSearch(text);
        setDropdownVisible(true);

        if (text === '') {
            setFilteredZipcodes(zipcodes);
            setFilteredProviders(providers);
        } else {
            const filtered = zipcodes.filter((code) =>
                code.zipcode.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredZipcodes(filtered);

            // const filteredProviders = providers.filter((provider) =>
            //     filteredZipcodes.some((zipcode) => provider.uuid === zipcode.provider_uuid)
            // );
            // setFilteredProviders(filteredProviders);
        }
    };

    const handleZipcodeSelect = async (zipcode) => {
        setSearch(zipcode.zipcode);
        setDropdownVisible(false);

        // Filter providers based on the selected zip code
        const filtered = providers.filter((provider) =>
            provider.uuid.includes(zipcode.provider_uuid)
        );
        setFilteredProviders(filtered);

        // check if the selected zipcode is different from the last selected one
        if (lastSelectedZipcode !== zipcode.zipcode) {
            const userID = await getUserId();

            // If different, store the selected zipcode in the lastSelectedZipcode variable and also add in supabase for history
            const { error: insertError } = await supabase.from('zipcodes_history').insert([
                {
                    zipcode: zipcode.zipcode,
                    results: filtered.length,
                    user_id: userID,
                },
            ]);

            if (insertError) {
                console.error('Error saving zipcodes history:', insertError.message);
            }
            setLastSelectedZipcode(zipcode.zipcode);
        } else {
            console.log('Selected zipcode is the same as the last one. No action taken.');
        }
    };

    const clearSearch = () => {
        setSearch('');
        setFilteredProviders(providers);
        setFilteredZipcodes(zipcodes);
        setDropdownVisible(false);
    };


    const renderProvider = ({ item }) => (
        <TouchableOpacity>
            <TouchableOpacity style={styles.providerCard}
                onPress={() => navigation.navigate('ProviderDetailsScreen', { provider: item })}>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                }}>
                    <Image style={{ width: 50, height: 50, marginEnd: 15 }} source={dummyLogo} />
                    <View>
                        <Text style={styles.providerName}>{item.provider_name}</Text>
                        <Text style={styles.providerAbout}>{item.provider_type}</Text>
                    </View>
                </View>
                {/* Row One */}
                <View style={{ flexDirection: 'row', flex: 2, marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.providerAbout}>{'Average Electric Rate:'}</Text>
                        <Text style={[styles.providerName, { marginTop: 10 }]}>{item.avg_electric_rate}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.providerAbout}>{'Offers Net Metering:'}</Text>
                        <Text style={[styles.providerName, { marginTop: 10 }]}>{item.offers_net_metering}</Text>
                    </View>
                </View>

                {/* Row Two */}
                {/*
                <View style={{ flexDirection: 'row', flex: 2, marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.providerAbout}>{'Program Availability:'}</Text>
                        <Text style={[styles.providerName, { marginTop: 10 }]}>{item.programAvailability}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.providerAbout}>{'Impact on Energy Bills:'}</Text>
                        <Text style={[styles.providerName, { marginTop: 10 }]}>{item.impact}</Text>
                    </View>
                </View> */}

            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <AppContainer
            loading={loading}
            children={
                <View style={styles.container}>
                    <TouchableOpacity style={{
                        width: scaledFontWidth(24),
                        height: getScaledHeight(24),
                        marginBottom: hp(2),
                    }} onPress={() => {
                        navigation.goBack();
                    }}>
                        <Image source={AppImages.back_arrow} style={{
                            width: scaledFontWidth(24),
                            height: getScaledHeight(24),
                        }} />
                    </TouchableOpacity>

                    {/* Search Bar */}
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Zipcode"
                            value={search}
                            onChangeText={handleSearch}
                            onFocus={() => setDropdownVisible(true)}
                            onBlur={() => setDropdownVisible(false)} // Hide dropdown when input loses focus
                        />

                        <View style={[styles.searchBarChild, styles.searchPosition]}>
                            {search ? (
                                <Pressable onPress={clearSearch} style={styles.iconContainer}>
                                    <Image source={AppImages.ic_cross} style={styles.icon} />
                                </Pressable>
                            ) : (
                                <View style={styles.iconContainer}>
                                    <Image source={AppImages.nav_search} style={styles.icon} />
                                </View>
                            )}
                        </View>

                        {/* Dropdown for Zipcodes */}
                        {isDropdownVisible && filteredZipcodes.length > 0 && (
                            <View style={styles.dropdown}>
                                {filteredZipcodes.map((item) => (
                                    <TouchableOpacity
                                        key={item.zipcode}
                                        onPress={() => handleZipcodeSelect(item)}
                                        style={styles.dropdownItem}
                                    >
                                        <Text style={styles.dropdownText}>{item.zipcode}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {(filteredProviders && filteredProviders.length > 0) &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                            < Text
                                style={{
                                    fontSize: scaledFontWidth(15),
                                    lineHeight: 25,
                                    letterSpacing: -0.2,
                                    color: colors.black1,
                                    fontFamily: AppFonts.inter_bold,
                                }}>{'Zipcode Results'} <Text
                                    style={{
                                        fontSize: scaledFontWidth(12),
                                    }}>{String(filteredProviders.length).padStart(2, '0')}</Text>
                            </Text>
                        </View>
                    }
                    {(filteredProviders && filteredProviders.length === 0) && <View
                        style={{
                            width: 200,
                            height: 40,
                            backgroundColor: Colors.white,
                            borderRadius: 20,
                            alignSelf: 'center',
                            marginTop: hp(35),
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text style={[styles.providerName, {
                            color: '#EA4335',
                            fontFamily: AppFonts.inter_regular
                        }]}>{'Incorrect zipcode'}</Text>

                    </View>}


                    < FlatList
                        data={filteredProviders}
                        renderItem={renderProvider}
                        keyExtractor={(item) => item.uuid.toString()}
                        contentContainerStyle={styles.resultsContainer}
                    />

                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    searchBarContainer: {
        position: 'relative',
        zIndex: 10, // Ensure the dropdown overlaps other UI elements
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 12,
        height: 50,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textColorGrey,
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 12,
        height: 50,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    icon: {
        width: 22,
        height: 22,
    },
    dropdown: {
        position: 'absolute',
        top: 55, // Position below the search bar
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderRadius: 8,
        elevation: 5, // Add shadow for better visibility
        maxHeight: 145,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    dropdownText: {
        fontSize: 16,
        color: colors.textColor,
    },
    resultsContainer: {
        paddingBottom: 20,
    },
    providerCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 10,
    },
    providerName: {
        fontFamily: AppFonts.inter_bold,
        fontSize: scaledFontWidth(13),
        color: colors.textColor,
        fontWeight: '600',
        lineHeight: 18,
    },
    providerAbout: {
        fontFamily: AppFonts.general_regular,
        fontSize: scaledFontWidth(12),
        lineHeight: 16,
        color: colors.textColorGrey,
        fontWeight: '600',
    },
    searchPosition: {
        top: '50%',
        position: 'absolute',
    },
    searchBarChild: {
        marginTop: -26,
        right: 4,
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: colors.accentColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchElectricProviders;
