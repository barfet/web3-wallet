import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WalletSetup from './WalletSetup';
import { RootState } from '../store';
import { setWallet } from '../actions/walletActions';
import { AnyAction } from 'redux';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const wallet = useSelector((state: RootState) => state.wallet);
  const dispatch = useDispatch();

  useEffect(() => {
    chrome.storage.local.get(['address', 'encryptedSeedPhrase'], (result: { address?: string; encryptedSeedPhrase?: string }) => {
      if (result.address && result.encryptedSeedPhrase) {
        dispatch(setWallet(result.address, result.encryptedSeedPhrase));
      }
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      <div className="header">Web3 Wallet</div>
      <div className="container">
        {!wallet.address ? (
          <WalletSetup />
        ) : (
          <div>
            <div className="wallet-address">
              <strong>Wallet Address:</strong><br />
              {wallet.address}
            </div>
            {/* Add more wallet management components here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;