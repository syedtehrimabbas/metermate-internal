import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import {AppImages} from '../../images';
import {getScaledHeight, scaledFontWidth} from '../../utils/AppUtils.js';
import {AppFonts} from '../../fonts';
import {hp, wp} from '../../utils/Dimension.js';
import {AppButton} from '../../components/AppButton.js';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  endConnection,
  getSubscriptions,
  initConnection,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestSubscription,
} from 'react-native-iap';
import {CommonActions} from '@react-navigation/native';

type FeatureProps = {
  title: string;
};

const FeatureRow: React.FC<FeatureProps> = ({title}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
      <Image
        style={styles.checkCircleIcon}
        resizeMode="contain"
        source={AppImages.check_circle}
      />
      <Text style={styles.featureName}>{title}</Text>
    </View>
  );
};

type PackageProps = {
  onPress: () => void;
  price: string;
  subtitle: string;
  type: string;
  selected: boolean;
};

const PackageItem: React.FC<PackageProps> = ({
  onPress,
  price,
  type,
  subtitle,
  selected,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.packageItemContainer,
          {backgroundColor: selected ? colors.accentColor : colors.white},
        ]}>
        <Image
          style={{
            width: 25,
            height: 25,
            alignSelf: 'flex-end',
            position: 'absolute',
            top: 35,
            right: 20,
          }}
          source={selected ? AppImages.green_check_box : AppImages.uncheck}
        />

        <Text style={styles.yearProMemberContainer}>
          <Text style={styles.text}>{price}</Text>
          <Text style={styles.yearProMember}>{subtitle}</Text>
        </Text>
        <Text style={styles.annualPlanOffers}>
          {type + ' plan offers you:'}
        </Text>
        <FeatureRow title={'Feature name thats included'} />
        <FeatureRow title={'Feature name thats included'} />
        <FeatureRow title={'Feature name thats included'} />
        <FeatureRow title={'Feature name thats included'} />
      </View>
    </TouchableOpacity>
  );
};

type ChooseSubscriptionScreenProps = {
  route?: {
    params?: {
      returnToDashboard?: boolean;
    };
  };
  navigation: any;
};

