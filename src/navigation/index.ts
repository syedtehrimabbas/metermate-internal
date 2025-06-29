import Splash from '../Screens/splash';
import SocialLogin from '../Screens/social_login';
import SignupScreen from '../Screens/signup';
import Dashboard from '../Screens/dashboard';
import LoginScreen from '../Screens/login';
import ChooseSubscriptionScreen from '../Screens/ChooseSubscription';
import PaymentCompletedScreen from '../Screens/PaymentCompleted';
import SearchElectricProviders from '../Screens/dashboard/searchproviders';
import MyProfileScreen from '../Screens/profile/MyProfile.tsx';
import EditProfileScreen from '../Screens/profile/edit_profile';
import ProviderDetailsScreen from '../Screens/dashboard/providerDetails';
import {SubscriptionScreen} from "../Screens/subscriptions";

const AuthenticationStack = {
  LoginScreen,
  SocialLogin,
  SignupScreen,
  ChooseSubscriptionScreen,
  PaymentCompletedScreen,
};
const AppStack = {
    Dashboard,
    SearchElectricProviders,
    MyProfileScreen,
    EditProfileScreen,
    ProviderDetailsScreen,
    ChooseSubscriptionScreen,
    SubscriptionScreen,
};

const SplashStack = {
    Splash,
};

const BottomStack = {
    // HomeSignals,
    // Settings,
    // Account,
};

export {SplashStack, AppStack, BottomStack, AuthenticationStack};
