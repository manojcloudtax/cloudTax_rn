import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  BackHandler,
} from "react-native";
import { Button, CtText, CtView } from "../../components/UiComponents";
import { defaultColors } from "../../utils/defaultColors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { CommonModal } from "../../components";
import { getAllProvince, SaveMultiTaxYearIndicatorInfo } from "../../api/auth";
import {
  setIsPriorYearModalSelected,
  setProvinces,
} from "../../store/authSlice";
import { useQuery } from "react-query";
import { BottomButton } from "../../components/BottomButton";
const ChooseTaxYear = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  const { savedUserData, getPriorYearSelected } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);

  const [taxYear, setTaxYear] = useState("2022");
  const [isShowModal, setShowModal] = useState(false);
  const [isFromRegistrationValue, setisFromRegistrationValue] = useState(false);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    try {
      console.log("init OnBoardingTaxProfile", route.params);
      if (route.params !== undefined) {
        const { isFromRegistration } = route.params;
        setisFromRegistrationValue(isFromRegistration);
      }
    } catch (error) {}
  }, []);

  const { isLoading, refetch } = useQuery("login", () => getAllProvince(), {
    onSuccess: (data) => {
      dispatch(setProvinces(data));
    },
    onError: (error: any) => {
      console.log("getAllProvince", error);
    },
    retry: false,
    enabled: false,
  });

  const availableYears = ["2022", "2021", "2020", "2019", "2018"];
  const renderYearSelector = (item: any) => {
    return (
      <TouchableOpacity
        key={item}
        disabled={item !== "2022"}
        style={{
          borderRadius: 10,
          marginVertical: 10,
          borderWidth: item === taxYear ? 2 : 1.5,
          flexDirection: "row",
          padding: 2,
          height: 72,
          backgroundColor:
            item === taxYear
              ? darkTheme
                ? "#242424"
                : "#F0FAFF"
              : darkTheme
              ? "#242424"
              : defaultColors.transparent,
          borderColor:
            item === taxYear
              ? defaultColors.primaryBlue
              : darkTheme
              ? defaultColors.darkBorder
              : defaultColors.borderColor,
        }}
        onPress={() => setTaxYear(item)}
      >
        <View
          style={{
            flex: 0.16,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item === taxYear ? (
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
                item === taxYear
                  ? darkTheme
                    ? defaultColors.white
                    : defaultColors.primaryText
                  : darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.secondaryTextColor,
            }}
          >
            {item}
          </CtText>
        </View>
      </TouchableOpacity>
    );
  };

  const confirmationModal = () => {
    return (
      <View
        style={{
          height: "auto",
          width: "100%",
          backgroundColor: darkTheme ? defaultColors.matBlack : "#F8F8F8",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "auto",
            backgroundColor: darkTheme
              ? defaultColors.black
              : defaultColors.white,
            margin: 20,
            padding: 15,
            borderRadius: 10,
          }}
        >
          <CtText style={{ fontWeight: "600", fontSize: 25, marginTop: 20,
              fontFamily:'Figtree-SemiBold', }}>
            {"Do you have to file tax returns prior to 2022"}
          </CtText>
          <CtText
            style={{
              fontWeight: "400",
              fontSize: 14,
              marginTop: 20,
              color: darkTheme
                ? defaultColors.white
                : defaultColors.secondaryText,
            }}
          >
            {`NETFILE accepts the current year and up to five prior-year returns. 
If you intend to file more than one of these returns today or within the next two days indicate “YES” here. In order to accurately assess your returns, please file your returns in order, oldest return first.`}
          </CtText>
        </View>
        <View
          style={{
            backgroundColor: darkTheme ? "transparent" : "white",
            justifyContent: "center",
            width: "90%",
          }}
        >
          <Button
            onPress={() => onPressContinueButton()}
            style={[styles(darkTheme).button]}
          >
            <CtText style={styles(darkTheme).buttonText}>
              No, continue with 2022
            </CtText>
          </Button>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            justifyContent: "center",
            width: "90%",
            height: 20,
            marginBottom: 20,
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={() => onPressFilePrior()}
        >
          <CtText
            style={{
              fontSize: 18,
              color: darkTheme
                ? defaultColors.darkModeTextColor
                : defaultColors.secondaryTextColor,
              fontWeight: "400",
            }}
          >
            Yes, I need to file prior year
          </CtText>
        </TouchableOpacity>
      </View>
    );
  };

  const onPressFilePrior = async () => {
    setShowModal(false);

    const SaveMultiTaxYearIndicatorRes = await SaveMultiTaxYearIndicatorInfo({
      AcctID: savedUserData?.AcctID,
      MultipleTaxYearReturnIndicator: "Y",
      Year: 2022,
      TaxPayerID: savedUserData?.TaxPayerID,
      userToken: savedUserData?.token,
    });
    console.log(
      "SaveMultiTaxYearIndicatorRes checkSub:",
      SaveMultiTaxYearIndicatorRes
    );
    if (SaveMultiTaxYearIndicatorRes) {
      dispatch(setIsPriorYearModalSelected(true));
      console.log("OnBoardingTaxProfile");
      navigation.navigate("OnBoardingTaxProfile", {
        selectedScreen: 1,
        selectedYear: "2022",
      });
    } else {
      console.log("SaveMultiTaxYearIndicatorRes checkSub:");
      // return {}
    }
    // SaveMultiTaxYearIndicatorInfo
  };

  const onPressContinueButton = () => {
    setShowModal(false);
    dispatch(setIsPriorYearModalSelected(true));
    navigation.navigate("OnBoardingTaxProfile", {
      selectedScreen: 1,
      selectedYear: "2022",
    });
  };

  const onPressLetsStartButton = () => {
    if (isFromRegistrationValue) {
      if (!getPriorYearSelected) {
        setShowModal(true);
      } else {
        navigation.navigate("OnBoardingTaxProfile", {
          selectedScreen: 1,
          selectedYear: "2022",
        });
      }
    } else {
      navigation.navigate("OnBoardingTaxProfile", {
        selectedScreen: 1,
        selectedYear: "2022",
      });
    }
  };
  const onBackdropPress = () => {
    return;
  };

  return (
    <SafeAreaView style={styles(darkTheme).view}>
      <CommonModal
        isShowModal={isShowModal}
        ChildView={confirmationModal()}
        onBackdropPress={() => onBackdropPress()}
      />
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
            {"Choose a tax year"}
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
            Are you behind in filing? To accurately assess your returns, please
            file your oldest return first.
          </CtText>

          <CtView style={{ marginTop: 30, width: "100%" }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 50 }}
              data={availableYears}
              renderItem={({ item }) => renderYearSelector(item)}
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

export default ChooseTaxYear;
