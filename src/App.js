import React from 'react';
import { BrowserRouter, Route, Routes, NavLink, Navigate } from 'react-router-dom';  // Correct imports for react-router-dom v6+
import './component/Home/App.css';

import PcosForm from './component/Home/PcosForm';  // Adjust path if necessary

const App = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">


          <div className="nav-links-container">
            <ul className="nav-links">
              <li><NavLink to="/pcos" className={({ isActive }) => (isActive ? 'active' : '')}>Prediction Form</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/pcos" element={<PcosForm />} />
        </Routes>
      </main>
    </div>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
