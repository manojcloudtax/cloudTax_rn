import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  BackHandler,
  ScrollView,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { Button, CtText, CtView } from "../../components/UiComponents";
import { defaultColors } from "../../utils/defaultColors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { CommonModal } from "../../components";
import {
  deleteSlipData,
  GetAvailableSlipsData,
  getScannedSlip,
  getSelectedSlipData,
  GetT1TaxReturnInfo,
  SaveMultiTaxYearIndicatorInfo,
  SaveShoeBoxForms,
  scanSlip,
} from "../../api/auth";
import { BottomButton } from "../../components/BottomButton";
import { Header } from "../../components/Header";
import { CustomButton } from "../../components/CustomButton";
import { ImageUploadComponent } from "../../components/ImageUploadComponent";
import ImageCropPicker from "react-native-image-crop-picker";
import DocumentScanner from "react-native-document-scanner-plugin";
import {
  getName,
  getSlipNo,
  getSlips,
  getSlipsDeleteUrls,
  navigateToScreen,
  navigateToScreenFromScanning,
} from "../../utils/OcrUtils/OcrUtils";
import { useIsFocused } from "@react-navigation/native";
const MyTaxSlipsScreen = ({ navigation, route }: any) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  const { savedUserData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [isShowModal, setShowModal] = useState(false);
  const [loadingAvailable, setisLoading] = useState<boolean>(false);
  const [isScanLoading, setScanLoading] = useState<boolean>(false);
  const [dataToRender, setDataToRender] = useState([]);
  const [getSelectedFormsData, setSelectedDataRender] = useState({
    CreditsForms: "",
    DeductionsForms: "",
    ExpensesForms: "",
    IncomeSlipForms: "",
    ProvincialSlipForms: "",
  });
  const { getSavedLoggedInData } = useSelector(
    (state: RootState) => state.authReducer
  );

  useEffect(() => {}, []);

  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { data, getSelectedData } = route.params;
        setDataToRender(data);
        setSelectedDataRender(getSelectedData);
        console.log("getSelectedData", getSelectedData);
        console.log("onPressConfirm data", data);
      }
    } catch (error) {}
  }, [isFocused]);

  const onPressRenderitem = (item: any) => {
    console.log("onPressRenderitem", item);
    navigation.navigate(navigateToScreen(item.Type), {
      data: item,
      ScanID: item.ScanID,
      getSelectedFormsData: getSelectedFormsData,
      listedT4Items: dataToRender.filter((obj: { [key: string]: any }) => {
        return Object.entries(item).every(([key, value]) => {
          return obj.hasOwnProperty(key);
        });
      }),
    });
  };

  const onPressDeleteitem = async (item: any) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this?", [
      {
        text: "Yes",
        onPress: () => onPressDeleteData(item),
      },
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "destructive",
      },
    ]);
  };
  const onPressDeleteData = async (item: any) => {
    console.log("onPressDeleteData", item);
    setisLoading(true);
    if (item.Type !== "4") {
      const resGetSelectedData = await deleteSlipData(
        {
          SlipNo: getSlipNo(item, item.Type),
          AcctID: savedUserData?.AcctID,
          Year: 2022,
          TaxID: getSavedLoggedInData?.TaxID,
          TaxPayerID: savedUserData?.TaxPayerID,
        },
        savedUserData?.token,
        getSlipsDeleteUrls(item.Type)
      );
      console.log("onPressScanYourBill", savedUserData, resGetSelectedData);

      if (resGetSelectedData) {
        if (resGetSelectedData.ErrCode == -1) {
          console.log("resGetSelectedData else");
          setisLoading(false);
        } else {
          SaveShoeBoxDetails(item, false);
        }
      } else {
        setisLoading(false);
        console.log("resGetSelectedData else");
      }
    } else {
      SaveShoeBoxDetails(item, true);
    }
  };

  const SaveShoeBoxDetails = async (item: any, IncomeSlipData: boolean) => {
    let renderedData = dataToRender.filter((obj) => {
      return obj.Type === item.Type;
    });

    if (IncomeSlipData || renderedData.length == 1) {
      const typeArray = getSelectedFormsData.IncomeSlipForms.split(","); // Split the string into an array
      const index = typeArray.indexOf(item.Type); // Find the index of the element to remove
      if (index > -1) {
        typeArray.splice(index, 1); // Remove the element at the found index
      }
      const updatedType = typeArray.join(",");

      console.log("renderedData", updatedType);

      const resSaveShoeBoxData = await SaveShoeBoxForms(
        {
          TaxPayerID: savedUserData?.TaxPayerID,
          AcctID: savedUserData?.AcctID,
          IncomeSlipForms: updatedType,
          Year: 2022,
          TaxID: getSavedLoggedInData?.TaxID,
          CreditsForms: getSelectedFormsData.CreditsForms,
          DeductionsForms: getSelectedFormsData.DeductionsForms,
          ExpensesForms: getSelectedFormsData.ExpensesForms,
          ProvincialSlipForms: getSelectedFormsData.ProvincialSlipForms,
        },
        savedUserData?.token
      );
      console.log("resSaveShoeBoxData", resSaveShoeBoxData);

      if (resSaveShoeBoxData) {
        if (resSaveShoeBoxData.ErrCode == -1) {
          console.log("resGetSelectedData else");
        } else {
          // SaveShoeBoxForms
        }
        callGetAvailableSlipData();
      } else {
        console.log("resGetSelectedData else");
        callGetAvailableSlipData();
      }
    } else {
      callGetAvailableSlipData();
    }
  };
  const callGetAvailableSlipData = async () => {
    const resGetSelectedData = await getSelectedSlipData(
      {
        TaxPayerID: savedUserData?.TaxPayerID,
        AcctID: savedUserData?.AcctID,
        Year: 2022,
        TaxID: getSavedLoggedInData?.TaxID,
      },
      savedUserData?.token
    );
    if (resGetSelectedData) {
      if (resGetSelectedData) {
        setisLoading(false);
        if (resGetSelectedData.ErrCode == -1) {
          console.log("resGetSelectedData else");
        } else {
          setSelectedDataRender(resGetSelectedData);
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
              resGetSelectedData.IncomeSlipForms.split(",")
            );

            if (resAvailableSlipsData) {
              console.log("resAvailableSlipsData", resAvailableSlipsData);
              setisLoading(false);
              setDataToRender(resAvailableSlipsData);
            } else {
            }
          }
        }
      } else {
        setisLoading(false);
        console.log("resGetSelectedData else");
      }
    }
    // const resAvailableSlipsData = await GetAvailableSlipsData(
    //   {
    //     TaxPayerID: savedUserData?.TaxPayerID,
    //     AcctID: savedUserData?.AcctID,
    //     Year: 2022,
    //     TaxID: getSavedLoggedInData?.TaxID,
    //   },
    //   savedUserData?.token,
    //   getSelectedFormsData.IncomeSlipForms.split(",")
    // );

    // if (resAvailableSlipsData) {
    //   console.log("resAvailableSlipsData", resAvailableSlipsData);
    //   setisLoading(false);
    //   setDataToRender(resAvailableSlipsData);
    // } else {
    //   setisLoading(false);
    // }
  };

  const renderSlips = (item: any) => {
    console.log("renderSlips res", item);
    if (
      item.ErrCode == -1 ||
      !(
        Object.keys(item).some((key) => key.startsWith("T4_")) ||
        Object.keys(item).some((key) => key.startsWith("T5007")) ||
        item.Type == "5" ||
        item.Type == "10" ||
        item.Type == "4"||
        item.Type == "6"
      )
    ) {
      return;
    }
    return (
      <View
        key={item}
        style={{
          borderRadius: 10,
          marginVertical: 10,
          borderWidth: 1.5,
          flexDirection: "row",
          padding: 2,
          height: 60,
          backgroundColor: darkTheme ? "#242424" : defaultColors.white,
          borderColor: darkTheme
            ? defaultColors.darkBorder
            : defaultColors.borderColor,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 0.75,
            borderRadius: 10,
            justifyContent: "center",
            paddingLeft: 10,
          }}
          onPress={() => onPressRenderitem(item)}
        >
          <CtText
            style={{
              fontWeight: "600",
              fontSize: 18,
              fontFamily: "Figtree-SemiBold",
              color: darkTheme
                ? defaultColors.white
                : defaultColors.primaryText,
            }}
            numberOfLines={1}
          >
            {getName(item)}
          </CtText>
        </TouchableOpacity>

        <View
          style={{
            flex: 0.25,
            borderRadius: 10,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.5,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              // backgroundColor: defaultColors.black,
            }}
            onPress={() => onPressRenderitem(item)}
          >
            <Ionicons
              name={"ios-chevron-forward-outline"}
              style={{
                color: darkTheme ? defaultColors.white : defaultColors.black,
              }}
              size={24}
              underlayColor={"white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 0.5,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: defaultColors.green,darkTheme ?require("../../../assets/Ellipsis.png")
              height: "100%",
            }}
            onPress={() => onPressDeleteitem(item)}
          >
            <Image
              style={{
                height: 21,
                width: 21,
                backgroundColor: defaultColors.transparent,
              }}
              resizeMode={"contain"}
              source={
                darkTheme
                  ? require("../../../assets/darkEllipsis.png")
                  : require("../../../assets/Ellipsis.png")
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onPressCalculateButton = async () => {
    setisLoading(true);
    const GetGetT1TaxReturnInfo = await GetT1TaxReturnInfo({
      TaxID: getSavedLoggedInData?.TaxID,
      AcctID: savedUserData?.AcctID,
      TaxPayerID: savedUserData?.TaxPayerID,
      Year: 2022,
      userToken: savedUserData?.token,
      RuleSP: "Y",
    });

    if (GetGetT1TaxReturnInfo) {
      setisLoading(false);
      if (GetGetT1TaxReturnInfo.ErrCode == -1) {
        console.log("GetGetT1TaxReturnInfo else");
        // Alert.alert("Something went wrong..! Please try again..!");
      } else {
        navigation.navigate("EstimatedScreen", {
          data: GetGetT1TaxReturnInfo,
        });
      }
    } else {
      setisLoading(false);
    }
  };

  const onBackdropPress = () => {
    setShowModal(false);
  };

  const onPressScanNewSlip = () => {
    setShowModal(true);
  };

  const onBackButtonPress = () => {
    // navigation.goBack();
    navigation.navigate("SummaryScreen");
  };

  const checkPermission = async () => {
    setScanLoading(true);
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "CloudTax App Camera Permission",
            message: "Allow CloudTax to take pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("CAMERA permission allow");
          const { scannedImages } = await DocumentScanner.scanDocument({
            maxNumDocuments: 1,
          });

          let formData = new FormData();
          const fileName = scannedImages[0].split("/").pop();

          console.log("CAMERA permission fileName", fileName);
          formData.append("slip", {
            uri: scannedImages[0],
            type: "image/jpeg",
            name: fileName,
            path: scannedImages[0],
          });
          scanApiCall(formData);
          console.log("CAMERA permission allow", scannedImages);
        } else {
          console.log("CAMERA permission denied");
          alert("CAMERA permission denied");

          setScanLoading(false);
        }
      } catch (e) {
        console.log("catch", e);
        setScanLoading(false);
      }
    }
  };
  const onPressCamera = () => {
    setShowModal(false);
    setTimeout(() => {
      checkPermission();
    }, 500);
  };

  const onPressLibrary = async () => {
    setShowModal(false);

    setTimeout(async () => {
      setScanLoading(true);
      ImageCropPicker.openPicker({
        cropping: true,
      })
        .then(async (image) => {
          console.log("received base64 {filename: image.path} image", image);
          setScanLoading(true);
          let formData = new FormData();
          const fileName = image.path.split("/").pop();
          formData.append("slip", {
            uri: image.path,
            type: image.mime,
            name: fileName,
            path: image.path,
          });
          scanApiCall(formData);
        })
        .catch((e) => {
          setScanLoading(false);
          console.log("received image error", e);
        });
    }, 500);
  };

  function filterByType(data: any[], selectedType: string) {
    return data.filter(
      (item: { [s: string]: unknown } | ArrayLike<unknown>) => {
        for (const [key, value] of Object.entries(item)) {
          if (key.startsWith(selectedType) && key == selectedType + "_no") {
            return true;
          }
        }
        return false;
      }
    );
  }

  const scanApiCall = async (formData: FormData) => {
    setScanLoading(true);
    const getScannedSlipParams = await scanSlip(formData, savedUserData.token);
    console.log("getScannedSlipParams else", getScannedSlipParams);
    if (getScannedSlipParams) {
      if (getScannedSlipParams.ErrCode == -1) {
        setisLoading(false);
        console.log("getScannedSlipParams else");
      } else {
        const getScannedSlipData = await getScannedSlip(
          getScannedSlipParams.ScanID,
          savedUserData.token
        );
        if (getScannedSlipData) {
          console.log("getScannedSlipData else", getScannedSlipData);
          setScanLoading(false);
          if (getScannedSlipData.ErrCode == -1) {
            console.log("getScannedSlipData else");
          } else {
            if (getScannedSlipData.hasOwnProperty("result")) {
              if (
                navigateToScreenFromScanning(getScannedSlipData.result.Type) !==
                null
              ) {
                console.log("getScannedSlipData else", dataToRender.find((obj) => obj.Type === "4"));
                if (dataToRender.find((obj) => obj.Type === "4" &&getScannedSlipData.result.Type === 'T4A(OAS)')) {
                  Alert.alert("T4A(OAS) Already exists..!");
                } else {
                  navigation.navigate(
                    navigateToScreenFromScanning(
                      getScannedSlipData.result.Type
                    ),
                    {
                      data: getScannedSlipData.result,
                      ScanID: getScannedSlipParams.ScanID,
                      getSelectedFormsData: getSelectedFormsData,
                      listedT4Items: filterByType(
                        dataToRender,
                        getScannedSlipData.result.Type
                      ),
                    }
                  );
                }
              } else {
                Alert.alert(
                  "We are sorry..! Unsupported file type for the moment..!"
                );
              }
            } else {
              Alert.alert("Something went wrong..! Please rescan again..!");
            }
          }
        } else {
          setScanLoading(false);
          console.log("getScannedSlipData else");
          Alert.alert("Something went wrong..! Please rescan again..!");
        }
      }
    } else {
      console.log("getScannedSlipParams else");
      Alert.alert("Something went wrong..! Please rescan again..!");
      setScanLoading(false);
    }
  };

  console.log("onPressConfirm res", dataToRender);
  return (
    <SafeAreaView style={styles(darkTheme).view}>
      <CommonModal
        isShowModal={isShowModal}
        ChildView={
          <ImageUploadComponent
            onPressCamera={() => onPressCamera()}
            onPressLibrary={() => onPressLibrary()}
            onBackdropPress={() => onBackdropPress()}
          />
        }
        onBackdropPress={() => onBackdropPress()}
      />
      <Header onPressbackButton={() => onBackButtonPress()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: darkTheme
            ? defaultColors.black
            : defaultColors.white,
          flex: 1,
        }}
      >
        <CtView
          style={{
            paddingTop: 14,
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
              fontWeight: "500",
              fontSize: 25,
              fontFamily: "Figtree-SemiBold",
              color: darkTheme
                ? defaultColors.white
                : defaultColors.primaryText,
            }}
          >
            {"My Tax Slips"}
          </CtText>
          <CtText
            style={{
              fontSize: 18,
              marginTop: 8,
              color: darkTheme
                ? defaultColors.darkModeTextColor
                : defaultColors.secondaryText,
            }}
          >
            Here is the list of income slips that you have. If you missed
            anything, you can always add it later.
          </CtText>

          <CtView style={{ marginTop: 30, width: "100%" }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 10 }}
              data={dataToRender}
              renderItem={({ item }) => renderSlips(item)}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </CtView>
          <CustomButton
            showLoading={isScanLoading || loadingAvailable}
            buttonText="Scan New Slip"
            onPress={() => onPressScanNewSlip()}
            style={{
              marginBottom: 120,
              backgroundColor: defaultColors.secondaryButton,
            }}
            buttonTextStyle={{ color: defaultColors.primaryBlue }}
          />
        </CtView>
      </ScrollView>
      <BottomButton
        onPress={() => onPressCalculateButton()}
        buttonText={"Calculate Now"}
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
  });

export default MyTaxSlipsScreen;
