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
    <View>
      <TouchableOpacity
        {...props}
        activeOpacity={activeOpacity || 0.2}
        style={[styles.button, style]}
      >
        {buttonText &&
          <CtText style={[darkTheme ? null : styles.lightText, {fontFamily: 'Gilroy-SemiBold', fontSize: 18}]}>{buttonText}</CtText>}
        {children}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultColors.blue,
    paddingVertical: 25,
    alignItems: 'center',
    marginTop: 5,
  },
  lightText: {
    color: defaultColors.white
  }

});

export { Button };
