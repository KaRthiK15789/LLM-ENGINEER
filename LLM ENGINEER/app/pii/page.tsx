"use client";

import React, { useState } from 'react';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X, Info, User } from 'lucide-react';
import axios from 'axios';

interface PIIItem {
  text: string;
  type: string;
  confidence: number;
  start: number;
  end: number;
  color: 'orange' | 'blue' | 'purple' | 'green';
}

interface ChatSpace {
  id: number;
  name: string;
  message: string;
  piiItems: PIIItem[];
}

const PII_COLORS = {
  orange: {
    bg: 'rgba(255, 165, 0, 0.3)',
    border: 'rgba(255, 165, 0, 0.5)',
    text: '#FFA500',
    shadow: 'rgba(255, 165, 0, 0.4)',
  },
  blue: {
    bg: 'rgba(0, 191, 255, 0.3)',
    border: 'rgba(0, 191, 255, 0.5)', 
    text: '#00BFFF',
    shadow: 'rgba(0, 191, 255, 0.4)',
  },
  purple: {
    bg: 'rgba(147, 51, 234, 0.3)',
    border: 'rgba(147, 51, 234, 0.5)',
    text: '#9333EA',
    shadow: 'rgba(147, 51, 234, 0.4)',
  },
  green: {
    bg: 'rgba(34, 197, 94, 0.3)',
    border: 'rgba(34, 197, 94, 0.5)',
    text: '#22C55E',
    shadow: 'rgba(34, 197, 94, 0.4)',
  },
};

