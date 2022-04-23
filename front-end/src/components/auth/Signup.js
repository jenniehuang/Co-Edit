import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup, reset } from "../../redux/auth/authSlice";
import { useTranslation } from "react-i18next";

const Signup = ({ switchHandler }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isErr, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isErr) {
      toast.error(message);
    }
    if (isSuccess || user) {
      toast.success(message);
      navigate("/");
      switchHandler();
    }

    dispatch(reset());
  }, [user, isErr, isSuccess, message, navigate, dispatch, switchHandler]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    };

    dispatch(signup(userData));
  };

  return (
    <div className="">
      <form
        className="grid grid-rows-3 gap-3 items-center px-8"
        onSubmit={onSubmit}
      >
        <input
          className="w-full h-10 rounded-lg border-2 border-gray-200 p-2"
          type="text"
          placeholder={t("name")}
          name="name"
          value={name}
          onChange={onChange}
        />
        <input
          className="w-full h-10 rounded-lg border-2 border-gray-200 p-2"
          type="email"
          placeholder={t("email")}
          name="email"
          value={email}
          onChange={onChange}
        />
        <input
          className="w-full h-10 rounded-lg border-2 border-gray-200 p-2"
          type="password"
          placeholder={t("password")}
          name="password"
          value={password}
          onChange={onChange}
        />
        <button className="w-full h-10 bg-white border border-black rounded-lg">
          {t("signUp")}
        </button>
        <div className="text-xl mb-3 cursor-pointer" onClick={switchHandler}>
          {t("toLogin")}
        </div>
      </form>
      <img src="" alt="" />
    </div>
  );
};

export default Signup;
