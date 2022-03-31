import React, { useState } from "react";
import Nav from "../Nav";
import Mydocs from "./Mydocs";
import Shared from "./Shared";
import { useTranslation } from "react-i18next";

const Console = () => {
  const { t } = useTranslation();

  let [myDoc, setMyDoc] = useState(true);

  return (
    <>
      <Nav />
      <div className="w-full mt-3 flex flex-col md:flex-row font-serif">
        <div className=" flex flex-row w-full md:block md:w-1/6 md:ml-4">
          <a className=" item" href="/newdoc" target="_blank">
            <div className="m-2">📝</div>
            {t("create")}
          </a>
          {/*  */}
          <div
            onClick={() => {
              setMyDoc(true);
            }}
            className=" item "
          >
            <div className="m-2">📒</div>
            {t("mine")}
          </div>
          {/*  */}
          <div
            onClick={() => {
              setMyDoc(false);
            }}
            className="item"
          >
            <div className=" m-2">📚</div>
            {t("share")}
          </div>
        </div>
        <div className="w-full md:ml-12">
          {myDoc && <Mydocs />}
          {!myDoc && <Shared />}
        </div>
      </div>
    </>
  );
};

export default Console;
