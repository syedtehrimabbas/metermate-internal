import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../theme/colors';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchScreen from './search';
import {AppImages} from '../../images';
import {AppFonts} from '../../fonts';
import {scaledFontWidth} from '../../utils/AppUtils.js';
import SearchHistoryScreen from './history';
import {checkAndUpdateSubscription} from '../../utils/subscriotions.ts';
import {useDispatch} from 'react-redux';
import SearchElectricProviders from "./searchproviders";

const BottomTab = createBottomTabNavigator();

const Dashboard = () => {
  const navigation = useNavigation();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        await checkAndUpdateSubscription(dispatch);
      } catch (err) {
        console.error('Subscription check failed:', err);
      }
    };
    loadSubscription();
  }, [dispatch]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true);
        const subscriptionActive = true;
        setHasSubscription(subscriptionActive);

        if (!subscriptionActive) {
          navigation.navigate('ChooseSubscriptionScreen', {
            returnToDashboard: true,
          });
        }
      } catch (error) {
        console.error('Subscription check failed:', error);
        // Handle error - maybe redirect to subscription screen as fallback
        navigation.navigate('ChooseSubscriptionScreen', {
          returnToDashboard: true,
        });
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [navigation]);

  const TabIcon = ({focused, color, title, icon}) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'column',
            padding: 10,
            width: 60,
            height: 35,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: focused ? colors.white : colors.transparent,
          }}>
          <Image
            source={icon}
            style={{
              width: 24,
              height: 24,
              resizeMode: 'contain',
              tintColor: colors.black1,
            }}
          />
        </View>
        <Text
          style={{
            color: colors.black1,
            fontSize: scaledFontWidth(12),
            fontFamily: AppFonts.general_regular,
          }}>
          {title}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={colors.accentColor} />
      </View>
    );
  }

  if (!hasSubscription) {
    return null;
  }

  return (
    <BottomTab.Navigator
      backBehavior="none"
      screenOptions={{
        tabBarActiveTintColor: '#27282A',
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            display: 'flex',
            backgroundColor: colors.accentColor,
            height: 80,
            paddingTop: 20,
            borderTopWidth: 0.5,
            borderTopColor: 'rgba(60, 60, 67, 0.12)',
          },
        ],
        headerShown: false,
      }}>
      <BottomTab.Screen
        name="Search"
        component={SearchElectricProviders}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              color={color}
              title="Search"
              focused={focused}
              icon={AppImages.nav_search}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="History"
        component={SearchHistoryScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon
              color={color}
              title="History"
              focused={focused}
              icon={AppImages.nav_search_history}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default Dashboard;
