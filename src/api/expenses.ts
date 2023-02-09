import shoebox from "./shoebox";
import { refreshUserToken } from "../api/user";

export const requestExpenses = (userToken: string, refreshToken: string) => {
    return shoebox.get("/expense/all", {headers: {Authorization: `Bearer ${userToken}`}})
        .then((res) => {
            return res.data.result;
        }).catch(async err => refreshUserToken(
            err,
            userToken,
            refreshToken,
            (newToken: string, newRefreshToken: string) => requestExpenses(newToken, newRefreshToken)));
}

export const saveExpense = (userToken: string, refreshToken: string, postData: any) => {
    return shoebox.post("/expense", postData, {headers: {Authorization: `Bearer ${userToken}`}}).then((res) => {
        return res.data.result;
    }).catch(async err => refreshUserToken(
        err,
        userToken,
        refreshToken,
        (newToken: string, newRefreshToken: string) => saveExpense(newToken, newRefreshToken, postData)));
}

export const deleteExpense = (userToken: string, refreshToken: string, expenseId: string) => {
    return shoebox.delete("/expense/" + `${expenseId}`,
        {headers: {Authorization: `Bearer ${userToken}`}}).then((res) => {
        return res.data.result;
    }).catch(async err => refreshUserToken(
        err,
        userToken,
        refreshToken,
        (newToken: string, newRefreshToken: string) => deleteExpense(newToken, newRefreshToken, expenseId)));
}

export const updateExpense = (userToken: string, refreshToken: string, postData: any) => {
    return shoebox.patch("/expense", postData, {headers: {Authorization: `Bearer ${userToken}`}}).then((res) => {
        return res.data.result;
    }).catch(async err => refreshUserToken(
        err,
        userToken,
        refreshToken,
        (newToken: string, newRefreshToken: string) => updateExpense(newToken, newRefreshToken, postData)));
}
