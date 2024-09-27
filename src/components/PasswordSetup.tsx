'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Set Your Password</h2>
      <p className="mb-4 text-center max-w-md">
        Create a strong password to secure your wallet. You'll need this password to access your wallet.
      </p>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="mb-4 w-full max-w-md"
      />
      <Input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
        className="mb-4 w-full max-w-md"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button onClick={handleSetPassword}>Set Password</Button>
    </div>
  )
}