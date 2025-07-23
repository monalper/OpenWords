import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3002;
const WORDS_PATH = path.resolve('../words.json');

app.use(cors());
app.use(bodyParser.json());

// Tüm kelimeleri getir
app.get('/api/words', (req, res) => {
  fs.readFile(WORDS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Veri okunamadı.' });
    res.json(JSON.parse(data));
  });
});

// Belirli bir kelimeyi getir
app.get('/api/words/:kelime', (req, res) => {
  fs.readFile(WORDS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Veri okunamadı.' });
    const words = JSON.parse(data);
    const word = words.find(w => w.kelime.toLowerCase() === req.params.kelime.toLowerCase());
    if (!word) return res.status(404).json({ error: 'Kelime bulunamadı.' });
    res.json(word);
  });
});

// Yeni kelime ekle
app.post('/api/words', (req, res) => {
  const { kelime, tur, aciklamalar } = req.body;
  if (!kelime || !aciklamalar) {
    return res.status(400).json({ error: 'Eksik veri.' });
  }
  fs.readFile(WORDS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Veri okunamadı.' });
    const words = JSON.parse(data);
    if (words.find(w => w.kelime.toLowerCase() === kelime.toLowerCase())) {
      return res.status(409).json({ error: 'Kelime zaten var.' });
    }
    // tur gönderilmediyse objeye ekleme
    const newWord = tur ? { kelime, tur, aciklamalar } : { kelime, aciklamalar };
    words.push(newWord);
    fs.writeFile(WORDS_PATH, JSON.stringify(words, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Veri kaydedilemedi.' });
      res.status(201).json({ message: 'Kelime eklendi.' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend API ${PORT} portunda çalışıyor.`);
});
