import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import BackImg from "../images/back.png";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="error__page">
      <div className="content">
        <h2>Oops!</h2>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <button className="go__back" onClick={handleClick}>
          <img src={BackImg} alt="" />
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
