import React, { useState } from "react";
import Nav from "../Nav";
import Docs from "./Docs";
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
        <div className="fixed w-60 h-screen bg-primary top-0 z-50 origin-left transition-all ease-out duration-700 flex flex-col items-center">
          <div
            onClick={() => {
              navigate("/");
            }}
            className=" relative flex  item"
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
            <img
              src={user.image}
              alt=""
              className="w-12 h-12 rounded-full border"
            />
            <div className="ml-4">
              <div className=" text-xl">{user.name}</div>
              <div className=" text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/dashboard");
            }}
            className="item"
          >
            ✏ {t("dashboard")}
          </div>
          <a className="item" href="/newdoc" target="_blank">
            <div className="">🗒 {t("create")}</div>
          </a>
          <div
            onClick={() => {
              navigate("/Docs");
            }}
            className="item"
          >
            📒 {t("mine")}
          </div>
          <div
            onClick={() => {
              navigate("/shared");
            }}
            className="item"
          >
            📚 {t("share")}
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
          CN={`bg-gray-600 bg-opacity-50 pr-2`}
        />

        <div className="w-full mt-12">
          <Routes>
            <Route path="/" element={<UserPage isMenuOpen={isMenuOpen} />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="Docs" element={<Docs />} />
            <Route path="shared" element={<Docs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Console;

/*



*/
