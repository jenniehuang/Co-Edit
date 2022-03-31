import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import DocServices from "../../services/doc-services";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const overlay_style = {
  position: "fixed",
  top: "0",
  bottom: "0",
  right: "0",
  left: "0",
  backgroundColor: "rgba(0,0,0,0.3)",
};

const UserList = ({ isOpenList, onClose, documentId }) => {
  const { t } = useTranslation();

  const [usersArr, setUsersArr] = useState([]);

  useEffect(() => {
    const getUserList = async () => {
      try {
        let response = await DocServices.getUsers(documentId);
        setUsersArr(response.data);
      } catch (e) {
        console.log(e);
        toast.error("Sorry! Something went wrong.");
      }
    };

    getUserList();
  }, [isOpenList]);

  const deleteHandler = async (e) => {
    try {
      const deleteEmail = e.target.previousSibling.textContent;
      const response = await DocServices.remove(deleteEmail, documentId);
      console.log(response);
      let filtered = usersArr.filter((v) => !(v.email === deleteEmail));
      setUsersArr(filtered);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  if (!isOpenList) return null;
  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} style={overlay_style} />
      <div className=" w-96 fixed top-1/2 translate-x-1/2 -translate-y-1/2 right-1/2 flex flex-col items-center rounded-xl bg-white shadow-md font-serif">
        <div className=" text-5xl m-4 text-center">📋</div>
        {usersArr.length === 0 && <div> {t("noUser")}</div>}
        {!(usersArr.length === 0) && (
          <ul className="list-decimal">
            {usersArr.map((v) => (
              <li
                className="m-4 text-xl border-b-2 border-gray-500"
                key={v.email}
              >
                <span>{v.email}</span>
                <span onClick={deleteHandler} className=" ml-20 cursor-pointer">
                  ❌
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default UserList;
