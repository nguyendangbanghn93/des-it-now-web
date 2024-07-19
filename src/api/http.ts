import axios from "axios";

const http = axios.create({
  baseURL: "http://157.10.199.201:1338",
  timeout: 1000,
});

http.interceptors.request.use(
  function (config) {
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
