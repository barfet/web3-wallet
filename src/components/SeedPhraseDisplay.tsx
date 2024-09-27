'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface SeedPhraseDisplayProps {
  seedPhrase: string;
  onContinue: () => void;
}

export function SeedPhraseDisplay({ seedPhrase, onContinue }: SeedPhraseDisplayProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Your Seed Phrase</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Write down these 12 words in order and keep them safe. You'll need them to recover your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-700 p-4 rounded-md shadow-md mb-4">
            <p className="font-mono text-purple-400">{seedPhrase}</p>
          </div>
          <label className="flex items-center mb-4 text-gray-300">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={() => setIsConfirmed(!isConfirmed)}
              className="mr-2"
            />
            I have written down my seed phrase
          </label>
          <Button 
            onClick={onContinue} 
            disabled={!isConfirmed}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}