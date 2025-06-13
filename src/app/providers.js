'use client';

import { AuthProvider } from '@/lib/auth';
import Navigation from '@/components/Navigation';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          padding-top: 64px; /* Height of the navigation bar */
          flex: 1;
          background-color: #f7fafc;
          width: 100%;
        }
      `}</style>
    </AuthProvider>
  );
} 