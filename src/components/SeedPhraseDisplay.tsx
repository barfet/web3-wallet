import React, { useState } from 'react';
import { Button } from './ui/button';

interface SeedPhraseDisplayProps {
  seedPhrase: string;
  onContinue: () => void;
}

export function SeedPhraseDisplay({ seedPhrase, onContinue }: SeedPhraseDisplayProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Your Seed Phrase</h2>
      <p className="mb-4 text-center max-w-md">
        Write down these 12 words in order and keep them safe. You'll need them to recover your wallet.
      </p>
      <div className="bg-white p-4 rounded-md shadow-md mb-4">
        <p className="font-mono">{seedPhrase}</p>
      </div>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={() => setIsConfirmed(!isConfirmed)}
          className="mr-2"
        />
        I have written down my seed phrase
      </label>
      <Button onClick={onContinue} disabled={!isConfirmed}>
        Continue
      </Button>
    </div>
  );
}