import React from "react";

const Loading = () => {
  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50">
      <div className="absolute w-full text-center top-1/2 text-8xl ">
        🚧Loading...🚧
      </div>
    </div>
  );
};

export default Loading;
