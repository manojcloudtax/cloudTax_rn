import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import { CtText } from "./UiComponents";

const OCRListItem = ({
  value,
  title,
  boxNumber,
  ...props
}: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <View style={styles(darkTheme).textViewContainer}>
        <View style={styles().LeftIconContainer}>
          <CtText
            style={{
              fontWeight: "600",
              fontSize: 16,
              fontFamily: "Figtree-SemiBold",
              color: defaultColors.white
            }}
          >
            {boxNumber}
          </CtText>
        </View>

        <View style={{ flex: 0.9, margin: 8, justifyContent: 'center'}}>
             <CtText
          style={{
            fontWeight: "600",
            fontSize: 14,
            //   marginTop: 20,
            fontFamily: "Figtree-Bold",
            color: defaultColors.secondaryTextColor
          }}
        >
          {value}
        </CtText>
        </View>
    </View>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    textViewContainer: {
      height: 50,
      backgroundColor: defaultColors.transparent,
      flexDirection: "row",
    //   borderRadius: 10,
    },
    LeftIconContainer: {
      justifyContent: "center",
      //   height: 50,
      backgroundColor: defaultColors.darkGray,
      flex: 0.1,
      margin: 6,
      alignItems: "center",
      borderRadius: 5,
    },
  });

export { OCRListItem };
