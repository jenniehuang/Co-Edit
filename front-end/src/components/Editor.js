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
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import QuillCursors from "quill-cursors";
import OnlineList from "./portal/OnlineList";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

import { CSS_COLOR_NAMES, totalColors } from "../utils/CSS_COLORS";
import sync from "../images/sync.png";
import users from "../images/users.png";
import pdf from "../images/pdf.png";
Quill.register("modules/cursors", QuillCursors);

const Editor = () => {
  const colorIndex = Math.floor(Math.random() * (totalColors + 1));
  const { user } = useSelector((state) => state.auth);
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState();
  const [docTitle, setDocTitle] = useState("");
  const [docBackground, setBackground] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [docUsers, setDocUsers] = useState([]);
  let usersCount = docUsers.length;
  const [isOnlineList, setIsOnlineList] = useState(false);
  const [cursors, setCursors] = useState(null);
  const [cursorColor, setCursorColor] = useState(CSS_COLOR_NAMES[colorIndex]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveText, setSaveText] = useState("Saving...");
  const [uploadURL, setUploadURL] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  //----------------------upload picture-----------------
  useEffect(() => {
    if (!uploadURL) return;
    const range = quill.getSelection();
    if (range) {
      if (range.length == 0) {
        let delta = quill.insertEmbed(range.index, "image", uploadURL);
        socket.emit("send-changes", delta);
      } else {
        let delta = quill.deleteText(range.index, range.length);
        socket.emit("send-changes", delta);
        let delta2 = quill.insertEmbed(range.index, "image", uploadURL);
        socket.emit("send-changes", delta2);
      }
    } else {
      return;
    }
    socket.emit("save-document", quill.getContents());
  }, [uploadURL]);

  //--------------------socket connect---------------------
  useEffect(() => {
    if (!user) {
      setIsAuthorized(false);
      setErrorMsg(`${t("noLogin")}`);
      return;
    }
    if (!isAuthorized) return;

    const s = io(process.env.REACT_APP_SOCKET);
    setSocket(s);
    s.emit("get-document", documentId, user.email);

    return () => {
      s.disconnect();
    };
  }, [isAuthorized]);

  //--------------------emoji palate--------------------

  useEffect(() => {
    if (!chosenEmoji) return;

    const emoji = chosenEmoji.emoji;
    const range = quill.getSelection();
    if (range) {
      if (range.length == 0) {
        let delta = quill.insertText(range.index, emoji);
        socket.emit("send-changes", delta);
      } else {
        let delta = quill.deleteText(range.index, range.length);
        socket.emit("send-changes", delta);
        let delta2 = quill.insertText(range.index, emoji);
        socket.emit("send-changes", delta2);
      }
    } else {
      return;
    }
  }, [chosenEmoji]);

  //---------send user join/left/all users-------------------------

  useEffect(() => {
    if (!socket || !quill) return;

    socket.on("just-joined", (username) => {
      toast.success(`${username} ${t("join")}`);
    });

    socket.on("just-left", (username, userId) => {
      toast.info(`${username} ${t("left")}`);
      cursors.removeCursor(userId);
    });

    socket.on("all-users", (users) => {
      setDocUsers(users);
    });

    socket.on("remove-user", (deleteEmail) => {
      if (user.email === deleteEmail) {
        setIsAuthorized(false);
        setErrorMsg(`${t("unAuth")}`);
        quill.disable();
        socket.disconnect();
      } else {
        return;
      }
    });

    socket.on("disconnect", () => {
      setIsAuthorized(false);
      setErrorMsg(`${t("lostCnx")}`);
      quill.disable();
    });

    socket.on("send-title", (title) => {
      setDocTitle(title);
    });
  }, [socket, quill]);

  //----------------------------------------------------

  //---------------------get doc------------------------
  useEffect(() => {
    if (!quill | !user) return;

    const loadDoc = async () => {
      try {
        let response = await DocServices.getOneOrCreate(documentId);
        let docInfo = response.data;
        setIsAuthorized(true);
        setDocTitle(docInfo.title);
        setHostEmail(docInfo.hostEmail);
        setBackground(docInfo.background);
        quill.setContents(docInfo.data);
        quill.enable();
      } catch (err) {
        setIsAuthorized(false);
        console.log(err);
        let code = err.response.status;
        let msg = `doc_${code}`;
        setErrorMsg(`${t(msg)}`);
        quill.disable();
        socket.disconnect();
        setSocket(null);
        return null;
      }
    };

    loadDoc();

    //go to the room or get the create doc for us.
  }, [socket, quill, documentId]);
  //------------------------------------------------------

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
  //-------------------------update cursor------------------------
  useEffect(() => {
    if (!socket || !quill) return;

    const cursorHandler = (index, id, name, color) => {
      cursors.createCursor(id, name, color);
      cursors.moveCursor(id, index);
    };

    // this is the event i setup on the server.
    socket.on("receive-cursor", cursorHandler);

    return () => {
      quill.off("receive-cursor", cursorHandler);
    };
  }, [socket, quill]);

  //---------------------send changes and cursor and saveDebounce----------------------
  useEffect(() => {
    if (!socket || !quill) return;
    const saveDebounce = debounce(() => {
      socket.emit("save-document", quill.getContents());
      setSaveText("Saved!");
      setTimeout(() => {
        setIsSaving(false);
        setSaveText("Saving...");
      }, 1000);
    }, 800);

    const changeHandler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      setIsSaving(true);
      socket.emit("send-changes", delta);
      saveDebounce();
    };

    quill.on("selection-change", function (range, oldRange, source) {
      if (range) {
        socket.emit("send-cursor", range, user.id, user.name, cursorColor);
      } else return;
    });

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
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ align: [] }],
            ["image", "blockquote", "code-block"],
            ["clean"],
          ],
          handlers: {
            image: imageHandler,
          },
        },
        cursors: { transformOnTextChange: true },
      },
    });

    q.disable();
    q.setText("Loading...");

    setQuill(q);
    const c = q.getModule("cursors");
    setCursors(c);
  }, []);

  // const imageHandler = () => {

  // };
  function imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    // Listen upload local image and save to server
    input.onchange = async () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        const imageRef = ref(
          storage,
          `docImages/${documentId}/imgs/${file.name}`
        );
        try {
          await uploadBytes(imageRef, file);
          let url = await getDownloadURL(imageRef);
          setUploadURL(url);
        } catch (e) {
          console.log(e);
          toast.error(e);
        }
      } else {
        console.warn("You could only upload images.");
      }
    };
  }

  const titleChange = (e) => {
    if (e.target.value !== docTitle) {
      setDocTitle(e.target.value);
    }
  };

  const submitTitle = () => {
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

  const exportPDF = () => {
    window.print();
  };

  const NOT_AUTHORIZED_STYLE = {
    filter: "blur(8px)",
  };

  return (
    <>
      {isAuthorized === false && (
        <>
          <div className="fixed left-0 ring-0 top-0 bottom-0 bg-black bg-opacity-80 "></div>
          <div className="fixed flex flex-col items-center p-6 top-1/2 translate-x-1/2 -translate-y-1/2 right-1/2 bg-black text-white w-full md:w-2/5 z-20 rounded-xl shadow-xl">
            <div className=" text-5xl">⛔</div>
            <div className=" my-8 text-2xl font-semibold font-mono ">
              {errorMsg}
            </div>
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
        socket={socket}
        isDelete={isDelete}
        docTitle={docTitle}
        documentId={documentId}
        onClose={() => {
          setIsDelete(false);
        }}
      />
      {user && (
        <UserList
          socket={socket}
          documentId={documentId}
          isOpenList={isOpenList}
          onClose={() => {
            setIsOpenList(!isOpenList);
          }}
        />
      )}
      <Emoji
        CN={"fixed left-0 top-2/4 "}
        isEmoji={isEmoji}
        setChosenEmoji={setChosenEmoji}
      />
      {user && (
        <OnlineList
          isOnlineList={isOnlineList}
          docUsers={docUsers}
          hostEmail={hostEmail}
          currentUser={user.email}
        />
      )}

      {isAuthorized && (
        <>
          <img
            onClick={() => {
              setIsOnlineList(!isOnlineList);
            }}
            className=" w-12 flex justify-center items-center fixed bottom-8 right-8 z-20 cursor-pointer shadow-2xl print:hidden"
            src={users}
            alt=""
          />
          <div className="fixed bottom-6 right-6 text-2xl z-30 print:hidden">
            {usersCount}
          </div>
        </>
      )}

      <div style={isAuthorized ? {} : NOT_AUTHORIZED_STYLE}>
        <div className=" w-1000px tablet:w-full bg-primary sticky top-0 justify-between flex flex-row p-3 z-20 print:hidden">
          <div className="flex items-center">
            <div className=" text-2xl">📝</div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                title="Change Title"
                className=" w-60 text-black bg-transparent h-full text-xl border-none p-2 hover:border-2 hover:border-borderColor focus:border-2 focus:border-borderColor"
                type="text"
                value={docTitle}
                onChange={titleChange}
                onBlur={submitTitle}
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
            <img
              onClick={exportPDF}
              src={pdf}
              alt=""
              className=" cursor-pointer w-8 ml-8"
            />
            {isSaving && (
              <div className=" flex flex-col justify-center items-center ml-4">
                <img src={sync} alt="" className="  w-6" />
                <span className=" text-sm">{saveText}</span>
              </div>
            )}
          </div>
          {user && hostEmail === user.email && (
            <div className="flex flex-row items-center justify-between">
              <form className="flex items-center" onSubmit={grantAccess}>
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
        <div
          className="CONTAINER w-1000px md:w-full bg-cover bg-no-repeat bg-center "
          style={{ backgroundImage: `url(${docBackground})` }}
          ref={wrapperRef}
        ></div>
      </div>
    </>
  );
};

export default Editor;
