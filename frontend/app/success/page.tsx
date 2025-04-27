'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Success() {
  const searchParams = useSearchParams();
  const pin = searchParams.get('pin') || '12345678'; // Default PIN for demo if none provided
  const role = searchParams.get('role') || 'Crew';
  const code = searchParams.get('code') || '';
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-900 text-white">
      <div className="w-full max-w-md p-8 bg-white text-blue-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">PIN Granted</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-semibold mb-2">Your PIN:</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-mono">{pin}</p>
            <button 
              onClick={copyToClipboard}
              className="ml-2 bg-blue-900 text-white py-1 px-3 rounded hover:bg-blue-800 transition-colors text-sm"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm">
            <strong>Role:</strong> {role} {code && `(${code})`}
          </p>
          <p className="text-sm mt-2">
            This is a permanent PIN for your rank. You may use it on up to 3 devices.
          </p>
        </div>
        
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