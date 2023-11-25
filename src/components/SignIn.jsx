import * as React from "react";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@fluentui/react-components";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { DefaultButton } from '@fluentui/react/lib/Button';
import "./SignIn.css";

const SignIn = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  return (
    <div className="signin-card">
      <div>
        <Card style={{borderRadius:"0%", height:"280px"}}>
          <CardHeader style={{fontSize:"28px",color:"#055d84", paddingLeft:"20px", marginBottom:"-18px",marginTop:"-5px"}} header={<p>ENSAR PORTAL</p>} />
          <div className="signin-icon">
            <div className="svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
                className="ep-signin-icon"
                style={{display:"block", height:"17px", width:"22px"}}
              >
                <path d="M749 403l557 557-557 557-90-90 402-403H0V896h1061L659 493l90-90zM1152 0h512v1920h-512v-128h384V128h-384V0z"></path>
              </svg>
            </div>
            <div style={{paddingLeft:"10px", fontSize:"17px",textAlign:"left"}}>
              <p>Sign in using a Microsoft account to start using the Ensar Portal.</p>
            </div>
          </div>
          <CardFooter>
          <div style={{paddingLeft:"20px",marginBottom:"20px", marginTop:"5px"}} className="button-sign">
          <DefaultButton  onClick={handleLogin}>Sign in</DefaultButton>
          </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
