import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" />;
  return children;
}

export default function App(){
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/app/*" element={<Protected><Dashboard /></Protected>} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}
