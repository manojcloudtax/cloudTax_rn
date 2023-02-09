import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { defaultColors } from '../../utils/defaultColors';
import { CtText, CtView } from '.';

import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface DropDownProps extends TouchableOpacityProps {
  label: string;
  selectedValue?: string;
  showIcon: boolean;
  override?: any
  dropdownStyle?: any,
}

const DropDown = (props: DropDownProps) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <CtView style={styles.container}>
      <TouchableOpacity style={{}} {...props}>
        <CtText
          numberOfLines={1}
          style={[props.override ? [...[styles.label2]] : props.selectedValue ? styles.selectedValue : styles.label, {marginRight: props.showIcon ? 24 : 0}]}
        >
          {props.selectedValue || props.label}
        </CtText>
        {props.showIcon ? <Feather 
          name="chevron-down" 
          size={18} 
          style={[{marginTop: -2, right: 8, position: 'absolute'}, props.dropdownStyle]}
          color={darkTheme ? defaultColors.white : defaultColors.matBlack} 
        /> : null}
      </TouchableOpacity>
    </CtView >
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  selectedValue: {
    textAlign: 'right',
    fontSize: 14,
    marginRight: 24,
    fontWeight: '400',
  },
  label: {
    marginTop: -2,
    fontSize: 14,
    color: defaultColors.gray,
    textAlign: "right",
  },
  label2: {
    marginTop: 1,
    fontSize: 14,
    marginLeft: 14,
    color: defaultColors.gray,
    textAlign: "left",
  }
});

export { DropDown };
