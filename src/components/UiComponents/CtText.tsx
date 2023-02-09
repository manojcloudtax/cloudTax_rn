import React from 'react';
import { Text, StyleSheet, TextProps, } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { defaultColors } from '../../utils/defaultColors';

const CtText = (props: TextProps) => {
  const { children, style } = props;
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <Text
      {...props}
      style={[styles(darkTheme).textStyle, style ? style : null]}
    >
      {children}
    </Text>
  );
};

const styles = (isDarkTheme?: boolean) => StyleSheet.create({
  textStyle: {
    color: isDarkTheme ? defaultColors.white : defaultColors.black,
    fontSize: 16,
    fontFamily: 'Gilroy-Medium',
  }

});

export { CtText };
