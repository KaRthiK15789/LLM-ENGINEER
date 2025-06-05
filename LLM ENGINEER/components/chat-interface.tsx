"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Brain, Tag, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Entity {
  text: string;
  label: string;
  start: number;
  end: number;
}

interface Message {
  id: string;
  text: string;
  entities: Entity[];
  llmResponse: string;
  timestamp: Date;
  ollamaAvailable: boolean;
  error?: string;
}

const entityColors: Record<string, string> = {
  PERSON: 'bg-blue-100 text-blue-800 border-blue-200',
  ORG: 'bg-green-100 text-green-800 border-green-200',
  GPE: 'bg-purple-100 text-purple-800 border-purple-200',
  MONEY: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DATE: 'bg-pink-100 text-pink-800 border-pink-200',
  TIME: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export default function ChatInterface() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("ChatInterface rendered with messages:", messages);

  const highlightEntities = (text: string, entities: Entity[]): (string | React.ReactElement)[] => {
    if (!entities.length) return [text];

    console.log("Highlighting entities in text:", text, entities);
    
    let result: (string | React.ReactElement)[] = [];
    let lastIndex = 0;

    entities.forEach((entity, index) => {
      // Add text before entity
      if (entity.start > lastIndex) {
        result.push(text.slice(lastIndex, entity.start));
      }

      // Add highlighted entity
      result.push(
        <Badge 
          key={index}
          variant="secondary" 
          className={`mx-0.5 ${entityColors[entity.label] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
        >
          {entity.text}
          <span className="ml-1 text-xs opacity-70">({entity.label})</span>
        </Badge>
      );

      lastIndex = entity.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;

    console.log("Sending prompt:", prompt);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/process', { prompt });
      console.log("API response received:", response.data);

      const newMessage: Message = {
        id: Date.now().toString(),
        text: prompt,
        entities: response.data.entities,
        llmResponse: response.data.llmResponse,
        timestamp: new Date(),
        ollamaAvailable: response.data.ollamaAvailable,
        error: response.data.error
      };

      console.log("Adding new message:", newMessage);
      setMessages(prev => [...prev, newMessage]);
      setPrompt('');
    } catch (error) {
      console.error("Error sending prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-inter">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="text-blue-400" />
            LLM Engineer Challenge - NER + Local LLM
          </h1>
          <p className="text-slate-400">
            Enter a prompt to see Named Entity Recognition and Local LLM response
          </p>
        </div>

        {/* Input Area */}
        <Card className="mb-8 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your prompt here... (e.g., 'Tell me about Elon Musk and Tesla in San Francisco')"
                className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !prompt.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {/* User Prompt with Entities */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5 text-amber-400" />
                    Prompt with Named Entities
                    {message.error && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {message.error}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700 rounded-lg">
                      <p className="leading-relaxed">
                        {highlightEntities(message.text, message.entities)}
                      </p>
                    </div>
                    
                    {message.entities.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">
                          Detected Entities ({message.entities.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {message.entities.map((entity, index) => (
                            <Badge
                              key={index}
                              className={entityColors[entity.label] || 'bg-gray-100 text-gray-800 border-gray-200'}
                            >
                              {entity.text} ({entity.label})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* LLM Response */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-green-400" />
                    LLM Response
                    <Badge 
                      variant={message.ollamaAvailable ? "default" : "secondary"}
                      className="ml-2 text-xs"
                    >
                      {message.ollamaAvailable ? "Ollama" : "Mock"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {message.llmResponse}
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {messages.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center text-slate-400">
                <Brain className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                <p className="mb-2">No messages yet. Try entering a prompt like:</p>
                <ul className="text-sm space-y-1">
                  <li>• "Tell me about Elon Musk and Tesla in San Francisco"</li>
                  <li>• "Microsoft acquired OpenAI for $10 billion in 2023"</li>
                  <li>• "Meeting with John Smith at Google tomorrow at 3:00 PM"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}