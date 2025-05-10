import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStack, AuthenticationStack, SplashStack} from '..';
import {useSelector} from 'react-redux';
import {headerOptions, navigatorOptions} from '../config';
import {Preferences} from '../../LocalStorage';
import PreferencesKeys from '../../LocalStorage/PreferencesKeys.js';

type Props = {};
const RootNav = createNativeStackNavigator();
const RootNavigation = (props: Props) => {
    const [isSplash, setSplash] = React.useState(true);
    const {isAuthenticated} = useSelector((state: any) => state.userInfo);
    React.useEffect(() => {
        setTimeout(() => {
            Preferences._GetStoredData(PreferencesKeys.USER).then(data => {
                console.log('_GetStoredData', data);
                if (data !== null) {
                } else {
                }
            });
            setSplash(false);
        }, 3000);
    }, []);

    return (
        <NavigationContainer>
            <RootNav.Navigator screenOptions={navigatorOptions}>
                {Object.entries({
                    ...(isSplash ? SplashStack : isAuthenticated ? AppStack : AuthenticationStack),
                }).map(([name, component]) => {
                    return (
                        <RootNav.Screen key={name} name={name} component={component} options={headerOptions}/>
                    );
                })}
            </RootNav.Navigator>
        </NavigationContainer>
    );
};

export {RootNavigation};
