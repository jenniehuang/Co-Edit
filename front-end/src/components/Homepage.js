import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Loading from "./Loading";
import Nav from "./Nav";
import meeting from "../images/meeting.png";
import miro from "../images/miro.png";
import mobile from "../images/mobile.png";
import secure from "../images/secure.png";
import exportImg from "../images/export.png";
import github from "../images/github.png";
import linkedin from "../images/linkedin.png";
import res from "../images/res.png";
import exportPDF from "../images/exportPDF.png";
import curs from "../images/curs.png";
import privacy from "../images/privacy.gif";

import { useTranslation } from "react-i18next";

const Homepage = () => {
  const [loginMode, setLoginMode] = useState(true);
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const image = searchParams.get("image");
    const id = searchParams.get("id");
    const background = searchParams.get("bg");
    if (token && name && email && image) {
      const obj = {
        token: token,
        name,
        email,
        image,
        id,
        background,
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
        <Nav CN={`lg:px-40 bg-white text-black border-b border-primary`} />
        {/*  */}
        <div className=" outer mt-32  md:mt-0">
          <div className="md:w-1/2 innerT ">
            <p className="topP1 md:text-6xl "> {t("welcomeSlogan")}</p>
            <p className="topP2 ">{t("slogan2")}</p>
          </div>

          <div className="md:w-1/2 innerB md:mt-16 ">
            <img src={meeting} alt="" />
            <div className=" bg-white m-8 right-0 rounded-md shadow-xl ">
              <div className="p-4 text-4xl">{t("joinUs")}</div>
              {loginMode && <Login switchHandler={switchHandler} />}
              {!loginMode && <Signup switchHandler={switchHandler} />}
            </div>
          </div>
        </div>
        {/*  */}
        <div className="outer mt-28">
          <div className="innerT">
            <img src={miro} alt="" className="topImg" />
            <p className="topP1">{t("teamUp1")} </p>
            <p className="topP2">{t("teamUp2")}</p>
          </div>

          <div className="innerB">
            <img src={curs} alt="" className="bottomImg" />
          </div>
        </div>
        {/*  */}
        <div className="outer mt-28">
          <div className="innerT">
            <img src={mobile} alt="" className="topImg" />
            <p className="topP1"> {t("update1")}</p>
            <p className="topP2">{t("update2")}</p>
          </div>

          <div className="innerB">
            <img src={res} alt="" className="bottomImg" />
          </div>
        </div>
        {/*  */}
        <div className="outer mt-28 ">
          <div className="innerT">
            <img src={secure} alt="" className="topImg" />
            <p className="topP1"> {t("privacy1")}</p>
            <p className="topP2">{t("privacy2")}</p>
          </div>

          <div className="innerB">
            <img src={privacy} alt="" className="bottomImg" />
          </div>
        </div>
        {/*  */}
        <div className="outer mt-28">
          <div className="innerT">
            <img src={exportImg} alt="" className="topImg" />
            <p className="topP1">{t("pdf1")} </p>
            <p className="topP2">{t("pdf2")}</p>
          </div>

          <div className="innerB">
            <img src={exportPDF} alt="" className="bottomImg" />
          </div>
        </div>
        {/*  */}
        <footer className=" mt-20 w-full border-t border-primary ">
          <div className="px-4 lg:px-40 py-4 flex justify-between items-center">
            <p className="">©2023 jennieHuang</p>
            <div className="flex flex-row">
              <a href="https://github.com/jenniehuang">
                <img className="w-8 cursor-pointer" src={github} alt="" />
              </a>
              <a href="https://www.linkedin.com/in/yu-ting-huang-643453143/">
                <img
                  className="w-8 ml-4 cursor-pointer"
                  src={linkedin}
                  alt=""
                />
              </a>
            </div>
          </div>
        </footer>
      </>
    </div>
  );
};

export default Homepage;