const ChooseSubscriptionScreen = ({
  route,
  navigation,
}: ChooseSubscriptionScreenProps) => {
  const shouldReturnToDashboard = route?.params?.returnToDashboard ?? false;
  const [selectedPackage, SelectPackage] = useState('annual');
  const paymentSheetRef = useRef();
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const productIds = {
    android: ['com.metermate.annual', 'metermate_monthly'],
    ios: ['com.metermate.annual', 'com.metermate.monthly'], // Added monthly for iOS
  };

  const yearlyData = {
    price: 180,
    subscriptionType: 'Yearly',
    description: 'Annual Subscription',
  };

  const monthlyData = {
    price: 20,
    subscriptionType: 'Monthly',
    description: 'Monthly Subscription',
  };

  const purchaseUpdateSubscription = useRef(null);
  const purchaseErrorSubscription = useRef(null);

  useEffect(() => {
    return cleanupSubscriptions;
  }, []);
  useEffect(() => {
    let isMounted = true;

    const initIAP = async () => {
      try {
        // Initialize connection
        await initConnection();

        // Get products
        const ids =
          Platform.OS === 'android' ? productIds.android : productIds.ios;
        console.log('Fetching products with IDs:', ids);

        const products = await getSubscriptions({skus: ids});

        if (isMounted) {
          if (products.length === 0) {
            setError('No products found - check your Store configuration');
          } else {
            setProductsData(products);
            console.log('Products loaded:', products);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(`Failed to load products: ${err.message}`);
          setIsLoading(false);
          console.error('IAP Error:', err);
        }
      }
    };

    initIAP();

    return () => {
      isMounted = false;
      endConnection();
    };
  }, []);
  // Set up listeners
  useEffect(() => {
    purchaseUpdateSubscription.current =
      purchaseUpdatedListener(handlePurchaseUpdate);
    purchaseErrorSubscription.current =
      purchaseErrorListener(handlePurchaseError);

    return () => {
      if (purchaseUpdateSubscription.current) {
        purchaseUpdateSubscription.current.remove();
        purchaseUpdateSubscription.current = null;
      }

      if (purchaseErrorSubscription.current) {
        purchaseErrorSubscription.current.remove();
        purchaseErrorSubscription.current = null;
      }
    };
  }, []);

  // Handle successful purchase
  const handlePurchaseUpdate = async purchase => {
    console.log('Purchase successful:', purchase);

    try {
      // Verify receipt on your server here if needed
      const receipt = purchase.transactionReceipt;

      // Close payment sheet
      paymentSheetRef.current?.close();

      if (shouldReturnToDashboard) {
        // Return directly to Dashboard
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Dashboard'}],
          }),
        );
      } else {
        navigation.navigate('PaymentCompletedScreen');
      }
    } catch (error) {
      console.error('Error handling purchase:', error);
    }
  };

  // Handle purchase errors
  const handlePurchaseError = error => {
    console.warn('Purchase error:', error);
    // Show error message to user if needed
  };

  const cleanupSubscriptions = () => {
    if (purchaseUpdateSubscription.current) {
      purchaseUpdateSubscription.current.remove();
      purchaseUpdateSubscription.current = null;
    }

    if (purchaseErrorSubscription.current) {
      purchaseErrorSubscription.current.remove();
      purchaseErrorSubscription.current = null;
    }
  };

  const handleGetProducts = useCallback(async () => {
    try {
      console.log('[IAP] Starting product fetch...');
      setIsLoading(true);
      setError(null);

      const ids =
        Platform.OS === 'android' ? productIds.android : productIds.ios;
      console.log('[IAP] Fetching products with IDs:', ids);

      const products = await getSubscriptions({skus: ids});
      console.log('[IAP] Received products:', products);

      if (products.length === 0) {
        const errorMsg = 'No products returned - check Store configuration';
        console.warn('[IAP]', errorMsg);
        setError(errorMsg);
        return;
      }

      setProductsData(products);
    } catch (error) {
      console.error('[IAP] Error:', error);
      setError(`Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [productIds]);

  // SUBSCRIPTION LOGIC (COMMENTED OUT FOR FUTURE USE)

  const requestYearlySubscription = async () => {
    try {
      if (productsData.length === 0) {
        console.warn('Products not loaded yet, fetching...');
        await handleGetProducts();
        if (productsData.length === 0) {
          console.warn('Still no products available after refresh');
          return;
        }
      }

      // Find the annual subscription (assuming it's the first one in the array)
      const subscription =
        productsData.find(
          p =>
            p.productId.includes('annual') ||
            p.productId === 'com.metermate.annual',
        ) || productsData[0]; // Fallback to first product if not found

      if (!subscription) {
        console.warn('Yearly subscription not found');
        return;
      }

      // For iOS, we might not need offerToken
      if (Platform.OS === 'ios') {
        await handleBuySubscription(subscription.productId);
      } else {
        const subscriptionOfferDetails =
          subscription.subscriptionOfferDetails?.[0];
        const offerToken = subscriptionOfferDetails?.offerToken;

        if (!offerToken) {
          console.warn('No offer token found');
          return;
        }
        await handleBuySubscription(subscription.productId, offerToken);
      }
    } catch (err) {
      console.warn('Subscription error', err);
      setError(`Failed to process subscription: ${err.message}`);
    }
  };

  const requestMonthlySubscription = async () => {
    try {
      if (productsData.length === 0) {
        console.warn('Products not loaded yet, fetching...');
        await handleGetProducts();
        if (productsData.length === 0) {
          console.warn('Still no products available after refresh');
          return;
        }
      }

      // Find the monthly subscription (assuming it's the second one in the array)
      const subscription = productsData.find(
        p =>
          p.productId.includes('monthly') ||
          p.productId === 'com.metermate.monthly',
      );

      if (!subscription) {
        console.warn('Monthly subscription not found');
        return;
      }

      // For iOS, we might not need offerToken
      if (Platform.OS === 'ios') {
        await handleBuySubscription(subscription.productId);
      } else {
        const subscriptionOfferDetails =
          subscription.subscriptionOfferDetails?.[0];
        const offerToken = subscriptionOfferDetails?.offerToken;

        if (!offerToken) {
          console.warn('No offer token found');
          return;
        }
        await handleBuySubscription(subscription.productId, offerToken);
      }
    } catch (err) {
      console.warn('Subscription error', err);
      setError(`Failed to process subscription: ${err.message}`);
    }
  };

  const handleBuySubscription = async (
    productId: string,
    offerToken?: string,
  ) => {
    try {
      console.log('Initiating purchase for product:', productId);

      const purchaseParams: any = {
        sku: productId,
      };

      // Only add subscriptionOffers for Android
      if (Platform.OS === 'android' && offerToken) {
        purchaseParams.subscriptionOffers = [
          {
            sku: productId,
            offerToken,
          },
        ];
      }

      await requestSubscription(purchaseParams);
    } catch (error) {
      let errorMessage = 'Failed to process purchase';

      if (error instanceof PurchaseError) {
        errorMessage = `[${error.code}]: ${error.message}`;
        console.log({message: errorMessage, error});
      } else {
        console.log({message: 'handleBuySubscription error', error});
      }

      setError(errorMessage);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.subscription}>Subscription</Text>
      <PackageItem
        onPress={() => {
          SelectPackage('annual');
        }}
        selected={selectedPackage === 'annual'}
        price={'$180'}
        type={'Annual'}
        subtitle={'/year Pro Member'}
      />

      <PackageItem
        onPress={() => {
          SelectPackage('monthly');
        }}
        selected={selectedPackage === 'monthly'}
        price={'$20'}
        type={'Monthly'}
        subtitle={'/month Basic member'}
      />

      <RBSheet
        ref={paymentSheetRef}
        height={hp(45)}
        closeOnDragDown={false}
        closeOnPressMask={true}
        draggable={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
            opacity: 1,
          },
          draggableIcon: {
            backgroundColor: colors.draggableIconColor,
          },
          container: {
            backgroundColor: colors.white,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 24,
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}>
        <View style={{backgroundColor: colors.white}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={[
                styles.paymentPlanText,
                {
                  textAlignVertical: 'center',
                  textAlign: 'center',
                },
              ]}>
              {`${
                selectedPackage === 'annual'
                  ? yearlyData.subscriptionType
                  : monthlyData.subscriptionType
              } plan offer`}
            </Text>

            <TouchableOpacity
              style={{
                width: scaledFontWidth(24),
                height: getScaledHeight(24),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                paymentSheetRef.current?.close();
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

          <Text style={styles.paymentPlanText1}>{`Are you sure to pay ${
            selectedPackage === 'annual' ? yearlyData.price : monthlyData.price
          }$ for ${
            selectedPackage === 'annual'
              ? yearlyData.description
              : monthlyData.description
          }`}</Text>

          <TouchableOpacity
            onPress={
              selectedPackage === 'annual'
                ? requestYearlySubscription
                : requestMonthlySubscription
            }
            style={{
              marginTop: 20,
              width: wp(50),
              height: 50,
              borderRadius: 100,
              backgroundColor: colors.white,
              elevation: 2,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Image
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
              source={
                Platform.OS === 'android' ? AppImages.google : AppImages.apple
              }
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                fontFamily: AppFonts.general_regular,
                color: colors.textColor,
                textAlign: 'center',
                marginStart: 10,
              }}>
              {Platform.OS === 'android' ? 'Google Pay' : 'Apple pay'}
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>

      {/*paymentSheetRef.current?.close();
        navigation.navigate(PaymentCompletedScreen);*/}
      {isLoading ? (
        <View style={{alignItems: 'center', padding: 20}}>
          <Text>Loading subscription options...</Text>
        </View>
      ) : error ? (
        <View style={{alignItems: 'center', padding: 20}}>
          <Text style={{color: 'red', marginBottom: 10}}>{error}</Text>
          <AppButton
            onPress={handleGetProducts}
            width={wp(90)}
            height={50}
            label={'Retry Loading Subscriptions'}
            textColor={colors.black}
            backgroundColor={colors.accentColor}
          />
        </View>
      ) : (
        <AppButton
          onPress={() => {
            if (productsData.length === 0) {
              setError('No subscription products available');
              return;
            }
            paymentSheetRef.current?.open();
          }}
          width={wp(90)}
          height={50}
          label={'Continue'}
          textColor={colors.black}
          backgroundColor={colors.accentColor}
          disabled={productsData.length === 0}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.inputbg,
    flex: 1,
    overflow: 'hidden',
    padding: 20,
  },
  packageItemContainer: {
    backgroundColor: colors.accentColor,
    minHeight: 100,
    borderRadius: 16,
    marginVertical: 16,
    padding: 24,
  },
  subscription: {
    fontSize: scaledFontWidth(26),
    letterSpacing: -0.6,
    lineHeight: 34,
    fontWeight: '600',
    marginTop: hp(2),
    fontFamily: AppFonts.general_regular,
    color: colors.textColor,
  },
  text: {
    fontSize: scaledFontWidth(34),
    fontWeight: '600',
  },
  yearProMember: {
    fontSize: scaledFontWidth(16),
    fontWeight: 'normal',
  },
  yearProMemberContainer: {
    lineHeight: 42,
    color: colors.textColor,
    textAlign: 'left',
    fontFamily: AppFonts.general_regular,
  },
  annualPlanOffers: {
    fontSize: scaledFontWidth(20),
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: AppFonts.general_regular,
    color: 'rgba(0, 0, 0, 0.8)',
    textAlign: 'left',
    marginVertical: 10,
  },
  checkCircleIcon: {
    width: 16,
    height: 16,
  },
  featureName: {
    fontSize: scaledFontWidth(13),
    lineHeight: 25,
    fontFamily: AppFonts.general_regular,
    color: colors.black,
    textAlign: 'left',
    marginStart: 10,
  },
  paymentPlanText: {
    alignSelf: 'stretch',
    fontSize: scaledFontWidth(26),
    letterSpacing: -0.6,
    lineHeight: 34,
    fontWeight: '500',
    fontFamily: AppFonts.general_regular,
    color: colors.textColor,
    textAlign: 'left',
  },
  paymentPlanText1: {
    alignSelf: 'stretch',
    fontSize: scaledFontWidth(16),
    marginTop: 10,
    letterSpacing: 0,
    lineHeight: 21,
    fontFamily: AppFonts.general_regular,
    color: colors.textColorGrey,
    textAlign: 'left',
    opacity: 0.8,
  },
});

export default ChooseSubscriptionScreen;
