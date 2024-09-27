'use client'

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function ReceiveETH() {
  const { walletAddress } = useWallet();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      // Optionally, show a success message
      alert('Address copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy address: ', err);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Receive ETH</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Scan the QR code or copy the address below to receive ETH
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {walletAddress && (
            <QRCodeSVG
              value={walletAddress}
              size={200}
              bgColor="#000000"
              fgColor="#FFFFFF"
              level="H"
              includeMargin={false}
            />
          )}
          <p className="mt-4 mb-2 font-mono text-sm break-all">{walletAddress}</p>
          <Button 
            onClick={copyToClipboard}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Copy Address
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}