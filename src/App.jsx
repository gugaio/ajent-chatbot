import { useState } from 'react'
import './App.css'
import VoiceChatbot from './components/VoiceChatbot';

function App() {
  
  // Replace with your actual API configuration
  const API_URL = 'http://192.168.0.104:5000';
  const API_TOKEN = 'your-api-token';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[600px] shadow-lg rounded-lg overflow-hidden">
        <VoiceChatbot apiUrl={API_URL} apiToken={API_TOKEN} />
      </div>
    </div>
  );
}

export default App;


