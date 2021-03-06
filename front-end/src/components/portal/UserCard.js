import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import UserServices from "../../services/user-services";
import { toast } from "react-toastify";

const overlay_style = {
  position: "fixed",
  top: "0",
  bottom: "0",
  right: "0",
  left: "0",
  backgroundColor: "rgba(0,0,0,0.5)",
};
const UserCard = ({ user, setUser }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (!user) return null;

    const getUserInfo = async () => {
      try {
        let response = await UserServices.getUserInfo(user);
        setUserData(response.data);
      } catch (e) {
        console.log(e);
        toast.error("Sorry! Something went wrong.");
      }
    };

    getUserInfo();
  }, [user]);
  if (!user) return null;

  return ReactDOM.createPortal(
    <>
      <div
        onClick={() => {
          setUser(null);
        }}
        style={overlay_style}
      />

      <div className="w-500px fixed top-1/2 translate-x-1/2 -translate-y-1/2 right-1/2  rounded-xl bg-white shadow-md font-serif h-64 ">
        <div
          style={{ backgroundImage: `url(${userData.background})` }}
          className=" relative w-full h-1/3 bg-cover bg-center overflow-hidden rounded-t-xl"
        ></div>
        <div className="flex flex-col justify-center items-center w-24 absolute left-6 top-10">
          <img
            referrerPolicy="no-referrer"
            className=" rounded-full w-24 h-24 border-2 border-white"
            src={userData.thumbnail}
            alt=""
          />
        </div>
        <div className="absolute top-20 left-32 text-4xl">{userData.name}</div>
        {userData.link && (
          <a
            href={userData.link}
            target="_blank"
            className=" text-blue-500 underline text-xl absolute top-[calc(30vh_-_130px)] left-8"
          >
            <div className=" text-lg h-20 overflow-y-auto overflow-x-hidden pr-2">
              {userData.about}
            </div>
          </a>
        )}
        {!userData.link && (
          <div className=" text-xl absolute top-[calc(30vh_-_130px)] left-8 ">
            <div className=" h-full overflow-y-auto overflow-x-hidden">
              {userData.about}
            </div>
          </div>
        )}
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default UserCard;
