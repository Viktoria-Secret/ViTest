'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function SupabaseExample() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Example query - replace 'your_table' with an actual table in your Supabase
        const { data, error } = await supabase
          .from('your_table')
          .select('*')
          .limit(10)
        
        if (error) throw error
        setData(data)
      } catch (err: any) {
        setError(err.message || 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Supabase Data Example</h2>
      
      {loading && <p>Loading data...</p>}
      
      {error && (
        <div className="bg-red-100 p-3 rounded text-red-700 mb-4">
          Error: {error}
        </div>
      )}
      
      {data && (
        <div className="bg-white rounded-lg shadow p-4">
          <pre className="overflow-auto max-h-80">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 