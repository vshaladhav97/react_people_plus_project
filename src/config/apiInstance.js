import axios from "axios";
import { getTzOffset } from "../utils";
import packageJson from "../../package.json";

const App_DATA = {
  core: window.core,
  APPLICATION: window.application,
};

export const apiInstance = axios.create({
  baseURL: `${App_DATA.core}`,
});

apiInstance.interceptors.request.use((config) => {
  config.headers["app"] = App_DATA.APPLICATION;
  config.headers["Accept"] = "application/json";
  config.headers["Content-Type"] = "application/json";
  config.headers["timezone"] = getTzOffset();
  // config.headers['languageCode'] = localStorage.getItem('langaugeCode')
  config.headers["appVersion"] = packageJson.version;
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = accessToken;
  }
  return config;
});

apiInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      // localStorage.removeItem('email')
      // window.location = '/login'
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);
