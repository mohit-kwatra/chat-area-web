import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import LoadingGIF from "../images/loading4.gif";
import Redirect from "../components/Redirect";

function Login() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target[0].value;
    const pass = event.target[1].value;

    if (email.trim() === "" || pass.trim() === "") {
      setError("Both fields are required.");
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        setIsLoading(false);
        setCurrentUser(userCredential.user);
      })
      .catch((error) => {
        event.target.reset();
        setError("Something went wrong,\nPlease try again later.");
        setIsLoading(false);
      });
  };

  return (
    <div className="form__container">
      <div className="form__wrapper">
        {currentUser?.uid ? (
          <Redirect title="Already Logged In" />
        ) : (
          <>
            <span className="logo">Chat Area</span>
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button className={isLoading ? "loading" : ""}>
                {" "}
                {isLoading ? <img src={LoadingGIF} alt="" /> : "Login"}{" "}
              </button>
            </form>
            {error && <span className="errMsg">{error}</span>}
            <p style={error ? { marginTop: 0 } : { marginTop: "0.75rem" }}>
              You don't have an account? <Link to={"/register"}>Register</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
