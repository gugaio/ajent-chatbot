import React from 'react';
import AudioButton from './AudioButton';

const ChatBubble = ({ message, isUser, audioUrl }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex items-end">
        {!isUser && audioUrl && (
          <div className="mr-2">
            <AudioButton audioUrl={audioUrl} />
          </div>
        )}
        
        <div className={`py-3 px-4 rounded-xl max-w-xs lg:max-w-md ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}>
          <p className="text-sm break-words">{message.content}</p>
        </div>
        
        {isUser && audioUrl && (
          <div className="ml-2">
            <AudioButton audioUrl={audioUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
