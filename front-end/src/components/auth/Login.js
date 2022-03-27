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
    <div className={`login-inner `}>
      <form>
        <input
          type="email"
          name="email"
          placeholder="email"
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={onChange}
        />
        <button onClick={loginHandler}>login</button>
        <a href="http://localhost:8080/api/auth/google">
          <div className="google">
            <img src={google} alt="" />
            Login with google
          </div>
        </a>

        <div className="switch" onClick={switchHandler}>
          Don't have an account? Sign Up now!
        </div>
      </form>
    </div>
  );
};

export default Login;
