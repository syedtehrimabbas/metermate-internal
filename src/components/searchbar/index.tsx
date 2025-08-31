import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {AppFonts} from '../../fonts';
import {AppImages} from '../../images';
import {getScaledHeight, scaledFontWidth} from '../../utils/AppUtils.js';
import colors from '../../theme/colors.js';
import SearchElectricProviders from '../../Screens/dashboard/searchproviders';

type Props = {
  navigation: any;
};
const SearchBar = ({navigation}: Props) => {
  return (
    <Pressable
      style={styles.searchBar}
      onPress={() => {
        navigation.navigate(SearchElectricProviders);
      }}>
      <Text style={[styles.searchZipCode]}>Search Zip code</Text>
      <View style={[styles.searchBarChild, {alignSelf: 'center'}]}>
        <Image source={AppImages.nav_search} style={{width: 22, height: 22}} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  searchZipCode: {
    fontSize: scaledFontWidth(14),
    letterSpacing: -0.6,
    fontFamily: AppFonts.general_regular,
    color: '#9F9B9C',
    textAlign: 'left',
    alignSelf: 'center',
  },
  searchBarChild: {
    width: scaledFontWidth(43),
    height: getScaledHeight(43),
    borderRadius: 14,
    backgroundColor: colors.accentColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    borderRadius: 16,
    backgroundColor: colors.white,
    height: getScaledHeight(50),
    marginVertical: 20,
    paddingEnd: 10,
    paddingStart: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SearchBar;
