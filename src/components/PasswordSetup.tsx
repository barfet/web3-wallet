'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface PasswordSetupProps {
  onSetPassword: (password: string) => void;
}

export function PasswordSetup({ onSetPassword }: PasswordSetupProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSetPassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    onSetPassword(password)
  }

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
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mb-4 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
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