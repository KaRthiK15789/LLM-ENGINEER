import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  prompt: z.string().min(5, 'Prompt must be at least 5 characters')
});

export default function Home() {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async ({ prompt }) => {
    try {
      setIsLoading(true);
      setResult('');
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Request failed');
      
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      toast.error('Error', {
        description: error.message || 'Failed to generate response'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">LLM Engineer</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <textarea
            {...register('prompt')}
            className="w-full p-3 border rounded-md min-h-[150px]"
            placeholder="Enter your prompt..."
            disabled={isLoading}
          />
          {errors.prompt && (
            <p className="text-sm text-red-500 mt-1">{errors.prompt.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Generate
        </button>
      </form>

      {result && (
        <div className="mt-8 p-4 bg-muted rounded-md">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <div className="whitespace-pre-wrap">{result}</div>
        </div>
      )}
    </main>
  );
}
