import React, { useEffect, useState } from "react";
import DocCard from "./DocCard";
import { useSelector } from "react-redux";

import DocServices from "../../services/doc-services";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";

const Docs = ({ section }) => {
  const { t } = useTranslation();

  let [docArr, setDocArr] = useState([]);
  let [loadCount, setLoadCount] = useState(0);
  let [isLoading, setIsLoading] = useState(true);
  let [isPicsLoaded, setIsPicsLoaded] = useState(false);

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
    <div className="flex flex-row flex-wrap items-center justify-center md:justify-start md:ml-4">
      {docArr.length !== 0 &&
        docArr.map((v) => (
          <DocCard
            key={v.id}
            id={v.id}
            title={v.title}
            host={v.hostName}
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
      {docArr.length === 0 && <div>{t("empty")}</div>}
    </div>
  );
};

export default Docs;
