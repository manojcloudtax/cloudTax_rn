import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  View,
} from "react-native";
import {
  CtText,
  CtView,
  CtTextInput,
  Button,
  TextButton,
  Divider,
} from "../components/UiComponents";
import { Spinner, ErrorMessage } from "../components";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { defaultColors } from "../utils/defaultColors";
import auth, { loginUser } from "../api/auth";
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

const VerifyEmailScreen = ({ navigation }: any) => {
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
  return (
    <SafeAreaView style={styles().scrollStyle}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 0.6,
            backgroundColor: "red",
          }}
        ></View>

        <View
          style={{
            flex: 0.1,
            height:42,
            marginLeft: 20,
            marginRight: 20,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <CtText
            style={{
              textAlign: "center",
              fontSize: 35,
              fontFamily:'Figtree-SemiBold',
              fontWeight: "600",
              color: "#1A263A",
            }}
          >
            Verify your email
          </CtText>
        </View>

        <View
          style={{
            flex: 0.2,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 30,
            display:"flex",
            justifyContent:"center",
          }}
        >
          <CtText
            style={{
              textAlign: "center",
              fontSize: 18,
              fontFamily: "Figtree",
              fontWeight: "500",
              color: "#1A263AB2",
            }}
          >
            Thanks for signing up! Before getting started, could you verify your
            email address by clicking on the link we just emailed to
            kristin@cloudtax.com
          </CtText>
        </View>

        <View
          style={{
            flex:0.1,
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 30,
            marginTop:30,
            borderRadius:10,
            display:"flex",
            justifyContent:"center",
            height:54,
            backgroundColor: "#0090EE"
          }}
        >
            <CtText
            style={{
                marginTop:16,
                marginBottom:16,
                textAlign: "center",
                fontSize: 18,
                fontFamily:'Figtree-SemiBold',
                fontWeight: "600",
                color: "#FFFFFF"
            }}
          >
            Resend verification email
          </CtText>
        </View>
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
      flex: 1,
    },
    BottomViewContainer: {
      backgroundColor: defaultColors.white,
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

export default VerifyEmailScreen;
