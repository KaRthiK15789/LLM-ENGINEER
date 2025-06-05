import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setResult('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">LLM Engineer</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          rows={4}
          placeholder="Enter your prompt..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 text-white rounded ${isLoading ? 'opacity-50' : 'hover:bg-blue-700'}`}
        >
          {isLoading ? 'Processing...' : 'Generate'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-white border rounded">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <div className="whitespace-pre-wrap">{result}</div>
        </div>
      )}
    </div>
  );
}
