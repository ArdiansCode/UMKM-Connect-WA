import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack, Heading, Alert, AlertIcon } from '@chakra-ui/react';
import { registerUser } from '../services/apiService'; // Import API functions
// Removed unused import: import logger from '../utils/logger'; 

// Added onLoginSuccess prop from App.js
function LoginPage({ onLoginSuccess }) {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [name, setName] = useState(''); // For registration
  const [businessName, setBusinessName] = useState(''); // For registration
  const [businessType, setBusinessType] = useState(''); // For registration
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Handle Registration (Only)
    if (!whatsappNumber || !name || !businessName || !businessType) {
      setError('Semua data diperlukan untuk pendaftaran.');
      return;
    }
    try {
      const response = await registerUser({ name, whatsappNumber, businessName, businessType });
      console.log("Registration response:", response);
      
      // Store user info in localStorage for SuccessPage display
      localStorage.setItem('userName', name);
      onLoginSuccess(null, { id: response.user.id, name, whatsappNumber });
      navigate('/'); // Redirect to SuccessPage
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="gray.50"
      px={4}
    >
      <Box
        p={8}
        maxWidth="450px"
        width="full"
        bg="white"
        boxShadow="md"
        borderRadius="lg"
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" color="teal.500">
            UMKM Connect WA
          </Heading>
          <Heading as="h2" size="lg" textAlign="center" color="gray.700">
            Daftar Akun
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
                  <Input
                    type="text"
                    placeholder="Nama Lengkap Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Nama Bisnis UMKM"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Jenis Usaha (Makanan, Pakaian, dll.)"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                  />
              <Input
                type="tel"
                placeholder="Nomor WhatsApp (contoh: 6281234567890)"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
              />
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">{error}</Text>
                </Alert>
              )}
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
              >
                Daftar
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}

export default LoginPage;
