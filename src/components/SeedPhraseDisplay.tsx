import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from 'lucide-react'

interface SeedPhraseDisplayProps {
  seedPhrase: string;
  onNext: () => void;
}

export function SeedPhraseDisplay({ seedPhrase, onNext }: SeedPhraseDisplayProps) {
  const [showPhrase, setShowPhrase] = useState(false)

  useEffect(() => {
    // In a real implementation, generate the seed phrase here
    // For this example, we'll use a dummy phrase
    setSeedPhrase("apple banana cherry date elderberry fig grape honeydew imbe jackfruit kiwi lemon")
  }, [])

  return (
    <div className="space-y-4">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Never share your seed phrase with anyone. Store it securely offline.
        </AlertDescription>
      </Alert>
      <div className="p-4 bg-gray-100 rounded-md">
        {showPhrase ? (
          <p className="text-center break-all">{seedPhrase}</p>
        ) : (
          <Button onClick={() => setShowPhrase(true)} className="w-full">
            Reveal Seed Phrase
          </Button>
        )}
      </div>
      {showPhrase && (
        <Button onClick={onNext} className="w-full">
          I've Securely Saved My Seed Phrase
        </Button>
      )}
    </div>
  )
}