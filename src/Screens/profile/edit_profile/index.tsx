import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    check,
    request,
    openSettings,
    PERMISSIONS,
    RESULTS,
} from 'react-native-permissions';


import { AppImages } from '../../../images';
import { hp, wp } from '../../../utils/Dimension.js';
import { AppButton } from '../../../components/AppButton.js';
import colors from '../../../theme/colors.js';
import { scaledFontWidth } from '../../../utils/AppUtils.js';
import { AppFonts } from '../../../fonts';
import { AppInput } from '../../../components/AppInput.js';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../../utils/supabase.ts';
import { launchImageLibrary } from 'react-native-image-picker';
import AppContainer from '../../../components/AppContainer';
import { updateUser } from '../../../redux';
import { set } from 'date-fns';

type Props = {
    navigation: any;
};
const EditProfileScreen = ({ navigation }: Props) => {

    const { userObject } = useSelector((state: any) => state.userInfo);
    let userData = userObject || {};
    const [email, Email] = useState('');
    const [name, Name] = useState('');
    const [initialName, setInitialName] = useState(''); // To compare later
    const [isNameChanged, setIsNameChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, Password] = useState('Password');
    const [cpassword, cPassword] = useState('Password');
    const emailInputRef = useRef(null);
    const passwordIRef = useRef(null);
    const cPasswordIRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        userData = userObject || {};
        if (userData) {
            Name(userData.localUserData.name);
            setInitialName(userData.localUserData.name);
            Email(userData.localUserData.email);
        } else {
            console.log('No user object found');
        }
    }, [userData]);

    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [imageSource, setImageSource] = useState(!imageError && userData?.localUserData?.profile_photo
        ? { uri: userData.localUserData.profile_photo }
        : AppImages.user_placeholder_default);
    


    const requestAllPermissions = async () => {
        if (Platform.OS !== 'android') return true;

        const permissions = [];

        const isAndroid13OrHigher = Platform.Version >= 33;
        const isAndroid11OrHigher = Platform.Version >= 30;

        const storagePermission = isAndroid13OrHigher
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

        permissions.push(PERMISSIONS.ANDROID.CAMERA);
        permissions.push(storagePermission);

        if (isAndroid13OrHigher) {
            // Also ask for video and audio if needed
            if (PERMISSIONS.ANDROID.READ_MEDIA_VIDEO)
                permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
        }

        // Add MANAGE_EXTERNAL_STORAGE only if defined in the library
        if (isAndroid11OrHigher && PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE) {
            permissions.push(PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE);
        }

        //request one by one or all at once
        const statuses: Record<string, string> = {};
        for (const perm of permissions) {
            try {
                const result = await request(perm);
                statuses[perm] = result;
            } catch (error) {
                console.error(`Failed requesting permission ${perm}`, error);
                statuses[perm] = 'error';
            }
        }

        // const result = await requestMultiple(permissions);

        const allGranted = Object.values(statuses).every(status => status === RESULTS.GRANTED);

        if (!allGranted) {
            Alert.alert(
                'Permissions Needed',
                'Please grant all required permissions to continue using this feature.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => openSettings() },
                ]
            );
        }

        return allGranted;
    };

    const handleImagePicker = async () => {
        const hasPermission = await requestAllPermissions();
        if (!hasPermission) {
            Alert.alert('Permission denied', 'Storage permission is required to select an image.');
            return;
        }

        const response = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (response.didCancel || !response.assets || response.assets.length === 0) {
            return;
        }

        const bucketName = 'profiles';
        const imageAsset = response.assets[0];
        const fileName = `user_${userData.localUserData.id}_${Date.now()}.jpg`;
        const fileUri = imageAsset.uri;
        const fileType = imageAsset.type;

        // Converting image to blob (needed for supabase upload)
        const imageFile = {
            uri: fileUri,
            name: fileName,
            type: fileType
        };
        console.log('Image file:', imageFile);
        try {
            setLoading(true);
            // Upload image to Supabase storage
            const { data, error } = await supabase.storage
                .from(bucketName) // make sure this bucket exists
                .upload(userData.localUserData.id + '/' + fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: fileType,
                });

            if (error) {
                console.error('Error uploading image:', error);
                Alert.alert('Error', 'Failed to upload image. Please try again.');
                return;
            }
            // console.log('Image uploaded successfully:', data);

            // Get the public URL of the uploaded image
            const { data: publicUrlData } = await supabase.storage
                .from(bucketName)
                .getPublicUrl(data.path);
            if (!publicUrlData) {
                console.error('No public URL found for the uploaded image.');
                Alert.alert('Error', 'Failed to retrieve image URL. Please try again.');
                return;
            }
            const publicUrl = publicUrlData.publicUrl;

            handleProfileImageUpdate({ url: publicUrl });

        } catch (err) {
            console.error(err);
            Alert.alert('Error', err.message || 'Something went wrong.');
        }
    };


    const handleProfileUpdate = async () => {
        if (!isNameChanged) return;
        setLoading(true);

        const { data, error } = await supabase
            .from('user_profiles')
            .update({ name: name })
            .eq('id', userData.localUserData.id)
            .select()
            .single();

        if (error) {
            console.error('Failed to update name:', error.message);
            Alert.alert('Error', 'Failed to update name. Please try again.');
        } else {
            Alert.alert('Success', 'Name updated successfully.');
            console.log('Success update name:', data);

            const updatedUserObject = {
                ...userData,
                localUserData: data, // ✅ Create a new updated object
            };
            setInitialName(name);
            setIsNameChanged(false);

            userData = updatedUserObject; // Update the userData with the new name
            // Dispatch with updated session
            dispatch(updateUser(updatedUserObject));
        }
        setLoading(false);
    };

    const handleProfileImageUpdate = async ({url}) => {

        const { data, error } = await supabase
            .from('user_profiles')
            .update({ profile_photo: url })
            .eq('id', userData.localUserData.id)
            .select()
            .single();

        if (error) {
            console.error('Failed to update photo:', error.message);
            Alert.alert('Error', 'Failed to update photo. Please try again.');
        } else {
            // Alert.alert('Success', 'photo updated successfully.');
            console.log('Success update photo:', data);

            const updatedUserObject = {
                ...userData,
                localUserData: data, // ✅ Create a new updated object
            };
            setImageSource({ uri: url });

            userData = updatedUserObject; // Update the userData with the new name
            // Dispatch with updated session
            dispatch(updateUser(updatedUserObject));
        }
        setLoading(false);
    };

    return (
        <AppContainer
            loading={loading}
            children={
                <ImageBackground style={
                    styles.container
                } source={AppImages.lines_vector} resizeMode={'cover'}>
                    <ScrollView style={{ flex: 1, height: '100%' }} showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Pressable style={[styles.parent, { position: 'absolute', start: 0 }]} onPress={() => {
                                navigation.goBack();
                            }}>
                                <Image style={styles.icon} resizeMode="cover" source={AppImages.ic_cross} />
                            </Pressable>
                            <Text style={styles.editAccount}>{'Edit Account'}</Text>

                        </View>

                        <View style={{ alignSelf: 'center', marginTop: hp(10) }}>
                            <View style={styles.imageContainer}>
                                {imageLoading && !imageError && (
                                    <ActivityIndicator style={styles.loader} size="large" color="#888" />
                                )}
                                <Image
                                    style={styles.icon}
                                    resizeMode="cover"
                                    source={imageSource}
                                    onLoadStart={() => setImageLoading(true)}
                                    onLoadEnd={() => setImageLoading(false)}
                                    onError={() => {
                                        setImageLoading(false);
                                        // setImageError(true);
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    handleImagePicker();
                                }}
                            >
                                <Image
                                    style={{ width: 28, height: 28, resizeMode: 'contain', position: 'absolute', bottom: 0, right: 5 }}
                                    source={AppImages.ic_camera} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{userData.localUserData.name}</Text>

                        <View
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, alignSelf: 'center', marginBottom: hp(3) }}>
                            <Image style={styles.giftCardIcon} resizeMode="cover" source={AppImages.ic_gift} />
                            <Text style={styles.freeTrial}>{'Free Trial'}</Text>

                        </View>
                        <AppInput
                            placeholder={'Full Name'}
                            onChangeText={text => {
                                Name(text);
                                setIsNameChanged(text !== initialName);
                            }}
                            value={name}
                            keyboardType={'default'}
                            returnKeyType="next"
                            marginTop={10}
                            onSubmitEditing={() => emailInputRef.current?.focus()} // Move focus to email input
                        />

                        <AppInput
                            ref={emailInputRef} // Attach ref to the email input
                            placeholder={'Email'}
                            onChangeText={text => Email(text)}
                            value={email}
                            editable={false}
                            keyboardType={'email-address'}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordIRef.current?.focus()}
                        />
                        {/* <AppInput
                            ref={passwordIRef}
                            placeholder={'Password'}
                            onChangeText={text => Password(text)}
                            value={password}
                            keyboardType={'default'}
                            returnKeyType="next"
                            isPassword={true}
                            onSubmitEditing={() => cPasswordIRef.current?.focus()} // Move focus to email input
                        />

                        <AppInput
                            ref={cPasswordIRef}
                            placeholder={'Validate Password'}
                            onChangeText={text => cPassword(text)}
                            value={cpassword}
                            keyboardType={'default'}
                            returnKeyType="done"
                            isPassword={true}
                            onSubmitEditing={() => Keyboard.dismiss} // Move focus to email input
                        /> */}

                        <AppButton
                            onPress={() => {
                                handleProfileUpdate();
                            }}
                            width={wp(90)}
                            height={50}
                            label={'Save Changes'}
                            textColor={colors.black}
                            backgroundColor={isNameChanged ? colors.accentColor : colors.lightgrey}
                            isDisable={!isNameChanged}
                            styles={{ marginTop: hp(10) }} />
                    </ScrollView>

                </ImageBackground>
            }
        />
    );

};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '60%',
        backgroundColor: colors.white,
        flex: 1,
        overflow: 'hidden',
        padding: 20,
    },
    imageContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        borderRadius: 100,
        flex: 1,
        height: '100%',
        overflow: 'hidden',
        width: '100%',
        backgroundColor: 'rgba(151, 148, 148, 0.46)',
    },
    loader: {
        position: 'absolute',
        zIndex: 1,
    },
    parent: {
        height: 24,
        width: 24,
    },
    parentFlexBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        alignSelf: 'center',
        fontSize: scaledFontWidth(32),
        letterSpacing: -0.6,
        lineHeight: 34,
        fontWeight: '500',
        fontFamily: AppFonts.inter_regular,
        color: '#100607',
        textAlign: 'left',
        marginTop: hp(3),
    },
    editAccount: {
        fontSize: 20,
        letterSpacing: -0.4,
        lineHeight: 34,
        fontWeight: '500',
        fontFamily: AppFonts.inter_regular,
        color: colors.textColor,
        textAlign: 'center',
    },
    freeTrial: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '500',
        fontFamily: AppFonts.inter_regular,
        color: colors.textColor,
        textAlign: 'center',
    },
    giftCardIcon: {
        width: 24,
        height: 24,
    },
})
    ;
export default EditProfileScreen;
