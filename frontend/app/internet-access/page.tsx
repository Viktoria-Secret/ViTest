'use client';

import Link from 'next/link';

export default function InternetAccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-900 text-white">
      <div className="w-full max-w-md p-8 bg-white text-blue-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Access Granted</h1>
        <p className="text-lg text-center mb-8">
          You now have access to the ship's internet network.
        </p>
        <div className="flex justify-center">
          <Link 
            href="/"
            className="mt-4 w-full bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 