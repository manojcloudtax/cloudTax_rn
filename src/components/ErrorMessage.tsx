import React from "react";
import { StyleSheet, TextProps, View } from "react-native";
import { CtText, CtView } from "./UiComponents";
import { defaultColors } from "../utils/defaultColors";
import { AntDesign } from "@expo/vector-icons";

interface ErrorMessageProps extends TextProps {
  text: string | null;
}

const ErrorMessage = (props: ErrorMessageProps) => {
  const { text, style } = props;
  if (!text) {
    return null;
  }
  return (
    <View style={{ flexDirection: "row", alignContent: "center" }}>
      <View
        style={{
          backgroundColor: "transparent",
          left: 4,
          // marginTop: -16,
          marginRight: 8,
        }}
      >
        <AntDesign
          name={"exclamationcircleo"}
          color={defaultColors.red}
          size={14}
        />
      </View>
      <CtText style={[styles.error, style]}>{text || "Error"}</CtText>
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    color: defaultColors.error,
    fontSize: 12,
    // marginTop: -15,
    // marginBottom: 15,
    marginLeft: 4,
    fontFamily: "Figtree-MediumItalic",
  },
});

export { ErrorMessage };
