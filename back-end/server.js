const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv").config();
const authRoute = require("./routes/auth-routes");
const docRoute = require("./routes/doc-routes");
const userRoute = require("./routes/user-routes");
const Document = require("./models/document-model");
const User = require("./models/user-model");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const passport = require("passport");
const { DateTime } = require("luxon");
require("./config/passport")(passport);

const app = express();
connectDB();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "co-edit API",
      version: "1.0.0",
      description: "co-edit API documentation",
    },
    server: [
      {
        url: process.env.SERVER_URI,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(options);

// MW
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//bodyparser for json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/doc", passport.authenticate("jwt", { session: false }), docRoute);
app.use(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);

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

let allUsers = [];

io.on("connection", (socket) => {
  //get the id (params) from frontend
  socket.on("get-document", async (documentId, userEmail) => {
    socket.join(documentId);
    const foundUser = await User.findOne({ email: userEmail });
    let exists = false;
    foundUser.recentlyOpened.map((v, i) => {
      if (v._id === documentId) {
        foundUser.recentlyOpened[i].time = DateTime.utc();
        exists = true;
      }
    });
    if (!exists) {
      let info = {
        _id: documentId,
        time: DateTime.utc(),
      };
      foundUser.recentlyOpened.push(info);
    }
    if (foundUser.recentlyOpened.length === 21) {
      foundUser.recentlyOpened.shift();
    }

    await foundUser.save();
    const user = {
      docId: documentId,
      username: foundUser.name,
      userEmail: foundUser.email,
      image: foundUser.thumbnail,
    };
    allUsers.push(user);

    let docUsers = allUsers.filter((v) => v.docId === documentId);
    socket.broadcast.to(documentId).emit("just-joined", foundUser.name);
    io.to(documentId).emit("all-users", docUsers);

    socket.on("send-changes", (delta) => {
      //send changes to the pointed room when I broadcasting
      //on our current socket broadcasting delta to everyone except for us if there are some changes they should receive.
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("send-cursor", (index, id, name, color) => {
      socket.broadcast
        .to(documentId)
        .emit("receive-cursor", index, id, name, color);
    });

    // call this from client to save.
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, {
        data,
        lastModified: DateTime.utc(),
      });
    });

    socket.on("save-title", async (title) => {
      console.log("savetitle");
      await Document.findByIdAndUpdate(documentId, { title });
      socket.broadcast.to(documentId).emit("send-title", title);
    });

    socket.on("delete-user", (deleteEmail) => {
      socket.broadcast.to(documentId).emit("remove-user", deleteEmail);
    });

    socket.on("delete-doc", (deleteDoc) => {
      io.in(deleteDoc).disconnectSockets();
    });

    socket.on("disconnect", () => {
      socket.broadcast
        .to(documentId)
        .emit("just-left", foundUser.name, foundUser.id);
      allUsers = allUsers.filter((v) => v.userEmail !== userEmail);
      let NewDocUsers = allUsers.filter((v) => v.docId === documentId);
      io.to(documentId).emit("all-users", NewDocUsers);
    });
  });
  // console.log("connected");
});
