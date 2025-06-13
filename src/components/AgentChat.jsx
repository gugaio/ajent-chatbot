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
    container: "flex flex-col max-h-[90vh] max-w-4xl mx-auto bg-white rounded-lg shadow-md",
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
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para atualizar o conteúdo do streaming - sempre atualiza a última mensagem
  const updateStreamingContent = (newContent) => {
    console.log("Updating streaming content:", newContent);
    setMessages((prevMessages) => {
      const messages = [...prevMessages];
      const lastIndex = messages.length - 1;
      
      // Atualiza a última mensagem (que sempre será do assistant)
      if (lastIndex >= 0) {
        messages[lastIndex] = {
          ...messages[lastIndex],
          content: messages[lastIndex].content + newContent,
        };
      }
      
      return messages;
    });
  };

  const updateStreamingThinking = (newContent) => {
    console.log("Updating streaming content:", newContent);
    setMessages((prevMessages) => {
      const messages = [...prevMessages];
      const lastIndex = messages.length - 1;
      
      // Atualiza a última mensagem (que sempre será do assistant)
      if (lastIndex >= 0) {
        messages[lastIndex] = {
          ...messages[lastIndex],
          thinking: messages[lastIndex].thinking + newContent,
        };
      }
      
      return messages;
    });
  };

  const handleSendMessage = async (content) => {
    const newMessage = { role: 'user', content, thinking: '', audioUrl: null };
    const emptyAssistantMessage = { role: 'assistant', content: '', thinking: '', audioUrl: null };
    
    // Adiciona a mensagem do usuário E a mensagem vazia do assistente de uma vez
    setMessages(prevMessages => [...prevMessages, newMessage, emptyAssistantMessage]);
    
    // Iniciar streaming
    setIsStreaming(true);
    
    try {
      // A mensagem vazia do assistant já está lá, updateStreamingContent sempre pega a última
      const finalResponse = await onUserTextMessage(content, updateStreamingContent, updateStreamingThinking);
      
      // SEMPRE substitui pelo finalResponse (caso o stream não tenha sido chamado)
      if (finalResponse) {
        console.log("Final response received:", finalResponse);
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;
          updatedMessages[lastIndex] = {
            content: finalResponse || updatedMessages[lastIndex].content,
            thinking: updatedMessages[lastIndex].thinking
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Substitui a última mensagem (que seria a vazia) por uma de erro
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          content: "Sorry, I encountered an error processing your request."
        };
        return updatedMessages;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  // Handle the audio recording process
  useEffect(() => {
    const handleAudioRecording = async (recorder) => {
      try {
        const audioBlob = await recorder;
        // Assumindo que você tem uma função handleSendAudio definida em algum lugar
        // await handleSendAudio.processAudio(audioBlob);
      } catch (error) {
        console.error("Audio recording error:", error);
      }
    };
    
    return () => {};
  }, []);

  return (
    <div className={mergedTheme.container}>      
      <div className={mergedTheme.messagesContainer}>
        {messages.filter(msg => msg.role !== 'system').map((message, index) => (
          <ChatBubble
            key={index}
            message={message}
            isUser={message.role === 'user'}
            audioUrl={message.audioUrl}
          />
        ))}
        
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
        isLoading={isLoading || isStreaming}
        setIsLoading={setIsLoading}
        inputPlaceholder={inputPlaceholder}
        transcribingMessage={transcribingMessage}
      />
    </div>
  );
};

export default AgentChat;