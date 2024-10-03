'use client'

import React, { useState, useCallback } from 'react';
import { WelcomePage } from './WelcomePage';
import { SeedPhraseDisplay } from './SeedPhraseDisplay';
import { SeedPhraseConfirmation } from './SeedPhraseConfirmation';
import { PasswordSetup } from './PasswordSetup';
import { SendETH } from './SendETH';
import { encryptSeedPhrase, generateSeedPhrase, isValidSeedPhrase } from '@/utils/cryptoUtils';
import { BaseWallet, Wallet, HDNodeWallet, ethers } from 'ethers';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

type Step = 'welcome' | 'createPassword' | 'seedPhrase' | 'confirmation' | 'password' | 'dashboard';

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

  const handleConfirmSeedPhrase = useCallback((isConfirmed: boolean) => {
    if (isConfirmed) {
      setStep('password');
    } else {
      // Handle incorrect confirmation (e.g., show error message, reset confirmation)
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
          // Do not clear the wallet here, as we need it for the SendETH component
          onComplete(); // Call onComplete to signal that the setup is finished
        });
      } catch (error) {
        console.error('Error encrypting seed phrase:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  }, [wallet, seedPhrase, password, onComplete]);

  const handleBack = () => {
    switch (step) {
      case 'createPassword':
      case 'welcome':
        onBack();
        break;
      case 'seedPhrase':
        setStep('createPassword');
        break;
      case 'confirmation':
        setStep('seedPhrase');
        break;
      case 'password':
        setStep(initialStep === 'create' ? 'confirmation' : 'welcome');
        break;
      default:
        break;
    }
  };

  const renderStepIndicator = () => {
    const steps = ['createPassword', 'seedPhrase', 'confirmation', 'password'];
    const currentStepIndex = steps.indexOf(step);
    return (
      <div className="flex justify-center space-x-2 mb-6 absolute top-4 left-1/2 transform -translate-x-1/2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index <= currentStepIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const containerClass = isFullScreen 
    ? "min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-white p-4 flex items-center justify-center" 
    : "w-[357px] h-[600px] bg-gray-900 text-white";

  return (
    <div className={containerClass}>
      <Card className="w-full max-w-md mx-auto relative bg-white/80 border border-purple-100 shadow-xl rounded-2xl backdrop-blur-sm">
        {renderStepIndicator()}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack} 
          className="absolute top-4 left-4 text-purple-600"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <CardContent className="pt-16 pb-8 px-8">
          {step === 'welcome' && (
            <WelcomePage onCreateWallet={() => setStep('createPassword')} onImportWallet={handleImportWallet} />
          )}
          {step === 'createPassword' && (
            <PasswordSetup
              onSetPassword={handleSetPassword}
              onBack={handleBack}
              currentStep={1}
              totalSteps={4}
            />
          )}
          {step === 'seedPhrase' && seedPhrase && (
            <SeedPhraseDisplay seedPhrase={seedPhrase} onContinue={() => setStep('confirmation')} />
          )}
          {step === 'confirmation' && seedPhrase && (
            <SeedPhraseConfirmation seedPhrase={seedPhrase} onConfirm={handleConfirmSeedPhrase} />
          )}
          {step === 'password' && (
            <PasswordSetup
              onSetPassword={handleFinalPasswordSetup}
              onBack={handleBack}
              currentStep={4}
              totalSteps={4}
            />
          )}
          {step === 'dashboard' && wallet && (
            <SendETH wallet={wallet} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}