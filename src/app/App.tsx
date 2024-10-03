import React from 'react';
import { WalletSetup } from '@/components/WalletSetup';

const App: React.FC = () => {
  const handleComplete = () => {
    // Handle wallet setup completion
    console.log('Wallet setup completed');
  };

  return (
    <div className="w-[357px] h-[600px] bg-gray-900 text-white">
      <WalletSetup initialStep="create" onComplete={handleComplete} />
    </div>
  );
};

export default App;