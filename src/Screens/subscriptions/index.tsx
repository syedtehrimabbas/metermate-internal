import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppImages} from '../../images';
import {hp} from '../../utils/Dimension';
import colors from '../../theme/colors';
import {AppFonts} from '../../fonts';
import {checkAndUpdateSubscription} from '../../utils/subscriotions.ts';

export const SubscriptionScreen = ({navigation}) => {
  const {subscription} = useSelector((state: any) => state.userInfo);
    const dispatch = useDispatch(); // Access dispatch
    const {
    activeSubscription = null,
    subscriptionHistory = [],
    isLoading = false, // Default to loading
    error = null,
  } = subscription;

  // Common benefits for both subscription types
  const subscriptionBenefits = [
    'Unlimited meter readings',
    'Priority support',
    'Advanced analytics',
    'Export functionality',
  ];

  // Format subscription data for display
  const getSubscriptionData = () => {
    if (!activeSubscription) {
      return {
        type: null,
        price: '',
        nextRenewal: '',
        benefits: ['Basic meter readings', 'Standard support'],
      };
    }

    const isYearly = activeSubscription === 'yearly';

    return {
      type: activeSubscription,
      price: isYearly ? 'Rs 51,060.00' : 'Rs 4,255.00',
      nextRenewal: getRenewalDate(),
      benefits: subscriptionBenefits,
    };
  };

  const getRenewalDate = () => {
    const activeSub = subscriptionHistory.find(
      sub =>
        (sub.productId === 'metermate_monthly' ||
          sub.productId === 'com.metermate.yearly') &&
        sub.status === 'active',
    );

    if (!activeSub) {
      return 'N/A';
    }

    const renewalDate = new Date(activeSub.purchaseTime);
    renewalDate.setMonth(
      renewalDate.getMonth() +
        (activeSub.productId.includes('yearly') ? 12 : 1),
    );

    return renewalDate.toLocaleDateString();
  };

  const subscriptionData = getSubscriptionData();

  if (isLoading) {
    return (
      <ImageBackground
        style={styles.container}
        source={AppImages.lines_vector}
        resizeMode={'cover'}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accentColor} />
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        style={styles.container}
        source={AppImages.lines_vector}
        resizeMode={'cover'}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load subscription data</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => dispatch(checkAndUpdateSubscription())}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      style={styles.container}
      source={AppImages.lines_vector}
      resizeMode={'cover'}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            resizeMode="contain"
            source={AppImages.ic_cross}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Your Subscription</Text>
        <View style={{width: 30}} />
      </View>

      {/* Subscription Card */}
      <View style={styles.subscriptionCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.planName}>
            {subscriptionData.type === 'yearly'
              ? 'Yearly Plan'
              : subscriptionData.type === 'monthly'
              ? 'Monthly Plan'
              : 'No Active Subscription'}
          </Text>
          {subscriptionData.type && (
            <>
              <Text style={styles.planPrice}>{subscriptionData.price}</Text>
              <Text style={styles.renewalText}>
                {subscriptionData.nextRenewal === 'N/A'
                  ? 'No active subscription'
                  : `Renews on ${subscriptionData.nextRenewal}`}
              </Text>
            </>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>
            {subscriptionData.type ? 'Plan Benefits:' : 'Basic Features:'}
          </Text>
          {subscriptionData.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Image
                source={AppImages.check_circle}
                style={styles.benefitIcon}
              />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
          {subscriptionData.type === 'yearly' && (
            <View style={styles.benefitItem}>
              <Image
                source={AppImages.check_circle}
                style={styles.benefitIcon}
              />
              <Text style={styles.benefitText}>
                20% discount compared to monthly
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() =>
            navigation.navigate('ChooseSubscriptionScreen', {
              returnToDashboard: true,
            })
          }>
            <Text style={[styles.buttonText, {color: colors.black}]}>
            {subscriptionData.type ? 'Change Plan' : 'Subscribe Now'}
          </Text>
        </Pressable>

        {/*{subscriptionData.type && (
          <Pressable
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => console.log('Manage subscription')}>
            <Text style={[styles.buttonText, {color: colors.black}]}>
              Manage Subscription
            </Text>
          </Pressable>
        )}*/}
      </View>

      {/* Additional Info */}
      <Text style={styles.infoText}>
        {subscriptionData.type
          ? 'Your subscription will automatically renew unless canceled at least 24 hours before the end of the current period.'
          : 'Upgrade to unlock premium features and capabilities.'}
      </Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(5),
    marginBottom: hp(3),
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: colors.black,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: AppFonts.general_regular,
    color: colors.black,
  },
  subscriptionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: hp(3),
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  planName: {
    fontSize: 22,
    fontFamily: AppFonts.inter_bold,
    color: colors.black,
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 28,
    fontFamily: AppFonts.inter_bold,
    color: colors.accentColor,
    marginBottom: 5,
  },
  renewalText: {
    fontSize: 14,
    fontFamily: AppFonts.general_regular,
    color: colors.textColorGrey,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightgrey,
    marginVertical: 15,
  },
  benefitsContainer: {
    marginBottom: 10,
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: AppFonts.inter_bold,
    color: colors.black,
    marginBottom: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    width: 18,
    height: 18,
    tintColor: colors.accentColor,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: AppFonts.general_regular,
    color: colors.textColor,
    flex: 1,
  },
  buttonContainer: {
    marginBottom: hp(3),
  },
  actionButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: colors.accentColor,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightgrey,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: AppFonts.inter_bold,
    color: colors.white,
  },
  infoText: {
    fontSize: 12,
    fontFamily: AppFonts.general_regular,
    color: colors.textColorGrey,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: AppFonts.inter_bold,
    color: colors.errorColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.accentColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontFamily: AppFonts.inter_bold,
    fontSize: 16,
  },
});

export default SubscriptionScreen;
