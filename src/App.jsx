import { useState } from 'react'
import './App.css'
import AgentChat from './components/AgentChat';

function App() {
  
  // Replace with your actual API configuration
  const API_URL = 'http://192.168.0.104:5000';
  const API_TOKEN = import.meta.env.VITE_AJENT_API_TOKEN;

  return (
    <div className="min-h-screen bg-neutral-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl h-full max-h-[calc(100vh-80px)] shadow-lg rounded-lg overflow-hidden">
        <AgentChat apiUrl={API_URL} apiToken={API_TOKEN} />
      </div>
    </div>
  );
}

export default App;


