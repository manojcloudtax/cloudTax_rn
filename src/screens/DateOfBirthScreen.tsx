import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { CtText, CtView, Button } from "../components/UiComponents";
import { Spinner } from "../components";
import { useDispatch } from "react-redux";
import { defaultColors } from "../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import DatePicker from "@react-native-community/datetimepicker";
import {
  GetAfrUrl,
  GetSlips,
  GetTaxPayerPersonalInfo,
  SaveTaxPayerPersonalInfo,
} from "../api/auth";
import { saveLoggedInSuccessUserData } from "../store/authSlice";
import { CustomButton } from "../components/CustomButton";
import { Header } from "../components/Header";
import { useIsFocused } from "@react-navigation/native";
const DateOfBirthScreen = ({ navigation, route }: any) => {
  const isFocused = useIsFocused();
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { savedUserData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const [isEnable, setButtonEnable] = useState(false);
  const [key, setKeyToRerender] = useState(1);
  const [date, setDateValue] = useState(
    new Date(moment().subtract(18, "y").format("YYYY-MM-DD"))
  );
  const [isDateAvailable, setDateAvailability] = useState(false);
  // const [SelectedSin, setSinValue] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loadingAvailable, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    setisLoading(false);
    try {
      console.log(
        "onPressConfirm res",
        getSavedLoggedInData?.TaxPayerBirthDate
      );
      console.log("onPressConfirm res", getSavedLoggedInData);
      if (getSavedLoggedInData?.TaxPayerBirthDate != undefined) {
        if (getSavedLoggedInData?.DefaultBirthDate == "N") {
          var dateArray = getSavedLoggedInData?.TaxPayerBirthDate.split("-");
          var year = dateArray[0];
          var month = parseInt(dateArray[1], 10) - 1;
          var dates = dateArray[2];
          var _entryDate = new Date(year, month, dates);
          setDateValue(_entryDate);
          setDateAvailability(true);
        }
        setButtonEnable(true);
      } else if (date) {
        setButtonEnable(true);
      }
      if (route.params !== undefined) {
        // const { sin } = route.params;
        // setSinValue(sin);
        // console.log("onPressConfirm", sin);
        console.log("onPressConfirm", savedUserData);
      }
    } catch (error) {}
  }, [isFocused]);
  const onPressConfirm = async () => {
    console.log("DateOfBirthScreen onPressConfirm", date);
    console.log(
      "DateOfBirthScreen onPressConfirm moment",
      moment(date).format("YYYY-MM-DD").toString()
    );
    if (!isDateAvailable) {
      Alert.alert("Please select valid date..!");
      return;
    }
    setisLoading(true);
    const resGetTaxPayerMyProfileInfo = await GetTaxPayerPersonalInfo({
      AcctID: savedUserData?.AcctID,
      TaxPayerID: savedUserData?.TaxPayerID,
      Year: 2022,
      userToken: savedUserData?.token,
    });
    console.log("resGetTaxPayerMyProfileInfo res", resGetTaxPayerMyProfileInfo);
    if (resGetTaxPayerMyProfileInfo) {
      if (resGetTaxPayerMyProfileInfo.ErrCode == -1) {
        // setisLoading(false);
        // Alert.alert("Something went wrong..! Please try again..!");
        // return;
      }
      const resSaveTaxPayerPersonal = await SaveTaxPayerPersonalInfo({
        TaxPayerBirthDate: moment(date).format("YYYY-MM-DD").toString(),
        TaxPayerID: resGetTaxPayerMyProfileInfo?.TaxPayerID,
        Year: 2022,
        TaxID: resGetTaxPayerMyProfileInfo?.TaxID,
        TaxPayerName: resGetTaxPayerMyProfileInfo?.TaxPayerName,
        TaxPayerMiddleName: resGetTaxPayerMyProfileInfo?.TaxPayerMiddleName,
        TaxPayerLastName: resGetTaxPayerMyProfileInfo?.TaxPayerLastName,
        TaxPayerSIN: resGetTaxPayerMyProfileInfo?.TaxPayerSocialInsuranceNumber,
        DefaultBirthDate: "N",
        NameChangedStatus: resGetTaxPayerMyProfileInfo?.NameChangedStatus,
        DisabledStatus: resGetTaxPayerMyProfileInfo?.DisabledStatus,
        FirstYearClaimingStatus:
          resGetTaxPayerMyProfileInfo?.FirstYearClaimingStatus,
        Province: resGetTaxPayerMyProfileInfo?.Province,
        T2201ApprovedStatus: resGetTaxPayerMyProfileInfo?.T2201ApprovedStatus,
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
        console.log(
          "onPressLastStep SaveTaxpayerProfileInfo res",
          resSaveTaxPayerPersonal
        );
        if (resSaveTaxPayerPersonal.ErrCode == -1) {
          setisLoading(false);
          // Alert.alert("Something went wrong..! Please try again..!");
          // return;
        } else {
          const resGetTaxPayerMyProfileInfo2 = await GetTaxPayerPersonalInfo({
            AcctID: savedUserData?.AcctID,
            TaxPayerID: savedUserData?.TaxPayerID,
            Year: 2022,
            userToken: savedUserData?.token,
          });
          console.log(
            "resGetTaxPayerMyProfileInfo res",
            resGetTaxPayerMyProfileInfo2
          );
          if (resGetTaxPayerMyProfileInfo2) {
            if (resGetTaxPayerMyProfileInfo2.ErrCode == -1) {
              // setisLoading(false);
              Alert.alert("Something went wrong..! Please try again..!");
              // return;
            } else {
              dispatch(
                saveLoggedInSuccessUserData(resGetTaxPayerMyProfileInfo2)
              );
              console.log(
                "resGetAfrUrl getSavedLoggedInData",
                getSavedLoggedInData
              );
              console.log(
                "resGetAfrUrl resGetTaxPayerMyProfileInfo2",
                resGetTaxPayerMyProfileInfo2
              );
              navigation.navigate("SummaryScreen");
            }
          } else {
            Alert.alert("Something went wrong, please try again.");
          }
        }

        // const GetSlipsfileRes = await GetSlips(
        //   {
        //     TaxID: resGetTaxPayerMyProfileInfo?.TaxID,
        //     AcctID: savedUserData?.AcctID,
        //     TaxPayerID: savedUserData?.TaxPayerID,
        //     Year: 2022,
        //     year: 2022,
        //   },
        //   savedUserData?.token
        // );
        // console.log("Hello GetSlipsfileRes", GetSlipsfileRes);

        // if (GetSlipsfileRes == null) {
        //   const resGetAfrUrl = await GetAfrUrl({
        //     Sin: SelectedSin,
        //     appType: "FREE",
        //     Year: 2022,
        //     userToken: savedUserData?.token,
        //   });
        //   console.log("resGetAfrUrl checkSub:", resGetAfrUrl);
        //   if (resGetAfrUrl) {
        //     setisLoading(false);
        //     if (resGetAfrUrl?.status == 500) {
        //       Alert.alert("Error..!", resGetAfrUrl.data?.message);
        //     } else if (resGetAfrUrl.ErrCode == -1) {
        //       Alert.alert("Something went wrong..! Please try again..!");
        //     } else {
        //       navigation.navigate("WebViewScreen", { url: resGetAfrUrl?.url });
        //     }
        //   } else {
        //     setisLoading(false);
        //     Alert.alert("Something went wrong..! Please try again..!");
        //     console.log("resGetAfrUrl checkSub:");
        //     // return {}
        //   }
        // } else {
        //   setisLoading(false);
        //   navigation.navigate("CRADetailsScreen", {
        //     data: GetSlipsfileRes,
        //   });
        // }
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
  };

  const onBackButtonPress = () => {
    navigation.goBack();
  };

  const setDate = () => {
    setOpen(true);
  };
  console.log("onPressConfirm date", date);
  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle} key={key}>
      <Header onPressbackButton={() => onBackButtonPress()} />

      <ScrollView
        // contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
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
            Date of birth
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
                : defaultColors.secondaryTextColor,
            }}
          >
            Please provide your date of birth to calculate your tax credits
            correctly.
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
          <TouchableOpacity
            style={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              borderWidth: 1,
              borderColor: "#DADADA",
              borderRadius: 8,
            }}
            onPress={() => setDate()}
          >
            <CtText
              disabled={true}
              style={{
                backgroundColor: "transparent",
                width: "100%",
                fontFamily: "Figtree-SemiBold",
                textAlign: "center",
                fontWeight: "400",
                color: darkTheme
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
                fontSize: 18,
              }}
            >
              {isDateAvailable
                ? moment(date, "YYYY/MM/DD").format("YYYY")
                : "YYYY"}
            </CtText>
          </TouchableOpacity>
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
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
              }}
            >
              -
            </CtText>
          </CtView>
          <TouchableOpacity
            style={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              borderWidth: 1,
              borderColor: "#DADADA",
              borderRadius: 8,
            }}
            onPress={() => setDate()}
          >
            <CtText
              disabled={true}
              style={{
                backgroundColor: "transparent",
                width: "100%",
                fontFamily: "Figtree-SemiBold",
                textAlign: "center",
                fontWeight: "400",
                color: darkTheme
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
                fontSize: 18,
              }}
            >
              {isDateAvailable
                ? parseInt(moment(date, "YYYY/MM/DD").format("M")) < 10
                  ? `0${moment(date, "YYYY/MM/DD").format("M")}`
                  : `${moment(date, "YYYY/MM/DD").format("M")}`
                : "MM"}
            </CtText>
          </TouchableOpacity>
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
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
              }}
            >
              -
            </CtText>
          </CtView>
          <TouchableOpacity
            style={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              borderWidth: 1,
              borderColor: "#DADADA",
              borderRadius: 8,
            }}
            onPress={() => setDate()}
          >
            <CtText
              disabled={true}
              style={{
                backgroundColor: "transparent",
                width: "100%",
                fontFamily: "Figtree-SemiBold",
                textAlign: "center",
                fontWeight: "400",
                color: darkTheme
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
                fontSize: 18,
              }}
            >
              {isDateAvailable
                ? parseInt(moment(date, "YYYY/MM/DD").format("D")) < 10
                  ? `0${moment(date, "YYYY/MM/DD").format("D")}`
                  : `${moment(date, "YYYY/MM/DD").format("D")}`
                : "DD"}
            </CtText>
          </TouchableOpacity>
        </CtView>

        {open ? (
          <DatePicker
            // modal
            //   minimumDate={new Date("2022-01-01")}
            maximumDate={new Date()}
            // mode="date"
            display="spinner"
            // open={open}
            value={date}
            textColor={darkTheme ? "black" : "black"}
            themeVariant={darkTheme ? "dark" : "light"}
            onChange={(event, selectedDate) => {
              console.log("onConfirm", date);
              setOpen(false);
              setDateValue(selectedDate);
              setButtonEnable(true);
              setDateAvailability(true);
            }}
            // onCancel={() => {
            //   setOpen(false);
            // }}
          />
        ) : null}
        <CustomButton
          showLoading={loadingAvailable}
          buttonText="Confirm"
          disabled={!isEnable}
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

export default DateOfBirthScreen;
