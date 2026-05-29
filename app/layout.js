import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Sidebar from '@/components/Sidebar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: 'Atlas Apparel — Wholesale CRM',
  description:
    'CRM for managing wholesale clothing customers, orders, and products.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <Sidebar />
        <div className="md:pl-64">
          <main className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 md:pt-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
