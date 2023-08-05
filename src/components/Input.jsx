import React, { useContext, useRef, useState } from "react";
import Img from "../images/img.png";
import Attach from "../images/attach.png";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function Input() {
  const [text, setText] = useState("");
  const [Image, setImage] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const [{ user, chatID }] = useContext(ChatContext);

  const buttonRef = useRef();

  const handleClick = () => {
    if (text.trim() === "" && Image === null) return;

    if (Image) {
      const storageRef = ref(storage, "uploads/" + uuid());
      const uploadTask = uploadBytesResumable(storageRef, Image);

      uploadTask.on(
        "state_changed",
        () => {},
        () => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const docRef = doc(db, "chats", chatID);
            updateDoc(docRef, {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      const docRef = doc(db, "chats", chatID);
      updateDoc(docRef, {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    updateDoc(doc(db, "userChats", currentUser.uid), {
      [chatID + ".lastMessage"]: {
        text,
      },
      [chatID + ".timestamp"]: serverTimestamp(),
    }).then(() => {
      updateDoc(doc(db, "userChats", user.uid), {
        [chatID + ".lastMessage"]: {
          text,
        },
        [chatID + ".timestamp"]: serverTimestamp(),
      });
    });
    setImage(null);
    setText("");
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      buttonRef.current.click();
    }
  };

  return (
    <div
      className="input"
      style={{ pointerEvents: `${user?.uid ? "all" : "none"}` }}
    >
      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button ref={buttonRef} onClick={handleClick}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Input;
