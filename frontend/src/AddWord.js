import React, { useState } from 'react';

const AddWord = ({ onWordAdded }) => {
  const [kelime, setKelime] = useState('');

  const [aciklamalar, setAciklamalar] = useState(['']);
  const [mesaj, setMesaj] = useState('');

  const handleAciklamaChange = (i, val) => {
    const yeni = [...aciklamalar];
    yeni[i] = val;
    setAciklamalar(yeni);
  };

  const handleAddAciklama = () => {
    setAciklamalar([...aciklamalar, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj('');

    const aciklamaList = aciklamalar.map(a => a.trim()).filter(Boolean);
    if (!kelime || !aciklamaList.length) {
      setMesaj('Tüm alanları doldurun.');
      return;
    }
    const resp = await fetch('http://localhost:3002/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kelime, aciklamalar: aciklamaList })
    });
    if (resp.ok) {
      setMesaj('Kelime eklendi!');
      setKelime(''); setAciklamalar(['']);
      if (onWordAdded) onWordAdded();
    } else {
      const data = await resp.json();
      setMesaj(data.error || 'Bir hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '40px auto', background: '#fafafa', padding: 24, borderRadius: 8 }}>
      <h2 style={{ fontWeight: 600, fontSize: 24 }}>Yeni Kelime Ekle</h2>
      <div style={{ marginBottom: 12 }}>
        <input value={kelime} onChange={e => setKelime(e.target.value)} placeholder="Kelime" style={{ width: '100%', padding: 8, fontSize: 16 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        {aciklamalar.map((a, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <input value={a} onChange={e => handleAciklamaChange(i, e.target.value)} placeholder={`Açıklama ${i+1}`} style={{ width: '90%', padding: 8, fontSize: 16 }} />
          </div>
        ))}
        <button type="button" onClick={handleAddAciklama} style={{ marginTop: 4 }}>+ Açıklama Ekle</button>
      </div>
      <button type="submit" style={{ padding: '10px 24px', fontSize: 16, fontWeight: 600 }}>Ekle</button>
      {mesaj && <div style={{ marginTop: 16, color: mesaj.includes('eklendi') ? 'green' : 'red' }}>{mesaj}</div>}
    </form>
  );
};

export default AddWord;
