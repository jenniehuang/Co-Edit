import React, { useState, useEffect } from "react";
import google from "../../images/Google.svg";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../../redux/auth/authSlice";

const Login = ({ switchHandler }) => {
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
          placeholder="email"
          onChange={onChange}
        />
        <input
          className="w-full h-10 rounded-lg border-2 border-gray-200 p-2"
          type="password"
          name="password"
          placeholder="password"
          onChange={onChange}
        />
        <button
          className="w-full h-10 bg-gray-500 rounded-lg"
          onClick={loginHandler}
        >
          login
        </button>
        {/* <a href="http://localhost:8080/api/auth/google">
          <div className="google">
            <img src={google} alt="" />
            Login with google
          </div>
        </a> */}

        <div className="text-xl mb-3" onClick={switchHandler}>
          Don't have an account? Sign Up now!
        </div>
      </form>
    </div>
  );
};

export default Login;
