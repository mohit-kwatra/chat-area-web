import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";

function Chats() {
  const [chats, setChats] = useState({});
  const { currentUser } = useContext(AuthContext);
  const dispatch = useContext(ChatContext)[1];

  useEffect(() => {
    const getChats = () => {
      const docRef = doc(db, "userChats", currentUser.uid);
      const unsub = onSnapshot(docRef, (docSnapshot) => {
        setChats(docSnapshot.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {chats &&
        Object.entries(chats)
          .sort((a, b) => b[1].timestamp - a[1].timestamp)
          .map((chat) => (
            <div
              className="user__chat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={chat[1].userInfo.photoURL} alt="" />
              <div className="chat__info">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          ))}
    </div>
  );
}

export default Chats;
