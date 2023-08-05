import React, { useState, useEffect } from "react";
import GreenCheck from "../images/green_check.png";
import { useNavigate } from "react-router-dom";

function Redirect({ title }) {
  const [numb, setNumb] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (numb > 0) {
      setTimeout(() => {
        setNumb(numb - 1);
      }, 1000);
    } else {
      navigate("/");
    }
  }, [numb, navigate]);

  return (
    <div className="redirect__wrapper">
      <img src={GreenCheck} alt="" />
      <h2>{title}</h2>
      <p>Redirecting you in {numb}..</p>
    </div>
  );
}

export default Redirect;
