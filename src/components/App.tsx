import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WalletSetup from './WalletSetup';
import { RootState } from '../store';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const wallet = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    chrome.storage.local.get(['address', 'encryptedSeedPhrase'], (result: { address?: string; encryptedSeedPhrase?: string }) => {
      if (result.address && result.encryptedSeedPhrase) {
        store.dispatch({
          type: 'SET_WALLET',
          payload: { address: result.address, encryptedSeedPhrase: result.encryptedSeedPhrase }
        });
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Web3 Wallet</h1>
      {!wallet.address ? (
        <WalletSetup />
      ) : (
        <div>
          <p>Wallet Address: {wallet.address}</p>
          {/* Add more wallet management components here */}
        </div>
      )}
    </div>
  );
};

export default App;