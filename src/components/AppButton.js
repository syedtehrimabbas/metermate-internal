import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
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
            disabled={isDisable} // Conditionally disable the button
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
                    shadowOpacity: 0.5,
                    elevation: 1,
                    shadowRadius: 15,
                    /* Brand */
                    shadowOffset: {width: 1, height: 13},
                    opacity: isDisable ? 0.5 : 1, // Adjust opacity based on isDisable prop
                },
                styles,
            ]}
        >
            <Text
                style={[
                    {
                        color: textColor !== undefined ? textColor : colors.black,
                        fontSize: getScaledHeight(14),
                        fontFamily: AppFonts.general_regular,
                        fontWeight: 'bold',
                    },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

