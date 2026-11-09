import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'AegisPay — AI-Powered Payment Protection & Digital Dispute Defense',
  description:
    'Every payment should have proof. Every deliverable should have protection. Automated milestone escrow, digital fulfillment inspection, and chargeback evidence dossier preparation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
