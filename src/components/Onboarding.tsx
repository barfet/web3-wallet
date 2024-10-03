'use client'

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface OnboardingProps {
  onStart: () => void;
}

export function Onboarding({ onStart }: OnboardingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-white p-4">
      <Card className="w-full max-w-md bg-white/80 border border-purple-100 shadow-xl rounded-2xl backdrop-blur-sm">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center mb-6">
            <img
              src={chrome.runtime.getURL('images/logo.png')}
              alt="SpectraVault Logo"
              className="w-20 h-20"
            />
          </div>
          <CardTitle className="text-3xl font-semibold text-purple-900 mb-2">SpectraVault</CardTitle>
          <CardDescription className="text-purple-700 text-lg">
            To get started, create a new wallet or import an existing one.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 px-8 pb-8">
          <Button 
            onClick={onStart} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-normal py-4 px-6 rounded-xl text-lg transition duration-200 ease-in-out"
          >
            Create a new wallet
          </Button>
          <Button 
            onClick={onStart} 
            className="bg-white hover:bg-purple-50 text-purple-600 font-normal py-4 px-6 rounded-xl text-lg transition duration-200 ease-in-out border-2 border-purple-600"
          >
            I already have a wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}