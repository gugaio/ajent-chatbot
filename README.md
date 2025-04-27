# 🧠 AgentChat

A React-based, lightweight, fully customizable **AI Agent Chatbot UI Component** with optional **voice input and playback** support.

## ✨ Features

- 📜 Simple and elegant chat UI
- 🎙️ Audio recording to text (speech-to-text) via `ajent`
- 🔊 Audio playback of messages
- 🎨 Fully customizable theming
- 📦 Easy to embed into any React app
- ⚡ Built with **Vite**, **TailwindCSS**, and **React 18**

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

Ensure you also have ajent (or your preferred audio service) installed and configured.


### 3. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
### 4. Build for Production
```bash
npm run build
# or
yarn build
```

## 🧩 Usage
You can directly use the exported AgentChat component in your app:

```jsx
import { AgentChat } from './path-to-agentchat';

function App() {
  const API_URL = 'http://your-api-url';
  const API_TOKEN = 'your-api-token';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <AgentChat apiUrl={API_URL} apiToken={API_TOKEN} />
    </div>
  );
}
```

## Theming
You can pass a custom theme prop to override the TailwindCSS classes used inside AgentChat.

Default theme structure:

```javascript
{
  container: "flex flex-col h-full max-w-2xl mx-auto bg-white rounded-lg shadow-md",
  header: "p-4 border-b border-gray-200",
  title: "text-xl font-semibold text-gray-800",
  messagesContainer: "flex-grow p-4 overflow-y-auto",
  loadingContainer: "flex justify-start mb-4 animate-pulse",
  loadingBubble: "flex space-x-2 p-3 bg-gray-200 rounded-xl",
  loadingDot: "w-2 h-2 bg-gray-500 rounded-full",
}
```
Override any of these individually by passing your own theme object.

## 👨‍💻 Author
Made with ❤️ by Gustavo Barros