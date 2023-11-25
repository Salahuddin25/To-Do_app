import React from "react";
import { SignOutButton } from "./SignOutButton";
import './Header.css';

function Header() {
  return (
    <div className="header">
    <div className="logo">
    <img src="	https://ensarsolutions.com/images/ensar/logo.svg" alt="Logo" />
    </div>
      <div className="signout">
        <SignOutButton />
      </div>
    </div>
  );
}

export default Header;
