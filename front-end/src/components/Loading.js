import React from "react";
import loading from "../images/loading.gif";

const Loading = () => {
  return (
    <div className="loading-overlay">
      {/* <img className="loading" src={loading} /> */}
      <div className="text">🚧Loading...🚧</div>
    </div>
  );
};

export default Loading;
