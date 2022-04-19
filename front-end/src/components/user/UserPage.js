import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Mydocs from "./Mydocs";
import UserServices from "../../services/user-services";

const UserPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [userBg, setUserBg] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState(user.image);
  const { t } = useTranslation();

  const auth = "563492ad6f91700001000001c889c828ca8441f5a53ac461e4dbfa16";
  const url = "https://api.pexels.com/v1/search?query=landscape&per_page=30";

  useEffect(() => {
    const getBackground = async () => {
      const imageRef = ref(storage, `images/${user.id}/background`);
      try {
        let url = await getDownloadURL(imageRef);
        setUserBg(url);
      } catch (e) {
        if (e.code === "storage/object-not-found") {
          fetchBg();
        }
      }
    };

    const fetchBg = async () => {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: auth,
        },
      });
      let data = await response.json();
      let index = Math.floor(Math.random() * 30);
      setUserBg(data.photos[index].src.large2x);
    };

    getBackground();
  }, []);

  const thumbnailHandler = (e) => {
    if (e.target.files[0]) {
      uploadThumbnail(e.target.files[0]);
    }
  };

  const uploadThumbnail = async (file) => {
    const imageRef = ref(storage, `images/${user.id}/thumbnail`);
    try {
      await uploadBytes(imageRef, file);
      let url = await getDownloadURL(imageRef);
      let response = await UserServices.uploadThumbnail(url);
      if (response.status === 200) {
        const user = JSON.parse(localStorage.getItem("user"));
        user.image = url;
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentThumbnail(url);
        toast.success(`${t("uploadSuccess")}`);
      }
    } catch (e) {
      console.log(e);
      toast.error(e);
    }
  };

  const backgroundHandler = (e) => {
    if (e.target.files[0]) {
      uploadBackground(e.target.files[0]);
    }
  };

  const uploadBackground = async (file) => {
    const imageRef = ref(storage, `images/${user.id}/background`);
    try {
      await uploadBytes(imageRef, file);
      let url = await getDownloadURL(imageRef);
      setUserBg(url);
      toast.success(`${t("uploadSuccess")}`);
    } catch (e) {
      console.log(e);
      toast.error(e);
    }
  };

  return (
    <div className=" relative w-full">
      <div
        style={{ backgroundImage: `url(${userBg})` }}
        className=" group relative w-full h-30vh bg-cover bg-center"
      >
        <div className="absolute invisible group-hover:visible cursor-pointer  right-12 bottom-3 z-20 ">
          <div className=" relative bg-primary p-1 rounded cursor-pointer">
            <p className="cursor-pointer text-sm w-full h-full">{t("cover")}</p>
            <label className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer">
              <input
                className=" hidden"
                type="file"
                onChange={backgroundHandler}
              />
            </label>
          </div>
        </div>
      </div>
      <div className=" group flex flex-col justify-center items-center w-24 absolute left-6 top-[calc(30vh_-_36px)]">
        <img
          className=" rounded-full border-2 border-white"
          src={currentThumbnail}
          alt=""
        />

        <div className=" relative rounded-md bg-primary p-1 my-1 text-sm invisible group-hover:visible cursor-pointer">
          <p className="cursor-pointer">{t("thumbnail")}</p>
          <label className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer">
            <input
              className="hidden "
              type="file"
              onChange={thumbnailHandler}
            />
          </label>
        </div>
      </div>
      <div className="absolute top-[calc(30vh_+_10px)] left-32 text-4xl">
        {user.name}
      </div>
      <div className=" mt-20 ">
        <div className="ml-8 text-2xl text-gray-600">
          {t("recentlyChanged")}
        </div>
        <Mydocs section={"recentlyChanged"} />
      </div>
      <div className=" mt-8 ">
        <div className="ml-8 text-2xl text-gray-600">{t("recentlyOpened")}</div>
        <Mydocs section={"recentlyOpened"} />
      </div>
    </div>
  );
};

export default UserPage;
