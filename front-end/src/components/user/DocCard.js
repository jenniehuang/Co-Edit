import React from "react";

import doc from "../../images/doc.jpg";

// const formatDate = (date) => {
//   let d = new Date(date);
//   let month = (d.getMonth() + 1).toString();
//   let day = d.getDate().toString();
//   let year = d.getFullYear();
//   if (month.length < 2) {
//     month = "0" + month;
//   }
//   if (day.length < 2) {
//     day = "0" + day;
//   }
//   return [year, month, day].join("-");
// };

const DocCard = ({ title, host, id }) => {
  return (
    <a href={`http://localhost:3000/documents/${id}`} target="_blank">
      <img className="doc-pic" src={doc} alt="" />
      <div className="doc-desc">
        <div className="title">{`📜${title}`}</div>
        <div className="host">{`By: ${host}`}</div>
      </div>
    </a>
  );
};

export default DocCard;
