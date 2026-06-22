import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: `Hi! I'm Nihan's AI assistant. Ask me anything about his projects, skills, or professional experience!` }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputText("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin.includes("localhost") ? "https://nihan-vp.me" : window.location.origin,
          "X-Title": "Nihan Portfolio Chatbot"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content: `You are a helpful, professional AI assistant of Nihan Ali VP, a full-stack developer skilled in React, Node.js, MongoDB, IoT, and AI. Keep your answers concise, engaging, and professional. 
              Here is Nihan's info:
              - Email: ${PERSONAL_INFO.email}
              - GitHub: ${PERSONAL_INFO.socials.github}
              - LinkedIn: ${PERSONAL_INFO.socials.linkedin}
              - Phone No: ${PERSONAL_INFO.phone}
              If asked questions unrelated to Nihan or software development, guide the user back to Nihan's experience.`
            },
            {
              role: "user",
              content: userMsg
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter Response Error Status:", response.status, errorText);
        setMessages((prev) => [...prev, { sender: 'bot', text: `OpenRouter Error ${response.status}: ${errorText || "Resource not found. Please double-check your API key and OpenRouter data policy settings."}` }]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const botResponse = data?.choices?.[0]?.message?.content || "Sorry, I'm having trouble connecting to OpenRouter right now. Please try again later.";
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (err: any) {
      console.error("OpenRouter fetch error:", err);
      setMessages((prev) => [...prev, { sender: 'bot', text: "Oops! Something went wrong while connecting: " + (err.message || err) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform border border-white/10"
        >
          <MessageSquare size={20} className="sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-96 h-[440px] sm:h-[480px] glass-card flex flex-col overflow-hidden border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-cyan)]/20 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-[var(--accent-cyan)]" />
              <span className="font-bold font-heading text-sm text-white">Nihan's AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages block */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 flex flex-col">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-3.5 py-2 rounded-xl text-sm ${msg.sender === 'user'
                    ? 'bg-[var(--accent-blue)]/80 text-white self-end rounded-tr-none'
                    : 'bg-white/[0.04] border border-white/[0.08] text-gray-200 self-start rounded-tl-none'
                  }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white/[0.04] border border-white/[0.08] text-gray-400 max-w-[85%] px-3.5 py-2 rounded-xl text-sm self-start rounded-tl-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2 bg-black/20">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)]"
            />
            <button
              type="submit"
              className="p-2 bg-[var(--accent-blue)] hover:bg-[var(--accent-cyan)] text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
