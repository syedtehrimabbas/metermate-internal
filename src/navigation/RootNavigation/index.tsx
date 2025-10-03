import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStack, AuthenticationStack, SplashStack} from '..';
import {useDispatch, useSelector} from 'react-redux';
import {headerOptions, navigatorOptions} from '../config';
import MeterMateEncryptedStorage from '../../LocalStorage';
import {updateUser} from '../../redux';

type RootStackParamList = {
  ResetPasswordScreen: {token?: string};
  // other screen params
};

const linking = {
  prefixes: ['metermate://', 'https://metermate.co'],
  config: {
    screens: {
      ResetPasswordScreen: {
        path: 'reset-password',
        parse: {
          token: (token: string) => token,
        },
        stringify: {
          token: (token: string) => token,
        },
      },
    },
  },
};
type Props = {};
const RootNav = createNativeStackNavigator();
const RootNavigation = (props: Props) => {
  const [isSplash, setSplash] = React.useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const dispatch = useDispatch();
  const {userObject} = useSelector((state: any) => state.userInfo);
  useEffect(() => {
    setUserDetails(userObject);
  }, [userObject]);

  React.useEffect(() => {
    MeterMateEncryptedStorage.getItem(MeterMateEncryptedStorage.USER_KEY)
      .then(user => {
        if (user) {
          setUserDetails(user);
          dispatch(updateUser(user));
        } else {
          console.log('No user data found.');
        }
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });
    setTimeout(() => {
      setSplash(false);
    }, 3000);
  }, []);

  return (
    <NavigationContainer
      linking={linking}>
      <RootNav.Navigator screenOptions={navigatorOptions}>
        {Object.entries({
          ...(isSplash
            ? SplashStack
            : userDetails && userDetails.access_token !== ''
            ? AppStack
            : AuthenticationStack),
        }).map(([name, component]) => {
          return (
            <RootNav.Screen
              key={name}
              name={name}
              component={component}
              options={headerOptions}
            />
          );
        })}
      </RootNav.Navigator>
    </NavigationContainer>
  );
};

export {RootNavigation};
