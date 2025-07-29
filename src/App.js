import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas
import Home from './pages/Home';
import DetalleReceta from './pages/DetalleReceta';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Página de detalle de receta */}
          <Route path="/receta/:id" element={<DetalleReceta />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
