import React, { useEffect, useMemo, useState, useRef, createRef } from "react";
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
  TextInput,
  FlatList,
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
import { defaultColors } from "../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  GetAfrUrl,
  GetSlips,
  GetT1TaxReturnInfo,
  GetTDDNetfile,
  SaveSlips,
} from "../api/auth";
import CheckBox from "@react-native-community/checkbox";
import { Header } from "../components/Header";
import CheckmarkIcon from "react-native-vector-icons/Octicons";
import { CRADetailsPopUP } from "../components/CRADetailsPopUP";
import _ from "lodash";
import { CustomButton } from "../components/CustomButton";

interface Questions {
  key: Number;
  value: String;
}
const CRADetailsScreen = ({ navigation, route }: any) => {
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
  const [DataToRender, setData] = useState([] as any);
  const [selectedIndex, SetselectedIndex] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [iSCheckedArrow, SetCheckedArrowIndex] = useState(false);
  const [loadingAvailable, setisLoading] = useState<boolean>(false);
  const [firstModal, setOpenfirstModal] = useState(true);
  const [secondModal, setOpensecondModal] = useState(true);
  const [thirdModal, setOpenThirdModal] = useState(true);
  const [fourthModal, setOpenFourthModal] = useState(true);
  const [fifthModal, setOpenFifthModal] = useState(true);
  const [sixthModal, setOpensixthModal] = useState(true);
  const [downloadedParams, SetDownloadedParams] = useState([] as any);
  const [isDataLoading, setisDataLoading] = useState(false);

  useEffect(() => {
    setisLoading(false);
    try {
      if (route.params !== undefined) {
        const { data } = route.params;
        const { t } = route.params;
        console.log("onPressConfirm route.params", route.params);
        console.log("onPressConfirm savedUserData", getSavedLoggedInData);
        console.log(
          "onPressConfirm getSavedLoggedInData",
          getSavedLoggedInData
        );
        if (t !== undefined) {
          getData();
        } else {
          // setData(data.slipsFilerted);
          SetDownloadedParams(data);
          setFlatListDataWithSlectAll(data);
        }
        // console.log("onPressConfirm data");

        // setFlatListDataWithSlectAll(data);
      }
    } catch (error) {}
  }, [isFocused]);

  const getData = async () => {
    // setTimeout(
    //   async function (){
    setisDataLoading(true);
    const GetTDDNetfileRes = await GetTDDNetfile(
      {
        TaxID: getSavedLoggedInData?.TaxID,
        AcctID: savedUserData?.AcctID,
        TaxPayerID: savedUserData?.TaxPayerID,
        Year: 2022,
        token: route.params.t,
        year: 2022,
        appType: "FREE",
        saveData: true,
      },
      savedUserData?.token
    );
    console.log("GetTDDNetfileRes", savedUserData, GetTDDNetfileRes);

    if (GetTDDNetfileRes) {
      if (GetTDDNetfileRes.ErrCode == -1) {
        console.log("GetTDDNetfileRes else");

        setisDataLoading(false);
      } else {
        const GetSlipsfileRes = await GetSlips(
          {
            TaxID: getSavedLoggedInData?.TaxID,
            AcctID: savedUserData?.AcctID,
            TaxPayerID: savedUserData?.TaxPayerID,
            Year: 2022,
            year: 2022,
          },
          savedUserData?.token
        );
        console.log("GetSlipsfileRes", GetSlipsfileRes);
        if (GetSlipsfileRes) {
          setisDataLoading(false);
          if (GetSlipsfileRes.ErrCode == -1) {
            console.log("GetSlipsfileRes else");
          } else {
            SetDownloadedParams(GetSlipsfileRes);
            setFlatListDataWithSlectAll(GetSlipsfileRes);
          }
        } else {
          setisDataLoading(false);
          console.log("GetTDDNetfileRes else");
        }
      }
    } else {
      setisDataLoading(false);
      console.log("GetTDDNetfileRes else");
    }
  };

  const setFlatListDataWithSlectAll = async (data: any) => {
    console.log("setFlatListDataWithSlectAll data");
    let selectAllData = {
      key: "Select All",
      name: "",
      selected: false,
      slip: {},
      slipName: "",
      type: "selectAll",
    };
    var newservicesTypeData = await [selectAllData, ...data.slipsFilerted];

    setData(newservicesTypeData);
  };

  const onPressConfirm = async () => {
    // console.log("onPressConfirm res", isEnable);

    // console.log(
    //   "SaveSelectedSlipsfileRes else",
    //   getSavedLoggedInData,
    //   savedUserData
    // );
    // console.log(
    //   "SaveSelectedSlipsfileRes downloadedParams?.slipsFilerted[0].slip  else",
    //   downloadedParams?.slipsFilerted
    // );

    // let removeSelectAllItem = DataToRender.filter(
    //   (element: { type: string }) => element.type !== "selectAll"
    // );
    // console.log("onPressConfirm removeSelectAllItem", removeSelectAllItem);
    const selectedItem = DataToRender.filter(
      (res: { selected: any }) => res.selected
    );

    let result = DataToRender.filter(
      (element: { type: string }) => element.type !== "selectAll"
    );
    console.log("onPressConfirm result", result);
    if (selectedItem.length === 0) {
      return;
    }

    setisLoading(true);
    const resultdata = {
      selectedSlip: result,
    };
    console.log("onPressConfirm result", resultdata);
    console.log("onPressConfirm getSavedLoggedInData", getSavedLoggedInData);
    console.log("onPressConfirm savedUserData", savedUserData);
    // return;
    // const data = {
    //     "selectedSlip": [downloadedParams?.slipsFilerted[0].slip] }
    const SaveSelectedSlipsfileRes = await SaveSlips({
      TaxID: getSavedLoggedInData?.TaxID,
      AcctID: savedUserData?.AcctID,
      TaxPayerID: savedUserData?.TaxPayerID,
      Year: 2022,
      data: resultdata,
      userToken: savedUserData?.token,
    });
    console.log("Hello SaveSelectedSlipsfileRes", SaveSelectedSlipsfileRes);

    console.log("Hello data", resultdata);
    console.log("Hello SaveSelectedSlipsfileRes", SaveSelectedSlipsfileRes);
    if (SaveSelectedSlipsfileRes) {
      // setisLoading(false);
      if (SaveSelectedSlipsfileRes.ErrCode == -1) {
        setisLoading(false);
        console.log("SaveSelectedSlipsfileRes else");
      } else {
        // navigation.navigate("EstimatedScreen");
        // GetT1TaxReturnInfo
        const GetGetT1TaxReturnInfo = await GetT1TaxReturnInfo({
          TaxID: getSavedLoggedInData?.TaxID,
          AcctID: savedUserData?.AcctID,
          TaxPayerID: savedUserData?.TaxPayerID,
          Year: 2022,
          userToken: savedUserData?.token,
          RuleSP: "Y",
        });

        if (GetGetT1TaxReturnInfo) {
          setisLoading(false);
          if (GetGetT1TaxReturnInfo.ErrCode == -1) {
            console.log("GetGetT1TaxReturnInfo else");
          } else {
            navigation.navigate("EstimatedScreen", {
              data: GetGetT1TaxReturnInfo,
            });
          }
        } else {
          setisLoading(false);
        }
      }
    } else {
      setisLoading(false);
    }
  };

  const onBackButtonPress = () => {
    // navigation.goBack();
    navigation.navigate("CRAAutoFillScreen");
  };

  const OnPressCheckBox = (item: any, index: number) => {
    let updateItems = [];
    if (item.type === "selectAll") {
      updateItems = DataToRender.map((data: any) => ({
        ...data,
        selected: item.selected === true ? false : true,
      }));
    } else {
      updateItems = DataToRender.map((data: any) => ({
        ...data,
        selected:
          data.type === "selectAll" && item.selected === true
            ? (data.selected = false)
            : item.key +
                " " +
                item.slipName +
                " " +
                (item?.name == undefined ? " " : item?.name) ===
              data.key +
                " " +
                data.slipName +
                " " +
                (data?.name == undefined ? " " : data?.name)
            ? !data.selected
            : data.selected,
      }));
    }

    setData(updateItems);
  };
  const renderData = (item: any, index: any) => {
    const title = item.key + " " + (item?.name == undefined ? " " : item?.name);
    // console.log(
    //   "onPressConfirm data const name = item.key + ' '+ item?.name == undefined ? ' ' : name",
    //   item
    // );
    return (
      <TouchableOpacity
        key={item}
        style={{
          marginVertical: 10,
          height: "auto",
          //   backgroundColor: "green",
          alignItems: "center",
          //   flex: 1,
          //   width: '90%'
        }}
        onPress={() => OnPressCheckBox(item, index)}
      >
        <View
          style={{
            marginVertical: 10,
            flexDirection: "row",
            height: "auto",
            //   backgroundColor: "green",
            alignItems: "center",
            //   flex: 1,
            //   width: '90%'tintColor= "green",
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => OnPressCheckBox(item, index)}
          >
            {item.selected ? (
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
          <View style={{ flex: 1 }}>
            <CtText
              style={{
                fontWeight: "400",
                fontSize: 16,
                marginLeft: 16,
              }}
            >
              {title}
            </CtText>
          </View>
          {/* {item.type !== "selectAll" ? (
            <View
              style={{ alignItems: "center", marginLeft: 16, width: 40 }}
              // onPress={() => OnPressRightArrow(item, index)}
            >
              <Ionicons
                name={
                  selectedIndex === index && iSCheckedArrow
                    ? "ios-chevron-down-outline"
                    : "ios-chevron-forward-outline"
                }
                size={20}
              />
            </View>
          ) : null} */}
        </View>
        {/* {selectedIndex === index && iSCheckedArrow ? (
          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              height: "auto",
              backgroundColor: defaultColors.yellow,
              alignItems: "center",
              marginLeft: 20,
              borderRadius: 10,
              //   flex: 1,
              //   width: '90%'
            }}
          >
            <View style={{ flex: 1, margin: 20 }}>
              <CtText
                style={{
                  fontWeight: "400",
                  fontSize: 16,
                  marginLeft: 16,
                }}
              >
                {"item"}
              </CtText>
            </View>
          </View>
        ) : null} */}
      </TouchableOpacity>
    );
  };

  const onPressCloseModal = (key: number) => {
    switch (key) {
      case 1:
        setOpenfirstModal(false);
        break;
      case 2:
        setOpensecondModal(false);
        break;
      case 3:
        setOpenThirdModal(false);
        break;
      case 4:
        setOpenFourthModal(false);
        break;
      case 5:
        setOpenFifthModal(false);
        break;
      case 6:
        setOpensixthModal(false);
        break;

      default:
        break;
    }
  };

  const onPressRefresh = async () => {
    setisLoading(true);
    console.log("Hello onPressRefresh", getSavedLoggedInData);
    const resGetAfrUrl = await GetAfrUrl({
      Sin: getSavedLoggedInData.TaxPayerSocialInsuranceNumber,
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
  };

  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle} key={key}>
      <Header onPressbackButton={() => onBackButtonPress()} />
      {/* <TouchableOpacity
        style={{
          alignItems: "flex-start",
          height: "auto",
          width: "90%",
          flexDirection: "row",
          paddingLeft: 15,
          paddingTop: 20,
        }}
        onPress={() => onBackButtonPress()}
      >
        <Ionicons
          name={"ios-chevron-back-outline"}
          style={{
            fontSize: 21,
            color: defaultColors.primaryBlue,
          }}
        />
        <CtText
          style={{
            fontWeight: "500",
            fontSize: 18,
            color: defaultColors.primaryBlue,
          }}
        >
          {"Back"}
        </CtText>
      </TouchableOpacity> */}
      <ScrollView
        // contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <CtView
          style={{
            // flex: 0.1,
            marginRight: 20,
            marginLeft: 20,
            marginTop: 20,
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
            Here is what we got from CRA for you
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
            Select what you’d like to auto-fill on your return
          </CtText>
        </CtView>
        {!_.isUndefined(
          downloadedParams?.summary?.ForeignPropertyDeclaredIndicator
        ) ? (
          downloadedParams?.summary?.ForeignPropertyDeclaredIndicator[
            "_text"
          ] == "true" && firstModal ? (
            <CRADetailsPopUP
              title={"Foreign Property:"}
              details={
                downloadedParams?.summary?.ForeignPropertyDeclaredIndicator[
                  "_text"
                ] == "true"
                  ? "Declared in previous year’s tax return."
                  : "Not declared in previous year’s tax return."
              }
              onPressCloseModal={() => onPressCloseModal(1)}
              backgroundColor={
                darkTheme
                  ? defaultColors.foreignPropertyDarkBackgrund
                  : defaultColors.foreignPropertyLightBackgrund
              }
              borderColor={
                darkTheme
                  ? defaultColors.foreignPropertyDarkBorder
                  : defaultColors.foreignPropertyLightBorder
              }
              titleColor={defaultColors.foreignPropertytitle}
            />
          ) : null
        ) : null}

        {!_.isUndefined(downloadedParams?.summary?.UnfiledReturn) ? (
          downloadedParams?.summary?.UnfiledReturn?.TaxYear && secondModal ? (
            <CRADetailsPopUP
              title={
                "Unfilled prior-year returns: The following prior-year returns have not been filed.\n\n" +
                downloadedParams?.summary?.UnfiledReturn?.TaxYear.map(
                  (d: { _text: any }) => d._text
                ).join("\n")
              }
              details={""}
              onPressCloseModal={() => onPressCloseModal(2)}
              backgroundColor={
                darkTheme
                  ? defaultColors.foreignPropertyDarkBackgrund
                  : defaultColors.foreignPropertyLightBackgrund
              }
              borderColor={
                darkTheme
                  ? defaultColors.foreignPropertyDarkBorder
                  : defaultColors.foreignPropertyLightBorder
              }
              titleColor={defaultColors.foreignPropertytitle}
            />
          ) : null
        ) : null}

        {!_.isUndefined(downloadedParams?.summary?.ReturnedMailIndicator) ? (
          downloadedParams?.summary?.ReturnedMailIndicator["_text"] == "true" &&
          thirdModal ? (
            <CRADetailsPopUP
              title={"Returned mail indicator:"}
              details={
                "You have returned mail indicator in your CRA's my account, please contact CRA to update your mailing address."
              }
              onPressCloseModal={() => onPressCloseModal(3)}
              backgroundColor={
                darkTheme
                  ? defaultColors.gSTHSTReturnDarkBackgrund
                  : defaultColors.gSTHSTReturnLightBackgrund
              }
              borderColor={
                darkTheme
                  ? defaultColors.gSTHSTReturnDarkBorder
                  : defaultColors.gSTHSTReturnLightBorder
              }
              titleColor={defaultColors.gSTHSTReturntitle}
            />
          ) : null
        ) : null}

        {!_.isUndefined(downloadedParams?.summary?.GSTHSTReturnIndicator) ? (
          downloadedParams?.summary?.GSTHSTReturnIndicator["_text"] == "true" &&
          fourthModal ? (
            <CRADetailsPopUP
              title={"Outstanding GST/HST Returns:"}
              details={
                "All future refunds will be held until all outstanding returns have been filed. This may include, but is not limited to, any outstanding GST/HST returns. For information on how to file your business GST/HST returns, visit Canada.ca/gst-hst-filing."
              }
              onPressCloseModal={() => onPressCloseModal(4)}
              backgroundColor={
                darkTheme
                  ? defaultColors.gSTHSTReturnDarkBackgrund
                  : defaultColors.gSTHSTReturnLightBackgrund
              }
              borderColor={
                darkTheme
                  ? defaultColors.gSTHSTReturnDarkBorder
                  : defaultColors.gSTHSTReturnLightBorder
              }
              titleColor={defaultColors.gSTHSTReturntitle}
            />
          ) : null
        ) : null}

        {!_.isUndefined(
          downloadedParams?.summary?.ManageOnlineMailIndicator
        ) ? (
          downloadedParams?.summary?.ManageOnlineMailIndicator["_text"] ==
            "true" && fifthModal ? (
            <CRADetailsPopUP
              title={"Manage online mail:"}
              details={
                downloadedParams?.summary?.ManageOnlineMailIndicator["_text"] ==
                "true"
                  ? "Already registered"
                  : "Not registered"
              }
              onPressCloseModal={() => onPressCloseModal(5)}
              backgroundColor={
                darkTheme
                  ? defaultColors.manageOnlineEmailDarkBackgrund
                  : defaultColors.manageOnlineEmailLightBackgrund
              }
              borderColor={
                darkTheme
                  ? defaultColors.manageOnlineEmailDarkBorder
                  : defaultColors.manageOnlineEmailLighBorder
              }
              titleColor={defaultColors.manageOnlineEmailLightitle}
            />
          ) : null
        ) : null}

        {!_.isUndefined(downloadedParams?.slipsFilerted)
          ? downloadedParams?.slipsFilerted.length === 0 &&
            (sixthModal ? (
              <CRADetailsPopUP
                title={
                  "Sorry, we were unable to find any slips for your 2022 taxes using the CRA’s Auto-fill my return feature. Please try again at a later time."
                }
                details={""}
                onPressCloseModal={() => onPressCloseModal(6)}
                backgroundColor={darkTheme ? "#FFF7E8" : "#FFF7E8"}
                borderColor={darkTheme ? "#FFD88E" : "#FFD88E"}
                titleColor={"#003A5B"}
              />
            ) : null)
          : null}

        <View style={{ margin: 20, width: "90%" }}>
          {isDataLoading ? (
            <Spinner style={{ flex: 0, height: 60 }} />
          ) : (
            <FlatList
              contentContainerStyle={{ paddingBottom: 50 }}
              data={DataToRender}
              renderItem={({ item, index }) => renderData(item, index)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
        <View style={{ margin: 20, flex: 1 }}>
          {/* <View style={{flex: 0.6,justifyContent:'center', alignItems: 'center'}}> */}
          <CtText
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: darkTheme
                ? defaultColors.darkModeTextColor
                : defaultColors.secondaryTextColor,
              paddingTop: 4,
              textAlign: "center",
              // paddingLeft: 10,
            }}
          >
            Last download on{" "}
            {moment(downloadedParams?.lastDownloaded).format(
              "dddd, MMMM Do YYYY, h:mm:ss a"
            )}
            <CtText
              style={{
                fontWeight: "400",
                fontSize: 16,
                marginTop: 20,
                color: defaultColors.primaryBlue,
              }}
              onPress={() => onPressRefresh()}
            >
              {"  Try Again"}
            </CtText>
          </CtText>
          {/* </View> */}
          {/* <TouchableOpacity style={{flex: 0.12, justifyContent:'center', alignItems: 'center'}} onPress={() => onPressRefresh()}>
        <MaterialCommunityIcons
                name={"cloud-refresh"}
                size={26} 
                style={{
                  color: defaultColors.primaryBlue,
                }}
              />
        </TouchableOpacity> */}
        </View>
        <CustomButton
          showLoading={loadingAvailable}
          buttonText="Import Data"
          disabled={loadingAvailable}
          onPress={() => onPressConfirm()}
          style={{ marginBottom: 20, marginTop: 10, margin: 20 }}
        />
        {/* <TextButton
          description=" "
          linkText={"Goback"}
          fontSize={16}
          linkTextColor={darkTheme ? defaultColors.white : defaultColors.gray}
          onPress={() => {
            onBackButtonPress();
          }}
        /> */}

        <TouchableOpacity
          style={{
            marginTop: 4,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
          onPress={() => onBackButtonPress()}
        >
          <CtText
            style={{
              // textAlign: "left",
              fontSize: 18,
              fontFamily: "Figtree-SemiBold",
              fontWeight: "600",
              color: darkTheme
                ? defaultColors.darkModeTextColor
                : defaultColors.gray,
            }}
          >
            Goback
          </CtText>
        </TouchableOpacity>
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
      padding: 4,
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

export default CRADetailsScreen;
