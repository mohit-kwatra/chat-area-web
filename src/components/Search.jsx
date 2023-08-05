import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import SearchImg from "../images/search.png";

function Search() {
  const [searchUser, setSearchUser] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const dispatch = useContext(ChatContext)[1];

  const handleClick = () => {
    searchUser.trim() !== "" && handleSearch();
  };

  const handleKey = (event) => {
    event.key === "Enter" && searchUser.trim() !== "" && handleSearch();
  };

  const handleSearch = () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", searchUser));

    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        setUser(null);
        setError(true);
      } else {
        setError(false);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      }
    });
  };

  const handleSelect = (u) => {
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    const docRef = doc(db, "chats", combinedID);

    dispatch({ type: "CHANGE_USER", payload: u });

    getDoc(docRef).then((docSnapshot) => {
      if (!docSnapshot.exists()) {
        setDoc(docRef, { messages: [] }).then(() => {
          const collectionRef = collection(db, "userChats");

          updateDoc(doc(collectionRef, currentUser.uid), {
            [combinedID + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [combinedID + ".timestamp"]: serverTimestamp(),
          }).then(() => {
            updateDoc(doc(collectionRef, user.uid), {
              [combinedID + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              [combinedID + ".timestamp"]: serverTimestamp(),
            }).then(() => {
              setUser(null);
              setSearchUser("");
            });
          });
        });
      } else {
        setSearchUser("");
        setUser(null);
      }
    });
  };

  return (
    <div className="search">
      <div className="search__form">
        <div>
          <input
            type="text"
            placeholder="Find a user"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            onKeyDown={handleKey}
          />
          <button onClick={handleClick}>
            <img src={SearchImg} alt="" />
          </button>
        </div>
        {error && <p>User not found!</p>}
      </div>
      {user && (
        <div className="user__chat" onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt="" />
          <div className="chat__info">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
