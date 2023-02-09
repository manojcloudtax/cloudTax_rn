import axios from "axios";

const auth = axios.create({
    baseURL: "https://shoebox-dev-3yoh3ih4aa-uc.a.run.app/api/auth"
});

export const registerUser = (postData: { name: string, email: string, password: string }) =>
    auth.post("/register", postData).then((res) => {
        return res.data;
    });

export const loginUser = (postData: { email: string, password: string }) => auth.post("/login", postData).then((res) => {
    return res.data;
});

export const requestRefreshToken = (refresh: string) => auth.post("/refresh-token", {refresh});

export default auth;
