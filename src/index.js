import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import cookie from 'cookiejs';

import { AppProvider } from "./context/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  function (config) {

    const tokenString = cookie.get("admin");
    if (tokenString) {
      const token = tokenString;
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    }
    // console.log(token);

    // console.log(config);
    return config;
  },
  function (error) {
    if (error) {
      if (error.response.data.message === "Please login." ||error.response.data.error.statusCode === 401) {
        cookie.remove("admin");

        window.location.href = "/login";
      }
    }
    // console.log(error?.response?.data?.message);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error) {
      if (error.response.data.message === "Please login." ||error.response.data.error.statusCode === 401) {
        cookie.remove("admin");

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
