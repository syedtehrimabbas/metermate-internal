import React from 'react';
import {Platform, Text, TouchableOpacity} from 'react-native';
import colors from '../theme/colors';
import {AppFonts} from '../fonts';
import {getScaledHeight} from '../utils/AppUtils';

export const AppButton = ({
  label,
  onPress,
  backgroundColor,
  styles,
  height,
  width,
  textColor,
  borderRadius,
  isDisable, // New prop to disable the button
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisable}
      style={[
        {
          marginVertical: 15,
          borderRadius: borderRadius !== undefined ? borderRadius : 50,
          backgroundColor: backgroundColor,
          width: width !== undefined ? width : '80%',
          justifyContent: 'center',
          alignItems: 'center',
          height: height !== undefined ? height : 25,
          alignSelf: 'center',
          elevation: 1,
          shadowRadius: Platform.OS === 'ios' ? 2 : 15,
          shadowOffset: {width: 1, height: Platform.OS === 'ios' ? 2 : 13},
          opacity: isDisable ? 0.5 : 1,
        },
        styles,
      ]}>
      <Text
        style={[
          {
            color: textColor !== undefined ? textColor : colors.black,
            fontSize: getScaledHeight(14),
            fontFamily: AppFonts.general_regular,
            fontWeight: '500',
          },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
