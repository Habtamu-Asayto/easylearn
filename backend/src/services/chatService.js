const conn = require("../config/db2");

exports.getContacts = async () => {
    // const [rows] = await conn.query("SELECT id, name, avatar, last_seen FROM users");
    const [rows] = await conn.query(`SELECT * FROM users 
LEFT JOIN user_info ON users.user_id = user_info.user_id 
LEFT JOIN user_pass ON users.user_id = user_pass.user_id 
LEFT JOIN user_role ON users.user_id = user_role.user_id`);
    return rows;
};

exports.getMessages = async (contactId) => {
    const [rows] = await conn.query("SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at ASC", [contactId, contactId]);
    return rows;
};

exports.saveMessage = async (senderId, receiverId, message) => {
    const [result] = await conn.query("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)", [senderId, receiverId, message]);
    return result.insertId;
};
