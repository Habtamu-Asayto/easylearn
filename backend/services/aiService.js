const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAIReply = async (userMessage) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful AI assistant for chat apps.",
      },
      { role: "user", content: userMessage },
    ],
  });
  return completion.data.choices[0].message.content;
};

module.exports = { getAIReply };
