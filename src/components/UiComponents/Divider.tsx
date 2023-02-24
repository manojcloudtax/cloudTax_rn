import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import { defaultColors } from "../../utils/defaultColors";
import { CtView, CtText } from ".";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const Divider = () => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  console.log('Divider', darkTheme)
  return (
    <CtView style={styles().dividerContainer}>
      <CtView style={styles().dividerStyle} />
      <CtText
        style={{
          width: 60,
          textAlign: "center",
          fontSize: 16,
          color: darkTheme ? defaultColors.white : defaultColors.black,
        }}
      >
        {'or'}
      </CtText>
      <CtView style={styles().dividerStyle} />
    </CtView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      // marginTop: 30,
      // marginBottom: 30,
      height: 40,
      backgroundColor: defaultColors.transparent,
      
    },
    dividerStyle: {
      flex: 1,
      height: 1,
      backgroundColor: isDarkTheme? defaultColors.darkBorder: defaultColors.borderColor,
    },
  });

export { Divider };
