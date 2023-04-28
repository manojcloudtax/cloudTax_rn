import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Accessory } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";

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
  Image,
  PermissionsAndroid,
} from "react-native";
import {
  CtText,
  CtView,
  Button,
  TextButton,
  Divider,
} from "../components/UiComponents";
import { CommonModal } from "../components";

import { defaultColors } from "../utils/defaultColors";

import { validateEmail } from "../utils/email";
import { validatePassword } from "../utils/password";
import { useQuery } from "react-query";
import {
  registerUser,
  SaveTaxpayerProfileInfo,
  GetTaxPayerMyProfileInfo,
  GetTaxPayerPersonalInfo,
  SendGirdContactUpdate,
} from "../api/auth";
import {
  imageUpload,
  saveRegisteredSuccessUserData,
  saveTPMyProfileInfo,
  setIsPriorYearModalSelected,
  saveLoggedInSuccessUserData,
  resetAllStateData,
  savePartnerDetails,
  saveGetTPAccountData,
} from "../store/authSlice";
import { RootState } from "../store";
import axios from "axios";
import {
  resetOnBoardingData,
  setOnBoardingData,
} from "../store/onBoardingSlice";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Constants } from "../utils/Constants";
import { firebase } from "@react-native-firebase/analytics";
import moment from "moment";

