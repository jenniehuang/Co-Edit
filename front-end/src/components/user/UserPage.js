import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import Docs from "./Docs";

const UserPage = () => {
  const { user } = useSelector((state) => state.auth);

  const { t } = useTranslation();

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
      <div className=" mt-20 ">
        <div className="ml-8 text-2xl text-gray-600">
          {t("recentlyChanged")}
        </div>
        <Docs section={"recentlyChanged"} />
      </div>
      <div className=" mt-8 ">
        <div className="ml-8 text-2xl text-gray-600">{t("recentlyOpened")}</div>
        <Docs section={"recentlyOpened"} />
      </div>
    </div>
  );
};

export default UserPage;
