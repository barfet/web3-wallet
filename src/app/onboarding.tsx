import React from 'react';
import { createRoot } from 'react-dom/client';
import { Onboarding } from '@/components/Onboarding';
import '../styles/globals.css';

const OnboardingApp: React.FC = () => {
  const handleComplete = () => {
    // Close the onboarding tab and open the popup
    window.close();
    chrome.action.openPopup();
  };

  return <Onboarding onComplete={handleComplete} />;
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <OnboardingApp />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}