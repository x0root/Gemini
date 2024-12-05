import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [promptResponse, setPromptResponse] = useState(''); // Single response
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Theme state
  const [responseTime, setResponseTime] = useState(null); // Response time

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAy9RQYz8BJPfChq0i87IpsyVMU3CW5V4Y"
    // Add your API key here
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      getResponseForGivenPrompt();
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const getResponseForGivenPrompt = async () => {
    try {
      setLoading(true);
      const startTime = performance.now(); // Start timing
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(inputValue);
      const endTime = performance.now(); // End timing
      setResponseTime((endTime - startTime).toFixed(2)); // Calculate and store response time
      setInputValue('');
      const response = result.response;
      const text = response.text();
      console.log(text);
      setPromptResponse(text); // Replace previous response
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log("Something Went Wrong");
      setLoading(false);
    }
  };

  return (
    <div 
      className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100" 
      style={{ 
        backgroundColor: darkMode ? '#212121' : '#ffffff', 
        color: darkMode ? 'white' : 'black' 
      }}
    >
      {/* Theme Toggle Button */}

      {/* Response Time Display */}
      {responseTime && (
        <div 
          className="response-time position-absolute" 
          style={{ bottom: '10px', left: '10px', color: darkMode ? 'white' : 'black' }}
        >
          Response Time: {responseTime} ms
        </div>
      )}

      <div className="text-center">
        <h1 style={{ color: darkMode ? 'white' : 'black' }}>Gemini AI</h1>
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Detect Enter key
          placeholder="Ask me something you want"
          className="form-control mx-auto my-3"
          style={{ 
            maxWidth: '600px', 
            height: '100px', 
            fontSize: '18px', 
            color: darkMode ? 'white' : 'black', 
            backgroundColor: darkMode ? '#212121' : '#f9f9f9', 
            border: `1px solid ${darkMode ? 'white' : 'black'}` 
          }}
        />
        <button 
          onClick={getResponseForGivenPrompt} 
          className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`} // Dynamic button style
          style={{ fontSize: '18px' }}
        >
          Send
        </button>

        {/* AI Response Box */}
        <div 
          className="ai-response-box mt-4 p-3 rounded mx-auto" 
          style={{ 
            maxWidth: '600px', 
            minHeight: '200px', 
            border: `1px solid ${darkMode ? 'white' : 'black'}`, 
            color: darkMode ? 'white' : 'black', 
            backgroundColor: darkMode ? '#212121' : '#f9f9f9',
            overflowY: 'auto' // Allows scrolling if responses exceed box size
          }}
        >
          {loading ? (
            <div className={`spinner-border ${darkMode ? 'text-light' : 'text-dark'}`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <div className="response-text fw-bold" style={{ marginBottom: '10px' }}>
              {promptResponse}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
