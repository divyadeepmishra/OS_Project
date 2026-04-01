'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';

// Client-side layout wrapper — provides the AppShell for all pages except root "/"
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The root "/" page just redirects, so skip AppShell for it
  if (pathname === '/') {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
