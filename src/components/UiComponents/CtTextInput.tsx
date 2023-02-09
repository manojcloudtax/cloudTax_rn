import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { defaultColors } from '../../utils/defaultColors';

const CtTextInput = ({ 
    style, value, multiline, placeholder, onChange, secureTextEntry,
     editable, onChangeText, onBlur, keyboardType, placeholderTextColor,
      autoCapitalize, isMasked, maskedFormat, extract }: any) => {
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
    
    return (
        <TextInput
            style={[styles(darkTheme).inputStyle, style ? style : null]}
            value={value || null}
            onChangeText={onChangeText}
            multiline={multiline ? multiline : false}
            blurOnSubmit={true}
            placeholder={placeholder ? placeholder : null}
            placeholderTextColor={darkTheme ? 'gray' : placeholderTextColor || 'gray'}
            secureTextEntry={secureTextEntry || false}
            onBlur={onBlur ? onBlur : null}
            keyboardType={keyboardType || 'default'}
            onChange={onChange || null}
            editable={editable || false}
            autoCapitalize={autoCapitalize}
        /> 
    );
};

const styles = (isDarkTheme?: boolean) => StyleSheet.create({
    inputStyle: {
        paddingLeft: 24,
        color: isDarkTheme ? defaultColors.white : defaultColors.matBlack,
        fontSize: 14,
        backgroundColor: isDarkTheme ? defaultColors.matBlack : defaultColors.whiteGrey
    }

});

export { CtTextInput };
