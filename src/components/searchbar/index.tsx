import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {AppFonts} from '../../fonts';
import {AppImages} from '../../images';
import {getScaledHeight} from '../../utils/AppUtils.js';
import colors from '../../theme/colors.js';
import SearchElectricProviders from '../../Screens/dashboard/searchproviders';

type Props = {
    navigation: any;
};
const SearchBar = ({navigation}: Props) => {

    return (
        <Pressable style={styles.searchBar} onPress={() => {
            navigation.navigate(SearchElectricProviders);
        }}>
            <Text style={[styles.searchZipCode, styles.searchPosition]}>Search Zip code</Text>
            <View style={[styles.searchBarChild, styles.searchPosition]}>
                <Image source={AppImages.nav_search} style={{width: 22, height: 22}} />
            </View>
        </Pressable>);
};

const styles = StyleSheet.create({
    searchPosition: {
        top: '50%',
        position: 'absolute',
    },
    searchZipCode: {
        marginTop: -10,
        left: 24,
        fontSize: 15,
        letterSpacing: -0.6,
        lineHeight: 21,
        fontFamily: AppFonts.general_regular,
        color: '#9f9b9c',
        textAlign: 'left',
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
    searchBar: {
        borderRadius: 16,
        backgroundColor: colors.white,
        width: '100%',
        height: getScaledHeight(60),
        marginTop: 10,
    },
});

export default SearchBar;
