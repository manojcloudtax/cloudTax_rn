import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableOpacityProps, StyleProp, TouchableWithoutFeedback } from 'react-native';
import { CtText } from '.';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { defaultColors } from '../../utils/defaultColors';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  buttonText?: string;
  buttonTextStyle?: StyleProp<Text>;
}

const GradientButton = (props: ButtonProps) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { buttonText, style, children, activeOpacity } = props;
  return (
    <TouchableOpacity
    {...props}
    activeOpacity={activeOpacity || 0.2}
    style={[styles.button, style]}
  >
    <LinearGradient style={style} locations={[0,0.8]} start={{x: 0.2, y: 0}} end={{x: 1.2, y: -0.5}} colors={['#0075FF','#3AE4F4']}>
        <CtText></CtText>
        {buttonText &&
          <CtText style={[darkTheme ? null : styles.lightText, {textAlign: 'center', marginLeft: 24}]}>{buttonText}</CtText>}
        {children}
    </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 25,
    alignItems: 'center',
    marginTop: 5,
    zIndex: 1,
  },
  lightText: {
    textAlign: 'center',
    fontFamily: 'Figtree-Medium',
    fontWeight: '600',
    fontSize: 18,
    color: defaultColors.white
  }
});

export { GradientButton };
