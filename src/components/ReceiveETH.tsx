'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Copy, Share2 } from 'lucide-react'
import QRCode from 'qrcode.react'
import { useWallet } from '@/hooks/useWallet'

export function ReceiveETH() {
  const { walletAddress } = useWallet()
  const [isCopied, setIsCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setIsCopied(true)
  }

  const shareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My ETH Wallet Address',
        text: `Here's my ETH wallet address: ${walletAddress}`,
        url: `ethereum:${walletAddress}`
      }).catch(console.error)
    } else {
      console.log('Web Share API not supported')
    }
  }

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-center">
          <QRCode value={walletAddress} size={200} />
        </div>
        <div className="p-2 bg-gray-100 rounded-md flex items-center justify-between">
          <span className="text-sm font-mono">{walletAddress}</span>
          <div>
            <Button variant="ghost" size="icon" onClick={copyAddress}>
              {isCopied ? <span className="text-green-500">✓</span> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={shareAddress}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center">
          Share this address to receive ETH from others.
        </p>
      </CardContent>
    </Card>
  )
}