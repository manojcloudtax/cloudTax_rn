import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: null,
  user: null,
  status: null,
  email: null,
  password: null,
  refreshToken: null,
  img_url: null,

  AcctID: 0,
  TaxPayerID: 0,
  Year: 2022,
  PartnerID: null,
  PartnerName: "",
  EmailVerificationStatus: "Y",
  CarryFwdState: "N",
  TaxPayerName: null,
  savedUserData: {},
  saveTaxpayerProfileData: {},
  AllProvinces: null,
  saveTPAccountData: [],
  saveTPMyProfileData: {},
  getPriorYearSelected: false,
  getSavedLoggedInData: {},
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,

  reducers: {
    login: (state, action) => {
      state.userToken = action.payload.token;
      state.refreshToken = action.payload.refresh;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.AcctID = action.payload.AcctID;
      state.AcctID = action.payload.AcctID;
    },
    register: (state, action) => {
      state.userToken = action.payload.token;
      state.email = action.payload.acc;
      state.password = action.payload.password;
      state.refreshToken = action.payload.refresh;
    },
    imageUpload: (state, action) => {
      state.img_url = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProvinces: (state, action) => {
      console.log("setProvinces", action.payload);
      state.AllProvinces = action.payload;
    },
    resetState: () => {},
    saveRegisteredUserData: (state, action) => {
      console.log("saveUserData", action.payload);
      state.userToken = action.payload.token;
      state.AcctID = action.payload.AcctID;
      state.TaxPayerID = action.payload.TaxPayerID;
      state.PartnerID = action.payload.PartnerID;
    },
    saveRegisteredSuccessUserData: (state, action) => {
      console.log("saveRegisteredSuccessUserData", action.payload);
      state.savedUserData = action.payload;
      // console.log("saveRegisteredSuccessUserData",action.payload);
      // state.userToken = action.payload.token;
      // state.AcctID = action.payload.AcctID;
      // state.TaxPayerID = action.payload.TaxPayerID;
      // state.PartnerID = action.payload.PartnerID;
      // state.PartnerName = action.payload.PartnerName;
      // state.TaxPayerName = action.payload.TaxPayerName;
    },
    SaveTaxpayerProfileData: (state, action) => {
      console.log("SaveTaxpayerProfileData", action.payload);
      state.saveTaxpayerProfileData = action.payload;
      // state.userToken = action.payload.token;
      // state.AcctID = action.payload.AcctID;
      // state.TaxPayerID = action.payload.TaxPayerID;
      // state.PartnerID = action.payload.PartnerID;
      // state.PartnerName = action.payload.PartnerName;
      // state.TaxPayerName = action.payload.TaxPayerName;
    },
    saveGetTPAccountData: (state, action) => {
      console.log("saveGetTPAccountData", action.payload);
      state.saveTPAccountData = action.payload;
    },
    saveTaxPayerMyProfileInfo: (state, action) => {
      console.log("saveTaxPayerMyProfileInfo", action.payload);
      state.saveTPMyProfileData = action.payload;
    },
    setIsPriorYearModalSelected: (state, action) => {
      console.log("saveIsPriorModalSelected", action.payload);
      state.getPriorYearSelected = action.payload;
    },
    saveLoggedInSuccessUserData: (state, action) => {
      console.log("saveLoggedInSuccessUserData", action.payload);
      state.getSavedLoggedInData = action.payload;
    },
    resetAllStateData: (state) => {
      (state.userToken = null),
        (state.user = null),
        (state.status = null),
        (state.email = null),
        (state.password = null),
        (state.refreshToken = null),
        (state.img_url = null),
        (state.AcctID = 0),
        (state.TaxPayerID = 0),
        (state.Year = 2022),
        (state.PartnerID = null),
        (state.PartnerName = ""),
        (state.EmailVerificationStatus = "Y"),
        (state.CarryFwdState = "N"),
        (state.TaxPayerName = null),
        (state.savedUserData = {}),
        (state.saveTaxpayerProfileData = {}),
        (state.saveTPAccountData = []),
        (state.saveTPMyProfileData = {}),
        (state.getPriorYearSelected = false),
        (state.getSavedLoggedInData = {});
    },
  },
});

export const {
  login,
  register,
  setUser,
  imageUpload,
  setProvinces,
  saveRegisteredUserData,
  saveRegisteredSuccessUserData,
  SaveTaxpayerProfileData,
  resetState,
  saveGetTPAccountData,
  saveTaxPayerMyProfileInfo,
  setIsPriorYearModalSelected,
  saveLoggedInSuccessUserData,
  resetAllStateData,
} = authSlice.actions;

export default authSlice.reducer;
