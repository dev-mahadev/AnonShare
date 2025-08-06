// app/providers.tsx
'use client';

import { SnackbarProvider } from 'notistack';

export function Providers({ children }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {children}
    </SnackbarProvider>
  );
}
