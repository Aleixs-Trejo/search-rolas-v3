// React
import React from "react";

// CSS
import './App.css';

// React-Router-Dom
import { HashRouter, Routes, Route } from 'react-router-dom'

// Pages
import Home from "./pages/Home";
import SongDetail from "./pages/SongDetail";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<SongDetail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;