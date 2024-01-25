import { useMsal } from "@azure/msal-react";
import React, { useEffect, useState } from "react";
import { loginRequest } from "../../../core/settings/auth-config";
import { callMsGraph } from "../../../core/settings/graph";
import "../../../../assets/styles/profile.scss";
import { Button, Spinner } from "@fluentui/react-components";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../common/breadcrumbs";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setGraphData, setIsLoading } from '../actions/profile-slice';


const Profile = () => {
  const { instance, accounts } = useMsal();
  const dispatch = useDispatch();
  const { graphData, isLoading } = useSelector((state) => state.profile);
  const { t, i18n } = useTranslation();

  const requestProfileData = async () => {
    if (accounts.length > 0) {
      try {
        const response = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] });
        const profileData = await callMsGraph(response.accessToken);
        dispatch(setGraphData(profileData));
        localStorage.setItem("accessToken", response.accessToken);
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    }
  };

  useEffect(() => {
    dispatch(setIsLoading(true));
    requestProfileData();
  }, [accounts, dispatch]);

  return (
    <div>
      <div className="profile-head">
        <Breadcrumbs />
        <div className="language-toggle">
        <Button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}>
          {i18n.language === 'en' ? 'Français' : 'English'}
        </Button>
      </div>
      </div>
      <hr className="horizontal-line"></hr>
      {isLoading ? (
        <Spinner label={t('loading')} />
      ) : (
        <>
          <div className="profile-body">
            <div>
              <p>{t('firstName')} </p>
              <b> {graphData?.givenName || "-"} </b>

              <p>{t('email')} </p>
              <b> {graphData?.userPrincipalName || "-"} </b>
            </div>
            <div className="profile-second">
              <p>{t('lastName')} </p>
              <b> {graphData?.surname || "-"}</b>

              <p>{t('jobTitle')} </p>
              <b> {graphData?.jobTitle || "-"} </b>
            </div>
          </div>
          <div className="profile-btn">
            <Link to="/todos">
              <Button>{t('back')}</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;






