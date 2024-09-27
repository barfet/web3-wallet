'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReceiveETH } from './ReceiveETH'
import { SendETH } from './SendETH'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SendReceiveETH() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Manage ETH</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="receive" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receive">Receive ETH</TabsTrigger>
              <TabsTrigger value="send">Send ETH</TabsTrigger>
            </TabsList>
            <TabsContent value="receive">
              <ReceiveETH />
            </TabsContent>
            <TabsContent value="send">
              <SendETH />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}