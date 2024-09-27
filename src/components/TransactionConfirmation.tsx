'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from '@/hooks/useWallet'
import { ethers } from 'ethers'
import { formatEther } from 'ethers'

interface TransactionConfirmationProps {
  recipient: string
  amount: string
  gasSpeed: string
  onConfirm: () => void
  onCancel: () => void
}

export function TransactionConfirmation({
  recipient,
  amount,
  gasSpeed,
  onConfirm,
  onCancel
}: TransactionConfirmationProps) {
  const { getGasPrice } = useWallet()
  const [estimatedGas, setEstimatedGas] = React.useState<string>('0')

  React.useEffect(() => {
    const fetchGasEstimate = async () => {
      const gasPrice = await getGasPrice(gasSpeed)
      const gasLimit = 21000n // Standard gas limit for ETH transfers
      const gasCost = gasPrice * BigInt(gasLimit)
      setEstimatedGas(formatEther(gasCost))
    }
    fetchGasEstimate()
  }, [gasSpeed, getGasPrice])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Transaction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Recipient:</p>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded">{recipient}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Amount:</p>
          <p className="text-lg font-bold">{amount} ETH</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Transaction Speed:</p>
          <p className="text-sm capitalize">{gasSpeed}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Estimated Gas Fee:</p>
          <p className="text-sm">{estimatedGas} ETH</p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={onCancel} variant="outline" className="w-full">Cancel</Button>
          <Button onClick={onConfirm} className="w-full">Confirm & Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}