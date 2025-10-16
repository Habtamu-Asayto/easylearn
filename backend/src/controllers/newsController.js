const newsService = require("../services/newsService");
async function createNews(req, res) {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ status: false, error: "Unauthorized" });
    }

    const news = req.body; // FIX: use req.body
    const newsData = {
      user_id: req.user.user_id,
      title: news.title,
      body: news.body,
      audience: news.audience,
    };

    const inserted = await newsService.createNews(newsData);
    if (!inserted) {
      return res
        .status(400)
        .json({ status: false, error: "Failed to add News!" });
    }

    console.log("News added successfully!");
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    console.error("Error creating news:", error);
    return res.status(500).json({
      status: false,
      error: "Something went wrong while adding the news.",
    });
  }
}

async function getNews(req, res, next) {
  const news = await newsService.getNews();
  if (!news) {
    res.status(400).json({
      error: "Failed to get all courses!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: news,
    });
  }
}

module.exports = {
  createNews,
  getNews,
};
