import React, { useState, useEffect, useRef } from 'react';
import { Box, Input, Text, VStack, HStack, Button, Spinner, Divider, Heading, Avatar, Tooltip, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { sendMessageToBackend, fetchChatHistory } from '../services/apiService'; // Assuming these functions exist
import { formatDate } from '../utils/helpers'; // From our helpers module

function ChatPage({ onLogout }) { // Destructure onLogout prop
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start with loading state for initial history fetch
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null); // Ref to scroll to bottom
  const navigate = useNavigate(); // Hook for navigation

  // Get user details from localStorage
  const userName = localStorage.getItem('userName') || 'Pengguna';
  const userWhatsapp = localStorage.getItem('userWhatsapp') || 'Num';
  // userId might be useful, but for now we assume backend handles user context implicitly or via token

  // Mock initial messages if history fetch fails or is not implemented yet
  const initialBotMessage = {
    id: 'bot-welcome-1',
    text: "Halo! Selamat datang di UMKM Connect WA. Ketik /menu untuk memulai.",
    sender: 'bot',
    timestamp: new Date().toISOString(), // Use ISO string for consistency
  };

  // Function to fetch chat history on load
  const fetchHistory = async () => {
    setError(''); // Clear previous errors
    try {
      // fetchChatHistory now calls '/api/chat/history'
      const history = await fetchChatHistory(); // Should return an array of messages
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // If no history, start with the welcome message
        setMessages([initialBotMessage]);
      }
    } catch (err) {
      console.error("Chat history fetch error:", err);
      setError("Gagal memuat riwayat obrolan. Menampilkan pesan selamat datang.");
      setMessages([initialBotMessage]); // Fallback to welcome message on error
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    fetchHistory(); // Fetch history when component mounts
  }, []); // Empty dependency array means this runs once on mount

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessageObj = {
      id: `user-${Date.now()}`, // Simple unique ID
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(), // Use ISO string for consistency
    };

    setMessages(prevMessages => [...prevMessages, userMessageObj]);
    const trimmedInput = inputMessage.trim();
    setInputMessage(''); // Clear input field immediately
    setIsLoading(true);
    setError(''); // Clear previous errors

    try {
        // Call backend API to process message
        // Ensure backend can associate this message with the correct user context
        const botResponse = await sendMessageToBackend(trimmedInput); 

        const botMessageObj = {
            id: `bot-${Date.now()}`, // Simple unique ID
            text: botResponse.reply || botResponse.message || "Maaf, saya tidak bisa memproses permintaan Anda saat ini.", // Adjust based on backend response structure
            sender: 'bot',
            timestamp: new Date().toISOString(), // Use ISO string for consistency
        };
        setMessages(prevMessages => [...prevMessages, botMessageObj]);

    } catch (err) {
        console.error("Error sending message to backend:", err.response?.data?.message || err.message);
        const errorMessageObj = {
            id: `error-${Date.now()}`,
            text: `Pesan tidak terkirim. Terjadi kesalahan: ${err.response?.data?.message || err.message}. Silakan coba lagi.`,
            sender: 'bot',
            timestamp: new Date().toISOString(), // Use ISO string for consistency
        };
        setMessages(prevMessages => [...prevMessages, errorMessageObj]);
        setError("Gagal mengirim pesan.");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to scroll to the bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline
      handleSendMessage();
    }
  };

  const handleLogoutClick = () => {
    onLogout(); // Call the logout handler passed from App.js
    navigate('/login'); // Redirect to login page
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bg="gray.100"
      p={0}
    >
      {/* Header */}
      <Box
        bg="teal.500"
        color="white"
        py={3}
        px={{ base: 4, md: 6 }} // Responsive padding
        boxShadow="sm"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <VStack align="start" spacing={0}>
          <Heading size="lg">UMKM Connect WA</Heading>
          <Text fontSize="sm">Asisten AI Anda untuk Bisnis</Text>
        </VStack>

        {/* User Info and Logout Button */}
        <HStack spacing={4}>
          <VStack align="end" spacing={0}>
            <Text fontWeight="bold">{userName}</Text>
            <Text fontSize="xs" opacity={0.8}>{userWhatsapp}</Text>
          </VStack>
          {/* Avatar for user */}
          <Avatar name={userName && userName.length > 0 ? userName[0] : '?'} size="md" bg="teal.300" color="white" />
          <Button
            colorScheme="teal"
            variant="outline"
            size="sm"
            onClick={handleLogoutClick}
            _hover={{ bg: "teal.600", color: "white" }}
          >
            Keluar
          </Button>
        </HStack>
      </Box>

      {/* Chat Area */}
      <Box
        flex="1"
        overflowY="auto"
        p={{ base: 2, md: 6 }} // Responsive padding
        css={{
          '&::-webkit-scrollbar': { width: '0.8rem', },
          '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '0.5rem', },
          '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '0.5rem', },
          '&::-webkit-scrollbar-thumb:hover': { background: '#555', },
        }}
      >
        {/* Initial loading state */}
        {isLoading && messages.length === 0 && (
          <VStack h="full" justify="center">
            <Spinner size="xl" color="teal.500" />
            <Text color="gray.600">Memuat riwayat obrolan...</Text>
          </VStack>
        )}
        
        {/* Render messages */}
        {messages.map((msg) => (
          <Box
            key={msg.id}
            mb={4}
            display="flex"
            justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            alignItems="flex-end" // Align avatar/timestamp with bubble
          >
            {msg.sender === 'bot' && (
              <Tooltip label={formatDate(new Date(msg.timestamp))} placement="top">
                <Avatar name="Bot" size="sm" bg="teal.300" color="white" mr={2} />
              </Tooltip>
            )}
            <Box
              maxW={{ base: "85%", md: "70%" }} // Responsive max width
              p={3}
              borderRadius="lg"
              bg={msg.sender === 'user' ? 'teal.500' : 'white'}
              color={msg.sender === 'user' ? 'white' : 'gray.800'}
              boxShadow="sm"
              borderTopLeftRadius={msg.sender === 'user' ? 'lg' : '0'}
              borderTopRightRadius={msg.sender === 'user' ? '0' : 'lg'}
            >
              <Text whiteSpace="pre-wrap">{msg.text}</Text>
            </Box>
            {/* Timestamp for bot messages */}
            {msg.sender === 'bot' && (
              <Tooltip label={formatDate(new Date(msg.timestamp))} placement="top">
                <Box ml={2} fontSize="xs" color="gray.500">
                  {/* Can show relative time if needed */}
                </Box>
              </Tooltip>
            )}
            {/* Timestamp for user messages */}
            {msg.sender === 'user' && (
              <Tooltip label={formatDate(new Date(msg.timestamp))} placement="top">
                <Box ml={2} fontSize="xs" color="gray.500">
                   {/* Can show relative time if needed */}
                </Box>
              </Tooltip>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} /> {/* This div will be the scroll target */}
      </Box>

      {/* Input Area */}
      <Box
        bg="white"
        p={4}
        borderTop="1px solid #e2e8f0"
        boxShadow="lg"
      >
        <HStack spacing={4}>
          <Input
            placeholder="Ketik pesan Anda..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress} // Allow sending with Enter key
            size="lg"
            _focus={{ borderColor: 'teal.400', boxShadow: 'outline' }}
            borderRadius="md"
            isDisabled={isLoading}
          />
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleSendMessage}
            isLoading={isLoading}
            isDisabled={!inputMessage.trim() || isLoading}
            borderRadius="md"
          >
            Kirim
          </Button>
        </HStack>
        {error && (
          <Alert status="error" borderRadius="md" mt={2}>
            <AlertIcon />
            <Text fontSize="sm">{error}</Text>
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default ChatPage;
