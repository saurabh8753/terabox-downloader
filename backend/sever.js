const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());

// frontend serve
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// environment variables
const API_ENDPOINT = process.env.API_ENDPOINT;
const API_TOKEN = process.env.API_TOKEN;

// API proxy
app.post('/api/extract', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ status: false, message: "Missing URL" });

  try {
    const upstream = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        token: API_TOKEN,
        t: Math.floor(Date.now() / 1000)
      })
    });

    const data = await upstream.json();

    res.json({
      status: true,
      name: data.name || data.title || "file",
      size: data.size || "",
      streams: data.streams || data.playlist || [],
      raw: data
    });

  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

module.exports = app;
