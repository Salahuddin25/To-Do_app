import React from "react";
import { SignOutButton } from "../actions/signout-button";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/header.scss";
import { Avatar } from "@fluentui/react-components";

function Header() {
  const navigate = useNavigate();

  const redirectToProfile = () => {
    navigate("/profile");
  };

  const userName = localStorage.getItem("signinUserName");

  return (
    <div className="header">
      <div className="profile-box">
        <div className="avatar">
          <Avatar
            aria-label="Guest"
            name={userName}
            onClick={redirectToProfile}
          />
        </div>
        <div className="profilename">
          <p>Hi, {userName}</p>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

export default Header;
