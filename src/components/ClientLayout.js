'use client';

import { AuthProvider } from '@/lib/auth';
import Navigation from '@/components/Navigation';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <Navigation />
      <main>{children}</main>
    </AuthProvider>
  );
} 