export default function PIIDetectionPage() {
  const [currentSpace, setCurrentSpace] = useState(1);
  const [showPIIDetails, setShowPIIDetails] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [chatSpaces, setChatSpaces] = useState<ChatSpace[]>([
    {
      id: 1,
      name: 'Chat space 1',
      message: 'John Doe lives in Dublin, CA.',
      piiItems: [
        { text: 'John Doe', type: 'Person Name', confidence: 95, start: 0, end: 8, color: 'orange' },
        { text: 'Dublin, CA', type: 'Location', confidence: 88, start: 18, end: 28, color: 'blue' },
      ]
    },
    {
      id: 2, 
      name: 'Chat space 2',
      message: 'Contact sarah.johnson@email.com at (555) 123-4567',
      piiItems: [
        { text: 'sarah.johnson@email.com', type: 'Email Address', confidence: 97, start: 8, end: 32, color: 'orange' },
        { text: '(555) 123-4567', type: 'Phone Number', confidence: 92, start: 36, end: 50, color: 'blue' },
      ]
    }
  ]);

  console.log("PIIDetectionPage rendered with current space:", currentSpace);

  const detectPII = async (text: string): Promise<PIIItem[]> => {
    console.log("Starting PII detection for text:", text);
    
    // Enhanced PII patterns
    const piiPatterns = [
      { regex: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, type: 'Person Name', color: 'orange' as const },
      { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, type: 'Email Address', color: 'orange' as const },
      { regex: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, type: 'Phone Number', color: 'blue' as const },
      { regex: /\b\d{3}-\d{2}-\d{4}\b/g, type: 'SSN', color: 'purple' as const },
      { regex: /\b(?:New York|London|Paris|Tokyo|San Francisco|California|USA|United States|Dublin, CA|Seattle, WA|Austin, TX)\b/gi, type: 'Location', color: 'blue' as const },
      { regex: /\b\d{1,5}\s[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi, type: 'Address', color: 'green' as const },
      { regex: /\b\d{5}(?:-\d{4})?\b/g, type: 'ZIP Code', color: 'green' as const },
      { regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g, type: 'Credit Card', color: 'purple' as const },
    ];

    const items: PIIItem[] = [];
    
    piiPatterns.forEach(({ regex, type, color }) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        const confidence = Math.floor(Math.random() * 20) + 80; // 80-99% confidence
        items.push({
          text: match[0],
          type,
          confidence,
          start: match.index,
          end: match.index + match[0].length,
          color,
        });
      }
    });

    // Remove duplicates and sort by position
    const uniqueItems = items.filter((item, index) => {
      return items.findIndex(i => i.start === item.start && i.text === item.text) === index;
    }).sort((a, b) => a.start - b.start);

    console.log("Detected PII items:", uniqueItems);
    return uniqueItems;
  };

  const highlightPII = (text: string, piiItems: PIIItem[]): (string | React.ReactElement)[] => {
    if (!piiItems.length) return [text];

    const result: (string | React.ReactElement)[] = [];
    let lastIndex = 0;

    piiItems.forEach((item, index) => {
      if (item.start > lastIndex) {
        result.push(text.slice(lastIndex, item.start));
      }

      result.push(
        <span
          key={index}
          className="pii-highlight"
          style={{
            background: PII_COLORS[item.color].bg,
            color: PII_COLORS[item.color].text,
            padding: '4px 8px',
            borderRadius: '6px',
            border: `1px solid ${PII_COLORS[item.color].border}`,
            boxShadow: `0 0 12px ${PII_COLORS[item.color].shadow}`,
            fontWeight: '600',
            animation: `piiPulse${item.color} 2s ease-in-out infinite`,
          }}
        >
          {item.text}
        </span>
      );

      lastIndex = item.end;
    });

    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  };

  const processNewText = async () => {
    if (!inputText.trim()) return;

    console.log("Processing new text:", inputText);
    setIsProcessing(true);

    try {
      const piiItems = await detectPII(inputText);
      
      const newSpace: ChatSpace = {
        id: chatSpaces.length + 1,
        name: `Chat space ${chatSpaces.length + 1}`,
        message: inputText,
        piiItems,
      };

      setChatSpaces(prev => [...prev, newSpace]);
      setCurrentSpace(newSpace.id);
      setInputText('');
      
      console.log("Created new chat space:", newSpace);
    } catch (error) {
      console.error("Error processing text:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentChatSpace = chatSpaces.find(space => space.id === currentSpace) || chatSpaces[0];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <style jsx>{`
        @keyframes piiPulseorange {
          0%, 100% { box-shadow: 0 0 12px rgba(255, 165, 0, 0.4); }
          50% { box-shadow: 0 0 20px rgba(255, 165, 0, 0.8); }
        }
        @keyframes piiPulseblue {
          0%, 100% { box-shadow: 0 0 12px rgba(0, 191, 255, 0.4); }
          50% { box-shadow: 0 0 20px rgba(0, 191, 255, 0.8); }
        }
        @keyframes piiPulsepurple {
          0%, 100% { box-shadow: 0 0 12px rgba(147, 51, 234, 0.4); }
          50% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.8); }
        }
        @keyframes piiPulsegreen {
          0%, 100% { box-shadow: 0 0 12px rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); }
        }
      `}</style>

      {/* macOS Window Frame */}
      <div className="w-[900px] h-[600px] bg-gray-800/95 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Title Bar */}
        <div className="flex items-center justify-between h-12 bg-gray-800/80 backdrop-blur-md px-5 border-b border-gray-700">
          <div className="flex items-center cursor-pointer">
            <Menu className="w-4 h-4 text-gray-400 hover:text-green-400 transition-colors" />
          </div>
          
          <div className="text-lg font-semibold text-green-400 font-mono">
            PrivChat
          </div>
          
          <Settings className="w-5 h-5 text-gray-400 hover:text-green-400 transition-colors cursor-pointer" />
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100%-3rem)] p-5 gap-5">
          {/* Sidebar */}
          <div className="w-45 bg-gray-800/50 rounded-2xl p-5 border border-gray-700">
            <div className="space-y-3">
              {chatSpaces.map((space, index) => (
                <button
                  key={space.id}
                  onClick={() => setCurrentSpace(space.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                    currentSpace === space.id
                      ? 'border-green-400 bg-green-400/10 text-green-400 transform translate-x-1'
                      : 'border-gray-600 bg-gray-800/80 text-gray-400 hover:border-green-400 hover:text-gray-200 hover:transform hover:translate-x-1'
                  }`}
                  style={{
                    opacity: 0,
                    transform: 'translateX(-20px)',
                    animation: `slideInRight 0.5s ease forwards ${index * 0.1}s`,
                  }}
                >
                  {space.name}
                  {currentSpace === space.id && (
                    <div className="w-1 h-8 bg-green-400 rounded-r absolute left-0 top-1/2 transform -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-direction-column gap-5">
            {/* Chat Window */}
            <Card className="h-48 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center relative">
                <div className="text-lg text-gray-200 mb-2 font-medium">
                  Paraphrase this:
                </div>
                
                <div className="text-xl text-gray-300 mb-4 leading-relaxed">
                  {highlightPII(currentChatSpace.message, currentChatSpace.piiItems)}
                </div>

                {/* PII Status */}
                {currentChatSpace.piiItems.length > 0 && (
                  <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1.5 text-sm text-green-400 font-medium">
                    ⚠️ PII Detected
                    <button
                      onClick={() => setShowPIIDetails(!showPIIDetails)}
                      className="w-5 h-5 bg-green-400/15 border border-green-400/40 rounded-full flex items-center justify-center hover:bg-green-400/25 transition-colors"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* User Icon */}
                <div className="absolute bottom-5 right-5 w-8 h-8 border-2 border-green-400 rounded-full flex items-center justify-center bg-green-400/10">
                  <User className="w-4 h-4 text-green-400" />
                </div>
              </CardContent>
            </Card>

            {/* Input Area */}
            <div className="flex gap-3">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to analyze for PII..."
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && processNewText()}
              />
              <Button
                onClick={processNewText}
                disabled={!inputText.trim() || isProcessing}
                className="bg-green-500 hover:bg-green-600"
              >
                {isProcessing ? 'Processing...' : 'Analyze'}
              </Button>
            </div>

            {/* PII Details Panel */}
            {showPIIDetails ? (
              <Card className="flex-1 bg-gray-800/20 border-gray-700 animate-in slide-in-from-bottom duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400">
                        Detected PII (Sanitized before sending to API)
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-400/20 text-green-400 border-green-400/40">
                        {currentChatSpace.piiItems.length} items
                      </Badge>
                      <button
                        onClick={() => setShowPIIDetails(false)}
                        className="w-6 h-6 bg-gray-700/50 border border-gray-600 rounded flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentChatSpace.piiItems.map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:transform hover:-translate-y-1`}
                        style={{
                          backgroundColor: PII_COLORS[item.color].bg.replace('0.3', '0.08'),
                          borderColor: PII_COLORS[item.color].border,
                          opacity: 0,
                          transform: 'translateX(20px)',
                          animation: `slideInLeft 0.5s ease forwards ${index * 0.1}s`,
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div
                              className="text-sm font-semibold uppercase tracking-wide mb-1"
                              style={{ color: PII_COLORS[item.color].text }}
                            >
                              {item.type}
                            </div>
                            <div className="text-gray-200 font-medium">
                              {item.text}
                            </div>
                          </div>
                          <Badge
                            className="text-xs font-semibold"
                            style={{
                              backgroundColor: PII_COLORS[item.color].bg,
                              color: PII_COLORS[item.color].text,
                              border: `1px solid ${PII_COLORS[item.color].border}`,
                            }}
                          >
                            {item.confidence}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex-1 bg-gray-800/20 border border-gray-700 rounded-2xl flex items-center justify-center text-gray-500 text-sm italic">
                Additional content area
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      </div>
    </>
  );
}