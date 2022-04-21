import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Loading from "./Loading";
import Nav from "./Nav";
import bg from "../images/bg.jpg";
import hp1 from "../images/hp1.png";

import { useTranslation } from "react-i18next";

const Homepage = () => {
  const [loginMode, setLoginMode] = useState(true);
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  // const [isBgLoaded, setIsBgLoaded] = useState(false);

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
      <>
        <Nav CN={`lg:px-40 bg-white text-black`} />
        <div className=" lg:px-40 w-full flex flex-col md:flex-row items-center mt-16">
          <div className="w-full md:w-1/2 leading-10 text-5xl m-8 md:text-4xl lg:text-6xl xl:text-8xl  ">
            {t("welcomeSlogan")}
          </div>

          <div className="w-full md:w-1/2  rounded-md  ">
            123
            <div className=" bg-white m-8 right-0 rounded-md shadow-xl ">
              <div className="p-4 text-4xl">{t("joinUs")}</div>
              {loginMode && <Login switchHandler={switchHandler} />}
              {!loginMode && <Signup switchHandler={switchHandler} />}
            </div>
          </div>
        </div>
        <div className=" lg:px-40 w-full flex flex-col md:flex-row items-center mt-16 border-b border-black">
          <div className="w-full md:w-1/3 leading-10 text-5xl m-8 md:text-4xl lg:text-6xl   ">
            Team up without the chaos
          </div>

          <div className="w-full md:w-1/2  rounded-md ">
            <img src={hp1} alt="" />
          </div>
        </div>
      </>
    </div>
  );
};

export default Homepage;
