'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SeedPhraseConfirmationProps {
  seedPhrase: string;
  onComplete: () => void;
}

export function SeedPhraseConfirmation({ seedPhrase, onComplete }: SeedPhraseConfirmationProps) {
  const [words, setWords] = useState(['', '', ''])
  const [indexes, setIndexes] = useState<number[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const phraseWords = seedPhrase.split(' ')
    const randomIndexes: number[] = []
    while (randomIndexes.length < 3) {
      const index = Math.floor(Math.random() * phraseWords.length)
      if (!randomIndexes.includes(index)) {
        randomIndexes.push(index)
      }
    }
    setIndexes(randomIndexes)
  }, [seedPhrase])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const phraseWords = seedPhrase.split(' ')
    const isCorrect = words.every((word, i) => word.toLowerCase() === phraseWords[indexes[i]].toLowerCase())
    if (isCorrect) {
      onComplete()
    } else {
      setError('Incorrect words. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p>Please enter the following words from your seed phrase:</p>
      {indexes.map((index, i) => (
        <div key={i} className="space-y-2">
          <Label htmlFor={`word-${i}`}>Word #{index + 1}</Label>
          <Input
            id={`word-${i}`}
            value={words[i]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWords(words.map((w, j) => i === j ? e.target.value : w))}
            required
          />
        </div>
      ))}
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full">Confirm Seed Phrase</Button>
    </form>
  )
}