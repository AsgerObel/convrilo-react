import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import FileConverter from './components/FileConverter';
import Pricing from './pages/Pricing';
import Updates from './pages/Updates';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<FileConverter />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;