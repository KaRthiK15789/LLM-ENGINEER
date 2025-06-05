import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, Shield, Home } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="fixed top-4 right-4 z-50">
      <div className="flex gap-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg p-2">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
        </Link>
        <Link href="/#ner-section">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-blue-400">
            <Brain className="h-4 w-4 mr-1" />
            NER
          </Button>
        </Link>
        <Link href="/pii">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-green-400">
            <Shield className="h-4 w-4 mr-1" />
            PII
          </Button>
        </Link>
      </div>
    </nav>
  );
}