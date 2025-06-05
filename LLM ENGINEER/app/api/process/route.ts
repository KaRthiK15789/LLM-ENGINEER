import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Mock spaCy NER function since we can't run Python directly in Node.js
// In a real implementation, this would call a Python service or spaCy REST API
function mockSpacyNER(text: string) {
  console.log("Starting spaCy NER analysis for text:", text);
  
  // Common patterns for different entity types
  const patterns = {
    PERSON: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // First Last names
    ORG: /\b(Microsoft|Google|Apple|Amazon|OpenAI|Anthropic|Meta|Tesla|SpaceX)\b/gi,
    GPE: /\b(New York|London|Paris|Tokyo|San Francisco|California|USA|United States)\b/gi,
    MONEY: /\$[\d,]+(?:\.\d{2})?/g,
    DATE: /\b(?:today|tomorrow|yesterday|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/gi,
    TIME: /\b\d{1,2}:\d{2}(?:\s?[AaPp][Mm])?\b/g,
  };

  const entities: Array<{text: string, label: string, start: number, end: number}> = [];
  
  Object.entries(patterns).forEach(([label, pattern]) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        label,
        start: match.index,
        end: match.index + match[0].length
      });
    }
  });

  // Sort by start position and remove duplicates (same text, same position)
  entities.sort((a, b) => a.start - b.start);
  
  // Remove duplicate entities at the same position
  const uniqueEntities = entities.filter((entity, index) => {
    if (index === 0) return true;
    const prev = entities[index - 1];
    return !(entity.start === prev.start && entity.end === prev.end && entity.text === prev.text);
  });
  
  console.log("Detected named entities:", uniqueEntities);
  return uniqueEntities;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    console.log("Received prompt for processing:", prompt);

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Step 1: Run spaCy NER (mocked)
    const entities = mockSpacyNER(prompt);
    console.log("Named entities detected:", entities);

    // Step 2: Call Ollama API
    console.log("Sending prompt to Ollama LLM:", prompt);
    let llmResponse = '';
    let ollamaError = null;

    try {
      const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2', // Using a common model, can be changed
        prompt: prompt,
        stream: false
      }, {
        timeout: 30000 // 30 second timeout
      });

      llmResponse = ollamaResponse.data.response;
      console.log("Response from LLM:", llmResponse);
    } catch (error) {
      ollamaError = error;
      console.error("Error calling Ollama API:", error);
      
      // Provide a mock response if Ollama is not available
      llmResponse = `[MOCK RESPONSE - Ollama not available] Based on your prompt "${prompt}", I would provide a helpful response discussing the mentioned topics and entities.`;
      console.log("Using mock LLM response due to Ollama error:", llmResponse);
    }

    // Log the complete results to console as required
    console.log("=== FINAL RESULTS ===");
    console.log("Detected named entities from input prompt:", entities);
    console.log("Response from the LLM:", llmResponse);
    console.log("====================");

    return NextResponse.json({
      entities,
      llmResponse,
      ollamaAvailable: !ollamaError,
      error: ollamaError ? 'Ollama API not available - using mock response' : null
    });

  } catch (error) {
    console.error("Error in processing endpoint:", error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}