import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vaccines from './pages/Vaccines';
import Food from './pages/Food';
import Walks from './pages/Walks';
import Vet from './pages/Vet';
import Schedule from './pages/Schedule';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PetProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="vaccines" element={<Vaccines />} />
              <Route path="food" element={<Food />} />
              <Route path="walks" element={<Walks />} />
              <Route path="vet" element={<Vet />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </PetProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
