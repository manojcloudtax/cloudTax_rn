import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import {
  CtText,
  CtView,
  CtTextInput,
  Button,
  TextButton,
} from "../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Spinner } from "../components";
import { useQuery } from "react-query";
import { CustomButton } from "../components/CustomButton";

const ForgotPasswordScreen = ({ navigation }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [firstText, setFirstTextInputValue] = useState("");
  const [secondText, setsecondTextInputValue] = useState("");
  const [thirdText, setthirdTextInputValue] = useState("");
  const [fourthText, setfourthTextInputValue] = useState("");
  const [fifthText, setfifthTextInputValue] = useState("");
  const [sixthText, setsixthTextInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  let firstInput = useRef<TextInput>();
  let secondInput = useRef<TextInput>();
  let thirdInput = useRef<TextInput>();
  let fourthInput = useRef<TextInput>();
  let fifthInput = useRef<TextInput>();
  let sixthInput = useRef<TextInput>();

  const setFirstTextInput = async (text: string) => {
    setFirstTextInputValue(text);
    if (text.length === 1) {
      if (secondInput.current) {
        secondInput.current.focus();
      }
    } else if (text.length === 0) {
      if (firstInput.current) {
        firstInput.current.focus();
      }
    }
  };

  const setSecondTextInput = async (text: string) => {
    setsecondTextInputValue(text);
    if (text.length === 1) {
      if (thirdInput.current) {
        thirdInput.current.focus();
      }
    } else if (text.length === 0) {
      if (firstInput.current) {
        firstInput.current.focus();
      }
    }
  };

  const setThirdTextInput = async (text: string) => {
    setthirdTextInputValue(text);
    if (text.length === 1) {
      if (fourthInput.current) {
        fourthInput.current.focus();
      }
    } else if (text.length === 0) {
      if (secondInput.current) {
        secondInput.current.focus();
      }
    }
  };

  const setFourthTextInput = async (text: string) => {
    setfourthTextInputValue(text);
    if (text.length === 1) {
      if (fifthInput.current) {
        fifthInput.current.focus();
      }
    } else if (text.length === 0) {
      if (thirdInput.current) {
        thirdInput.current.focus();
      }
    }
  };

  const setFifthTextInput = async (text: string) => {
    setfifthTextInputValue(text);
    if (text.length === 1) {
      if (sixthInput.current) {
        sixthInput.current.focus();
      }
    } else if (text.length === 0) {
      if (fourthInput.current) {
        fourthInput.current.focus();
      }
    }
  };

  const setSixthTextInput = async (text: string) => {
    setsixthTextInputValue(text);
    if (text.length === 0) {
      if (fifthInput.current) {
        fifthInput.current.focus();
      }
    }
  };

  // const { isLoading, refetch } = useQuery(
  //   "UserRegistration",
  //   () =>
  //     confirmOTP({
  //       plain: true,
  //       Year: 2022,
  //     }),
  //   {
  //     onSuccess: async (data) => {
  //       console.log("REGISTERED", data);
  //       // await dispatch(
  //       //   register({
  //       //     token: data.token,
  //       //     email,
  //       //     password,
  //       //     refreshToken: data.refresh,
  //       //   })
  //       // );

  //       if (data.ErrCode == -1) {
  //         Alert.alert(data.ErrMsg);
  //       } else {
  //         console.log("ERROR");
  //       }
  //     },
  //     onError: (data: any) => {
  //       console.log("ERROR", data);
  //       Alert.alert("Something went wrong, please try again.");
  //     },
  //     enabled: false,
  //   }
  // );

  const renderButton = () => {
    const buttonDisabled =
      firstText !== "" &&
      secondText !== "" &&
      thirdText !== "" &&
      fourthText !== "" &&
      fifthText !== "" &&
      sixthText !== "";
    if (isLoading) {
      return <Spinner style={{ flex: 0 }} />;
    } else {
      return (
        <Button
          activeOpacity={1}
          disabled={!!buttonDisabled}
          style={[
            styles().button,
            {
              opacity: buttonDisabled ? 0.8 : 1,
              marginBottom: 24,
              marginTop: 42,
            },
          ]}
          buttonText="Submit"
          // onPress={() => refetch()}
        />
      );
    }
  };
  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle}>
      <ScrollView
        // style={styles(darkTheme).scrollStyle}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            backgroundColor: darkTheme
              ? defaultColors.black
              : defaultColors.white,
            justifyContent: "center",
          }}
        >
          {/* <CtView style={{ paddingHorizontal: 15,
      padding: 20,
      backgroundColor: darkTheme ? defaultColors.white : defaultColors.white,
      }}> */}
          <CtView style={styles(darkTheme).container}>
            <CtView style={styles(darkTheme).otpContainer}>
              <CtTextInput
                refName={firstInput}
                maxLength={1}
                editable={true}
                placeholder={""}
                placeholderTextColor={defaultColors.gray}
                style={styles(darkTheme).textStyle}
                onChangeText={(text: string) => setFirstTextInput(text)}
                // onBlur={onEmailSubmit}
                keyboardType={"number-pad"}
                autoCapitalize="none"
                value={firstText}
              />
            </CtView>

            <CtView style={styles(darkTheme).otpContainer}>
              <CtTextInput
                refName={secondInput}
                maxLength={1}
                editable={true}
                placeholder={""}
                placeholderTextColor={defaultColors.gray}
                style={styles(darkTheme).textStyle}
                onChangeText={(text: string) => setSecondTextInput(text)}
                // onBlur={onEmailSubmit}
                keyboardType={"number-pad"}
                autoCapitalize="none"
                value={secondText}
              />
            </CtView>
            <CtView style={styles(darkTheme).otpContainer}>
              <CtTextInput
                refName={thirdInput}
                maxLength={1}
                editable={true}
                placeholder={""}
                placeholderTextColor={defaultColors.gray}
                style={styles(darkTheme).textStyle}
                onChangeText={(text: string) => setThirdTextInput(text)}
                // onBlur={onEmailSubmit}
                keyboardType={"number-pad"}
                autoCapitalize="none"
                value={thirdText}
              />
            </CtView>
            <CtView style={styles(darkTheme).otpContainer}>
              <CtTextInput
                refName={fourthInput}
                maxLength={1}
                editable={true}
                placeholder={""}
                placeholderTextColor={defaultColors.gray}
                style={styles(darkTheme).textStyle}
                onChangeText={(text: string) => setFourthTextInput(text)}
                // onBlur={onEmailSubmit}
                keyboardType={"number-pad"}
                autoCapitalize="none"
                value={fourthText}
              />
            </CtView>
            <CtView style={styles(darkTheme).otpContainer}>
              <CtTextInput
                refName={fifthInput}
                maxLength={1}
                editable={true}
                placeholder={""}
                placeholderTextColor={defaultColors.gray}
                style={styles(darkTheme).textStyle}
                onChangeText={(text: string) => setFifthTextInput(text)}
                // onBlur={onEmailSubmit}
                keyboardType={"number-pad"}
                autoCapitalize="none"
                value={fifthText}
              />
            </CtView>
            <CtView style={styles(darkTheme).otpContainer}>
              <CtTextInput
                refName={sixthInput}
                maxLength={1}
                editable={true}
                placeholder={""}
                placeholderTextColor={defaultColors.gray}
                style={styles(darkTheme).textStyle}
                onChangeText={(text: string) => setSixthTextInput(text)}
                // onBlur={onEmailSubmit}
                keyboardType={"number-pad"}
                autoCapitalize="none"
                value={sixthText}
              />
            </CtView>
          </CtView>

          <TextButton
            description="Didn't receive code? "
            linkText="Resend"
            linkTextColor={defaultColors.links}
            onPress={() => navigation.navigate("LoginScreen")}
          />

          {/* {renderButton()} */}
          <CustomButton
          showLoading={isLoading}
          buttonText="Sign In"
          disabled={(firstText !== "" &&
          secondText !== "" &&
          thirdText !== "" &&
          fourthText !== "" &&
          fifthText !== "" &&
          sixthText !== "")}
          // onPress={() => refetch()}
          style={{ marginBottom: 20, marginTop: 10 }}
          />
          <TextButton
            description=" "
            linkText={"Back to home"}
            fontSize={15}
            linkTextColor={
              darkTheme ? defaultColors.darkModeTextColor : defaultColors.gray
            }
            onPress={() => {
              navigation.goBack();
            }}
          />
          {/* </CtView> */}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      flex: 1,
      padding: 10,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      justifyContent: "center",
      // alignItems: "center",
      // alignContent: "center",
      // alignSelf: "center",
    },
    container: {
      marginTop: 15,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      alignSelf: "center",
      height: 60,
      margin: 20,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
    },
    otpContainer: {
      // flex: 2,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginRight: 10,
    },
    textStyle: {
      borderWidth: 1,
      borderColor: isDarkTheme ? "#404040" : "#DADADA",
      backgroundColor: isDarkTheme ? "#363636" : "#F8F8F8",
      height: 50,
      borderRadius: 8,
      width: "100%",
      fontFamily: "Figtree-Medium",
    },
    button: {
      paddingVertical: 15,
      borderRadius: 5,
      marginTop: 8,
      marginBottom: 15,
      backgroundColor: isDarkTheme ? "#0A98FF" : "#0090EE",
    },
  });

export default ForgotPasswordScreen;
