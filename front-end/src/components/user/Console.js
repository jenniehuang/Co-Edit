import React, { useState } from "react";
// import "../../style/console.css";
import Nav from "../Nav";
import Mydocs from "./Mydocs";
import Shared from "./Shared";

const Console = () => {
  let [myDoc, setMyDoc] = useState(true);

  return (
    <>
      <Nav />
      <div className="console">
        <div className="console-nav">
          <a className=" item newdoc" href="/newdoc" target="_blank">
            <div className="icon">📝</div>
            New Doc
          </a>
          {/*  */}
          <div
            onClick={() => {
              setMyDoc(true);
            }}
            className=" item my-docs"
          >
            <div className="icon">📒</div>
            My Docs
          </div>
          {/*  */}
          <div
            onClick={() => {
              setMyDoc(false);
            }}
            className="item share"
          >
            <div className="icon">📚</div>
            Shared with me
          </div>
        </div>
        <div className="console-main">
          {myDoc && <Mydocs />}
          {!myDoc && <Shared />}
        </div>
      </div>
    </>
  );
};

export default Console;
