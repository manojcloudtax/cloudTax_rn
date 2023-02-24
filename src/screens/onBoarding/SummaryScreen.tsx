import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Dimensions,
  PermissionsAndroid,
} from "react-native";
import {
  CtText,
  CtView,
  CtTextInput,
  Button,
  TextButton,
  Divider,
} from "../../components/UiComponents";
import { useDispatch } from "react-redux";
import { defaultColors } from "../../utils/defaultColors";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Header } from "../../components/Header";
import { CommonModal } from "../../components";
import DocumentScanner from 'react-native-document-scanner-plugin';
import ImagePicker from 'react-native-image-crop-picker';

const SummaryScreen = ({ navigation }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [isShowModal, setShowModal] = useState(false);
  const [libraryData, setLibraryData] = useState<any>(null);

  const dispatch = useDispatch();

  const onPressCRAAutoFill = () => {
    navigation.navigate("CRAAutoFillScreen");
  };

  const onPressScanYourBill = () => {
    setShowModal(true);
  };

  const onBackButtonPress = () => {
    navigation.goBack();
  };

  const onBackdropPress = () => {
    setShowModal(false);
  }
  
  const checkPermission = async () =>{
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('CAMERA permission allow');
          
          // navigation.navigate("ReactNativeScanner");
          const { scannedImages } = await DocumentScanner.scanDocument({
            maxNumDocuments: 1
          })

          console.log('CAMERA permission allow', scannedImages);
        } else {
          console.log('CAMERA permission denied');
          alert('CAMERA permission denied');
        }
      } catch (e) {
        console.log("catch", e)
      } 
  }
  }
  const onPressCamera = () =>{
    setShowModal(false);
    setTimeout(() => {
      
    checkPermission();
    }, 500);
  }

  const onPressLibrary = () =>{
    setShowModal(false);
    setTimeout(async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('CAMERA permission allow');
            
          //   const options: ImageLibraryOptions = {
          //     mediaType: 'photo',
          // }
          // const { assets } = await launchImageLibrary(options);
          // setLibraryData(assets);
          ImagePicker.openPicker({
            // width: 300,
            // height: 400,
            cropping: true
          }) .then(image => {
            console.log('received base64 image', image);
            setLibraryData(image);
          
          })
          .catch(e => console.log('received base64 image', e));;
          } else {
            console.log('CAMERA permission denied');
            alert('CAMERA permission denied');
          }
        } catch (e) {
          console.log("catch", e)
        } 
    }
    }, 500);
  }

  const confirmationModal = () => {
    return (
      <View
        style={{
          height: "auto",
          width: "100%",
          backgroundColor: darkTheme
            ? defaultColors.black
            : '#999999',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <View
          style={{
            height: "auto",
            width: "100%",
            backgroundColor: darkTheme
              ? defaultColors.matBlack
              : defaultColors.matBlack,
            // margin: 20,
            padding: 15,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <CtText
            style={{ fontWeight: "600",
            fontFamily:'Figtree-SemiBold', fontSize: 15, textAlign: "center", color: defaultColors.white }}
          >
            {"Pick a photo"}
          </CtText>
          <CtText
            style={{
              fontWeight: "600",
              fontSize: 14,
              marginTop: 4,
              textAlign: "center",
              color: defaultColors.white,
              fontFamily:'Figtree-SemiBold', 
            }}
          >
            {"Choose a picture from Library or Camera"}
          </CtText>
        </View>
        <View
          style={{
            backgroundColor: darkTheme ? "transparent" : "transparent",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button
            onPress={() => onPressCamera()}
            style={{
              paddingVertical: 16,
              // borderRadius: 5,
              backgroundColor: defaultColors.matBlack,
              // marginBottom: 20,
              borderTopColor: defaultColors.darkBorder,
              borderTopWidth: 2,
              borderBottomColor: defaultColors.darkBorder,
              borderBottomWidth: 2,
            }}
          >
            <CtText
              style={{
                fontSize: 18,
                color: defaultColors.primaryBlue,
                fontWeight: "600",
                // borderRadius: 10,
              }}
            >
              Camera
            </CtText>
          </Button>

          <Button
            onPress={() => onPressLibrary()}
            style={{
              backgroundColor: defaultColors.matBlack,

          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
            }}
          >
            <CtText
              style={{
                paddingVertical: 16,
                fontSize: 18,
                color: defaultColors.primaryBlue,
                fontWeight: "600",
                // borderRadius: 10,
                // marginBottom: 10,
              }}
            >
              Library
            </CtText>
          </Button>
        </View>

        <View
          style={{
            backgroundColor: darkTheme ? "transparent" : "transparent",
            justifyContent: "center",
            width: "100%",
            marginTop: 10,
          }}
        >
          <Button
            onPress={() => onBackdropPress()}
            style={{
              paddingVertical: 16,
              borderRadius: 10,
              backgroundColor: defaultColors.matBlack,
              marginBottom: 10,
              // borderTopColor: defaultColors.darkBorder,
              // borderTopWidth: 2,
              // borderBottomColor: defaultColors.darkBorder,
              // borderBottomWidth: 2,
            }}
          >
            <CtText
              style={{
                fontSize: 18,
                color: darkTheme ? defaultColors.primaryBlue : defaultColors.white,
                fontWeight: "700",
                borderRadius: 10,
              }}
            >
              Cancel
            </CtText>
          </Button>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles(darkTheme).scrollStyle}>
      <CommonModal
        isShowModal={isShowModal}
        ChildView={confirmationModal()}
        onBackdropPress={() => onBackdropPress()}
      />
      <Header onPressbackButton={() => onBackButtonPress()} />
      {/* <TouchableOpacity
        style={{
          alignItems: "flex-start",
          height: "auto",
          width: "90%",
          flexDirection: "row",
          paddingLeft: 20,
          paddingTop: 20
        }}
        onPress={() => onBackButtonPress()}
      >
        <Ionicons
          name={"ios-chevron-back-outline"}
          style={{
            fontSize: 21,
            color: defaultColors.primaryBlue,
          }}
        />
        <CtText
          style={{
            fontWeight: "500",
            fontSize: 18,
            color: defaultColors.primaryBlue,
          }}
        >
          {"Back"}
        </CtText>
      </TouchableOpacity> */}
      <ScrollView
        // contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
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
                // marginTop: 40,
              }}
            >
              <Image
                style={{
                  height: 300,
                  width: Dimensions.get("window").width * 0.9,
                  backgroundColor: defaultColors.transparent,
                }}
                resizeMode={"contain"}
                source={require("../../../assets/summary.png")}
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
                  fontFamily:'Figtree-SemiBold',
                  fontWeight: "600",
                  color: darkTheme
                    ? defaultColors.white
                    : defaultColors.secondaryText,
                }}
              >
                Lets start with your slips
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
                If you don’t have access to CRA’s My Account, you can input them
                manually or scan your slips.
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
            <TouchableOpacity
              style={{
                height: 74,
                // flex: 0.3,darkModeTextColor
                flexDirection: "row",
                marginRight: 20,
                marginLeft: 20,
                borderWidth: 1,
                borderColor: darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.borderColor,
                borderRadius: 10,
                marginTop: 20,
              }}
              onPress={() => onPressCRAAutoFill()}
            >
              <CtView
                style={{
                  flex: 0.2,
                  // marginTop: 22,
                  // marginBottom: 22,
                  marginLeft: 22,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={require("../../../assets/maple.png")} />
              </CtView>
              <CtView
                style={{
                  flex: 0.8,
                  flexDirection: "row",
                  marginLeft: 20,
                  marginRight: 12,
                }}
              >
                <CtView
                  style={{
                    flex: 0.8,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CtText
                    style={{
                      textAlign: "left",
                      fontSize: 18,
                      fontFamily:'Figtree-SemiBold',
                      fontWeight: "600",
                      color: darkTheme
                        ? defaultColors.darkModeTextColor
                        : defaultColors.secondaryTextColor,
                    }}
                  >
                    CRA Auto-fill
                  </CtText>
                </CtView>
                <CtView
                  style={{
                    flex: 0.2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Ionicons
                    name={"ios-chevron-forward-outline"}
                    style={{
                      fontSize: 21,
                      color: defaultColors.darkModeTextColor,
                    }}
                  />
                </CtView>
              </CtView>
            </TouchableOpacity>

            {/* <CtView
              style={{
                // flex: 0.15,
                marginRight: 20,
                marginLeft: 20,
                // flex: 0,
                height: 40,
                backgroundColor: defaultColors.transparent,
              }}
            >
              <Divider darkTheme={darkTheme} />
            </CtView> */}

            <TouchableOpacity
              style={{
                height: 72,
                flexDirection: "row",
                marginRight: 20,
                marginLeft: 20,
                marginTop: 16,
                borderWidth: 1,
                borderColor: darkTheme
                  ? defaultColors.darkModeTextColor
                  : defaultColors.borderColor,
                borderRadius: 10,
              }}
              onPress={() => onPressScanYourBill()}
            >
              <CtView
                style={{
                  flex: 0.2,
                  // marginTop: 22,
                  // marginBottom: 22,
                  marginLeft: 22,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={require("../../../assets/camera.png")} />
              </CtView>
              <CtView
                style={{
                  flex: 0.8,
                  flexDirection: "row",
                  // marginTop: 23,
                  // marginBottom: 20,
                  marginLeft: 20,
                  marginRight: 12,
                }}
              >
                <CtView
                  style={{
                    flex: 0.8,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CtText
                    style={{
                      textAlign: "left",
                      fontSize: 18,
                      fontFamily:'Figtree-SemiBold',
                      fontWeight: "600",
                      color: darkTheme
                        ? defaultColors.darkModeTextColor
                        : defaultColors.secondaryTextColor,
                    }}
                  >
                    Scan your T slips
                  </CtText>
                </CtView>
                <CtView
                  style={{
                    flex: 0.2,
                    // backgroundColor:'red',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Ionicons
                    name={"ios-chevron-forward-outline"}
                    style={{
                      fontSize: 21,
                      color: defaultColors.darkModeTextColor,
                    }}
                  />
                </CtView>
              </CtView>
            </TouchableOpacity>

            <CtView
              style={{
                // flex: 0.25,
                // marginRight:67,
                // marginLeft:67,
                // marginBottom: 30,
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <CtText
                style={{
                  // textAlign: "left",
                  fontSize: 18,
                  fontFamily:'Figtree-SemiBold',
                  fontWeight: "600",
                  color: darkTheme
                    ? defaultColors.darkModeTextColor
                    : defaultColors.secondaryTextColor,
                }}
              >
                No, I will enter them manually
              </CtText>
            </CtView>
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
    container: {
      flex: 1,
    },
    BottomViewContainer: {
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      //   flex: 0.5
    },
    TopTextContainer: {
      marginTop: 40,
      //   backgroundColor: defaultColors.yellow,
      height: "auto",
      justifyContent: "flex-end",
      backgroundColor: defaultColors.white,
      //   flex: 0.5
    },
    caption: {
      textAlign: "center",
      fontSize: 25,
      fontFamily: "Figtree-Bold",
      fontWeight: "700",
    },
    subTitle: {
      marginTop: 5,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Figtree-Regular",
      fontWeight: "400",
      color: "rgba(26, 38, 58, 0.7)",
    },
    input: {
      borderWidth: 1,
      borderColor: "#DADADA",
      backgroundColor: "transparent",
      padding: 15,
      marginBottom: 24,
      borderRadius: 5,
      width: "100%",
      fontFamily: "Figtree-Medium",
    },
    textInputContainer: {
      flex: 0,
      flexDirection: "row",
      //   justifyContent: "space-between",
    },
    inputIcon: {
      flex: 0,
      position: "absolute",
      justifyContent: "flex-end",
      backgroundColor: "transparent",
      right: 24,
      top: 15,
    },
    iconStyle: {
      fontSize: 20,
      color: defaultColors.gray,
    },
    buttonContainer: {
      flex: 0,
      marginTop: 30,
      marginBottom: 30,
    },
    keepMeContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 60,
    },
    forgotPassContainer: {
      flex: 0.45,
      alignItems: "flex-end",
    },
    KeepContainer: {
      flex: 0.55,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
    },
    button: {
      paddingVertical: 16,
      borderRadius: 5,
      backgroundColor: defaultColors.primaryButton,
      marginBottom: 20,
    },
    separatorContainer: {
      flex: 0,
      marginVertical: 40,
    },
    separator: {
      flex: 0,
      borderTopWidth: 0.5,
      borderTopColor: defaultColors.whisper,
    },
    separatorText: {
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      position: "absolute",
      alignSelf: "center",
      textAlign: "center",
      top: Platform.OS === "ios" ? -10 : -13,
      fontSize: 16,
      width: 24,
    },
    googleSignIn: {
      backgroundColor: "#FFF",
      flexDirection: "row",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
    googleSignInContainer: {
      height: 54,
      borderRadius: 10,
      justifyContent: "center",
      backgroundColor: "#FFF",
      borderWidth: 2,
      marginTop: 20,
      borderColor: "#DEE1E9",
      alignContent: "center",
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30,
    },
    dividerStyle: { flex: 1, height: 1, backgroundColor: "#DEE1E9" },
    inputIcon2: {
      flex: 0,
      position: "absolute",
      justifyContent: "flex-start",
      backgroundColor: "transparent",
      left: 12,
      top: 15,
    },
    inputAlt: {
      borderWidth: 1,
      borderColor: "#DADADA",
      backgroundColor: "transparent",
      marginTop: 0,
      padding: 15,
      paddingLeft: 42,
      marginBottom: 24,
      borderRadius: 8,
      width: "100%",
      fontFamily: "Figtree-Medium",
    },
    forgotTextColor: {
      color: "rgba(26, 38, 58, 0.7)",
      fontSize: 16,
      fontWeight: "400",
    },
    dottedStyle: {
      color: "rgba(26, 38, 58, 0.7)",
      fontSize: 8,
      fontWeight: "400",
    },
  });

export default SummaryScreen;
