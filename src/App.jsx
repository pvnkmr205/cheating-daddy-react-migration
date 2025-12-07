import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to Cheating Daddy. Ready to start?", sender: 'bot' }
  ]);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const handleStartSession = () => {
    // 1. Call the backend (Electron)
    if (window.electronAPI) {
        window.electronAPI.startSession();
        console.log("Signal sent to Electron Backend");
    }
    
    // 2. Update UI state
    setIsSessionActive(true);
    addMessage("Session Started. Stealth Mode Active.", "bot");
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add User Message
    addMessage(input, "user");

    // Simulate AI Response (For the UI Demo)
    setTimeout(() => {
        addMessage("This is a mock response. Connect Gemini API to get real answers!", "bot");
    }, 1000);

    setInput('');
  };

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Cheating Daddy <span className="tag">React</span></h1>
        <button 
            className={`session-btn ${isSessionActive ? 'active' : ''}`} 
            onClick={handleStartSession}
        >
            {isSessionActive ? '● Session Active' : 'Start Session'}
        </button>
      </header>

      <div className="chat-window">
        {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.sender}`}>
                <div className="bubble">
                    {msg.text}
                </div>
            </div>
        ))}
      </div>

      <form className="input-area" onSubmit={handleSend}>
        <input 
            type="text" 
            placeholder="Ask a question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;