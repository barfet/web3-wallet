'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { WalletSetup } from './WalletSetup';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'welcome' | 'create' | 'import'>('welcome');

  const handleCreateNewWallet = () => setStep('create');
  const handleImportWallet = () => setStep('import');
  const handleBack = () => setStep('welcome');

  if (step !== 'welcome') {
    return (
      <WalletSetup 
        initialStep={step} 
        onComplete={onComplete}
        onBack={handleBack}
        isFullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-[400px] h-[500px] bg-black text-white p-6 rounded-lg flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center">
          <img
            src={chrome.runtime.getURL('images/logo.png')}
            alt="SpectraVault Logo"
            className="w-20 h-20 mb-6"
          />
          <h2 className="text-2xl font-bold text-center mb-2">SpectraVault</h2>
          <p className="text-center text-gray-400 mb-6">
            To get started, create a new wallet or import an existing one.
          </p>
          <div className="space-y-4 w-full">
            <Button 
              onClick={handleCreateNewWallet} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded"
            >
              Create a new wallet
            </Button>
            <Button 
              onClick={handleImportWallet} 
              className="w-full bg-transparent hover:bg-gray-800 text-white border border-gray-600 py-3 rounded"
            >
              I already have a wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}