import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhEDTsE0maTq4AsOWiT8zi29k9yKDkUhM",
  authDomain: "social-app-34759.firebaseapp.com",
  databaseURL:
    "https://social-app-34759-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "social-app-34759",
  storageBucket: "social-app-34759.appspot.com",
  messagingSenderId: "767768329662",
  appId: "1:767768329662:web:049d57c3ddea5c10070def",
};
initializeApp(firebaseConfig);

// const auth = firebase.auth(); stara verz firebase
// const firestore = firebase.firestore(); stara verzija fierbase-a

const auth = getAuth();
const firestore = getFirestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return <button onClick={signInWithGoogle}>Sign in</button>;
};
const SignOut = () => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign in</button>
  );
};

const ChatRoom = () => {
  const messagesRef = collection(firestore, "messages");

  const [messages, setMessages] = useState([]);

  const getData = () => {
    getDocs(messagesRef).then((snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // () zagrade su return
    });
  };

  useEffect(() => {
    getData();
  }, []);
  const [formValue, setFormValue] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    // uid user id for currently logged user
    // const { uid } = auth.currentUser;

    addDoc(messagesRef, {
      message: formValue,
      id: Math.random() * 1000,
    }).then(() => {
      setFormValue("");
    });
    getData();
  };

  return (
    <>
      <div>
        {messages &&
          messages.map((message) => {
            return <ChatMessage key={message.id} message={message} />;
          })}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">salji</button>
      </form>
    </>
  );
};
const ChatMessage = (props) => {
  const { message, id } = props.message;
  useEffect(() => {
    console.log("evonas");
  }, []);

  const messageClass = id === auth.currentUser.id ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <p>{message}</p>
    </div>
  );
};

export default App;
