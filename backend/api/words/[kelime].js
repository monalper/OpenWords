import fs from 'fs/promises';
import path from 'path';

const WORDS_PATH = path.resolve(process.cwd(), '../words.json');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(WORDS_PATH, 'utf8');
      const words = JSON.parse(data);
      const { kelime } = req.query;
      const word = words.find(w => w.kelime.toLowerCase() === kelime.toLowerCase());
      if (!word) return res.status(404).json({ error: 'Kelime bulunamadı.' });
      res.status(200).json(word);
    } catch (err) {
      res.status(500).json({ error: 'Veri okunamadı.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
