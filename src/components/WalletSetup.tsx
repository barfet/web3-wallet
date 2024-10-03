'use client'

/// <reference types="chrome"/>

import React, { useState, useCallback } from 'react';
import { Onboarding } from './Onboarding';
import { WelcomePage } from './WelcomePage';
import { SeedPhraseDisplay } from './SeedPhraseDisplay';
import { SeedPhraseConfirmation } from './SeedPhraseConfirmation';
import { PasswordSetup } from './PasswordSetup';
import { SendETH } from './SendETH'; // Make sure this import is correct
import { encryptSeedPhrase, generateSeedPhrase, isValidSeedPhrase } from '@/utils/cryptoUtils';
import { BaseWallet, Wallet, HDNodeWallet, ethers } from 'ethers';

export function WalletSetup() {
  const [step, setStep] = useState<'onboarding' | 'welcome' | 'seedPhrase' | 'confirmation' | 'password' | 'dashboard'>('onboarding');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [wallet, setWallet] = useState<HDNodeWallet | null>(null);

  const handleStart = useCallback(() => {
    setStep('welcome');
  }, []);

  const handleCreateWallet = useCallback(async () => {
    try {
      const newSeedPhrase = await generateSeedPhrase();
      if (isValidSeedPhrase(newSeedPhrase)) {
        setSeedPhrase(newSeedPhrase);
        const newWallet = Wallet.fromPhrase(newSeedPhrase);
        setWallet(newWallet);
        setStep('seedPhrase');
      } else {
        console.error('Generated invalid seed phrase');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  }, []);

  const handleImportWallet = useCallback(async (importedSeedPhrase: string) => {
    try {
      if (isValidSeedPhrase(importedSeedPhrase)) {
        const importedWallet = Wallet.fromPhrase(importedSeedPhrase) as BaseWallet;
        if (importedWallet instanceof ethers.HDNodeWallet) {
          setSeedPhrase(importedSeedPhrase);
          setWallet(importedWallet);
          setStep('password');
        } else {
          // Handle the case where the wallet is not an HDNodeWallet
          console.error('Imported wallet is not an HDNodeWallet');
          // Optionally, show an error message to the user
        }
      } else {
        console.error('Invalid seed phrase');
      }
    } catch (error) {
      console.error('Error importing wallet:', error);
    }
  }, []);

  const handleConfirmSeedPhrase = useCallback((isConfirmed: boolean) => {
    if (isConfirmed) {
      setStep('password');
    } else {
      // Handle incorrect confirmation (e.g., show error message, reset confirmation)
    }
  }, []);

  const handleSetPassword = useCallback(async (password: string) => {
    if (wallet && seedPhrase) {
      try {
        const encryptedSeedPhrase = await encryptSeedPhrase(seedPhrase, password);
        // Store encrypted seed phrase and wallet address
        chrome.storage.local.set({
          encryptedSeedPhrase,
          walletAddress: wallet.address,
        }, () => {
          // Clear sensitive data from memory
          setSeedPhrase('');
          // Do not clear the wallet here, as we need it for the SendETH component
          setStep('dashboard');
        });
      } catch (error) {
        console.error('Error encrypting seed phrase:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  }, [wallet, seedPhrase]);

  const handlePasswordSet = useCallback(() => {
    setStep('dashboard');
  }, []);

  return (
    <div className="w-[357px] h-[600px] bg-gray-900 text-white">
      <main className="h-full">
        {step === 'onboarding' && <Onboarding onStart={handleStart} />}
        {step === 'welcome' && (
          <WelcomePage onCreateWallet={handleCreateWallet} onImportWallet={handleImportWallet} />
        )}
        {step === 'seedPhrase' && seedPhrase && (
          <SeedPhraseDisplay seedPhrase={seedPhrase} onContinue={() => setStep('confirmation')} />
        )}
        {step === 'confirmation' && seedPhrase && (
          <SeedPhraseConfirmation seedPhrase={seedPhrase} onConfirm={handleConfirmSeedPhrase} />
        )}
        {step === 'password' && (
          <PasswordSetup onSetPassword={handleSetPassword} onPasswordSet={handlePasswordSet} />
        )}
        {step === 'dashboard' && wallet && (
          <SendETH wallet={wallet} />
        )}
      </main>
    </div>
  );
}