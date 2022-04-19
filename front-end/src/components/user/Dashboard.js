import React from "react";

import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return <div className="">抱歉{user.name}, 我還在開發中</div>;
};

export default Dashboard;
