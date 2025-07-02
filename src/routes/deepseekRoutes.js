const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a trading adviser' },
        { role: 'user', content: prompt }
      ]
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('Error calling DeepSeek:', error.message);
    res.status(500).json({ error: 'DeepSeek API error' });
  }
});

module.exports = router;
