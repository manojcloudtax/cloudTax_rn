import React, { useEffect, useMemo, useState, useRef, createRef } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
import {
  CtText,
  CtView,
  CtTextInput,
} from "../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../components/CustomButton";
import { Header } from "../components/Header";

const CRAAutoFillScreen = ({ navigation, route }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [firstText, setFirstTextInputValue] = useState("");
  const [secondText, setScondTextInputValue] = useState("");
  const [thirdText, setThirdTextInputValue] = useState("");
  const [isEnable, setButtonEnable] = useState(false);
  const [key, setKeyToRerender] = useState(1);
  let secondInput = useRef<TextInput>();
  let thirdInput = useRef<TextInput>();
  let firstInput = useRef<TextInput>();
  const dispatch = useDispatch();
  const { getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );

  useEffect(() => {
    try {
      console.log(
        "init getSavedLoggedInData.TaxPayerSocialInsuranceNumber.match(/.{1,3}/g)",
        getSavedLoggedInData.TaxPayerSocialInsuranceNumber.match(/.{1,3}/g)
      );
      // if (route.params !== undefined) {
      //   const { isFromRegistration } = route.params;
      // }
      const seperatedSinNumber =
        getSavedLoggedInData.TaxPayerSocialInsuranceNumber.match(/.{1,3}/g);

      setFirstTextInputValue(
        seperatedSinNumber[0] ? seperatedSinNumber[0] : ""
      );
      setScondTextInputValue(
        seperatedSinNumber[1] ? seperatedSinNumber[1] : ""
      );
      setThirdTextInputValue(
        seperatedSinNumber[2] ? seperatedSinNumber[2] : ""
      );
      if (seperatedSinNumber.length === 3) {
        setButtonEnable(true);
      }
    } catch (error) {}
  }, []);

  const setFirstTextInput = async (text: string) => {
    setFirstTextInputValue(text);
    if (text.length === 3) {
      if (secondInput.current) {
        secondInput.current.focus();
      }
    }
    setButtonStatus();
    // onPressConfirm();
  };

  const setSecondTextInput = async (text: string) => {
    setScondTextInputValue(text);
    if (text.length === 3) {
      if (thirdInput.current) {
        thirdInput.current.focus();
      }
    } else if (text.length === 0) {
      if (firstInput.current) {
        firstInput.current.focus();
      }
    }
    setButtonStatus();
    // onPressConfirm();
  };

  const setThirdTextInput = (text: string) => {
    console.log("setThirdTextInput.length", text.length);
    setThirdTextInputValue(text);

    if (text.length === 0) {
      if (secondInput.current) {
        secondInput.current.focus();
      }
    }
    if (text.length === 3) {
      setKeyToRerender(key + 1);
      setButtonStatus();
    }
    setButtonStatus();
  };

  const onPressConfirm = () => {
    if (
      firstText.length === 3 &&
      secondText.length === 3 &&
      thirdText.length === 3
    ) {
      console.log("SIN", firstText + secondText + thirdText);

      console.log("thirdText.length", thirdText);
      let SinNumber = firstText + secondText + thirdText;
      console.log("thirdText.length", validateSIN(SinNumber));
      if (validateSIN(SinNumber)) {
        navigation.navigate("DateOfBirthScreen", {
          sin: firstText + secondText + thirdText,
        });
      } else {
        Alert.alert("Please enter valid SIN Number..!");
      }
    }
  };

  function validateSIN(sin: string) {
    if (!/^\d+$/.test(sin)) {
      return false;
    }
    if (sin.length !== 9) {
      return false;
    }
    const sinReversed = sin.split("").reverse().map(Number);
    const lastNumber = sinReversed.shift();
    const multiplyArray = [2, 1, 2, 1, 2, 1, 2, 1];
    let sum = 0;
    for (let i = 0; i < sinReversed.length; i++) {
      let value = sinReversed[i];
      let multipliedValue = value * multiplyArray[i];
      if (multipliedValue > 9) {
        sum += 1 + (multipliedValue - 10);
      } else {
        sum += multipliedValue;
      }
    }
    const remainder = sum % 10;
    if (
      10 - remainder === lastNumber ||
      (remainder === 0 && lastNumber === 0)
    ) {
      return true;
    } else {
      return false;
    }
  }

  const setButtonStatus = () => {
    // console.log("thirdText.length", thirdText);
    // console.log("firstText.length", firstText.length);
    // console.log("secondText.length", secondText.length);
    // console.log("thirdText.length", thirdText.length);
    // if (
    //   firstText.length === 3 &&
    //   secondText.length === 3 &&
    //   thirdText.length >= 2
    // ) {
    //   setButtonEnable(true);
    // } else {
    //   setButtonEnable(false);
    // }
    console.log("validateSIN length", validateSIN(firstText + secondText + thirdText));
  };
  const onBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle} key={key}>
      <Header onPressbackButton={() => onBackButtonPress()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CtView
          style={{
            // flex: 0.1,
            marginRight: 20,
            marginLeft: 20,
            marginTop: 88.5,
          }}
        >
          <CtText
            style={{
              fontSize: 25,
              fontFamily: "Figtree-SemiBold",
              fontWeight: "600",
              color: darkTheme
                ? defaultColors.whiteGrey
                : defaultColors.secondaryTextColor,
            }}
          >
            CRA Auto-fill
          </CtText>
        </CtView>

        <CtView
          style={{
            // flex: 0.2,
            marginRight: 20,
            marginLeft: 20,
            marginTop: 5,
            marginBottom: 40,
          }}
        >
          <CtText
            style={{
              fontSize: 18,
              fontFamily: "Figtree",
              fontWeight: "400",
              color: darkTheme
                ? defaultColors.darkModeTextColor
                : defaultColors.secondaryText,
            }}
          >
            Please provide your SIN number so that we can connect your CRA's my
            account
          </CtText>
        </CtView>

        <CtView
          style={{
            marginTop: 15,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            alignSelf: "center",
            height: 50,
            margin: 20,
          }}
        >
          <CtView
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CtTextInput
              refName={firstInput}
              maxLength={3}
              editable={true}
              placeholder={"000"}
              placeholderTextColor={defaultColors.gray}
              style={{
                borderWidth: 1,
                borderColor: "#DADADA",
                backgroundColor: "transparent",
                height: 50,
                borderRadius: 8,
                width: "100%",
                fontFamily: "Figtree-Medium",
              }}
              onChangeText={(text: string) => setFirstTextInput(text)}
              // onBlur={onEmailSubmit}
              keyboardType={"number-pad"}
              autoCapitalize="none"
              value={firstText}
              onSubmitEditing={() =>
                secondInput.current ? secondInput.current.focus() : null
              }
            />
          </CtView>
          <CtView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CtText
              style={{
                fontWeight: "400",
                fontSize: 18,
                color: darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.secondaryTextColor,
              }}
            >
              -
            </CtText>
          </CtView>
          <CtView
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CtTextInput
              refName={secondInput}
              maxLength={3}
              editable={true}
              placeholder={"000"}
              placeholderTextColor={defaultColors.gray}
              style={{
                borderWidth: 1,
                borderColor: "#DADADA",
                backgroundColor: "transparent",
                height: 50,
                borderRadius: 8,
                width: "100%",
                fontFamily: "Figtree-Medium",
              }}
              onChangeText={(text: string) => setSecondTextInput(text)}
              // onBlur={onEmailSubmit}
              keyboardType={"number-pad"}
              autoCapitalize="none"
              value={secondText}
              onSubmitEditing={() =>
                secondInput.current ? secondInput.current.focus() : null
              }
            />
          </CtView>
          <CtView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CtText
              style={{
                fontWeight: "400",
                fontSize: 18,
                color: darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.secondaryTextColor,
              }}
            >
              -
            </CtText>
          </CtView>
          <CtView
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CtTextInput
              refName={thirdInput}
              maxLength={3}
              editable={true}
              placeholder={"000"}
              placeholderTextColor={defaultColors.gray}
              style={{
                borderWidth: 1,
                borderColor: "#DADADA",
                backgroundColor: "transparent",
                height: 50,
                borderRadius: 8,
                width: "100%",
                fontFamily: "Figtree-Medium",
              }}
              onChangeText={(text: string) => setThirdTextInput(text)}
              onBlur={setThirdTextInput}
              keyboardType={"number-pad"}
              autoCapitalize="none"
              value={thirdText}
            />
          </CtView>
        </CtView>
        <CustomButton
          // showLoading={isLoading}
          buttonText="Auto-Fill My Return"
          // disabled={!isEnable}
          onPress={() => onPressConfirm()}
          style={{ marginBottom: 20, marginTop: 10, margin: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      flex: 1,
      paddingBottom: 15,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
    },
    container: {
      flex: 1,
    },
    BottomViewContainer: {
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      //   flex: 0.5
    },
    TopTextContainer: {
      marginTop: 40,
      //   backgroundColor: defaultColors.yellow,
      height: "auto",
      justifyContent: "flex-end",
      backgroundColor: defaultColors.white,
      //   flex: 0.5
    },
    caption: {
      textAlign: "center",
      fontSize: 25,
      fontFamily: "Figtree-Bold",
      fontWeight: "700",
    },
    subTitle: {
      marginTop: 5,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Figtree-Regular",
      fontWeight: "400",
      color: "rgba(26, 38, 58, 0.7)",
    },
    input: {
      borderWidth: 1,
      borderColor: "#DADADA",
      backgroundColor: "transparent",
      padding: 15,
      marginBottom: 24,
      borderRadius: 5,
      width: "100%",
      fontFamily: "Figtree-Medium",
    },
    textInputContainer: {
      flex: 0,
      flexDirection: "row",
      //   justifyContent: "space-between",
    },
    inputIcon: {
      flex: 0,
      position: "absolute",
      justifyContent: "flex-end",
      backgroundColor: "transparent",
      right: 24,
      top: 15,
    },
    iconStyle: {
      fontSize: 20,
      color: defaultColors.gray,
    },
    buttonContainer: {
      flex: 0,
      marginTop: 30,
      marginBottom: 30,
    },
    keepMeContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 60,
    },
    forgotPassContainer: {
      flex: 0.45,
      alignItems: "flex-end",
    },
    KeepContainer: {
      flex: 0.55,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
    },
    button: {
      paddingVertical: 16,
      borderRadius: 5,
      backgroundColor: defaultColors.primaryButton,
      marginBottom: 30,
    },
    separatorContainer: {
      flex: 0,
      marginVertical: 40,
    },
    separator: {
      flex: 0,
      borderTopWidth: 0.5,
      borderTopColor: defaultColors.whisper,
    },
    separatorText: {
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      position: "absolute",
      alignSelf: "center",
      textAlign: "center",
      top: Platform.OS === "ios" ? -10 : -13,
      fontSize: 16,
      width: 24,
    },
    googleSignIn: {
      backgroundColor: "#FFF",
      flexDirection: "row",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
    googleSignInContainer: {
      height: 54,
      borderRadius: 10,
      justifyContent: "center",
      backgroundColor: "#FFF",
      borderWidth: 2,
      marginTop: 20,
      borderColor: "#DEE1E9",
      alignContent: "center",
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30,
    },
    dividerStyle: { flex: 1, height: 1, backgroundColor: "#DEE1E9" },
    inputIcon2: {
      flex: 0,
      position: "absolute",
      justifyContent: "flex-start",
      backgroundColor: "transparent",
      left: 12,
      top: 15,
    },
    inputAlt: {
      borderWidth: 1,
      borderColor: "#DADADA",
      backgroundColor: "transparent",
      marginTop: 0,
      padding: 15,
      paddingLeft: 42,
      marginBottom: 24,
      borderRadius: 8,
      width: "100%",
      fontFamily: "Figtree-Medium",
    },
    forgotTextColor: {
      color: "rgba(26, 38, 58, 0.7)",
      fontSize: 16,
      fontWeight: "400",
    },
    dottedStyle: {
      color: "rgba(26, 38, 58, 0.7)",
      fontSize: 8,
      fontWeight: "400",
    },
  });

export default CRAAutoFillScreen;
