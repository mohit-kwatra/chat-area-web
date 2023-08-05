import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [{ chatID }] = useContext(ChatContext);

  useEffect(() => {
    const getMessages = () => {
      const docRef = doc(db, "chats", chatID);
      const unsub = onSnapshot(docRef, (docSnapshot) => {
        docSnapshot.exists() && setMessages(docSnapshot.data().messages);
      });

      return () => {
        unsub();
      };
    };
    chatID && getMessages();
  }, [chatID]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
}

export default Messages;
