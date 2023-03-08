import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import {
  ChooseTaxYear,
  LoginScreen,
  OnBoardingTaxProfile,
  RegisterScreen,
} from "../screens";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import WebViewScreen from "../screens/WebViewScreen";
import ProfileSummary from "../screens/onBoarding/ProfileSummary";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SummaryScreen from "../screens/onBoarding/SummaryScreen";
import VerifyEmailScreen from "../screens/VerifyEmailScreen";
import CRAAutoFillScreen from "../screens/CRAAutoFillScreen";
import EstimatedScreen from "../screens/EstimatedScreen";
import DateOfBirthScreen from "../screens/DateOfBirthScreen";
import WebViewWithoutPopUp from "../screens/WebViewWithoutPopUp";
import VerificationCodeScreen from "../screens/VerificationCodeScreen";
import CRADetailsScreen from "../screens/CRADetailsScreen";
import T4OcrScreen from "../screens/Ocr/T4OcrScreen";
import EmptySlipsScreen from "../screens/Ocr/EmptySlipsScreen";
import MyTaxSlipsScreen from "../screens/Ocr/MyTaxSlipsScreen";
import T5007OcrScreen from "../screens/Ocr/T5007OcrScreen";
import T4APOcrScreen from "../screens/Ocr/T4APOcrScreen";
import T5OcrScreen from "../screens/Ocr/T5OcrScreen";
import T4OASScreen from "../screens/Ocr/T4OASScreen";

const { Navigator, Screen } = createNativeStackNavigator();

const AuthStack = () => {
  const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
  const setInitialRoute = () => {
    let initialScreenName;
    initialScreenName = "LoginScreen";
    return initialScreenName;
  };

  const NavigatorStack = (route: string) => {
    return (
      <Navigator
        initialRouteName={route}
        screenOptions={{
          gestureEnabled: true,
          headerStyle: {
            backgroundColor: darkTheme
              ? defaultColors.matBlack
              : defaultColors.whiteGrey,
          },
          animation: "slide_from_right",
        }}
      >
        <Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="WebViewWithoutPopUp"
          component={WebViewWithoutPopUp}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="WebViewScreen"
          component={WebViewScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="ChooseTaxYearScreen"
          component={ChooseTaxYear}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="OnBoardingTaxProfile"
          component={OnBoardingTaxProfile}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="ProfileSummary"
          component={ProfileSummary}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="SummaryScreen"
          component={SummaryScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="VerifyEmailScreen"
          component={VerifyEmailScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="CRAAutoFillScreen"
          component={CRAAutoFillScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="EstimatedScreen"
          component={EstimatedScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="DateOfBirthScreen"
          component={DateOfBirthScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="VerificationCodeScreen"
          component={VerificationCodeScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="CRADetailsScreen"
          component={CRADetailsScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="T4OcrScreen"
          component={T4OcrScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="EmptySlipsScreen"
          component={EmptySlipsScreen}
          options={{ title: "", headerShown: false }}
        />

        <Screen
          name="MyTaxSlipsScreen"
          component={MyTaxSlipsScreen}
          options={{ title: "", headerShown: false }}
        />
        <Screen
          name="T5007OcrScreen"
          component={T5007OcrScreen}
          options={{ title: "", headerShown: false }}
        />
         <Screen
          name="T4APOcrScreen"
          component={T4APOcrScreen}
          options={{ title: "", headerShown: false }}
        />
         <Screen
          name="T5OcrScreen"
          component={T5OcrScreen}
          options={{ title: "", headerShown: false }}
        />
         <Screen
          name="T4OASScreen"
          component={T4OASScreen}
          options={{ title: "", headerShown: false }}
        />
      </Navigator>
    );
  };
  return NavigatorStack(setInitialRoute());
};

const styles = StyleSheet.create({});

export default AuthStack;
