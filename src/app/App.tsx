import React from 'react';
import { WalletSetup } from '@/components/WalletSetup';

const App: React.FC = () => {
  return (
    <div className="w-[400px] h-[600px] bg-purple-700 text-white p-4">
      <WalletSetup />
    </div>
  );
};

export default App;