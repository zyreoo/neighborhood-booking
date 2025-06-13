import './globals.css';
import '../styles/main.css';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Neighborhood Homes',
  description: 'Find your next home in the neighborhood',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
