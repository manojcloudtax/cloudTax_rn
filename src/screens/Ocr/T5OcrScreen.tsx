import React, { useState, useEffect, useRef } from "react";
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
import ReactNativePickerModule, { PickerRef } from "react-native-picker-module";
import _ from "lodash";
import {
  GetAvailableSlipsData,
  getSelectedSlipData,
  SaveShoeBoxForms,
  SaveSlipData,
} from "../../api/auth";
import { OCRDropdown } from "../../components/OCRDropdown";
import { CheckBox } from "react-native-elements";

interface SlipData {
  id: Number;
  name: any;
  box: String;
  value: String;
}

type StringMap = {
  [key: string]: string;
};
const T5OcrScreen = ({ navigation, route }: any) => {
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
  const pickerRef = useRef<PickerRef>(null);
  const [getSelectedDrowdownValue, setSelectedDrowdownValue] =
    useState<string>("");
  const [selectedIndex, setIndex] = useState(0);
  const [getFormsData, setFormData] = useState({
    CreditsForms: "",
    DeductionsForms: "",
    ExpensesForms: "",
    IncomeSlipForms: "",
    ProvincialSlipForms: "",
  });
  let Slipdata = [
    {
      id: 25,
      boxNo: 25,
      name: "Taxable amount of eligible dividends",
      box: "Box25",
      value: "0.00",
    },
    {
      id: 11,
      boxNo: 11,
      name: "Other Taxable dividends amount",
      box: "Box11",
      value: "0.00",
    },
    {
      id: 13,
      boxNo: 13,
      name: "Interest from canadian sources",
      box: "Box13",
      value: "0.00",
    },
    {
      id: 130,
      name: "Type of interest from box 13",
      box: "Interest_inbox13_from",
      boxNo: 13,
      type: "select",
      value: "",
    },
    {
      id: 14,
      boxNo: 14,
      name: "Other Income (CDN)",
      box: "Box14",
      value: "0.00",
    },
    { id: 15, boxNo: 15, name: "Foreign Income", box: "Box15", value: "0.00" },
    {
      id: 16,
      boxNo: 16,
      name: "Foreign Tax Paid",
      box: "Box16",
      value: "0.00",
    },
    {
      id: 17,
      boxNo: 17,
      name: "Royalties your work",
      box: "Box17_Royalities_work",
      value: "0.00",
    },
    {
      id: 170,
      boxNo: 17,
      name: "Royalties other",
      box: "Box17_Royalities_other",
      value: "0.00",
    },
    {
      id: 18,
      boxNo: 18,
      name: "Capital gains dividends",
      box: "Box18",
      value: "0.00",
    },
    {
      id: 19,
      boxNo: 19,
      name: "Accrued income: Annuities",
      box: "Box19",
      value: "0.00",
    },
  ];

  const dataset_1 = ["", "Bank", "Bond", "Mortgage"];
  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { data, ScanID, getSelectedFormsData, listedT4Items } =
          route.params;
        setInitialDataToRender(data);
        setFormData(getSelectedFormsData);
        setlistedT4Data(listedT4Items);
        console.log("T5007OcrScreen listedT4Items", listedT4Items);
        console.log(
          "T5007OcrScreen getSelectedFormsData",
          getSelectedFormsData
        );
        console.log("T5007OcrScreen data", data);
      }
    } catch (error) {}
  }, []);

  const setInitialDataToRender = (data: any) => {
    console.log("TsetInitialDataToRender", data);
    setScanNewLoading(false);
    setInitialDataFromOCR(data);
    let clonedSlipData = _.cloneDeep(Slipdata);
    for (let i = 0; i < clonedSlipData.length; i++) {
      if (clonedSlipData[i].id == 130) {
        console.log("TsetInitialDataToRender", data[clonedSlipData[i].box]);
        clonedSlipData[i].value = data[clonedSlipData[i].box]
          ? data[clonedSlipData[i].box]
          : (data["Interest_inbox13_from"] = "");
      } else {
        clonedSlipData[i].value = data[clonedSlipData[i].box]
          ? formattedNumString(data[clonedSlipData[i].box])
          : "0.00";
      }
    }
    setIndex(data["Received_dueto_spousedealth"] == "Y" ? 0 : 1);
    console.log("getSlipData", clonedSlipData);
    console.log("setinitialFlatListArray clonedSlipData", clonedSlipData);
    setinitialFlatListArray(clonedSlipData);
  };

  const renderSlipItems = (item: any) => {
    return (
      <>
        {item.id == 130 ? (
          <OCRDropdown
            title={item.name}
            boxNumber={item.boxNo}
            value={item.value}
            onPressDropDown={() => pickerRef.current?.show()}
          />
        ) : (
          <OCRTextInput
            title={item.name}
            boxNumber={item.boxNo}
            value={item.value}
            placeholder={"$0.00"}
            onChangeText={(text: String) => onOcrChangeText(text, item)}
            onBlur={() => onBlur(item)}
          />
        )}
      </>
    );
  };

  const onBlur = (item: any) => {
    if (item.id == 130) {
      return;
    }
    const updatedSlip = [...getInitialFlatlistArray];
    const elementToUpdate = getInitialFlatlistArray.findIndex(
      (element) => element.id === item.id
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

  const onPressDropDown = (item: any) => {
    setSelectedDrowdownValue(item);
    pickerRef.current?.hide();
    const updatedSlip = [...getInitialFlatlistArray];
    const elementToUpdate = getInitialFlatlistArray.findIndex(
      (element) => element.id === 130
    );
    if (elementToUpdate !== -1) {
      updatedSlip[elementToUpdate].value = item;
    }
    if (updatedSlip.length !== 0) {
      setinitialFlatListArray(updatedSlip);
    }
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
    if (updatedSlip.length !== 0) {
      setinitialFlatListArray(updatedSlip);
    }
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
    console.log("onPressLetsStartButton", getInitialFlatlistArray);
    // let valueOfBox23 = getInitialFlatlistArray[]

    // return
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
        if (item.id === 130) {
          obj[item.box] = item.value;
        } else {
          obj[item.box] = item.value.toString().replace(",", "");
        }
        return obj;
      },
      {}
    );

    finalArray["Description"] = Object.keys(getInitialDataFromOCR).length !== 0 ? getInitialDataFromOCR?.Description: "";
    finalArray["Received_dueto_spousedealth"] = selectedIndex === 0 ? "Y" : "N";
    console.log("finalArray finalArray finalArray", finalArray);
    let finalArrayForLastUpdate = [];
    if (listedT4Data != undefined) {
      const indexToUpdate = listedT4Data.findIndex(
        (obj) => obj["T5_no"] === getInitialDataFromOCR["T5_no"]
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
      finalArray["TaxID"] = getSavedLoggedInData?.TaxID;
      finalArray["Year"] = 2022;
      finalArrayForLastUpdate = [finalArray];
    }

    console.log("finalArray finalArrayForLastUpdate", finalArrayForLastUpdate);
    const SavedSlipInfoList = await SaveSlipData(
      finalArrayForLastUpdate,
      savedUserData?.token,
      "SaveT5SlipInfoList"
    );
    if (SavedSlipInfoList) {
      let setIncomeSlipForms = "";

      if (getFormsData !== undefined) {
        let splitttedArray = getFormsData.IncomeSlipForms !== null ? getFormsData.IncomeSlipForms.split(","): [];
        if (!splitttedArray.includes("10")) {
          splitttedArray.unshift("10");
        }

        setIncomeSlipForms = splitttedArray.join(",");
      } else {
        setIncomeSlipForms = "10";
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
        contentContainerStyle={{ paddingBottom: 100 }}
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
                {Object.keys(getInitialDataFromOCR).length === 0
                  ? ""
                  : 'T5' +
                    " - " +
                    (getInitialDataFromOCR.Description
                      ? getInitialDataFromOCR.Description
                      : "")}
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
            <CtView style={{ marginTop: 10, width: "100%", marginBottom: 100 }}>
              <CtText
                style={{
                  fontSize: 16,
                  // marginBottom: 42,
                  marginTop: 8,

                  fontFamily: "Figtree-SemiBold",
                  color: darkTheme
                    ? defaultColors.darkModeTextColor
                    : defaultColors.secondaryTextColor,
                }}
              >
                Received due to spouse's death?
              </CtText>

              <View style={{ height: 60, flexDirection: "row" }}>
                <View
                  style={{
                    height: 60,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <CheckBox
                    checked={selectedIndex === 0}
                    onPress={() => setIndex(0)}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  <CtText
                    style={{
                      fontSize: 16,
                      marginLeft: -10,
                      fontFamily: "Figtree-SemiBold",
                      color: darkTheme
                        ? defaultColors.darkModeTextColor
                        : defaultColors.secondaryTextColor,
                    }}
                  >
                    Yes
                  </CtText>
                </View>
                <View
                  style={{
                    height: 60,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <CheckBox
                    checked={selectedIndex === 1}
                    onPress={() => setIndex(1)}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  <CtText
                    style={{
                      fontSize: 16,
                      marginLeft: -10,
                      fontFamily: "Figtree-SemiBold",
                      color: darkTheme
                        ? defaultColors.darkModeTextColor
                        : defaultColors.secondaryTextColor,
                    }}
                  >
                    No
                  </CtText>
                </View>
              </View>
            </CtView>

            {/* <OCRTextInput
            title={'item.name'}
            boxNumber={'%'}
            value={item.value}
            placeholder={"$0.00"}
            onChangeText={(text: String) => onOcrChangeText(text, item)}
            onBlur={() => onBlur(item)}
          /> */}
          </CtView>
        </KeyboardAvoidingView>
      </ScrollView>
      <ReactNativePickerModule
        ref={pickerRef}
        value={getSelectedDrowdownValue}
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
          backgroundColor: darkTheme
            ? defaultColors.black
            : defaultColors.white,
        }}
        onCancel={() => {
          console.log("Cancelled");
        }}
        onValueChange={(value) => {
          console.log("value: ", value);
          onPressDropDown(value);
        }}
      />
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

export default T5OcrScreen;
