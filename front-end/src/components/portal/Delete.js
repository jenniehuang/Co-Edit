import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import DocServices from "../../services/doc-services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const overlay_style = {
  position: "fixed",
  top: "0",
  bottom: "0",
  right: "0",
  left: "0",
  backgroundColor: "rgba(0,0,0,0.7)",
};

const Delete = ({ isDelete, onClose, docTitle, documentId, socket }) => {
  const { t } = useTranslation();

  const docTitleRef = useRef();
  const [isFailed, setIsFailed] = useState(false);
  const navigate = useNavigate();

  if (!isDelete) return null;

  const deleteHandler = async (e) => {
    e.preventDefault();
    let inputDocTitle = docTitleRef.current.value;
    if (inputDocTitle === docTitle) {
      let result = await DocServices.delete(documentId);
      socket.emit("delete-doc", documentId);
      toast.success(result.data);
      navigate("/");
    } else {
      setIsFailed(true);
    }
  };

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} style={overlay_style} />
      <div className="w-96 fixed flex flex-col p-6 top-1/2 translate-x-2/4 -translate-y-1/2 right-1/2 bg-black text-white z-10 rounded-xl shadow-sm font-serif ">
        <div className=" text-5xl m-4 text-center">⚠️</div>
        <div className=" text-2xl text-center">{t("sure")}</div>
        <div className=" text-base text-left pt-4">{t("type")}</div>
        <form className="flex justify-center items-center m-4">
          <input
            className="h-8 p-2 text-black"
            ref={docTitleRef}
            placeholder={docTitle}
            type="text"
          />
          <button className=" text-2xl bg-transparent" onClick={deleteHandler}>
            🗑
          </button>
        </form>
        {isFailed && (
          <div className=" font-semibold text-red-500 text-center">
            {t("wrong")}
          </div>
        )}
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default Delete;
