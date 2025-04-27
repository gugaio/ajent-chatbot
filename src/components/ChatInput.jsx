
import React, { useState, useRef } from 'react';
import {Audio} from 'ajent';

const ChatInput = ({ onSendMessage, isLoading, setIsLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const audio = useRef(new Audio());

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };


  const processAudio = async (audioBlob) => {
    setIsLoading(true);
    try {
      const transcription = await audio.current.transcribeAudio(audioBlob);
      setMessage(transcription);
      setIsRecording(false);
    } catch (error) {
      console.error("Error processing audio:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: "Sorry, I encountered an error processing your audio.", audioUrl: null }
      ]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await audio.current.startRecording(processAudio)
      console.log("Recorder started:", recorderRef.current);
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    await audio.current.stopAndSend();
    setIsRecording(false);
  };

  return (
    <div className="border-t border-gray-200 px-4 py-3 bg-white">
      <form onSubmit={handleSendMessage} className="flex items-center">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`flex-shrink-0 mr-2 p-2 rounded-full
                    ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'}
                    text-gray-700 transition-colors duration-200`}
        >
          {isRecording ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="9" y="9" width="6" height="6" strokeWidth="2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow py-2 px-4 outline-none bg-gray-100 rounded-full"
          disabled={isLoading || isRecording}
        />
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading || isRecording}
          className={`flex-shrink-0 ml-2 p-2 rounded-full w-10
                   ${(!message.trim() || isLoading || isRecording) ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'} 
                   transition-colors duration-200`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
