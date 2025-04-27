import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setResponse(data.answer);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Marine AI - Rudder Assistant</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} cols={60} />
        <br />
        <button type="submit">Submit</button>
      </form>
      <pre style={{ marginTop: 20 }}>{response}</pre>
    </div>
  );
}
