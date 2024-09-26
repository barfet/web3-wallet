import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { setWallet } from '../actions/walletActions';
import { encryptSeedPhrase } from '../utils/crypto';

const WalletSetup: React.FC = () => {
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();

  const generateWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    setSeedPhrase(wallet.mnemonic.phrase);
  };

  const createWallet = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    try {
      const wallet = ethers.Wallet.fromMnemonic(seedPhrase);
      const encryptedSeedPhrase = await encryptSeedPhrase(seedPhrase, password);
      dispatch(setWallet(wallet.address, encryptedSeedPhrase));
      chrome.storage.local.set({ encryptedSeedPhrase, address: wallet.address }, () => {
        console.log('Wallet stored successfully');
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Error creating wallet: ' + e.message);
      } else {
        setError('An unknown error occurred while creating the wallet');
      }
    }
  };

  const importWallet = async () => {
    try {
      ethers.utils.mnemonicToEntropy(seedPhrase);
      const wallet = ethers.Wallet.fromMnemonic(seedPhrase);
      const encryptedSeedPhrase = await encryptSeedPhrase(seedPhrase, password);
      dispatch(setWallet(wallet.address, encryptedSeedPhrase));
      chrome.storage.local.set({ encryptedSeedPhrase, address: wallet.address }, () => {
        console.log('Wallet imported successfully');
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Invalid seed phrase or error importing wallet: ' + e.message);
      } else {
        setError('An unknown error occurred while importing the wallet');
      }
    }
  };

  return (
    <div>
      <h2>Wallet Setup</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={generateWallet}>Generate New Wallet</button>
      <textarea 
        value={seedPhrase} 
        onChange={(e) => setSeedPhrase(e.target.value)}
        placeholder="Enter seed phrase to import wallet"
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <input 
        type="password" 
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
      />
      <button onClick={createWallet}>Create Wallet</button>
      <button onClick={importWallet}>Import Wallet</button>
    </div>
  );
};

export default WalletSetup;