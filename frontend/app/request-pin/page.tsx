'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RankCard from '../components/RankCard';

export default function RequestPin() {
  const router = useRouter();
  // State to store the generated PINs per rank
  const [rankPins, setRankPins] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Load saved PINs from localStorage on mount
  useEffect(() => {
    const savedPins = localStorage.getItem('vikTorRankPins');
    if (savedPins) {
      try {
        setRankPins(JSON.parse(savedPins));
      } catch (error) {
        console.error('Error loading saved PINs:', error);
      }
    }
  }, []);
  
  // Updated list of ranks from the Google Sheet
  const ranks = [
    { label: 'Captain', code: 'CPT', allowed: true },
    { label: 'Chief Officer', code: 'CO', allowed: true },
    { label: '2nd Officer(S)', code: '2O(N)', allowed: true },
    { label: '2nd Officer(n)', code: '2O(S)', allowed: true },
    { label: '3d Officer', code: '3O', allowed: false },
    { label: 'Junior Officer', code: 'JO', allowed: false },
    { label: 'Chief Engineer', code: 'CE', allowed: true },
    { label: '2nd Engineer', code: '2E', allowed: true },
    { label: '3d Engineer', code: '3E', allowed: true },
    { label: '4th Engineer', code: '4E', allowed: true },
    { label: '5d Engineer', code: '5E', allowed: false },
    { label: 'Fitter', code: 'FTR', allowed: false },
    { label: 'Welder', code: 'WLD', allowed: true },
    { label: 'Fitter(Deck)', code: 'FTRD', allowed: true },
    { label: 'Deck cadet', code: 'DCDT', allowed: true },
    { label: 'Engine cadet', code: 'ECDT', allowed: true },
  ];

  // Generate a random 8-character PIN with letters and numbers
  const generatePin = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let pin = '';
    for (let i = 0; i < 8; i++) {
      pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
  };

  const handleRankSelect = async (rank: string, code: string, allowed: boolean) => {
    setIsLoading(true);
    
    try {
      // Call FastAPI backend to request a PIN
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/request-pin`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rank: rank,
          code: code,
          mac_address: navigator.userAgent // Simplistic approach, in production use a proper device fingerprint
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if PIN was successfully generated
        if (data.success) {
          const pin = data.pin;
          
          // Save the PIN
          const updatedPins = { ...rankPins, [code]: pin };
          setRankPins(updatedPins);
          localStorage.setItem('vikTorRankPins', JSON.stringify(updatedPins));
          
          // Navigate to success page
          router.push(`/success?role=${encodeURIComponent(rank)}&pin=${pin}&code=${encodeURIComponent(code)}`);
        } else {
          // Access denied
          router.push(`/denied?role=${encodeURIComponent(rank)}`);
        }
      } else {
        // Fallback to static data if API call fails
        if (allowed) {
          let pin = rankPins[code] || generatePin();
          const updatedPins = { ...rankPins, [code]: pin };
          setRankPins(updatedPins);
          localStorage.setItem('vikTorRankPins', JSON.stringify(updatedPins));
          router.push(`/success?role=${encodeURIComponent(rank)}&pin=${pin}&code=${encodeURIComponent(code)}`);
        } else {
          router.push(`/denied?role=${encodeURIComponent(rank)}`);
        }
      }
    } catch (error) {
      console.error('Error calling API:', error);
      // Fallback to static data if API call fails
      if (allowed) {
        let pin = rankPins[code] || generatePin();
        const updatedPins = { ...rankPins, [code]: pin };
        setRankPins(updatedPins);
        localStorage.setItem('vikTorRankPins', JSON.stringify(updatedPins));
        router.push(`/success?role=${encodeURIComponent(rank)}&pin=${pin}&code=${encodeURIComponent(code)}`);
      } else {
        router.push(`/denied?role=${encodeURIComponent(rank)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Select your rank</h1>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-blue-900">Processing request...</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ranks.map((rank) => (
          <RankCard
            key={rank.code}
            label={rank.label}
            onClick={() => handleRankSelect(rank.label, rank.code, rank.allowed)}
          />
        ))}
      </div>
    </div>
  );
}