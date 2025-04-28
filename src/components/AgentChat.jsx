import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import '../index.css';

const AgentChat = ({ onUserTextMessage, title = 'Agent Chat', welcomeMessage='Hello! How can I help you today?', inputPlaceholder='Type your message...', theme = {}, audio = null}) => {

  const defaultTheme = {
    container: "flex flex-col h-full max-w-2xl mx-auto bg-white rounded-lg shadow-md",
    header: "p-4 border-b border-gray-200",
    title: "text-xl font-semibold text-gray-800",
    messagesContainer: "flex-grow p-4 overflow-y-auto",
    loadingContainer: "flex justify-start mb-4 animate-pulse",
    loadingBubble: "flex space-x-2 p-3 bg-gray-200 rounded-xl",
    loadingDot: "w-2 h-2 bg-gray-500 rounded-full",
  };
  
  const mergedTheme = { ...defaultTheme, ...theme };

  const [messages, setMessages] = useState([
    { role: 'assistant', content: welcomeMessage, audioUrl: null }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content) => {
    const newMessage = { role: 'user', content, audioUrl: null };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setIsLoading(true);
    
    try {
      const response = await onUserTextMessage(content);
      
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: response}
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: "Sorry, I encountered an error processing your request.", audioUrl: null }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the audio recording process
  useEffect(() => {
    const handleAudioRecording = async (recorder) => {
      try {
        const audioBlob = await recorder;
        await handleSendAudio.processAudio(audioBlob);
      } catch (error) {
        console.error("Audio recording error:", error);
      }
    };
    
    // The actual recording starts in the ChatInput component and is processed here
    return () => {};
  }, []);

  return (
    <div className={mergedTheme.container}>
      <div className={mergedTheme.header}>
        <h1 className={mergedTheme.title}>{title}</h1>
      </div>
      
      <div className={mergedTheme.messagesContainer}>
        {messages.filter(msg => msg.role !== 'system').map((message, index) => (
          <ChatBubble
            key={index}
            message={message}
            isUser={message.role === 'user'}
            audioUrl={message.audioUrl}
          />
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className={mergedTheme.loadingContainer}>
            <div className={mergedTheme.loadingBubble}>
              <div className={mergedTheme.loadingDot}></div>
              <div className={mergedTheme.loadingDot}></div>
              <div className={mergedTheme.loadingDot}></div>
            </div>
          </div>
        )}
      </div>
      
      <ChatInput
        onSendMessage={handleSendMessage}
        audioService={audio}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        inputPlaceholder={inputPlaceholder}
      />
    </div>
  );
};

export default AgentChat;
