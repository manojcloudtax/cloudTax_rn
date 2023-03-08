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
import { OCRDropdown } from "../../components/OCRDropdown";

interface SlipData {
  id: Number;
  name: any;
  box: String;
  value: String;
}

type StringMap = {
  [key: string]: string;
};
const T4APOcrScreen = ({ navigation, route }: any) => {
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
  let Slipdata = [
    {
      id: 14,
      boxNo: 14,
      name: "Retirement Benefit",
      box: "Box14",
      value: "0.00",
    },
    {
      id: 15,
      boxNo: 15,
      name: "Survivor Benefit",
      box: "Box15",
      value: "0.00",
    },
    {
      id: 16,
      boxNo: 16,
      name: "Disability Benefit",
      box: "Box16",
      value: "0.00",
    },
    { id: 17, boxNo: 17, name: "Child Benefit", box: "Box17", value: "0.00" },
    { id: 18, boxNo: 18, name: "Death Benefit", box: "Box18", value: "0.00" },
    {
      id: 19,
      boxNo: 19,
      name: "Post-Retirement Benefit",
      box: "Box19",
      value: "0.00",
    },
    {
      id: 20,
      boxNo: 20,
      name: "Taxable CPP Benefit",
      box: "Box20",
      value: "0.00",
    },
    {
      id: 21,
      boxNo: 21,
      name: "Disability (Number of months)",
      box: "Box21",
      mask: "M0",
      prefix: "",
      value: "0",
    },
    { id: 22, boxNo: 22, name: "Income Tax Deducted", box: "Box22" },
    {
      id: 23,
      boxNo: 23,
      name: "Retirement (Number of months)",
      box: "Box23",
      mask: "M0",
      prefix: "",
      value: "0",
    },
    {
      id: 5378,
      boxNo: 5378,
      name: "Exempt income received by a Canadian Indian",
      box: "Line5378",
      value: "0.00",
    },
  ];

  let restData = [
    {
      id: 21,
      boxNo: 21,
      name: "Disability (Number of months)",
      box: "Box21",
      mask: "M0",
      prefix: "",
    },
    {
      id: 23,
      boxNo: 23,
      name: "Retirement (Number of months)",
      box: "Box23",
      mask: "M0",
      prefix: "",
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
        console.log("T5007OcrScreen listedT4Items", listedT4Items);
      }
    } catch (error) {}
  }, []);

  const setInitialDataToRender = (data: any) => {
    console.log("TsetInitialDataToRender", data);
    setScanNewLoading(false);
    setInitialDataFromOCR(data);
    let clonedSlipData = _.cloneDeep(Slipdata);
    for (let i = 0; i < clonedSlipData.length; i++) {
      if (clonedSlipData[i].id == 23 || clonedSlipData[i].id == 21) {
        clonedSlipData[i].value = data[clonedSlipData[i].box]
          ? parseInt(data[clonedSlipData[i].box]).toString()
          : "0";
      } else {
        clonedSlipData[i].value = data[clonedSlipData[i].box]
          ? formattedNumString(data[clonedSlipData[i].box])
          : "0.00";
      }
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
        placeholder={item.id === 23 || item.id === 21 ? "0" : "$0.00"}
        onChangeText={(text: String) => onOcrChangeText(text, item)}
        onBlur={() => onBlur(item)}
        editable={item.id === 20 ? false: true}
      />
    );
  };

  const onBlur = (item: any) => {
    if (item.id == 23 || item.id == 21) {
      return;
    }
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
    // let valueOfBox23 = getInitialFlatlistArray[]
    const idsToAdd = [23, 21];

    const addedMonthValue = getInitialFlatlistArray
      .filter((item) => idsToAdd.includes(item.id))
      .reduce((acc, curr) => acc + parseInt(curr.value), 0);

    if (addedMonthValue > 12) {
      Alert.alert("Please add valid values for Box 21 &  Box 23");
      return;
    }

    // setisLoading(true);
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
          IncomeSlipForms: "5",
          ProvincialSlipForms: "",
        },
        savedUserData?.token
      );

      if (resSaveShoeBoxForms) {
        console.log("resSaveShoeBoxForms", resSaveShoeBoxForms);
      }
    }
    console.log("onPressLetsStartButton", getInitialFlatlistArray);
    //Updating finalArray with updated value in the array
    const finalArray: StringMap = getInitialFlatlistArray.reduce(
      (obj, item) => {
        if (item.id === 23 || item.id === 21) {
          obj[item.box] = parseInt(item.value).toString();
        } else {
          obj[item.box] = item.value.toString().replace(",", "");
        }
        return obj;
      },
      {}
    );


    delete finalArray["Box20"];
    console.log("onPressLetsStartButton", finalArray);
    let finalArrayForLastUpdate = [];
    if (listedT4Data != undefined) {
      const indexToUpdate = listedT4Data.findIndex(
        (obj) => obj["T4AP_no"] === getInitialDataFromOCR["T4AP_no"]
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
      (finalArray["ActionType"] = "2");
        (finalArray["SlipNo"] = "1");
        (finalArray["TaxPayerID"] = savedUserData?.TaxPayerID);
      finalArray["TaxID"] = getSavedLoggedInData?.TaxID;
      finalArray["Year"] = 2022;
      finalArrayForLastUpdate = [finalArray];
    }

    console.log("finalArray finalArrayForLastUpdate", finalArrayForLastUpdate);
    const SavedSlipInfoList = await SaveSlipData(
      finalArrayForLastUpdate,
      savedUserData?.token,
      "SaveT4APSlipInfoList"
    );
    if (SavedSlipInfoList) {
      let setIncomeSlipForms = "";

      if (getFormsData !== undefined) {
        let splitttedArray = getFormsData.IncomeSlipForms.split(",");
        if (!splitttedArray.includes("5")) {
          splitttedArray.unshift("5");
        }

        setIncomeSlipForms = splitttedArray.join(",");
      } else {
        setIncomeSlipForms = "5";
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
                {"T4AP"}
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

export default T4APOcrScreen;
