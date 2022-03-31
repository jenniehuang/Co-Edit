import React, { useEffect, useState } from "react";
import DocCard from "./DocCard";
import { useSelector } from "react-redux";

import DocServices from "../../services/doc-services";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";

const Shared = () => {
  const { t } = useTranslation();

  let [docArr, setDocArr] = useState([]);
  let [isLoading, setIsLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const shared = async () => {
      try {
        let data = await DocServices.shared();
        setDocArr(data.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    shared();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-row flex-wrap">
      {docArr.length !== 0 &&
        docArr.map((v) => (
          <DocCard key={v.id} id={v.id} title={v.title} host={v.hostName} />
        ))}
      {docArr.length === 0 && <div>{t("empty")}</div>}
    </div>
  );
};

export default Shared;
