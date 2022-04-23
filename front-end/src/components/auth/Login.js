import React, { useState, useEffect } from "react";
import google from "../../images/Google.svg";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../../redux/auth/authSlice";
import { useTranslation } from "react-i18next";

const Login = ({ switchHandler }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isErr, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isErr) {
      toast.error(message);
    }

    dispatch(reset());
  }, [user, isErr, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const loginHandler = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div className="">
      <form className="grid grid-rows-3 gap-3 items-center px-8">
        <input
          className="w-full h-10 rounded-lg border-2 border-gray-200 p-2"
          type="email"
          name="email"
          placeholder={t("email")}
          onChange={onChange}
        />
        <input
          className="w-full h-10 rounded-lg border-2 border-gray-200 p-2"
          type="password"
          name="password"
          placeholder={t("password")}
          onChange={onChange}
        />
        <button
          className="w-full h-10 bg-white border border-black rounded-lg"
          onClick={loginHandler}
        >
          {t("login")}
        </button>
        <a
          className="flex flex-row item-center justify-center w-full h-10 bg-white text-black border border-black rounded-lg"
          href={`${process.env.REACT_APP_API_URL_AUTH}/google`}
        >
          <div className="flex flex-row justify-center items-center">
            <img className="mr-2" src={google} alt="" />
            Continue with google
          </div>
        </a>

        <div className="text-xl mb-3 cursor-pointer" onClick={switchHandler}>
          {t("toSignup")}
        </div>
      </form>
    </div>
  );
};

export default Login;
