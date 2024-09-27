'use client'

import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { validatePassword, getPasswordStrength } from '@/utils/passwordUtils';

interface PasswordSetupProps {
  onSetPassword: (password: string) => void;
}

export function PasswordSetup({ onSetPassword }: PasswordSetupProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('')

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(newPassword ? getPasswordStrength(newPassword) : '');
  };

  const handleSetPassword = useCallback(() => {
    if (!validatePassword(password)) {
      setError('Password does not meet security requirements. It must be at least 8 characters long and contain uppercase, lowercase, number, and special characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    onSetPassword(password)
  }, [password, confirmPassword, onSetPassword]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Set Your Password</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create a strong password to secure your wallet. You'll need this password to access your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
            {passwordStrength && (
              <p className={`mt-1 text-sm ${getStrengthColor()}`}>
                Password strength: {passwordStrength}
              </p>
            )}
          </div>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="mb-4 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button 
            onClick={handleSetPassword}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded"
          >
            Set Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}