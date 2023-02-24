import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import { ErrorMessage } from "./ErrorMessage";

const CustomInput = ({
  onSubmit,
  onFocus,
  keyboardType,
  validationError,
  style,
  onChangeText,
  value,
  onBlur,
  secureTextEntry,
  placeholderTextColor,
  placeholder,
  editable,
  onPressRightIcon,
  customImage,
  RightImage,
  ...props
}: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <View style={styles(darkTheme).container}>
      <View style={styles(darkTheme).textViewContainer}>
        {
          customImage ? 
          <View
          style={styles().IconContainer}
        >
          <Image
          resizeMode={'contain'}
          source={customImage}
          style={styles().IconViewStyle}/>
        </View>:
        null
        }
       
        <View style={{ flex: customImage ? 0.80 : 0.9, paddingLeft: customImage ? 0 : 10}}>
          <TextInput
            style={[styles(darkTheme).inputStyle, style ? style : null]}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={
              darkTheme ? "gray" : placeholderTextColor || "gray"
            }
            secureTextEntry={secureTextEntry || false}
            onBlur={onBlur ? onBlur : null}
            onSubmitEditing={onSubmit}
            onFocus={onFocus}
            keyboardType={keyboardType}
            underlineColorAndroid="transparent"
            {...props}
          />
        </View>

        <TouchableOpacity
          style={styles().RightIconContainer}
          onPress={onPressRightIcon}
        >
          <Image
          resizeMode={'contain'}
          source={RightImage}
          style={styles().IconViewStyle}/>
        </TouchableOpacity>
      </View>
      {validationError ? 
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          height: 'auto',
          marginTop: 6
          // backgroundColor: defaultColors.gray,
        }}
      >
        <ErrorMessage text={validationError} /> 
      </View>
      : null}
    </View>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    container: {
      height: "auto",
      backgroundColor: isDarkTheme ? defaultColors.darkBorder : defaultColors.transparent,
      marginBottom: 15,
      borderRadius: 10,
    },
    textViewContainer: {
      height: 50,
      backgroundColor: defaultColors.transparent,
      flexDirection: 'row',
      borderRadius: 10,
      borderWidth: 1,
      borderColor:isDarkTheme ? defaultColors.darkBorder :  "#DADADA",
    },
    inputStyle: {
      height: 50,
      padding: 15,
      // paddingLeft: 42,
      marginBottom: 24,
      width: "100%",
      fontFamily: "Figtree-Medium",
      color: isDarkTheme ? defaultColors.white : defaultColors.matBlack,
    },
    IconViewStyle: {
      height: 20,
      width: 20,
      backgroundColor: defaultColors.transparent,
      opacity:0.5
    },
    IconContainer: {
      justifyContent: 'center',
      height: 50, 
      paddingLeft: 15,
      flex: 0.1,
      // backgroundColor: defaultColors.yellow,
      alignItems: 'center'
    },
    RightIconContainer:{
      justifyContent: 'center',
      height: 50, 
      // backgroundColor: defaultColors.green,
      flex: 0.1,
      marginRight: 10,
      alignItems: 'center',
    }
  });

export { CustomInput };
