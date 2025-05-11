import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStack, AuthenticationStack, SplashStack} from '..';
import {useSelector} from 'react-redux';
import {headerOptions, navigatorOptions} from '../config';
import MeterMateEncryptedStorage from '../../LocalStorage';
import {updateUser} from '../../redux';
import {useDispatch} from 'react-redux';

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
    setTimeout(() => {
      setSplash(false);
      MeterMateEncryptedStorage.getItem(MeterMateEncryptedStorage.USER_KEY)
        .then(user => {
          if (user) {
            const jsonUser = JSON.parse(user);
            setUserDetails(jsonUser);
            dispatch(updateUser(user));
          } else {
            console.log('No user data found.');
          }
        })
        .catch(error => {
          console.error('Error retrieving user data:', error);
        });
    }, 3000);
  }, []);

  return (
    <NavigationContainer>
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
