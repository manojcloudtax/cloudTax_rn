// import React from 'react'
// import { StyleSheet, Text, View,StatusBar,Image, ImageBackground } from 'react-native'
// // import {Colors} from '../../src/constants'

// import * as SplashScreen from 'expo-splash-screen';

// const SplashScreenView = ({ navigation }: any) => {
//   SplashScreen.hideAsync();
//     setTimeout(()=>{
//         navigation.replace('RegisterScreen')
//     },1000)
//     return (
//         <ImageBackground source={require('../../assets/splash.png')} resizeMode={'contain'} style={{flex:1,backgroundColor:'white'}} />
//     )
// }

// export default SplashScreenView

// const styles = StyleSheet.create({})

import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  Alert,
  SafeAreaView,
  Linking,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  saveLoggedInSuccessUserData,
  saveRegisteredSuccessUserData,
  setProvinces,
  saveTPMyProfileInfo,
  savePartnerDetails,
  saveGetTPAccountData,
} from "../store/authSlice";
import { setOnBoardingData } from "../store/onBoardingSlice";
import { GetForceUpdateStatus } from "../api/auth";
import { CommonModal } from "../components";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import { CtText, CtView } from "../components/UiComponents";
import { BottomButton } from "../components/BottomButton";
import { Constants } from "../utils/Constants";
// import WelcomeComponent from './WelcomeComponent';
SplashScreen.preventAutoHideAsync();
const SplashScreenView = ({ navigation }: any) => {
  //This state keeps track if the app has rendered
  const [ready, setReady] = useState();
  const dispatch = useDispatch();
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const [isShowModal, setShowModal] = useState(false);

  const readyApp = async () => {
    try {
      // Keep the splash screen visible while we fetch resources
      console.log(
        "Trigger the Splash Screen visible till this try block resolves the promise"
      );
      // await SplashScreen.preventAutoHideAsync();
      try {
        const allProvinceDataArray = await AsyncStorage.getItem(
          "allProvinceData"
        );
        if (allProvinceDataArray !== null) {
          console.log(JSON.parse(allProvinceDataArray));
          dispatch(setProvinces(JSON.parse(allProvinceDataArray)));
        }
        const savedUserData = await AsyncStorage.getItem("savedUserData");
        if (savedUserData !== null) {
          console.log(JSON.parse(savedUserData));
          let getFormattedSavedUserData = JSON.parse(savedUserData);
          await dispatch(
            saveRegisteredSuccessUserData(getFormattedSavedUserData)
          );
          console.log(
            "getSavedUserData: getFormattedSavedUserData",
            getFormattedSavedUserData
          );
          dispatch(saveRegisteredSuccessUserData(getFormattedSavedUserData));
          let postData = {
            app: "ca",
            version: Constants.AppVersion,
            platform: "android",
          };

          const GetStatus = await GetForceUpdateStatus(
            postData,
            getFormattedSavedUserData.token
          );

          if (GetStatus.forceUpdate) {
            console.log("getUrl", GetStatus);
            setShowModal(true);
          } else {
            console.log("getUrl 2", GetStatus);
            await SplashScreen.hideAsync();
            navigation.navigate("LoginScreen");
          }
        } else {
          await SplashScreen.hideAsync();
          navigation.navigate("LoginScreen");
        }

        // const getSavedUserData = await AsyncStorage.getItem(
        //   "getSavedLoggedInData"
        // );
        // if (getSavedUserData !== null) {
        //   console.log(JSON.parse(getSavedUserData));
        //   await dispatch(saveLoggedInSuccessUserData(JSON.parse(getSavedUserData)));
        // }

        // const getTPMyProfileInfo = await AsyncStorage.getItem(
        //   "saveTPMyProfileInfo"
        // );
        // if (getTPMyProfileInfo !== null) {
        //   console.log(JSON.parse(getTPMyProfileInfo));
        //   await dispatch(saveTPMyProfileInfo(JSON.parse(getTPMyProfileInfo)));
        // }

        // const partnerDetails = await AsyncStorage.getItem("partnerDetails");
        // if (partnerDetails !== null) {
        //   console.log(JSON.parse(partnerDetails));
        //   await dispatch(savePartnerDetails(JSON.parse(partnerDetails)));
        // }

        // const saveTPAccountData = await AsyncStorage.getItem(
        //   "saveTPAccountData"
        // );
        // if (saveTPAccountData !== null) {
        //   console.log(JSON.parse(saveTPAccountData));
        //   await dispatch(saveGetTPAccountData(JSON.parse(saveTPAccountData)));
        // }

        // const getOnBoardingData = await AsyncStorage.getItem(
        //   "setOnBoardingData"
        // );
        // console.log("getUrl getOnBoardingData", getOnBoardingData);
        // if (getOnBoardingData !== null) {
        //   console.log(JSON.parse(getOnBoardingData));
        //   await dispatch(setOnBoardingData(JSON.parse(getOnBoardingData)));
        // }
      } catch (error) {
        // Error retrieving data
        await SplashScreen.hideAsync();
        console.log("getUrl error", error);
        navigation.navigate("LoginScreen");
      }

      //Explicit delay to mock some loading time
      // await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.warn(e);
    } finally {
      console.log("Render the application screen");
      // setReady(true);
    }
  };

  useEffect(() => {
    // SplashScreen.preventAutoHideAsync();
    setShowModal(false);
    readyApp();
  }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   if (ready) {
  //     console.log("Hide the splash screen immediately");

  //     await SplashScreen.hideAsync();
  //   }
  // }, [ready]);

  // if (!ready) {
  //   return null;
  // }

  const onPressOkay = async () => {
    setShowModal(false);
    await SplashScreen.hideAsync();
    let url = "https://play.google.com/store/apps/details?id=cloudtax.org.com.ctweb&pli=1";
    Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        return Linking.openURL(url);
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(err => {return Linking.openURL(url);});
  };
  const ErrorModal = () => {
    return (
      <View
        style={{
          height: "auto",
          width: "100%",
          backgroundColor: darkTheme ? defaultColors.black : "#F8F8F8",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "auto",
            marginTop: 10,
            marginBottom: 80,
            padding: 20,
            width: "100%",
          }}
        >
          <View
            style={{
              height: 100,
            }}
          >
            <CtText
              style={{
                fontWeight: "600",
                fontSize: 20,
                textAlign: "center",
                fontFamily: "Figtree-SemiBold",
              }}
            >
              {"We have an update for you..! Please update the app"}
            </CtText>
          </View>
        </View>
        <CtView
          style={{
            width: "100%",
            height: 80,
            backgroundColor: darkTheme
              ? defaultColors.matBlack
              : defaultColors.white,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 10,
            borderTopWidth: 1.5,
            borderTopColor: defaultColors.borderColor,
          }}
        >
          <BottomButton onPress={() => onPressOkay()} buttonText={"OKAY"} />
        </CtView>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: darkTheme ? defaultColors.black : defaultColors.white,
      }}
    >
      <CommonModal
        isShowModal={isShowModal}
        ChildView={ErrorModal()}
        onBackdropPress={() => {
          return;
        }}
      />
      <ImageBackground
        // onLayout={onLayoutRootView}
        source={require("../../assets/splash.png")}
        resizeMode={"contain"}
        style={{ flex: 1, backgroundColor: defaultColors.white }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default SplashScreenView;
