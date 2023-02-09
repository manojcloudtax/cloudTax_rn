import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { CtView } from "../components/UiComponents";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetState } from "../store/authSlice";
import { setTheme } from "../store/themeSlice";
import AuthStack from "./AuthStack";
import { RootState } from "../store"
import jwt_decode from "jwt-decode";
import { defaultColors } from '../utils/defaultColors';
import { QueryClient, QueryClientProvider } from "react-query";

const MainNavigation = () => {
    const dispatch = useDispatch();
    let checkTheme = null;

    const { userToken } = useSelector((state: RootState) => state.authReducer);
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
    const [tokenChecked, setTokenChecked] = useState(false);

    const checkUserToken = async () => {
        try {
            let dateNow = new Date();
            if (userToken) {
                const decoded: any = jwt_decode(userToken);
                if (decoded.exp * 1000 < dateNow.getTime()) {
                    dispatch(resetState());
                }
            }
            checkTheme = await AsyncStorage.getItem("storeThemeSettings");
            if (checkTheme != null) {
                if (checkTheme === "true") {
                    dispatch(setTheme(true));
                } else {
                    dispatch(setTheme(false));
                }
            }
        } catch (error) {
            console.log('main nav error:',error);
        }
        setTokenChecked(true);
    };

    useEffect(() => {
        setTimeout(() => {
            checkUserToken();
        }, 100);

    }, [])

    const queryClient = new QueryClient();
    
    const headerDisplay = useMemo(() => {
        return <StatusBar
            backgroundColor={darkTheme ? defaultColors.matBlack : defaultColors.whiteGrey}
            barStyle={darkTheme ? "light-content" : "dark-content"}
    />
    }, [darkTheme])

    return (
        <CtView>
            <QueryClientProvider client={queryClient}>
                {headerDisplay}
                <NavigationContainer>
                <AuthStack />
                </NavigationContainer>
            </QueryClientProvider>
        </CtView>
    );
};


export default MainNavigation;
