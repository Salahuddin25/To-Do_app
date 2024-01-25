import React from "react";
import { useMsal } from "@azure/msal-react";
import { Link } from "@fluentui/react";

/**
 * Renders a sign out button that always uses redirect
 */
export const SignOutButton = () => {
  const { instance, accounts } = useMsal();

  const handleLogout = (e) => {
    e.preventDefault();
    
    if (accounts.length > 0) {
      instance.logoutRedirect();
    } else {
      console.warn("No signed-in user to log out");
    }
    localStorage.clear();
  };
  
  return (
    <Link onClick={handleLogout}>Sign Out</Link>
  );
};

