'use client'

import React, { useState, useCallback } from 'react';
import { WelcomePage } from './WelcomePage';
import { SeedPhraseDisplay } from './SeedPhraseDisplay';
import { SeedPhraseConfirmation } from './SeedPhraseConfirmation';
import { PasswordSetup } from './PasswordSetup';
import { SendETH } from './SendETH';
import { encryptSeedPhrase, generateSeedPhrase, isValidSeedPhrase } from '@/utils/cryptoUtils';
import { BaseWallet, Wallet, HDNodeWallet, ethers } from 'ethers';

type Step = 'welcome' | 'seedPhrase' | 'confirmation' | 'password' | 'dashboard';

interface WalletSetupProps {
  initialStep: 'create' | 'import';
  onComplete: () => void;
  isFullScreen?: boolean;
}

export function WalletSetup({ initialStep, onComplete, isFullScreen = false }: WalletSetupProps) {
  const [step, setStep] = useState<Step>(initialStep === 'create' ? 'seedPhrase' : 'welcome');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [wallet, setWallet] = useState<HDNodeWallet | null>(null);

  const handleCreateNewWallet = useCallback(async () => {
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
          console.error('Imported wallet is not an HDNodeWallet');
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
          onComplete(); // Call onComplete to signal that the setup is finished
        });
      } catch (error) {
        console.error('Error encrypting seed phrase:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  }, [wallet, seedPhrase, onComplete]);

  // Call handleCreateNewWallet immediately if initialStep is 'create'
  React.useEffect(() => {
    if (initialStep === 'create') {
      handleCreateNewWallet();
    }
  }, [initialStep, handleCreateNewWallet]);

  const containerClass = isFullScreen 
    ? "min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-white p-4" 
    : "w-[357px] h-[600px] bg-gray-900 text-white";

  return (
    <div className={containerClass}>
      <main className="h-full">
        {step === 'welcome' && (
          <WelcomePage onCreateWallet={handleCreateNewWallet} onImportWallet={handleImportWallet} />
        )}
        {step === 'seedPhrase' && seedPhrase && (
          <SeedPhraseDisplay seedPhrase={seedPhrase} onContinue={() => setStep('confirmation')} />
        )}
        {step === 'confirmation' && seedPhrase && (
          <SeedPhraseConfirmation seedPhrase={seedPhrase} onConfirm={handleConfirmSeedPhrase} />
        )}
        {step === 'password' && (
          <PasswordSetup onSetPassword={handleSetPassword} onPasswordSet={() => {}} />
        )}
        {step === 'dashboard' && wallet && (
          <SendETH wallet={wallet} />
        )}
      </main>
    </div>
  );
}