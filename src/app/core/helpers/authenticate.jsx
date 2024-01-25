import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

function Authenticate() {
  const { instance, accounts, inProgress } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (inProgress === "none") {
      if (accounts.length === 0) {
        navigate("/signin");
      } else {
        navigate("/todos");
      }
    }
  }, [accounts, instance, navigate, inProgress]);

  return (
    <div>
      {inProgress === "startup" ? "Initializing authentication..." : "Authenticating..."}
    </div>
  );
}

export default Authenticate;