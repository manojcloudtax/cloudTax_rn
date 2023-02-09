import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { defaultColors } from '../../utils/defaultColors';



const CtView = (props: ViewProps) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);

  return (
    <View {...props} style={[styles(darkTheme).container, props.style]} />
  );
};


const styles = (isDarkTheme?: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
  }

});

export { CtView };
