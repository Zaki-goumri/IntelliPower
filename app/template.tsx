'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const queryClient = React.useState(() => new QueryClient())[0];

  return (
    <QueryClientProvider client={queryClient}>
     {children}
    </QueryClientProvider>
  );
}
