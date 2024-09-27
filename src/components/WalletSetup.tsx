'use client'

/// <reference types="chrome"/>

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { WelcomePage } from './WelcomePage';
import { SeedPhraseDisplay } from './SeedPhraseDisplay';
import { SeedPhraseConfirmation } from './SeedPhraseConfirmation';
import { PasswordSetup } from './PasswordSetup';
import { encryptSeedPhrase, generateSeedPhrase } from '@/utils/cryptoUtils';
import { HDNodeWallet } from 'ethers';

export function WalletSetup() {
  const [step, setStep] = useState<'welcome' | 'seedPhrase' | 'confirmation' | 'password'>('welcome');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [wallet, setWallet] = useState<HDNodeWallet | null>(null);

  const handleCreateWallet = async () => {
    const newSeedPhrase = generateSeedPhrase();
    setSeedPhrase(newSeedPhrase);
    const mnemonic = ethers.Mnemonic.fromPhrase(newSeedPhrase);
    const newWallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
    setWallet(newWallet);
    setStep('seedPhrase');
  };

  const handleImportWallet = (importedSeedPhrase: string) => {
    try {
      const mnemonic = ethers.Mnemonic.fromPhrase(importedSeedPhrase);
      const importedWallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
      setSeedPhrase(importedSeedPhrase);
      setWallet(importedWallet);
      setStep('password');
    } catch (error) {
      console.error('Invalid seed phrase:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleConfirmSeedPhrase = (isConfirmed: boolean) => {
    if (isConfirmed) {
      setStep('password');
    } else {
      // Handle incorrect confirmation (e.g., show error message, reset confirmation)
    }
  };

  const handleSetPassword = async (password: string) => {
    if (wallet) {
      try {
        const encryptedSeedPhrase = await encryptSeedPhrase(seedPhrase, password);
        // Store encrypted seed phrase and wallet address
        chrome.storage.local.set({
          encryptedSeedPhrase,
          walletAddress: wallet.address,
        }, () => {
          // Navigate to main wallet interface or dashboard
          // This part depends on your app's routing mechanism
        });
      } catch (error) {
        console.error('Error encrypting seed phrase:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  switch (step) {
    case 'welcome':
      return <WelcomePage onCreateWallet={handleCreateWallet} onImportWallet={handleImportWallet} />;
    case 'seedPhrase':
      return <SeedPhraseDisplay seedPhrase={seedPhrase} onContinue={() => setStep('confirmation')} />;
    case 'confirmation':
      return <SeedPhraseConfirmation seedPhrase={seedPhrase} onConfirm={handleConfirmSeedPhrase} />;
    case 'password':
      return <PasswordSetup onSetPassword={handleSetPassword} />;
    default:
      return null;
  }
}