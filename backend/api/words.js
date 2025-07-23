import fs from 'fs/promises';
import path from 'path';

const WORDS_PATH = path.resolve(process.cwd(), '../words.json');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(WORDS_PATH, 'utf8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Veri okunamadı.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { kelime, tur, aciklamalar } = req.body;
      if (!kelime || !aciklamalar) {
        return res.status(400).json({ error: 'Eksik veri.' });
      }
      const data = await fs.readFile(WORDS_PATH, 'utf8');
      const words = JSON.parse(data);
      if (words.find(w => w.kelime.toLowerCase() === kelime.toLowerCase())) {
        return res.status(409).json({ error: 'Kelime zaten var.' });
      }
      const newWord = tur ? { kelime, tur, aciklamalar } : { kelime, aciklamalar };
      words.push(newWord);
      await fs.writeFile(WORDS_PATH, JSON.stringify(words, null, 2));
      res.status(201).json({ message: 'Kelime eklendi.' });
    } catch (err) {
      res.status(500).json({ error: 'Veri kaydedilemedi.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
