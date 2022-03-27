import React, { useState } from "react";
// import "../style/homepage.css";

import typing from "../images/Typing-bro.svg";
import edit from "../images/edit.gif";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Nav from "./Nav";

const Homepage = () => {
  const [loginMode, setLoginMode] = useState(true);

  const switchHandler = () => {
    setLoginMode(!loginMode);
  };

  return (
    <div>
      <Nav />
      <div className="header">
        <img className="typing" src={typing} alt="" />

        <div className="right-box">
          <img className="edit" src={edit} alt="" />

          <div className="auth-container ">
            <div className="join-us">Join us now!</div>
            {loginMode && <Login switchHandler={switchHandler} />}
            {!loginMode && <Signup switchHandler={switchHandler} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
