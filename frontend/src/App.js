import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WordList from './WordList';
import WordDetail from './WordDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WordList />} />
        <Route path=":kelime" element={<WordDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
