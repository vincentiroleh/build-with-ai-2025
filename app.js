import express from 'express';
import { askGemini } from './gemini.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

// Serve static chat page
app.use(express.static('public'));

app.post('/support', async (req, res) => {
  const { question } = req.body;
  try {
    const reply = await askGemini(question);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Chat UI available at http://localhost:${PORT}/chat.html`));
