import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import Layout from './components/Layout';
import './index.css';

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('fittrack_token'));

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e2d45', color: '#f0f4ff', border: '1px solid #2a3f5f' }
      }} />
      <Routes>
        <Route path="/" element={<Navigate to={auth ? '/dashboard' : '/login'} />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/signup" element={<Signup setAuth={setAuth} />} />
        <Route element={auth ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;