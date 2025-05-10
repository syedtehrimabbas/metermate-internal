import {hp, wp} from '../utils/Dimension';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useState} from 'react';
import colors from '../theme/colors';
import {getScaledHeight, scaledFontWidth} from '../utils/AppUtils';
import {AppImages} from '../images';

export const AppInput = forwardRef(({
                                        value,
                                        onChangeText,
                                        placeholder,
                                        keyboardType,
                                        returnKeyType,
                                        isPassword,
                                        width,
                                        autoFocus = false,
                                        marginTop,
                                        onSubmitEditing,
                                        blurOnSubmit = false,
                                    }, ref) => {
    const [passwordVisible, PasswordVisible] = useState(isPassword);
    return (
        <View style={{
            backgroundColor: colors.inputbg,
            height: getScaledHeight(54),
            width: width ? width : wp(90),
            borderRadius: 15,
            padding: 5,
            paddingStart: 10,
            paddingEnd: 10,
            flexDirection: 'row',
            marginTop: marginTop ? marginTop : hp(1.5),
            alignItems: 'center',
            gap: 10,
        }}>
            <TextInput
                ref={ref} // Forward the ref to the TextInput
                style={{
                    height: getScaledHeight(40),
                    fontSize: scaledFontWidth(12),
                    width: width ? width - 25 : wp(80),
                    color: colors.inputColor,
                }}
                onChangeText={text => onChangeText(text)}
                placeholder={placeholder}
                placeholderTextColor={colors.inputColor}
                value={value}
                autoFocus={autoFocus}
                keyboardType={keyboardType}
                returnKeyType={returnKeyType}
                secureTextEntry={isPassword && passwordVisible}
                onSubmitEditing={onSubmitEditing} // Attach onSubmitEditing to TextInput
                blurOnSubmit={blurOnSubmit} // Ensures focus shifts instead of dismissing the keyboard
            />
            {isPassword && <TouchableOpacity
                onPress={() => {
                    PasswordVisible(!passwordVisible);
                }}
                style={{
                    position: 'absolute',
                    end: 10,
                    height: 40,
                    width: 20,
                    justifyContent: 'center',
                }}>
                <Image style={{
                    width: 20,
                    height: 20,
                }} source={passwordVisible ? AppImages.eye_close : AppImages.eye_open}/>
            </TouchableOpacity>}
        </View>
    );
});
