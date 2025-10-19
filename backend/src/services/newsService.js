const conn = require("../config/db");
 
const conn2 = require("../config/db2");  
async function createNews(news) {
  try {
    const query =
      "INSERT INTO news(user_id, title, body, audience) VALUES (?, ?, ?, ?)";
    const result = await conn.query(query, [
      news.user_id,
      news.title,
      news.body,
      news.audience,
    ]);
    return result.affectedRows === 1;
  } catch (error) {
    throw error;
  }
}
async function getNews(params) {
  const query = "SELECT * FROM news";
  const result=await conn.query(query);
  return result;
}

module.exports = {
  createNews,
  getNews,
};
