import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DocServices from "../services/doc-services";
import Delete from "./portal/Delete";
import UserList from "./portal/UserList";
import Emoji from "./portal/Emoji";

// import QuillCursors from "quill-cursors";

// Quill.register("modules/cursors", QuillCursors);

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const Editor = () => {
  const { user } = useSelector((state) => state.auth);
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [docTitle, setDocTitle] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!chosenEmoji) return;
    const emoji = chosenEmoji.emoji;
    const range = quill.getSelection();
    if (range) {
      if (range.length == 0) {
        console.log("User cursor is at index", range.index);
        quill.insertText(range.index, emoji);
      } else {
        var text = quill.getText(range.index, range.length);
        console.log("User has highlighted: ", text);
      }
    } else {
      return;
    }
  }, [chosenEmoji]);

  useEffect(() => {
    if (!user) {
      setIsAuthorized(false);
      setErrorMsg("Sorry! you have to login first.");

      return;
    }
    const s = io(process.env.REACT_APP_SOCKET);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  //---------------------get doc------------------------
  useEffect(() => {
    if (!socket || !quill) return;

    const loadDoc = async () => {
      try {
        let response = await DocServices.getOneOrCreate(documentId);
        let docInfo = response.data;
        setDocTitle(docInfo.title);
        setHostEmail(docInfo.hostEmail);
        quill.setContents(docInfo.data);
        quill.enable();
        // const cursors = quill.getModule("cursors");
        // cursors.createCursor(`${user.email}`, `${user.name}`, "blue");
        // console.log(cursors);
      } catch (err) {
        console.log(err);
        setIsAuthorized(false);
        setErrorMsg(err.response.data);
        quill.disable();
        socket.disconnect();
        return null;
      }
    };

    socket.emit("get-document", documentId);
    loadDoc();

    //go to the room or get the create doc for us.
  }, [socket, quill, documentId]);
  //------------------------------------------------------

  //-----------save doc real time-----------------

  useEffect(() => {
    if (!socket || !quill) return;

    const saveInterval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(saveInterval);
    };
  }, [socket, quill]);

  //-----------updating doc with changes from other client.---------
  useEffect(() => {
    if (!socket || !quill) return;

    const receiveHandler = (delta) => {
      quill.updateContents(delta);
    };

    // this is the event i setup on the server.
    socket.on("receive-changes", receiveHandler);

    return () => {
      quill.off("receive-changes", receiveHandler);
    };
  }, [socket, quill]);

  //---------------------send changes----------------------
  useEffect(() => {
    if (!socket || !quill) return;

    const changeHandler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", changeHandler);

    return () => {
      quill.off("text-change", changeHandler);
    };
  }, [socket, quill]);

  //-----------------set new editor---------------------------

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        // cursors: { transformOnTextChange: true },
      },
    });

    q.disable();
    q.setText("Loading...");

    setQuill(q);
  }, []);

  const titleChange = (e) => {
    if (e.target.value !== docTitle) {
      setDocTitle(e.target.value);
    }
  };

  const submitTitle = (e) => {
    e.preventDefault();
    socket.emit("save-title", docTitle);
    toast.success("Title saved!");
  };
  const accessInputRef = useRef();

  const grantAccess = async (e) => {
    e.preventDefault();
    let email = accessInputRef.current.value;
    try {
      let data = await DocServices.access(email, documentId);
      toast.success(data.data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const NOT_AUTHORIZED_STYLE = {
    filter: "blur(8px)",
  };

  return (
    <>
      {!isAuthorized && (
        <>
          <div className="fixed left-0 ring-0 top-0 bottom-0 bg-black bg-opacity-80 z-10 "></div>
          <div className="fixed flex flex-col items-center p-6 top-1/2 translate-x-1/2 -translate-y-1/2 right-1/2 bg-black text-white w-2/5 z-20 rounded-xl shadow-xl">
            <div className=" text-5xl">⛔</div>
            <div className=" text-2xl font-semibold font-mono ">{errorMsg}</div>
            <div
              onClick={() => {
                navigate("/");
              }}
              className=" bg-transparent rounded-50px border-2 border-white p-6 cursor-pointer"
            >
              back to Homepage
            </div>
          </div>
        </>
      )}
      <Delete
        isDelete={isDelete}
        docTitle={docTitle}
        documentId={documentId}
        onClose={() => {
          setIsDelete(false);
        }}
      />
      <UserList
        documentId={documentId}
        isOpenList={isOpenList}
        onClose={() => {
          setIsOpenList(false);
        }}
      />
      <Emoji
        isEmoji={isEmoji}
        setChosenEmoji={setChosenEmoji}
        onClose={() => {
          setIsEmoji(false);
        }}
      />

      <div style={isAuthorized ? {} : NOT_AUTHORIZED_STYLE}>
        <div className=" w-1000px md:w-full bg-primary sticky top-0 justify-between flex flex-row p-3 z-40">
          <div className="flex items-center">
            <div className=" text-2xl">📝</div>
            <form onSubmit={submitTitle}>
              <input
                title="Change Title"
                className=" text-black bg-transparent h-full text-xl border-none p-2 hover:border-2 hover:border-borderColor focus:border-2 focus:border-borderColor"
                type="text"
                value={docTitle}
                onChange={titleChange}
              />
            </form>
            <div
              onClick={() => {
                setIsEmoji(!isEmoji);
              }}
              className=" text-2xl cursor-pointer"
            >
              😎
            </div>
          </div>
          {user && hostEmail === user.email && (
            <div className="flex flex-row items-center justify-between">
              <form onSubmit={grantAccess}>
                <input
                  className=" h-full text-xs border-none p-2 text-black"
                  ref={accessInputRef}
                  placeholder="type user email to grant access"
                  type="email"
                />
                <button>
                  <div className="icon">✅</div>
                </button>
              </form>
              <div
                onClick={() => {
                  setIsDelete(!isDelete);
                }}
                className="icon"
              >
                🗑
              </div>
              <div
                onClick={() => {
                  setIsOpenList(!isOpenList);
                }}
                className="icon"
              >
                📋
              </div>
            </div>
          )}
        </div>
        <div className="w-1000px md:w-screen" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default Editor;

//65da2739-0f08-49e9-8c0d-7b3b9d602024

/*

 const submitTitle = (e) => {
      e.preventDefault();
      setDocTitle(titleInput.value);
      socket.emit("save-title", docTitle);
      console.log("123");
    };

    const titleForm = document.createElement("form");
    const titleInput = document.createElement("input");
    titleInput.classList.add("title-input");
    titleInput.value = docTitle;
    titleForm.appendChild(titleInput);
    titleForm.onsubmit = submitTitle;
    const toolbar = document.querySelector(".ql-toolbar");
    const firstChild = document.querySelector(".ql-formats");
    toolbar.insertBefore(titleForm, firstChild);

*/
