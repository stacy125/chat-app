import React, { useState, useEffect } from "react";
import Button from "../src/components/Button";
import Channel from "../src/components/Channel";
import Sign from "../src/components/Sign";
import "./App.css";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth";
import "firebase/firestore";

import Filter9Icon from "@material-ui/icons/Filter9";

// TODO -- add a delete and edit button
// DELETE documentation https://firebase.google.com/docs/firestore/manage-data/delete-data

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, [initializing]);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (initializing) return "Loading...";

  return (
    <div className="App">
      {user ? (
        <>
          <div className="header">
            <Filter9Icon fontSize="large" />
            <Button onClick={signOut}>Sign out</Button>
          </div>

          <p className="welcome">Welcome to the chat</p>
          <Channel user={user} db={db} />
        </>
      ) : (
        <div>
          <div className="header">
            <Filter9Icon fontSize="large" />
            <Button onClick={signInWithGoogle}>Sign in with Google</Button>
            {/* <div className="sign">
            </div> */}
          </div>
          <div className="app_main_sign">
            <Sign />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
