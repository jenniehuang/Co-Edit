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
    <div className="bg-homepage bg-cover h-screen">
      <Nav />
      <div className="w-full flex flex-row ">
        <div className="w-1/2">left</div>

        <div className="w-1/2 backdrop-filter backdrop-blur-md rounded-md m-4 ">
          <div className="text-white text-8xl m-8  ">
            Edit documents with your friends in real time!
          </div>

          {/* <img className="edit" src={edit} alt="" /> */}

          <div className=" bg-white  m-12 right-0 rounded-md ">
            <div className="p-4 text-4xl">Join us now!</div>
            {loginMode && <Login switchHandler={switchHandler} />}
            {!loginMode && <Signup switchHandler={switchHandler} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
