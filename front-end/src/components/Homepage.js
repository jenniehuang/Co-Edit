import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Loading from "./Loading";
import Nav from "./Nav";
import bg from "../images/bg.jpg";

import { useTranslation } from "react-i18next";

const Homepage = () => {
  const [loginMode, setLoginMode] = useState(true);
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isBgLoaded, setIsBgLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const image = searchParams.get("image");
    const id = searchParams.get("id");
    if (token && name && email && image) {
      const obj = {
        token: token,
        name,
        email,
        image,
        id,
      };
      localStorage.setItem("user", JSON.stringify(obj));
      setIsLoading(false);
      window.location.reload();
    } else {
      setIsLoading(false);
      return;
    }
  }, []);

  const switchHandler = () => {
    setLoginMode(!loginMode);
  };

  const { t } = useTranslation();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="font-serif ">
      <img
        onLoad={(e) => {
          if (e.type === "load") {
            setTimeout(() => {
              setIsBgLoaded(true);
            }, 1000);
          }
        }}
        className=" absolute -z-10 h-screen w-screen object-cover"
        src={bg}
        alt=""
      />
      {isBgLoaded && (
        <>
          <Nav />
          <div className="w-full flex flex-row items-center">
            <div className=" md:w-1/2 "></div>

            <div className="w-full md:w-1/2  backdrop-filter backdrop-blur-md rounded-md mt-5 ">
              <div className=" leading-10 text-white text-5xl m-8 md:text-4xl lg:text-6xl xl:text-8xl  ">
                {t("welcomeSlogan")}
              </div>
              <div className=" bg-white m-8 right-0 rounded-md ">
                <div className="p-4 text-4xl">{t("joinUs")}</div>
                {loginMode && <Login switchHandler={switchHandler} />}
                {!loginMode && <Signup switchHandler={switchHandler} />}
              </div>
            </div>
          </div>
        </>
      )}
      {!isBgLoaded && (
        <div className="fixed top-1/2 translate-x-1/2 -translate-y-1/2 right-1/2 flex flex-row text-5xl">
          Loading...
          <svg
            className="animate-spin h-10 w-10 mr-3 bg-slate-900"
            viewBox="0 0 24 24"
          ></svg>
        </div>
      )}
    </div>
  );
};

export default Homepage;
