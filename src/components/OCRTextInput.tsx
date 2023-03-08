import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import { ErrorMessage } from "./ErrorMessage";
import { CtText } from "./UiComponents";

const OCRTextInput = ({
  onSubmit,
  onFocus,
  keyboardType,
  validationError,
  style,
  onChangeText,
  value,
  onBlur,
  placeholderTextColor,
  placeholder,
  editable,
  title,
  boxNumber,
  ...props
}: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <View style={styles(darkTheme).container}>
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
            : defaultColors.secondaryTextColor
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
              color: darkTheme
              ? defaultColors.secondaryTextColor
              :defaultColors.white
            }}
            numberOfLines={1}
          >
            {boxNumber}
          </CtText>
        </View>

        <View style={{ flex: 0.88, margin: 8, justifyContent: 'center'}}>
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
            onBlur={onBlur ? onBlur : null}
            onSubmitEditing={onSubmit}
            onFocus={onFocus}
            keyboardType={keyboardType}
            underlineColorAndroid="transparent"
            editable={editable}
            // selection={{start:0}}
            {...props}
          />
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
    </View>
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
      height: 50,
    //   padding: 15,
      // paddingLeft: 42,
    //   marginBottom: 24,
      width: "100%",
      fontFamily: "Figtree-SemiBold",
      color: isDarkTheme ? defaultColors.white : defaultColors.matBlack,
      fontWeight: "600",
      fontSize: 18,
    },
    IconViewStyle: {
      height: 20,
      width: 20,
      backgroundColor: defaultColors.transparent,
      opacity: 0.5,
    },
    IconContainer: {
      justifyContent: "center",
      height: 50,
      paddingLeft: 15,
      flex: 0.1,
      // backgroundColor: defaultColors.yellow,
      alignItems: "center",
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

export { OCRTextInput };
