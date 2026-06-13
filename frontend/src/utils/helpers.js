// src/utils/helpers.js

// Example helper function for formatting dates
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if formatting fails
  }
};

// Add more helper functions as needed
// For example, a function to escape HTML or sanitize strings if necessary
