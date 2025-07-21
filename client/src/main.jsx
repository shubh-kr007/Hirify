import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx'; // Correct import
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider> {/* This is where ThemeProvider is used */}
        <App />
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>,
);