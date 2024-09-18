import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OccupationSwitch from './OccupationSwitch';
import MainContent from './MainContent';
import FileInput from './FileInput';
import PageWrapper from './PageWrapper';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OccupationSwitch />} />
        <Route path="/homepage" element={<><MainContent /><PageWrapper /></>} />
        <Route path="/file-input" element={<FileInput />} />
      </Routes>
    </Router>
  );
};

export default App;
