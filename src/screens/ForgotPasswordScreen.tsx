import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { CtText, CtView, Button, TextButton } from "../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../utils/defaultColors";
import { ForgotPassword} from "../api/auth";
import { useQuery } from "react-query";
import { validateEmail } from "../utils/email";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { firebase } from '@react-native-firebase/analytics';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: 'forgotpasswordscreen',
    });
  }, []);
  const { isLoading, refetch } = useQuery(
    "UserRegistration",
    () =>
      ForgotPassword({
        AcctEmail: email,
        Year: 2022,
        host: "https://www.app.cloudtax.ca/2022/auth/reset-password",
      }),
    {
      onSuccess: async (data) => {
        console.log("REGISTERED", data);
        if(data){
          if (!data.success) {
            Alert.alert("Something went wrong,,! Please enter a valid email..!");
          } else {
            // navigation.navigate("VerificationCodeScreen");
            console.log("ERROR", data);
            Alert.alert("Success", "We've sent an email to your mail with password reset instructions.");
          }
        }else {
          Alert.alert("Something went wrong, please try again.");
        }
      },
      onError: (data) => {
        console.log("ERROR", data);
        Alert.alert("Something went wrong, please try again.");
      },
      enabled: false,
    }
  );

  const onEmailSubmit = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter valid email");
    } else {
      setEmailError(null);
    }
  };

  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle}>
      <ScrollView
        style={styles(darkTheme).scrollStyle}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: darkTheme
              ? defaultColors.black
              : defaultColors.white,
          }}
        >
          <CtView style={styles(darkTheme).container}>
            <CtView style={styles(darkTheme).TopTextContainer}>
              <CtText style={styles(darkTheme).caption}>
                Forgot password?
              </CtText>
              <CtText style={styles(darkTheme).subTitle}>
                Enter your email address and we’ll send instructions to reset
                your password
              </CtText>
            </CtView>
            <CtView style={styles(darkTheme).BottomViewContainer}>
              <CtView style={{ marginTop: 30 }}>
                <CustomInput
                  editable={true}
                  placeholder={"Your email address"}
                  placeholderTextColor={defaultColors.gray}
                  onChangeText={(email: string) => setEmail(email)}
                  onBlur={onEmailSubmit}
                  keyboardType={"email-address"}
                  autoCapitalize="none"
                  validationError={emailError}
                  customImage={
                    darkTheme
                      ? require("../../assets/msgIconDark.png")
                      : require("../../assets/msgIcon.png")
                  }
                />
                <CustomButton
                  showLoading={isLoading}
                  buttonText="Submit"
                  disabled={!email || emailError}
                  onPress={() => refetch()}
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
                <TextButton
                  description=" "
                  linkText={"Back to home"}
                  fontSize={15}
                  linkTextColor={
                    darkTheme ? defaultColors.white : defaultColors.gray
                  }
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              </CtView>
            </CtView>
          </CtView>
        </KeyboardAvoidingView>
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
      // isDarkTheme ? defaultColors.black : defaultColors.whiteGrey,
    },
    container: {
      paddingHorizontal: 15,
      padding: 20,
      flex: 1,
      //   justifyContent: 'center',
      height: Dimensions.get("window").height / 1.5,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
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
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      //   flex: 0.5
    },
    caption: {
      textAlign: "center",
      fontSize: 25,
      fontFamily: "Figtree-Bold",
      fontWeight: "700",
    },
    subTitle: {
      marginTop: 10,
      textAlign: "center",
      fontSize: 16,
      fontWeight: "400",
      color: isDarkTheme ? defaultColors.white : "rgba(26, 38, 58, 0.7)",
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

export default ForgotPasswordScreen;
