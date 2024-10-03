'use client'

import React, { useState, useCallback } from 'react';
import { WelcomePage } from './WelcomePage';
import { SeedPhraseDisplay } from './SeedPhraseDisplay';
import { PasswordSetup } from './PasswordSetup';
import { SuccessScreen } from './SuccessScreen';
import { encryptSeedPhrase, generateSeedPhrase, isValidSeedPhrase } from '@/utils/cryptoUtils';
import { BaseWallet, Wallet, HDNodeWallet, ethers } from 'ethers';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

type Step = 'welcome' | 'createPassword' | 'seedPhrase' | 'success' | 'password' | 'dashboard';

interface WalletSetupProps {
  initialStep: 'create' | 'import';
  onComplete: () => void;
  onBack: () => void;
  isFullScreen?: boolean;
}

export function WalletSetup({ initialStep, onComplete, onBack, isFullScreen = false }: WalletSetupProps) {
  const [step, setStep] = useState<Step>(initialStep === 'create' ? 'createPassword' : 'welcome');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [wallet, setWallet] = useState<HDNodeWallet | null>(null);
  const [password, setPassword] = useState<string>('');

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

  const handleSetPassword = useCallback(async (newPassword: string) => {
    setPassword(newPassword);
    if (initialStep === 'create') {
      await handleCreateNewWallet();
    } else {
      setStep('welcome');
    }
  }, [initialStep, handleCreateNewWallet]);

  const handleFinalPasswordSetup = useCallback(async () => {
    if (wallet && seedPhrase && password) {
      try {
        const encryptedSeedPhrase = await encryptSeedPhrase(seedPhrase, password);
        // Store encrypted seed phrase and wallet address
        chrome.storage.local.set({
          encryptedSeedPhrase,
          walletAddress: wallet.address,
        }, () => {
          // Clear sensitive data from memory
          setSeedPhrase('');
          // Move to success screen
          setStep('success');
        });
      } catch (error) {
        console.error('Error encrypting seed phrase:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  }, [wallet, seedPhrase, password]);

  const handleSeedPhraseConfirmed = useCallback(() => {
    setStep('success');
  }, []);

  const handleBack = () => {
    switch (step) {
      case 'createPassword':
      case 'welcome':
        onBack();
        break;
      case 'seedPhrase':
        setStep('createPassword');
        break;
      case 'password':
        setStep(initialStep === 'create' ? 'seedPhrase' : 'welcome');
        break;
      default:
        break;
    }
  };

  const getTotalSteps = () => {
    return initialStep === 'create' ? 3 : 2;
  };

  const getCurrentStep = () => {
    switch (step) {
      case 'createPassword':
        return 1;
      case 'seedPhrase':
        return 2;
      case 'password':
        return initialStep === 'create' ? 3 : 2;
      default:
        return 1;
    }
  };

  const containerClass = isFullScreen 
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800" 
    : "w-[357px] h-[600px] bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800";

  return (
    <div className={containerClass}>
      <div className="w-full max-w-md mx-auto bg-black bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-lg text-white">
        {step !== 'success' && (
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={handleBack} className="text-purple-300 hover:text-purple-100">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex space-x-1">
              {Array.from({ length: getTotalSteps() }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index < getCurrentStep() ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {step === 'welcome' && (
          <WelcomePage onCreateWallet={() => setStep('createPassword')} onImportWallet={handleImportWallet} />
        )}
        {step === 'createPassword' && (
          <PasswordSetup
            onSetPassword={handleSetPassword}
            currentStep={getCurrentStep()}
            totalSteps={getTotalSteps()}
          />
        )}
        {step === 'seedPhrase' && seedPhrase && (
          <SeedPhraseDisplay 
            seedPhrase={seedPhrase} 
            onContinue={handleSeedPhraseConfirmed}
          />
        )}
        {step === 'password' && (
          <PasswordSetup
            onSetPassword={handleFinalPasswordSetup}
            currentStep={getCurrentStep()}
            totalSteps={getTotalSteps()}
          />
        )}
        {step === 'success' && (
          <SuccessScreen onGetStarted={onComplete} />
        )}
      </div>
    </div>
  );
}