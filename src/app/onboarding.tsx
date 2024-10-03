import React from 'react';
import { createRoot } from 'react-dom/client';
import { Onboarding } from '@/components/Onboarding';
import '../styles/globals.css';

const OnboardingApp: React.FC = () => {
  const handleStart = () => {
    // Logic to start wallet creation or import
    // Redirect to the appropriate page or component
  };

  return <Onboarding onStart={handleStart} />;
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