import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  View,
  Alert,
  StatusBar,
  BackHandler,
} from "react-native";
import { CtText, CtView, Divider } from "../../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Ionicons } from "@expo/vector-icons";
import { Spinner } from "../../components/Spinner";
import { useIsFocused } from "@react-navigation/native";
import {
  GetAvailableSlipsData,
  GetProUserFlagInfo,
  getSelectedSlipData,
  GetT1TaxReturnInfo,
  GetUrlData,
} from "../../api/auth";
import Lottie from "lottie-react-native";
import { firebase } from '@react-native-firebase/analytics';


const SummaryScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [loadingAvailable, setisLoading] = useState<boolean>(false);

  const [isLoading, setLoadingAvailable] = useState<boolean>(false);
  const { savedUserData, getSavedLoggedInData, getTPConnectedAccountData } =
    useSelector((state: RootState) => state.authReducer);

  const [incomevalue, setIncomeValue] = useState<boolean>(false);
  const dispatch = useDispatch();
  console.log("resGetSelectedData savedUserData", savedUserData);
  console.log("resGetSelectedData getSavedLoggedInData", getSavedLoggedInData);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    getTaxPriceInfo();
  }, [isFocused]);


  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: 'summary_landing_screen',
    });
  }, []);

  const getTaxPriceInfo = async () => {
    setLoadingAvailable(true);
    const GetGetT1TaxReturnInfo = await GetT1TaxReturnInfo({
      TaxID: getSavedLoggedInData?.TaxID,
      AcctID: savedUserData?.AcctID,
      TaxPayerID: savedUserData?.TaxPayerID,
      Year: 2022,
      userToken: savedUserData?.token,
      RuleSP: "Y",
    });

    if (GetGetT1TaxReturnInfo) {
      // setisLoading(false);
      setLoadingAvailable(false);
      if (GetGetT1TaxReturnInfo.ErrCode == -1) {
        console.log("GetGetT1TaxReturnInfo else");
        // Alert.alert("Something went wrong..! Please try again..!");
      } else {
        // setIncomeValue(GetGetT1TaxReturnInfo.incomevalue)
        console.log("At least GetGetT1TaxReturnInfo", GetGetT1TaxReturnInfo);
        console.log(
          "At least GetGetT1TaxReturnInfo",
          GetGetT1TaxReturnInfo.TaxableIncome
        );
        // let hasValue = ( (Object.values(GetGetT1TaxReturnInfo).every(value => value !== 0) && GetGetT1TaxReturnInfo.ErrMsg === "Success"))

        // if (hasValue) {
        //   console.log("At least one property has a value");
        //   setIncomeValue(true);
        // } else {
        //   console.log("None of the properties have a value");
        //   setIncomeValue(false);
        // }

        if (
          GetGetT1TaxReturnInfo.Balance !== 0 ||
          GetGetT1TaxReturnInfo.TotalPayable !== 0 ||
          GetGetT1TaxReturnInfo.TotalIncome !== 0 ||
          GetGetT1TaxReturnInfo.TotalCredits !== 0 ||
          GetGetT1TaxReturnInfo.TaxableIncome !== 0 ||
          GetGetT1TaxReturnInfo.Refund !== 0 ||
          GetGetT1TaxReturnInfo.NetIncome !== 0
        ) {
          // Code to be executed if all properties have non-zero values and ErrMsg equals "Success"
          console.log("At least one property has a value");
          setIncomeValue(true);
        } else {
          // Code to be executed if any property has a value of 0 or ErrMsg is not equal to "Success"
          console.log("None of the properties have a value");
          setIncomeValue(false);
        }
      }
    } else {
      // setisLoading(false);
      setLoadingAvailable(false);
    }
  };

  const onPressScanYourBill = async () => {
    setisLoading(true);
    const resGetSelectedData = await getSelectedSlipData(
      {
        TaxPayerID: savedUserData?.TaxPayerID,
        AcctID: savedUserData?.AcctID,
        Year: 2022,
        TaxID: getSavedLoggedInData?.TaxID,
      },
      savedUserData?.token
    );
    console.log("onPressScanYourBill", savedUserData, resGetSelectedData);

    if (resGetSelectedData) {
      await firebase.analytics().logEvent("onpressed_scan_urbill", {
        TaxID: getSavedLoggedInData?.TaxID,
        getSelectedData: resGetSelectedData,
        TaxPayerID: savedUserData?.TaxPayerID,
      });
      // setisLoading(false);
      if (resGetSelectedData.ErrCode == -1) {
        console.log("resGetSelectedData else");
        setisLoading(false);
        navigation.navigate("EmptySlipsScreen", {
          data: [],
        });
      } else {
        setisLoading(false);
        if (resGetSelectedData.IncomeSlipForms == "") {
          navigation.navigate("EmptySlipsScreen", {
            data: resGetSelectedData,
            getSelectedData: resGetSelectedData,
          });
        } else {
          const resAvailableSlipsData = await GetAvailableSlipsData(
            {
              TaxPayerID: savedUserData?.TaxPayerID,
              AcctID: savedUserData?.AcctID,
              Year: 2022,
              TaxID: getSavedLoggedInData?.TaxID,
            },
            savedUserData?.token,
            resGetSelectedData.IncomeSlipForms !== null
              ? resGetSelectedData.IncomeSlipForms.split(",")
              : ""
          );

          if (resAvailableSlipsData) {
            console.log("resAvailableSlipsData", resAvailableSlipsData);
            setisLoading(false);
            navigation.navigate("MyTaxSlipsScreen", {
              data: resAvailableSlipsData,
              getSelectedData: resGetSelectedData,
            });
          } else {
            setisLoading(false);
            navigation.navigate("MyTaxSlipsScreen", {
              data: resGetSelectedData,
              getSelectedData: resGetSelectedData,
            });
          }
        }
      }
    } else {
      setisLoading(false);
      console.log("resGetSelectedData else");
    }
  };

  const onPressCRAAutoFill = async () => {
    navigation.navigate("CRAAutoFillScreen");
    await firebase.analytics().logEvent("onprs_cra_autofill", {
      TaxID: getSavedLoggedInData?.TaxID,
      TaxPayerID: savedUserData?.TaxPayerID,
    });
  };

  const onPressEnterThemManually = async () => {
    await firebase.analytics().logEvent("onprs_enter_them_manually", {
      TaxID: getSavedLoggedInData?.TaxID,
      TaxPayerID: savedUserData?.TaxPayerID,
    });
    const getProUser = await GetProUserFlagInfo(
      {
        Year: 2022,
        TaxPayerID: savedUserData?.TaxPayerID,
        AcctID: savedUserData?.AcctID,
        TaxID: getSavedLoggedInData?.TaxID,
        loader: false,
      },
      savedUserData?.token
    );

    if (getProUser) {
      console.log("GetProUserFlagInfo", getProUser);
      if (getProUser.ErrCode == -1) {
        console.log("GetSlipsfileRes else");
      } else {
        if (getProUser.IsPro === "Y") {
          let postData = {
            Year: 2022,
            TaxPayerID: savedUserData?.TaxPayerID,
            AcctID: savedUserData?.AcctID,
            TaxID: getSavedLoggedInData?.TaxID,
          };
          const getUrl = await GetUrlData(postData, savedUserData?.token);

          if (getUrl) {
            console.log("getUrl", getUrl);
            navigation.navigate("WebViewWithoutPopUp", {
              url: getUrl.url,
              isShowBackButton: false,
            });
          } else {
            Alert.alert("Something went wrong. Please try again...!");
          }
        } else {
          navigation.navigate("UpgradeToPlusScreen", { isManualUpdate: true });
          await firebase.analytics().logEvent("on_navigated_upgratescreen_from_sum", {
            TaxID: getSavedLoggedInData?.TaxID,
            TaxPayerID: savedUserData?.TaxPayerID,
          });
        }
      }
    } else {
      Alert.alert("Something went wrong. Please try again...!");
    }
  };

  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle}>
      {/* <Header onPressbackButton={() => onBackButtonPress()} navigation.replace("ChooseTaxYearScreen", {
                    isFromRegistration: false,
                  });/> */}
      <StatusBar
        // animated={true}
        backgroundColor={defaultColors.primaryBlue}
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        // hidden={hidden}
      />
      <View
        style={{
          justifyContent: "space-between",
          // alignSelf: "center",
          backgroundColor: defaultColors.primaryBlue,
          height: "auto",
          flexDirection: "row",
          paddingTop: 20,
          display: "flex",
          // marginTop: 40,
        }}
      >
        <CtText
          style={{
            // textAlign: "left",
            fontSize: 18,
            fontFamily: "Figtree-SemiBold",
            fontWeight: "600",
            color: darkTheme ? defaultColors.white : defaultColors.white,
            paddingLeft: 20,
          }}
        >
          {`Hi ${
            savedUserData.TaxPayerName !== undefined
              ? savedUserData.TaxPayerName
              : ""
          }`}
        </CtText>
        <TouchableOpacity
          style={{
            // flex: 0.25,
            paddingRight: 20,
            // marginLeft:67,
            // marginBottom: 30,
            // paddingTop: 20,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "flex-end",
            backgroundColor: defaultColors.primaryBlue,
          }}
          onPress={() =>
            // navigation.replace("ChooseAAccountScreen", {
            //   isFromRegistration: false,
            //   accountList: getTPConnectedAccountData
            // })
            navigation.navigate("OnBoardingTaxProfile", {
              selectedScreen: 1,
              selectedYear: "2022",
            })
          }
        >
          <CtText
            style={{
              // textAlign: "left",
              fontSize: 18,
              fontFamily: "Figtree-SemiBold",
              fontWeight: "600",
              color: darkTheme ? defaultColors.white : defaultColors.white,
            }}
          >
            Edit info
          </CtText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <CtView
          style={{
            flex: 1,
          }}
        >
          <CtView
            style={{
              flex: 1,
              backgroundColor: defaultColors.primaryBlue,
            }}
          >
            <CtView
              style={{
                justifyContent: "center",
                alignSelf: "center",
                backgroundColor: defaultColors.primaryBlue,
                // marginTop: 40,
              }}
            >
              {/* <Image
                style={{
                  height: 300,
                  width: Dimensions.get("window").width * 0.9,
                  backgroundColor: defaultColors.transparent,
                }}
                resizeMode={"contain"}
                source={require("../../../assets/summary.png")}
              /> */}
              <Lottie
                style={{
                  height: 250,
                  width: Dimensions.get("window").width * 0.9,
                  backgroundColor: defaultColors.primaryBlue,
                }}
                source={require("../../../assets/gif.json")}
                autoPlay
                loop
              />
            </CtView>
            <CtView
              style={{
                flex: 0.4,
                marginRight: 20,
                marginLeft: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 40,
                backgroundColor: defaultColors.primaryBlue,
              }}
            >
              <CtText
                style={{
                  textAlign: "center",
                  fontSize: 25,
                  fontFamily: "Figtree-SemiBold",
                  fontWeight: "600",
                  color: darkTheme ? defaultColors.white : defaultColors.white,
                }}
              >
                Lets start with your slips
              </CtText>
              <CtText
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "Figtree-Regular",
                  fontWeight: "400",
                  color: darkTheme
                    ? defaultColors.darkModeTextColor
                    : defaultColors.darkModeTextColor,
                  marginTop: 5,
                }}
              >
                If you don’t have access to CRA’s My Account, you can input them
                manually or scan your slips.
              </CtText>
            </CtView>
          </CtView>

          <CtView
            style={{
              flex: 1,
              justifyContent: "center",
              marginTop: -20,
              // backgroundColor: defaultColors.green,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <TouchableOpacity
              style={{
                height: 74,
                flexDirection: "row",
                marginRight: 20,
                marginLeft: 20,
                borderWidth: 1,
                borderColor: darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.borderColor,
                borderRadius: 10,
                marginTop: 40,
              }}
              disabled={loadingAvailable}
              onPress={() => onPressCRAAutoFill()}
            >
              <CtView
                style={{
                  flex: 0.2,
                  // marginTop: 22,
                  // marginBottom: 22,
                  marginLeft: 22,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={require("../../../assets/maple.png")} />
              </CtView>
              <CtView
                style={{
                  flex: 0.8,
                  flexDirection: "row",
                  marginLeft: 20,
                  marginRight: 12,
                }}
              >
                <CtView
                  style={{
                    flex: 0.8,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CtText
                    style={{
                      textAlign: "left",
                      fontSize: 18,
                      fontFamily: "Figtree-SemiBold",
                      fontWeight: "600",
                      color: darkTheme
                        ? defaultColors.darkModeTextColor
                        : defaultColors.secondaryTextColor,
                    }}
                  >
                    CRA Auto-fill
                  </CtText>
                </CtView>
                <CtView
                  style={{
                    flex: 0.2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Ionicons
                    name={"ios-chevron-forward-outline"}
                    style={{
                      fontSize: 21,
                      color: defaultColors.darkModeTextColor,
                    }}
                  />
                </CtView>
              </CtView>
            </TouchableOpacity>
            <View
              style={{
                flex: 0,
                height: 40,
                marginRight: 20,
                marginLeft: 20,
                backgroundColor: defaultColors.transparent,
              }}
            >
              <Divider />
            </View>
            <TouchableOpacity
              style={{
                height: 72,
                flexDirection: "row",
                marginRight: 20,
                marginLeft: 20,
                // marginTop: 16,
                borderWidth: 1,
                borderColor: darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.borderColor,
                borderRadius: 10,
                justifyContent: "center",
              }}
              disabled={loadingAvailable}
              onPress={() => onPressScanYourBill()}
            >
              {loadingAvailable ? (
                <Spinner
                  style={{
                    flex: 0,
                    backgroundColor: "transparent",
                    alignSelf: "center",
                  }}
                />
              ) : (
                <>
                  <CtView
                    style={{
                      flex: 0.2,
                      // marginTop: 22,
                      // marginBottom: 22,
                      marginLeft: 22,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image source={require("../../../assets/camera.png")} />
                  </CtView>
                  <CtView
                    style={{
                      flex: 0.8,
                      flexDirection: "row",
                      // marginTop: 23,
                      // marginBottom: 20,
                      marginLeft: 20,
                      marginRight: 12,
                    }}
                  >
                    <CtView
                      style={{
                        flex: 0.8,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CtText
                        style={{
                          textAlign: "left",
                          fontSize: 18,
                          fontFamily: "Figtree-SemiBold",
                          fontWeight: "600",
                          color: darkTheme
                            ? defaultColors.darkModeTextColor
                            : defaultColors.secondaryTextColor,
                        }}
                      >
                        Scan your T slips
                      </CtText>
                    </CtView>
                    <CtView
                      style={{
                        flex: 0.2,
                        // backgroundColor:'red',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                      }}
                    >
                      <Ionicons
                        name={"ios-chevron-forward-outline"}
                        style={{
                          fontSize: 21,
                          color: defaultColors.darkModeTextColor,
                        }}
                      />
                    </CtView>
                  </CtView>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                // flex: 0.25,
                // marginRight:67,
                // marginLeft:67,
                paddingBottom: 60,
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => onPressEnterThemManually()}
            >
              {isLoading ? (
                <Spinner
                  style={{
                    flex: 0,
                    backgroundColor: "transparent",
                    alignSelf: "center",
                  }}
                />
              ) : (
                <CtText
                  style={{
                    // textAlign: "left",
                    fontSize: 18,
                    fontFamily: "Figtree-SemiBold",
                    fontWeight: "600",
                    color: darkTheme
                      ? defaultColors.darkModeTextColor
                      : defaultColors.secondaryTextColor,
                  }}
                >
                  {incomevalue
                    ? "Goto Dashboard"
                    : "No I will enter them manually"}
                </CtText>
              )}
            </TouchableOpacity>
          </CtView>
        </CtView>
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
  });

export default SummaryScreen;
