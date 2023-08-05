import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Placeholder from "../images/img.png";

function Navbar() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Chat Area</span>
      <div className="user">
        <img
          src={currentUser.photoURL ? currentUser.photoURL : Placeholder}
          alt=""
        />
        <span>{currentUser.displayName}</span>
        <button
          onClick={() => {
            signOut(auth);
            setCurrentUser({});
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
