import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
} from "react-native";
import { defaultColors } from "../utils/defaultColors";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { CtText } from "./UiComponents";

const Header = ({ onPressbackButton }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <View style={styles(darkTheme).viewStyle}>
      <StatusBar
        // backgroundColor={Colors.appBackgroundColor}
        backgroundColor={
          darkTheme ? defaultColors.black : defaultColors.whiteGrey
        }
        barStyle={darkTheme ? "light-content" : "dark-content"}
      />
      {/* <StatusBar translucent={true} hidden={true} /> */}
      <View style={styles(darkTheme).leftImageView}>
        <TouchableOpacity
          style={styles(darkTheme).searchContainer}
          onPress={onPressbackButton}
        >
          <Ionicons
            name={"ios-chevron-back-outline"}
            style={{
              fontSize: 21,
              color: defaultColors.primaryBlue,
            }}
          />
          <CtText
            style={{
              fontWeight: "500",
              fontSize: 18,
              color: defaultColors.primaryBlue,
            }}
          >
            {"Back"}
          </CtText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    viewStyle: {
      // flexDirection: 'row',
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      height: 50,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0 },
      // shadowOpacity: 0.2,
      shadowRadius: 3,
      // elevation: 5,
      paddingLeft: 10,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    leftImageView: {
      flex: 0.5,
      alignItems: "flex-start",
      justifyContent: "center",
      height: "100%",
      // backgroundColor: 'green',
    },
    searchContainer: {
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      height: 40,
      minWidth: 40,
      justifyContent: "center",
      borderRadius: 4,
      alignItems: "center",
      marginRight: 12,
      flexDirection: "row",
    },
  });

export { Header };
