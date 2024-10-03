'use client'

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TransactionConfirmation } from './TransactionConfirmation'
import { useWallet } from '@/hooks/useWallet'
import { ethers, Wallet, HDNodeWallet } from 'ethers'
import { parseEther } from 'ethers'
import { isAddress } from 'ethers'

interface SendETHProps {
  wallet: HDNodeWallet; // Ensure the wallet prop is of type HDNodeWallet
}

export function SendETH({ wallet }: SendETHProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [gasSpeed, setGasSpeed] = useState('average')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState('')
  const { balance, sendTransaction } = useWallet()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isAddress(recipient)) {
      setError('Invalid recipient address')
      return
    }

    const amountInWei = parseEther(amount)
    if (amountInWei > parseEther(balance)) {
      setError('Insufficient balance')
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    try {
      await sendTransaction(recipient, amount, gasSpeed)
      // Reset form and show success message
      setRecipient('')
      setAmount('')
      setGasSpeed('average')
      setShowConfirmation(false)
      // You might want to show a success toast or message here
    } catch (error) {
      console.error('Transaction failed:', error)
      setError('Transaction failed. Please try again.')
    }
  }

  if (showConfirmation) {
    return (
      <TransactionConfirmation
        recipient={recipient}
        amount={amount}
        gasSpeed={gasSpeed}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
      />
    )
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Transaction Speed</Label>
            <RadioGroup value={gasSpeed} onValueChange={setGasSpeed}>
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="slow" id="slow" />
                  <Label htmlFor="slow">Slow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="average" id="average" />
                  <Label htmlFor="average">Average</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast">Fast</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Review Transaction</Button>
        </form>
      </CardContent>
    </Card>
  )
}