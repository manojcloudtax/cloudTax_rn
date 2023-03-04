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
import { CtText, CtView, Button } from "../../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Header } from "../../components/Header";
import { CommonModal } from "../../components";
import DocumentScanner from "react-native-document-scanner-plugin";
import ImagePicker from "react-native-image-crop-picker";
import axios from "axios";
import { CustomButton } from "../../components/CustomButton";
import { ImageUploadComponent } from "../../components/ImageUploadComponent";

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
    navigation.goBack();
  };

  const onBackdropPress = () => {
    setShowModal(false);
  };

  const checkPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("CAMERA permission allow");
          setisLoading(true);
          // navigation.navigate("ReactNativeScanner");
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
          const config = {
            headers: {
              accept: "application/json",
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${savedUserData.token}`,
            },
          };
          try {
          axios
            .post(
              "https://www.app.cloudtax.ca/qa/ocr/api/slip/scan",
              formData,
              config
            )
            .then((res) => {
              setisLoading(false);
              console.log("this is data /api/slip/scan/", res);
              axios
                .get(
                  "https://www.app.cloudtax.ca/qa/ocr/api/slip/scan/" +
                    res.data.ScanID,
                  {
                    headers: {
                      accept: "application/json",
                      Authorization: `Bearer ${savedUserData.token}`,
                    },
                  }
                )
                .then((resData) => {
                  setisLoading(false);
                  console.log("this res.data.ScanID", resData);
                  navigation.navigate("T4OcrScreen", {
                    data: resData.data.result,
                    ScanID: res.data.ScanID,
                    getSelectedFormsData: getSelectedFormsData,
                  });
                })
                .catch((err) => {
                  setisLoading(false);
                  console.log(err);
                  Alert.alert('Something went wrong..! Please try again later..!');
                });
            })
            .catch((err) => {
              setisLoading(false);
              console.log(err.response.data);
              if(err.response.data){
                Alert.alert(err.response.data.message);
              } else {
                Alert.alert('Something went wrong..! Please try again later..!');
              }
              console.log("CAMERA permission allow", err);
            });
          } catch (error) {
            console.log("CAMERA permission allow", error);
            Alert.alert('Something went wrong..! Please try again later..!');
          }
          console.log("CAMERA permission allow", scannedImages);
        } else {
          console.log("CAMERA permission denied");
          alert("CAMERA permission denied");
        }
      } catch (e) {
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
          const config = {
            headers: {
              accept: "application/json",
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${savedUserData.token}`,
            },
          };
          axios
            .post(
              "https://www.app.cloudtax.ca/qa/ocr/api/slip/scan",
              formData,
              config
            )
            .then((res) => {
              setisLoading(false);
              console.log("this is data /api/slip/scan/", res);
              axios
                .get(
                  "https://www.app.cloudtax.ca/qa/ocr/api/slip/scan/" +
                    res.data.ScanID,
                  {
                    headers: {
                      accept: "application/json",
                      Authorization: `Bearer ${savedUserData.token}`,
                    },
                  }
                )
                .then((resData) => {
                  setisLoading(false);
                  console.log("this res.data.ScanID", resData);
                  navigation.navigate("T4OcrScreen", {
                    data: resData.data.result,
                    ScanID: res.data.ScanID,
                    getSelectedFormsData: getSelectedFormsData,
                  });
                })
                .catch((err) => {
                  setisLoading(false);
                  console.log(err);
                });
            })
            .catch((err) => {
              setisLoading(false);
              console.log(err);
            });
        })
        .catch((e) => {
          setisLoading(false);
          console.log("received image error", e);
        });
    }, 500);
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
              onPress={() => navigation.goBack()}
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