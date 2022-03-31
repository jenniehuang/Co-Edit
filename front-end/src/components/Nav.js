import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const Nav = () => {
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
      <nav className=" w-screen flex flex-row justify-between items-center font-serif bg-black bg-opacity-50">
        <a href="/">
          <div className="text-white text-4xl m-4">Co-Edit</div>
        </a>
        <div className="flex flex-row">
          <div className="flex flex-row">
            {languages.map(({ code, name, country_code }) => (
              <button
                onClick={() => {
                  i18n.changeLanguage(code);
                }}
                key={name}
                className="flex flex-col justify-center items-center mx-4 w-16 "
              >
                <span className="text-2xl">{country_code}</span>
                <span className=" text-white">{name}</span>
              </button>
            ))}
          </div>
          <ul className=" text-xl right-0 m-4">
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
