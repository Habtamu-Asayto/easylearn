const { Server } = require("socket.io");
const conn = require("./config/db2");
let io;
const onlineUsers = new Set();

exports.initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    // console.log("Is there change: ", userId);

    if (!userId) return; // ignore if no userId

    // Add user to online set
    onlineUsers.add(userId);

    // Emit current online users to all clients
    io.emit("online_users", Array.from(onlineUsers));

    // Listen for messages
    socket.on("send_message", (msg) => {
      io.emit("receive_message", msg);
    });

    // Typing indicator
    socket.on("typing", (data) => {
      io.emit("typing", data);
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);
      io.emit("online_users", Array.from(onlineUsers));
      if (userId) {
        try {
          await conn.query(
            "UPDATE users SET last_seen = NOW() WHERE user_id = ?",
            [userId]
          );
        } catch (err) {
          console.error("Failed to update last_seen:", err);
        }
      }
    });
  });
};
