'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface WelcomePageProps {
  onCreateWallet: () => void;
  onImportWallet: (seedPhrase: string) => void;
}

export function WelcomePage({ onCreateWallet, onImportWallet }: WelcomePageProps) {
  const [importSeedPhrase, setImportSeedPhrase] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleImport = () => {
    if (importSeedPhrase.trim()) {
      onImportWallet(importSeedPhrase.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to Web3 Wallet</h1>
      {!showImport ? (
        <>
          <Button onClick={onCreateWallet} className="mb-4">Create New Wallet</Button>
          <Button onClick={() => setShowImport(true)} variant="outline">Import Existing Wallet</Button>
        </>
      ) : (
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Enter your seed phrase"
            value={importSeedPhrase}
            onChange={(e) => setImportSeedPhrase(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleImport} className="w-full">Import Wallet</Button>
          <Button onClick={() => setShowImport(false)} variant="link" className="mt-2">
            Back to options
          </Button>
        </div>
      )}
    </div>
  );
}