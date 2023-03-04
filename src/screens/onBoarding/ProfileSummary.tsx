import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import {
  Button,
  CtText,
  CtView,
  Divider,
  CtTextInput,
} from "../../components/UiComponents";
import { defaultColors } from "../../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Ionicons } from "@expo/vector-icons";
import {
  SaveT1GeneralInfo,
  SaveTaxPayerMyProfileInfo,
  AddNewPartnerInfo,
  SaveTPAccountInfo,
} from "../../api/auth";
import {
  getAnswersOfQuestions,
  getMaritalStatus,
  getTaxPayerPreviousMaritalStatus,
} from "../../utils/common";
import { Header } from "../../components/Header";
import { BottomButton } from "../../components/BottomButton";
import { saveLoggedInSuccessUserData } from "../../store/authSlice";
import { useDispatch } from "react-redux";

const ProfileSummary = ({ navigation, route }: any) => {
  const { savedUserData } = useSelector(
    (state: RootState) => state.authReducer
  );
  let { getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { onBoardingData } = useSelector(
    (state: RootState) => state.onBoardingReducer
  );
  const [key, setKeyToRerender] = useState(1);

  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [selectedProvince, setSelectedProvince] = useState({
    ProvinceCode: "",
    ProvinceName: "",
  });
  const [selectedQuestions, setSelectedQuetions] = useState([
    {
      questionId: "",
      question: "",
      answer: "",
    },
  ]);
  const [selectedPartnerName, setPartnerName] = useState("");
  const [loadingAvailable, setisLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setisLoading(false);
    try {
      console.log("init", savedUserData);
      if (route.params !== undefined) {
        const {
          MaritialStatus,
          Province,
          questions,
          partnerName,
          partnerFromList,
        } = route.params;
        setSelectedMaritalStatus(MaritialStatus);
        setSelectedProvince(Province);
        setSelectedQuetions(questions);
        if (partnerFromList !== "") {
          setPartnerName(partnerFromList);
        } else {
          setPartnerName(partnerName);
        }

        //   console.log("init questions", questions);
      }
    } catch (error) {}
  }, [key]);
  const renderProfileComponent = (
    title: String,
    subtitle: String,
    onPressEditButton: Function
  ) => {
    // console.log("renderQuestions", item);
    return (
      <TouchableOpacity
        style={{
          marginVertical: 10,
          borderRadius: 10,
          borderWidth: 1,
          height: 51,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          borderColor: defaultColors.borderColor,
          flexDirection: "row",
        }}
        onPress={() => onPressEditButton()}
      >
        <CtView style={{ flex: 0.45 }}>
          <CtText
            numberOfLines={1}
            style={{
              fontWeight: "600",
              fontSize: 18,
              marginLeft: 12,
              color: darkTheme
                ? defaultColors.white
                : defaultColors.primaryText,
                fontFamily:'Figtree-SemiBold'
            }}
          >
            {title}
          </CtText>
        </CtView>
        <CtView style={{ flex: 0.45, alignItems: "flex-end" }}>
          <CtText
            numberOfLines={1}
            style={{
              fontWeight: "600",
              fontSize: 16,
              marginLeft: 12,
              color: defaultColors.primaryBlue,
              fontFamily:'Figtree-SemiBold',
            }}
          >
            {subtitle}
          </CtText>
        </CtView>
        <CtView style={{ flex: 0.1, alignItems: "center" }}>
          <Ionicons
            name={"ios-chevron-forward-outline"}
            style={{
              fontSize: 21,
              color: defaultColors.primaryBlue,
            }}
          />
        </CtView>
      </TouchableOpacity>
    );
  };

  const renderPartnerProfileComponent = (
    title: String,
    subtitle: String,
    Value: String,
    onPressEditButton: Function
  ) => {
    return (
      <CtView
        style={{
          marginVertical: 10,
          height: "auto",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 1,
            height: 51,
            justifyContent: "center",
            width: "100%",
            borderColor: defaultColors.borderColor,
            borderBottomWidth: 0,
          }}
          onPress={() => onPressEditButton()}
        >
          <CtText
            numberOfLines={1}
            style={{
              fontWeight: "600",
              fontSize: 18,
              marginLeft: 12,
              color: darkTheme
                ? defaultColors.white
                : defaultColors.primaryText,
                fontFamily:'Figtree-SemiBold',
            }}
          >
            {title}
          </CtText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 51,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderColor: defaultColors.borderColor,
            flexDirection: "row",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={() => onPressEditButton()}
        >
          <CtView style={{ flex: 0.45 }}>
            <CtText
              numberOfLines={1}
              style={{
                fontWeight: "400",
                fontSize: 16,
                marginLeft: 12,
                color: darkTheme
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
              }}
            >
              {subtitle}
            </CtText>
          </CtView>
          <CtView style={{ flex: 0.45, alignItems: "flex-end" }}>
            <CtText
              numberOfLines={1}
              style={{
                fontWeight: "600",
                fontSize: 16,
                marginLeft: 12,
                color: defaultColors.primaryBlue,
                fontFamily:'Figtree-SemiBold',
              }}
            >
              {Value}
            </CtText>
          </CtView>
          <CtView style={{ flex: 0.1, alignItems: "center" }}>
            <Ionicons
              name={"ios-chevron-forward-outline"}
              style={{
                fontSize: 21,
                color: defaultColors.primaryBlue,
              }}
            />
          </CtView>
        </TouchableOpacity>
      </CtView>
    );
  };

  const renderPersonalInfoComponent = () => {
    return (
      <CtView
        style={{
          marginVertical: 10,
          height: "auto",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <CtView
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 1,
            height: 51,
            justifyContent: "center",
            width: "100%",
            borderColor: defaultColors.borderColor,
            borderBottomWidth: 0,
          }}
        >
          <CtText
            numberOfLines={1}
            style={{
              fontWeight: "600",
              fontSize: 18,
              marginLeft: 12,
              fontFamily:'Figtree-SemiBold',
              color: darkTheme
                ? defaultColors.white
                : defaultColors.primaryText,
            }}
            
          >
            {"Personal Information"}
          </CtText>
        </CtView>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 51,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderColor: defaultColors.borderColor,
            flexDirection: "row",
          }}
          onPress={() => onPressQuestion()}
        >
          <CtView style={{ flex: 0.6 }}>
            <CtText
              numberOfLines={1}
              style={{
                fontWeight: "400",
                fontSize: 18,
                marginLeft: 12,
                color: darkTheme
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
              }}
            >
              {"Joint assesment"}
            </CtText>
          </CtView>
          <CtView style={{ flex: 0.3, alignItems: "flex-end" }}>
            <CtText
              numberOfLines={1}
              style={{
                fontWeight: "600",
                fontSize: 16,
                marginLeft: 12,
                color: defaultColors.primaryBlue,
                fontFamily:'Figtree-SemiBold',
              }}
            >
              {selectedQuestions[0].answer}
            </CtText>
          </CtView>
          <CtView style={{ flex: 0.1, alignItems: "center" }}>
            <Ionicons
              name={"ios-chevron-forward-outline"}
              style={{
                fontSize: 21,
                color: defaultColors.primaryBlue,
              }}
            />
          </CtView>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 51,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderColor: defaultColors.borderColor,
            flexDirection: "row",
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          onPress={() => onPressQuestion()}
        >
          <CtView style={{ flex: 0.45 }}>
            <CtText
              numberOfLines={1}
              style={{
                fontWeight: "400",
                fontSize: 16,
                marginLeft: 12,
                color: darkTheme
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
              }}
            >
              {"Dependents"}
            </CtText>
          </CtView>
          <CtView style={{ flex: 0.45, alignItems: "flex-end" }}>
            <CtText
              numberOfLines={1}
              style={{
                fontWeight: "600",
                fontSize: 16,
                marginLeft: 12,
                color: defaultColors.primaryBlue,
                fontFamily:'Figtree-SemiBold',
              }}
            >
              {selectedQuestions[1].answer}
            </CtText>
          </CtView>
          <CtView style={{ flex: 0.1, alignItems: "center" }}>
            <Ionicons
              name={"ios-chevron-forward-outline"}
              style={{
                fontSize: 21,
                color: defaultColors.primaryBlue,
              }}
            />
          </CtView>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 51,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderColor: defaultColors.borderColor,
            flexDirection: "row",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={() => onPressQuestion()}
        >
          <CtView style={{ flex: 0.6 }}>
            <CtText
              numberOfLines={1}
              style={{
                fontWeight: "400",
                fontSize: 16,
                marginLeft: 12,
                color: darkTheme
                  ? defaultColors.whiteGrey
                  : defaultColors.secondaryTextColor,
              }}
            >
              {"Marital status changed"}
            </CtText>
          </CtView>
          <CtView style={{ flex: 0.3, alignItems: "flex-end" }}>
            <CtText
              numberOfLines={1}
              style={{
                fontWeight: "600",
                fontSize: 16,
                marginLeft: 12,
                color: defaultColors.primaryBlue,
                fontFamily:'Figtree-SemiBold',
              }}
            >
              {selectedQuestions[2].answer}
            </CtText>
          </CtView>
          <CtView style={{ flex: 0.1, alignItems: "center" }}>
            <Ionicons
              name={"ios-chevron-forward-outline"}
              style={{
                fontSize: 21,
                color: defaultColors.primaryBlue,
              }}
            />
          </CtView>
        </TouchableOpacity>
      </CtView>
    );
  };

  const onPressContinueButton = async () => {
    setisLoading(true);
    console.log(
      "onPressLastStep onBoardingData res",
      onBoardingData,
      savedUserData
    );
    if(getMaritalStatus(selectedMaritalStatus) === "1" || getMaritalStatus(selectedMaritalStatus) === "2"){
    if (onBoardingData?.partnerDetailsList.PartnerID !== "") {
      const resAddNewPartnerInfo = await AddNewPartnerInfo({
        AcctID: savedUserData?.AcctID,
        TaxPayerID: savedUserData?.TaxPayerID,
        Year: 2022,
        PartnerID:
          onBoardingData?.partnerDetailsList.PartnerID !== ""
            ? onBoardingData?.partnerDetailsList.PartnerID
            : savedUserData?.PartnerID,
            userToken: savedUserData?.token,
      });
      console.log(
        "resAddNewPartnerInfo",
        resAddNewPartnerInfo
      );
      if (resAddNewPartnerInfo) {
        onSuccessApiCall();
      } else {
        setisLoading(false);
        console.log("resAddNewPartnerInfo checkSub:");
      }
    } else {
      const resSaveTPAccountInfo = await SaveTPAccountInfo({
        AcctID: savedUserData?.AcctID,
        TaxPayerID: savedUserData?.TaxPayerID,
        Year: 2022,
        FirstName: onBoardingData?.partnerName,
        userToken: savedUserData?.token,
      });
      console.log(
        "onPressLastStep resSaveTPAccountInfo res",
        resSaveTPAccountInfo
      );
      if (resSaveTPAccountInfo) {
        const resAddNewPartnerInfo = await AddNewPartnerInfo({
          AcctID: savedUserData?.AcctID,
          TaxPayerID: savedUserData?.TaxPayerID,
          Year: 2022,
          PartnerID: resSaveTPAccountInfo?.TaxPayerID,
              userToken: savedUserData?.token,
        });
        console.log(
          "onPressLastStep AddNewPartnerInfo res",
          resAddNewPartnerInfo
        );
        if (resAddNewPartnerInfo) {

          onSuccessApiCall();
        }
      } else {
        setisLoading(false);
        console.log("resSaveTPAccountInfo checkSub:");
        // return {}
      }
    }

  } else {
    onSuccessApiCall();
  }
  };

  const onSuccessApiCall = async () => {
    console.log("onPressLastStep SaveTaxpayerProfileInfo res", savedUserData);
    const resSaveTaxpayer = await SaveT1GeneralInfo({
      AcctID: savedUserData.AcctID,
      TaxPayerID: savedUserData.TaxPayerID,
      Year: 2022,
      userToken: savedUserData.token,
      Province: selectedProvince.ProvinceCode,
      TaxPayerMaritalStatusCode: getMaritalStatus(selectedMaritalStatus),
    });
    console.log("onPressLastStep SaveTaxpayerProfileInfo res", resSaveTaxpayer);
    if (resSaveTaxpayer) {
      if (resSaveTaxpayer.ErrCode == -1) {
        setisLoading(false);
      } else {
        // setisLoading(false);
        console.log(
          "onPressLastStep SaveTaxpayerProfileInfo success",
          resSaveTaxpayer
        );
        console.log(
          "onPressLastStep getSavedLoggedInData",
          getSavedLoggedInData
        );

        let updateTaxIdTogetSavedLoggedInData = {...getSavedLoggedInData}
        updateTaxIdTogetSavedLoggedInData["TaxID"]  = resSaveTaxpayer.TaxID

          console.log(
            "getSavedLoggedInData dataadcsd",
            updateTaxIdTogetSavedLoggedInData
          );
        dispatch(
          saveLoggedInSuccessUserData(updateTaxIdTogetSavedLoggedInData)
        );
        const GetTaxPayerMyProfile = await SaveTaxPayerMyProfileInfo({
          AcctID: savedUserData.AcctID,
          ClaimCreditsFromSpouse: savedUserData.ClaimCreditsFromSpouse,
          DependentStatus: getAnswersOfQuestions(selectedQuestions[2].answer),
          MaritalStatusChanged: getAnswersOfQuestions(
            selectedQuestions[1].answer
          ),
          MaritalStatusChangedDate: savedUserData?.MaritalStatusChangedDate,
          PartnerID: savedUserData?.PartnerID,
          PartnerName: selectedPartnerName,
          Province: selectedProvince.ProvinceCode,
          TaxID: resSaveTaxpayer.TaxID,
          TaxPayerID: savedUserData?.TaxPayerID,
          TaxPayerMaritalStatus: getMaritalStatus(selectedMaritalStatus),
          TaxPayerPreviousMaritalStatus: getTaxPayerPreviousMaritalStatus(
            savedUserData?.TaxPayerPreviousMaritalStatus
          ),
          Year: 2022,
          _PartnerStatus: getAnswersOfQuestions(selectedQuestions[0].answer),
          userToken: savedUserData.token,
        });
        if (GetTaxPayerMyProfile) {
          setisLoading(false);
          if (GetTaxPayerMyProfile.ErrCode == -1) {
            setisLoading(false);
            console.log("GetTaxPayerMyProfile err:", GetTaxPayerMyProfile);
          } else {
            setisLoading(false);
            console.log("GetTaxPayerMyProfile success", GetTaxPayerMyProfile);
            navigation.navigate("SummaryScreen");
          }
        } else {
          console.log("GetTaxPayerMyProfile else");
        }
      }
    } else {
      setisLoading(false);
      console.log("GetTaxPayerMyProfile checkSub:");
      // return {}
    }
  };

  const onBackButtonPress = () => {
    // navigation.goBack();
    navigation.navigate("OnBoardingTaxProfile", {
      selectedScreen: 3,
      selectedYear: "2022",
    });
  };

  const onPressTextYear = () => {
    navigation.navigate("ChooseTaxYearScreen");
  };

  const onPressMaritalStatus = () => {
    navigation.navigate("OnBoardingTaxProfile", {
      selectedScreen: 1,
      selectedYear: "2022",
    });
  };

  const onPressQuestion = () => {
    navigation.navigate("OnBoardingTaxProfile", {
      selectedScreen: 2,
      selectedYear: "2022",
    });
  };

  const onPressProvince = () => {
    navigation.navigate("OnBoardingTaxProfile", {
      selectedScreen: 3,
      selectedYear: "2022",
    });
  };

  console.log("selectedPartnerName checkSub:", selectedPartnerName);
  return (
    <SafeAreaView style={styles(darkTheme).view} key={key}>
      <Header onPressbackButton={() => onBackButtonPress()} />
      <CtView style={styles(darkTheme).view}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} >
          {/* <CtView style={styles(darkTheme).scrollStyle}> */}
          <>
            <CtView
              style={{
                alignItems: "flex-start",
                height: "auto",
                width: "90%",
                marginHorizontal: 24,
                backgroundColor: darkTheme
                  ? defaultColors.black
                  : defaultColors.white,
              }}
            >
              <CtText
                style={{ fontWeight: "600", fontSize: 25, marginTop: 20, fontFamily:'Figtree-SemiBold' }}
              >
                {"Profile Summary"}
              </CtText>
            </CtView>
            <CtView style={{ marginTop: 10, marginHorizontal: 24 }}>
              {renderProfileComponent("Tax Year", "2022", onPressTextYear)}
              {renderProfileComponent(
                "Marital status ",
                selectedMaritalStatus,
                onPressMaritalStatus
              )}
              {selectedQuestions.length > 1
                ? renderPersonalInfoComponent()
                : null}
              {selectedPartnerName !== "" && selectedPartnerName !== null
                ? renderPartnerProfileComponent(
                    "Partner Profile ",
                    "Name",
                    selectedPartnerName,
                    onPressQuestion
                  )
                : null}
              {renderProfileComponent(
                "Province",
                selectedProvince?.ProvinceName,
                onPressProvince
              )}
            </CtView>
          </>
          {/* </CtView> */}
        </ScrollView>

        {/* <CtView
          style={{
            width: "100%",
            height: 80,
            backgroundColor: darkTheme
              ? defaultColors.black
              : defaultColors.white,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
            borderTopWidth: 1.5,
            borderTopColor: defaultColors.borderColor,
          }}
        >
          <CtView
            style={{
              backgroundColor: darkTheme ? "transparent" : "white",
              justifyContent: "center",
              width: "90%",
            }}
          >
            <Button
              onPress={() => onPressContinueButton()}
              style={[styles().button]}
            >
              <CtText style={styles().buttonText}>Next</CtText>
            </Button>
          </CtView>
        </CtView> */}
        <BottomButton
          onPress={() => onPressContinueButton()}
          // style={[styles().button]}
          showLoading={loadingAvailable}
          buttonText={"Next"}
        />
      </CtView>
    </SafeAreaView>
  );
};
const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
    },
    scrollStyle: {
      //   flexGrow: 1,
      paddingTop: 10,
      paddingBottom: 30,
      marginHorizontal: 24,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
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
    button: {
      width: "100%",
      borderRadius: 10,
      alignSelf: "center",
      justifyContent: "center",
      height: 50,
    },
    buttonText: {
      fontSize: 18,
      color: defaultColors.white,
      fontWeight: "600",
    },
  });

export default ProfileSummary;