import env from "@/env";
import useAuthStore from "@/stores/authStore";
import axios from "axios";

const http = axios.create({
    baseURL: env.API_URL,
    timeout: 10000,
});

http.interceptors.request.use(
    function (config) {
        const token = useAuthStore.getState().token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default http;
