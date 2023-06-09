import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  View,
  Keyboard,
} from "react-native";
import {
  CtText,
  CtView,
  Button,
  TextButton,
  Divider,
} from "../components/UiComponents";
import { useDispatch } from "react-redux";
import {
  login,
  saveLoggedInSuccessUserData,
  setIsPriorYearModalSelected,
  saveGetTPAccountData,
  setProvinces,
  saveTPMyProfileInfo,
  saveRegisteredSuccessUserData,
  resetAllStateData,
  savePartnerDetails,
  saveGetTPConnectedAccountData,
} from "../store/authSlice";
import { defaultColors } from "../utils/defaultColors";
import {
  GetTaxPayerPersonalInfo,
  loginUser,
  GetTPAccountInfo,
  getAllProvince,
  SaveAccountCarryForwardInfo,
} from "../api/auth";
import { validateEmail } from "../utils/email";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import DeviceCrypto, { KeyTypes } from "react-native-device-crypto";
import { decryptAccounts } from "../utils/crypto";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  setOnBoardingData,
  resetOnBoardingData,
} from "../store/onBoardingSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import { firebase } from '@react-native-firebase/analytics';

const LoginScreen = ({ navigation }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { AllProvinces } = useSelector((state: RootState) => state.authReducer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isKeepMeSignInChecked, setKeepMeSignedIn] = useState<boolean>(false);
  const [isLoading, setisDataLoading] = useState(false);
  // biometrics related states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accounts, setAccounts] = useState(new Set([]));
  const [alias, setAlias] = React.useState<string>("test");
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: 'login_screen',
    });
  }, []);
  // this will check the device security is enabled and the level if it has a biometrics
  useEffect(() => {
    dispatch(setOnBoardingData({}));
    dispatch(setIsPriorYearModalSelected(false));
    dispatch(resetAllStateData());
    dispatch(resetOnBoardingData());
    checkSecurity();
    GetAllProvinceData();
  }, []);

  const checkSecurity = async () => {
    const securityLevel = await DeviceCrypto.deviceSecurityLevel();
    console.log("checkSecurity securityLevel", securityLevel);
    if (securityLevel === "BIOMETRY") {
      const biometricType = await DeviceCrypto.getBiometryType();
      console.log("checkSecurity biometricType", biometricType);
      if (biometricType !== "NONE") {
        setBiometricsSupported(true);
      }
    }
    console.log("checkSecurity isBiometryEnrolled", biometricsSupported);
  };

  const GetAllProvinceData = async () => {
    const allProvinceData = await getAllProvince();
    // console.log("else case on checkSub:", allProvinceData);
    if (allProvinceData) {
      // const {data} = res
      if (allProvinceData.ErrCode == -1) {
        // console.log("else case on checkSub:", allProvinceData);
        getArray();
      } else {
        dispatch(setProvinces(allProvinceData));
        // console.log("else case on checkSub:", JSON.stringify(allProvinceData));
        await AsyncStorage.setItem(
          "allProvinceData",
          JSON.stringify(allProvinceData)
        );
      }
    } else {
      // console.log("else case on checkSub:", allProvinceData);
      getArray();
      // return {}
    }
  };

  // const { isLoading, refetch } = useQuery(
  //   "login",
  //   () => loginUser({ AcctEmail: email, password: password, plain: true }),
  //   {
  //     onSuccess: async (data) => {
  const refetch = async (AcctEmail: string, pass: string) => {
    setisDataLoading(true);
    Keyboard.dismiss();
    console.log("refetch email", email);
    console.log("refetch password", password);

    const data = await loginUser({
      AcctEmail: AcctEmail,
      password: pass,
      plain: true,
    });

    console.log("loginUser login", data);

    if (data) {
      if (data.ErrCode == -1) {
        setisDataLoading(false);
        Alert.alert("Error", "Invalid email or password!");
      } else {
        const morphedData = { ...data, AcctEmail, pass };
        dispatch(login(morphedData));
        await dispatch(saveRegisteredSuccessUserData(data));
        await AsyncStorage.setItem("savedUserData", JSON.stringify(data));

        await AsyncStorage.setItem("AcctEmail", AcctEmail);
        await AsyncStorage.setItem("password", pass);

        if (data.CarryFwdState == "Y") {
          async () =>
          await firebase.analytics().logEvent('carry_fwd_state_yes', {
            AcctEmail: AcctEmail,
            data: data,
          })
          const resSaveAccountCarryForwardInfo =
            await SaveAccountCarryForwardInfo({
              AcctID: data?.AcctID,
              Year: 2022,
              userToken: data?.token,
              TaxPayerID: data?.TaxPayerID,
            });
          console.log(
            "resSaveAccountCarryForwardInfo resSaveAccountCarryForwardInfo",
            resSaveAccountCarryForwardInfo
          );

          if (resSaveAccountCarryForwardInfo) {
            onSuccessCallBack(data);
          }else {
            onSuccessCallBack(data);
          }
        } else {
          await firebase.analytics().logEvent('carry_fwd_state_no', {
            AcctEmail: AcctEmail,
            data: data,
          })
          onSuccessCallBack(data);
        }
      }
    } else {
      setisDataLoading(false);
    }
  };

  const getArray = async () => {
    try {
      const allProvinceDataArray = await AsyncStorage.getItem(
        "allProvinceData"
      );
      console.log("allProvinceDataArray:", allProvinceDataArray);

      if (allProvinceDataArray !== null) {
        // We have data!!
        console.log(JSON.parse(allProvinceDataArray));
        dispatch(setProvinces(JSON.parse(allProvinceDataArray)));
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  const onPasswordChange = () => {
    if (email && !password) {
      setPasswordError("Password is required.");
      setShowPassword(false);
    } else {
      setPasswordError(null);
    }
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

  const onSuccessCallBack = async (data: any) => {
    const GetTaxPayerPersonalResponse = await GetTaxPayerPersonalInfo({
      AcctID: data?.AcctID,
      TaxPayerID: data?.TaxPayerID,
      Year: 2022,
      userToken: data?.token,
    });

    console.log("GetTaxPayerPersonalResponse res", GetTaxPayerPersonalResponse);

    if (GetTaxPayerPersonalResponse) {
      if (data.ErrCode == -1) {
        Alert.alert("Error", "Invalid email or password!");
      } else {
        let savedDataSet = GetTaxPayerPersonalResponse;
        savedDataSet["token"] = data?.token;

        console.log("RMKR savedDataSet", savedDataSet);
        dispatch(saveRegisteredSuccessUserData(savedDataSet));
        dispatch(saveLoggedInSuccessUserData(GetTaxPayerPersonalResponse));
        await AsyncStorage.setItem(
          "getSavedLoggedInData",
          JSON.stringify(GetTaxPayerPersonalResponse)
        );
      }
    } else {
    }
    const responseGetTPAccountInfo = await GetTPAccountInfo({
      AcctID: data?.AcctID,
      TaxPayerID: data?.TaxPayerID,
      Year: 2022,
      userToken: data?.token,
    });

    console.log("GetTPAccountInfo: Success", responseGetTPAccountInfo);
    if (responseGetTPAccountInfo) {
      // const {data} = res
      if (responseGetTPAccountInfo[0].ErrCode == -1) {
        console.log(
          "GetTPAccountInfo: error error saveTPAccountData",
          responseGetTPAccountInfo
        );
        let datatSet = {
          AcctID: '',
          TaxPayerID: "RMKcreate",
          TaxPayerName: "Create a new profile"
        }
        await dispatch(saveGetTPConnectedAccountData([datatSet]));
      } else {
        let filteredData = responseGetTPAccountInfo.filter(
          (item: { TaxPayerID: any }) => {
            return item.TaxPayerID !== data?.TaxPayerID;
          }
        );
        await dispatch(saveGetTPAccountData(filteredData));
        let datatSet = {
          AcctID: '',
          TaxPayerID: "RMKcreate",
          TaxPayerName: "Create a new profile"
        }

        var updatedTPConnected = await [...responseGetTPAccountInfo, datatSet];

        console.log(
          "RMK RMK updatedTPConnected",
          updatedTPConnected
        );
        await dispatch(saveGetTPConnectedAccountData(updatedTPConnected));
        await AsyncStorage.setItem(
          "saveTPAccountData",
          JSON.stringify(filteredData)
        );
      }

      // const resGetTaxPayerMyProfileInfo = await GetTaxPayerMyProfileInfo({
      //   AcctID: data?.AcctID,
      //   TaxPayerID: data?.TaxPayerID,
      //   Year: 2022,
      //   userToken: data?.token,
      // });

      // console.log(
      //   "resGetTaxPayerMyProfileInfo res",
      //   resGetTaxPayerMyProfileInfo
      // );

      // if (resGetTaxPayerMyProfileInfo) {
      //   dispatch(saveTPMyProfileInfo(resGetTaxPayerMyProfileInfo));
      //   await AsyncStorage.setItem(
      //     "saveTPMyProfileInfo",
      //     JSON.stringify(resGetTaxPayerMyProfileInfo)
      //   );
      //   const params = {
      //     MaritialStatus: getMaritalStatusValue(
      //       resGetTaxPayerMyProfileInfo.TaxPayerMaritalStatus
      //     ),
      //     Province: {
      //       ProvinceCode: resGetTaxPayerMyProfileInfo.Province,
      //       ProvinceName:
      //         resGetTaxPayerMyProfileInfo?.Province == !null
      //           ? AllProvinces.find(
      //               (x: { ProvinceCode: any }) =>
      //                 x.ProvinceCode === resGetTaxPayerMyProfileInfo?.Province
      //             ).ProvinceName
      //           : "",
      //     },
      //     partnerName: resGetTaxPayerMyProfileInfo?.PartnerName,
      //     selectedYear: 2022,
      //     answersOfQuestions: [
      //       resGetTaxPayerMyProfileInfo.PartnerID === null ? "No" : "Yes",
      //       getRealYNValue(resGetTaxPayerMyProfileInfo.DependentStatus),
      //       getRealYNValue(resGetTaxPayerMyProfileInfo.MaritalStatusChanged),
      //     ],
      //     MaritalStatusChangedDate:
      //       resGetTaxPayerMyProfileInfo?.MaritalStatusChangedDate,
      //     TaxPayerPreviousMaritalStatus:
      //       getTaxPayerPreviousMaritalStatusValue(
      //         resGetTaxPayerMyProfileInfo?.TaxPayerPreviousMaritalStatus
      //       ),
      //     partnerFromList: "",
      //     ClaimCreditsFromSpouse:
      //       resGetTaxPayerMyProfileInfo?.ClaimCreditsFromSpouse,
      //     partnerDetailsList: responseGetTPAccountInfo,
      //   };
      //   let partnerDetails = {
      //     PartnerID: resGetTaxPayerMyProfileInfo?.PartnerID,
      //     PartnerName: resGetTaxPayerMyProfileInfo?.PartnerName,
      //     TypedPartnerName: null,
      //     SelectedPartnerID: null,
      //     SelectedPartnerName: null,
      //   };
      //   dispatch(savePartnerDetails(partnerDetails));
      //   dispatch(setOnBoardingData(params));
      //   await AsyncStorage.setItem(
      //     "partnerDetails",
      //     JSON.stringify(partnerDetails)
      //   );
      //   await AsyncStorage.setItem(
      //     "setOnBoardingData",
      //     JSON.stringify(params)
      //   );
      //   let isSetBioMetric = await AsyncStorage.getItem("isSetBioMetric");
      //   console.log("RMK authenticate isSetBioMetric", isSetBioMetric);
      //   if (isSetBioMetric !== null && isSetBioMetric == "true") {
      //     if (GetTaxPayerPersonalResponse) {
      //       if (GetTaxPayerPersonalResponse.ErrCode == -1) {
      //         // Alert.alert("Error", "Something went wrong! Please try again.");
      //         navigation.replace("ChooseAAccountScreen", {
      //           isFromRegistration: false,
      //           accountList: responseGetTPAccountInfo
      //         });
      //       } else {
      //         console.log("RMK authenticate GetTaxPayerPersonalResponse", GetTaxPayerPersonalResponse);
      //         if (GetTaxPayerPersonalResponse?.TaxID !== null) {
      //           navigation.replace("SummaryScreen");
      //         } else {
      //           navigation.replace("ChooseAAccountScreen", {
      //             isFromRegistration: false,
      //             accountList: responseGetTPAccountInfo
      //           });
      //         }
      //       }
      //     } else {
      //       navigation.replace("ChooseAAccountScreen", {
      //         isFromRegistration: false,
      //         accountList: responseGetTPAccountInfo
      //       });
      //     }
      //   } else {

      //     console.log("RMK authenticate email", biometricsSupported);
      //     if(biometricsSupported){
      //       navigation.replace("BioMetricScreen", {
      //         TaxID: GetTaxPayerPersonalResponse?.TaxID,
      //       });
      //     }else {
      //       if (GetTaxPayerPersonalResponse) {
      //       if (GetTaxPayerPersonalResponse.ErrCode == -1) {
      //         // Alert.alert("Error", "Something went wrong! Please try again.");
      //         navigation.replace("ChooseAAccountScreen", {
      //           isFromRegistration: false,
      //           accountList: responseGetTPAccountInfo
      //         });
      //       } else {
      //         console.log("RMK authenticate GetTaxPayerPersonalResponse 2", GetTaxPayerPersonalResponse);
      //         if (GetTaxPayerPersonalResponse?.TaxID !== null) {
      //           navigation.replace("SummaryScreen");
      //         } else {
      //           navigation.replace("ChooseAAccountScreen", {
      //             isFromRegistration: false,
      //             accountList: responseGetTPAccountInfo
      //           });
      //         }
      //       }
      //     } else {
      //       navigation.replace("ChooseAAccountScreen", {
      //         isFromRegistration: false,
      //         accountList: responseGetTPAccountInfo
      //       });
      //     }}

      //   }

      //   setisDataLoading(false);
      // } else {
      //   setisDataLoading(false);
      // }

      let isSetBioMetric = await AsyncStorage.getItem("isSetBioMetric");
      console.log("RMK authenticate isSetBioMetric", isSetBioMetric);
      if (isSetBioMetric !== null && isSetBioMetric == "true") {
        if (responseGetTPAccountInfo) {
          setisDataLoading(false);
          navigation.replace("ChooseAAccountScreen", {
            isFromRegistration: false,
            accountList: responseGetTPAccountInfo,
          });
        }
      } else {
        setisDataLoading(false);
        console.log("RMK authenticate email", biometricsSupported);
        if (biometricsSupported) {
          navigation.replace("BioMetricScreen", {
            accountList: responseGetTPAccountInfo,
            isFromRegistration: false,
          });
        } else {
          navigation.replace("ChooseAAccountScreen", {
            isFromRegistration: false,
            accountList: responseGetTPAccountInfo,
          });
        }
      }
    } else {
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
    let isSetBioMetric = await AsyncStorage.getItem("isSetBioMetric");
    if (isSetBioMetric !== null && isSetBioMetric == "true") {
      let AcctEmail = await AsyncStorage.getItem("AcctEmail");
      let depassword = await AsyncStorage.getItem("password");

      console.log("authenticate email", AcctEmail);
      console.log("authenticate password", depassword);
      if (AcctEmail !== null && depassword !== null) {
        setPassword(depassword);
        setEmail(AcctEmail);
        await simpleAuthentication().then(async (res) => {
          if (res === true) {
            await DeviceCrypto.getOrCreateSymmetricKey("credentials", {
              accessLevel: 0,
              invalidateOnNewBiometry: false,
            }).then(async (isAuthenticated) => {
              if (isAuthenticated === true) {
                refetch(AcctEmail, depassword);
              }
            });
          } else {
            console.log("Sorry...! Validation failed...!");
            Alert.alert("Sorry...! Validation failed...!");
          }
        });
      }
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

  const toggleCheckbox = () => {
    setKeepMeSignedIn(!isKeepMeSignInChecked);
  };

  const onPressText = (url: String) => {
    navigation.navigate("WebViewWithoutPopUp", {
      url: url,
      isFromEstimated: false,
      isShowBackButton: true,
    });
  };
  useEffect(() => {
    decrypt();
  }, []);

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 15,
        backgroundColor: darkTheme ? defaultColors.black : defaultColors.white,
      }}
    >
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          margin: 20,
          backgroundColor: darkTheme ? defaultColors.black : "white",
        }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(darkTheme).scrollStyle}
        >
          <CtView
            style={{
              marginTop: 30,
              backgroundColor: darkTheme ? defaultColors.black : "white",
            }}
          >
            <CtText style={styles().caption}>Welcome Back!</CtText>
            <CtText style={[styles(darkTheme).subTitle, { marginBottom: 60 }]}>
              Good to see you again! Sign into your account
            </CtText>
            {/* <CtView style={styles(darkTheme).googleSignInContainer}>
              <TouchableOpacity style={styles(darkTheme).googleSignIn}>
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 8,
                    backgroundColor: defaultColors.transparent,
                  }}
                  resizeMode={"contain"}
                  source={require("../../assets/google.png")}
                />

                <CtText style={styles(darkTheme).buttonTitle}>
                  Continue with Google
                </CtText>
              </TouchableOpacity>
            </CtView> */}
            {/* <View
              style={{
                height: 40,
                backgroundColor: defaultColors.transparent,

                marginBottom: 10,
                marginTop: 10,
              }}
            >
              <Divider />
            </View> */}
            {/* <CtView style={{ marginTop: 30 }}> */}
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

            <CustomInput
              editable={true}
              placeholder={"Password"}
              placeholderTextColor={defaultColors.gray}
              onChangeText={(text: string) => setPassword(text)}
              onBlur={onPasswordChange}
              autoCapitalize="none"
              validationError={passwordError}
              secureTextEntry={!showPassword}
              // customImage={require("../../assets/password.png")}
              RightImage={
                showPassword
                  ? darkTheme
                    ? require("../../assets/eyecloseDark.png")
                    : require("../../assets/eyeclose.png")
                  : darkTheme
                  ? require("../../assets/eyeDark.png")
                  : require("../../assets/eye.png")
              }
              customImage={
                darkTheme
                  ? require("../../assets/passwordDark.png")
                  : require("../../assets/password.png")
              }
              onPressRightIcon={() => setShowPassword(!showPassword)}
            />
            <View style={styles().keepMeContainer}>
              <View style={styles().KeepContainer}>
                {/* <CheckBox
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
                    /> */}
                {/* <TouchableOpacity
                  style={{ alignItems: "center", marginRight: 10 }}
                  onPress={toggleCheckbox}
                >
                  {isKeepMeSignInChecked ? (
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
                <CtText style={styles(darkTheme).forgotTextColor}>
                  Keep me signed in
                </CtText> */}
              </View>

              <CtView style={styles().forgotPassContainer}>
                <CtText
                  style={styles(darkTheme).forgotTextColor}
                  onPress={() => navigation.navigate("ForgotPasswordScreen")}
                >
                  Forgot password?
                </CtText>
              </CtView>
            </View>
            <CustomButton
              showLoading={isLoading}
              buttonText="Sign In"
              disabled={!email || !password}
              onPress={async () => {
                if (email && password) {
                  await refetch(email, password);
                } else if (email && !password) {
                  await authenticate();
                }
              }}
              style={{ marginBottom: 20, marginTop: 10 }}
            />

            <TextButton
              description="New to CloudTax? "
              linkText="Create a new account"
              linkTextColor={defaultColors.links}
              onPress={() => navigation.navigate("RegisterScreen", { step: 1 })}
            />

            <CtView style={[styles().keepMeContainer, { marginTop: 30 }]}>
              <CtView
                style={{
                  flex: 0.45,
                  alignItems: "flex-end",
                }}
              >
                <CtText
                  style={styles(darkTheme).forgotTextColor}
                  onPress={() =>
                    onPressText("https://cloudtax.ca/terms-and-conditions/")
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
                <CtText style={styles(darkTheme).dottedStyle}>
                  {"\u2B24"}
                </CtText>
              </CtView>
              <CtView
                style={{
                  flex: 0.45,
                  justifyContent: "flex-start",
                }}
              >
                <CtText
                  style={styles(darkTheme).forgotTextColor}
                  onPress={() =>
                    onPressText("https://cloudtax.ca/privacy-policy/")
                  }
                >
                  Privacy Policy
                </CtText>
              </CtView>
            </CtView>
            {/* </CtView> */}
          </CtView>
          {/* </CtView> */}
          {/* </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      // flex: 1,
      paddingBottom: 80,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      padding: 5,
    },
    container: {
      paddingHorizontal: 15,
      padding: 20,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
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
      fontWeight: "700",
    },
    subTitle: {
      marginTop: 5,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Figtree-Regular",
      fontWeight: "400",
      color: isDarkTheme
        ? defaultColors.whiteGrey
        : defaultColors.secondaryTextColor,
    },
    buttonTitle: {
      textAlign: "center",
      fontSize: 16,
      fontFamily: "Figtree-Bold",
      color: isDarkTheme
        ? defaultColors.white
        : defaultColors.secondaryTextColor,
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
      marginBottom: 15,
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
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      flexDirection: "row",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
    googleSignInContainer: {
      height: 54,
      borderRadius: 10,
      justifyContent: "center",
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      borderWidth: 2,
      marginTop: 20,
      borderColor: isDarkTheme ? defaultColors.darkBorder : "#DEE1E9",
      alignContent: "center",
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30,
      marginBottom: 30,
    },
    dividerStyle: { flex: 1, height: 1, backgroundColor: "#DEE1E9" },
    inputIcon2: {
      flex: 0,
      position: "absolute",
      justifyContent: "center",
      backgroundColor: "transparent",
      left: 12,
      top: 18,
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
      color: isDarkTheme
        ? defaultColors.white
        : defaultColors.secondaryTextColor,
      fontSize: 16,
      fontWeight: "400",
    },
    dottedStyle: {
      color: isDarkTheme
        ? defaultColors.white
        : defaultColors.secondaryTextColor,
      fontSize: 8,
      fontWeight: "400",
    },
  });

export default LoginScreen;
