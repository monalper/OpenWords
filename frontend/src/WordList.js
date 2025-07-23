import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddWord from './AddWord';

const WordList = () => {
  const [words, setWords] = useState([]);

  const fetchWords = () => {
    fetch('http://localhost:3002/api/words')
      .then(res => res.json())
      .then(data => setWords(data));
  };

  useEffect(() => {
    fetchWords();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <AddWord onWordAdded={fetchWords} />
      <h1 style={{ fontWeight: 700, fontSize: 36, marginTop: 40 }}>Sözlük</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {words.map(word => (
          <li key={word.kelime} style={{ margin: '16px 0' }}>
            <Link to={`/${word.kelime}`} style={{ fontSize: 20, color: '#222', textDecoration: 'none', fontWeight: 500 }}>
              {word.kelime}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;
