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
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-8 text-center">Welcome to Web3 Wallet</h2>
      {!showImport ? (
        <>
          <Button 
            onClick={onCreateWallet} 
            className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Wallet
          </Button>
          <Button 
            onClick={() => setShowImport(true)} 
            className="w-full bg-transparent hover:bg-purple-600 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-600 hover:border-transparent rounded"
          >
            Import Existing Wallet
          </Button>
        </>
      ) : (
        <div className="w-full">
          <Input
            type="text"
            placeholder="Enter your seed phrase"
            value={importSeedPhrase}
            onChange={(e) => setImportSeedPhrase(e.target.value)}
            className="mb-4 w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <Button 
            onClick={handleImport} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Import Wallet
          </Button>
          <Button 
            onClick={() => setShowImport(false)} 
            className="w-full mt-2 bg-transparent hover:bg-gray-800 text-purple-600 font-semibold py-2 px-4 rounded"
          >
            Back to options
          </Button>
        </div>
      )}
    </div>
  );
}