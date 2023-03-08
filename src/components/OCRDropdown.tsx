import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import { ErrorMessage } from "./ErrorMessage";
import { CtText } from "./UiComponents";

const OCRDropdown = ({
  style,
  value,
  title,
  boxNumber,
  validationError,
  onPressDropDown,
  ...props
}: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <TouchableOpacity
      style={styles(darkTheme).container}
      onPress={onPressDropDown}
    >
      <View
        style={{
          minHeight: 30,
          backgroundColor: darkTheme
            ? defaultColors.black
            : defaultColors.white,
          justifyContent: "center",
          marginLeft: 2,
        }}
      >
        <CtText
          style={{
            fontWeight: "600",
            fontSize: 14,
            //   marginTop: 20,
            fontFamily: "Figtree-Bold",
            color: darkTheme
            ? defaultColors.white
            :defaultColors.secondaryTextColor,
          }}
        >
          {title}
        </CtText>
      </View>

      <View style={styles(darkTheme).textViewContainer}>
        <View style={styles(darkTheme).LeftIconContainer}>
          <CtText
            style={{
              fontWeight: "600",
              fontSize: 16,
              fontFamily: "Figtree-SemiBold",
              color: darkTheme? defaultColors.secondaryTextColor: defaultColors.white
            }}
          >
            {boxNumber}
          </CtText>
        </View>

        <View
          style={{
            height: 50,
            flex: 0.88,
            justifyContent: "center",
            alignContent: "center",
            marginLeft: 8,
          }}
        >
          <Text
            style={[styles(darkTheme).inputStyle, style ? style : null]}
            {...props}
          >
            {value}
          </Text>
        </View>
      </View>
      {validationError ? (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            height: "auto",
            marginTop: 6,
            // backgroundColor: defaultColors.gray,
          }}
        >
          <ErrorMessage text={validationError} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    container: {
      height: "auto",
      backgroundColor: isDarkTheme
        ? defaultColors.black
        : defaultColors.transparent,
      marginBottom: 6,
      borderRadius: 10,
    },
    textViewContainer: {
      height: 53,
      backgroundColor: defaultColors.transparent,
      flexDirection: "row",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDarkTheme ? defaultColors.darkBorder : "#DADADA",
    },
    inputStyle: {
      //   height: 50,
      //   padding: 15,
      // paddingLeft: 42,
      //   marginBottom: 24,
      //   width: "100%",
      fontFamily: "Figtree-SemiBold",
      color: isDarkTheme ? defaultColors.white : defaultColors.matBlack,
      fontWeight: "600",
      fontSize: 18,
    },
    LeftIconContainer: {
      justifyContent: "center",
      //   height: 50,
      backgroundColor: isDarkTheme? defaultColors.secondaryWhiteText: defaultColors.ocrBoxColor,
      flex: 0.12,
      margin: 8,
      alignItems: "center",
      borderRadius: 5,
    },
  });

export { OCRDropdown };
