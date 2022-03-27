import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import DocServices from "../../services/doc-services";
import { toast } from "react-toastify";

const overlay_style = {
  position: "fixed",
  top: "0",
  bottom: "0",
  right: "0",
  left: "0",
  backgroundColor: "rgba(0,0,0,0.3)",
};

const UserList = ({ isOpenList, onClose, documentId }) => {
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
  console.log(usersArr);
  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} style={overlay_style} />
      <div className="user-list ">
        <div className="icon">📋</div>
        {usersArr.length === 0 && <div>No users!</div>}
        {!(usersArr.length === 0) && (
          <ul>
            {usersArr.map((v) => (
              <li key={v.email}>
                <span>{v.email}</span>
                <span onClick={deleteHandler} className="delete-icon">
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
