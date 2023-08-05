import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage } from "../firebase";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import LoadingGIF from "../images/loading4.gif";
import AddAvatar from "../images/addAvatar.png";
import Redirect from "../components/Redirect";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const placeholderURL =
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

  const handleSubmit = (event) => {
    event.preventDefault();

    const displayName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const avatar = event.target[3].files;

    if (
      displayName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      setError("Please fill the required fields.");
      return;
    }

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (avatar.length) {
          const storageRef = ref(storage, "images/" + displayName);
          const uploadTask = uploadBytesResumable(storageRef, avatar[0]);

          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              setError("Something went wrong.");
              setIsLoading(false);
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                updateProfile(userCredential.user, {
                  displayName,
                  photoURL: downloadURL,
                });
                setDoc(doc(db, "users", userCredential.user.uid), {
                  uid: userCredential.user.uid,
                  displayName,
                  email,
                  photoURL: downloadURL,
                });
              });
            }
          );
        } else {
          updateProfile(userCredential.user, {
            displayName,
            photoURL: placeholderURL,
          });
          setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            displayName,
            email,
            photoURL: placeholderURL,
          });
        }
        setDoc(doc(db, "userChats", userCredential.user.uid), {});
        return userCredential;
      })
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
      })
      .catch((error) => {
        setError("Something went wrong.");
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="form__container">
      <div className="form__wrapper">
        {currentUser?.uid ? (
          <Redirect title="Registration Successful" />
        ) : (
          <>
            <span className="logo">Chat Area</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Display Name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <input
                type="file"
                id="avatar"
                style={{ display: "none" }}
                accept="image/*"
              />
              <label htmlFor="avatar">
                <img src={AddAvatar} alt="icon" />
                <span>Add an avatar</span>
              </label>
              <button className={isLoading ? "loading" : ""}>
                {" "}
                {isLoading ? <img src={LoadingGIF} alt="" /> : "Sign Up"}{" "}
              </button>
            </form>
            {error && <span className="errMsg">{error}</span>}
            <p style={error ? { marginTop: 0 } : { marginTop: "0.75rem" }}>
              You do have an account? <Link to={"/login"}>Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
