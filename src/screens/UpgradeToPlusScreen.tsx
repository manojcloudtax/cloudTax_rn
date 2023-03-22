import React, { useState, useEffect } from "react";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  BackHandler,
  Text,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { CtText, CtView } from "../components/UiComponents";
import { defaultColors } from "../utils/defaultColors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { CustomButton } from "../components/CustomButton";
import { GetUrlData, upgradePlus } from "../api/auth";
import * as IAP from "react-native-iap";

const UpgradeToPlusScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();

  const subscription_ids = ["yearlypremium"];
  const [subscriptionResluts, setSubscriptionResluts] = useState([]);
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);

  const [isAllFeature, setSeeAllFeature] = useState(false);

  const { savedUserData, getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const [didConnected, setConnected] = useState(false);
  const [isDataLoading, setisDataLoading] = useState(false);
  const [isFromManualUpdate, SetisFromManualUpdate] = useState(false);
  const [fromAddNewaccount, SetisfromAddNewaccount] = useState(false);

  const availableFeatures = [
    "Unlock 20 returns per account",
    "Unlimited Tax & technical support (live-chat & email)",
    "Audit protection included for primary account",
    "Access to CloudReceipts Personal",
  ];

  const AllFeatures = [
    "Unlock 20 returns per account",
    "Unlimited Tax & technical support (live-chat & email)",
    "Audit protection included for primary account",
    "Access to CloudReceipts Personal",
    "20 Number of Return",
    "Employment, Pension, Business and Rental Income",
    "T1135 Foreign Income",
    "Auto-Fill My Return (AFR) and ENOA",
    "Crypto taxes via Koinly",
    "CloudReceipts expense management",
    "Live tax help from tax experts",
    "Customized tax tips for your scenario",
    "Audit Protection for the primary account",
    "Video Tutorials",
    "Webinars",
    "Live chat and email support",
    "Phone support",
  ];

  useEffect(() => {
    setisDataLoading(false);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    inAppPurchaseInit();
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { isManualUpdate, isfromAddNewaccount } = route.params;
        SetisFromManualUpdate(isManualUpdate);
        SetisfromAddNewaccount(isfromAddNewaccount);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    try {
      //check if products are ready to be fetched
      if (didConnected === true) {
        const subscription = IAP.purchaseUpdatedListener(
          (purchase: IAP.Purchase) => {
            try {
              if (purchase) {
                console.log("purchase", purchase);
              }
            } catch (error) {
              console.error("ERROR", error);
            }
          }
        );
        return () => {
          subscription.remove();
        };
      }
    } catch (error) {
      console.log("ERROR IN INITIATING IAP", error);
    }
  }, [didConnected]);

  const inAppPurchaseInit = async () => {
    // await initConnection();
    // await getProducts(productIds)
    IAP.initConnection()
      .catch((error) => {
        console.log("error connecting to IAP service. :", error);
        setConnected(false);
      })
      .then(async () => {
        const x = await IAP.getSubscriptions({
          skus: subscription_ids as string[],
        }).catch((error) => {
          console.log(
            "error fetching subscription_ids for subscription :",
            error
          );
        });
        return x;
      })
      .then(async (res) => {
        // dispatch(setProducts(res))
        setConnected(true);
        console.log("SUBSCRIPTION RESULT(s):", res);
        setSubscriptionResluts(res);
      });

    IAP.getPurchaseHistory()
      .catch((error) => {
        console.log("error fetching purchase history", error);
      })
      .then(async (res: any) => {
        if (res && res.length !== 0) {
          // dispatch(setPurchaseRecords(res))
          console.log("records:", res);
        }
      });
  };

  useEffect(() => {
    try {
      console.log("init UpgradeToPlusScreen", route.params);
      if (route.params !== undefined) {
      }
    } catch (error) {}
  }, []);

  const renderItem = (item: any) => {
    return (
      <View
        key={item}
        style={{
          marginVertical: 10,
          flexDirection: "row",
          height: "auto",
        }}
      >
        <View
          style={{
            // flex: 0.14,
            justifyContent: "center",
            alignItems: "flex-start",
            width: 30,
            // backgroundColor: 'green'
          }}
        >
          <Entypo
            style={{
              color: "rgba(26, 38, 58, 0.5)",
            }}
            underlayColor={"#1A263A"}
            name={"check"}
            color={defaultColors.white}
            size={24}
          />
        </View>
        <View
          style={{
            flex: 0.86,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              fontFamily: "Figtree-SemiBold",
              color: darkTheme
                ? defaultColors.secondaryTextColor
                : defaultColors.secondaryTextColor,
            }}
          >
            {item}
          </Text>
        </View>
      </View>
    );
  };

  const onPressLetsStartButton = async () => {
    if (subscriptionResluts === undefined) {
      Alert.alert("Something went wrong, Please try again..!");
      return;
    }
    let sku: string =
      subscriptionResluts.length !== 0 ? subscriptionResluts[0].productId : "";
    let offerToken: string =
      subscriptionResluts.length !== 0
        ? subscriptionResluts[0].subscriptionOfferDetails[0].offerToken
        : "";

    console.log("onPressLetsStartButton", sku);
    console.log("onPressLetsStartButton offerToken", offerToken);
    try {
      await IAP.requestSubscription({
        sku: sku,
        subscriptionOffers: [
          { offerType: "SUBSCRIPTION", sku: sku, offerToken: offerToken },
        ],
      })
        .then(async (res: any) => {
          console.log("requestSubscription: res", res);
          setisDataLoading(true);
          const getupgradePlus = await upgradePlus(
            {
              Year: 2022,
              TaxPayerID: savedUserData?.TaxPayerID,
              AcctID: savedUserData?.AcctID,
              TaxID: getSavedLoggedInData?.TaxID,
              token: savedUserData?.token,
            },
            savedUserData?.token
          );
          console.log("getupgradePlus getupgradePlus:", getupgradePlus);
          if (getupgradePlus) {
            if (getupgradePlus.ErrCode == -1) {
              setisDataLoading(false);
              console.log("requestSubscription err:");
            } else {
              onSuccessCall();
            }
          } else {
            setisDataLoading(false);
          }
        })
        .catch((err: any) => {
          console.log("requestSubscription err:", err);
        });
    } catch (err) {
      console.log("requestSubscription err", err);
      console.warn(err.code, err.message);
    }
  };

  const onPressClose = () => {
    if(fromAddNewaccount){
   navigation.goBack()
    }else{
      onSuccessCall();
    }
  };

  const onSuccessCall = async () => {
    if(fromAddNewaccount){
      navigation.navigate("UserNameScreen", { savedUser: savedUserData });
    } else {
      let postData = {
        Year: 2022,
        TaxPayerID: savedUserData?.TaxPayerID,
      };
      const getUrl = await GetUrlData(postData, savedUserData?.token);
      setisDataLoading(false);
      if (getUrl) {
        console.log("getUrl", getUrl);
        navigation.navigate("WebViewWithoutPopUp", {
          url: getUrl.url,
          isFromEstimated: isFromManualUpdate ? false : true,
          isFromManualUpdate: isFromManualUpdate,
          isShowBackButton: false
        });
      } else {
        Alert.alert("Something went wrong. Please try again...!");
      }
    }

  };

  return (
    <SafeAreaView style={styles(darkTheme).view}>
      <StatusBar
        backgroundColor={defaultColors.plusbgColor}
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        // hidden={hidden}
      />
      <ScrollView
        style={{
          backgroundColor: darkTheme
            ? defaultColors.plusbgColor
            : defaultColors.plusbgColor,
          // flex: 1,
        }}
      >
        <CtView
          style={{
            paddingTop: 10,
            paddingBottom: 30,
            marginHorizontal: 20,
            backgroundColor: darkTheme
              ? defaultColors.plusbgColor
              : defaultColors.plusbgColor,
            // flex: 1,
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              width: "100%",
              marginTop: 18,
            }}
            onPress={() => onPressClose()}
          >
            <Ionicons
              style={{
                color: defaultColors.white,
              }}
              name={"close"}
              color={defaultColors.white}
              size={28}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 25,
              marginTop: 13,
              fontFamily: "Figtree-SemiBold",
            }}
          >
            {"Upgrade to Plus"}
          </Text>
          <Text
            style={{
              fontSize: 18,
              // marginBottom: 42,
              marginTop: 8,
              color: darkTheme
                ? defaultColors.secondaryTextColor
                : defaultColors.secondaryTextColor,
            }}
          >
            Taxes made easy, even if it’s your first time
          </Text>

          <CtView
            style={{
              marginTop: 20,
              width: "100%",
              borderRadius: 10,
              backgroundColor: darkTheme
                ? defaultColors.white
                : defaultColors.white,
            }}
          >
            <View
              style={{ width: "100%", borderRadius: 10, alignItems: "center" }}
            >
              <View
                style={{
                  height: 32,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  width: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFA100",
                }}
              >
                <CtText
                  style={{
                    fontWeight: "500",
                    fontSize: 14,
                    fontFamily: "Figtree-SemiBold",
                    color: darkTheme
                      ? defaultColors.secondaryTextColor
                      : defaultColors.secondaryTextColor,
                  }}
                >
                  {"Recommended"}
                </CtText>
              </View>
            </View>

            <View style={{ borderRadius: 10, padding: 20 }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 22,
                  fontFamily: "Figtree-SemiBold",
                  color: darkTheme
                    ? defaultColors.secondaryTextColor
                    : defaultColors.secondaryTextColor,
                }}
              >
                {"Plus"}
              </Text>
              <View
                style={{
                  width: "100%",
                  borderRadius: 10,
                  flexDirection: "row",
                  marginTop: 18,
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 25,
                    fontFamily: "Figtree-SemiBold",
                    color: darkTheme
                      ? defaultColors.secondaryTextColor
                      : defaultColors.secondaryTextColor,
                    marginRight: 3,
                    marginTop: 3,
                  }}
                >
                  {"$"}
                </Text>
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 35,
                    fontFamily: "Figtree-Bold",
                    color: darkTheme
                      ? defaultColors.secondaryTextColor
                      : defaultColors.secondaryTextColor,
                  }}
                >
                  {"29.99"}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: 18,
                  fontFamily: "Figtree-SemiBold",
                  color: darkTheme
                    ? defaultColors.secondaryTextColor
                    : defaultColors.secondaryTextColor,
                }}
              >
                {"Per year"}
              </Text>
              <FlatList
                contentContainerStyle={{
                  paddingTop: 20,
                }}
                data={isAllFeature ? AllFeatures : availableFeatures}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              />
              <CustomButton
                showLoading={isDataLoading}
                buttonText="Upgrade Now"
                disabled={false}
                onPress={() => onPressLetsStartButton()}
                style={{ marginBottom: 20, marginTop: 30 }}
              />

              {!isAllFeature ? (
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 18,
                  }}
                  onPress={() => setSeeAllFeature(true)}
                >
                  <CtText
                    style={{
                      fontWeight: "600",
                      fontSize: 16,
                      fontFamily: "Figtree-SemiBold",
                      color: "#1A263A",
                      marginBottom: 6,
                    }}
                  >
                    {"Show All Features"}
                  </CtText>

                  <Ionicons
                    style={{
                      color: defaultColors.primaryButton,
                    }}
                    name={"arrow-down"}
                    color={defaultColors.white}
                    size={28}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </CtView>
        </CtView>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: isDarkTheme
        ? defaultColors.plusbgColor
        : defaultColors.plusbgColor,
      // marginBottom: 26,
    },
    button: {
      width: "100%",
      borderRadius: 10,
      alignSelf: "center",
      justifyContent: "center",
      height: 50,
    },
  });

export default UpgradeToPlusScreen;
