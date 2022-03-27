import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import "../style/editor.css";
import { useParams } from "react-router-dom";

import { db } from "../utils/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// const SAVE_INTERVAL_MS = 2000;
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
  const { id: documentId } = useParams();

  // make instance for using in multiple places.
  // const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  // const documentsRef = collection(db, 'Documents')
  const docRef = doc(db, "Documents", documentId);

  // console.log(docRef);

  // const q = query(documentsRef, where("id", "==", documentId));

  // useEffect(() => {
  //   const s = io("http://localhost:8000");
  //   setSocket(s);

  //   return () => {
  //     s.disconnect();
  //   };
  // }, []);
  //---------------------get doc------------------------

  useEffect(() => {
    if (!quill) return;

    const getDocOrCreate = async () => {
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setDoc(docRef, {
          data: [],
        }).then(() => {
          console.log("created");
        });
      }
    };

    getDocOrCreate();

    const unsub = onSnapshot(docRef, (doc) => {
      var range = quill.getSelection();
      let ops = doc.data().data;

      quill.setContents(ops);
      quill.enable();
      if (range) {
        if (range.length == 0) {
          quill.setSelection(range.index);

          console.log("User cursor is at index", range.index);
        } else {
          var text = quill.getText(range.index, range.length);
          console.log("User has highlighted: ", text);
        }
      } else {
        console.log("User cursor is not in editor");
      }
      // console.log(ops);

      console.log("Current data: ", doc.data());
    });

    //load and render doc.
    // socket.once("load-document", (document) => {
    // quill.setContents(document);
    // quill.enable();
    // });

    // //go to the room or get the saved doc for us.
    // socket.emit("get-document", documentId);
    // if (!ref) {
    //   // const ref = doc(db, "Documents", documentId);
    //   setDoc(ref, {
    //     data: [],
    //   }).then(() => {
    //     console.log("created");
    //   });
    // }

    // const unsub = onSnapshot(ref, (snapshot) => {
    //   if(snapshot.exists){

    //   }
    // let ops = snapshot;
    // console.log(ops);
    // quill.setContents(ops);
    // quill.enable();
    // });

    // getDocs(documentsRef).then((snapshot) => {
    //   console.log(snapshot.docs[0].data.data);
    //   quill.setContents();
    //   quill.enable();
    // });
  }, [quill, documentId]);

  // //-----------save doc real time-----------------

  // useEffect(() => {
  //   if (!quill) return;

  //   const saveInterval = setInterval(() => {
  //     socket.emit("save-document", quill.getContents());
  //   }, SAVE_INTERVAL_MS);

  //   return () => {
  //     clearInterval(saveInterval);
  //   };
  // }, [ quill]);

  //-----------updating doc with changes from other client.---------
  // useEffect(() => {
  //   if (!quill) return;

  //   const receiveHandler = (delta) => {
  //     quill.updateContents(delta);
  //   };

  //   // this is the event i setup on the server.
  //   // socket.on("receive-changes", receiveHandler);

  //   return () => {
  //     quill.off("receive-changes", receiveHandler);
  //   };
  // }, [quill]);

  //---------------------send changes----------------------
  useEffect(() => {
    if (!quill) return;

    const changeHandler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      // socket.emit("send-changes", delta);
      // const docRef = doc(db, "Documents", documentId);
      updateDoc(docRef, {
        data: quill.getContents().ops,
      }).then(() => {
        console.log("saved");
      });
    };

    quill.on("text-change", changeHandler);

    return () => {
      quill.off("text-change", changeHandler);
    };
  }, [quill]);

  // //-----------------set new editor---------------------------

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";

    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default Editor;

/* 


import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import "../style/editor.css";
import { useParams } from "react-router-dom";

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
  const { id: documentId } = useParams();

  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io("http://localhost:8000");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);
  //---------------------get doc------------------------

  useEffect(() => {
    if (!socket || !quill) return;

    //load and render doc.
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    //go to the room or get the saved doc for us.
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

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
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default Editor;



*/
