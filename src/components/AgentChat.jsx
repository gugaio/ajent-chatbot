import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import '../index.css';

const AgentChat = ({ 
  onUserTextMessage, 
  title = 'Agent Chat', 
  welcomeMessage = 'Hello! How can I help you today?', 
  inputPlaceholder = 'Type your message...', 
  transcribingMessage = 'Transcribing audio...', 
  theme = {}, 
  audio = null 
}) => {

  const defaultTheme = {
    container: "flex flex-col h-full max-w-2xl mx-auto bg-white rounded-lg shadow-md",
    header: "p-4 border-b border-gray-200",
    title: "text-xl font-semibold text-gray-800",
    messagesContainer: "flex-grow p-4 overflow-y-auto",
    loadingContainer: "flex justify-start mb-4 animate-pulse",
    loadingBubble: "flex space-x-2 p-3 bg-gray-200 rounded-xl",
    loadingDot: "w-2 h-2 bg-gray-500 rounded-full",
    streamingContainer: "flex justify-start mb-4",
    streamingBubble: "p-3 bg-gray-200 rounded-xl",
  };
  
  const mergedTheme = { ...defaultTheme, ...theme };

  const [messages, setMessages] = useState([
    { role: 'assistant', content: welcomeMessage, audioUrl: null }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para atualizar o conteúdo do streaming
  const updateStreamingContent = (chunk) => {
    setStreamingContent(prev => prev + chunk);
  };

  const handleSendMessage = async (content) => {
    const newMessage = { role: 'user', content, audioUrl: null };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Iniciar streaming ao invés de mostrar o loading padrão
    setIsLoading(false);
    setIsStreaming(true);
    setStreamingContent('');
    
    try {
      // Passa a função de callback que atualiza o conteúdo em streaming
      // O componente pai deve chamar essa função para cada chunk recebido
      const finalResponse = await onUserTextMessage(content, updateStreamingContent);
      
      // Quando a resposta completa estiver pronta, adiciona à lista de mensagens
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: finalResponse || streamingContent }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: "Sorry, I encountered an error processing your request.", audioUrl: null }
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
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
        
        {/* Mostra o conteúdo em streaming */}
        {isStreaming && streamingContent && (
          <div className={mergedTheme.streamingContainer}>
            <div className={mergedTheme.streamingBubble}>
              {streamingContent}
            </div>
          </div>
        )}
        
        {/* Mostra o loading tradicional se necessário */}
        {isLoading && !isStreaming && (
          <div className={mergedTheme.loadingContainer}>
            <div className={mergedTheme.loadingBubble}>
              <div className={mergedTheme.loadingDot}></div>
              <div className={mergedTheme.loadingDot}></div>
              <div className={mergedTheme.loadingDot}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput
        onSendMessage={handleSendMessage}
        audioService={audio}
        isLoading={isLoading || isStreaming} // Desabilitar input durante streaming também
        setIsLoading={setIsLoading}
        inputPlaceholder={inputPlaceholder}
        transcribingMessage={transcribingMessage}
      />
    </div>
  );
};

export default AgentChat;