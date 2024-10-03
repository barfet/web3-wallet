'use client'

import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox'; // Make sure this component exists
import { validatePassword, getPasswordStrength } from '@/utils/passwordUtils';
import { ArrowLeft } from 'lucide-react';

interface PasswordSetupProps {
  onSetPassword: (password: string) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PasswordSetup({ onSetPassword, onBack, currentStep, totalSteps }: PasswordSetupProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password does not meet security requirements.');
      return;
    }

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

  return (
    <div className="w-full max-w-md mx-auto bg-black text-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex space-x-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < currentStep ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">Create a password</h2>
      <p className="text-center text-gray-400 mb-6">You will use this to unlock your wallet.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
        />
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
            I agree to the <span className="text-purple-500">Terms of Service</span>
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded">
          Continue
        </Button>
      </form>
    </div>
  );
}