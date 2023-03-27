import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  View,
  Dimensions,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { CtText, CtView } from "../../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Header } from "../../components/Header";
import { CommonModal } from "../../components";
import DocumentScanner from "react-native-document-scanner-plugin";
import ImagePicker from "react-native-image-crop-picker";
import { CustomButton } from "../../components/CustomButton";
import { ImageUploadComponent } from "../../components/ImageUploadComponent";
import { navigateToScreenFromScanning } from "../../utils/OcrUtils/OcrUtils";
import { getScannedSlip, scanSlip } from "../../api/auth";
import { firebase } from "@react-native-firebase/analytics";

const EmptySlipsScreen = ({ navigation, route }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [isShowModal, setShowModal] = useState(false);
  const [libraryData, setLibraryData] = useState<any>(null);
  const [loadingAvailable, setisLoading] = useState<boolean>(false);
  const [getSelectedFormsData, setSelectedDataRender] = useState([]);
  const { savedUserData } = useSelector(
    (state: RootState) => state.authReducer
  );
  const dispatch = useDispatch();
  useEffect(() => {
    firebase.analytics().logScreenView({
      screen_name: 'emptyslipsscreen',
    });
  }, []);
  useEffect(() => {
    try {
      if (route.params !== undefined) {
        const { getSelectedData } = route.params;
        setSelectedDataRender(getSelectedData);
      }
    } catch (error) {}
  }, []);

  const onPressConfirm = () => {
    setShowModal(true);
  };

  const onBackButtonPress = () => {
    navigation.navigate("SummaryScreen");
  };

  const onBackdropPress = () => {
    setShowModal(false);
  };

  const checkPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'CloudTax App Camera Permission',
            message:
              'Allow CloudTax to take pictures.',
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("CAMERA permission allow");
          setisLoading(true);
          const { scannedImages } = await DocumentScanner.scanDocument({
            maxNumDocuments: 1,
            croppedImageQuality: 50
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
          setisLoading(false);
          console.log("CAMERA permission denied");
          alert("CAMERA permission denied");
        }
      } catch (e) {
        setisLoading(false);
        console.log("catch", e);
      }
    }
  };
  const onPressCamera = () => {
    setShowModal(false);
    setTimeout(() => {
      checkPermission();
    }, 500);
  };

  const onPressLibrary = () => {
    console.log("onPressLibrary");
    setShowModal(false);

    setTimeout(async () => {
      setisLoading(true);
      ImagePicker.openPicker({
        cropping: true,
      })
        .then((image) => {
          console.log("received base64 {filename: image.path} image", image);
          setLibraryData(image);
          setisLoading(true);
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
          setisLoading(false);
          console.log("received image error", e);
        });
    }, 500);
  };



  const scanApiCall = async (formData: FormData) => {
    setisLoading(true);
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
          setisLoading(false);
          if (getScannedSlipData.ErrCode == -1) {
            console.log("getScannedSlipData else");
          } else {
            console.log("getScannedSlipData else", getScannedSlipData);
            if (getScannedSlipData.hasOwnProperty('result')) {
              if(navigateToScreenFromScanning(getScannedSlipData.result.Type) !== null){
              navigation.navigate(
                navigateToScreenFromScanning(getScannedSlipData.result.Type),
                {
                  data: getScannedSlipData.result,
                  ScanID: getScannedSlipParams.ScanID,
                  getSelectedFormsData: getSelectedFormsData,
                }
              );
            } else {
              Alert.alert('We are sorry..! Unsupported file type for the moment..!');
            }
            } else {
              Alert.alert('Something went wrong..! Please rescan again..!');
            }
           
          }
        } else {
          setisLoading(false);
          console.log("getScannedSlipData else");
          Alert.alert('Something went wrong..! Please rescan again..!');
        }
      }
    } else {
      console.log("getScannedSlipParams else");
      Alert.alert('Something went wrong..! Please rescan again..!');
      setisLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle}>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <CtView
          style={{
            flex: 1,
          }}
        >
          <CtView
            style={{
              flex: 1,
            }}
          >
            <CtView
              style={{
                flex: 0.7,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Image
                style={{
                  height: 300,
                  width: Dimensions.get("window").width * 0.6,
                  backgroundColor: defaultColors.transparent,
                }}
                resizeMode={"contain"}
                source={require("../../../assets/NoResults.png")}
              />
            </CtView>
            <CtView
              style={{
                flex: 0.3,
                marginRight: 20,
                marginLeft: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <CtText
                style={{
                  textAlign: "center",
                  fontSize: 25,
                  fontFamily: "Figtree-SemiBold",
                  fontWeight: "500",
                  color: darkTheme
                    ? defaultColors.white
                    : defaultColors.primaryText,
                }}
              >
                No Slips-Yet!
              </CtText>
              <CtText
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "Figtree-Regular",
                  fontWeight: "400",
                  color: darkTheme
                    ? defaultColors.darkModeTextColor
                    : defaultColors.secondaryTextColor,
                  marginTop: 5,
                }}
              >
                Looks like you haven’t added a slips. No worries. Click the
                “Scan new slip”
              </CtText>
            </CtView>
          </CtView>

          <CtView
            style={{
              flex: 1,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <CustomButton
              buttonText="Scan new slip"
              onPress={() => onPressConfirm()}
              style={{ marginBottom: 20, marginTop: 10, margin: 40 }}
              showLoading={loadingAvailable}
            />

            <TouchableOpacity
              style={{
                marginTop: 4,
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("SummaryScreen")}
            >
              <CtText
                style={{
                  // textAlign: "left",
                  fontSize: 18,
                  fontFamily: "Figtree-Regular",
                  fontWeight: "600",
                  color: darkTheme
                    ? defaultColors.darkModeTextColor
                    : defaultColors.gray,
                }}
              >
                Skip Scanning, Go back
              </CtText>
            </TouchableOpacity>
          </CtView>
        </CtView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      flex: 1,
      paddingBottom: 15,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
    },
  });

export default EmptySlipsScreen;
