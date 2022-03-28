import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <>
      <nav className="flex font-sans bg-black bg-opacity-50">
        <a href="/">
          <div className="text-white text-4xl m-4">Co-Edit</div>
        </a>
        <ul className="nav-list">
          {user ? (
            <>
              <li onClick={logoutHandler}>logout</li>
            </>
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Nav;
