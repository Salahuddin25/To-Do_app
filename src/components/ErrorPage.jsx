import React from "react";
import "./ErrorPage.css";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <img 
        src="https://static.thenounproject.com/png/1527904-200.png" 
        alt="page not found icon"
        className="error-image"
      />
      <h1 className="error-heading">404 Page not found</h1>
      <p className="error-message">
        The page you are looking for does not exist.
      </p>
    </div>
  );
};

export default ErrorPage;