'use client'

import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { getPasswordStrength } from '@/utils/passwordUtils';

interface PasswordSetupProps {
  onSetPassword: (password: string) => void;
  currentStep: number;
  totalSteps: number;
}

export function PasswordSetup({ onSetPassword, currentStep, totalSteps }: PasswordSetupProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service.');
      return;
    }

    onSetPassword(password);
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <h2 className="text-2xl font-bold text-center mb-2">Create a password</h2>
      <p className="text-center text-gray-400 mb-6">You will use this to unlock your wallet.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
          />
          {password && (
            <p className={`text-sm mt-1 ${getStrengthColor()}`}>
              Password strength: {passwordStrength}
            </p>
          )}
        </div>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
          />
          <label htmlFor="terms" className="text-sm text-gray-300">
            I agree to the <span className="text-purple-400">Terms of Service</span>
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded"
          disabled={!password || !confirmPassword || !agreedToTerms}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}