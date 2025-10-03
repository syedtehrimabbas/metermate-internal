import React, {useRef, useState} from 'react';
import {
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
import {getScaledHeight, scaledFontWidth} from '../../utils/AppUtils.js';
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
import {updateUser} from '../../redux';

type Props = {
  navigation: any;
};
const SignupScreen = ({navigation}: Props) => {
  const [email, Email] = useState('');
  const [name, Name] = useState('');
  const [password, Password] = useState('');
  const [cpassword, cPassword] = useState('');
  const [promoCode, setPromoCode] = useState<string | undefined>('');
  const [promoCodeError, setPromoCodeError] = useState<string>('');
  const [isTermsAccepted, acceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickedImage, setPickedImage] = useState<Asset | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState(
    !imageError && '' ? {uri: ''} : AppImages.signup_image_ph,
  );
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    cpassword?: string;
  }>({});

  const emailInputRef = useRef(null);
  const passwordIRef = useRef(null);
  const cPasswordIRef = useRef(null);
  const promoRef = useRef(null);
  const dispatch = useDispatch();

  const requestAllPermissions = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

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
      if (PERMISSIONS.ANDROID.READ_MEDIA_VIDEO) {
        permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
      }
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
    setImageSource({uri: imageAsset.uri});
  };

  const validateForm = () => {
    Keyboard.dismiss();
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      cpassword?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
      isValid = false;
    } else if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    } else if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (password.length >= 6 && password !== cpassword) {
      newErrors.cpassword = 'Passwords do not match';
      isValid = false;
    } else if (!isTermsAccepted) {
      isValid = false;
      Alert.alert('Please accept the terms and conditions');
    }
    setErrors(newErrors);
    return isValid;
  };

  async function signUpWithEmail() {
    if (!validateForm()) {
      return;
    }
    if (promoCode && promoCode.trim() !== '') {
      setLoading(true);
      setPromoCodeError('');
      if (promoCode.length > 20) {
        setPromoCodeError('Promo code is too long.');
        setLoading(false);
        return;
      }
      // Check if promo code exists in the database (case-insensitive)
      const {data: promoCodeData, error: promoError} = await supabase
        .from('promo-codes')
        .select('promo_code')
        .ilike('promo_code', promoCode.toLowerCase())
        .maybeSingle();
      // If there's an error or no data found
      if (promoError || !promoCodeData) {
        setLoading(false);
        setPromoCodeError('Invalid promo code. Please check and try again.');
        return;
      }
    }
    setLoading(true);
    try {
      setLoading(true);

      const {data, error} = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrors({email: error.message});
        return;
      }

      const {user, session} = data;

      if (!user) {
        Alert.alert('Error', 'User creation failed');
        return;
      }

      if (pickedImage) {
        try {
          const imageUrl = await uploadProfileImage(user, session);

          if (imageUrl) {
            const localUserData = {
              id: user.id,
              name,
              email,
              promo_code: promoCode,
              profile_photo: imageUrl,
            };

            const {error: insertError} = await supabase
              .from('user_profiles')
              .insert([localUserData]);

            if (insertError) {
              Alert.alert('Error saving user data', insertError.message);
              return;
            }

            session.localUserData = localUserData;
            dispatch(updateUser(session));
            // navigation.navigate('ChooseSubscriptionScreen', { returnToDashboard: false });
          } else {
            await storeUserDataWithoutImage(user, session);
          }
        } catch (uploadErr) {
          console.error('Error uploading profile image:', uploadErr);
          await storeUserDataWithoutImage(user, session);
        }
      } else {
        await storeUserDataWithoutImage(user, session);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Unexpected error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
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
      const {data, error} = await supabase.storage
        .from(bucketName)
        .upload(user.id + '/' + fileName, imageFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: fileType,
        });

      if (error) {
        console.error('Error uploading image:', error);
        return;
      }
      const {data: publicUrlData} = await supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      if (!publicUrlData) {
        console.error('No public URL found for the uploaded image.');
        return;
      }
      const publicUrl = publicUrlData.publicUrl;
      console.log('Image public URL:', publicUrl);
      return publicUrl;
    } catch (err) {
      console.error(err);
      return null;
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: scaledFontWidth(26),
                    letterSpacing: -0.6,
                    lineHeight: 34,
                    fontWeight: '500',
                    marginTop: 20,
                    fontFamily: AppFonts.general_regular,
                    color: colors.textColor,
                  }}>
                  {'Sign up'}
                </Text>
                <TouchableOpacity
                  style={{
                    width: scaledFontWidth(24),
                    height: getScaledHeight(24),
                  }}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Image
                    source={AppImages.ic_cross}
                    style={{
                      width: scaledFontWidth(24),
                      height: getScaledHeight(24),
                    }}
                  />
                </TouchableOpacity>
              </View>

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

              <TouchableWithoutFeedback
                onPress={() => {
                  handleImagePicker();
                }}>
                <View style={{alignSelf: 'center', marginVertical: 30}}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.icon}
                      resizeMode="cover"
                      source={imageSource}
                    />
                  </View>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                      position: 'absolute',
                      bottom: 10,
                      right: 5,
                    }}
                    source={AppImages.plus_icon}
                  />
                </View>
              </TouchableWithoutFeedback>
              <View style={{width: '100%'}}>
                <AppInput
                  placeholder={'Full Name'}
                  onChangeText={name => Name(name)}
                  value={name}
                  keyboardType={'default'}
                  returnKeyType="next"
                  marginTop={2}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  isError={errors.name}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>
              <View style={{width: '100%'}}>
                <AppInput
                  ref={emailInputRef}
                  placeholder={'Email'}
                  onChangeText={text => Email(text)}
                  value={email}
                  keyboardType={'email-address'}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordIRef.current?.focus()}
                  isError={errors.email}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
              <View style={{width: '100%'}}>
                <AppInput
                  ref={passwordIRef}
                  placeholder={'Password'}
                  onChangeText={text => Password(text)}
                  value={password}
                  keyboardType={'default'}
                  returnKeyType="next"
                  isPassword={true}
                  onSubmitEditing={() => cPasswordIRef.current?.focus()}
                  isError={errors.password}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>
              <View style={{width: '100%'}}>
                <AppInput
                  ref={cPasswordIRef}
                  placeholder={'Validate Password'}
                  onChangeText={text => cPassword(text)}
                  value={cpassword}
                  keyboardType={'default'}
                  returnKeyType="next"
                  isPassword={true}
                  onSubmitEditing={() => promoRef.current?.focus()}
                  isError={errors.cpassword}
                />
                {errors.cpassword && (
                  <Text style={styles.errorText}>{errors.cpassword}</Text>
                )}
              </View>

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
              <View style={{width: '100%'}}>
                <AppInput
                  ref={promoRef}
                  value={promoCode}
                  placeholder="Promo Code (Optional)"
                  isError={promoCodeError}
                  errorStyle={{color: 'red', fontSize: 12, marginTop: 5}}
                  onChangeText={text => {
                    setPromoCode(text);
                    if (promoCodeError) {
                      setPromoCodeError('');
                    }
                  }}
                  keyboardType={'default'}
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                {promoCodeError && (
                  <Text style={styles.errorText}>{promoCodeError}</Text>
                )}
              </View>

              {/* Privacy policy section */}
              <TouchableOpacity
                onPress={() => {
                  acceptTerms(!isTermsAccepted);
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginVertical: 20,
                }}>
                <View
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
                  }}>
                  {isTermsAccepted && (
                    <Image
                      style={{
                        width: 10,
                        height: 10,
                        resizeMode: 'contain',
                      }}
                      source={AppImages.white_check}
                    />
                  )}
                </View>
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
              </TouchableOpacity>

              <AppButton
                onPress={signUpWithEmail}
                width={wp(85)}
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
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  imageContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 50,
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(151, 148, 148, 0.46)',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
});
export default SignupScreen;
