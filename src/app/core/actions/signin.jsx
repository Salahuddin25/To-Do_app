import * as React from "react";
import { Card, CardFooter, CardHeader } from "@fluentui/react-components";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../settings/auth-config";
import { DefaultButton } from "@fluentui/react/lib/Button";
import "../../../assets/styles/signin.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(event, "1234");
      console.error(e);
    });
  };

  useEffect(() => {
    if (accounts.length > 0) {
      navigate("/authenticate");
      localStorage.setItem("signinToken", accounts?.[0]?.idToken);
      localStorage.setItem("signinIdToken", accounts[0].idToken);
      localStorage.setItem("signinUserName", accounts[0].name);
      localStorage.setItem("signinUserEmail", accounts[0].username);
    }
  }, [accounts, navigate]);

  return (
    <div className="signin-card">
      <div>
        <Card>
          <div className="cardhead">
            <CardHeader header={<p>ENSAR PORTAL</p>} />
          </div>
          <div className="signin-icon">
            <div className="svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
                className="ep-signin-icon"
              >
                <path d="M749 403l557 557-557 557-90-90 402-403H0V896h1061L659 493l90-90zM1152 0h512v1920h-512v-128h384V128h-384V0z"></path>
              </svg>
            </div>
            <div className="signin-text">
              Sign in using a Microsoft account to start using the Ensar Portal.
            </div>
          </div>
          <CardFooter>
            <div
              className="button-sign"
            >
              <DefaultButton onClick={handleLogin}>Sign in</DefaultButton>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
