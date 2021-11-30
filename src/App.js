import React, { useEffect, useState } from "react";
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import './App.css';

// page imports
import Login from "./pages/Login";
import CreateUser from './pages/CreateUser';
import Header from "./components/Header";
import UserProfile from "./pages/UserProfile";
import FirebaseConfig from './components/FirebaseConfig';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react"; // um what.. delete later


function App() {
  // track if user is logged in
  const [loggedIn, setLoggedIn] = useState(false);
  // check to see if there is any loading...
  const [loading, setLoading] = useState(true);
  // state user information in state
  const [userInformation, setUserInformation] = useState({});
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
      // initialize firebase
    initializeApp(FirebaseConfig);
    setAppInitialized(true);
  }, []);

    // Check to see if user is logged in 
    // user loads page, check their status
    // set state accordingly
  useEffect(() => {
    if (appInitialized) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserInformation(user);
          setLoggedIn(true);
        } else {
          setUserInformation({});
          setLoggedIn(false);
        }
        // whenever state changes set loading to false
        setLoading(false);
      });
    }
  }, [appInitialized]);

  
function logout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      setUserInformation({});
      setLoggedIn(false);
  })
    .catch((error) => {
      // An error happened.
      console.warn(error)
  });
}

  if (loading || !appInitialized ) return null;

  return (
    <>
    <Header logout={logout} loggedIn={loggedIn} />
      {/* <p>User {loggedIn ? `IS LOGGED IN` : `IS NOT LOGGED IN`}</p>
      <p>Email {userInformation.email}</p> */} 
      <Router>
        <Routes>
          <Route 
            path='/user/:id' 
            element={
              loggedIn ? (
                <UserProfile userInformation={userInformation} /> 
              ) : (
                <Navigate to="/" /> 
              )
            }
          />
          <Route 
            path='/create'
            element={
              !loggedIn ? (
              <CreateUser 
                setLoggedIn = {setLoggedIn}
                setUserInformation={setUserInformation}
              />
            ) : (
              <Navigate to={`/user/${userInformation.uid}`} />
            )
          } 
          />
          <Route 
            path='/' 
            element={
              !loggedIn ? (
              <Login 
                setLoggedIn = {setLoggedIn}
                setUserInformation={setUserInformation}
              />
            ) : (
              <Navigate to={`/user/${userInformation.uid}`} />
            )
          } 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
