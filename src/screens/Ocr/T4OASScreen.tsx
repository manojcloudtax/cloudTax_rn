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
  Alert,
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

interface SlipData {
  id: Number;
  name: any;
  box: String;
  value: String;
}

type StringMap = {
  [key: string]: string;
};
const T4OASScreen = ({ navigation, route }: any) => {
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
  const [listedT4Data, setlistedT4Data] = useState([]);

  const [scanID, setScanID] = useState("");
  const [getFormsData, setFormData] = useState({
    CreditsForms: "",
    DeductionsForms: "",
    ExpensesForms: "",
    IncomeSlipForms: "",
    ProvincialSlipForms: "",
  });
  let Slipdata = [
    {
      id: 18,
      name: "Taxable pension paid",
      box: "Box18",
      value: "0.00",
      boxNo: 18,
    },
    {
      id: 19,
      name: "Gross pension paid",
      box: "Box19",
      value: "0.00",
      boxNo: 19,
    },
    {
      id: 20,
      name: "Overpayment recovered",
      box: "Box20",
      value: "0.00",
      boxNo: 20,
    },
    {
      id: 21,
      name: "Net supplements paid",
      box: "Box21",
      value: "0.00",
      boxNo: 21,
    },
    {
      id: 22,
      name: "Income tax deducted",
      box: "Box22",
      value: "0.00",
      boxNo: 22,
    },
    {
      id: 23,
      name: "Quebec Income tax deducted",
      box: "Box23",
      value: "0.00",
      boxNo: 23,
    },
  ];

  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { data, ScanID, getSelectedFormsData, listedT4Items } =
          route.params;
        setInitialDataToRender(data);
        setFormData(getSelectedFormsData);
        setlistedT4Data(listedT4Items);
        setScanID(ScanID);
        console.log("T5007OcrScreen listedT4Items", listedT4Items);
      }
    } catch (error) {}
  }, []);

  const setInitialDataToRender = (data: any) => {
    console.log("TsetInitialDataToRender", data);
    setInitialDataFromOCR(data);
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
        editable={true}
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
            resGetSelectedData.IncomeSlipForms.split(",")
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
    console.log("onPressLetsStartButton", getInitialFlatlistArray);
    console.log("onPressLetsStartButton getFormsData", getFormsData);
    // setisLoading(true);
    if (!getFormsData.IncomeSlipForms.includes("4")) {
      const resSaveShoeBoxForms = await SaveShoeBoxForms(
        {
          TaxPayerID: savedUserData?.TaxPayerID,
          AcctID: savedUserData?.AcctID,
          Year: 2022,
          TaxID: getSavedLoggedInData?.TaxID,
          CreditsForms: "",
          DeductionsForms: "",
          ExpensesForms: "",
          IncomeSlipForms: "4",
          ProvincialSlipForms: "",
        },
        savedUserData?.token
      );

      if (resSaveShoeBoxForms) {
        console.log("resSaveShoeBoxForms", resSaveShoeBoxForms);
      }
    }
    console.log("onPressLetsStartButton", getInitialFlatlistArray);
    console.log(
      "onPressLetsStartButton getSavedLoggedInData",
      getSavedLoggedInData
    );
    console.log("onPressLetsStartButton savedUserData", getSavedLoggedInData);
    //Updating finalArray with updated value in the array
    const finalArray: StringMap = getInitialFlatlistArray.reduce(
      (obj, item) => {
        obj[item.box] = item.value.toString().replace(",", "");
        return obj;
      },
      {}
    );
    console.log("onPressLetsStartButton", finalArray, scanID);
    let finalArrayForLastUpdate = [];

    finalArray["TaxID"] = getSavedLoggedInData?.TaxID;
    finalArray["ActionType"] = "2";
    finalArray["SlipNo"] = "1";
    finalArray["AcctID"] = savedUserData?.AcctID;
    finalArray["TaxPayerID"] = savedUserData?.TaxPayerID;
    finalArray["Year"] = 2022;
    finalArray["ScanID"] = scanID;
    finalArrayForLastUpdate = finalArray;

    console.log("finalArray finalArrayForLastUpdate", finalArrayForLastUpdate);
    const SavedSlipInfoList = await SaveSlipData(
      finalArrayForLastUpdate,
      savedUserData?.token,
      "SaveT4AOASSlipInfo"
    );
    if (SavedSlipInfoList) {
      let setIncomeSlipForms = "";

      if (getFormsData !== undefined) {
        let splitttedArray = getFormsData.IncomeSlipForms.split(",");
        if (!splitttedArray.includes("4")) {
          splitttedArray.unshift("4");
        }

        setIncomeSlipForms = splitttedArray.join(",");
      } else {
        setIncomeSlipForms = "4";
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
                  resGetSelectedData.IncomeSlipForms.split(",")
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
                {"T4A(OAS)"}
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

export default T4OASScreen;
