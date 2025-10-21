const { Server } = require("socket.io");
const conn = require("./config/db2");
let io;
const onlineUsers = new Set();

exports.initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });

   io.on("connection", (socket) => {
     const userId = socket.handshake.auth.userId;
     if (!userId) return;

     socket.join(userId); // join room with userId

     onlineUsers.add(userId);
     io.emit("online_users", Array.from(onlineUsers));

     socket.on("send_message", (msg) => {
       io.to(msg.to).emit("receive_message", msg);
     });

     socket.on("typing", (data) => {
       const { to, from, isTyping } = data;
       io.to(to).emit("typing", { from, isTyping }); // send to recipient room
     });

     socket.on("disconnect", async () => {
       onlineUsers.delete(userId);
       io.emit("online_users", Array.from(onlineUsers));
       try {
         await conn.query(
           "UPDATE users SET last_seen = NOW() WHERE user_id = ?",
           [userId]
         );
       } catch (err) {
         console.error("Failed to update last_seen:", err);
       }
     });
   });

};
