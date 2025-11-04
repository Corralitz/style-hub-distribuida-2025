// src/components/chat/AIChatBot.js
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // Install: npm install uuid

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize or retrieve session ID
  useEffect(() => {
    const initializeSession = () => {
      // Check if session ID exists in localStorage
      let storedSessionId = localStorage.getItem("ai_chat_session_id");

      if (!storedSessionId) {
        // Generate new UUID if doesn't exist
        storedSessionId = uuidv4();
        localStorage.setItem("ai_chat_session_id", storedSessionId);
        console.log("New session created:", storedSessionId);
      } else {
        console.log("Existing session loaded:", storedSessionId);
      }

      setSessionId(storedSessionId);

      // Load chat history from localStorage
      const savedMessages = localStorage.getItem(
        `chat_history_${storedSessionId}`,
      );
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    };

    initializeSession();
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(
        `chat_history_${sessionId}`,
        JSON.stringify(messages),
      );
    }
  }, [messages, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          message: input,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          data.output ||
          data.message ||
          "Sorry, I could not process your request.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Sorry, there was an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      if (sessionId) {
        localStorage.removeItem(`chat_history_${sessionId}`);
      }
    }
  };

  const resetSession = () => {
    if (
      window.confirm("Start a new session? This will clear your current chat.")
    ) {
      const newSessionId = uuidv4();
      localStorage.setItem("ai_chat_session_id", newSessionId);
      setSessionId(newSessionId);
      setMessages([]);
      console.log("New session started:", newSessionId);
    }
  };

  if (!sessionId) {
    return null; // Don't render until session is initialized
  }

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">AI Shopping Assistant</h3>
              <p className="text-xs text-indigo-100">
                Session: {sessionId.slice(0, 8)}...
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="text-white hover:text-indigo-200 text-xs px-2 py-1 rounded"
                title="Clear chat"
              >
                Clear
              </button>
              <button
                onClick={resetSession}
                className="text-white hover:text-indigo-200 text-xs px-2 py-1 rounded"
                title="New session"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-indigo-200"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle
                  size={48}
                  className="mx-auto mb-4 text-gray-300"
                />
                <p className="text-sm">
                  Hi! I'm your AI shopping assistant.
                  <br />
                  Ask me to add reviews to products!
                </p>
                <p className="text-xs mt-2 text-gray-400">
                  Example: "Add a 5-star review to the Denim Jacket"
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
