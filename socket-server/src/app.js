// import all the libraries required
const app = require("express")();
const http = require("http").Server(app);

const io = require("socket.io")(http);

const documents = {};

const messages = {};

io.on("connection", (socket) => {
  // .....
  let previousId;

  const safeJoin = (currentId) => {
    socket.leave(previousId);
    socket.join(currentId, () => {
      console.log(`Socket ${socket.id} joined room ${currentId}`);
      previousId = currentId;
    });
  };

  socket.on("getDoc", (docId) => {
    safeJoin(docId);
    console.log("From get Doc", documents[docId]);
    socket.emit("document", documents[docId]);
    socket.emit("message", { id: docId, content: messages[docId] });
  });

  socket.on("addDoc", (doc) => {
    documents[doc.id] = doc;
    messages[doc.id] = [""];
    safeJoin(doc.id);
    io.emit("documents", Object.keys(documents));
    io.emit("messages", Object.keys(messages));
    socket.emit("document", doc);
    socket.emit("message", { id: doc.id, content: messages[doc.id] });
  });

  socket.on("editDoc", (doc) => {
    console.log("From edit doc", doc.id);

    documents[doc.id] = doc;
    socket.to(doc.id).emit("document", doc);
  });

  socket.on("SendMessage", (msg) => {
    if (msg.id == "" || typeof msg.id == "undefined") {
      return;
    }
    console.log("From msg send to", msg.id);
    console.log(msg.content);
    messages[msg.id].push(msg.content);
    // messages[msg.id] = [messages[msg.id], msg.content];
    // socket.emit("message", { id: msg.id, content: messages[msg.id] });
    io.emit("messages", Object.keys(messages));

    socket.emit("message", { id: msg.id, content: messages[msg.id],self:false });
    socket
      .to(msg.id)
      .emit("message", { id: msg.id, content: messages[msg.id],self: true });
  });

  socket.on("getMessages", (msgId) => {
    socket.emit("message", messages[msgId]);
  });

  io.emit("documents", Object.keys(documents));
  console.log(`Sockets ${socket.id} has connected`);
});

http.listen(4444, () => {
  console.log(`Listing on port 4444`);
});
