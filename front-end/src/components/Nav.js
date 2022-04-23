import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import arrow from "../images/arrow.png";
import { useState } from "react";

const Nav = ({ setIsMenuOpen, isMenuOpen, CN }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const languages = [
    {
      code: "en",
      name: "English",
      country_code: "🇬🇧",
    },
    {
      code: "tw",
      name: "中文(繁)",
      country_code: "🇹🇼",
    },
  ];

  return (
    <>
      <nav
        className={`${CN} fixed top-0 right-0 z-10  flex flex-row justify-between items-center font-serif ${
          isMenuOpen ? "w-full md:w-[calc(100vw_-_240px)]" : "w-full"
        }`}
      >
        {!user && <div className=" text-4xl m-2 w-48">Co-Edit</div>}
        {user && (
          <div className="flex flex-row items-center ml-4">
            <img
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              src={arrow}
              alt=""
              className={`${
                isMenuOpen ? "hidden" : ""
              } w-6 p-1 hover:bg-primary hover:bg-opacity-30 rounded-md`}
            />
          </div>
        )}
        <div className={`flex flex-row justify-end w-full `}>
          <div className="flex flex-row">
            {languages.map(({ code, name, country_code }) => (
              <button
                onClick={() => {
                  i18n.changeLanguage(code);
                }}
                key={name}
                className="flex flex-col justify-center items-center w-12  "
              >
                <span className="text-2xl">{country_code}</span>
                {/* <span className=" text-white">{name}</span> */}
              </button>
            ))}
          </div>
          <ul className=" text-xl right-0 m-2">
            {user ? (
              <>
                <li
                  className=" text-2xl cursor-pointer"
                  onClick={logoutHandler}
                >
                  {t("logout")}
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Nav;
