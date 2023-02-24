import axios from "axios";

const instance = axios.create({
    baseURL: "https://app.cloudtax.ca/qa/api/2022"
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
