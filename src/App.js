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

function App() {
  // track if user is logged in
  const [loggedIn, setLoggedIn] = useState(false);
  // check to see if there is any loading...
  const [loading, setLoading] = useState(true);
  // state user information in state
  const [userInformation, setUserInformation] = useState({});
  const [appInitialized, setAppInitialized] = useState(false);
  // error
  const [errors, setErrors] = useState();


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
      setUserInformation({});
      setLoggedIn(false);
      setErrors();
  })
    .catch((error) => {
      console.warn(error)
      setErrors(error.errorMessage);
  });
}

  if (loading || !appInitialized ) return null;

  return (
    <>
    <Header logout={logout} loggedIn={loggedIn} />
    {errors && <p className="Error">{errors}</p>}

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
                  setErrors={setErrors}
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
                  setErrors={setErrors}
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
