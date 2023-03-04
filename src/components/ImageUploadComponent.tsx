import React from "react";
import { View, StyleSheet} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import { Button, CtText } from "./UiComponents";

const ImageUploadComponent = ({
    onPressCamera,
    onPressLibrary,
    onBackdropPress
}: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <View
    style={{
      height: "auto",
      width: "100%",
      backgroundColor: darkTheme ? defaultColors.black : "#999999",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      alignItems: "center",
      paddingLeft: 15,
      paddingRight: 15,
    }}
  >
    <View
      style={{
        height: "auto",
        width: "100%",
        backgroundColor: darkTheme
          ? defaultColors.matBlack
          : defaultColors.matBlack,
        // margin: 20,
        padding: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <CtText
        style={{
          fontWeight: "600",
          fontFamily: "Figtree-SemiBold",
          fontSize: 15,
          textAlign: "center",
          color: defaultColors.white,
        }}
      >
        {"Pick a photo"}
      </CtText>
      <CtText
        style={{
          fontWeight: "600",
          fontSize: 14,
          marginTop: 4,
          textAlign: "center",
          color: defaultColors.white,
          fontFamily: "Figtree-SemiBold",
        }}
      >
        {"Choose a picture from Library or Camera"}
      </CtText>
    </View>
    <View
      style={{
        backgroundColor: darkTheme ? "transparent" : "transparent",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Button
        onPress={onPressCamera}
        style={{
          paddingVertical: 16,
          // borderRadius: 5,
          backgroundColor: defaultColors.matBlack,
          // marginBottom: 20,
          borderTopColor: defaultColors.darkBorder,
          borderTopWidth: 2,
          borderBottomColor: defaultColors.darkBorder,
          borderBottomWidth: 2,
        }}
      >
        <CtText
          style={{
            fontSize: 18,
            color: defaultColors.primaryBlue,
            fontWeight: "600",
            // borderRadius: 10,
          }}
        >
          Camera
        </CtText>
      </Button>

      <Button
        onPress={onPressLibrary}
        style={{
          backgroundColor: defaultColors.matBlack,

          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <CtText
          style={{
            paddingVertical: 16,
            fontSize: 18,
            color: defaultColors.primaryBlue,
            fontWeight: "600",
            // borderRadius: 10,
            // marginBottom: 10,
          }}
        >
          Library
        </CtText>
      </Button>
    </View>

    <View
      style={{
        backgroundColor: darkTheme ? "transparent" : "transparent",
        justifyContent: "center",
        width: "100%",
        marginTop: 10,
      }}
    >
      <Button
        onPress={onBackdropPress}
        style={{
          paddingVertical: 16,
          borderRadius: 10,
          backgroundColor: defaultColors.matBlack,
          marginBottom: 10,
        }}
      >
        <CtText
          style={{
            fontSize: 18,
            color: darkTheme
              ? defaultColors.primaryBlue
              : defaultColors.white,
            fontWeight: "700",
            borderRadius: 10,
          }}
        >
          Cancel
        </CtText>
      </Button>
    </View>
  </View>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
   
  });

export { ImageUploadComponent };
