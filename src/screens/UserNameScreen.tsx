import React, { useEffect, useState } from "react";
import { Avatar, Accessory } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";

import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
  Dimensions,
  SafeAreaView,
  PermissionsAndroid,
} from "react-native";
import {
  CtText,
  CtView,
  Button,
} from "../components/UiComponents";
import { CommonModal } from "../components";

import { defaultColors } from "../utils/defaultColors";
import {
  GetTaxPayerMyProfileInfo,
  NewSaveTPAccountInfo,
} from "../api/auth";
import {
  imageUpload,
  saveRegisteredSuccessUserData,
  saveTPMyProfileInfo,
  setIsPriorYearModalSelected,
  resetAllStateData,
  savePartnerDetails,
} from "../store/authSlice";
import { RootState } from "../store";
import axios from "axios";
import {
  resetOnBoardingData,
  setOnBoardingData,
} from "../store/onBoardingSlice";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Constants } from "../utils/Constants";

const UserNameScreen = ({ navigation, route }: any) => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [libraryData, setLibraryData] = useState<any>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
    useState<boolean>(false);
  const [loadingAvailable, setisLoading] = useState<boolean>(false);
  const [isShowModal, setShowModal] = useState(false);
  const [getSavedUser, setSavedUser] = useState({
    token : '',
    AcctID: '',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOnBoardingData({}));
    dispatch(setIsPriorYearModalSelected(false));
    dispatch(resetAllStateData());
    dispatch(resetOnBoardingData());
    setisLoading(false);

    try {
      if (route.params !== undefined) {
        const { savedUser } = route.params;
        setSavedUser(savedUser);

        console.log("UserNameScreen savedUser", savedUser);
      }
    } catch (error) {}
  }, []);


  const onPressLastStep = async () => {
    setisLoading(true);
    const resSaveTaxpayer = await NewSaveTPAccountInfo({
      AcctID: getSavedUser.AcctID,
      FirstName: name,
      TaxPayerName: name,
      Year: 2022,
      userToken: getSavedUser.token,
      isAddNew: true
    });

    console.log("UserNameScreen onPressLastStep res", resSaveTaxpayer);
    if (resSaveTaxpayer) {
      if (resSaveTaxpayer.ErrCode == -1) {
        setisLoading(false);
        console.log(
          "UserNameScreen onPressLastStep error",
          resSaveTaxpayer
        );
      } else {
        console.log(
          "UserNameScreen onPressLastStep success",
          resSaveTaxpayer
        );
        if (libraryData) {
          dispatch(imageUpload(libraryData));
          let formData = new FormData();
          formData.append("profileImg", {
            uri: libraryData.path,
            type: libraryData.mime,
            name: libraryData.modificationDate,
          });
          const config = {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: `Bearer ${getSavedUser.token}`,
            },
          };
          axios
            .post(
              Constants.baseURL+"/user/profile-img",
              formData,
              config
            )
            .then((res) => {
              setisLoading(false);
              console.log(res + "this is data after image upload");
            })
            .catch((err) => console.log(err));
        }

        const resGetTPAccountInfo = await GetTaxPayerMyProfileInfo({
          AcctID: getSavedUser.AcctID,
          TaxPayerID: resSaveTaxpayer.TaxPayerID,
          Year: 2022,
          userToken: getSavedUser.token,
        });
        if (resGetTPAccountInfo) {
          setisLoading(false);
          if (resGetTPAccountInfo.ErrCode == -1) {
            setisLoading(false);
            console.log("resGetTPAccountInfo err:", resGetTPAccountInfo);
          } else {
            setisLoading(false);
            console.log("resGetTPAccountInfo success", resGetTPAccountInfo);
            dispatch(saveTPMyProfileInfo(resGetTPAccountInfo));
            await AsyncStorage.setItem(
              "saveTPMyProfileInfo",
              JSON.stringify(resGetTPAccountInfo)
            );

            let RegisteredData = {
                AcctID: getSavedUser.AcctID,
                TaxPayerID: resSaveTaxpayer.TaxPayerID,
                token: getSavedUser.token,
            }

            await dispatch(saveRegisteredSuccessUserData(RegisteredData));
            let partnerDetails = {
              PartnerID: resGetTPAccountInfo?.PartnerID,
              PartnerName: resGetTPAccountInfo?.PartnerName,
              TypedPartnerName: null,
              SelectedPartnerID: null,
              SelectedPartnerName: null,
            };
            dispatch(savePartnerDetails(partnerDetails));
            await AsyncStorage.setItem(
              "partnerDetails",
              JSON.stringify(partnerDetails)
            );
            navigation.navigate("ChooseTaxYearScreen", {
              isFromRegistration: true,
            });
          }
        } else {
          setisLoading(false);
          console.log("resGetTPAccountInfo else");
        }
      }
    } else {
      setisLoading(false);
      console.log("resGetTPAccountInfo checkSub:");
      // return {}
    }
  };

  const onNameSubmit = () => {
    if (!name.trim()) {
      setNameError("Name is required.");
    } else {
      setNameError(null);
    }
  };

  const onPressCamera = () => {
    setShowModal(false);
    setTimeout(async () => {
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
            ImagePicker.openCamera({
              width: 300,
              height: 300,
              cropping: true,
              cropperCircleOverlay: true,
              mediaType: "photo",
            })
              .then((image) => {
                console.log("received base64 image", image);
                setLibraryData(image);
              })
              .catch((e) => console.log("received base64 image", e));
          } else {
            console.log("CAMERA permission denied");
            alert("CAMERA permission denied");
          }
        } catch (e) {
          console.log("catch", e);
        }
      }
    }, 500);
  };

  const onPressLibrary = () => {
    setShowModal(false);
    setTimeout(async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("CAMERA permission allow");
            ImagePicker.openPicker({
              // width: 300,
              // height: 400,
              cropping: true,
              mediaType: "photo",
            })
              .then((image) => {
                console.log("received base64 image", image);
                setLibraryData(image);
              })
              .catch((e) => console.log("received base64 image", e));
          } else {
            console.log("CAMERA permission denied");
            alert("CAMERA permission denied");
          }
        } catch (e) {
          console.log("catch", e);
        }
      }
    }, 500);
  };

  const confirmationModal = () => {
    return (
      <View
        style={{
          height: "auto",
          width: "100%",
          backgroundColor: darkTheme ? defaultColors.black : "#999999",
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
            style={{
              fontWeight: "600",
              fontSize: 15,
              textAlign: "center",
              color: defaultColors.white,
              fontFamily: "Figtree-SemiBold",
            }}
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
              fontFamily: "Figtree-SemiBold",
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
                color: darkTheme
                  ? defaultColors.primaryBlue
                  : defaultColors.white,
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
  const onBackdropPress = () => {
    setShowModal(false);
  };
  console.log("init steps", isShowModal);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 15,
        backgroundColor: darkTheme ? defaultColors.black : defaultColors.white,
      }}
    >
      <CommonModal
        isShowModal={isShowModal}
        ChildView={confirmationModal()}
        onBackdropPress={() => onBackdropPress()}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          // flex: 1,
          // paddingBottom: 15,
          backgroundColor: darkTheme
            ? defaultColors.black
            : defaultColors.white,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(darkTheme).scrollStyle}
          keyboardShouldPersistTaps="handled"
          // automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ alignItems: "center" }}>
            <CtText
              style={{
                fontWeight: "700",
                fontSize: 25,
                fontFamily: "Figtree-Bold",
                marginTop: 32,
              }}
            >
              Let's start with your name
            </CtText>
            <CtText
              style={{
                fontWeight: "400",
                fontSize: 16,
                fontFamily: "Figtree-SemiBold",
                marginTop: 10,
                color: darkTheme
                ? defaultColors.darkModeTextColor
                : defaultColors.secondaryTextColor,
                textAlign: 'center'
              }}
            >
              Please provide your first name so CloudTax can personalize your tax experience.
            </CtText>
          </View>
          <CtView style={{ marginTop: 24 }}>
              {libraryData == null ? (
                <Avatar
                  size={"xlarge"}
                  rounded
                  icon={{ name: "person", type: "fontawesome" }}
                  containerStyle={{
                    marginTop: 40,
                    backgroundColor: defaultColors.whisper,
                    alignSelf: "center",
                    marginBottom: 24,
                  }}
                  title={name.trim().length !== 0 ? name.charAt(0) : ""}
                  onPress={() => console.log("Works!")}
                  activeOpacity={0.7}
                >
                  <Accessory
                    onPress={() => setShowModal(true)}
                    style={{
                      backgroundColor: "#0090EE",
                      padding: 12,
                      height: 42,
                      width: 42,
                      borderRadius: 42,
                    }}
                    source={require("../../assets/add-image.png")}
                    size={32}
                    color={"#FFF"}
                    height={undefined}
                    tvParallaxProperties={undefined}
                    width={undefined}
                  />
                </Avatar>
              ) : (
                <Avatar
                  size={"xlarge"}
                  rounded
                  icon={{ name: "person", type: "fontawesome" }}
                  containerStyle={{
                    marginTop: 40,
                    backgroundColor: defaultColors.whisper,
                    alignSelf: "center",
                    marginBottom: 24,
                  }}
                  source={{ uri: libraryData.path }}
                  title={name.trim().length !== 0 ? name.charAt(0) : ""}
                  onPress={() => console.log("Works!")}
                  activeOpacity={0.7}
                >
                  <Accessory
                    onPress={() => setShowModal(true)}
                    style={{
                      backgroundColor: "#0090EE",
                      padding: 12,
                      height: 42,
                      width: 42,
                      borderRadius: 42,
                    }}
                    source={require("../../assets/add-image.png")}
                    size={32}
                    color={"#FFF"}
                    height={undefined}
                    tvParallaxProperties={undefined}
                    width={undefined}
                  />
                </Avatar>
              )}
              <CtText
                style={{
                  fontWeight: "400",
                  marginTop: 42,
                  fontSize: 14,
                  fontFamily: "Figtree-Regular",
                  marginBottom: 6,
                  color: darkTheme
                    ? defaultColors.white
                    : defaultColors.secondaryTextColor,
                }}
              >
                First name
              </CtText>
              <CustomInput
                editable={true}
                placeholder={"Eg. John"}
                placeholderTextColor={defaultColors.gray}
                onChangeText={(name: string) => setName(name)}
                onBlur={onNameSubmit}
                value={name}
                // autoCapitalize="none"
              />

              {/* {renderNextButton()} */}
              <CustomButton
                showLoading={loadingAvailable}
                buttonText="Next"
                disabled={!name || nameError}
                onPress={() => onPressLastStep()}
                style={{ marginBottom: 20 }}
              />
            </CtView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (isDarkTheme?: boolean) =>
  StyleSheet.create({
    scrollStyle: {
      paddingBottom: 80,
      backgroundColor: isDarkTheme ? defaultColors.black : defaultColors.white,
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#DADADA",
      backgroundColor: "transparent",
      marginTop: 10,
      padding: 15,
      marginBottom: 24,
      borderRadius: 8,
      width: "100%",
    },
    button: {
      paddingVertical: 15,
      borderRadius: 5,
      marginTop: 8,
      marginBottom: 15,
    },
    loading: {
      flex: 0,
    },
  });

export default UserNameScreen;
