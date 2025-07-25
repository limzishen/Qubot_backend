// src/middleware/authenticateToken.js

const { supabaseAdmin } = require('../config/supaClient');


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token received:', token);

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    // Use Supabase's built-in token verification
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      console.error('Supabase auth error:', error?.message);
      return res.status(401).json({ error: 'Invalid Supabase token' });
    }

    console.log('User authenticated:', data.user);
    req.user = data.user;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;