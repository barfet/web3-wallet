'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Confirm Your Seed Phrase</h2>
      <p className="mb-4 text-center max-w-md">
        Please enter your seed phrase to confirm you've written it down correctly.
      </p>
      <Input
        type="text"
        value={confirmationPhrase}
        onChange={(e) => setConfirmationPhrase(e.target.value)}
        placeholder="Enter your seed phrase"
        className="mb-4 w-full max-w-md"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button onClick={handleConfirm}>Confirm Seed Phrase</Button>
    </div>
  );
}