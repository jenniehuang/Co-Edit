const app = require("./app");
const Document = require("./models/document-model");
const User = require("./models/user-model");
const { DateTime } = require("luxon");

app.listen(8080, () => {
  console.log("Server is running !!.");
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
        foundUser.recentlyOpened[i].lastOpened = DateTime.utc();
        exists = true;
      }
    });
    if (!exists) {
      let info = {
        _id: documentId,
        lastOpened: DateTime.utc(),
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
      userId: foundUser._id,
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
});

module.exports = app;
