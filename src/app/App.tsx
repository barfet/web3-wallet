import React from 'react';
import { WalletSetup } from '@/components/WalletSetup';

const App: React.FC = () => {
  const handleComplete = () => {
    // Handle wallet setup completion
    console.log('Wallet setup completed');
  };

  const handleBack = () => {
    // Handle back action (e.g., return to extension popup)
    console.log('Back to popup');
  };

  return (
    <div className="w-[357px] h-[600px] bg-gray-900 text-white">
      <WalletSetup initialStep="create" onComplete={handleComplete} onBack={handleBack} />
    </div>
  );
};

export default App;