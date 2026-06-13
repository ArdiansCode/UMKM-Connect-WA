import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have a basic index.css
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'; // Import ChakraProvider for styling
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing

// Assuming you might want to wrap the app with ChakraProvider and Router
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
