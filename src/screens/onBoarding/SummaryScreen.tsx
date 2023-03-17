import React, { useState } from "react";
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
} from "react-native";
import { CtText, CtView, Divider } from "../../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Ionicons } from "@expo/vector-icons";
import { Spinner } from "../../components/Spinner";
import {
  GetAvailableSlipsData,
  GetProUserFlagInfo,
  getSelectedSlipData,
  GetUrlData,
} from "../../api/auth";
import Lottie from "lottie-react-native";

const SummaryScreen = ({ navigation }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [loadingAvailable, setisLoading] = useState<boolean>(false);
  const { savedUserData, getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const dispatch = useDispatch();
  console.log("resGetSelectedData savedUserData", savedUserData);
  console.log("resGetSelectedData getSavedLoggedInData", getSavedLoggedInData);
  const onPressCRAAutoFill = () => {
    navigation.navigate("CRAAutoFillScreen");
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
            resGetSelectedData.IncomeSlipForms !== null ? resGetSelectedData.IncomeSlipForms.split(","): ''
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

  const onPressEnterThemManually = async () => {
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
          };
          const getUrl = await GetUrlData(postData, savedUserData?.token);

          if (getUrl) {
            console.log("getUrl", getUrl);
            navigation.navigate("WebViewWithoutPopUp", {
              url: getUrl.url,
            });
          } else {
            Alert.alert("Something went wrong. Please try again...!");
          }
        } else {
          navigation.navigate("UpgradeToPlusScreen", { isManualUpdate: true });
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{
            // flex: 0.25,
            paddingRight: 20,
            // marginLeft:67,
            // marginBottom: 30,
            paddingTop: 20,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "flex-end",
            backgroundColor: defaultColors.primaryBlue,
          }}
          onPress={() =>
            navigation.replace("ChooseTaxYearScreen", {
              isFromRegistration: false,
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
                flex: 0.6,
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
                  height: 300,
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
                No, I will enter them manually
              </CtText>
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
