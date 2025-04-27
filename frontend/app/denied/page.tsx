'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Denied() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      <h1 className="mt-4 text-2xl font-bold text-center text-gray-900">Access Denied</h1>
      <p className="mt-2 text-center text-gray-600">
        {role} is not authorized for internet access
      </p>
      
      <div className="mt-8 text-center">
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 