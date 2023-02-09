import axios from "axios";

const instance = axios.create({
    baseURL: "https://shoebox-dev-3yoh3ih4aa-uc.a.run.app/api"
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
