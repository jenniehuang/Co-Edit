import { useSelector, useDispatch } from "react-redux";
import { reset } from "../../redux/auth/authSlice";

import { useTranslation } from "react-i18next";
import Docs from "./Docs";
import { useEffect } from "react";
import add from "../../images/add.png";

const UserPage = () => {
  const { user } = useSelector((state) => state.auth);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reset());
  }, []);

  return (
    <div className=" relative w-full">
      <div
        style={{ backgroundImage: `url(${user.background})` }}
        className=" group relative w-full h-30vh bg-cover bg-center"
      ></div>
      <div className=" group flex flex-col justify-center items-center w-24 absolute left-6 top-[calc(30vh_-_36px)]">
        <img
          referrerPolicy="no-referrer"
          className=" rounded-full border-2 w-24 h-24 border-white"
          src={user.image}
          alt=""
        />
      </div>
      <div className="absolute top-[calc(30vh_+_10px)] left-32 text-4xl">
        {user.name}
      </div>
      <div className=" mt-20  ">
        <div className="ml-8 text-2xl text-gray-600">
          {t("recentlyChanged")}
        </div>
        <div className="flex flex-row items-center md:ml-4">
          <div className="flex items-center justify-center cursor-pointer relative group w-80 rounded m-4 shadow-md text-black hover:border h-[296px]">
            <a className="w-1/5" href="/newdoc" target="_blank">
              <img className="" src={add} alt="" />
            </a>
          </div>
          <Docs section={"recentlyChanged"} />
        </div>
      </div>
      <div className=" mt-8 ">
        <div className="ml-8 text-2xl text-gray-600">{t("recentlyOpened")}</div>
        <div className=" md:ml-4">
          <Docs section={"recentlyOpened"} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
