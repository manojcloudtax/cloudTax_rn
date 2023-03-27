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
import SearchableDropDown from "../../components/SearchableDropDown";
import { formattedNumString } from "../../utils/common";
import _ from "lodash";
import { OCRDropdown } from "../../components/OCRDropdown";
import ReactNativePickerModule, { PickerRef } from "react-native-picker-module";
import { OCRSelectableComponent } from "../../components/OCRSelectableComponent";
import { CheckBox } from "react-native-elements";
import {
  GetAvailableSlipsData,
  getSelectedSlipData,
  SaveShoeBoxForms,
  SaveT4SlipInfoList,
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
const T4OcrScreen = ({ navigation, route }: any) => {
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
  const pickerRef = useRef<PickerRef>(null);
  const pickerEmploymentRef = useRef<PickerRef>(null);
  const [setProvinceValue, setValueOfProvince] = useState<string>("");
  const [setEmpValue, setEmploymentValue] = useState<string>("");

  const [isSelectFirstBox, selectFirstBox] = useState(false);
  const [isSelectSecondBox, selectSecondBox] = useState(false);
  const [isSelectThirdBox, selectThirdBox] = useState(false);
  const [selectedIndex, setIndex] = useState(0);
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
  const slip: StringMap = {
    Blur: "Not Blur",
    Box10: "ON",

    Box12: "544734460",

    Box14: "10829.63",

    Box16: "538.26",

    Box17: "",

    Box18: "171.11",

    Box20: "",

    Box22: "1003.76",

    Box24: "10829.63",

    Box26: "10829.63",

    Box28CPPQPP: "N",

    Box28EI: "N",

    Box28PPIP: "N",

    Box29: "",

    Box44: "",

    Box46: "",

    Box52: "",

    Box54: "",

    Box55: "",

    EmployersName: "779414 ONTARIO INC",

    ScanID: "63fcc4e50b9dd85a7f7074e5",

    Type: "T4",

    Year: "2022",

    proc_time: "6.1897s",
  };

  let Slipdata = [
    { id: 14, name: "Total Earnings", box: "Box14", value: "0.00" },
    { id: 16, name: "Canada Pension Plan", box: "Box16", value: "0.00" },
    { id: 17, name: "Quebec Pension Plan", box: "Box17", value: "0.00" },
    { id: 18, name: "Employment Insurance", box: "Box18", value: "0.00" },
    { id: 20, name: "RPP Contributions", box: "Box20", value: "0.00" },
    { id: 22, name: "Income Tax Deducted", box: "Box22", value: "0.00" },
    {
      id: 24,
      name: "Insurable Earnings",
      box: "Box24",
      validation: "",
      value: "0.00",
    },
    {
      id: 26,
      name: "CPP / QPP Pensionable Earnings",
      box: "Box26",
      validation: "",
      value: "0.00",
    },
    { id: 44, name: "Union Dues", box: "Box44", value: "0.00" },
    { id: 46, name: "Charitable Donations", box: "Box46", value: "0.00" },
    // {
    //   id: 46,
    //   name: "Donations made to government bodies?",
    //   box: "Box46_government",
    //   type: "select",
    //   value: "0.00",
    // },
    { id: 52, name: "Pensions Adjustment", box: "Box52", value: "0.00" },
    { id: 56, name: "PPIP Insurable Earnings", box: "Box56", value: "0.00" },
    {
      id: 55,
      name: "Employee´s PPIP Premiums",
      box: "Box55",
      validation: "",
      value: "0.00",
    },
  ];

  let restData = [
    {
      id: 30,
      name: "Housing, Board, and Lodging",
      box: "Box30",
      value: "0.00",
    },
    { id: 31, name: "Special work site", box: "Box31", value: "0.00" },
    // { id: 37, name: 'HOME RELOCATION LOAN DEDUCTION', box: 'Box37' },
    { id: 38, name: "Security options benefits", box: "Box38", value: "0.00" },
    { id: 39, name: "Stock opt/shares 110.1.D", box: "Box39", value: "0.00" },
    { id: 41, name: "Stock opt/shares 110.1.D.1", box: "Box41", value: "0.00" },
    { id: 42, name: "Employment commissions", box: "Box42", value: "0.00" },
    { id: 43, name: "Canadian forces personnel", box: "Box43", value: "0.00" },
    {
      id: 57,
      name: "Employment income – March 15 to May 9",
      box: "Box57",
      value: "0.00",
    },
    {
      id: 58,
      name: "Employment income – May 10 to July 4",
      box: "Box58",
      value: "0.00",
    },
    {
      id: 59,
      name: "Employment income – July 5 to August 29",
      box: "Box59",
      value: "0.00",
    },
    {
      id: 60,
      name: "Employment income – August 30 to September 26",
      box: "Box60",
      value: "0.00",
    },
    {
      id: 66,
      name: "Eligible retiring allowances",
      box: "Box66",
      value: "0.00",
    },
    {
      id: 67,
      name: "Non-eligible retiring allowances",
      box: "Box67",
      value: "0.00",
    },
    {
      id: 68,
      name: "Indian - eligible retiring allowances",
      box: "Box68",
      value: "0.00",
    },
    {
      id: 69,
      name: "Indian - IDN-eligible retiring allowances",
      box: "Box69",
      value: "0.00",
    },
    {
      id: 71,
      name: "Indian (exempt income) - employment",
      box: "Box71",
      value: "0.00",
    },
    { id: 72, name: "BOX 72", box: "Box72", value: "0.00" },
    { id: 73, name: "BOX 73", box: "Box73", value: "0.00" },
    {
      id: 74,
      name: "Pre-1990 while a contributor",
      box: "Box74",
      value: "0.00",
    },
    {
      id: 75,
      name: "Pre-1990 while IDT a contributor",
      box: "Box75",
      value: "0.00",
    },
    {
      id: 77,
      name: "Workers comp. benefits repaid",
      box: "Box77",
      value: "0.00",
    },
    { id: 78, name: "Fishers - gross earnings", box: "Box78", value: "0.00" },
    {
      id: 79,
      name: "Fishers - net partnership amount",
      box: "Box79",
      value: "0.00",
    },
    {
      id: 80,
      name: "Fishers - shareperson amount",
      box: "Box80",
      value: "0.00",
    },
    { id: 81, name: "Agency workers", box: "Box81", value: "0.00" },
    {
      id: 82,
      name: "Passenger-carrying vehicles",
      box: "Box82",
      value: "0.00",
    },
    { id: 83, name: "Barbers or hairdressers", box: "Box83", value: "0.00" },
    { id: 84, name: "Public transit pass", box: "Box84", value: "0.00" },
    {
      id: 85,
      name: "Private health services plans",
      box: "Box85",
      value: "0.00",
    },
    {
      id: 87,
      name: "Emergency serv. volunteers exemption",
      box: "Box87",
      value: "0.00",
    },
    { id: 88, name: "Indian (exempt income)", box: "Box88", value: "0.00" },
  ];

  const dataset_1 = [
    "AB",
    "BC",
    "MB",
    "NB",
    "NL",
    "NS",
    "NT",
    "NU",
    "ON",
    "PE",
    "QC",
    "SK",
    "YT",
  ];

  const Empset_1 = ["", "11", "12", "13", "14", "15", "16", "17"];
  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { data, ScanID, getSelectedFormsData, listedT4Items } =
          route.params;
        setInitialDataToRender(data, ScanID);
        setFormData(getSelectedFormsData);
        setlistedT4Data(listedT4Items);
        console.log("T4OcrScreen listedT4Items", listedT4Items);
      }
    } catch (error) {}
  }, []);


  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: 't4_ocrscreen',
    });
  }, []);
  const setInitialDataToRender = (data: any, scanID: string) => {
    console.log("TsetInitialDataToRender", data);
    setScanNewLoading(false);
    setInitialDataFromOCR(data);
    setScanID(scanID);
    setValueOfProvince(data["Box10"]);
    let clonedSlipData = _.cloneDeep(Slipdata);
    let FilteredObjectsofRestData = restData.filter(obj => (obj.box in data && data[obj.box] !== "0.00"));
    console.log("FilteredObjectsofRestData", FilteredObjectsofRestData);
    clonedSlipData = clonedSlipData.concat(FilteredObjectsofRestData);
    selectFirstBox(data["Box28CPPQPP"] == "Y" ? true : false);
    selectSecondBox(data["Box28EI"] == "Y" ? true : false);
    selectThirdBox(data["Box28PPIP"] == "Y" ? true : false);

    for (let i = 0; i < clonedSlipData.length; i++) {
      clonedSlipData[i].value = data[clonedSlipData[i].box]
        ? formattedNumString(data[clonedSlipData[i].box])
        : "0.00";
    }
    console.log("getSlipData", clonedSlipData);
    setinitialFlatListArray(clonedSlipData);
    let FilteredRestData = restData.filter(obj => !(obj.box in data && data[obj.box] !== "0.00"));
    setSearchedArraySlips(FilteredRestData);
    console.log("getSlipData restData", FilteredRestData);
    setFilteredArray(FilteredRestData);
    setDropdownShow(false);
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
    if(setProvinceValue == ""){
      Alert.alert("Please select a province");
      return;
    }
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
          IncomeSlipForms: "1",
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
    finalArray["Box28CPPQPP"] = isSelectFirstBox ? "Y" : "N";
    finalArray["Box28EI"] = isSelectSecondBox ? "Y" : "N";
    finalArray["Box28PPIP"] = isSelectThirdBox ? "Y" : "N";
    finalArray["Box10"] = setProvinceValue;
    finalArray["Box12"] = getInitialDataFromOCR["Box12"];
    finalArray["EmployersName"] = getInitialDataFromOCR["EmployersName"];
    finalArray["ScanID"] = scanID;
    finalArray["Type"] = getInitialDataFromOCR["Type"];
    finalArray["Year"] = getInitialDataFromOCR["Year"];
    finalArray["proc_time"] = getInitialDataFromOCR["proc_time"];
    finalArray["EI_voting_shares_status"] = isSelectSecondBox
      ? selectedIndex == 0
        ? "Y"
        : "N"
      : "null";
    finalArray["Box29"] = setEmpValue == "" ? "null" : setEmpValue;

    (finalArray["AcctID"] = savedUserData?.AcctID),
      (finalArray["TaxID"] = getSavedLoggedInData?.TaxID);
    finalArray["selectNo"] = "-1";
    finalArray["Year"] = "2022";

    console.log("finalArray finalArray EI_voting_shares_status", finalArray);
    console.log("finalArray finalArray listedT4Data", listedT4Data);
    let finalArrayForLastUpdate = [];
    if (listedT4Data != undefined) {
      const indexToUpdate = listedT4Data.findIndex(
        (obj) => obj["T4_no"] === getInitialDataFromOCR["T4_no"]
      );

      if (indexToUpdate !== -1) {
        listedT4Data[indexToUpdate] = finalArray;
        const newData = listedT4Data.map((obj, index) => {
          return {
            ...obj,
            ActionType: index === listedT4Data.length - 1 ? 2 : 1,
            SlipNo: index + 1,
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
            TaxPayerID: savedUserData?.TaxPayerID,
          };
        });
        console.log("finalArray newData", newData);
        finalArrayForLastUpdate = newData;
      }
    } else {
      (finalArray["ActionType"] = "2"),
        (finalArray["SlipNo"] = "1"),
        (finalArray["TaxPayerID"] = savedUserData?.TaxPayerID);
      finalArrayForLastUpdate = [finalArray];
    }

    console.log("finalArray finalArrayForLastUpdate", finalArrayForLastUpdate);
    const PostT4SlipInfoList = await SaveT4SlipInfoList(
      finalArrayForLastUpdate,
      savedUserData?.token
    );
    if (PostT4SlipInfoList) {
      await firebase.analytics().logEvent("save_t4slipsuccess", {
        TaxPayerID: savedUserData?.TaxPayerID,
      });
      let setIncomeSlipForms = "";

      if (getFormsData !== undefined) {
        let splitttedArray = getFormsData.IncomeSlipForms !== null ? getFormsData.IncomeSlipForms.split(","): [];
        if (!splitttedArray.includes("1")) {
          splitttedArray.unshift("1");
        }

        setIncomeSlipForms = splitttedArray.join(",");
      } else {
        setIncomeSlipForms = "1";
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
                {Object.keys(getInitialDataFromOCR).length === 0
                  ? ""
                  : 'T4' +
                    " - " +
                    (getInitialDataFromOCR.EmployersName
                      ? getInitialDataFromOCR.EmployersName
                      : "")}
              </CtText>
            </View>
            <CtView style={{ marginTop: 20, width: "100%" }}>
              <OCRDropdown
                title={"Province of Employment"}
                boxNumber={"10"}
                value={setProvinceValue}
                onPressDropDown={() => pickerRef.current?.show()}
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
            <CtView style={{ marginTop: -10, width: "100%" }}>
              <OCRDropdown
                title={"Employment code"}
                boxNumber={"29"}
                value={setEmpValue}
                onPressDropDown={() => pickerEmploymentRef.current?.show()}
              />
            </CtView>
            <CtView style={{ marginTop: 14, width: "100%" }}>
              <OCRSelectableComponent
                boxNumber={"28"}
                isSelectFirstBox={isSelectFirstBox}
                isSelectSecondBox={isSelectSecondBox}
                isSelectThirdBox={isSelectThirdBox}
                OnPressCheckBox0={() => selectFirstBox(!isSelectFirstBox)}
                OnPressCheckBox1={() => selectSecondBox(!isSelectSecondBox)}
                OnPressCheckBox2={() => selectThirdBox(!isSelectThirdBox)}
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

            {isSelectSecondBox ? (
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
                  Do you control more than 40% of the voting shares of this
                  company?
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
            ) : (
              <View />
            )}
          </CtView>
        </KeyboardAvoidingView>
      </ScrollView>

      <ReactNativePickerModule
        ref={pickerRef}
        value={setProvinceValue}
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
          setValueOfProvince(value);
          pickerRef.current?.hide();
        }}
      />

      <ReactNativePickerModule
        ref={pickerEmploymentRef}
        value={setEmpValue}
        title={""}
        items={Empset_1}
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
          setEmploymentValue(value);
          pickerEmploymentRef.current?.hide();
        }}
      />
      {/* <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <BottomButton
            onPress={() => onPressScanNewButton()}
            buttonText={"Scan new slip"}
            showLoading={ScanNewloadingAvailable}
            style={[styles().button]}
          />
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <BottomButton
            onPress={() => onPressLetsStartButton()}
            // style={[styles().button]}
            buttonText={"Confirm"}
            showLoading={loadingAvailable}
          />
        </View>
      </View> */}
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

export default T4OcrScreen;
