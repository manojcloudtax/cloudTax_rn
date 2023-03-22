import React, { useState, useEffect } from "react";
import {  FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  BackHandler,
  Alert,
} from "react-native";
import { Button, CtText, CtView } from "../../components/UiComponents";
import { defaultColors } from "../../utils/defaultColors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getAllProvince, GetProUserFlagInfo, SaveMultiTaxYearIndicatorInfo } from "../../api/auth";
import {
    saveRegisteredSuccessUserData,
  setIsPriorYearModalSelected,
  setProvinces,
} from "../../store/authSlice";
import { useQuery } from "react-query";
import { BottomButton } from "../../components/BottomButton";

interface NameSelection {
    AcctID: Number;
    PartnerID: String;
    TaxID: String;
    TaxPayerID: String;
    TaxPayerName: String;
    Year: 2022;
  }
const ChooseAAccount = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  const { getTPConnectedAccountData, saveTPAccountData, savedUserData,getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);

  const [selectedAccount, setSelectedAccount] = useState<
  Array<NameSelection>
>([]);
  const [isFromRegistrationValue, setisFromRegistrationValue] = useState(false);

  useEffect(() => {
  }, []);

  useEffect(() => {
    console.log("RMK ChooseAAccount getTPConnectedAccountData", getTPConnectedAccountData);
    try {
      console.log("RMK ChooseAAccount OnBoardingTaxProfile", route.params);
      if (route.params !== undefined) {
        const { isFromRegistration, accountList } = route.params;
        setisFromRegistrationValue(isFromRegistration);
        console.log("RMK ChooseAAccount", accountList);
        let filteredData = getTPConnectedAccountData.filter(
          (item: { TaxPayerID: any }) => {
            return item.TaxPayerID !== savedUserData?.TaxPayerID;
          }
        );

        if(filteredData.length == 0) {
          let datas = {
            TaxPayerID: '',
            TaxPayerName: ''
          }
          setSelectedAccount(datas);
        } else {

          setSelectedAccount(filteredData[0]);
        }
      }
    } catch (error) {}
  }, []);


  const renderNameSelector = (item: any) => {
    console.log("renderNameSelector item", item);
    console.log("renderNameSelector selectedAccount", selectedAccount);
    return (
      <TouchableOpacity
        key={item}
        style={{
          borderRadius: 10,
          marginVertical: 10,
          borderWidth: item.TaxPayerID === selectedAccount.TaxPayerID ? 2 : 1.5,
          flexDirection: "row",
          padding: 2,
          height: 72,
          backgroundColor:
            item.TaxPayerID === selectedAccount.TaxPayerID
              ? darkTheme
                ? "#242424"
                : "#F0FAFF"
              : darkTheme
              ? "#242424"
              : defaultColors.transparent,
          borderColor:
            item.TaxPayerID === selectedAccount.TaxPayerID
              ? defaultColors.primaryBlue
              : darkTheme
              ? defaultColors.darkBorder
              : defaultColors.borderColor,
        }}
        onPress={() => setSelectedAccount(item)}
      >
        <View
          style={{
            flex: 0.16,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item.TaxPayerID === selectedAccount.TaxPayerID ? (
            <Ionicons
              style={{
                color: defaultColors.blue,
              }}
              underlayColor={"white"}
              name={"checkmark-circle-sharp"}
              color={defaultColors.white}
              size={28}
            />
          ) : (
            <FontAwesome
              style={{
                color: defaultColors.borderColor,
              }}
              name={"circle-thin"}
              size={28}
            />
          )}
        </View>
        <View
          style={{ flex: 0.84, borderRadius: 10, justifyContent: "center" }}
        >
          <CtText
            style={{
              fontWeight: "600",
              fontSize: 22,
              fontFamily:'Figtree-SemiBold',
              color:
                item.TaxPayerID === selectedAccount.TaxPayerID
                  ? darkTheme
                    ? defaultColors.white
                    : defaultColors.primaryText
                  : darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.secondaryTextColor,
            }}
          >
            {item.TaxPayerName}
          </CtText>
        </View>
      </TouchableOpacity>
    );
  };



  const onPressLetsStartButton = async () => {

    if(selectedAccount.TaxPayerID == "RMKcreate"){
      console.log("onPressLetsStartButton getTPConnectedAccountData", getTPConnectedAccountData);
      if(getTPConnectedAccountData.length === 3 && getSavedLoggedInData?.TaxID != null && getSavedLoggedInData?.TaxID != undefined){
        const getProUser = await GetProUserFlagInfo({
          Year: 2022,
          TaxPayerID: savedUserData?.TaxPayerID,
          AcctID:savedUserData?.AcctID,
          TaxID:getSavedLoggedInData?.TaxID,
          loader: false
        }, savedUserData?.token);
    
        if (getProUser) {
          // setisDataLoading(false);
          console.log("GetProUserFlagInfo", getProUser);
        if (getProUser.ErrCode == -1) {
          console.log("GetSlipsfileRes else");
        } else {
         if(getProUser.IsPro === 'Y'){
          navigation.navigate("UserNameScreen", { savedUser: savedUserData });
         } else {
          navigation.navigate("UpgradeToPlusScreen", { isManualUpdate: false, isfromAddNewaccount: true });
         }
        }
        }
      }else {
        navigation.navigate("UserNameScreen", { savedUser: savedUserData });
      }



    }else {
      let RegisteredData = {
        AcctID: savedUserData.AcctID,
        TaxPayerID: selectedAccount.TaxPayerID,
        token: savedUserData.token,
        TaxPayerName: selectedAccount.TaxPayerName,
    }
    await dispatch(saveRegisteredSuccessUserData(RegisteredData));
    navigation.navigate("ChooseTaxYearScreen", {
        isFromRegistration: isFromRegistrationValue,
      });
    }
  };

  return (
    <SafeAreaView style={styles(darkTheme).view}>
      <CtView
        style={{
          backgroundColor: darkTheme
            ? defaultColors.black
            : defaultColors.white,
          // flex: 1,
        }}
      >
        <CtView
          style={{
            paddingTop: 10,
            paddingBottom: 30,
            marginHorizontal: 24,
            backgroundColor: darkTheme
              ? defaultColors.black
              : defaultColors.white,
            // flex: 1,
          }}
        >
          {/* <CtView
            style={{
              alignItems: "flex-start",
              height: "auto",
              width: "90%",
            }}
          > */}
          <CtText style={{ fontWeight: "600", fontSize: 25, marginTop: 20,
      fontFamily:'Figtree-SemiBold', }}>
            {"Great to see you again!"}
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
            Please select the account you'd like to continue with..
          </CtText>

          <CtView style={{ marginTop: 30, width: "100%" }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 50 }}
              data={getTPConnectedAccountData}
              renderItem={({ item }) => renderNameSelector(item)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </CtView>
          {/* </CtView> */}
          {/* </> */}
        </CtView>
      </CtView>
      {/* <CtView
        style={{
          width: "100%",
          height: 80,
          backgroundColor:  darkTheme? defaultColors.black: defaultColors.white,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 20,
          borderTopWidth: 1.5,
          borderTopColor: defaultColors.borderColor,
        }}
      >
        <CtView
          style={{
            backgroundColor: darkTheme ? "transparent" : "white",
            justifyContent: "center",
            width: "90%",
          }}
        >
          <Button
            onPress={() => onPressLetsStartButton()}
            style={[styles().button]}
          >
            <CtText style={styles().buttonText}>Let’s Start</CtText>
          </Button>
        </CtView> */}
      <BottomButton
        onPress={() => onPressLetsStartButton()}
        // style={[styles().button]}
        buttonText={"Let’s Start"}
      />
      {/* </CtView> */}
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
    },
    buttonText: {
      fontSize: 18,
      color: isDarkTheme ? defaultColors.white : defaultColors.white,
      fontWeight: "600",
      borderRadius: 10,
      fontFamily:'Figtree-SemiBold',
    },
  });

export default ChooseAAccount;
