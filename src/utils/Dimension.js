import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';

export {hp, wp};

export const appWidth = Dimensions.get('window').width - 50;
