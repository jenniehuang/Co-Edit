import React, { useEffect, useState } from "react";
import DocCard from "./DocCard";
import { useSelector } from "react-redux";

import DocServices from "../../services/doc-services";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";

import add from "../../images/add.png";

const Docs = ({ section }) => {
  const { t } = useTranslation();

  const [docArr, setDocArr] = useState([]);
  const [loadCount, setLoadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPicsLoaded, setIsPicsLoaded] = useState(false);

  const path = window.location.pathname;

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    setIsPicsLoaded(false);
    setLoadCount(0);
    const myDoc = async () => {
      try {
        let data;
        if (path === "/Docs") {
          data = (await DocServices.mydoc()).data;
        } else if (path === "/shared") {
          data = (await DocServices.shared()).data;
        } else if (path === "/") {
          if (section === "recentlyChanged") {
            let data1 = (await DocServices.mydoc()).data;
            let data2 = (await DocServices.shared()).data;
            data = [...data1, ...data2].slice();
            data.sort(function (a, b) {
              return b.lastModified.localeCompare(a.lastModified);
            });
            data = data.slice(0, 5);
          }
          if (section === "recentlyOpened") {
            data = (await DocServices.recentlyOpened()).data;
            data.sort(function (a, b) {
              return b.lastOpened.localeCompare(a.lastOpened);
            });
            data = data.slice(0, 5);
          }
        }
        setDocArr(data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    myDoc();
  }, [user, path]);

  useEffect(() => {
    if (loadCount === docArr.length) {
      setTimeout(() => {
        setIsPicsLoaded(true);
      }, 1000);
    }
  }, [loadCount, docArr, path]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`flex flex-row flex-wrap items-center justify-center md:justify-start ${
        docArr.length === 0 ? "" : ""
      } `}
    >
      {docArr.length !== 0 &&
        docArr.map((v) => (
          <DocCard
            key={v._id}
            id={v._id}
            title={v.title}
            host={v.host.name}
            image={v.background}
            lastModified={v.lastModified}
            lastOpened={v.lastOpened}
            setLoadCount={setLoadCount}
            loadCount={loadCount}
            isPicsLoaded={isPicsLoaded}
            path={path}
            section={section}
          />
        ))}
      {docArr.length === 0 && (
        <a
          className="relative cursor-pointer group flex items-center justify-center shadow rounded-md m-4 max-w-sm w-80 h-[272px] border border-black"
          href="/newdoc"
          target="_blank"
        >
          <p className="absolute top-12"> {t("empty")}</p>
          <img
            className="w-16 h-16 opacity-30 group-hover:opacity-100"
            src={add}
            alt=""
          />
        </a>
      )}
    </div>
  );
};

export default Docs;
