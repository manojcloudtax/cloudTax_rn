import axios from "axios";
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
  auth.post("/UserLogin", postData).then((res) => {
    console.log("loginUser", res);
    return res.data;
  }).catch((res) => {
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
    }).catch((res) => {
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
    }).catch((res) => {
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
    }).catch((res) => {
      console.log("catch", res);
      return null;
    });

export const getAllProvince = () =>
  auth.get("/GetAllProvince").then((res) => {
    console.log("getAllProvince", res);
    return res.data;
  }).catch((res) => {
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
    }).catch((res) => {
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
    }).catch((res) => {
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
    }).catch((res) => {
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
    }).catch((res) => {
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
    }).catch((err) => {
      console.log("GetAfrUrl err", err.response);
      return err?.response;
    });;

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
    }).catch((res) => {
      console.log("catch", res);
      return null;
    });

export const ForgotPassword = (postData: { AcctEmail: string; Year: 2022 }) =>
  shoebox.post("/user/forgot-password", postData).then((res) => {
    console.log("ForgotPassword", res);
    return res.data;
  }).catch((res) => {
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
    }).catch((res) => {
      console.log("catch", res);
      return null;
    });

export const GetSlips = (postData: {
  TaxPayerID: string;
  AcctID: string;
  Year: 2022;
  year: 2022;
  TaxID: string;
},
userToken: string) =>
  shoebox
    .post("/afr/get-slips", postData, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      console.log("GetSlips", res);

      return res.data;
    }).catch((res) => {
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
    }).catch((res) => {
      console.log("catch", res);
      return null;
    });;

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
    }).catch((res) => {
      // console.log("SaveSlips", res);
      return '';
    });

    export const GetT1TaxReturnInfo = (postData: {
      TaxPayerID: string;
      AcctID: string;
      Year: 2022;
      TaxID: string;
      userToken: string;
      RuleSP: "Y"
    }) =>
      shoebox
        .post("/GetT1TaxReturnInfo", postData, {
          headers: { Authorization: `Bearer ${postData.userToken}` },
        })
        .then((res) => {
          console.log("GetT1TaxReturnInfo", res);
          return res.data;
        }).catch((res) => {
          console.log("catch", res);
          return '';
        });

    // /GetT1TaxReturnInfo
export const requestRefreshToken = (refresh: string) =>
  auth.post("/refresh-token", { refresh });

export default auth;
