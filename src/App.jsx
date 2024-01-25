import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { initializeIcons } from "@fluentui/react/lib/Icons";

import "./assets/styles/app.scss";

// import Button from "react-bootstrap/Button";
import SignIn from "./app/core/actions/signin";
import PrivateRoute from "./app/layout/private-route";
import Authenticate from "./app/core/helpers/authenticate";
initializeIcons();


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="*" element={<PrivateRoute />} />
      </Routes>
    </Router>
  );
}

export default App;