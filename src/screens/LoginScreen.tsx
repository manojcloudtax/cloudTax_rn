import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  CtText,
  CtView,
  CtTextInput,
  Button,
  TextButton,
} from "../components/UiComponents";
import { Spinner, ErrorMessage } from "../components";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { defaultColors } from "../utils/defaultColors";
import { loginUser } from "../api/auth";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import { validateEmail } from "../utils/email";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Ionicons, Feather } from "@expo/vector-icons";

import DeviceCrypto from "react-native-device-crypto";
import { decryptAccounts } from "../utils/crypto";
import { SafeAreaView } from "react-native-safe-area-context";
import { SocialIcon } from "react-native-elements";
import CheckBox from "@react-native-community/checkbox";

const LoginScreen = ({ navigation }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isKeepMeSignInChecked, setKeepMeSignedIn] = useState<boolean>(false);

  // biometrics related states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accounts, setAccounts] = useState(new Set([]));
  const [selectedAccount, setSelectedAccount] = useState<null | any>(null);

  const dispatch = useDispatch();

  const { isLoading, refetch } = useQuery(
    "login",
    () => loginUser({ email, password }),
    {
      onSuccess: (data) => {
        const morphedData = { ...data, email, password };
        dispatch(login(morphedData));
      },
      onError: (error: any) => {
        if (error.message == "Request failed with status code 401") {
          Alert.alert(
            "Error",
            "Invalid email or password! Please check your credentials and try again."
          );
        } else {
          Alert.alert("Error", "Something went wrong! Please try again.");
        }
      },
      retry: false,
      enabled: false,
    }
  );

  // this will check the device security is enabled and the level if it has a biometrics
  useEffect(() => {
    // AsyncStorage.clear()
    const checkSecurity = async () => {
      const securityLevel = await DeviceCrypto.deviceSecurityLevel();
      if (securityLevel === "BIOMETRY") {
        const biometricType = await DeviceCrypto.getBiometryType();
        if (biometricType !== "NONE") {
          setBiometricsSupported(true);
        }
      }
    };
    checkSecurity();
  }, []);

  const onPasswordChange = () => {
    if (email && !password) {
      setPasswordError("Password is required.");
      setShowPassword(false);
    } else {
      setPasswordError(null);
    }
  };

  const renderButton = useMemo(() => {
    const disabled = !email;
    const style = disabled
      ? [styles().button, { opacity: 0.6 }]
      : styles().button;
    if (!isLoading) {
      return (
        <>
          <Button
            disabled={disabled}
            style={style}
            buttonText="Sign In"
            onPress={async () => {
              if (email && password) {
                await refetch();
              } else if (email && !password) {
                await authenticate();
              }
            }}
          />
        </>
      );
    } else {
      return <Spinner />;
    }
  }, [selectedAccount, email, password]);

  const renderEyeIcon = () => {
    return (
      <CtView style={styles().inputIcon}>
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome5
            name={!showPassword ? "eye" : "eye-slash"}
            style={styles().iconStyle}
          />
        </TouchableOpacity>
      </CtView>
    );
  };

  const decrypt = async () => {
    try {
      const res = await decryptAccounts();
      if (res) {
        const result = res.split(",");
        const x = new Set(result.filter((entry) => entry.length !== 0));
        const data = [...x];

        const transformedData = data
          .map((x, index) => {
            const entry = x.split(" ");
            // this will be the radio buttons.
            const pass = entry[0];
            const mail = entry[1];

            const radio = {
              id: index,
              label: mail,
              title: mail,
              value: {
                password: pass,
                email: mail,
              },
              labelStyle: {
                width: 240,
                marginLeft: 12,
              },
              size: 28,
            };
            return radio;
          })
          .filter((x) => x.label !== null);
        setAccounts(transformedData as never);
      }
    } catch (err: any) {
      console.log("error in decrypt", err);
    }
  };

  const simpleAuthentication = async () => {
    try {
      const res = await DeviceCrypto.authenticateWithBiometry({
        biometryDescription: "Validate authentication",
        biometrySubTitle: "",
        biometryTitle: "Validation",
      });
      await setIsAuthenticated(res);
      return res;
    } catch (err: any) {
      console.log("error in Authentication", err);
    }
  };

  const authenticate = async () => {
    await simpleAuthentication().then(async (res) => {
      if (res === true) {
        await DeviceCrypto.getOrCreateSymmetricKey("credentials", {
          accessLevel: 0,
          invalidateOnNewBiometry: false,
        }).then(async (isAuthenticated) => {
          if (isAuthenticated === true) {
            setEmail(selectedAccount.value.email);
            setPassword(selectedAccount.value.password);
            refetch();
          }
        });
      } else {
        console.log("try again, validation failed");
      }
    });
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

  const toggleCheckbox = () => {
    setKeepMeSignedIn(!isKeepMeSignInChecked);
  };

  const onPressText = (url: String) =>{
    navigation.navigate("WebViewScreen", { url: url })
  }
  useEffect(() => {
    decrypt();
  }, []);

  useEffect(() => {
    if (selectedAccount !== null) {
      authenticate();
    }
  }, [selectedAccount]);

  return (
    <SafeAreaView style={styles().scrollStyle}>
      <ScrollView
        style={styles().scrollStyle}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <CtView style={styles().container}>
            <CtView style={styles().TopTextContainer}>
              <CtText style={styles().caption}>Welcome Back!</CtText>
              <CtText style={styles().subTitle}>
                Good to see you again! Sign into your account
              </CtText>
            </CtView>
            <CtView style={styles().BottomViewContainer}>
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
              <CtView style={styles().dividerContainer}>
                <CtView style={styles().dividerStyle} />
                <CtText
                  style={{ width: 60, textAlign: "center", fontSize: 16 }}
                >
                  or
                </CtText>
                <CtView style={styles().dividerStyle} />
              </CtView>
              <CtView style={{ marginTop: 30 }}>
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
                      <Ionicons name={"key"} style={styles().iconStyle} />
                    </TouchableOpacity>
                  </CtView>
                  <CtTextInput
                    testID={"private"}
                    value={password}
                    editable={true}
                    placeholder={"Password"}
                    placeholderTextColor={defaultColors.gray}
                    secureTextEntry={!showPassword}
                    style={styles().inputAlt}
                    onChangeText={(text: string) => setPassword(text)}
                    onBlur={onPasswordChange}
                    autoCapitalize="none"
                  />
                  {renderEyeIcon()}
                </CtView>
                <ErrorMessage text={passwordError} />
                <CtView style={styles().keepMeContainer}>
                  <CtView style={styles().KeepContainer}>
                    <CheckBox
                      lineWidth={1}
                      boxType={"square"}
                      value={isKeepMeSignInChecked}
                      onValueChange={toggleCheckbox}
                      style={{
                        alignSelf: "center",
                        width: 20,
                        height: 20,
                        marginRight: 10,
                        borderRadius: 5,
                      }}
                      onFillColor={defaultColors.primaryButton}
                      onCheckColor={defaultColors.white}
                    />
                    <CtText style={styles().forgotTextColor}>
                      Keep me signed in
                    </CtText>
                  </CtView>

                  <CtView style={styles().forgotPassContainer}>
                    <CtText style={styles().forgotTextColor}>
                      Forgot password?
                    </CtText>
                  </CtView>
                </CtView>
                <CtView style={styles().buttonContainer}>{renderButton}</CtView>

                <TextButton
                  description="New to Cloud Tax? "
                  linkText="Create a new account"
                  linkTextColor={defaultColors.links}
                  onPress={() =>
                    navigation.navigate("RegisterScreen", { step: 1 })
                  }
                />

                <CtView style={[styles().keepMeContainer, {marginTop: 30}]}>
                  <CtView
                    style={{
                      flex: 0.45,
                      alignItems: "flex-end",
                    }}
                  >
                    <CtText style={styles().forgotTextColor} onPress={() => onPressText('https://www.npmjs.com/package/react-native-webview')}>
                      Terms of Service
                    </CtText>
                  </CtView>
                  <CtView
                    style={{
                      flex: 0.1,
                      alignItems: "center",
                    }}
                  >
                    <CtText style={styles().dottedStyle}>{'\u2B24'}</CtText>
                  </CtView>
                  <CtView
                    style={{
                      flex: 0.45,
                      justifyContent: "flex-start",
                    }}
                  >
                    <CtText style={styles().forgotTextColor} onPress={() => onPressText('https://www.npmjs.com/package/react-native-webview')}>
                      Privacy Policy
                    </CtText>
                  </CtView>
                </CtView>
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
      backgroundColor: defaultColors.white,
    },
    container: {
      paddingHorizontal: 15,
      padding: 20,
    },
    BottomViewContainer: {
      marginTop: 10,
    },
    TopTextContainer: {
      marginTop: 40,
    },
    caption: {
      textAlign: "center",
      fontSize: 25,
      fontFamily: "Figtree-Bold",
      fontWeight: "700"
    },
    subTitle: {
      marginTop: 5,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Figtree-Regular",
      fontWeight: "400",
      color: "rgba(26, 38, 58, 0.7)"
    },
    buttonTitle: {
      textAlign: "center",
      fontSize: 16,
      fontFamily: "Figtree-Regular",
      color: defaultColors.primaryText,
      fontWeight: "600",
      paddingLeft: 8,
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
      justifyContent: "space-between",
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
    dottedStyle:{
        color: "rgba(26, 38, 58, 0.7)",
        fontSize: 8,
        fontWeight: "400",
      }
  });

export default LoginScreen;
