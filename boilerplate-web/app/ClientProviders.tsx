// app/ClientProviders.tsx
'use client';

import React from 'react';
import { UserContextProvider } from './contexts/UserContext';
import { GameStateProvider } from './contexts/GameStateContext';
import { RecentWinnersProvider } from './contexts/RecentWinnersContext';


export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserContextProvider>
      <GameStateProvider>
        <RecentWinnersProvider>
          {children}
        </RecentWinnersProvider>
      </GameStateProvider>
    </UserContextProvider>
  );
}