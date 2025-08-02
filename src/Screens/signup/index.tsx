import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import {AppFonts} from '../../fonts';
import {AppImages} from '../../images';
import {AppInput} from '../../components/AppInput.js';
import {scaledFontWidth} from '../../utils/AppUtils.js';
import {AppButton} from '../../components/AppButton.js';
import {wp} from '../../utils/Dimension.js';
import {supabase} from '../../utils/supabase.ts';
import AppContainer from '../../components/AppContainer';
import {useDispatch} from 'react-redux';
import {
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {updateUser} from "../../redux";

type Props = {
  navigation: any;
};
const SignupScreen = ({navigation}: Props) => {
  const [email, Email] = useState('');
  const [name, Name] = useState('');
  const [password, Password] = useState('');
  const [cpassword, cPassword] = useState('');
  const [promoCode, PromoCode] = useState<string | undefined>();
  const [isTermsAccepted, acceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickedImage, setPickedImage] = useState<Asset | null>(null);
  // const [profileImage, setProfileImage] = useState<string | undefined>();

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState(
    !imageError && '' ? {uri: ''} : AppImages.signup_image_ph,
  );

  const emailInputRef = useRef(null);
  const passwordIRef = useRef(null);
  const cPasswordIRef = useRef(null);
  const promoRef = useRef(null);
  const dispatch = useDispatch();

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

    const allGranted = Object.values(statuses).every(
      status => status === RESULTS.GRANTED,
    );

    if (!allGranted) {
      Alert.alert(
        'Permissions Needed',
        'Please grant all required permissions to continue using this feature.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings()},
        ],
      );
    }

    return allGranted;
  };

  const handleImagePicker = async () => {
    const hasPermission = await requestAllPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Storage permission is required to select an image.',
      );
      return;
    }

    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    if (
      response.didCancel ||
      !response.assets ||
      response.assets.length === 0
    ) {
      return;
    }

    const bucketName = 'profiles';
    const imageAsset = response.assets[0];

    setPickedImage(imageAsset);
    // setProfileImage(imageAsset.uri);
    setImageSource({uri: imageAsset.uri});
  };

  async function signUpWithEmail() {
    // Validate name
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    // Validate password
    if (password.length < 8) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 8 characters long.',
      );
      return;
    }

    // Validate confirm password
    if (password !== cpassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    // Optional: Validate promo code (if required)
    if (promoCode && promoCode.length > 20) {
      Alert.alert('Validation Error', 'Promo code is too long.');
      return;
    }

    setLoading(true);
    // console.log('Starting SignUp ...');
    await supabase.auth
      .signUp({
        email: email,
        password: password,
      })
      .then(async response => {
        const {user, session} = response.data;

        if (user) {
          // console.log('Continue, user is valid');
          if (pickedImage) {
            // If an image is picked, upload it
            await uploadProfileImage(user, session)
              .then(async imageUrl => {
                if (imageUrl) {
                  // If image upload is successful, store user data
                  const localUserData = {
                    id: user.id,
                    name: name,
                    email: email,
                    promo_code: promoCode,
                    profile_photo: imageUrl, // Use the uploaded image URL
                  };
                  const {error: insertError} = await supabase
                    .from('user_profiles')
                    .insert([localUserData]);

                  if (insertError) {
                    Alert.alert('Error saving user data:', insertError.message);
                  } else {
                    // User data saved successfully
                    session.localUserData = localUserData;

                    // console.log('localUserData found with image:', localUserData);
                    dispatch(updateUser(session));
                    // navigation.navigate('ChooseSubscriptionScreen', {
                    //   returnToDashboard: false,
                    // });
                  }
                } else {
                  //if failed to upload image or retrieve image URL
                  await storeUserDataWithoutImage(user, session);
                }
              })
              .catch(async error => {
                console.error('Error uploading profile image:', error);
                // Alert.alert('Error uploading profile image:', error.message);
                await storeUserDataWithoutImage(user, session);
              });
          } else {
            // If no image is picked
            await storeUserDataWithoutImage(user, session);
          }
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const uploadProfileImage = async (user, session) => {
    if (!pickedImage) {
      Alert.alert('No image selected', 'Please select an image to upload.');
      return;
    }
    const bucketName = 'profiles';
    const imageAsset = pickedImage;

    const fileName = `user_new_${Date.now()}.jpg`;
    const fileUri = imageAsset.uri;
    const fileType = imageAsset.type;

    // Converting image to blob (needed for supabase upload)
    const imageFile = {
      uri: fileUri,
      name: fileName,
      type: fileType,
    };
    console.log('Image file:', imageFile);

    try {
      // Upload image to Supabase storage
      const {data, error} = await supabase.storage
        .from(bucketName) // make sure this bucket exists
        .upload(user.id + '/' + fileName, imageFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: fileType,
        });

      if (error) {
        console.error('Error uploading image:', error);
        // Alert.alert('Error', 'Failed to upload image. Please try again.');
        return;
      }
      // console.log('Image uploaded successfully:', data);

      // Get the public URL of the uploaded image
      const {data: publicUrlData} = await supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      if (!publicUrlData) {
        console.error('No public URL found for the uploaded image.');
        // Alert.alert('Error', 'Failed to retrieve image URL. Please try again.');
        return;
      }
      const publicUrl = publicUrlData.publicUrl;
      console.log('Image public URL:', publicUrl);
      // Return the public URL of the uploaded image
      return publicUrl;
    } catch (err) {
      console.error(err);
      // Alert.alert('Error', err.message || 'Something went wrong.');
      return null; // Return null if there was an error
    }
  };

  const storeUserDataWithoutImage = async (user, session) => {
    // Insert additional user data into the 'users' table
    const localUserData = {
      id: user.id,
      name: name,
      email: email,
      promo_code: promoCode,
      profile_photo: '',
    };
    const {error: insertError} = await supabase
      .from('user_profiles')
      .insert([localUserData]);

    if (insertError) {
      Alert.alert('Error saving user data:', insertError.message);
    } else {
      // User data saved successfully
      session.localUserData = localUserData;

      // console.log('localUserData found no image:', localUserData);
      dispatch(updateUser(session));

      // navigation.navigate('ChooseSubscriptionScreen', {
      //   returnToDashboard: false,
      // });
    }
  };

  return (
    <AppContainer
      loading={loading}
      children={
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled">
              <Text
                style={{
                  fontSize: scaledFontWidth(26),
                  letterSpacing: -0.6,
                  lineHeight: 34,
                  marginTop: 20,
                  fontWeight: '500',
                  fontFamily: AppFonts.general_regular,
                  color: colors.textColor,
                }}>
                {'Sign up'}
              </Text>

              <Text
                style={{
                  fontSize: scaledFontWidth(14),
                  letterSpacing: 0,
                  lineHeight: 21,
                  fontFamily: AppFonts.general_regular,
                  color: '#000',
                  opacity: 0.8,
                }}>
                {'Enter your details for sign up.'}
              </Text>

              <View style={{alignSelf: 'center', marginVertical: 30}}>
                <View style={styles.imageContainer}>
                  {imageLoading && !imageError && (
                    <ActivityIndicator
                      style={styles.loader}
                      size="large"
                      color="#888"
                    />
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
                  }}>
                  <Image
                    style={{
                      width: 28,
                      height: 28,
                      resizeMode: 'contain',
                      position: 'absolute',
                      bottom: 0,
                      right: 5,
                    }}
                    source={AppImages.ic_camera}
                  />
                </TouchableOpacity>
              </View>

              <AppInput
                placeholder={'Full Name'}
                onChangeText={name => Name(name)}
                value={name}
                keyboardType={'default'}
                returnKeyType="next"
                marginTop={2}
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <AppInput
                ref={emailInputRef}
                placeholder={'Email'}
                onChangeText={text => Email(text)}
                value={email}
                keyboardType={'email-address'}
                returnKeyType="next"
                onSubmitEditing={() => passwordIRef.current?.focus()}
              />

              <AppInput
                ref={passwordIRef}
                placeholder={'Password'}
                onChangeText={text => Password(text)}
                value={password}
                keyboardType={'default'}
                returnKeyType="next"
                isPassword={true}
                onSubmitEditing={() => cPasswordIRef.current?.focus()}
              />

              <AppInput
                ref={cPasswordIRef}
                placeholder={'Validate Password'}
                onChangeText={text => cPassword(text)}
                value={cpassword}
                keyboardType={'default'}
                returnKeyType="next"
                isPassword={true}
                onSubmitEditing={() => promoRef.current?.focus()}
              />

              <Text
                style={{
                  marginVertical: 10,
                  fontSize: scaledFontWidth(12),
                  lineHeight: 22,
                  fontWeight: '500',
                  fontFamily: AppFonts.general_regular,
                  color: colors.black,
                  textAlign: 'left',
                }}>
                {'Promo Code (Optional)'}
              </Text>

              <AppInput
                ref={promoRef}
                placeholder={'Metermate 10%'}
                onChangeText={text => PromoCode(text)}
                value={promoCode}
                keyboardType={'default'}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              {/* Privacy policy section */}
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: isTermsAccepted
                      ? colors.black
                      : colors.white,
                    borderColor: colors.black,
                    borderWidth: 1,
                    width: 17,
                    height: 17,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginEnd: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    acceptTerms(!isTermsAccepted);
                  }}>
                  <Image
                    style={{
                      width: 10,
                      height: 10,
                      resizeMode: 'contain',
                      tintColor: isTermsAccepted ? colors.white : colors.black,
                    }}
                    source={AppImages.white_check}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: scaledFontWidth(11),
                    lineHeight: 18,
                    fontFamily: AppFonts.inter_regular,
                    color: '#585757',
                    textAlign: 'center',
                  }}>
                  {'I agree with'}
                  <Text style={{color: colors.black}}>{' Terms'}</Text>
                  <Text>{' and'}</Text>
                  <Text style={{color: colors.black}}>{' Privacy'}</Text>
                </Text>
              </View>

              <AppButton
                onPress={() => {
                  if (isTermsAccepted) {
                    signUpWithEmail();
                  } else {
                    Alert.alert('Please accept the terms and conditions');
                  }
                }}
                width={wp(90)}
                height={50}
                label={'Continue'}
                textColor={colors.black}
                backgroundColor={colors.accentColor}
              />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      }
    />
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Add some padding at the bottom
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
});
export default SignupScreen;
