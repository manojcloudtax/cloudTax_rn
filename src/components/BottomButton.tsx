import React from "react";
import { StyleSheet,TouchableOpacity, Text, View, StatusBar, TouchableOpacityProps, StyleProp } from "react-native";
import { defaultColors } from "../utils/defaultColors";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { CtText, CtView } from "./UiComponents";
import { Spinner } from "./Spinner";

interface ButtonProps extends TouchableOpacityProps {
    buttonText?: string;
    buttonTextStyle?: StyleProp<Text>;
    showLoading?: boolean
  }
const BottomButton = (props: ButtonProps)  => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { buttonText, style, children, activeOpacity, showLoading } = props;
  return (
    <CtView
    style={{
      width: "100%",
      height: 80,
      backgroundColor: darkTheme? defaultColors.black: defaultColors.white,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 0,
      borderTopWidth: 1.5,
      borderTopColor: defaultColors.borderColor,
      paddingBottom: 10
    }}
  >
    <CtView
      style={{
        backgroundColor: darkTheme ? "transparent" : "white",
        justifyContent: "center",
        width: "90%",
      }}
    >
         <TouchableOpacity
        {...props}
        activeOpacity={activeOpacity || 0.2}
        style={[{
            backgroundColor: defaultColors.blue,
            alignItems: 'center',
            height: 54,
            borderRadius: 10,
            justifyContent: 'center',
          }, style]}
          disabled={showLoading}
      >
          {showLoading?
    
    <Spinner
         style={{
           flex: 0,
           backgroundColor: 'transparent'
         }}
       />
       :
       buttonText &&
          <CtText style={[darkTheme ? null : {color: defaultColors.white}, {fontFamily: 'Figtree-SemiBold', fontSize: 18}]}>{buttonText}</CtText>}
        {children}
      </TouchableOpacity>
    </CtView>
  </CtView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    
  });

export { BottomButton };
