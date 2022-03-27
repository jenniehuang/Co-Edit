import React, { useEffect, useState } from "react";
import DocCard from "./DocCard";
import { useSelector } from "react-redux";

import DocServices from "../../services/doc-services";
import Loading from "../Loading";

const Shared = () => {
  let [docArr, setDocArr] = useState([]);
  let [isLoading, setIsLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const shared = async () => {
      // let email = user ? user.email : "";

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
    <div className="docs">
      {docArr.length !== 0 &&
        docArr.map((v) => (
          <DocCard key={v.id} id={v.id} title={v.title} host={v.hostName} />
        ))}
      {docArr.length === 0 && <div>No Stuff Here!</div>}
    </div>
  );
};

export default Shared;
