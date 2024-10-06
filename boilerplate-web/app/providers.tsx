// app/providers.tsx
'use client';

import React from 'react';
import { UserContextProvider } from '@/app/contexts/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserContextProvider>
          {children}
    </UserContextProvider>
  );
}
