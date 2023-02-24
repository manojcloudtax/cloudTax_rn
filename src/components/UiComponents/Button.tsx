import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableOpacityProps, StyleProp } from 'react-native';
import { CtText } from '.';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { defaultColors } from '../../utils/defaultColors';

interface ButtonProps extends TouchableOpacityProps {
  buttonText?: string;
  buttonTextStyle?: StyleProp<Text>;
}

const Button = (props: ButtonProps) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { buttonText, style, children, activeOpacity } = props;
  return (
    <View style={{justifyContent: 'center'}}>
      <TouchableOpacity
        {...props}
        activeOpacity={activeOpacity || 0.2}
        style={[styles().button, style]}
      >
        {buttonText &&
          <CtText style={[darkTheme ? null : styles(darkTheme).lightText, {fontFamily: 'Figtree-SemiBold', fontSize: 18}]}>{buttonText}</CtText>}
        {children}
      </TouchableOpacity>
    </View>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
  button: {
    backgroundColor: defaultColors.blue,
    // paddingVertical: 25,
    alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    display: 'flex'
  },
  lightText: {
    color: defaultColors.white
  }

});

export { Button };
