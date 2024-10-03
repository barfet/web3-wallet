'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { EyeIcon, EyeOffIcon, ClipboardCopyIcon } from 'lucide-react';

interface SeedPhraseDisplayProps {
  seedPhrase: string;
  onContinue: () => void;
}

export function SeedPhraseDisplay({ seedPhrase, onContinue }: SeedPhraseDisplayProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const words = seedPhrase.split(' ');

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <h2 className="text-2xl font-bold text-center mb-2">Your Secret Recovery Phrase</h2>
      <p className="text-center text-gray-400 mb-6">
        Write down these 12 words in order and keep them safe. You'll need them to recover your wallet.
      </p>
      <div 
        className="grid grid-cols-3 gap-2 mb-4 relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {words.map((word, index) => (
          <div key={index} className="relative">
            <div className={`bg-gray-800 p-2 rounded-md ${isHovering ? 'blur-none' : 'blur-sm'}`}>
              <span className="text-gray-400 mr-2">{index + 1}.</span>
              <span className="text-white">{word}</span>
            </div>
          </div>
        ))}
        {!isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
            <EyeOffIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="confirm"
            checked={isConfirmed}
            onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
          />
          <label htmlFor="confirm" className="text-sm text-gray-300">
            I have written down my recovery phrase
          </label>
        </div>
        <Button 
          onClick={handleCopy} 
          variant="outline"
          size="sm"
          className="text-gray-400 hover:text-white border-gray-700"
        >
          {isCopied ? 'Copied!' : <ClipboardCopyIcon className="h-4 w-4" />}
        </Button>
      </div>
      <Button 
        onClick={onContinue} 
        disabled={!isConfirmed}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>
    </div>
  );
}