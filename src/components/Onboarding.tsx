'use client'

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface OnboardingProps {
  onStart: () => void;
}

export function Onboarding({ onStart }: OnboardingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to Your Web3 Wallet</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Get started by creating a new wallet or importing an existing one.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button onClick={onStart} className="bg-purple-600 hover:bg-purple-700">
            Create New Wallet
          </Button>
          <Button onClick={onStart} className="bg-transparent hover:bg-purple-600 text-purple-400 font-semibold hover:text-white border border-purple-600 hover:border-transparent">
            Import Existing Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}