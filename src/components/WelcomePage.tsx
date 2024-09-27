'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Web3 Wallet</CardTitle>
          <CardDescription className="text-center text-gray-400">
            {showImport ? 'Import your existing wallet' : 'Create a new wallet or import an existing one'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showImport ? (
            <>
              <Button 
                onClick={onCreateWallet} 
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded"
              >
                Create New Wallet
              </Button>
              <Button 
                onClick={() => setShowImport(true)} 
                className="w-full bg-transparent hover:bg-purple-600 text-purple-400 font-semibold hover:text-white py-3 px-4 border border-purple-600 hover:border-transparent rounded"
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
                className="mb-4 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <Button 
                onClick={handleImport} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded"
              >
                Import Wallet
              </Button>
              <Button 
                onClick={() => setShowImport(false)} 
                className="w-full mt-2 bg-transparent hover:bg-gray-700 text-purple-400 font-semibold py-2 px-4 rounded"
              >
                Back to options
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}