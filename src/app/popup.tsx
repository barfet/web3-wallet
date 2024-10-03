import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../styles/globals.css';

const Popup: React.FC = () => {
  useEffect(() => {
    const checkWalletSetup = async () => {
      const result = await chrome.storage.local.get(['walletAddress']);
      if (!result.walletAddress) {
        // Redirect to onboarding page if no wallet is set up
        window.location.href = chrome.runtime.getURL('onboarding.html');
      }
    };

    checkWalletSetup();
  }, []);

  return (
    <div className="w-[357px] h-[600px] bg-gray-900 text-white">
      <App />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
