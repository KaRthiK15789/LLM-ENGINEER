import ChatInterface from '@/components/chat-interface';
import Navigation from '@/components/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Shield, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-900 text-slate-100 font-inter">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="text-blue-400" />
            LLM Engineering Challenges
          </h1>
          <p className="text-slate-400 text-lg">
            Explore different AI and ML implementations
          </p>
        </div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* NER Challenge */}
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-400 transition-colors group">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Brain className="h-6 w-6 text-blue-400" />
                Named Entity Recognition + LLM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Chat interface with spaCy NER detection and local LLM integration using Ollama.
                See real-time entity highlighting and comprehensive console logging.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">NER</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Ollama</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">spaCy</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">Next.js</span>
              </div>
              <Link href="#ner-section">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:translate-x-1 transition-transform">
                  Try NER Challenge
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* PII Challenge */}
          <Card className="bg-slate-800 border-slate-700 hover:border-green-400 transition-colors group">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-400" />
                PII Detection Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                macOS-style privacy-focused chat interface with real-time PII detection.
                Features beautiful animations and comprehensive privacy analysis.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">PII Detection</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Privacy</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">macOS UI</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Animations</span>
              </div>
              <Link href="/pii">
                <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:translate-x-1 transition-transform">
                  Try PII Detection
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* NER Challenge Section */}
        <div id="ner-section">
          <ChatInterface />
        </div>
      </div>
      </div>
    </>
  );
}
