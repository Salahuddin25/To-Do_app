import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.scss";
import App from "./app";

import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import reportWebVitals from "./reportWebVitals";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./app/core/settings/auth-config";
import i18n from './app/pages/profile/translations/i18n'
import { I18nextProvider } from "react-i18next";
import { Provider } from 'react-redux';
import { store } from './redux/store';

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <MsalProvider instance={msalInstance}>
      <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
        </I18nextProvider>
        </Provider>
      </MsalProvider>
    </FluentProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
