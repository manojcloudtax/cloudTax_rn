import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Accessory } from "react-native-elements";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { useDispatch, useSelector } from "react-redux";
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from "react-native-image-picker";
import { SocialIcon } from "react-native-elements";

import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  View,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  CtText,
  CtTextInput,
  CtView,
  Button,
  TextButton,
} from "../components/UiComponents";
import { Spinner, ErrorMessage } from "../components";

import { defaultColors } from "../utils/defaultColors";

import { validateEmail } from "../utils/email";
import { validatePassword } from "../utils/password";
import { useQuery } from "react-query";
import { registerUser } from "../api/auth";
import { imageUpload, register } from "../store/authSlice";
import cr, { profile_img_upload } from "../api/cr";
import { RootState } from "../store";
import { useFocusEffect } from "@react-navigation/native";

const RegisterScreen = ({ navigation, route }: any) => {
  const [steps, setSteps] = useState(1);
  const [showConfrimPasswordCheck, setShowConfrimPasswordCheck] =
    useState(false);
  const [libraryData, setLibraryData] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showconfrimPassword, setShowConfrimPassword] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      console.log("init", navigation.getState(), route);
      if (route.params !== undefined) {
        const { step } = route.params;
        setSteps(step);
      }
    } catch (error) {}
  }, []);

  const { isLoading, refetch } = useQuery(
    "register",
    () => registerUser({ name, email, password }),
    {
      onSuccess: async (data) => {
        console.log("REGISTERED", data);
        if (libraryData) {
          dispatch(imageUpload(libraryData));
        }
        await dispatch(
          register({
            token: data.token,
            email,
            password,
            refreshToken: data.refresh,
          })
        );
      },
      onError: (data) => {
        console.log("ERROR", data);
        Alert.alert("Something went wrong, please try again.");
      },
      enabled: false,
    }
  );

  const onNameSubmit = () => {
    if (!name.trim()) {
      setNameError("Name is required.");
    } else {
      setNameError(null);
    }
  };

  const onEmailSubmit = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter valid email");
    } else {
      setEmailError(null);
    }
  };

  const onPasswordBlur = () => {
    if (!password) {
      setPasswordError("Password is required.");
      setShowPassword(false);
      setShowConfrimPasswordCheck(false);
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Password should at least contain 6 characters, a capital letter and a symbol."
      );
    } else {
      setPasswordError(null);
    }
  };

  const onConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required.");
      setShowConfrimPassword(false);
      setShowConfrimPasswordCheck(false);
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Password does not match.");
      setShowConfrimPasswordCheck(false);
    } else {
      setConfirmPasswordError(null);
      setShowConfrimPasswordCheck(true);
    }
  };

  const renderEyeIcon = (isPasswordField: boolean) => {
    return (
      <CtView style={styles().inputIcon}>
        <TouchableOpacity
          onPress={() =>
            isPasswordField
              ? setShowPassword(!showPassword)
              : setShowConfrimPassword(!showconfrimPassword)
          }
        >
          <Feather
            name={
              isPasswordField
                ? showPassword
                  ? "eye"
                  : "eye-off"
                : showconfrimPassword
                ? "eye"
                : "eye-off"
            }
            style={styles().iconStyle}
          />
        </TouchableOpacity>
      </CtView>
    );
  };

  const renderCheckIcon = () => {
    return (
      <CtView style={styles().inputIcon}>
        <Feather
          name={"check"}
          style={[styles().iconStyle, styles().iconCheckStyle]}
        />
      </CtView>
    );
  };

  const renderButton = () => {
    const buttonDisabled =
      !(name && email && password && confirmPassword) ||
      nameError ||
      emailError ||
      passwordError ||
      confirmPasswordError;
    if (isLoading) {
      return <Spinner style={styles().loading} />;
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
          buttonText="Create a new account"
          onPress={() => setSteps(2)}
        />
      );
    }
  };

  const handleOpenLibrary = async () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
    };
    const { assets } = await launchImageLibrary(options);
    if (assets) {
      setLibraryData(assets[0] as any);
      console.log(assets[0]);
    }
  };

  const renderPasswordStrength = useMemo(() => {
    let passwordLength = password.length;
    let passwordRating = "";
    if (passwordLength < 9 && passwordLength >= 6) {
      passwordRating = "can be longer";
    } else if (passwordLength >= 9) {
      passwordRating = "strong password length";
    } else {
      passwordRating = "too short";
    }
    return password.length !== 0 ? (
      <View style={{ height: 24, marginBottom: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                {
                  backgroundColor:
                    password.trim().length <= 5
                      ? defaultColors.gray
                      : "#F84D27",
                },
                styles().passwordCheck,
              ]}
            />
            <View
              style={[
                {
                  backgroundColor:
                    password.trim().length <= 7
                      ? defaultColors.gray
                      : "#FFA100",
                },
                styles().passwordCheck,
              ]}
            />
            <View
              style={[
                {
                  backgroundColor:
                    password.trim().length <= 8
                      ? defaultColors.gray
                      : "#1A9C60",
                },
                styles().passwordCheck,
              ]}
            />
          </View>
          <CtText style={{ marginLeft: 14, marginTop: -10, fontSize: 12 }}>
            {password.trim().length !== 0 ? passwordRating : ""}
          </CtText>
        </View>
      </View>
    ) : null;
  }, [password, setPassword, passwordError]);

  const onPressText = (url: String) => {
    navigation.navigate("WebViewScreen", { url: url });
  };
  console.log("init steps", steps);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: 15,
        backgroundColor: defaultColors.white,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles().scrollStyle}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            paddingBottom: 15,
            backgroundColor: defaultColors.white,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <CtText>Step {steps} of 2</CtText>
            <Progress.Bar
              width={200}
              unfilledColor={"#DFDFDF"}
              progress={steps === 1 ? 0.5 : 1}
              style={{ borderColor: "#FFF", marginVertical: 12 }}
              borderRadius={8}
            />
            <CtText
              style={{
                fontWeight: "700",
                fontSize: 25,
                fontFamily: "Figtree-Bold",
                marginTop: 32,
              }}
            >
              Let's start with your Info
            </CtText>
          </View>
          {steps === 1 ? (
            <CtView style={{ marginTop: 30 }}>
                {/* <CtView style={{
                    height: 60,
      borderRadius: 10,
      justifyContent: "center",
      //   backgroundColor: "green",
      borderWidth: 2,
      borderColor: "#DEE1E9",
      alignContent: "center",
      marginTop: 20,}}> */}

                <CtView style={styles().googleSignInContainer}>
                <TouchableOpacity style={styles().googleSignIn}>
                  <SocialIcon
                    iconSize={18}
                    light
                    raised={false}
                    type="google"
                  />
                  <CtText style={styles().buttonTitle}>
                    Continue with google
                  </CtText>
                </TouchableOpacity>
              </CtView>
                {/* </CtView> */}
              <CtView style={styles().dividerContainer}>
                <CtView style={styles().dividerStyle} />
                <CtText
                  style={{ width: 60, textAlign: "center", fontSize: 16 }}
                >
                  or
                </CtText>
                <CtView style={styles().dividerStyle} />
              </CtView>
              <CtView style={styles().textInputContainer}>
                <CtView style={styles().inputIcon2}>
                  <TouchableOpacity>
                    <Ionicons
                      name={"mail-outline"}
                      style={styles().iconStyle}
                    />
                  </TouchableOpacity>
                </CtView>
                <CtTextInput
                  editable={true}
                  placeholder={"Your email address"}
                  placeholderTextColor={defaultColors.gray}
                  style={styles().inputAlt}
                  onChangeText={(email: string) => setEmail(email)}
                  onBlur={onEmailSubmit}
                  keyboardType={"email-address"}
                  autoCapitalize="none"
                />
              </CtView>
              <ErrorMessage text={emailError} />
              <CtView style={styles().textInputContainer}>
                <CtView style={styles().inputIcon2}>
                  <TouchableOpacity>
                    <Ionicons name={"key-outline"} style={styles().iconStyle} />
                  </TouchableOpacity>
                </CtView>
                <CtTextInput
                  editable={true}
                  testID={"private"}
                  placeholder={"Password"}
                  placeholderTextColor={defaultColors.gray}
                  secureTextEntry={!showPassword}
                  style={styles().inputAlt}
                  onChangeText={(password: string) => setPassword(password)}
                  onBlur={onPasswordBlur}
                />
                {!!password && renderEyeIcon(true)}
              </CtView>
              {renderPasswordStrength}
              <ErrorMessage text={passwordError} />
              <CtView style={styles().textInputContainer}>
                <CtView style={styles().inputIcon2}>
                  <TouchableOpacity>
                    <Ionicons name={"key-outline"} style={styles().iconStyle} />
                  </TouchableOpacity>
                </CtView>
                <CtTextInput
                  testID={"private"}
                  editable={true}
                  placeholder={"Confirm Password"}
                  placeholderTextColor={defaultColors.gray}
                  secureTextEntry={!showconfrimPassword}
                  style={styles().inputAlt}
                  onChangeText={(confirmPassword: string) => {
                    setConfirmPassword(confirmPassword);
                    onConfirmPasswordBlur();
                  }}
                  onBlur={onConfirmPasswordBlur}
                />
                {!!confirmPassword && renderEyeIcon(false)}
                {!!confirmPassword
                  ? showConfrimPasswordCheck && renderCheckIcon()
                  : null}
              </CtView>
              <ErrorMessage text={confirmPasswordError} />
              {renderButton()}
              <TextButton
                description="Already have an account? "
                linkText="Sign in"
                linkTextColor={defaultColors.links}
                onPress={() => navigation.navigate("LoginScreen")}
              />
              <CtView style={[styles().keepMeContainer, { marginTop: 30 }]}>
                <CtView
                  style={{
                    flex: 0.45,
                    alignItems: "flex-end",
                  }}
                >
                  <CtText
                    style={styles().forgotTextColor}
                    onPress={() =>
                      onPressText(
                        "https://www.npmjs.com/package/react-native-webview"
                      )
                    }
                  >
                    Terms of Service
                  </CtText>
                </CtView>
                <CtView
                  style={{
                    flex: 0.1,
                    alignItems: "center",
                  }}
                >
                  <CtText style={styles().dottedStyle}>{"\u2B24"}</CtText>
                </CtView>
                <CtView
                  style={{
                    flex: 0.45,
                    justifyContent: "flex-start",
                  }}
                >
                  <CtText
                    style={styles().forgotTextColor}
                    onPress={() =>
                      onPressText(
                        "https://www.npmjs.com/package/react-native-webview"
                      )
                    }
                  >
                    Privacy Policy
                  </CtText>
                </CtView>
              </CtView>
            </CtView>
          ) : (
            <CtView style={{ marginTop: 24 }}>
              <Avatar
                icon={{ name: "person", type: "fontawesome" }}
                source={{ uri: libraryData !== null ? libraryData.uri : null }}
                onPress={() => console.log("Works!")}
                containerStyle={{
                  marginTop: 40,
                  backgroundColor: defaultColors.whisper,
                  alignSelf: "center",
                  marginBottom: 24,
                }}
                size={"xlarge"}
                activeOpacity={0.7}
                title={name.trim().length !== 0 ? name.charAt(0) : ""}
                rounded
              >
                <Accessory
                  onPress={() => handleOpenLibrary()}
                  style={{
                    backgroundColor: "#0090EE",
                    padding: 12,
                    height: 42,
                    width: 42,
                    borderRadius: 42,
                  }}
                  source={require("../../assets/add-image.png")}
                  size={32}
                  color={"#FFF"}
                  height={undefined}
                  tvParallaxProperties={undefined}
                  width={undefined}
                />
              </Avatar>
              <CtText
                style={{
                  fontWeight: "400",
                  marginTop: 42,
                  fontSize: 14,
                  fontFamily: "Figtree-Regular",
                  marginBottom: 6,
                  color:'rgba(26, 38, 58, 0.7)'
                }}
              >
                What should we call you?
              </CtText>
              <CtTextInput
                editable={true}
                placeholder={"Your name"}
                placeholderTextColor={defaultColors.darkGray}
                style={styles().input}
                onChangeText={(name: string) => setName(name)}
                onBlur={onNameSubmit}
                keyboardType={"email-address"}
              />
              <Button
                activeOpacity={1}
                disabled={name.trim() === ""}
                style={[
                  styles().button,
                  { opacity: name.trim() === "" ? 0.8 : 1 },
                ]}
                buttonText="Next →"
                onPress={() => {
                  //   setSteps(2);
                }}
              />
              <TextButton
                description=" "
                linkText={"Skip the step"}
                fontSize={15}
                linkTextColor={defaultColors.gray}
                onPress={() => {
                  //   setSteps(2);
                }}
              />
            </CtView>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      flexGrow: 1,
      paddingBottom: 15,
      backgroundColor: defaultColors.white,
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#DADADA",
      backgroundColor: "transparent",
      marginTop: 0,
      padding: 15,
      marginBottom: 24,
      borderRadius: 8,
      width: "100%",
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
    button: {
      paddingVertical: 15,
      borderRadius: 5,
      marginTop: 8,
      marginBottom: 15,
    },
    textInputContainer: {
      flex: 0,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    inputIcon: {
      flex: 0,
      position: "absolute",
      justifyContent: "flex-end",
      backgroundColor: "transparent",
      right: 12,
      top: 15,
    },
    inputIcon2: {
      flex: 0,
      position: "absolute",
      justifyContent: "flex-start",
      backgroundColor: "transparent",
      left: 12,
      top: 15,
    },
    iconStyle: {
      fontSize: 20,
      color: defaultColors.gray,
    },
    iconCheckStyle: {
      color: defaultColors.green,
      position: "absolute",
      top: 0,
      right: 30,
    },
    loading: {
      flex: 0,
    },
    passwordCheck: {
      width: 50,
      height: 6,
      marginTop: -8,
      borderRadius: 12,
      marginHorizontal: 2,
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
      //   backgroundColor: "green",
      borderWidth: 2,
      marginTop: 20,
      borderColor: "#DEE1E9",
      alignContent: "center",
    },
    buttonTitle: {
      textAlign: "center",
      fontSize: 16,
      fontFamily: "Figtree-Regular",
      color: defaultColors.primaryText,
      fontWeight: "600",
      paddingLeft: 8,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30,
      marginBottom: 30
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
    dividerStyle: { flex: 1, height: 1, backgroundColor: "#DEE1E9" },

    keepMeContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 60,
    },
  });

export default RegisterScreen;
