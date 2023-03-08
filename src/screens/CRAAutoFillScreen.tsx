import React, { useEffect, useMemo, useState, useRef, createRef } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { CtText, CtView, CtTextInput } from "../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../components/CustomButton";
import { Header } from "../components/Header";
import { Button } from "../components/UiComponents";
import {
  GetAfrUrl,
  GetSlips,
  GetTaxPayerPersonalInfo,
  SaveTaxPayerPersonalInfo,
} from "../api/auth";
import { saveLoggedInSuccessUserData } from "../store/authSlice";
import { CommonModal } from "../components";
import { BottomButton } from "../components/BottomButton";

const CRAAutoFillScreen = ({ navigation, route }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [firstText, setFirstTextInputValue] = useState("");
  const [secondText, setScondTextInputValue] = useState("");
  const [thirdText, setThirdTextInputValue] = useState("");
  const [isEnable, setButtonEnable] = useState(false);
  const [isShowModal, setShowModal] = useState(false);
  const [key, setKeyToRerender] = useState(1);
  let secondInput = useRef<TextInput>();
  let thirdInput = useRef<TextInput>();
  let firstInput = useRef<TextInput>();
  const [loadingAvailable, setisLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { getSavedLoggedInData, savedUserData } = useSelector(
    (state: RootState) => state.authReducer
  );
  useEffect(() => {
    try {
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

  const onPressConfirm = async () => {
    console.log("onPressConfirm", firstText + secondText + thirdText);

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
        // successApiCall();
        setShowModal(true);
      } else {
        Alert.alert("Please enter valid SIN Number..!");
      }
    }
  };

  const successApiCall = async () =>{
    let SinNumber = firstText + secondText + thirdText;
    console.log("thirdText.SinNumber", SinNumber);
    setisLoading(true);
    const resGetTaxPayerMyProfileInfo = await GetTaxPayerPersonalInfo({
      AcctID: savedUserData?.AcctID,
      TaxPayerID: savedUserData?.TaxPayerID,
      Year: 2022,
      userToken: savedUserData?.token,
    });
    console.log(
      "resGetTaxPayerMyProfileInfo res",
      resGetTaxPayerMyProfileInfo
    );
    if (resGetTaxPayerMyProfileInfo) {
      if (resGetTaxPayerMyProfileInfo.ErrCode == -1) {
      }
      const resSaveTaxPayerPersonal = await SaveTaxPayerPersonalInfo({
        TaxPayerID: resGetTaxPayerMyProfileInfo?.TaxPayerID,
        Year: 2022,
        TaxID: resGetTaxPayerMyProfileInfo?.TaxID,
        TaxPayerName: resGetTaxPayerMyProfileInfo?.TaxPayerName,
        TaxPayerMiddleName: resGetTaxPayerMyProfileInfo?.TaxPayerMiddleName,
        TaxPayerLastName: resGetTaxPayerMyProfileInfo?.TaxPayerLastName,
        TaxPayerSIN: SinNumber,
        TaxPayerBirthDate: resGetTaxPayerMyProfileInfo?.TaxPayerBirthDate,
        DefaultBirthDate: resGetTaxPayerMyProfileInfo?.DefaultBirthDate,
        NameChangedStatus: resGetTaxPayerMyProfileInfo?.NameChangedStatus,
        DisabledStatus: resGetTaxPayerMyProfileInfo?.DisabledStatus,
        FirstYearClaimingStatus:
          resGetTaxPayerMyProfileInfo?.FirstYearClaimingStatus,
        Province: resGetTaxPayerMyProfileInfo?.Province,
        T2201ApprovedStatus:
          resGetTaxPayerMyProfileInfo?.T2201ApprovedStatus,
        ConfinedToPrisonStatus:
          resGetTaxPayerMyProfileInfo?.ConfinedToPrisonStatus,
        PeriodOfTime: resGetTaxPayerMyProfileInfo?.PeriodOfTime,
        TaxPayerMaritalStatus:
          resGetTaxPayerMyProfileInfo?.TaxPayerMaritalStatus,
        TaxPayerDeathDate: resGetTaxPayerMyProfileInfo?.TaxPayerDeathDate,
        ClaimCAICreditForSelf:
          resGetTaxPayerMyProfileInfo?.ClaimCAICreditForSelf,
        NetfileAccessCode: resGetTaxPayerMyProfileInfo?.NetfileAccessCode,
        userToken: savedUserData?.token,
      });
      console.log(
        "onPressLastStep SaveTaxpayerProfileInfo res",
        resSaveTaxPayerPersonal
      );
      if (resSaveTaxPayerPersonal) {
        if (resSaveTaxPayerPersonal.ErrCode == -1) {
          setisLoading(false);
          // Alert.alert("Something went wrong..! Please try again..!");
          // return;
        }

        let updatedData = resGetTaxPayerMyProfileInfo;
        updatedData['TaxPayerSocialInsuranceNumber'] = SinNumber
        dispatch(saveLoggedInSuccessUserData(resGetTaxPayerMyProfileInfo));
        const GetSlipsfileRes = await GetSlips(
          {
            TaxID: resGetTaxPayerMyProfileInfo?.TaxID,
            AcctID: savedUserData?.AcctID,
            TaxPayerID: savedUserData?.TaxPayerID,
            Year: 2022,
            year: 2022,
          },
          savedUserData?.token
        );
        console.log("Hello GetSlipsfileRes", GetSlipsfileRes);

        if (GetSlipsfileRes == null) {
          const resGetAfrUrl = await GetAfrUrl({
            Sin: SinNumber,
            appType: "FREE",
            Year: 2022,
            userToken: savedUserData?.token,
          });
          console.log("resGetAfrUrl checkSub:", resGetAfrUrl);
          if (resGetAfrUrl) {
            setisLoading(false);
            if (resGetAfrUrl?.status == 500) {
              Alert.alert("Error..!", resGetAfrUrl.data?.message);
            } else if (resGetAfrUrl.ErrCode == -1) {
              Alert.alert("Something went wrong..! Please try again..!");
            } else {
              navigation.navigate("WebViewScreen", {
                url: resGetAfrUrl?.url,
              });
            }
          } else {
            setisLoading(false);
            Alert.alert("Something went wrong..! Please try again..!");
            console.log("resGetAfrUrl checkSub:");
            // return {}
          }
        } else {
          setisLoading(false);
          navigation.navigate("CRADetailsScreen", {
            data: GetSlipsfileRes,
          });
        }
      } else {
        setisLoading(false);
        Alert.alert("Something went wrong, please try again.");
        console.log("GetTaxPayerMyProfileInfo checkSub:");
        // return {}
      }
    } else {
      Alert.alert("Something went wrong, please try again.");
      console.log("resGetTaxPayerMyProfileInfo checkSub:");
      // return {}
      setisLoading(false);
    }
  }

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
    console.log(
      "validateSIN length",
      validateSIN(firstText + secondText + thirdText)
    );
  };
  const onBackButtonPress = () => {
    navigation.navigate("SummaryScreen");
  };
  const onBackdropPress = () => {
    setShowModal(false);
    return;
  };

  const handlePress = (number: Number) => {
    switch (number) {
      case 1:
        Linking.openURL(
          "https://www.canada.ca/en/revenue-agency/services/e-services/represent-a-client.html"
        );
        break;
      case 2:
        Linking.openURL(
          "https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html"
        );
        break;
      case 3:
        Linking.openURL(
          "https://www.canada.ca/en/revenue-agency/services/tax/representative-authorization.html"
        );
        break;
      default:
        break;
    }
  };
  const confirmationModal = () => {
    return (
      <View
        style={{
          height: Dimensions.get("window").height * 0.85,
          width: "100%",
          backgroundColor: darkTheme ? defaultColors.matBlack : "#F8F8F8",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
        }}
      >
        <ScrollView>
          <View
            style={{
              height: "auto",
              backgroundColor: darkTheme
                ? defaultColors.black
                : defaultColors.white,
              margin: 20,
              padding: 15,
              borderRadius: 10,
              paddingBottom: 90,
            }}
          >
            <CtText
              style={{
                fontWeight: "600",
                fontSize: 25,
                marginTop: 20,
                fontFamily: "Figtree-SemiBold",
              }}
            >
              {"Terms and Conditions"}
            </CtText>
            <CtText
              style={{
                fontWeight: "400",
                fontSize: 14,
                marginTop: 20,
                color: darkTheme
                  ? defaultColors.white
                  : defaultColors.secondaryText,
              }}
            >
              You are about to be to a secure Canada Revenue Agency (CRA)
              electronic service. You can automatically fill in parts of your
              current or prior year tax return with the information the CRA has
              available at the time of your request.{"\n\n"}To use this secure
              service you must be signed up and registered with CRA’s My
              Account.{"\n\n"}Each individual should enter their own userid and
              password to use Auto-fill my return which will automatically fill
              in parts of their current and prior year income tax return.
              Individuals can also use Auto-fill my return on behalf of a family
              member. If you prepare a tax return for a family member or a
              friend, you need to:{"\n\n"} • Become authorized to use Auto-fill
              my return on their behalf. You can get this authorization by
              obtaining a RepID through the{" "}
              <CtText
                style={{
                  fontWeight: "400",
                  fontSize: 14,
                  marginTop: 20,
                  color: defaultColors.primaryBlue,
                }}
                onPress={() => handlePress(1)}
              >
                Represent a Client portal
              </CtText>
              , this identifies you with the CRA, and then complete an
              E-Authorization web submission for Authorizing or Cancelling a
              Representative.{"\n\n"} • Give your RepID to your family member or
              friend so they can authorize you as their representative and then
              complete an E-Authorization web submission for Authorizing or
              Cancelling a Representative through their{" "}
              <CtText
                style={{
                  fontWeight: "400",
                  fontSize: 14,
                  marginTop: 20,
                  color: defaultColors.primaryBlue,
                }}
                onPress={() => handlePress(2)}
              >
                My Account.
              </CtText>
              {"\n\n"} • Once you are authorized, you can access their tax
              information and file a return for them using NETFILE-certified
              software.{"\n\n"} For more information on authorizing a
              representative, please visit
              <CtText
                style={{
                  fontWeight: "400",
                  fontSize: 14,
                  marginTop: 20,
                  color: defaultColors.primaryBlue,
                }}
                onPress={() => handlePress(3)}
              >
                {" "}
                Representative authorization.
              </CtText>
              {"\n\n"}
              As per the CRA Terms and Conditions of Use, you are required to
              ensure that all applicable fields contained on the tax return that
              you will file with the CRA are completed, and that the information
              provided is true and accurate.
            </CtText>
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: darkTheme ? "transparent" : "white",
            justifyContent: "center",
            width: "100%",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: darkTheme ? "transparent" : "white",
              justifyContent: "center",
              flex: 0.5,
            }}
          >
            <BottomButton
              onPress={() => onPressCancel()}
              // style={[styles().button]}
              buttonText={"Cancel"}
              style={{
                backgroundColor: defaultColors.secondaryButton,
              }}
              buttonTextStyle={{ color: defaultColors.primaryBlue }}
            />
          </View>
          <View
            style={{
              backgroundColor: darkTheme ? "transparent" : "white",
              justifyContent: "center",
              flex: 0.5,
            }}
          >
            <BottomButton
              onPress={() => onPressContinue()}
              // style={[styles().button]}
              buttonText={"I Agree"}
            />
          </View>
        </View>
      </View>
    );
  };

  const onPressCancel = () =>{
    setShowModal(false);
  }

  const onPressContinue = () =>{
    setShowModal(false);
    successApiCall();
  }
  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle} key={key}>
      <Header onPressbackButton={() => onBackButtonPress()} />
      <CommonModal
        isShowModal={isShowModal}
        ChildView={confirmationModal()}
        onBackdropPress={() => onBackdropPress()}
      />
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
          showLoading={loadingAvailable}
          buttonText="Auto-Fill My Return"
          disabled={loadingAvailable}
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
    buttonText: {
      fontSize: 18,
      color: isDarkTheme ? defaultColors.white : defaultColors.white,
      fontWeight: "600",
      borderRadius: 10,
      fontFamily: "Figtree-SemiBold",
    },
  });

export default CRAAutoFillScreen;
