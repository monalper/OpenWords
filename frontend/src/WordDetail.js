import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Modern ve kart tabanlı bir görünüm için stiller
const mobileStyles = `
.word-detail-bg {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #e5faff;
  font-family: serif;
}
.word-detail-box {
  background: #fff;
  border: 1.2px solid #3333;
  box-sizing: border-box;
  margin: 48px 0 0 0;
  width: 96vw;
  max-width: 390px;
  min-width: 0;
  padding: 32px 24px 24px 24px;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.word-detail-title {
  font-family: serif;
  font-weight: 700;
  font-size: 2.3rem;
  margin-bottom: 8px;
  word-break: break-word;
  color: #111;
  text-align: left;
}

.word-detail-hr {
  margin: 12px 0 18px 0;
  border: none;
  border-top: 1px solid #aaa;
  width: 100%;
}
.word-detail-icons {
  display: flex;
  gap: 22px;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 2px;
}
.word-detail-icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 1.25rem;
  color: #444;
  transition: color 0.14s;
  position: relative;
}
.word-detail-icon-btn:hover {
  color: #000;
}
.word-detail-tooltip {
  position: absolute;
  left: 50%;
  top: 120%;
  transform: translateX(-50%);
  background: #222;
  color: #fff;
  font-size: 0.97rem;
  padding: 5px 14px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 2px 8px #0002;
}
.word-detail-fav {
  color: #eab308;
}
.word-detail-fav-empty {
  color: #bbb;
}
.word-detail-edit {
  color: #444;
}
.word-detail-desc {
  margin-top: 10px;
  font-size: 1.08rem;
  color: #111;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
}
.word-detail-headword {
  font-weight: bold;
  color: #111;
}
.word-detail-translation {
  font-style: italic;
  color: #4b5563;
  font-weight: 400;
  margin-left: 2px;
}
@media (max-width: 600px) {
  .word-detail-box {
    margin-top: 20px;
    padding: 18px 2vw 18px 2vw;
  }
  .word-detail-title {
    font-size: 36px;
  }
}
`;


const icons = {
  lang: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 5h14M4 5l7 12m7-12l-7 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  ),
  star: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor"><path d="M11 3.5l2.45 6.36h6.08l-4.92 3.93 1.89 6.21L11 14.34l-5.5 3.66 1.89-6.21-4.92-3.93h6.08z" /></svg>
  ),
  starEmpty: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M11 3.5l2.45 6.36h6.08l-4.92 3.93 1.89 6.21L11 14.34l-5.5 3.66 1.89-6.21-4.92-3.93h6.08z" /></svg>
  ),
  edit: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5zm9.71-7.04a1 1 0 0 1 1.42 1.42l-1.09 1.09-2.5-2.5 1.09-1.09a1 1 0 0 1 1.42 0z" stroke="currentColor" strokeWidth="1.4"/></svg>
  )
};

const WordDetail = () => {
  const { kelime } = useParams();
  const [word, setWord] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [fav, setFav] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://openwords-backend.vercel.app/api/words/${kelime}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setWord(data))
      .catch(() => setNotFound(true));
  }, [kelime]);

  if (notFound) return (
    <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
      <h2>Kelime bulunamadı.</h2>
      <Link to="/">Ana sayfa</Link>
    </div>
  );

  if (!word) return null;

  // Çeviri örneği: word.en veya word.ceviri
  const translation = word.en || word.ceviri || null;

  // Favori toggle (dummy/local)
  const handleFav = () => setFav(v => !v);

  // Tooltip için gecikmeli göster/gizle
  let tooltipTimeout;
  const handleTooltipShow = () => {
    clearTimeout(tooltipTimeout);
    setShowTooltip(true);
  };
  const handleTooltipHide = () => {
    tooltipTimeout = setTimeout(() => setShowTooltip(false), 200);
  };

  return (
    <div className="word-detail-bg">
      <style>{mobileStyles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <div className="word-detail-box">
        <div className="word-detail-title">{word.kelime.charAt(0).toUpperCase() + word.kelime.slice(1)}</div>
        <hr className="word-detail-hr" />

        <div className="word-detail-desc">
          <span className="word-detail-headword">
            {word.kelime.charAt(0).toUpperCase() + word.kelime.slice(1)}
          </span>
          {translation && (
            <span className="word-detail-translation"> (eng. <i>{translation}</i>)</span>
          )}
          {' – '}
          {Array.isArray(word.aciklamalar) && word.aciklamalar.length > 0 ? (
  <>
    {word.aciklamalar[0]}
    {word.aciklamalar.length > 1 && (
      <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18, fontSize: '0.97rem', color: '#444' }}>
        {word.aciklamalar.slice(1).map((aciklama, idx) => (
          <li key={idx}>{aciklama}</li>
        ))}
      </ul>
    )}
  </>
) : 'Açıklama bulunamadı.'}
        </div>
      </div>
    </div>
  );
};

export default WordDetail;
