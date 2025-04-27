import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'vik.tor - Ship Internet Portal',
  description: 'Access control portal for ship internet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-blue-600">vik.tor</span>
                </div>
                <div className="ml-6 flex space-x-8">
                  <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Home
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="bg-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} vik.tor - Ship Internet Access Portal
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
