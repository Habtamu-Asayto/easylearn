const conn = require("../config/db2");

exports.getContacts = async () => {
  // const [rows] = await conn.query("SELECT id, name, avatar, last_seen FROM users");
  const [rows] = await conn.query(`SELECT * FROM users 
LEFT JOIN user_info ON users.user_id = user_info.user_id    
LEFT JOIN user_role ON users.user_id = user_role.user_id`);
  return rows;
};
exports.getTotalUnread = async (userId) => {
  try {
    const [rows] = await conn.query(
      "SELECT COUNT(*) AS totalUnread FROM messages WHERE receiver_id = ? AND unread = TRUE",
      [userId]
    );
    return rows[0].totalUnread;
  } catch (err) {
    console.error("Error in getTotalUnread:", err);
    throw err;
  }
};

exports.getMessages = async (contactId, currentUserId) => {
  const [rows] = await conn.query(
    `SELECT id, sender_id, receiver_id, message, created_at 
     FROM messages 
     WHERE (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [currentUserId, contactId, contactId, currentUserId]
  );
  // Map to format suitable for frontend and convert to ISO string
  const formatted = rows.map((msg) => ({
    id: msg.id,
    from: msg.sender_id,
    to: msg.receiver_id,
    message: msg.message,
    createdAt: new Date(msg.created_at).toISOString(), //  ensures JS Date works
  }));

  return formatted;
};

exports.saveMessage = async (senderId, receiverId, message) => {
  const [result] = await conn.query(
    "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
    [senderId, receiverId, message]
  );
  return result.insertId;
};
