import Editor from "./components/Editor";

import { Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

import { v4 as uuidv4 } from "uuid";
import Homepage from "./components/Homepage";
import Console from "./components/user/Console";
import "./index.css";

// import "./style/style.css";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="App ">
      <Routes>
        <Route path="/*" element={user ? <Console /> : <Homepage />} />
        <Route
          path="/newdoc"
          exact
          element={<Navigate to={`/documents/${uuidv4()}`} />}
        />
        <Route path="/documents/:id" element={<Editor />} />
      </Routes>
    </div>
  );
}

export default App;
