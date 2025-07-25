const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supaClient'); 
const authenticateToken = require('../middleware/authenticateToken');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        console.error('User ID not found after authentication.');
        return res.status(500).json({ error: 'User ID not available.' });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('messages')
            .select('*')
            .eq('user_id', userId); 

        if (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Failed to fetch messages.' });
        }

        res.json(data); 

    } catch (error) {
        console.error('Error in /api/messages route:', error.message);
        res.status(500).json({ error: 'Failed to get chat history.' });
    }
}); 

module.exports = router;