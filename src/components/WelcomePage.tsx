import React from 'react'
import { Button } from "@/components/ui/button"

interface WelcomePageProps {
  onNext: () => void;
}

export function WelcomePage({ onNext }: WelcomePageProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Welcome to Your Web3 Wallet</h2>
      <p>Let's get started by setting up your new wallet.</p>
      <Button onClick={onNext} className="w-full">Create New Wallet</Button>
      <Button variant="outline" className="w-full">Import Existing Wallet</Button>
    </div>
  )
}