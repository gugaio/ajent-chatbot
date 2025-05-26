import React, {useEffect, useRef} from 'react';
import AudioButton from './AudioButton';
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; 

const escapeHTML = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const ChatBubble = ({ message, isUser, audioUrl }) => {

  const messageRef = useRef(null);

  useEffect(() => {
    // Highlight code blocks in the message content
    if (messageRef.current) {
      messageRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [message]);

  const formatMessage = (text) => {
    // Handle text highlights (**) before code blocks
    const highlightedText = text.replace(
      /\*\*(.*?)\*\*/g,
      (_, content) => `<strong>${escapeHTML(content)}</strong>`
    );

    // Handle code blocks (```)
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    return highlightedText.replace(codeRegex, (_, lang, code) => {
      const languageClass = lang ? `language-${lang}` : "";
      return `<pre><code class="${languageClass}">${escapeHTML(
        code.trim()
      )}</code></pre>`;
    });
  };


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
          <p className="text-sm break-words">
              <div
            ref={messageRef}
            className="message-content"
            dangerouslySetInnerHTML={{
              __html: formatMessage(message.content),
            }}
          />
          </p>
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
