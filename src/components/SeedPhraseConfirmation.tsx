'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface SeedPhraseConfirmationProps {
  seedPhrase: string;
  onConfirm: (isConfirmed: boolean) => void;
}

export function SeedPhraseConfirmation({ seedPhrase, onConfirm }: SeedPhraseConfirmationProps) {
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (confirmationPhrase.trim() === seedPhrase.trim()) {
      onConfirm(true);
    } else {
      setError('The seed phrase does not match. Please try again.');
      onConfirm(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Confirm Your Seed Phrase</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Please enter your seed phrase to confirm you've written it down correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={confirmationPhrase}
            onChange={(e) => setConfirmationPhrase(e.target.value)}
            placeholder="Enter your seed phrase"
            className="mb-4 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button 
            onClick={handleConfirm}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded"
          >
            Confirm Seed Phrase
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}