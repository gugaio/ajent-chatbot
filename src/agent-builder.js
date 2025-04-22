const axios = require('axios');

export class AgentChatbot {
    constructor(options) {
      // Configuration
      this.container = document.querySelector(options.container || '#agent');
      this.botName = options.botName || 'Agent';
      this.userName = options.userName || 'You';
      this.placeholder = options.placeholder || 'Type your message...';
      this.welcomeMessage = options.welcomeMessage || 'Hello! How can I help you today?';
      this.typingDelay = options.typingDelay || 1000;
      this.chatHistory = [];
      
      const API_URL = 'http://192.168.0.104:5000';
      const API_TOKEN = 'your-api-token';
      this.baseUrl = API_URL;
      this.apiToken = API_TOKEN;
  
  
      if (!this.container) {
        console.error('Container element not found');
        return;
      }
      this.audioSupport = options.audioSupport || false;
      this.init();
    }
  
    init() {
      // Create chat interface
      this.container.innerHTML = `
        <div class="chat-container" style="
          border: 1px solid #ccc;
          border-radius: 8px;
          max-width: 500px;
          margin: 20px auto;
          font-family: Arial, sans-serif;
        ">
          <div class="chat-messages" style="
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            background: #f9f9f9;
          "></div>
          
          <div class="chat-input" style="
            padding: 20px;
            background: #fff;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
          ">
           <button class="chat-record-btn" style="
            padding: 10px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: ${this.audioSupport ? 'block' : 'none'};
          ">🎤</button>
            <input type="text" class="chat-input-field" style="
              flex: 1;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
            " placeholder="${this.placeholder}">
            <button class="chat-send-btn" style="
              padding: 10px 20px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">Send</button>
          </div>
          
          <div class="typing-indicator" style="
            display: none;
            padding: 10px 20px;
            font-style: italic;
            color: #666;
          ">${this.botName} is typing...</div>
        </div>
      `;
  
      // DOM elements
      this.messagesContainer = this.container.querySelector('.chat-messages');
      this.inputField = this.container.querySelector('.chat-input-field');
      this.sendButton = this.container.querySelector('.chat-send-btn');
      this.typingIndicator = this.container.querySelector('.typing-indicator');
      this.recordButton = this.container.querySelector('.chat-record-btn');
  
      // Event listeners
      this.sendButton.addEventListener('click', () => this.handleUserInput());
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserInput();
      });
      this.recordButton.addEventListener('click', () => {
        if (this.audioSupport) {
          this.startRecording()
            .then(recorder => {
              console.log("Recording started:", recorder);
            })
            .catch(error => {
              console.error("Error starting recording:", error);
            });
        } else {
          console.warn('Audio support is not enabled.');
        }
      });
  
      // Show welcome message
      this.addBotMessage(this.welcomeMessage);
    }

    async startRecording() {
      try {
          const recorder = await chatService.current.recordAudio(10000); // 10 seconds max
          console.log("Recorder returned from recordAudio:", recorder);

          recorder.promise.then(audioBlob => {
              console.log("Recording complete:", audioBlob);
              handleSendAudio.processAudio(audioBlob);
          });
    
          return recorder;
        } catch (error) {
          console.error("Error recording audio:", error);
          throw error;
        }
  }
  
    handleUserInput() {
      const message = this.inputField.value.trim();
      if (!message) return;
  
      this.addUserMessage(message);
      this.inputField.value = '';
      this.showTypingIndicator();
      
      // Simulate bot response after delay
      setTimeout(() => {
        this.hideTypingIndicator();
        const response = this.handleBotResponse(message);
        this.addBotMessage(response);
      }, this.typingDelay);
    }
  
    addUserMessage(message) {
      this.chatHistory.push({ type: 'user', content: message });
      this.messagesContainer.innerHTML += `
        <div class="message user-message" style="
          margin-bottom: 15px;
          text-align: right;
        ">
          <div style="
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 10px 15px;
            border-radius: 15px;
            max-width: 80%;
          ">${message}</div>
          <div class="timestamp" style="
            font-size: 0.8em;
            color: #666;
            margin-top: 5px;
          ">${this.getCurrentTime()} - ${this.userName}</div>
        </div>
      `;
      this.scrollToBottom();
    }
  
    addBotMessage(message) {
      this.chatHistory.push({ type: 'bot', content: message });
      this.messagesContainer.innerHTML += `
        <div class="message bot-message" style="
          margin-bottom: 15px;
        ">
          <div style="
            display: inline-block;
            background: #e9ecef;
            color: #333;
            padding: 10px 15px;
            border-radius: 15px;
            max-width: 80%;
          ">${message}</div>
          <div class="timestamp" style="
            font-size: 0.8em;
            color: #666;
            margin-top: 5px;
          ">${this.getCurrentTime()} - ${this.botName}</div>
        </div>
      `;
      this.scrollToBottom();
    }
  
    showTypingIndicator() {
      this.typingIndicator.style.display = 'block';
      this.scrollToBottom();
    }
  
    hideTypingIndicator() {
      this.typingIndicator.style.display = 'none';
    }
  
    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  
    getCurrentTime() {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
  
    handleBotResponse(userMessage) {
      // Default response - override this method for custom logic
      return `Received: "${userMessage}". This is a default response. Implement handleBotResponse() for custom logic.`;
    }
  }