import { useState } from "react";
import ReactDOM from "react-dom";
import UserCard from "./UserCard";

const OnlineList = ({ isOnlineList, docUsers, hostEmail, currentUser }) => {
  const [user, setUser] = useState(null);

  if (!isOnlineList || !currentUser) return null;
  return ReactDOM.createPortal(
    <>
      <UserCard setUser={setUser} user={user} />
      <div className="fixed w-96 h-3/4 bg-white bg-opacity-80 bottom-14 right-10 rounded-2xl shadow-2xl overflow-y-auto overflow-x-hidden m-4">
        <div className=" flex flex-col justify-center items-center mt-4 ">
          {docUsers.map((v) => (
            <div
              onClick={() => {
                setUser(v.userId);
              }}
              key={v.userEmail}
              className=" cursor-pointer w-11/12 flex flex-row  items-center p-2 hover:font-bold hover:bg-slate-300 mx-2 rounded-2xl"
            >
              <img
                className="w-10 h-10 rounded-full border"
                src={v.image}
                alt=""
              />
              <div
                className={`  text-lg ml-6 ${
                  v.userEmail === currentUser ? "text-sky-700" : "text-black"
                }`}
              >
                {v.username}
              </div>
              {hostEmail === v.userEmail && <div className="ml-2">👑</div>}
            </div>
          ))}
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default OnlineList;
