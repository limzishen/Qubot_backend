const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const authenticateToken = require('../middleware/authenticateToken');
const { supabaseAdmin } = require('../config/supaClient'); // Import admin client

// Initialize DeepSeek OpenAI client
const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com', // Removed extra space
});

router.post('/', authenticateToken, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user?.id; // Get user ID from authenticated request

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }
  
  if (!userId) {
    console.error('User ID not found after authentication.');
    return res.status(500).json({ error: 'User ID not available.' });
  }

  let aiReply = '';

  try {
    // 1. Call DeepSeek API
    const response = await deepseekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a trading adviser' },
        { role: 'user', content: prompt }
      ]
    });

    aiReply = response.choices[0]?.message?.content || 'No reply from AI.';

    // 2. Store messages in Supabase using admin client (RLS will enforce user_id)
    const { data, error: dbError } = await supabaseAdmin.from('messages').insert([
      {
        user_id: userId, // RLS policy should check this matches authenticated user
        prompt: prompt,
        reply: aiReply,
      },
    ]);

    if (dbError) {
      console.error('Error storing chat message in Supabase:', dbError.message);
      return res.status(500).json({ 
        reply: aiReply, 
        warning: `Failed to save chat history: ${dbError.message}` 
      });
    }

    res.json({ reply: aiReply });

  } catch (error) {
    console.error('Error in /api/deepseek route:', error.message);
    res.status(500).json({ error: 'Failed to get AI reply or save chat history.' });
  }
});

module.exports = router;