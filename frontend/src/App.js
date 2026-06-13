import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Box, Heading, Text, Center, VStack, Button } from '@chakra-ui/react';
import './App.css'; // General App styling

function SuccessPage({ onLogout }) {
  return (
    <Center minHeight="100vh">
      <VStack spacing={4}>
        <Heading color="teal.500">Berhasil Terhubung!</Heading>
        <Text>Akun Anda sudah terhubung dengan WhatsApp. Silakan cek WhatsApp Anda untuk pesan notifikasi.</Text>
        <Button colorScheme="red" onClick={onLogout}>
          Keluar (Logout)
        </Button>
      </VStack>
    </Center>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userWhatsapp', user.whatsappNumber);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userWhatsapp');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <Center minHeight="100vh">Loading...</Center>;
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={isAuthenticated ? <SuccessPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
