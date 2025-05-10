import React from 'react';
import {Image, Text, View} from 'react-native';
import colors from '../../theme/colors';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchScreen from './search';
import {AppImages} from '../../images';
import {AppFonts} from '../../fonts';
import {scaledFontWidth} from '../../utils/AppUtils.js';
import SearchHistoryScreen from './history';

const BottomTab = createBottomTabNavigator();

const Dashboard = () => {

    const TabIcon = ({focused, color, title, icon}) => {
        return <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>

            <View style={{
                flexDirection: 'column',
                padding: 10,
                width: 60,
                height: 40,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? colors.white : colors.transparent,
            }}>
                <Image source={icon}
                       style={{
                           width: 24,
                           height: 24,
                           resizeMode: 'contain',
                           tintColor: colors.black1,
                       }}/>
            </View>

            <Text
                style={{
                    color: colors.black1,
                    fontSize: scaledFontWidth(12),
                    fontFamily: AppFonts.general_regular,
                }}>{title}</Text>
        </View>;
    };

    return (
        <BottomTab.Navigator
            shifting={true}
            backBehavior="none"
            activeColor={colors.white}
            inactiveColor={colors.black}
            tabBarOptions={{
                showLabel: false,
                activeTintColor: colors.black,
                tabBarStyle: {
                    backgroundColor: colors.accentColor, // Set background color to black
                    fontFamily: AppFonts.general_regular,
                },
            }}
            screenOptions={{
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: colors.accentColor,
                    height: 70,
                    borderTopWidth: 0.5,
                    borderTopColor: 'rgba(60, 60, 67, 0.12)',
                },
                headerShown: false,
                fontFamily: AppFonts.general_regular,
            }}>

            <BottomTab.Screen name={'Search'} component={SearchScreen}
                              options={{
                                  tabBarIcon: ({focused, color}) => (
                                      <TabIcon color={color} title={'Search'} focused={focused}
                                               icon={AppImages.nav_search}/>
                                  ),
                              }}
            />
            <BottomTab.Screen name={'History'} component={SearchHistoryScreen}
                              options={{
                                  tabBarIcon: ({focused, color}) => (
                                      <TabIcon color={color} title={'History'} focused={focused}
                                               icon={AppImages.nav_search_history}/>
                                  ),
                              }}/>
        </BottomTab.Navigator>
    );
};
export default Dashboard;
