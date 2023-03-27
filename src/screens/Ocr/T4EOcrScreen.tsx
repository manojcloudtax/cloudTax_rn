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
} from "react-native";
import { CtText, CtView } from "../../components/UiComponents";
import { defaultColors } from "../../utils/defaultColors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { BottomButton } from "../../components/BottomButton";
import { Header } from "../../components/Header";
import { OCRTextInput } from "../../components/OCRTextInput";
import SearchableDropDown from "../../components/SearchableDropDown";
import { formattedNumString } from "../../utils/common";
import _ from "lodash";
import { CheckBox } from "react-native-elements";
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
const T4EOcrScreen = ({ navigation, route }: any) => {
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
  const [isShowDropDown, setDropdownShow] = useState(false);
  const [getInitialFlatlistArray, setinitialFlatListArray] = useState<
    Array<SlipData>
  >([]);
  const [searchValue, setSearchText] = useState<String>("");
  const [getSearchedArraySlips, setSearchedArraySlips] = useState<SlipData[]>(
    []
  );
  const [getFilteredArray, setFilteredArray] = useState<SlipData[]>([]);
  const [getInitialDataFromOCR, setInitialDataFromOCR] = useState({});
  const [repayment, setRepaymentValue] = useState<string>("");
  const [amountValue, setAmountRecievedValue] = useState<string>("");
  const [selectedIndex, setIndex] = useState(1);
  const [selectedSecondIndex, setSecondIndex] = useState(1);
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
    { id: 14, name: "Total benefits paid", box: "Box14", value: "0.00" },
    {
      id: 15,
      name: "Regular and other benefits paid",
      box: "Box15",
      value: "0.00",
    },
    {
      id: 17,
      name: "Employment benefits & support measures paid",
      box: "Box17",
      value: "0.00",
    },
    {
      id: 20,
      name: "Texation tuition assistance",
      box: "Box20",
      value: "0.00",
    },
    {
      id: 21,
      name: "Non-taxable tuition assistance",
      box: "Box21",
      value: "0.00",
    },
    {
      id: 22,
      name: "Income tax deducted",
      box: "Box22",
      value: "0.00",
    },
    {
      id: 23,
      name: "Quebec income tax deducted",
      box: "Box23",
      validation: "",
      value: "0.00",
    },
    {
      id: 37,
      name: "Ei maternity and parental benefits payments",
      box: "Box37",
      value: "0.00",
    },
  ];

  let restData = [
    {
      id: 18,
      name: "Tax exempt benefits",
      box: "Box18",
      value: "0.00",
    },
    { id: 24, name: "Non-resident tax deducted", box: "Box24", value: "0.00" },
    { id: 30, name: "Ei benefits repaid", box: "Box30", value: "0.00" },
    {
      id: 33,
      name: "Payments out of the consolidated revenue fund",
      box: "Box33",
      value: "0.00",
    },
    {
      id: 36,
      name: "Provincial parental insurance plan benefits",
      box: "Box36",
      value: "0.00",
    },
  ];

  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { data, ScanID, getSelectedFormsData, listedT4Items } =
          route.params;
        setInitialDataToRender(data, ScanID);
        setFormData(getSelectedFormsData);
        setlistedT4Data(listedT4Items);
        console.log("T4EOcrScreen listedT4Items", listedT4Items);
      }
    } catch (error) {}
  }, []);


  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: 't4e_ocr_screen',
    });
  }, []);
  const setInitialDataToRender = (data: any, scanID: string) => {
    console.log("TsetInitialDataToRender", data);
    setScanNewLoading(false);
    setInitialDataFromOCR(data);
    setScanID(scanID);
    let clonedSlipData = _.cloneDeep(Slipdata);
    let FilteredObjectsofRestData = restData.filter(
      (obj) => obj.box in data && data[obj.box] !== "0.00"
    );
    console.log("FilteredObjectsofRestData", FilteredObjectsofRestData);
    clonedSlipData = clonedSlipData.concat(FilteredObjectsofRestData);

    for (let i = 0; i < clonedSlipData.length; i++) {
      clonedSlipData[i].value = data[clonedSlipData[i].box]
        ? formattedNumString(data[clonedSlipData[i].box])
        : "0.00";
    }
    console.log("getSlipData", clonedSlipData);
    setinitialFlatListArray(clonedSlipData);
    let FilteredRestData = restData.filter(
      (obj) => !(obj.box in data && data[obj.box] !== "0.00")
    );
    setSearchedArraySlips(FilteredRestData);
    console.log("getSlipData restData", FilteredRestData);
    setFilteredArray(FilteredRestData);
    setDropdownShow(false);

    setRepaymentValue(
      data["Box7"] !== "" ? parseFloat(data["Box7"])
        .toFixed(2)
        .replace(/\.?0+$/, "") : "0"
    );
    setIndex(data["Include_maternal"] == "Y" ? 0 : 1);
    setSecondIndex(data["indian_maternal"] == "Y" ? 0 : 1);
    setIndex(data["Include_maternal"] == "Y" ? 0 : 1);
    let ReceivedAmount: string = data["Amount_maternal"]
      ? _.isNaN(formattedNumString(data["Amount_maternal"]))
        ? "0.00"
        : formattedNumString(data["Amount_maternal"])
      : "0.00";
    setAmountRecievedValue(ReceivedAmount);
  };

  const renderSlipItems = (item: any) => {
    return (
      <OCRTextInput
        title={item.name}
        boxNumber={item.id}
        value={item.value}
        placeholder={"$0.00"}
        onChangeText={(text: String) => onOcrChangeText(text, item)}
        onBlur={() => onBlur(item)}
      />
    );
  };

  const onBlur = (item: any) => {
    setDropdownShow(false);
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
    setDropdownShow(false);
    // navigation.goBack();
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
        navigation.navigate("EmptySlipsScreen", {
          data: resGetSelectedData,
          // getSelectedData: resGetSelectedData,
        });
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
  };

  const onFocus = () => {
    setDropdownShow(true);
  };

  const onChangeText = (text: String) => {
    setDropdownShow(true);
    setSearchText(text);
    if (text.length !== 0) {
      let array = getSearchedArraySlips.filter(
        (data) =>
          data.name.toLowerCase().includes(text.toLowerCase()) ||
          data.id.toString().toLowerCase().includes(text.toLowerCase())
      );
      console.log("onChangeText aray", array);
      setSearchedArraySlips(array);
    } else {
      setSearchedArraySlips(getFilteredArray);
    }
  };

  const onSelectListItem = (item: any) => {
    console.log("onSelectListItem", item);

    const updatedSlip = [...getInitialFlatlistArray];
    updatedSlip.push(item);
    setinitialFlatListArray(updatedSlip);
    const newArray = getFilteredArray.filter((obj) => obj.id !== item.id);
    console.log("onSelectListItem", newArray);
    setSearchedArraySlips(newArray);
    setFilteredArray(newArray);
    setDropdownShow(false);
    setSearchText("");
  };

  const onSubmit = () => {
    // setDropdownShow(false);
    console.log("onSubmit");
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
          IncomeSlipForms: "6",
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
    //inserting missed key values for the t4 parms
    finalArray["Box7"] = repayment;
    finalArray["TaxPayersName"] = getInitialDataFromOCR["TaxPayersName"];
    finalArray["Amount_maternal"] = amountValue;
    finalArray["Include_maternal"] = selectedIndex === 0 ? "Y" : "N";
    finalArray["indian_maternal"] = selectedSecondIndex === 0 ? "Y" : "N";

    finalArray["ScanID"] = scanID;
    finalArray["TaxID"] = getSavedLoggedInData?.TaxID;
    finalArray["selectNo"] = "-1";
    finalArray["Year"] = "2022";

    console.log("finalArray finalArray EI_voting_shares_status", finalArray);
    console.log("finalArray finalArray listedT4Data", listedT4Data);
    let finalArrayForLastUpdate = [];
    if (listedT4Data != undefined) {
      const indexToUpdate = listedT4Data.findIndex(
        (obj) => obj["T4E_no"] === getInitialDataFromOCR["T4E_no"]
      );

      if (indexToUpdate !== -1) {
        listedT4Data[indexToUpdate] = finalArray;
        const newData = listedT4Data.map((obj, index) => {
          return {
            ...obj,
            ActionType: index === listedT4Data.length - 1 ? 2 : 1,
            SlipNo: index + 1,
            AcctID: savedUserData?.AcctID,
            TaxPayerID: savedUserData?.TaxPayerID,
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
            AcctID: savedUserData?.AcctID,
            TaxPayerID: savedUserData?.TaxPayerID,
          };
        });
        console.log("finalArray newData", newData);
        finalArrayForLastUpdate = newData;
      }
    } else {
      finalArray["ActionType"] = "2";
      finalArray["SlipNo"] = "1";
      finalArray["AcctID"] = savedUserData?.AcctID;
      (finalArray["TaxPayerID"] = savedUserData?.TaxPayerID);
      finalArrayForLastUpdate = [finalArray];
    }

    console.log("finalArray finalArrayForLastUpdate", finalArrayForLastUpdate);
    const PostT4SlipInfoList = await SaveSlipData(
      finalArrayForLastUpdate,
      savedUserData?.token,
      "SaveT4ESlipInfoList"
    );
    if (PostT4SlipInfoList) {
      await firebase.analytics().logEvent("save_t4e_sucss", {
        TaxPayerID: savedUserData?.TaxPayerID,
      });
      let setIncomeSlipForms = "";

      if (getFormsData !== undefined) {
        let splitttedArray = getFormsData.IncomeSlipForms !== null ? getFormsData.IncomeSlipForms.split(","): [];
        if (!splitttedArray.includes("6")) {
          splitttedArray.unshift("6");
        }

        setIncomeSlipForms = splitttedArray.join(",");
      } else {
        setIncomeSlipForms = "6";
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

  const onChangeRepaymentRate = (text: string) => {
    setRepaymentValue(text);
  };

  const onChangeAmountRecieved = (text: string) => {
    setAmountRecievedValue(text);
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
                {Object.keys(getInitialDataFromOCR).length === 0
                  ? ""
                  : "T4E" +
                    " - " +
                    (getInitialDataFromOCR.EmployersName
                      ? getInitialDataFromOCR.EmployersName
                      : "")}
              </CtText>
            </View>
            <CtView style={{ marginTop: 20, width: "100%" }}>
              <OCRTextInput
                title={"Repayment Rate %"}
                boxNumber={"%"}
                value={repayment}
                placeholder={"0"}
                onChangeText={(text: string) => onChangeRepaymentRate(text)}
                //  onBlur={() => onBlur(item)}
              />
            </CtView>
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

            <CtView style={{ marginTop: 10, width: "100%", marginBottom: 10 }}>
              <SearchableDropDown
                value={searchValue}
                placeholder={"Search"}
                onChangeText={(text: String) => onChangeText(text)}
                onSubmit={() => onSubmit()}
                drawerItems={getSearchedArraySlips}
                onSelectListItem={(text: String) => onSelectListItem(text)}
                isShowDropDown={isShowDropDown}
                onFocus={() => onFocus()}
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
                Did your EI benefits include maternity and parental benefits?
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

              {selectedIndex == 0 ? (
                <>
                  <CtView style={{ width: "100%" }}>
                    <OCRTextInput
                      title={"Amount Received"}
                      boxNumber={"CAD"}
                      value={amountValue}
                      placeholder={"$0.00"}
                      onChangeText={(text: string) =>
                        onChangeAmountRecieved(text)
                      }
                    />
                  </CtView>
                  <CtView
                    style={{ marginTop: 10, width: "100%", marginBottom: 100 }}
                  >
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
                      Is this amount exempt under Section 87 of the Indian Act?
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
                          checked={selectedSecondIndex === 0}
                          onPress={() => setSecondIndex(0)}
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
                          checked={selectedSecondIndex === 1}
                          onPress={() => setSecondIndex(1)}
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
                </>
              ) : null}
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

export default T4EOcrScreen;
