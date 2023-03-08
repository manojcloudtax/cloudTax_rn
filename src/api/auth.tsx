import axios from "axios";
import { getSlipsDeleteUrls, getSlipsUrls } from "../utils/OcrUtils/OcrUtils";
import shoebox from "./shoebox";

const auth = axios.create({
  baseURL: "https://app.cloudtax.ca/qa/api/2022",
});

export const registerUser = (postData: {
  AcctEmail: string;
  firstname: string;
  lastname: string;
  password: string;
  plain: true;
  Year: 2022;
}) =>
  auth.post("/UserRegistration", postData).then((res) => {
    console.log("UserRegistration", res);
    return res.data;
  });

export const loginUser = (postData: {
  AcctEmail: string;
  password: string;
  plain: true;
}) =>
  auth
    .post("/UserLogin", postData)
    .then((res) => {
      console.log("loginUser", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const SaveTaxpayerProfileInfo = (postData: {
  AcctEmail: string;
  AcctID: string;
  FirstName: string;
  PartnerID: string;
  TaxPayerID: string;
  TaxPayerName: string;
  Year: 2022;
  token: String;
}) =>
  shoebox
    .post("/SaveTaxpayerProfileInfo", postData, {
      headers: { Authorization: `Bearer ${postData.token}` },
    })
    .then((res) => {
      console.log("SaveTaxpayerProfileInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const GetTPAccountInfo = (postData: {
  //   AcctEmail: string;
  AcctID: string;
  TaxPayerID: string;
  Year: 2022;
  userToken: string;
}) =>
  shoebox
    .post("/GetTPAccountInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("GetTPAccountInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const GetTaxPayerMyProfileInfo = (postData: {
  AcctID: string;
  TaxPayerID: string;
  Year: 2022;
  userToken: string;
}) =>
  shoebox
    .post("/GetTaxPayerMyProfileInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("GetTaxPayerMyProfileInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const getAllProvince = () =>
  auth
    .get("/GetAllProvince")
    .then((res) => {
      console.log("getAllProvince", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const SaveT1GeneralInfo = (postData: {
  AcctID: string;
  TaxPayerID: string;
  Year: 2022;
  userToken: string;
  Province: string;
  TaxPayerMaritalStatusCode: string;
}) =>
  shoebox
    .post("/SaveT1GeneralInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("SaveT1GeneralInfo", res, postData);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const SaveTaxPayerMyProfileInfo = (postData: {
  AcctID: string;
  ClaimCreditsFromSpouse: string;
  DependentStatus: string;
  MaritalStatusChanged: string;
  MaritalStatusChangedDate: string;
  PartnerID: string;
  PartnerName: string;
  Province: string;
  TaxID: number;
  TaxPayerID: string;
  TaxPayerMaritalStatus: string;
  TaxPayerPreviousMaritalStatus: string;
  Year: 2022;
  _PartnerStatus: string;
  userToken: string;
}) =>
  shoebox
    .post("/SaveTaxPayerMyProfileInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("SaveTaxPayerMyProfileInfo", res);
      return res.data;
    });

export const AddNewPartnerInfo = (postData: {
  AcctID: string;
  TaxPayerID: string;
  Year: 2022;
  PartnerID: string;
  userToken: string;
}) =>
  shoebox
    .post("/AddNewPartnerInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("AddNewPartnerInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const GetTaxPayerPersonalInfo = (postData: {
  AcctID: string;
  TaxPayerID: string;
  Year: 2022;
  userToken: string;
}) =>
  shoebox
    .post("/GetTaxPayerPersonalInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("GetTaxPayerPersonalInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const SaveTaxPayerPersonalInfo = (postData: {
  TaxPayerID: number;
  Year: 2022;
  TaxID: number;
  TaxPayerName: string;
  TaxPayerMiddleName: string;
  TaxPayerLastName: string;
  TaxPayerSIN: string;
  TaxPayerBirthDate: string;
  DefaultBirthDate: string;
  NameChangedStatus: string;
  DisabledStatus: string;
  FirstYearClaimingStatus: string;
  Province: string;
  T2201ApprovedStatus: string;
  ConfinedToPrisonStatus: string;
  PeriodOfTime: string;
  TaxPayerMaritalStatus: string;
  TaxPayerDeathDate: string;
  ClaimCAICreditForSelf: string;
  NetfileAccessCode: string;
  userToken: string;
}) =>
  shoebox
    .post("/SaveTaxPayerPersonalInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("SaveTaxPayerPersonalInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const GetAfrUrl = (postData: {
  Sin: string;
  appType: "FREE";
  Year: 2022;
  userToken: string;
}) =>
  shoebox
    .post("/afr/get-url", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("GetAfrUrl", res);
      return res.data;
    })
    .catch((err) => {
      console.log("GetAfrUrl err", err.response);
      return err?.response;
    });

export const profile_img_upload = (userToken: string, payload: any) => {
  auth
    .post("/user/profile-img", payload, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("ERROR UPLOAD:", err);
      return err;
    });
};

export const SaveMultiTaxYearIndicatorInfo = (postData: {
  AcctID: string;
  MultipleTaxYearReturnIndicator: "Y";
  TaxPayerID: string;
  Year: 2022;
  userToken: string;
}) =>
  shoebox
    .post("/SaveMultiTaxYearIndicatorInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("SaveMultiTaxYearIndicatorInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const ForgotPassword = (postData: { AcctEmail: string; Year: 2022 }) =>
  shoebox
    .post("/user/forgot-password", postData)
    .then((res) => {
      console.log("ForgotPassword", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const GetTDDNetfile = (
  postData: {
    TaxID: string;
    AcctID: string;
    saveData: boolean;
    TaxPayerID: string;
    Year: 2022;
    token: string;
    year: 2022;
    appType: "FREE";
  },
  userToken: string
) =>
  shoebox
    .post("/afr/getTDDNetfile", postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("GetTDDNetfile", res);
      console.log("GetTDDNetfile postData", postData);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const GetSlips = (
  postData: {
    TaxPayerID: string;
    AcctID: string;
    Year: 2022;
    year: 2022;
    TaxID: string;
  },
  userToken: string
) =>
  shoebox
    .post("/afr/get-slips", postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("GetSlips", res);

      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const SaveTPAccountInfo = (postData: {
  TaxPayerID: string;
  AcctID: string;
  Year: 2022;
  FirstName: string;
  userToken: string;
}) =>
  shoebox
    .post("/SaveTPAccountInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("SaveTPAccountInfo", res);
      console.log("SaveTPAccountInfo postData", postData);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return null;
    });

export const SaveSlips = (postData: {
  TaxPayerID: string;
  AcctID: string;
  Year: 2022;
  TaxID: string;
  data: any;
  userToken: string;
}) =>
  shoebox
    .post("/afr/save-slips", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("SaveSlips", res);
      return res.data;
    })
    .catch((res) => {
      // console.log("SaveSlips", res);
      return "";
    });

export const GetT1TaxReturnInfo = (postData: {
  TaxPayerID: string;
  AcctID: string;
  Year: 2022;
  TaxID: string;
  userToken: string;
  RuleSP: "Y";
}) =>
  shoebox
    .post("/GetT1TaxReturnInfo", postData, {
      headers: { Authorization: `Bearer ${postData.userToken}` },
    })
    .then((res) => {
      console.log("GetT1TaxReturnInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return "";
    });

// /GetT1TaxReturnInfo
export const requestRefreshToken = (refresh: string) =>
  auth.post("/refresh-token", { refresh });

export const SaveT4SlipInfoList = (postData: any, userToken: string) =>
  shoebox
    .post("/SaveT4SlipInfoList", postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("SaveT4SlipInfoList", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return "";
    });

export const getScannedSlip = (ScanID: string, token: string) =>
  shoebox
    .get("https://www.app.cloudtax.ca/qa/ocr/api/slip/scan/" + ScanID, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("this res.data.ScanID", res);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

export const scanSlip = (formData: FormData, token: string) =>
  axios
    .post("https://www.app.cloudtax.ca/qa/ocr/api/slip/scan", formData, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

export const getSelectedSlipData = (
  postData: {
    TaxPayerID: string;
    AcctID: string;
    Year: 2022;
    TaxID: string;
  },
  userToken: string
) =>
  shoebox
    .post("/GetShoeBoxForms", postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("getSelectedSlipData", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return "";
    });

export const GetSlipsData = (
  postData: {
    TaxPayerID: string;
    AcctID: string;
    Year: 2022;
    TaxID: string;
  },
  userToken: string,
  urls: string
) =>
  shoebox
    .post(getSlipsUrls(urls), postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("GetT4SlipInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return "";
    });

export const deleteShoeBoxData = (
  postData: {
    TaxPayerID: string;
    AcctID: string;
    Year: 2022;
    TaxID: string;
    CategoryID: string;
    FormID: string;
  },
  userToken: string
) =>
  shoebox
    .post("/DeleteShoeBoxFormInfo", postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("DeleteShoeBoxFormInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("DeleteShoeBoxFormInfocatch", res);
      return null;
    });

export const deleteSlipData = (
  postData: {
    SlipNo: string;
    AcctID: string;
    Year: 2022;
    TaxID: string;
    TaxPayerID: string;
  },
  userToken: string,
  url: string
) =>
  shoebox
    .post(url, postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("DeleteT4SlipInfo", res);
      return res.data;
    })
    .catch((res) => {
      console.log("DeleteT4SlipInfo", res);
      return null;
    });
export const getData = async () => {
  try {
    const response1 = axios.get("https://api.example.com/data1");
    const response2 = axios.get("https://api.example.com/data2");
    const [res1, res2] = await Promise.all([response1, response2]);

    // Do something with the responses
    console.log(res1.data);
    console.log(res2.data);
  } catch (error) {
    console.error(error);
  }
};

export const GetAvailableSlipsData = async (
  data: {
    TaxPayerID: string;
    AcctID: string;
    Year: 2022;
    TaxID: string;
  },
  userToken: string,
  selectedData: []
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    console.log("reponseArray", selectedData);
    let GetT4SlipInfoResponse = "";
    let GetT3SlipInfoResponse = "";
    let GetT4ASlipInfoResponse = "";
    let GetT4AOASSlipInfoResponse = "";
    let GetT4APSlipInfoResponse = "";
    let GetT4ESlipInfoResponse = "";
    let GetT4RSPSlipInfoResponse = "";
    let GetT4RIFSlipInfoResponse = "";
    let GetT4ARCASlipInfoResponse = "";
    let GetT5SlipInfoResponse = "";
    let GetT5007SlipInfoResponse = "";
    let GetT5008SlipInfoResponse = "";
    let GetT4PSSlipInfoResponse = "";
    if (selectedData.includes("1")) {
      GetT4SlipInfoResponse = await shoebox.post(
        "/GetT4SlipInfo",
        data,
        config
      );
    }

    if (selectedData.includes("2")) {
      GetT3SlipInfoResponse = await shoebox.post(
        "/GetT3SlipInfo",
        data,
        config
      );
    }

    if (selectedData.includes("3")) {
      GetT4ASlipInfoResponse = await shoebox.post(
        "/GetT4ASlipInfo",
        data,
        config
      );
    }

    if (selectedData.includes("4")) {
      GetT4AOASSlipInfoResponse = await shoebox.post(
        "/GetT4AOASSlipInfo",
        data,
        config
      );
    }

    if (selectedData.includes("5")) {
      GetT4APSlipInfoResponse = await shoebox.post(
        "/GetT4APSlipInfo",
        data,
        config
      );
    }
    if (selectedData.includes("6")) {
      GetT4ESlipInfoResponse = await shoebox.post(
        "/GetT4ESlipInfo",
        data,
        config
      );
    }
    if (selectedData.includes("7")) {
      GetT4RSPSlipInfoResponse = await shoebox.post(
        "/GetT4RSPSlipInfo",
        data,
        config
      );
    }
    if (selectedData.includes("8")) {
      GetT4RIFSlipInfoResponse = await shoebox.post(
        "/GetT4RIFSlipInfo",
        data,
        config
      );
    }
    if (selectedData.includes("9")) {
      GetT4ARCASlipInfoResponse = await shoebox.post(
        "/GetT4ARCASlipInfo",
        data,
        config
      );
    }
    if (selectedData.includes("10")) {
      GetT5SlipInfoResponse = await shoebox.post(
        "/GetT5SlipInfo",
        data,
        config
      );
    }
    if (selectedData.includes("11")) {
      GetT5007SlipInfoResponse = await shoebox.post(
        "/GetT5007SlipInfo",
        data,
        config
      );
    }
    if (selectedData.includes("12")) {
      GetT5008SlipInfoResponse = await shoebox.post(
        "/GetT5008SlipInfo",
        data,
        config
      );
    }
    if (selectedData.includes("13")) {
      GetT4PSSlipInfoResponse = await shoebox.post(
        "/GetT4PSSlipInfo",
        data,
        config
      );
    }

    let [
      res1,
      res2,
      res3,
      res4,
      res5,
      res6,
      res7,
      res8,
      res9,
      res10,
      res11,
      res12,
      res13,
    ] = await Promise.all([
      GetT4SlipInfoResponse,
      GetT3SlipInfoResponse,
      GetT4ASlipInfoResponse,
      GetT4AOASSlipInfoResponse,
      GetT4APSlipInfoResponse,
      GetT4ESlipInfoResponse,
      GetT4RSPSlipInfoResponse,
      GetT4RIFSlipInfoResponse,
      GetT4ARCASlipInfoResponse,
      GetT5SlipInfoResponse,
      GetT5007SlipInfoResponse,
      GetT5008SlipInfoResponse,
      GetT4PSSlipInfoResponse,
    ]);

    let reponseArray = [];
    res1 !== ""
      ? res1.data.ErrCode !== -1
        ? reponseArray.push(
            res1.data.map((obj: any) => {
              return { ...obj, Type: "1" };
            })
          )
        : null
      : null;
    res2 !== ""
      ? res2.data.ErrCode !== -1
        ? reponseArray.push(
            res2.data.map((obj: any) => {
              return { ...obj, Type: "2" };
            })
          )
        : null
      : null;
    res3 !== ""
      ? res3.data.ErrCode !== -1
        ? reponseArray.push(
            res3.data.map((obj: any) => {
              return { ...obj, Type: "3" };
            })
          )
        : null
      : null;
    res4 !== ""
      ? res4.data.ErrCode !== -1
        ? reponseArray.push(
          res4.data.map((obj: any) => {
            return { ...obj, Type: "4" };
          })
        )
        : null
      : null;
    res5 !== ""
      ? res5.data.ErrCode !== -1
        ? reponseArray.push(
          res5.data.map((obj: any) => {
            return { ...obj, Type: "5" };
          })
        )
        : null
      : null;
    res6 !== ""
      ? res6.data.ErrCode !== -1
        ? reponseArray.push(res6.data)
        : null
      : null;
    res7 !== ""
      ? res7.data.ErrCode !== -1
        ? reponseArray.push(res7.data)
        : null
      : null;
    res8 !== ""
      ? res8.data.ErrCode !== -1
        ? reponseArray.push(res8.data)
        : null
      : null;
    res9 !== ""
      ? res9.data.ErrCode !== -1
        ? reponseArray.push(res9.data)
        : null
      : null;
    res10 !== ""
      ? res10.data.ErrCode !== -1
        ? reponseArray.push(
          res10.data.map((obj: any) => {
            return { ...obj, Type: "10" };
          })
        )
        : null
      : null;
    res11 !== ""
      ? res11.data.ErrCode !== -1
        ? reponseArray.push(
          res11.data.map((obj: any) => {
            return { ...obj, Type: "11" };
          })
        )
        : null
      : null;
    res12 !== ""
      ? res12.data.ErrCode !== -1
        ? reponseArray.push(res12.data)
        : null
      : null;
    res13 !== ""
      ? res13.data.ErrCode !== -1
        ? reponseArray.push(res13.data)
        : null
      : null;

    console.log(reponseArray);
    let mergedArray = [].concat(...reponseArray);
    return mergedArray;
  } catch (error) {
    console.error(error);
  }
};

export const SaveShoeBoxForms = (
  postData: {
    TaxPayerID: string;
    AcctID: string;
    Year: 2022;
    TaxID: string;
    CreditsForms: string;
    DeductionsForms: string;
    ExpensesForms: string;
    IncomeSlipForms: string;
    ProvincialSlipForms: string;
  },
  userToken: string
) =>
  shoebox
    .post("/SaveShoeBoxForms", postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("SaveShoeBoxForms", res);
      return res.data;
    })
    .catch((res) => {
      console.log("SaveShoeBoxForms catch", res);
      return null;
    });

export const SaveSlipData = (postData: any, userToken: string, url: string) =>
  shoebox
    .post(getSlipsUrls(url), postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("SaveT4SlipInfoList", res);
      return res.data;
    })
    .catch((res) => {
      console.log("catch", res);
      return "";
    });


  export const GetUrlData = (postData: any, userToken: string) =>
  shoebox
    .post('https://app.cloudtax.ca/qa/api/2022/login-url', postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("GetUrlData", res);
      return res.data;
    })
    .catch((res) => {
      console.log("GetUrlData", res);
      return null;
    });
export default auth;
