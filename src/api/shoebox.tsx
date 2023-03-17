import axios from "axios";
import { Constants } from "../utils/Constants";

const instance = axios.create({
    baseURL: Constants.baseURL
});

instance.interceptors.request.use(
    async (config) => {
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
)

export default instance;
