import axios from 'axios';
// Removed unused import: import config from '../config'; 
// Removed unused import: import { formatDate } from '../utils/helpers'; // This should be used in components, not here
// Removed unused import: import logger from '../utils/logger'; // Front-end logger not set up yet, use console.log for now

// Using environment variable for API URL
// Added default for local development if REACT_APP_API_URL is not set
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
  // You can add headers here, e.g., for authentication tokens
  // headers: {
  //   'Authorization': `Bearer ${localStorage.getItem('token')}`
  // }
});

// Interceptor to add auth token if available (for future use)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Example of getting token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Function to handle user registration
export const registerUser = async (userData) => {
  try {
    // Assuming the backend endpoint is '/auth/register'
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    // Assuming the backend endpoint is '/auth/login'
    const response = await api.post('/auth/login', credentials);
    // Assuming response.data.token contains the auth token and response.data.user has user details
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    // Store user info like ID and name for context
    if (response.data.user) {
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('userName', response.data.user.name);
        localStorage.setItem('userWhatsapp', response.data.user.whatsappNumber);
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Function to send chat message to backend for processing
export const sendMessageToBackend = async (message) => {
  try {
    // The backend endpoint '/chat/process-message' is a direct call from frontend to backend.
    // This is for the chat simulation on the web UI.
    // For actual WhatsApp integration, the backend would receive via Twilio webhook.
    const response = await api.post('/chat/process-message', {
      message: message,
      // In a real scenario, you'd pass user context if logged in.
      // For initial demo, let the backend infer user from sender number (which it doesn't have for web UI)
      // or we'll need a way to associate web session with user.
      // Let's assume for now the backend might use a hardcoded/session-based user for web chat.
      // IMPORTANT: For this web-chat simulation, the backend needs to know who 'sent' the message.
      // A better approach would be to get user details after login and pass them.
      // For simplicity in this setup, we need backend to handle this.
    });
    // Assuming backend returns { reply: "bot's response" }
    return response.data; 
  } catch (error) {
    console.error("Error sending message to backend:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Function to fetch chat history (if needed)
export const fetchChatHistory = async () => {
    try {
        // Assuming /chat/history is an endpoint that returns chat history for the current user
        const response = await api.get('/chat/history'); 
        return response.data.history;
    } catch (error) {
        console.error("Error fetching chat history:", error.response?.data?.message || error.message);
        throw error;
    }
};

export default api;
