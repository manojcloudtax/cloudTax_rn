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
import {
  GetAvailableSlipsData,
  getSelectedSlipData,
  SaveMultipleSlipData,
  SaveShoeBoxForms,
} from "../../api/auth";
import { firebase } from "@react-native-firebase/analytics";

interface SlipData {
  id: Number;
  name: any;
  box: String;
  value: String;
  boxNo: Number;
}

type StringMap = {
  [key: string]: string;
};
const T4AOcrScreen = ({ navigation, route }: any) => {
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
    {
      id: 16,
      name: "Pension or superannuation",
      box: "Box16",
      value: "0.00",
      boxNo: 16,
    },
    {
      id: 22,
      name: "Income tax deducted",
      box: "Box22",
      value: "0.00",
      boxNo: 22,
    },
    {
      id: 18,
      name: "Lump-Sum payments",
      box: "Box18",
      value: "0.00",
      boxNo: 18,
    },
    {
      id: 20,
      name: "Self-employed commissions",
      box: "Box20",
      value: "0.00",
      boxNo: 20,
    },
    { id: 24, name: "Annuities", box: "Box24", value: "0.00", boxNo: 24 },
    {
      id: 48,
      name: "Fees for services",
      box: "Box48",
      value: "0.00",
      boxNo: 48,
    },
    { id: 27, name: "Non-eligible retiring allowances", box: "Box27", value: "0.00", boxNo: 27 },
    { id: 28, name: "Other income", box: "Box28", value: "0.00", boxNo: 28 },
    { id: 105, name: "Scholarships, Bursaries, Fellowships", box: "Box105", value: "0.00", boxNo: 105 },
    {
      id: 197,
      name: "Canada Emergency Response Benefit (CERB)",
      box: "Box197",
      value: "0.00",
      boxNo: 197,
    },
    { id: 198, name: "Canada Emergency Student Benefit (CESB)", box: "Box198",
    value: "0.00",
    boxNo: 198 },
    {
      id: 199,
      name: "Canada Emergency Student Benefit (CESB) for eligible students with disabilities or those with children or other dependents",
      box: "Box199",
      value: "0.00",
      boxNo: 199
    },
    {
      id: 200,
      name: "Provincial/Territorial COVID-19 Financial assistance payments",
      box: "Box200",
      value: "0.00",
      boxNo: 200,
    },
    {
      id: 2010,
      name: "Total Repayment of Federal COVID-19 financial assistance",
      box: "Box201",
      value: "0.00",
      boxNo: 201
    },
    {
      id: 201,
      name: "Repayment of Provincial COVID-19 financial assistance",
      box: "Box201_2",
      value: "0.00",
      boxNo: 201
    },
    { id: 202, name: "Canada Recovery Benefit (CRB)", box: "Box202",
    value: "0.00",
    boxNo: 202 },
    {
      id: 202,
      name: "Amount you were not entitled to receive",
      box: "Box202_2",
      value: "0.00",
      boxNo: 202
    },
    { id: 203, name: "Canada Recovery Sickness Benefit (CRSB)", box: "Box203",
    value: "0.00",
    boxNo: 203 },
    {
      id: 204,
      name: "Canada Recovery Caregiving Benefit (CRCB)",
      box: "Box204",
      value: "0.00",
      boxNo: 204
    },
    {
      id: 205,
      name: "One-time payment for older seniors",
      box: "Box205",
      value: "0.00",
      boxNo: 205
    },
    {
      id: 211,
      name: "Canada Worker Lockdown Benefit",
      box: "Box211",
      value: "0.00",
      boxNo: 211
    },
  ];

  let restData = [
    { id: 26, name: "Eligible Retiring Allowances", box: "Box26",
    value: "0.00",
    boxNo: 26 },
    { id: 30, name: "Patronage Allocations(Taxable amount)", box: "Box301",
    value: "0.00",
    boxNo: 30 },
    {
      id: 30,
      name: "Patronage Allocations(Non-Taxable amount)",
      box: "Box302",
      hidden: true,
      value: "0.00",
      boxNo: 30
    },
    { id: 31, name: "BOX 31", box: "Box31",
    value: "0.00",
    boxNo: 31 },
    { id: 32, name: "RPP Contr. - Past service", box: "Box32",
    value: "0.00",
    boxNo: 32 },
    { id: 34, name: "Pension adjustment", box: "Box34" ,
    value: "0.00",
    boxNo: 34},
    { id: 37, name: "Advanced life deferred annuity", box: "Box37",
    value: "0.00",
    boxNo: 37 },
    { id: 40, name: "RESP Accumulated income", box: "Box40",
    value: "0.00",
    boxNo: 40 },
    { id: 42, name: "RESP Educational assistance", box: "Box42",
    value: "0.00",
    boxNo: 42 },
    { id: 46, name: "Charitable donations", box: "Box46" ,
    value: "0.00",
    boxNo: 46},
    { id: 104, name: "Research grants (net amount)", box: "Box104",
    value: "0.00",
    boxNo: 104 },
    { id: 106, name: "Death benefits", box: "Box106",
    value: "0.00",
    boxNo: 106 },
    // { id: 107, name: 'PAYMENTS FROM A WAGE-LOSS REPLACEMENT PLAN', box: 'Box107' },
    {
      id: 107,
      name: "Payments from a wage-loss replacement plan",
      box: "Box107",
      value: "0.00",
      boxNo: 1074
    },
    {
      id: 107,
      name: "Premiums paid to a wage-loss replacement plan",
      box: "Box107_premiumspaid",
      hidden: true,
      value: "0.00",
      boxNo: 107
    },
    {
      id: 109,
      name: "Periodic payments from an unregistered plan",
      box: "Box109",
      value: "0.00",
      boxNo: 109
    },
    { id: 116, name: "Medical travel assistance", box: "Box116",
    value: "0.00",
    boxNo: 116 },
    { id: 117, name: "Loan benefits", box: "Box117",
    value: "0.00",
    boxNo: 117 },
    { id: 118, name: "Medical premium benefits", box: "Box118",
    value: "0.00",
    boxNo: 118 },
    { id: 119, name: "Employment income", box: "Box119_1",
    value: "0.00",
    boxNo: 119 },
    { id: 119, name: "Other income", box: "Box119_2", hidden: true,
    value: "0.00",
    boxNo: 1192 },
    { id: 122, name: "RESP Acc. Inc. payments paid to other", box: "Box122",
    value: "0.00",
    boxNo: 122 },
    { id: 123, name: "Payments from a revoked dpsp", box: "Box123",
    value: "0.00",
    boxNo: 123 },
    {
      id: 124,
      name: "Board and lodging at special work sites",
      box: "Box124",
      value: "0.00",
      boxNo: 124
    },
    {
      id: 125,
      name: "Disability benefits paid out of a superannuation or pension plan",
      box: "Box125",
      value: "0.00",
      boxNo: 125
    },
    { id: 126, name: "Pre-1990 contr. while a contributor", box: "Box126",
    value: "0.00",
    boxNo: 126 },
    { id: 127, name: "Veterans benefits", box: "Box127",
    value: "0.00",
    boxNo: 127 },
    {
      id: 128,
      name: "Payments made to veterans aged 65 or older",
      box: "Box128",
      value: "0.00",
      boxNo: 128
    },
    { id: 129, name: "Tax deferred cooperative share", box: "Box129",
    value: "0.00",
    boxNo: 129 },
    { id: 130, name: "Apprenticeship incentive grant", box: "Box130_1",
    value: "0.00",
    boxNo: 1304 },
    {
      id: 130,
      name: "Apprenticeship completion grant",
      box: "Box130_2",
      hidden: true,
      value: "0.00",
      boxNo: 1305
    },
    { id: 131, name: "Registered disability savings plan", box: "Box131",
    value: "0.00",
    boxNo: 131 },
    { id: 132, name: "Wage earner protection program", box: "Box132",
    value: "0.00",
    boxNo: 132 },
    { id: 133, name: "Variable Pension Benefits", box: "Box133",
    value: "0.00",
    boxNo: 133 },
    { id: 134, name: "TFSA Taxable amount", box: "Box134",
    value: "0.00",
    boxNo: 134 },
    {
      id: 135,
      name: "Recipient-paid premiums for private health services plans",
      box: "Box135",
      value: "0.00",
      boxNo: 135
    },
    {
      id: 136,
      name: "Federal income support for parents of murdered or missing children grant (PMMC)",
      box: "Box136",
      value: "0.00",
      boxNo: 136
    },
    { id: 142, name: "Eligible retiring allowances", box: "Box142",
    value: "0.00",
    boxNo: 142 },
    { id: 143, name: "Non-eligible retiring allowances", box: "Box143",
    value: "0.00",
    boxNo: 143 },
    { id: 144, name: "Other income", box: "Box144",
    value: "0.00",
    boxNo: 144 },
    { id: 146, name: "Pension or superannuation", box: "Box146",
    value: "0.00",
    boxNo: 146 },
    { id: 148, name: "Lump-sum payments", box: "Box148",
    value: "0.00",
    boxNo: 148 },
    {
      id: 150,
      name: "Labour adjustment benefits act and appropriation acts",
      box: "Box150",
      value: "0.00",
      boxNo: 150
    },
    {
      id: 152,
      name: "SUBP Qualified under the income tax act",
      box: "Box152",
      value: "0.00",
      boxNo: 152
    },
    { id: 154, name: "Cash award or prize from payer", box: "Box154",
    value: "0.00",
    boxNo: 154 },
    { id: 156, name: "Bankruptcy settlement", box: "Box156",
    value: "0.00",
    boxNo: 156 },
    {
      id: 162,
      name: "Pre-1990 contr. while not a contributor",
      box: "Box162",
      value: "0.00",
      boxNo: 162
    },
    { id: 194, name: "PRPP Payments", box: "Box194",
    value: "0.00",
    boxNo: 194 },
    { id: 195, name: "PRPP Payments", box: "Box195",
    value: "0.00",
    boxNo: 195 },
    {
      id: 196,
      name: "Tuition assistance for adult basic education",
      box: "Box196",
      value: "0.00",
      boxNo: 196
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
        console.log("T4AOcrScreen listedT4Items", listedT4Items);
      }
    } catch (error) {}
  }, []);


  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: 't4a_ocr_screen',
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
          data.boxNo.toString().toLowerCase().includes(text.toLowerCase())
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
    let selectedItem =  { 
        id: item.boxNo, 
        name: item.name, 
        box: item.box,
        value: item.value,
        boxNo: item.id }

    updatedSlip.push(selectedItem);
    console.log("onSelectListItem selectedItem", item);
    console.log("onSelectListItem updatedSlip", updatedSlip);
    setinitialFlatListArray(updatedSlip);
    const newArray = getFilteredArray.filter((obj) => obj.boxNo !== item.boxNo);

    console.log("onSelectListItem newArray", newArray);
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
          IncomeSlipForms: "3",
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
    // console.log("finalArray finalArray EI_voting_shares_status", finalArray);
    // console.log("finalArray finalArray getInitialDataFromOCR", getInitialDataFromOCR);
    // console.log("finalArray finalArray getInitialDataFromOCR getInitialDataFromOCR", getInitialDataFromOCR["TaxPayersName"]);
    finalArray["TaxPayersName"] = getInitialDataFromOCR["TaxPayersName"];
    finalArray["ScanID"] = scanID;
    // finalArray["Type"] = getInitialDataFromOCR["Type"];

    (finalArray["AcctID"] = savedUserData?.AcctID),
      (finalArray["TaxID"] = getSavedLoggedInData?.TaxID);
    finalArray["selectNo"] = "-1";
    finalArray["Year"] = "2022";

    // console.log("finalArray finalArray EI_voting_shares_status", finalArray);
    // console.log("finalArray finalArray listedT4DataT4A_no", listedT4Data);
    let finalArrayForLastUpdate = [];
    if (listedT4Data != undefined) {
      const indexToUpdate = listedT4Data.findIndex(
        (obj) => obj["T4A_no"] === getInitialDataFromOCR["T4A_no"]
      );

      if (indexToUpdate !== -1) {
        listedT4Data[indexToUpdate] = finalArray;
        const newData = listedT4Data.map((obj, index) => {
          return {
            ...obj,
            ActionType: index === listedT4Data.length - 1 ? 2 : 1,
            SlipNo: index + 1,
            TaxPayerID: savedUserData?.TaxPayerID,
            AcctID: savedUserData?.AcctID,
            T4A_no: index + 1,
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
            AcctID: savedUserData?.AcctID,
            T4A_no: index + 1,
          };
        });
        console.log("finalArray newData", newData);
        finalArrayForLastUpdate = newData;
      }
    } else {
      (finalArray["ActionType"] = "2"),
        (finalArray["SlipNo"] = "1"),
        (finalArray["T4A_no"] = "1"),
        (finalArray["TaxPayerID"] = savedUserData?.TaxPayerID);
      finalArrayForLastUpdate = [finalArray];
    }

    console.log("finalArray finalArrayForLastUpdate", finalArrayForLastUpdate);
    const PostT4SlipInfoList = await SaveMultipleSlipData(
      finalArrayForLastUpdate,
      savedUserData?.token
    );

    console.log("PostT4SlipInfoList PostT4SlipInfoList", PostT4SlipInfoList);
    if (PostT4SlipInfoList) {
      await firebase.analytics().logEvent("save_t4slipsuccess", {
        TaxPayerID: savedUserData?.TaxPayerID,
      });
      let setIncomeSlipForms = "";

      if (getFormsData !== undefined) {
        let splitttedArray = getFormsData.IncomeSlipForms !== null ? getFormsData.IncomeSlipForms.split(","): [];
        if (!splitttedArray.includes("3")) {
          splitttedArray.unshift("3");
        }

        setIncomeSlipForms = splitttedArray.join(",");
      } else {
        setIncomeSlipForms = "3";
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

//   console.log("getInitialDataFromOCR", getInitialDataFromOCR);
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
                  : 'T4A' +
                    " - " +
                    (getInitialDataFromOCR.TaxPayersName
                      ? getInitialDataFromOCR.TaxPayersName
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

export default T4AOcrScreen;
