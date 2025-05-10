import React from 'react';
import {Image, ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import {AppImages} from '../../../images';
import colors from '../../../theme/colors.js';
import {AppFonts} from '../../../fonts';
import {scaledFontWidth} from '../../../utils/AppUtils.js';
import SearchBar from '../../../components/searchbar';
import {useDispatch} from 'react-redux';
import {updateUser} from '../../../redux';
import MyProfileScreen from '../../profile/MyProfile.tsx';

type Props = {
    navigation: any;
};
const SearchScreen = ({navigation}: Props) => {
    const dispatch = useDispatch(); // Access dispatch

    return <ImageBackground style={
        styles.container
    } source={AppImages.lines_vector} resizeMode={'cover'}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable style={styles.parent} onPress={() => {
                navigation.navigate(MyProfileScreen);
            }}>
                <Image style={styles.icon} resizeMode="cover" source={AppImages.user_placeholder}/>
            </Pressable>
            <Pressable style={[styles.frameParent, styles.parentFlexBox]} onPress={() => {
                dispatch(updateUser(false)); // User is authenticated
            }}>
                <View style={[styles.logIn04Parent, styles.parentFlexBox]}>
                    <Image style={styles.logIn04Icon} resizeMode="cover" source={AppImages.logout}/>
                    <Text style={styles.userEmail}>{'logout'}</Text>
                </View>
            </Pressable>
        </View>
        <Text style={styles.findText}>Find</Text>
        <Text style={styles.electricProviderLabel}>Electric Provider</Text>
        <SearchBar navigation={navigation}/>
    </ImageBackground>;
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.accentColor,
        flex: 1,
        overflow: 'hidden',
        padding: 20,
    },
    icon: {
        borderRadius: 100,
        flex: 1,
        height: '100%',
        overflow: 'hidden',
        width: '100%',
    },
    parent: {
        height: 48,
        width: 48,
    },
    parentFlexBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logIn04Icon: {
        width: 24,
        height: 24,
        overflow: 'hidden',
    },
    userEmail: {
        fontSize: 13,
        letterSpacing: 0,
        lineHeight: 20,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        color: '#000',
        textAlign: 'left',
    },
    logIn04Parent: {
        width: 63,
        flexDirection: 'row',
        gap: 6,
    },
    frameParent: {
        borderRadius: 118,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        width: 120,
        paddingHorizontal: 15,
        paddingVertical: 12,
        overflow: 'hidden',
    },
    findText: {
        fontSize: scaledFontWidth(13),
        letterSpacing: 0,
        lineHeight: 20,
        fontFamily: AppFonts.general_regular,
        color: colors.textColor,
        textAlign: 'left',
        marginTop: 20,
    },
    electricProviderLabel: {
        fontSize: scaledFontWidth(28),
        letterSpacing: -0.6,
        lineHeight: 34,
        fontWeight: '500',
        fontFamily: AppFonts.general_regular,
        color: colors.textColor,
        textAlign: 'left',
        marginTop: 10,
    },
});
export default SearchScreen;
