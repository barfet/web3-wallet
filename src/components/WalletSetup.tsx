'use client'

/// <reference types="chrome"/>

import React, { useState } from 'react';
import { ethers, HDNodeWallet } from 'ethers';
import { WelcomePage } from './WelcomePage';
import { SeedPhraseDisplay } from './SeedPhraseDisplay';
import { SeedPhraseConfirmation } from './SeedPhraseConfirmation';
import { PasswordSetup } from './PasswordSetup';
import { encryptSeedPhrase, generateSeedPhrase, isValidSeedPhrase } from '@/utils/cryptoUtils';
import { Wallet } from 'ethers';

export function WalletSetup() {
  const [step, setStep] = useState<'welcome' | 'seedPhrase' | 'confirmation' | 'password'>('welcome');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [wallet, setWallet] = useState<HDNodeWallet | null>(null);

  const handleCreateWallet = () => {
    const newSeedPhrase = generateSeedPhrase();
    setSeedPhrase(newSeedPhrase);
    if (isValidSeedPhrase(newSeedPhrase)) {
      const newWallet = Wallet.fromPhrase(newSeedPhrase);
      setWallet(newWallet);
      setStep('seedPhrase');
    } else {
      console.error('Generated invalid seed phrase');
      // Handle error (e.g., show error message to user)
    }
  };

  const handleImportWallet = (importedSeedPhrase: string) => {
    if (isValidSeedPhrase(importedSeedPhrase)) {
      const importedWallet = Wallet.fromPhrase(importedSeedPhrase);
      setSeedPhrase(importedSeedPhrase);
      setWallet(importedWallet);
      setStep('password');
    } else {
      console.error('Invalid seed phrase');
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

  return (
    <div className="w-[357px] h-[600px] bg-gray-900 text-white">
    <main className="h-full">
      {step === 'welcome' && (
        <WelcomePage onCreateWallet={handleCreateWallet} onImportWallet={handleImportWallet} />
      )}
      {step === 'seedPhrase' && (
        <SeedPhraseDisplay seedPhrase={seedPhrase} onContinue={() => setStep('confirmation')} />
      )}
      {step === 'confirmation' && (
        <SeedPhraseConfirmation seedPhrase={seedPhrase} onConfirm={handleConfirmSeedPhrase} />
      )}
      {step === 'password' && (
        <PasswordSetup onSetPassword={handleSetPassword} />
      )}
    </main>
  </div>
  );
}