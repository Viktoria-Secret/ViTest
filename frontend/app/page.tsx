'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [storedPins, setStoredPins] = useState<string[]>([]);

  // Load stored PINs from localStorage
  useEffect(() => {
    const savedPinsObj = localStorage.getItem('vikTorRankPins');
    if (savedPinsObj) {
      try {
        const pinsObj = JSON.parse(savedPinsObj);
        // Extract just the PIN values into an array
        const pinValues = Object.values(pinsObj) as string[];
        setStoredPins(pinValues);
      } catch (error) {
        console.error('Error loading saved PINs:', error);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // First check if PIN is 8 characters
    if (pin.length !== 8) {
      setError('Invalid PIN. Please enter an 8-character PIN.');
      return;
    }
    
    // Then check if the PIN exists in our stored PINs
    if (storedPins.includes(pin)) {
      setError('');
      router.push('/internet-access');
    } else {
      setError('Invalid PIN. This PIN does not exist in our system.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-blue-900">
        <h1 className="text-3xl font-bold mb-6 text-center">Vik.tor Network</h1>
        <h2 className="text-xl text-center mb-8">Ship Internet Access</h2>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="pin" className="block text-sm font-medium mb-2">
              Enter your PIN
            </label>
            <input
              type="text"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="8-character PIN"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={8}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors"
          >
            Connect
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm mb-4">Don't have a PIN?</p>
          <Link
            href="/request-pin"
            className="inline-block bg-blue-100 text-blue-900 py-2 px-4 rounded-md hover:bg-blue-200 transition-colors"
          >
            Request PIN
          </Link>
        </div>
      </div>
    </main>
  );
}