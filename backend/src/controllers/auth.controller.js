// controllers/auth.controller.js
const conn = require("../config/db");
const { sendVerificationEmail } = require("../utils/mailer");
const crypto = require("crypto");

async function verifyEmail(req, res) {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).json({ error: "Invalid verification link." });
  }

  try {
    const q =
      "SELECT user_id, verification_token_expires, is_verified FROM users WHERE user_email = ? AND verification_token = ?";
    const rows = await conn.query(q, [email, token]);
    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const user = rows[0];

    if (user.is_verified) {
      return res.status(200).json({ status: "already_verified" });
    }

    const expires = new Date(user.verification_token_expires);
    if (expires < new Date()) {
      return res.status(400).json({ error: "Token has expired." });
    }

    // Update verified status and clear token
    const update =
      "UPDATE users SET is_verified = 1, verification_token = NULL, verification_token_expires = NULL WHERE user_id = ?";
    await conn.query(update, [user.user_id]);

    return res.status(200).json({ status: "verified" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during verification." });
  }
}

async function resendVerification(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  try {
    const q =
      "SELECT user_id, is_verified, user_full_name FROM users u JOIN user_info ui ON u.user_id = ui.user_id WHERE u.user_email = ?";
    const rows = await conn.query(q, [email]);
    if (!rows || rows.length === 0)
      return res.status(404).json({ error: "User not found." });

    const user = rows[0];
    if (user.is_verified)
      return res.status(400).json({ error: "Already verified." });

    // generate new token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const hours = parseInt(
      process.env.VERIFICATION_TOKEN_EXPIRES_HOURS || "24",
      10
    );
    const expires = new Date(Date.now() + hours * 3600 * 1000);

    await conn.query(
      "UPDATE users SET verification_token=?, verification_token_expires=? WHERE user_id=?",
      [token, expires, user.user_id]
    );

    // send email
    await sendVerificationEmail(email, user.user_full_name, token);
    return res.status(200).json({ status: "sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
}

module.exports = { verifyEmail, resendVerification };
