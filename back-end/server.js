const express = require("express");
const dotenv = require("dotenv").config();
const authRoute = require("./routes/auth-routes");
const docRoute = require("./routes/doc-routes");
const Document = require("./models/document-model");
const cors = require("cors");
const connectDB = require("./config/mongodb");

const passport = require("passport");
require("./config/passport")(passport);

const app = express();
connectDB();

// MW
app.use(cors());
//bodyparser for json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/doc", passport.authenticate("jwt", { session: false }), docRoute);

app.listen(8080, () => {
  console.log("Server is 跑 on 破 8080.");
});

//-------------------socket.io---------------
const io = require("socket.io")(8000, {
  cors: {
    origin: process.env.SOCKET_ORIGIN,
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //get the id (params) from frontend
  socket.on("get-document", async (documentId) => {
    socket.join(documentId);

    socket.on("send-changes", (delta) => {
      //send changes to the pointed room when I broadcasting
      //on our current socket broadcasting delta to everyone except for us if there are some changes they should receive.
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    // call this from client to save.
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });

    socket.on("save-title", async (title) => {
      console.log("savetitle");
      await Document.findByIdAndUpdate(documentId, { title });
    });
  });
  console.log("connected");
});
