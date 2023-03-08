import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
} from "react-native";
import {
  Button,
  CtText,
  CtView,
  Divider,
  CtTextInput,
} from "../../components/UiComponents";
import { useIsFocused } from "@react-navigation/native";
import { defaultColors } from "../../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { CommonModal, ErrorMessage } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import { setOnBoardingData } from "../../store/onBoardingSlice";
import _ from "lodash";
import ReactNativePickerModule, { PickerRef } from "react-native-picker-module";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { Header } from "../../components/Header";
import { BottomButton } from "../../components/BottomButton";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { savePartnerDetails } from "../../store/authSlice";

interface Questions {
  questionId: Number;
  question: String;
  answer: String;
}

// interface Province {
//   ProvinceCode: String;
//   ProvinceName: String;
// }

const OnBoardingTaxProfile = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { onBoardingData } = useSelector(
    (state: RootState) => state.onBoardingReducer
  );
  const { savedUserData, saveTPAccountData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { AllProvinces, saveTPMyProfileData, getPartnerDetails } = useSelector((state: RootState) => state.authReducer);

  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [selectedProvince, setSelectedProvince] = useState({
    ProvinceCode: "",
    ProvinceName: "",
  });
  const [selectedScreenNo, setSelectedScreen] = useState(1);
  const [selectedYear, setSelectedYear] = useState("2022");
  const [isShowModal, setShowModal] = useState(false);
  const [isShowErrorModal, setErrorModal] = useState(false);
  const [key, setKeyToRerender] = useState(1);
  const [isYesSelected, setAnswer] = useState(false);

  const [partnerName, setPartnerName] = useState("");
  const [date, setDateValue] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [partnerFromList, setPartnerFromList] = useState('');
  const [partnerDetailsList, setPartnerDetails] = useState({
    PartnerID: "",
    PartnerName: "",
  });
  const [isShowDropDown, setDropdownVisibility] = useState(false);
  // let partnerInput = useRef<TextInput>();

  const pickerRef = useRef<PickerRef>(null);
  const [dropdownValue, setValue] = useState(
    "Single, seperated, divorced, or widow(er)"
  );
  const dataset_1 = [
    "Married, Living common-law",
    "Single, seperated, divorced, or widow(er)",
  ];

  const questions: Array<Questions> = [
    {
      questionId: 1,
      question: "Do you want to prepare jointly with your spouce?",
      answer: "No",
    },
    {
      questionId: 2,
      question: "Do you have dependents?",
      answer: "No",
    },
    {
      questionId: 3,
      question: "Has your marital status changed in 2022?",
      answer: "No",
    },
  ];
  const [getQuestions, setQuestions] = useState(questions);

  const MaritialStatus = [
    "Single",
    "Married",
    "Living Common-law",
    "Widow(er)",
    "Divorced",
    "Seperated",
  ];

  useEffect(() => {
    // console.log("init route.params", route.params);
    try {
      if (route.params !== undefined) {
        const { selectedScreen, selectedYear } = route.params;
        setSelectedScreen(selectedScreen);
        setSelectedYear(selectedYear);
      }

      if (onBoardingData.MaritialStatus !== undefined) {
        console.log("init OnBoardingTaxProfile", onBoardingData);
        setSelectedMaritalStatus(onBoardingData.MaritialStatus);
        setSelectedProvince(onBoardingData.Province);
        if (
          onBoardingData?.MaritalStatusChangedDate !== "" ||
          onBoardingData?.MaritalStatusChangedDate !== null
        ) {
          setDateValue(new Date(onBoardingData?.MaritalStatusChangedDate));
          setDropdownVisibility(true);
        }
        //have to write proper machnism
        questions[0].answer = onBoardingData.answersOfQuestions[0];
        questions[1].answer = onBoardingData.answersOfQuestions[1];
        questions[2].answer = onBoardingData.answersOfQuestions[2];
        setQuestions([...getQuestions]);
        setAnswer(
          onBoardingData?.ClaimCreditsFromSpouse === "Y" ? true : false
        );
        setValue(onBoardingData?.TaxPayerPreviousMaritalStatus);
        setPartnerName('');
        setPartnerDetails(saveTPMyProfileData);
        // saveTPMyProfileData
      }
    } catch (error) {}
  }, [isFocused]);
  const renderMaritalRow = (item: any, index: any) => {
    // console.log("renderQuestions", item);
    return (
      <TouchableOpacity
        key={item}
        style={{
          marginVertical: 10,
          borderRadius: 12,
          borderWidth: darkTheme?  1 : 1.5,
          height: 53,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          backgroundColor:
            item === selectedMaritalStatus
              ? darkTheme
                ? "transparent"
                : "#F0FAFF"
              : "transparent",
          borderColor:
            item === selectedMaritalStatus
              ? defaultColors.blue
              : darkTheme ? defaultColors.darkBorder : defaultColors.borderColor
        }}
        onPress={() => onPressItem(item, index)}
      >
        <CtText
          style={{
            fontWeight: "600",
            fontSize: 18,
            fontFamily:'Figtree-SemiBold',
            color: item === selectedMaritalStatus ? defaultColors.primaryBlue :darkTheme? 'rgba(255, 255, 255, 0.8)': defaultColors.primaryBlue,
          }}
        >
          {item}
        </CtText>
      </TouchableOpacity>
    );
  };

  const renderProvinceRow = (item: any, index: any) => {
    // console.log("renderQuestions", item);
    return (
      <TouchableOpacity
        key={item}
        style={{
          marginVertical: 10,
          borderRadius: 12,
          borderWidth:  darkTheme?  1 : 1.5,
          height: 53,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          backgroundColor:
            item.ProvinceCode === selectedProvince.ProvinceCode
              ? darkTheme
                ? "transparent"
                : "#F0FAFF"
              : "transparent",
          borderColor:
            item.ProvinceCode === selectedProvince.ProvinceCode
            ? defaultColors.blue
            : darkTheme ? defaultColors.darkBorder : defaultColors.borderColor
        }}
        onPress={() => onPressItem(item, index)}
      >
        <CtText
          style={{
            fontWeight: "600",
            fontSize: 18,
            fontFamily:'Figtree-SemiBold',
            color: item.ProvinceCode === selectedProvince.ProvinceCode ? defaultColors.primaryBlue :darkTheme? 'rgba(255, 255, 255, 0.8)': defaultColors.primaryBlue,
          }}
        >
          {item.ProvinceName}
        </CtText>
      </TouchableOpacity>
    );
  };

  const renderQuestions = (item: any, index: any) => {

    if (
      item.questionId === 1 &&
      selectedMaritalStatus !== "Married" &&
      selectedMaritalStatus !== "Living Common-law"
    ) {
      return;
    }
    return (
      <CtView style={{ marginBottom: 20 }}>
        <CtText
          style={{
            fontWeight: "400",
            fontSize: 18,
            color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
          }}
        >
          {item.question}
          {item.questionId === 1 && getPartnerDetails.PartnerID !== null ?  <CtText style={{
            fontWeight: "400",
            fontSize: 18,
            color: defaultColors.blue,
          }}> {'Linked to ' + (getPartnerDetails.PartnerName  !== null ? getPartnerDetails.PartnerName : '-')}</CtText> : null}
         
        </CtText>
        <CtView
          style={{
            flex: 1,
            flexDirection: "row",
            height: 60,
            alignContent: "flex-start",
          }}
        >
          <TouchableOpacity
            style={{
              marginVertical: 10,
              borderRadius: 12,
              borderWidth: darkTheme?  1 : 1.5,
              height: 53,
              justifyContent: "center",
              alignItems: "center",
              flex: 0.45,
              backgroundColor:
                item.answer === "Yes"
                  ? darkTheme
                    ? "transparent"
                    : "#F0FAFF"
                  : "transparent",
              borderColor:
                item.answer === "Yes"
                  ? defaultColors.blue
                  : darkTheme ? defaultColors.darkBorder : defaultColors.borderColor,
            }}
            onPress={() => onPressItem("Yes", index)}
          >
            <CtText
              style={{
                fontWeight: "600",
                fontSize: 18,
                fontFamily:'Figtree-SemiBold',
                color: item.answer === "Yes" ? defaultColors.primaryBlue :darkTheme? defaultColors.white: defaultColors.primaryBlue,
              }}
            >
              {"Yes"}
            </CtText>
          </TouchableOpacity>
          <CtView style={{ flex: 0.1 }}></CtView>
          <TouchableOpacity
            style={{
              marginVertical: 10,
              borderRadius: 12,
              borderWidth:  darkTheme?  1 : 1.5,
              height: 53,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              flex: 0.45,
              backgroundColor:
                item.answer === "No"
                  ? darkTheme
                    ? "transparent"
                    : "#F0FAFF"
                  : "transparent",
              borderColor:
                item.answer === "No"
                  ? defaultColors.blue
                  : darkTheme ? defaultColors.darkBorder : defaultColors.borderColor
            }}
            onPress={() => onPressItem("No", index)}
          >
            <CtText
              style={{
                fontWeight: "600",
                fontSize: 18,
                fontFamily:'Figtree-SemiBold',
                color: item.answer === "No" ? defaultColors.primaryBlue :darkTheme? defaultColors.white: defaultColors.primaryBlue,
              }}
            >
              {"No"}
            </CtText>
          </TouchableOpacity>
        </CtView>
      </CtView>
    );
  };

  const onPressTPAccount = (name: any, index: any, item: any) => {
    setPartnerFromList(name);
    setPartnerName('');

    let SelectedData = {
      PartnerID: item?.TaxPayerID,
      PartnerName: item?.TaxPayerName,
    }
    setPartnerDetails(SelectedData);
  };

  const onChangePartnerName=(text: string) => {
    setPartnerName(text);
     setPartnerFromList('');
     let SelectedData = {
      PartnerID: '',
      PartnerName: '',
    }
    setPartnerDetails(SelectedData);
  }
  const confirmationModal = () => {
    console.log("init confirmationModal saveTPMyProfileData", saveTPMyProfileData);
    console.log("init confirmationModal saveTPAccountData", saveTPAccountData);
    return (
      <View
        style={{
          height: "auto",
          width: "100%",
          backgroundColor: darkTheme ? defaultColors.matBlack : "#F8F8F8",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "auto",
            marginTop: 10,
            marginBottom: 80,
            padding: 20,
            width: "100%",
          }}
        >
          <View
            style={{
              height: "auto",
            }}
          >
            <CtText style={{ fontWeight: "600", fontSize: 25,
              fontFamily:'Figtree-SemiBold', }}>
              {(saveTPAccountData.length !== 0 && saveTPAccountData !== undefined) ? "Create or Select a partner profile" : "Create a partner profile"}
            </CtText>
            {(saveTPAccountData.length !== 0 && saveTPAccountData !== undefined ) ?
            <View style={{ marginTop: 10, maxHeight: 200}}>
              <FlatList
                contentContainerStyle={{ paddingBottom: 20}}
                data={saveTPAccountData}
                renderItem={
                  ({ item, index }) => (
                    // return(
                      <>
                      {(savedUserData?.TaxPayerID !== item.TaxPayerID) ?
                    <TouchableOpacity
                      key={item}
                      style={{
                        marginVertical: 10,
                        borderRadius: 12,
                        borderWidth:  darkTheme?  1 : 1.5,
                        height: 53,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor:
                          item.TaxPayerID === partnerDetailsList.PartnerID
                            ? darkTheme
                              ? "transparent"
                              : "#F0FAFF"
                            : "transparent",
                        borderColor:
                          item.TaxPayerID === partnerDetailsList.PartnerID
                            ? defaultColors.blue
                            : defaultColors.borderColor,
                      }}
                      onPress={() => onPressTPAccount(item.TaxPayerName, index, item)}
                    >
                      <CtText
                        style={{
                          fontWeight: "600",
                          fontSize: 18,
                          marginLeft: 12,
                          color: defaultColors.primaryBlue,
                          fontFamily:'Figtree-SemiBold',
                        }}
                      >
                        {item.TaxPayerName}
                      </CtText>
                    </TouchableOpacity>:
                    null
                    }
                    </>
                  // )
                  )
                }
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              />
            </View>
             :
             null
           }
          </View>
          {(saveTPAccountData.length !== 0 && saveTPAccountData !== undefined )?
          <View
          style={{
            flex: 0,
            height: 40,
            backgroundColor: defaultColors.transparent,
          }}
        >
          <Divider/>
        </View>
          :
          null
        }
          <CtText
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
              marginTop: 10,
              marginBottom: 6
            }}
          >
            Create a new profile
          </CtText>

          <CustomInput
              editable={true}
              placeholder={"Your Name"}
              placeholderTextColor={defaultColors.gray}
              onChangeText={(partnerName: string) => onChangePartnerName(partnerName)}
              // onBlur={onEmailSubmit}
              keyboardType={"email-address"}
              value={partnerName}
              autoCapitalize="none"/>
          {/* <CtView
            style={{
              flex: 0,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 6,
              backgroundColor: "transparent",
            }}
          >

          </CtView> */}
            {/* <CustomInput
              editable={true}
              placeholder={"Your Name"}
              placeholderTextColor={defaultColors.gray}
              onChangeText={(partnerName: string) => onChangePartnerName(partnerName)}
              // onBlur={onEmailSubmit}
              keyboardType={"email-address"}
              autoCapitalize="none"/> */}
            {/* <CtTextInput
              // ref={partnerInput}
              editable={true}
              blurOnSubmit={true}
              placeholder={"Your Name"}
              placeholderTextColor={defaultColors.gray}
              style={{
                borderWidth:  darkTheme?  1 : 1.5,
                borderColor: "#DADADA",
                backgroundColor: "transparent",
                marginTop: 0,
                padding: 15,
                paddingLeft: 42,
                marginBottom: 24,
                borderRadius: 8,
                width: "100%",
                fontFamily: "Figtree-Medium",
              }}
              onFocus={() => setPartnerFromList('')}
              onChangeText={(partnerName: string) => onChangePartnerName(partnerName)}
              value={partnerName}
            /> */}
          {/* <ErrorMessage text={'passwordError'} /> */}
        </View>
        <CtView
          style={{
            width: "100%",
            height: 80,
            backgroundColor: darkTheme? defaultColors.black: defaultColors.white,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 10,
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
            {/* <Button
              onPress={() => onPressModalContinueButton()}
              style={[styles().button]}
            >
              <CtText style={styles().buttonText}>Confirm</CtText>
            </Button> */}
            <CustomButton
                buttonText="Confirm"
                onPress={() => onPressModalContinueButton()}
                style={{marginBottom: 20}}/>
          </CtView>
        </CtView>
      </View>
    );
  };

  const ErrorModal = () => {
    return (
      <View
        style={{
          height: "auto",
          width: "100%",
          backgroundColor: darkTheme ? defaultColors.matBlack : "#F8F8F8",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "auto",
            marginTop: 10,
            marginBottom: 80,
            padding: 20,
            width: "100%",
          }}
        >
          <View
            style={{
              height: 100,
            }}
          >
            <CtText style={{ fontWeight: "600", fontSize: 20, textAlign: 'center',
              fontFamily:'Figtree-SemiBold', }}>
              {"Selected province is not available for this tax year."}
            </CtText>
          </View>
        </View>
        <CtView
          style={{
            width: "100%",
            height: 80,
            backgroundColor: darkTheme ? defaultColors.matBlack : defaultColors.white,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 10,
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
            <Button onPress={() => onBackdropPress()} style={[styles().button]}>
              <CtText style={styles().buttonText}>Okay</CtText>
            </Button>
          </CtView>
        </CtView>
      </View>
    );
  };

  const onPressItem = (item: any, index: any) => {
    console.log("onPressItem", savedUserData);
    if (selectedScreenNo == 1) {
      setSelectedMaritalStatus(item);
      setKeyToRerender(key + 1);
    } else if (selectedScreenNo == 2) {
      if (getPartnerDetails.PartnerID  !== null && index == 0) {
        return;
      } else {
        getQuestions[index].answer = item;
        setQuestions([...getQuestions]);
      }
      setKeyToRerender(key + 1);
    } else if (selectedScreenNo == 3) {
      setSelectedProvince(item);
      // setKeyToRerender(key + 1);
    }
  };
  const onPressContinueButton = () => {
    setShowModal(false);
console.log("selectedProvince.ProvinceCode", selectedProvince.ProvinceCode);
    if(selectedProvince.ProvinceCode == 'NU' || selectedProvince.ProvinceCode == 'QC' ||selectedProvince.ProvinceCode == 'NT' || selectedProvince.ProvinceCode =='YT'){

      setErrorModal(true);

    } else {

      if (selectedScreenNo == 1 && selectedMaritalStatus !== "") {
        setSelectedScreen(selectedScreenNo + 1);
      } else if (selectedScreenNo == 2) {

        if (getQuestions[0].answer === "No"){
        let partnerDetails = {
          PartnerID : getPartnerDetails?.PartnerID,
          PartnerName : getPartnerDetails?.PartnerName,
          TypedPartnerName: null,
          SelectedPartnerID: null,
          SelectedPartnerName: null,
        }
        dispatch(savePartnerDetails(partnerDetails));
      }
        console.log("selectedProvince.getPartnerDetails passed 1", getPartnerDetails);
        if (getQuestions[0].answer === "Yes" &&  getPartnerDetails?.PartnerID === null) {
          if(getPartnerDetails.SelectedPartnerID  === null && getPartnerDetails.TypedPartnerName === null){
            setShowModal(true);
          } else {
            setSelectedScreen(selectedScreenNo + 1);
          }
        } else {
          if (getQuestions[2].answer === "Yes") {
            setSelectedScreen(selectedScreenNo + 1);
          } else {
            setSelectedScreen(selectedScreenNo + 1);
          }
        }
      } else if (selectedScreenNo == 3 && selectedProvince.ProvinceCode !== '') {
        let province = {
          ProvinceCode: selectedProvince.ProvinceCode,
          ProvinceName:  AllProvinces.find(
                    (x: { ProvinceCode: any }) =>
                      x.ProvinceCode ===
                      selectedProvince?.ProvinceCode
                  ).ProvinceName,
        }
        const params = {
          MaritialStatus: selectedMaritalStatus,
          Province: province,
          questions: getQuestions,
          partnerName: partnerName,
          selectedYear: selectedYear,
          answersOfQuestions: _.map(getQuestions, "answer"),
          MaritalStatusChangedDate: isShowDropDown
            ? moment(date).format("YYYY-MM-DD").toString()
            : "",
          TaxPayerPreviousMaritalStatus:
            date && isShowDropDown ? dropdownValue : "",
          partnerFromList: partnerFromList,
          ClaimCreditsFromSpouse:
            date && dropdownValue == "Married, Living common-law"
              ? isYesSelected
                ? "Y"
                : "N"
              : "",
        };
        const paramsds = {
          MaritialStatus: selectedMaritalStatus,
          Province: province,
          partnerName: partnerName,
          selectedYear: selectedYear,
          answersOfQuestions: _.map(getQuestions, "answer"),
          MaritalStatusChangedDate: isShowDropDown
            ? moment(date).format("YYYY-MM-DD").toString()
            : "",
          TaxPayerPreviousMaritalStatus:
            date && isShowDropDown ? dropdownValue : "",
          partnerFromList: partnerFromList,
          ClaimCreditsFromSpouse:
            date && dropdownValue == "Married, Living common-law"
              ? isYesSelected
                ? "Y"
                : "N"
              : "",
              partnerDetailsList: partnerDetailsList,
        };
  
        dispatch(setOnBoardingData(paramsds));
        navigation.navigate("ProfileSummary", params);
      }
    }
  };

  const onPressModalContinueButton = () => {
    setShowModal(false);
    if (partnerName !== "" || partnerFromList != '') {
      setSelectedScreen(selectedScreenNo + 1);
      let partnerDetails = {
        PartnerID : null,
        PartnerName : null,
        TypedPartnerName: partnerName == "" ? null: partnerName,
        SelectedPartnerID: partnerDetailsList.PartnerID == "" ? null: partnerDetailsList.PartnerID,
        SelectedPartnerName: partnerDetailsList.PartnerName == "" ? null: partnerDetailsList.PartnerName,
      }
      dispatch(savePartnerDetails(partnerDetails));
    }
  };
  const onBackdropPress = () => {
    setShowModal(false);
    setErrorModal(false);
  };

  const onBackButtonPress = () => {
    if (selectedScreenNo !== 1) {
      setSelectedScreen(selectedScreenNo - 1);
    } else {
      navigation.goBack();
    }
  };

  const getTitle = (selectedScreenNo: Number) => {
    switch (selectedScreenNo) {
      case 1:
        return "Marital status on December 31, 2022";
      case 2:
        return "Does any of these apply in 2022?";
      case 3:
        return "Province of residence on December 31, 2022";
      default:
        return "";
    }
  };

  const getFlatListData = (selectedScreenNo: Number) => {
    switch (selectedScreenNo) {
      case 1:
        return MaritialStatus;
      case 2:
        return getQuestions;
      case 3:
        return AllProvinces;
      default:
        return [];
    }
  };

  const onPressQuestion = (item: boolean) => {
    if (item) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const setDate = () => {
    setOpen(true);
  };

  return (
    <SafeAreaView style={styles(darkTheme).view} key={key}>
      <CommonModal
        isShowModal={isShowModal}
        ChildView={confirmationModal()}
        onBackdropPress={() => onBackdropPress()}
      />

      <CommonModal
        isShowModal={(selectedScreenNo == 3 && isShowErrorModal)}
        ChildView={ErrorModal()}
        onBackdropPress={() => onBackdropPress()}
      />
       <Header onPressbackButton={() => onBackButtonPress()}/>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: darkTheme? defaultColors.black: defaultColors.white}}
      >
        <CtView style={styles(darkTheme).view}>
          {/* <TouchableOpacity
            style={{
              alignItems: "flex-start",
              height: "auto",
              width: "90%",
              flexDirection: "row",
              paddingLeft: 20,
              paddingTop: 20
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
          <CtView style={styles(darkTheme).scrollStyle}>
            {/* <CtView
              style={{
                alignItems: "flex-start",
                height: "auto",
                width: "90%",
              }}
            > */}
              <CtText
                style={{ fontWeight: "600", fontSize: 25, marginTop: 10,
                fontFamily:'Figtree-SemiBold', }}
              >
                {getTitle(selectedScreenNo)}
              </CtText>
            {/* </CtView> */}
            <CtView style={{ marginTop: 20, flex: 1 }}>
              <FlatList
                contentContainerStyle={{ paddingBottom: 80 }}
                data={getFlatListData(selectedScreenNo)}
                renderItem={({ item, index }) =>
                  selectedScreenNo == 2
                    ? renderQuestions(item, index)
                    : selectedScreenNo == 3
                    ? renderProvinceRow(item, index)
                    : renderMaritalRow(item, index)
                }
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() =>
                  selectedScreenNo == 2 && getQuestions[2].answer === "Yes" ? (
                    <CtView style={{ marginTop: 5 }}>
                      <CtText
                        style={{
                          fontWeight: "400",
                          fontSize: 18,
                          color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
                        }}
                      >
                        What was the date of change?
                      </CtText>
                      <CtView
                        style={{
                          marginTop: 15,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                          alignSelf: "center",
                          height: 50,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 50,
                            borderWidth:  darkTheme?  1 : 1.5,
                            borderColor: "#DEE1E9",
                            borderRadius: 8,
                          }}
                          onPress={() => setDate()}
                        >
                          <CtText
                            disabled={true}
                            style={{
                              backgroundColor: "transparent",
                              width: "100%",
                              fontFamily: "Figtree-Medium",
                              textAlign: "center",
                              fontWeight: "400",
                              color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
                            }}
                          >
                            {isShowDropDown
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
                              color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
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
                            borderWidth:  darkTheme?  1 : 1.5,
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
                              fontFamily: "Figtree-Medium",
                              textAlign: "center",
                              fontWeight: "400",
                              color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
                            }}
                          >
                            {isShowDropDown
                              ? moment(date, "YYYY/MM/DD").format("M")
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
                              color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
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
                            borderWidth:  darkTheme?  1 : 1.5,
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
                              fontFamily: "Figtree-Medium",
                              textAlign: "center",
                              fontWeight: "400",
                              color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
                            }}
                          >
                            {isShowDropDown
                              ? moment(date, "YYYY/MM/DD").format("D")
                              : "DD"}
                          </CtText>
                        </TouchableOpacity>
                      </CtView>

                      {open ? (
                        <DatePicker
                          modal
                          minimumDate={new Date("2022-01-01")}
                          maximumDate={new Date("2022-12-31")}
                          mode="date"
                          open={open}
                          date={date}
                          timeZoneOffsetInMinutes={0}
                          textColor={darkTheme? "black": "black"}
                          theme={darkTheme ? 'dark':'light'}
                          onConfirm={(date) => {
                            console.log("onConfirm", date);
                            setOpen(false);
                            setDateValue(date);
                            setDropdownVisibility(true);
                          }}
                          onCancel={() => {
                            setOpen(false);
                          }}
                        />
                      ) : null}
                      <CtView style={{ marginTop: 20 }}>
                        {isShowDropDown ? (
                          <>
                            <CtText
                              style={{
                                fontWeight: "400",
                                fontSize: 18,
                                color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
                              }}
                            >
                              What was the status before the change?
                            </CtText>
                            <CtView>
                              <TouchableOpacity
                                style={{
                                  marginVertical: 10,
                                  borderRadius: 10,
                                  borderWidth:  darkTheme?  1 : 1.5,
                                  height: 51,
                                  justifyContent: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                  borderColor: defaultColors.borderColor,
                                  flexDirection: "row",
                                }}
                                onPress={() => pickerRef.current?.show()}
                              >
                                <CtView style={{ flex: 0.8 }}>
                                  <CtText
                                    numberOfLines={1}
                                    style={{
                                      fontWeight: "400",
                                      fontSize: 18,
                                      marginLeft: 12,
                                      color: darkTheme? defaultColors.white: defaultColors.primaryText,
                                    }}
                                  >
                                    {dropdownValue}
                                  </CtText>
                                </CtView>
                                <CtView
                                  style={{ flex: 0.2, alignItems: "center" }}
                                >
                                  <Ionicons
                                    name={"ios-chevron-down-outline"}
                                    style={{
                                      fontSize: 21,
                                      color: defaultColors.primaryBlue,
                                    }}
                                  />
                                </CtView>
                              </TouchableOpacity>
                              <ReactNativePickerModule
                                ref={pickerRef}
                                value={dropdownValue}
                                title={""}
                                items={dataset_1}
                                titleStyle={{ color: "grey" }}
                                itemStyle={{ color: "black" }}
                                selectedColor={defaultColors.primaryBlue}
                                confirmButtonEnabledTextStyle={{
                                  color: "black",
                                }}
                                confirmButtonDisabledTextStyle={{
                                  color: "black",
                                }}
                                cancelButtonTextStyle={{ color: "black" }}
                                confirmButtonStyle={{
                                  backgroundColor: "white",
                                }}
                                cancelButtonStyle={{
                                  backgroundColor: "white",
                                }}
                                contentContainerStyle={{
                                  backgroundColor: darkTheme? defaultColors.black: defaultColors.white,
                                }}
                                onCancel={() => {
                                  console.log("Cancelled");
                                }}
                                onValueChange={(value) => {
                                  console.log("value: ", value);
                                  setValue(value);
                                }}
                              />
                            </CtView>
                          </>
                        ) : (
                          <CtView />
                        )}
                      </CtView>

                      <CtView style={{ marginBottom: 40 }}>
                        {date &&
                        dropdownValue == "Married, Living common-law" ? (
                          <CtView style={{ marginTop: 14 }}>
                            <CtText
                              style={{
                                fontWeight: "400",
                                fontSize: 18,
                                color: darkTheme? defaultColors.whiteGrey: defaultColors.secondaryTextColor,
                              }}
                            >
                              {
                                "Do you want to claim credits from your (former) spouse or common-law partner?"
                              }
                            </CtText>
                            <CtView
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                height: 60,
                                alignContent: "flex-start",
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  marginVertical: 10,
                                  borderRadius: 12,
                                  borderWidth:  darkTheme?  1 : 1.5,
                                  height: 53,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  flex: 0.45,
                                  backgroundColor: isYesSelected
                                    ? darkTheme
                                      ? "transparent"
                                      : "#F0FAFF"
                                    : "transparent",
                                  borderColor: isYesSelected
                                    ? defaultColors.blue
                                    : defaultColors.ghostWhite,
                                }}
                                onPress={() => onPressQuestion(true)}
                              >
                                <CtText
                                  style={{
                                    fontWeight: "600",
                                    fontFamily:'Figtree-SemiBold',
                                    fontSize: 18,
                                    color: isYesSelected ? defaultColors.primaryBlue :darkTheme? defaultColors.white: defaultColors.primaryBlue,
                                  }}
                                >
                                  {"Yes"}
                                </CtText>
                              </TouchableOpacity>
                              <CtView style={{ flex: 0.1 }}></CtView>
                              <TouchableOpacity
                                style={{
                                  marginVertical: 10,
                                  borderRadius: 12,
                                  borderWidth:  darkTheme?  1 : 1.5,
                                  height: 53,
                                  justifyContent: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                  flex: 0.45,
                                  backgroundColor: !isYesSelected
                                    ? darkTheme
                                      ? "transparent"
                                      : "#F0FAFF"
                                    : "transparent",
                                  borderColor: !isYesSelected
                                    ? defaultColors.blue
                                    : defaultColors.ghostWhite,
                                }}
                                onPress={() => onPressQuestion(false)}
                              >
                                <CtText
                                  style={{
                                    fontWeight: "600",
                                    fontFamily:'Figtree-SemiBold',
                                    fontSize: 18,
                                    color: !isYesSelected ? defaultColors.primaryBlue :darkTheme? defaultColors.white: defaultColors.primaryBlue,
                                  }}
                                >
                                  {"No"}
                                </CtText>
                              </TouchableOpacity>
                            </CtView>
                          </CtView>
                        ) : (
                          <CtView />
                        )}
                      </CtView>
                    </CtView>
                  ) : null
                }
              />
            </CtView>
          </CtView>
        </CtView>

        {/* <CtView
          style={{
            width: "100%",
            height: 80,
            backgroundColor: darkTheme? defaultColors.black: defaultColors.white,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 20,
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
              <CtText style={styles().buttonText}>Let’s Start</CtText>
            </Button>
          </CtView>
        </CtView> */}
        <BottomButton
        onPress={() => onPressContinueButton()}
        // style={[styles().button]}
        buttonText={'Confirm'}
        // showLoading={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: isDarkTheme? defaultColors.black: defaultColors.white,
    },
    scrollStyle: {
      flex: 1,
      // paddingTop: 10,
      paddingBottom: 30,
      marginHorizontal: 20,
      backgroundColor: isDarkTheme? defaultColors.black: defaultColors.white,
    },
    input: {
      borderWidth:  isDarkTheme ?  1 : 1.5,
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
      fontFamily:'Figtree-SemiBold',
    },
  });

export default OnBoardingTaxProfile;
