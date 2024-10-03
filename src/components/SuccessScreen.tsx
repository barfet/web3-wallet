'use client'

import React from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface SuccessScreenProps {
  onGetStarted: () => void;
}

export function SuccessScreen({ onGetStarted }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <svg className="w-24 h-24 text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>
      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        You're all done!
      </motion.h2>
      <motion.p
        className="text-gray-300 mb-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Your wallet has been created successfully. You can now start using SpectraVault!
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button onClick={onGetStarted} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded">
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}