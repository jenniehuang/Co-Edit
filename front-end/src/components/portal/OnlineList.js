// import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const OnlineList = ({ isOnlineList, docUsers, hostEmail, currentUser }) => {
  if (!isOnlineList | !currentUser) return null;
  return ReactDOM.createPortal(
    <>
      <div className="fixed w-96 h-3/4 bg-white bg-opacity-80 bottom-14 right-10 rounded-2xl shadow-2xl overflow-y-auto overflow-x-hidden m-4">
        <div className=" flex flex-col justify-center items-center mt-4 ">
          {docUsers.map((v) => (
            <div
              key={v.userEmail}
              className=" w-11/12 flex flex-row  items-center p-2 hover:font-bold hover:bg-slate-300 mx-2 rounded-2xl"
            >
              <img className="w-10 rounded-full border" src={v.image} alt="" />
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
