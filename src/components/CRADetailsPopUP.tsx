import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { defaultColors } from "../utils/defaultColors";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { CtText } from "./UiComponents";

const CRADetailsPopUP = ({
  title,
  details,
  onPressCloseModal,
  backgroundColor = "ffd19a",
  borderColor = "#ffd19a",
  titleColor= "#ff8c00"
}: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <View
      style={{
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center",
        height: "auto",
        margin: 20,
        backgroundColor: backgroundColor,
        padding: 10,
        flex: 1,
        borderRadius: 4,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <View
        style={{
          width: 4,
          backgroundColor: titleColor,
          height: "100%",
          borderRadius: 3,
        }}
      />

      <View
        style={{
          // width: 'auto',
          height: "100%",
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <CtText
          style={{
            fontSize: 16,
            fontWeight: "400",
            fontFamily: "Figtree-SemiBold",
            color: titleColor,
          }}
        >
          {title}
        </CtText>
        <CtText
          style={{
            fontSize: 14,
            fontWeight: "400",
            fontFamily: "Figtree-SemiBold",
            color: darkTheme
              ? defaultColors.darkModeTextColor
              : defaultColors.secondaryTextColor,
            paddingTop: 4,
          }}
        >
          {details}
        </CtText>
      </View>

      <TouchableOpacity
        style={{
          width: 40,
          height: "100%",
          justifyContent: "center",
          alignContent: "center",
          // backgroundColor: "#ffd19a",
          alignItems: "center",
        }}
        onPress={onPressCloseModal}
      >
        <Ionicons name={"md-close-circle-sharp"} size={36} color={borderColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = (isDarkTheme?: boolean) => StyleSheet.create({});

export { CRADetailsPopUP };
