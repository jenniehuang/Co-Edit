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
        <button className="w-full h-10 bg-gray-500 rounded-lg">
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

//https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_BoFQRccHG605X98ZsIF4u5rwiiuiR4E
/*

const signupHandler = (e) => {
    e.preventDefault();
    //check .....
    // const enteredName = inputNameRef.current.value;
    const enteredEmail = inputEmailRef.current.value;
    const enteredPassword = inputPasswordRef.current.value;
    setIsLoading(true);
    async function postRequest() {
      let response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_BoFQRccHG605X98ZsIF4u5rwiiuiR4E",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: { "Content-Type": "application" },
        }
      );

      if (response.ok) {
        setIsLoading(false);
        console.log("ok");
      } else {
        setIsLoading(false);

        let errMessage = "Oops... something went wrong ><";
        const data = await response.json();
        if (data && data.error && data.error.message) {
          errMessage = data.error.message;
        }
      }
    }
  };

*/
