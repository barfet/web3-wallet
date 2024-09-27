'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WelcomePage } from './WelcomePage'
import { PasswordSetup } from './PasswordSetup'
import { SeedPhraseDisplay } from './SeedPhraseDisplay'
import { SeedPhraseConfirmation } from './SeedPhraseConfirmation'

export function WalletSetup() {
  const [step, setStep] = useState(0)
  const [seedPhrase, setSeedPhrase] = useState('')

  const nextStep = () => setStep(step + 1)

  const steps = [
    <WelcomePage key="welcome" onNext={nextStep} />,
    <PasswordSetup key="password" onNext={(pass: string) => { nextStep(); }} />,
    <SeedPhraseDisplay key="seedphrase" seedPhrase={seedPhrase} onNext={nextStep} />,
    <SeedPhraseConfirmation key="confirm" seedPhrase={seedPhrase} onComplete={() => console.log('Wallet setup complete')} />
  ]

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Setup</CardTitle>
          <CardDescription>Step {step + 1} of {steps.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {steps[step]}
        </CardContent>
      </Card>
    </div>
  )
}