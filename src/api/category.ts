import shoebox from "./shoebox";
import { refreshUserToken } from "../api/user";

export const requestCategories = (userToken: string, refreshToken: string) => shoebox.get("/category", {
    headers: {
        Authorization: `Bearer ${userToken}`,
    }
})
    .then((res) => {
        return res.data.result;
    }).catch(async err => refreshUserToken(
        err,
        userToken,
        refreshToken,
        (newToken: string, newRefreshToken: string) => requestCategories(newToken, newRefreshToken)));
