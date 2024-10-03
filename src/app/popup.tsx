import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { WalletSetup } from '@/components/WalletSetup';
import '../styles/globals.css';

const Popup: React.FC = () => {
  const [currentView, setCurrentView] = useState<'app' | 'create' | 'import' | 'setup'>('setup');

  useEffect(() => {
    const checkWalletSetup = async () => {
      const result = await chrome.storage.local.get(['walletAddress']);
      if (result.walletAddress) {
        setCurrentView('app');
      } else {
        // If no wallet is set up, open the full onboarding page
        chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
        window.close(); // Close the popup
      }
    };

    checkWalletSetup();
  }, []);

  const handleBack = () => {
    setCurrentView('setup');
  };

  return (
    <div className="w-[357px] h-[600px] bg-gray-900 text-white">
      {currentView === 'app' && <App />}
      {currentView === 'create' && <WalletSetup initialStep="create" onComplete={() => setCurrentView('app')} onBack={handleBack} />}
      {currentView === 'import' && <WalletSetup initialStep="import" onComplete={() => setCurrentView('app')} onBack={handleBack} />}
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
