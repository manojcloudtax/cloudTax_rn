import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { CtText, CtView } from "../../components/UiComponents";
import { defaultColors } from "../../utils/defaultColors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { BottomButton } from "../../components/BottomButton";
import { Header } from "../../components/Header";
import { OCRTextInput } from "../../components/OCRTextInput";
import { formattedNumString } from "../../utils/common";
import _ from "lodash";
import {
  GetAvailableSlipsData,
  getSelectedSlipData,
  SaveShoeBoxForms,
  SaveSlipData,
} from "../../api/auth";
import { firebase } from "@react-native-firebase/analytics";

interface SlipData {
  id: Number;
  name: any;
  box: String;
  value: String;
}

type StringMap = {
  [key: string]: string;
};
const T5007OcrScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const { savedUserData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const [getInitialFlatlistArray, setinitialFlatListArray] = useState<
    Array<SlipData>
  >([]);
  const [getInitialDataFromOCR, setInitialDataFromOCR] = useState({});
  const [loadingAvailable, setisLoading] = useState<boolean>(false);
  const [ScanNewloadingAvailable, setScanNewLoading] = useState<boolean>(false);
  const [listedT4Data, setlistedT4Data] = useState([]);
  const [getFormsData, setFormData] = useState({
    CreditsForms: "",
    DeductionsForms: "",
    ExpensesForms: "",
    IncomeSlipForms: "",
    ProvincialSlipForms: "",
  });

  const [scanID, setScanID] = useState("");

  let Slipdata = [
    { id: 10, boxNo: 10, name: "Workers compensation benefits", box: "Box10", value: "0.00" },
    { id: 11, boxNo: 11,name: "Social assistance payment", box: "Box11_taxpayer_assist_payment", value: "0.00" },
    // { id: 12, boxNo: 11,name: "Social assistance payment (Spouse)", box: "Box11_spouse_assist_payment", value: "0.00" },
  ];

  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: 't5007_ocr_screen',
    });
  }, []);
  
  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { data, ScanID, getSelectedFormsData, listedT4Items } =
          route.params;
        setInitialDataToRender(data, ScanID);
        setFormData(getSelectedFormsData);
        setlistedT4Data(listedT4Items);
        console.log("T5007OcrScreen listedT4Items", listedT4Items);
      }
    } catch (error) {}
  }, []);

  const setInitialDataToRender = (data: any, scanID: string) => {
    console.log("TsetInitialDataToRender", data);
    setScanNewLoading(false);
    setInitialDataFromOCR(data);
    setScanID(scanID);
    let clonedSlipData = _.cloneDeep(Slipdata);
    for (let i = 0; i < clonedSlipData.length; i++) {
      clonedSlipData[i].value = data[clonedSlipData[i].box]
        ? formattedNumString(data[clonedSlipData[i].box])
        : "0.00";
    }
    console.log("getSlipData", clonedSlipData);
    setinitialFlatListArray(clonedSlipData);
  };

  const renderSlipItems = (item: any) => {
    return (
      <OCRTextInput
        title={item.name}
        boxNumber={item.boxNo}
        value={item.value}
        placeholder={"$0.00"}
        onChangeText={(text: String) => onOcrChangeText(text, item)}
        onBlur={() => onBlur(item)}
      />
    );
  };

  const onBlur = (item: any) => {
    const updatedSlip = [...getInitialFlatlistArray];
    const elementToUpdate = getInitialFlatlistArray.findIndex(
      (element) => element.id === item.id
    );

    console.log(
      "updatedSlip",
      _.isNaN(
        formattedNumString(updatedSlip[elementToUpdate].value.replace(/,/g, ""))
      )
    );

    console.log(
      "updatedSlip",
      formattedNumString(updatedSlip[elementToUpdate].value.replace(/,/g, ""))
    );

    if (elementToUpdate !== -1) {
      updatedSlip[elementToUpdate].value = _.isNaN(
        formattedNumString(updatedSlip[elementToUpdate].value.replace(/,/g, ""))
      )
        ? "0.00"
        : formattedNumString(
            updatedSlip[elementToUpdate].value.replace(/,/g, "")
          ) == "NaN"
        ? "0.00"
        : formattedNumString(
            updatedSlip[elementToUpdate].value.replace(/,/g, "")
          );
    }
    console.log("updatedSlip", updatedSlip);
    setinitialFlatListArray(updatedSlip);
  };

  const onOcrChangeText = (text: String, item: any) => {
    const updatedSlip = [...getInitialFlatlistArray];
    const elementToUpdate = getInitialFlatlistArray.findIndex(
      (element) => element.id === item.id
    );

    if (elementToUpdate !== -1) {
      updatedSlip[elementToUpdate].value = text;
    }

    console.log("updatedSlip", updatedSlip);
    setinitialFlatListArray(updatedSlip);
  };

  const onBackButtonPress = async () => {
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
      setisLoading(false);
      if (resGetSelectedData.ErrCode == -1) {
        console.log("resGetSelectedData else");
        // navigation.navigate("EmptySlipsScreen", {
        //   data: resGetSelectedData,
        //   // getSelectedData: resGetSelectedData,
        // });
        navigation.goBack();
      } else {
        if (resGetSelectedData.IncomeSlipForms == "") {
        //   navigation.navigate("EmptySlipsScreen", {
        //     data: resGetSelectedData,
        //     getSelectedData: resGetSelectedData,
        //   });
        navigation.goBack();
        } else {
          const resAvailableSlipsData = await GetAvailableSlipsData(
            {
              TaxPayerID: savedUserData?.TaxPayerID,
              AcctID: savedUserData?.AcctID,
              Year: 2022,
              TaxID: getSavedLoggedInData?.TaxID,
            },
            savedUserData?.token,
            resGetSelectedData.IncomeSlipForms !== null ? resGetSelectedData.IncomeSlipForms.split(",") : ''
          );

          if (resAvailableSlipsData) {
            console.log("resAvailableSlipsData", resAvailableSlipsData);
            setisLoading(false);
            navigation.replace("MyTaxSlipsScreen", {
              data: resAvailableSlipsData,
              getSelectedData: resGetSelectedData,
            });
          } else {
            navigation.replace("MyTaxSlipsScreen", {
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


  const onPressLetsStartButton = async () => {
    setisLoading(true);
    if (getFormsData == undefined) {
      const resSaveShoeBoxForms = await SaveShoeBoxForms(
        {
          TaxPayerID: savedUserData?.TaxPayerID,
          AcctID: savedUserData?.AcctID,
          Year: 2022,
          TaxID: getSavedLoggedInData?.TaxID,
          CreditsForms: "",
          DeductionsForms: "",
          ExpensesForms: "",
          IncomeSlipForms: "11",
          ProvincialSlipForms: "",
        },
        savedUserData?.token
      );

      if (resSaveShoeBoxForms) {
        console.log("resSaveShoeBoxForms", resSaveShoeBoxForms);
      }
    }

    //Updating finalArray with updated value in the array
    const finalArray: StringMap = getInitialFlatlistArray.reduce(
      (obj, item) => {
        obj[item.box] = item.value.toString().replace(",", "");
        return obj;
      },
      {}
    );
    console.log("finalArray finalArray EI_voting_shares_status", finalArray);
    console.log("finalArray finalArray listedT4Data", listedT4Data);
    console.log("finalArray getInitialDataFromOCR", getInitialDataFromOCR);
    let finalArrayForLastUpdate = [];
    if (listedT4Data != undefined) {
      const indexToUpdate = listedT4Data.findIndex(
        (obj) => obj["T5007_no"] === getInitialDataFromOCR["T5007_no"] 
      );
      console.log("finalArray indexToUpdate", indexToUpdate);
      if (indexToUpdate !== -1) {
        listedT4Data[indexToUpdate] = finalArray;
        const newData = listedT4Data.map((obj, index) => {
          return {
            ...obj,
            ActionType: index === listedT4Data.length - 1 ? 2 : 1,
            SlipNo: index + 1,
            TaxPayerID: savedUserData?.TaxPayerID,
            TaxID: getSavedLoggedInData?.TaxID,
            Year: 2022,
          };
        });
        finalArrayForLastUpdate = newData;
      } else {
        let concatedFinalData = [finalArray].concat(listedT4Data);
        console.log("finalArray concatedFinalData", concatedFinalData);
        const newData = concatedFinalData.map((obj, index) => {
          return {
            ...obj,
            ActionType: index === concatedFinalData.length - 1 ? 2 : 1,
            SlipNo: index + 1,
            TaxPayerID: savedUserData?.TaxPayerID,
            TaxID: getSavedLoggedInData?.TaxID,
            Year: 2022,
          };
        });
        console.log("finalArray newData", newData);
        finalArrayForLastUpdate = newData;
      }
    } else {
      (finalArray["ActionType"] = "2"),
        (finalArray["SlipNo"] = "1"),
        (finalArray["TaxPayerID"] = savedUserData?.TaxPayerID);
        (finalArray["TaxID"] = getSavedLoggedInData?.TaxID);
        (finalArray["Year"] = 2022);
      finalArrayForLastUpdate = [finalArray];
    }

    console.log("finalArray finalArrayForLastUpdate", finalArrayForLastUpdate);
    const SavedSlipInfoList = await SaveSlipData(
      finalArrayForLastUpdate,
      savedUserData?.token,
      'SaveT5007SlipInfoList'
    );
    if (SavedSlipInfoList) { 
      await firebase.analytics().logEvent("save_t5007_success", {
      TaxPayerID: savedUserData?.TaxPayerID,
    });
      let setIncomeSlipForms = "";

      if (getFormsData !== undefined) {
        let splitttedArray = getFormsData.IncomeSlipForms !== null ? getFormsData.IncomeSlipForms.split(","): [];
        if (!splitttedArray.includes("11")) {
          splitttedArray.unshift("11");
        }

        setIncomeSlipForms = splitttedArray.join(",");
      } else {
        setIncomeSlipForms = "11";
      }
      const resGetSelectedData = await SaveShoeBoxForms(
        {
          TaxPayerID: savedUserData?.TaxPayerID,
          AcctID: savedUserData?.AcctID,
          Year: 2022,
          TaxID: getSavedLoggedInData?.TaxID,
          CreditsForms:
            getFormsData !== undefined ? getFormsData.CreditsForms : "",
          DeductionsForms:
            getFormsData !== undefined ? getFormsData.DeductionsForms : "",
          ExpensesForms:
            getFormsData !== undefined ? getFormsData.ExpensesForms : "",
          IncomeSlipForms: setIncomeSlipForms,
          ProvincialSlipForms:
            getFormsData !== undefined ? getFormsData.ProvincialSlipForms : "",
        },
        savedUserData?.token
      );
      console.log("onPressScanYourBill", savedUserData, resGetSelectedData);
      if (resGetSelectedData) {
        if (resGetSelectedData.ErrCode == -1) {
          console.log("resGetSelectedData else");

          setisLoading(false);
        } else {
          // navigation.navigate("EstimatedScreen", {
          //         data: GetGetT1TaxReturnInfo,
          //       });
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
            setisLoading(false);
            if (resGetSelectedData.ErrCode == -1) {
              console.log("resGetSelectedData else");
            } else {
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
                  resGetSelectedData.IncomeSlipForms !== null ? resGetSelectedData.IncomeSlipForms.split(",") : ''
                );

                if (resAvailableSlipsData) {
                  console.log("resAvailableSlipsData", resAvailableSlipsData);
                  setisLoading(false);
                  navigation.replace("MyTaxSlipsScreen", {
                    data: resAvailableSlipsData,
                    getSelectedData: resGetSelectedData,
                  });
                } else {
                  navigation.replace("MyTaxSlipsScreen", {
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
        }
      } else {
        setisLoading(false);
        console.log("resGetSelectedData else");
      }
    } else {
      setisLoading(false);
    }
  };

  console.log("getInitialDataFromOCR", getInitialDataFromOCR);
  return (
    <SafeAreaView style={styles(darkTheme).view}>
      <Header onPressbackButton={() => onBackButtonPress()} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 300 }}
        nestedScrollEnabled={true}
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "android" ? 60 : 0}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          contentContainerStyle={{ flex: 1 }}
        >
          <CtView
            style={{
              flex: 1,
              paddingTop: 10,
              paddingBottom: 30,
              marginHorizontal: 24,
              backgroundColor: darkTheme
                ? defaultColors.black
                : defaultColors.white,
              // flex: 1,
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
              {"Confirm values"}
            </CtText>
            <CtText
              style={{
                fontSize: 18,
                // marginBottom: 42,
                marginTop: 8,
                color: darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.black,
              }}
            >
              Review and edit any incorrect values. you can see your slip here.
            </CtText>

            <View
              style={{
                paddingTop: 20,
                backgroundColor: darkTheme
                  ? defaultColors.black
                  : defaultColors.white,
                // flex: 1,
              }}
            >
              <CtText
                style={{
                  fontSize: 17,
                  marginTop: 10,
                  color: darkTheme
                    ? defaultColors.darkModeTextColor
                    : defaultColors.secondaryText,
                  fontWeight: "400",
                }}
              >
                {"T5007"}
              </CtText>
            </View>
            <CtView style={{ marginTop: 4, width: "100%" }}>
              <FlatList
                contentContainerStyle={{ paddingBottom: 10 }}
                data={getInitialFlatlistArray}
                renderItem={({ item }) => renderSlipItems(item)}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              />
            </CtView>
           
          </CtView>
        </KeyboardAvoidingView>
      </ScrollView>
      <BottomButton
        onPress={() => onPressLetsStartButton()}
        // style={[styles().button]}
        buttonText={"Confirm"}
        showLoading={loadingAvailable}
      />
    </SafeAreaView>
  );
};
const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      // marginBottom: 26,
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
      backgroundColor: defaultColors.gray,
    },
    buttonText: {
      fontSize: 18,
      color: isDarkTheme ? defaultColors.white : defaultColors.white,
      fontWeight: "600",
      borderRadius: 10,
      fontFamily: "Figtree-SemiBold",
    },
  });

export default T5007OcrScreen;
