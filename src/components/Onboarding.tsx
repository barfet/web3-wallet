'use client'

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface OnboardingProps {
  onStart: () => void;
}

export function Onboarding({ onStart }: OnboardingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"  // Make sure to add your logo image to the public folder
              alt="Web3 Wallet Logo"
              className="w-16 h-16"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome to Your Web3 Wallet</CardTitle>
          <CardDescription className="text-gray-400">
            Get started by creating a new wallet or importing an existing one.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button 
            onClick={onStart} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            Create New Wallet
          </Button>
          <Button 
            onClick={onStart} 
            className="bg-transparent hover:bg-purple-600 text-purple-400 font-semibold hover:text-white py-3 px-4 border border-purple-600 hover:border-transparent rounded-lg transition duration-200 ease-in-out"
          >
            I Already Have a Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}