const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { symbol, from, to } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol parameter is required and must be a string.' });
  }

  if (!from || !to) {
    return res.status(400).json({ error: '"from" and "to" date parameters are required in format YYYY-MM-DD.' });
  }

  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${apiKey}`;
    const response = await axios.get(url);

    if (!response.data || response.data.length === 0) {
      return res.json({ message: `No news found for symbol "${symbol}" from ${from} to ${to}.` });
    }

    const transformedNews = response.data.map((article, index) => ({
      category: "top news",
      datetime: article.datetime || Math.floor(Date.now() / 1000),
      headline: article.headline || '',
      id: index + 1,
      image: article.image || "https://via.placeholder.com/750x422.png?text=No+Image",
      related: "",
      source: article.source || "Unknown",
      summary: article.summary || '',
      url: article.url || ''
    }));

    res.json(transformedNews);

  } catch (error) {
    if (error.response) {
      console.error('Finnhub API error status:', error.response.status);
      console.error('Finnhub API error data:', error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error('No response received from Finnhub:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return res.status(500).json({ error: error.message || 'Failed to fetch financial news' });
  }
});

module.exports = router;
