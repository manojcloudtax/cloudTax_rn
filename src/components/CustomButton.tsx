import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import { Spinner } from "./Spinner";
import { CtText } from "./UiComponents";

interface ButtonProps extends TouchableOpacityProps {
  buttonText?: string;
  buttonTextStyle?: StyleProp<Text>;
  showLoading?: boolean;
}

const CustomButton = (props: ButtonProps) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { buttonText, style, activeOpacity, showLoading, disabled, buttonTextStyle } =
    props;
  // console.log("CustomButton disabled", disabled);
  // console.log("CustomButton showLoading", showLoading);
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={activeOpacity || 0.2}
      disabled={disabled || showLoading}
      style={[
        {
          backgroundColor: defaultColors.primaryButton,
          alignItems: "center",
          height: 50,
          borderRadius: 10,
          justifyContent: "center",
          marginTop: 10,
        },
        style,
      ]}
    >
      {showLoading ? (
        <Spinner
          style={{
            flex: 0,
            backgroundColor: "transparent",
          }}
        />
      ) : (
        buttonText && (
          <CtText
            style={[
              darkTheme ? null : { color: defaultColors.white },
              {
                fontWeight: "600",
                fontFamily: "Figtree-SemiBold",
                fontSize: 18,
              },
              buttonTextStyle
            ]}
          >
            {buttonText}
          </CtText>
        )
      )}
    </TouchableOpacity>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    button: {
      backgroundColor: defaultColors.blue,
      // paddingVertical: 25,
      alignItems: "center",
      // marginTop: 5,
      justifyContent: "center",
      display: "flex",
    },
    lightText: {
      color: defaultColors.white,
    },
  });

export { CustomButton };
