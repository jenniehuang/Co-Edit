import React, { useState } from "react";
import Nav from "../Nav";
import Mydocs from "./Mydocs";
import UserPage from "./UserPage";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import left from "../../images/left.png";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const Console = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="flex flex-row w-full h-screen overflow-x-hidden">
      {isMenuOpen && (
        <div className="fixed w-60 h-screen bg-primary top-0 z-50 origin-left transition duration-500 ease-in-out">
          <div
            onClick={() => {
              navigate("/");
            }}
            className=" relative flex items-center item"
          >
            <img
              onClick={(e) => {
                setIsMenuOpen(false);
                e.stopPropagation();
              }}
              src={left}
              alt=""
              className="absolute w-6 right-3 hover:bg-primary hover:bg-opacity-60 rounded-md"
            />
            <img src={user.image} alt="" className="w-6 rounded border" />
            <div className=" text-sm ml-4">{user.name}</div>
          </div>
          <div
            onClick={() => {
              navigate("/dashboard");
            }}
            className="item"
          >
            ✏{t("dashboard")}
          </div>
          <a href="/newdoc" target="_blank">
            <div className="item">🗒{t("create")}</div>
          </a>
          <div
            onClick={() => {
              navigate("/mydocs");
            }}
            className="item"
          >
            📒{t("mine")}
          </div>
          <div
            onClick={() => {
              navigate("/shared");
            }}
            className="item"
          >
            📚{t("share")}
          </div>
        </div>
      )}
      <div
        className={`  ${
          isMenuOpen
            ? "w-full md:w-[calc(100%_-_240px)] md:relative md:left-60"
            : "w-full"
        } `}
      >
        <Nav
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
          setIsShown={setIsShown}
        />

        <div className="w-full mt-12">
          <Routes>
            <Route path="/" element={<UserPage isMenuOpen={isMenuOpen} />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="mydocs" element={<Mydocs />} />
            <Route path="shared" element={<Mydocs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Console;

/*



*/
