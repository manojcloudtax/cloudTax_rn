import React, { useEffect, useMemo, useState } from "react";
import { Appearance, StatusBar, useColorScheme } from "react-native";
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
    // const [colorScheme, setColorScheme] = React.useState(
    //     Appearance.getColorScheme(),
    //   );
    // useEffect(() => {
    //     Appearance.addChangeListener(({colorScheme}) => setColorScheme(colorScheme));
    //   }, []);
    const { userToken } = useSelector((state: RootState) => state.authReducer);
    const { darkTheme } = useSelector((state: RootState) => state.themeReducer);
    const [tokenChecked, setTokenChecked] = useState(false);
    const colorScheme = useColorScheme();
    const checkUserToken = async () => {
        try {
            let dateNow = new Date();
            // if (userToken) {
            //     const decoded: any = jwt_decode(userToken);
            //     if (decoded.exp * 1000 < dateNow.getTime()) {
            //         dispatch(resetState());
            //     }
            // }
            console.log('colorScheme',colorScheme);
            console.log('darkTheme:',darkTheme);
            checkTheme = await AsyncStorage.getItem("storeThemeSettings");
            if (checkTheme != null) {
                if (checkTheme === "true") {
                    dispatch(setTheme(true));
                } else {
                    dispatch(setTheme(false));
                }
            } else {
                const colorScheme = Appearance.getColorScheme();
                if(colorScheme !== 'light'){
                    dispatch(setTheme(true));
                }else {
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
            backgroundColor={darkTheme ? defaultColors.black : defaultColors.whiteGrey}
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
