import React, { useEffect, useRef, useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { DateTime } from "luxon";

TimeAgo.addDefaultLocale(en);

const DocCard = ({
  title,
  host,
  id,
  image,
  setLoadCount,
  loadCount,
  isPicsLoaded,
  lastModified,
  lastOpened,
  path,
  section,
}) => {
  const [docBg, setDocBg] = useState("");
  const iEl = useRef();
  const aEl = useRef();
  const { t } = useTranslation();

  const now = DateTime.utc();
  const modifiedInterval = now - new Date(lastModified).getTime();
  const openedInterval = now - new Date(lastOpened).getTime();

  const timeAgo = new TimeAgo("en-US");

  useEffect(() => {
    const getBackground = async () => {
      const imageRef = ref(storage, `docImages/${id}/background`);
      try {
        let url = await getDownloadURL(imageRef);
        setDocBg(url);
      } catch (e) {
        if (e.code === "storage/object-not-found") {
          setDocBg(image);
        }
      }
    };

    getBackground();
  }, []);

  const backgroundHandler = (e) => {
    e.stopPropagation();

    if (e.target.files[0]) {
      uploadBackground(e.target.files[0]);
    }
  };

  const uploadBackground = async (file) => {
    const imageRef = ref(storage, `docImages/${id}/background`);
    try {
      await uploadBytes(imageRef, file);
      let url = await getDownloadURL(imageRef);
      setDocBg(url);
      toast.success("upload success");
    } catch (e) {
      console.log(e);
      toast.error(e);
    }
  };
  return (
    <a
      className={` cursor-pointer relative group w-80 rounded m-4 shadow-md text-black ${
        isPicsLoaded ? "" : "animate-pulse"
      }`}
      ref={aEl}
      onClick={(e) => {
        if (e.target === iEl.current) {
          aEl.current.href = path;
        } else {
          aEl.current.href = `/documents/${id}`;
        }
      }}
    >
      <div className="invisible group-hover:visible absolute text-sm right-4 top-4 bg-primary p-1 rounded cursor-pointer">
        <p className="">{t("cover")}</p>
        <label className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer">
          <input
            className=" hidden "
            type="file"
            onChange={backgroundHandler}
            ref={iEl}
          />
        </label>
      </div>
      {!isPicsLoaded && (
        <div className=" shadow rounded-md p-4 max-w-sm w-full h-[296px] mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-300 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-300 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-300 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-300 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={isPicsLoaded ? "" : "hidden"}>
        <img
          className="w-full rounded h-52 object-cover"
          src={docBg}
          alt=""
          onLoad={(e) => {
            if (e.type === "load") {
              setLoadCount(loadCount + 1);
            }
          }}
        ></img>
        <div className=" p-2">
          <div className="title">{`📜${title}`}</div>
          <div className="host">{`${t("by")} ${host}`}</div>
          {section === "recentlyChanged" && (
            <div>{`${t("lastModified")} ${timeAgo.format(
              now - modifiedInterval
            )}`}</div>
          )}
          {section === "recentlyOpened" && (
            <div>{`${t("recentlyOpened")} ${timeAgo.format(
              now - openedInterval
            )}`}</div>
          )}
        </div>
      </div>
    </a>
  );
};

export default DocCard;
