import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { LoginScreen, RegisterScreen } from "../screens";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { defaultColors } from "../utils/defaultColors";
import WebViewScreen from "../screens/WebViewScreen";

const { Navigator, Screen } = createNativeStackNavigator();

const AuthStack = () => {
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
    const setInitialRoute = () => {
        let initialScreenName;
        initialScreenName = 'LoginScreen';
        return initialScreenName;
    };

    const NavigatorStack = (route: string) => {
        return (
            <Navigator
                initialRouteName={route}
                screenOptions={{
                    gestureEnabled: true,
                    headerStyle: {
                        backgroundColor: darkTheme ? defaultColors.matBlack : defaultColors.whiteGrey,
                    },
                }}>
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
                    name="WebViewScreen"
                    component={WebViewScreen}
                    options={{ title: ""}}
                />
            </Navigator>
        );
    };
    return NavigatorStack(setInitialRoute())
}

const styles = StyleSheet.create({});

export default AuthStack;