const RegisterScreen = ({ navigation, route }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { savedUserData } = useSelector(
    (state: RootState) => state.authReducer
  );
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
  const [loadingAvailable, setisLoading] = useState<boolean>(false);
  const [isShowModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: "register_screen",
    });
  }, []);
  useEffect(() => {
    try {
      dispatch(setOnBoardingData({}));
      dispatch(setIsPriorYearModalSelected(false));
      dispatch(resetAllStateData());
      dispatch(resetOnBoardingData());
      setisLoading(false);
      if (route.params !== undefined) {
        const { step } = route.params;
        setSteps(step);
      }
    } catch (error) {}
  }, []);

  const { isLoading, refetch } = useQuery(
    "UserRegistration",
    () =>
      registerUser({
        AcctEmail: email,
        firstname: name,
        lastname: "",
        password: password,
        plain: true,
        Year: 2022,
      }),
    {
      onSuccess: async (data) => {
        console.log("REGISTERED", data);
        if (data.ErrCode == -1) {
          if (data.ErrMsg == "Sorry, Given email was already registered!") {
            Alert.alert("Sorry, Given email was already registered!");
          } else {
            Alert.alert("Something went wrong, please try again.");
          }
        } else {
          const formattedDate = moment().format("MM/DD/YYYY");
          let postData = {
            TaxPayerID: data?.TaxPayerID,
            AcctID: data?.AcctID,
            Year: 2022,
            data: { AccountCreated: formattedDate },
          }
          const resSendGirdContactUpdate = await SendGirdContactUpdate(
            postData,
            data?.token
          );
         
          console.log("resSendGirdContactUpdate", resSendGirdContactUpdate);
          const GetTaxPayerPersonalResponse = await GetTaxPayerPersonalInfo({
            AcctID: data?.AcctID,
            TaxPayerID: data?.TaxPayerID,
            Year: 2022,
            userToken: data?.token,
          });

          console.log(
            "resGetTaxPayerMyProfileInfo res",
            GetTaxPayerPersonalResponse
          );

          if (GetTaxPayerPersonalResponse) {
            if (data.ErrCode == -1) {
              Alert.alert("Error", "Invalid email or password!");
            } else {
              dispatch(
                saveLoggedInSuccessUserData(GetTaxPayerPersonalResponse)
              );
              await AsyncStorage.setItem(
                "getSavedLoggedInData",
                JSON.stringify(GetTaxPayerPersonalResponse)
              );
              await AsyncStorage.setItem("setOnBoardingData", "");
              await AsyncStorage.setItem("isSetBioMetric", "");
              dispatch(setOnBoardingData({}));
              dispatch(saveGetTPAccountData([]));
            }
          } else {
          }
          await AsyncStorage.setItem("savedUserData", JSON.stringify(data));
          await dispatch(saveRegisteredSuccessUserData(data));
          setSteps(2);
        }
      },
      onError: (data) => {
        console.log("ERROR", data);
        Alert.alert("Something went wrong, please try again.");
      },
      enabled: false,
    }
  );

  const onPressLastStep = async () => {
    setisLoading(true);

    console.log("onPressLastStep savedUserData", savedUserData);
    const resSaveTaxpayer = await SaveTaxpayerProfileInfo({
      AcctEmail: savedUserData.email,
      AcctID: savedUserData.AcctID,
      FirstName: name,
      PartnerID: savedUserData.PartnerID,
      TaxPayerID: savedUserData.TaxPayerID,
      TaxPayerName: name,
      Year: 2022,
      token: savedUserData.token,
    });
    console.log("onPressLastStep SaveTaxpayerProfileInfo res", resSaveTaxpayer);
    if (resSaveTaxpayer) {
      if (resSaveTaxpayer.ErrCode == -1) {
        setisLoading(false);
        console.log(
          "onPressLastStep SaveTaxpayerProfileInfo error",
          resSaveTaxpayer
        );
      } else {
        console.log(
          "onPressLastStep SaveTaxpayerProfileInfo success",
          resSaveTaxpayer
        );
        if (libraryData) {
          dispatch(imageUpload(libraryData));
          let formData = new FormData();
          formData.append("profileImg", {
            uri: libraryData.path,
            type: libraryData.mime,
            name: libraryData.modificationDate,
          });
          const config = {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: `Bearer ${savedUserData.token}`,
            },
          };
          axios
            .post(Constants.baseURL + "/user/profile-img", formData, config)
            .then((res) => {
              setisLoading(false);
              console.log(res + "this is data after image upload");
            })
            .catch((err) => console.log(err));
        }

        const resGetTPAccountInfo = await GetTaxPayerMyProfileInfo({
          AcctID: savedUserData.AcctID,
          TaxPayerID: savedUserData.TaxPayerID,
          Year: 2022,
          userToken: savedUserData.token,
        });
        if (resGetTPAccountInfo) {
          setisLoading(false);
          if (resGetTPAccountInfo.ErrCode == -1) {
            setisLoading(false);
            console.log("resGetTPAccountInfo err:", resGetTPAccountInfo);
          } else {
            setisLoading(false);
            console.log("resGetTPAccountInfo success", resGetTPAccountInfo);
            dispatch(saveTPMyProfileInfo(resGetTPAccountInfo));
            await AsyncStorage.setItem(
              "saveTPMyProfileInfo",
              JSON.stringify(resGetTPAccountInfo)
            );
            let partnerDetails = {
              PartnerID: resGetTPAccountInfo?.PartnerID,
              PartnerName: resGetTPAccountInfo?.PartnerName,
              TypedPartnerName: null,
              SelectedPartnerID: null,
              SelectedPartnerName: null,
            };
            dispatch(savePartnerDetails(partnerDetails));
            await AsyncStorage.setItem(
              "partnerDetails",
              JSON.stringify(partnerDetails)
            );
            navigation.navigate("ChooseTaxYearScreen", {
              isFromRegistration: true,
            });
            await firebase
              .analytics()
              .logEvent("saved_userdataof_registred_user", {
                savedUserData: savedUserData,
              });
            await AsyncStorage.setItem("isSetBioMetric", "");
          }
        } else {
          setisLoading(false);
          console.log("resGetTPAccountInfo else");
        }
      }
    } else {
      setisLoading(false);
      console.log("resGetTPAccountInfo checkSub:");
      // return {}
    }
  };

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
    console.log("Password is required.", email);
    console.log("Password is required.", password);
    console.log("Password is required.", confirmPassword);
    console.log("Password is required.", emailError);
    console.log("Password is required.", passwordError);
    console.log("Password is required.", confirmPasswordError);

    if (!password) {
      setPasswordError("Password is required.");
      setShowPassword(false);
      setShowConfrimPasswordCheck(false);
    } else if (!validatePassword(password)) {
      setPasswordError("Please choose a strong password");
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

  const onPressCamera = () => {
    setShowModal(false);
    setTimeout(async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "CloudTax App Camera Permission",
              message: "Allow CloudTax to take pictures.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("CAMERA permission allow");
            ImagePicker.openCamera({
              width: 300,
              height: 300,
              cropping: true,
              cropperCircleOverlay: true,
              mediaType: "photo",
            })
              .then((image) => {
                console.log("received base64 image", image);
                setLibraryData(image);
              })
              .catch((e) => console.log("received base64 image", e));
          } else {
            console.log("CAMERA permission denied");
            alert("CAMERA permission denied");
          }
        } catch (e) {
          console.log("catch", e);
        }
      }
    }, 500);
  };

  const onPressLibrary = () => {
    setShowModal(false);
    setTimeout(async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("CAMERA permission allow");
            ImagePicker.openPicker({
              // width: 300,
              // height: 400,
              cropping: true,
              mediaType: "photo",
            })
              .then((image) => {
                console.log("received base64 image", image);
                setLibraryData(image);
              })
              .catch((e) => console.log("received base64 image", e));
          } else {
            console.log("CAMERA permission denied");
            alert("CAMERA permission denied");
          }
        } catch (e) {
          console.log("catch", e);
        }
      }
    }, 500);
  };

  const confirmationModal = () => {
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
              fontSize: 15,
              textAlign: "center",
              color: defaultColors.white,
              fontFamily: "Figtree-SemiBold",
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
            onPress={() => onPressCamera()}
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
            onPress={() => onPressLibrary()}
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
            onPress={() => onBackdropPress()}
            style={{
              paddingVertical: 16,
              borderRadius: 10,
              backgroundColor: defaultColors.matBlack,
              marginBottom: 10,
              // borderTopColor: defaultColors.darkBorder,
              // borderTopWidth: 2,
              // borderBottomColor: defaultColors.darkBorder,
              // borderBottomWidth: 2,
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

  function getPasswordStrength(password: any) {
    // Define the regular expressions to match different types of characters
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /[0-9]/;
    const symbolRegex = /[\W_]/;

    // Check the length of the password
    if (password.length < 6) {
      return "weak";
    }

    // Check if the password contains at least one lowercase letter, uppercase letter, digit, and symbol
    if (
      !lowercaseRegex.test(password) ||
      !uppercaseRegex.test(password) ||
      !digitRegex.test(password) ||
      !symbolRegex.test(password)
    ) {
      return "normal";
    }

    // Otherwise, the password is considered strong
    return "strong";
  }

  const renderPasswordStrength = useMemo(() => {
    // let passwordLength = password.length;
    let passwordRating = "";

    const PSStrength = getPasswordStrength(password);

    if (PSStrength == "normal") {
      passwordRating = "could be stronger";
    } else if (PSStrength == "strong") {
      passwordRating = "strong password";
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
                    PSStrength == "weak" ||
                    PSStrength == "normal" ||
                    PSStrength == "strong"
                      ? "#F84D27"
                      : defaultColors.gray,
                },
                styles().passwordCheck,
              ]}
            />
            <View
              style={[
                {
                  backgroundColor:
                    PSStrength == "normal" || PSStrength == "strong"
                      ? "#FFA100"
                      : defaultColors.gray,
                },
                styles().passwordCheck,
              ]}
            />
            <View
              style={[
                {
                  backgroundColor:
                    PSStrength == "strong" ? "#1A9C60" : defaultColors.gray,
                },
                styles().passwordCheck,
              ]}
            />
          </View>
          <CtText style={{ marginLeft: 14, marginTop: -8, fontSize: 12 }}>
            {password.trim().length !== 0 ? passwordRating : ""}
          </CtText>
        </View>
      </View>
    ) : null;
  }, [password, setPassword, passwordError]);

  const onPressText = (url: String) => {
    navigation.navigate("WebViewWithoutPopUp", {
      url: url,
      isFromEstimated: false,
      isShowBackButton: true,
    });
  };

  const onBackdropPress = () => {
    setShowModal(false);
  };
  console.log("init steps", isShowModal);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 15,
        backgroundColor: darkTheme ? defaultColors.black : defaultColors.white,
      }}
    >
      <CommonModal
        isShowModal={isShowModal}
        ChildView={confirmationModal()}
        onBackdropPress={() => onBackdropPress()}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          // flex: 1,
          // paddingBottom: 15,
          backgroundColor: darkTheme
            ? defaultColors.black
            : defaultColors.white,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(darkTheme).scrollStyle}
          keyboardShouldPersistTaps="handled"
          // automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ alignItems: "center" }}>
            {/* <CtText
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: darkTheme ? defaultColors.white : defaultColors.black,
              }}
            >
              Step {steps} of 2
            </CtText>
            <Progress.Bar
              width={200}
              unfilledColor={"#DFDFDF"}
              color={"#0A98FF"}
              progress={steps === 1 ? 0.5 : 1}
              style={{ borderColor: "#FFF", marginVertical: 12 }}
              borderRadius={8}
            /> */}
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
            <CtView style={{ marginTop: 30, marginBottom: 60 }}>
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
                    Continue with google
                  </CtText>
                </TouchableOpacity>
              </CtView>
              <View
                style={{
                  height: 40,
                  backgroundColor: defaultColors.transparent,

                  marginBottom: 10,
                  marginTop: 10,
                }}
              >
                <Divider />
              </View> */}
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
                onChangeText={(text: string) => {
                  setPassword(text), setPasswordError("");
                }}
                onBlur={onPasswordBlur}
                autoCapitalize="none"
                validationError={passwordError}
                secureTextEntry={!showPassword}
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

              {renderPasswordStrength}
              <CustomInput
                editable={true}
                placeholder={"Confirm Password"}
                placeholderTextColor={defaultColors.gray}
                // onChangeText={(text: string) => setPassword(text)}
                onBlur={onConfirmPasswordBlur}
                autoCapitalize="none"
                validationError={confirmPasswordError}
                secureTextEntry={!showconfrimPassword}
                RightImage={
                  showconfrimPassword
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
                onChangeText={(confirmPassword: string) => {
                  setConfirmPassword(confirmPassword);
                  onConfirmPasswordBlur();
                  setConfirmPasswordError("");
                }}
                onPressRightIcon={() =>
                  setShowConfrimPassword(!showconfrimPassword)
                }
              />
              <CustomButton
                buttonText="Create a new account"
                disabled={
                  (email == "" && password == "" && confirmPassword == "") ||
                  emailError !== null ||
                  passwordError !== null ||
                  confirmPasswordError !== null
                }
                onPress={() => refetch()}
                showLoading={isLoading}
                style={{ marginBottom: 30, marginTop: 10 }}
              />
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
            </CtView>
          ) : (
            <CtView style={{ marginTop: 24 }}>
              {libraryData == null ? (
                <Avatar
                  size={"xlarge"}
                  rounded
                  icon={{ name: "person", type: "fontawesome" }}
                  containerStyle={{
                    marginTop: 40,
                    backgroundColor: defaultColors.whisper,
                    alignSelf: "center",
                    marginBottom: 24,
                  }}
                  title={name.trim().length !== 0 ? name.charAt(0) : ""}
                  onPress={() => console.log("Works!")}
                  activeOpacity={0.7}
                >
                  <Accessory
                    onPress={() => setShowModal(true)}
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
              ) : (
                <Avatar
                  size={"xlarge"}
                  rounded
                  icon={{ name: "person", type: "fontawesome" }}
                  containerStyle={{
                    marginTop: 40,
                    backgroundColor: defaultColors.whisper,
                    alignSelf: "center",
                    marginBottom: 24,
                  }}
                  source={{ uri: libraryData.path }}
                  title={name.trim().length !== 0 ? name.charAt(0) : ""}
                  onPress={() => console.log("Works!")}
                  activeOpacity={0.7}
                >
                  <Accessory
                    onPress={() => setShowModal(true)}
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
              )}
              <CtText
                style={{
                  fontWeight: "400",
                  marginTop: 42,
                  fontSize: 14,
                  fontFamily: "Figtree-Regular",
                  marginBottom: 6,
                  color: darkTheme
                    ? defaultColors.white
                    : defaultColors.secondaryTextColor,
                }}
              >
                What should we call you?
              </CtText>
              <CustomInput
                editable={true}
                placeholder={"Your name"}
                placeholderTextColor={defaultColors.gray}
                onChangeText={(name: string) => setName(name)}
                onBlur={onNameSubmit}
                value={name}
                // autoCapitalize="none"
              />

              {/* {renderNextButton()} */}
              <CustomButton
                showLoading={loadingAvailable}
                buttonText="Next"
                disabled={!name || nameError}
                onPress={() => onPressLastStep()}
                style={{ marginBottom: 20 }}
              />
            </CtView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      // flexGrow: 1,
      paddingBottom: 80,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#DADADA",
      backgroundColor: "transparent",
      marginTop: 10,
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
      justifyContent: "center",
      backgroundColor: "transparent",
      left: 12,
      // top: 18,

      top: 18,
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
      width: Dimensions.get("window").width / 5,
      height: 6,
      marginTop: -5,
      borderRadius: 12,
      marginHorizontal: 2,
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
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30,
      marginBottom: 30,
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
    dividerStyle: { flex: 1, height: 1, backgroundColor: "#DEE1E9" },

    keepMeContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 60,
    },
  });

export default RegisterScreen;
