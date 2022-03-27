import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import DocServices from "../../services/doc-services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const overlay_style = {
  position: "fixed",
  top: "0",
  bottom: "0",
  right: "0",
  left: "0",
  backgroundColor: "rgba(0,0,0,0.7)",
};

const Delete = ({ isDelete, onClose, docTitle, documentId }) => {
  const docTitleRef = useRef();
  const [isFailed, setIsFailed] = useState(false);
  const navigate = useNavigate();

  if (!isDelete) return null;

  const deleteHandler = async (e) => {
    e.preventDefault();
    let inputDocTitle = docTitleRef.current.value;
    if (inputDocTitle === docTitle) {
      let result = await DocServices.delete(documentId);
      toast.success(result.data);
      navigate("/");
    } else {
      setIsFailed(true);
    }
  };

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} style={overlay_style} />
      <div className="delete-box ">
        <div className="icon">⚠️</div>
        <div className="text">
          Are you sure you want to delete this document?
        </div>
        <div className="instruction">
          Type the document name to delete the document
        </div>
        <form>
          <input ref={docTitleRef} placeholder={docTitle} type="text" />
          <button onClick={deleteHandler}>🗑</button>
        </form>
        {isFailed && <div className="wrong">Wrong document title.</div>}
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default Delete;
