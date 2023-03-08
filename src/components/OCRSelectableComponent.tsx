import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import { ErrorMessage } from "./ErrorMessage";
import { CtText } from "./UiComponents";
import CheckmarkIcon from "react-native-vector-icons/Octicons";

const OCRSelectableComponent = ({
  style,
  boxNumber,
  validationError,
  isSelectFirstBox,
  isSelectThirdBox,
  isSelectSecondBox,
  OnPressCheckBox0,
  OnPressCheckBox1,
  OnPressCheckBox2,
  ...props
}: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  return (
    <View style={styles(darkTheme).container}>
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
            // justifyContent: "center",
            // alignContent: "center",
            // marginLeft: 8,
            flexDirection:'row',
          }}
        >
            <View
          style={{
            height: 50,
            flex: 0.35,
            justifyContent: "flex-start",
            alignContent: "flex-start",
            alignItems: 'center',
            marginLeft: 8,
            flexDirection:'row',
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center", marginRight: 5 }}
            onPress={OnPressCheckBox0}
          >
            {isSelectFirstBox ? (
              <View
                style={{
                  width: 22,
                  height: 22,
                  overflow: "hidden",
                  backgroundColor: defaultColors.primaryBlue,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                }}
              >
                <CheckmarkIcon
                  name={"check"}
                  size={18}
                  color={defaultColors.white}
                />
              </View>
            ) : (
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderWidth: 1.4,
                  borderColor: "#E7E8EA",
                  borderRadius: 3,
                  // borderColor: defaultColors.primaryBlue,
                }}
              />
            )}
          </TouchableOpacity>
          <Text
            style={[styles(darkTheme).inputStyle, style ? style : null]}
            {...props}
          >CPP</Text>
          </View>

          <View
          style={{
            height: 50,
            flex: 0.3,
            justifyContent: "flex-start",
            alignContent: "flex-start",
            alignItems: 'center',
            marginLeft: 2,
            flexDirection:'row',
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center", marginRight: 5 }}
            onPress={OnPressCheckBox1}
          >
            {isSelectSecondBox ? (
              <View
                style={{
                  width: 22,
                  height: 22,
                  overflow: "hidden",
                  backgroundColor: defaultColors.primaryBlue,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                }}
              >
                <CheckmarkIcon
                  name={"check"}
                  size={18}
                  color={defaultColors.white}
                />
              </View>
            ) : (
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderWidth: 1.4,
                  borderColor: "#E7E8EA",
                  borderRadius: 3,
                  // borderColor: defaultColors.primaryBlue,
                }}
              />
            )}
          </TouchableOpacity>
          <Text
            style={[styles(darkTheme).inputStyle, style ? style : null]}
            {...props}
          >EI</Text>
          </View>

          <View
          style={{
            height: 50,
            flex: 0.35,
            justifyContent: "flex-start",
            alignContent: "flex-start",
            alignItems: 'center',
            marginLeft: 2,
            flexDirection:'row',
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center", marginRight: 5  }}
            onPress={OnPressCheckBox2}
          >
            {isSelectThirdBox ? (
              <View
                style={{
                  width: 22,
                  height: 22,
                  overflow: "hidden",
                  backgroundColor: defaultColors.primaryBlue,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                }}
              >
                <CheckmarkIcon
                  name={"check"}
                  size={18}
                  color={defaultColors.white}
                />
              </View>
            ) : (
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderWidth: 1.4,
                  borderColor: "#E7E8EA",
                  borderRadius: 3,
                  // borderColor: defaultColors.primaryBlue,
                }}
              />
            )}
          </TouchableOpacity>
          <Text
            style={[styles(darkTheme).inputStyle, style ? style : null]}
            {...props}>PPIP</Text>
          </View>

          </View>
        </View>

      {/* {validationError ? (
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
      ) : null} */}
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
      //   height: 50,
      //   padding: 15,
      // paddingLeft: 42,
      //   marginBottom: 24,
      //   width: "100%",
      fontFamily: "Figtree",
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

export { OCRSelectableComponent };
