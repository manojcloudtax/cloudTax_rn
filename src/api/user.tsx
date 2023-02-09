import shoebox from "./shoebox";
import { requestRefreshToken } from "../api/auth";
import store from "../store";
import { login, resetState } from "../store/authSlice";
import { Alert } from "react-native";
import { setOnBoarding } from "../store/onBoardingSlice";

export const getUser = (userToken: string) => shoebox.get("/user/current", {
    headers: {
        Authorization: `Bearer ${userToken}`,
    }
}).then((res) => {
    return res.data;
}).catch(err => {
    console.log("Get User", err.message);
});

export const refreshUserToken = async (err: any, userToken: string, refreshToken: string, callback: (newToken: string, newRefreshToken: string) => any) => {
    if (err.response.status === 401) {
        try {
            const refreshResponse = await requestRefreshToken(refreshToken);
            store.dispatch(login(refreshResponse.data));
            callback(refreshResponse.data.token, refreshResponse.data.refresh);
        } catch (err) {
            Alert.alert(
                "Token expired.",
                "Authentication token expired, please sign in again.",
                [
                    {
                        text: "confirm",
                        onPress: () => {
                            store.dispatch(resetState());
                            store.dispatch(setOnBoarding(false));
                        },
                    }
                ]
            );
        }
    } else {
        throw err;
    }
    console.log("From Categories", err.message);
}
