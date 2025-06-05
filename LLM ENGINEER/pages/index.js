// Add this to your API call functions
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: input }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setResult(data.result);
  } catch (error) {
    console.error('Error:', error);
    setResult('Error: Failed to get response');
  }
}
