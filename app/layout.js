import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Sidebar from '@/components/Sidebar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: 'Atlas Reateke — Wholesale CRM',
  description:
    'CRM for managing wholesale clothing customers, orders, and products.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <Sidebar />
        <div className="md:pl-64 flex flex-col min-h-screen">
          <main className="flex-1 mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 md:pt-10">
            {children}
          </main>
          <footer className="md:pl-0 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-slate-400">
                © 2026 Atlas Apparel — Wholesale CRM. All rights reserved.
              </p>
              <p className="text-xs text-slate-400">
                Built on AWS · Deployed via GitHub Actions
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}