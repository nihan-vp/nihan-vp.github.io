import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: `Hi! I'm Nihan's AI assistant. Feel free to ask me anything about Nihan's projects, skills, tech, or just say hello!` }
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
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

      const systemPrompt = `You are a friendly, intelligent, and conversational AI assistant for Nihan Ali VP's portfolio (nihanvp.in).
You can chat casually, discuss software architecture, answer tech and programming questions, brainstorm, and answer anything about Nihan's skills, projects, experience, and services.
Be conversational, warm, and helpful—never robotic or overly restrictive.

=== NIHON'S PROFILE & BACKGROUND ===
- Full Name: Nihan Ali VP (also known as Nihan VP)
- Current Company: UNIFIED PRO26 LLP ([www.pro26.in](https://www.pro26.in))
- Role: Full-Stack Developer, Connected IoT Systems Engineer & AI Enthusiast at UNIFIED PRO26 LLP
- Experience: 5+ years of coding experience, 50+ projects built, 1000+ GitHub contributions
- Education / Alma Mater: Calicut University
- Location: India (Open to global collaborations, enterprise projects, and partnerships)
- Portfolio Website: [nihanvp.in](https://nihanvp.in)
- Company Website: [www.pro26.in](https://www.pro26.in)

=== TECHNICAL STACK & SKILLS ===
- Languages: TypeScript, JavaScript (ES6+), Python, Dart, C++, HTML5, CSS3, SQL
- Frontend: React, Next.js, Tailwind CSS, Framer Motion, Three.js, Lucide Icons, Responsive & 3D Interactive Web UI
- Backend: Node.js, Express, Flask, RESTful APIs, WebSockets, MQTT Protocol
- Databases & Cloud: MongoDB, PostgreSQL, Firebase (Firestore, Auth, Storage), Docker, Git & GitHub, Vercel
- Mobile: Flutter, Dart
- Hardware & IoT: Arduino, Raspberry Pi, ESP32, Modbus, BLE, LoRaWAN, Solar Telemetry, Smart Home Hubs, Sensor Integration
- Design & Tools: Figma, Photoshop, Blender, VS Code

=== KEY PROJECTS ===
1. Eco-Monitoring IoT System: Real-time environmental telemetry platform with React dashboard, Node.js backend, and Raspberry Pi sensors.
2. AI-Powered Code Assistant: Generative AI web application helping developers write, debug, and optimize code built with Next.js, TypeScript, and Tailwind CSS.
3. Decentralized Voting App: Secure blockchain-based voting application with React and Ethereum smart contracts (Solidity, Ethers.js).
4. Smart Home Automation Hub: Open-source hub with Flask, React, Arduino, and MQTT for unified device automation.
5. Pro26 3D Vortex: Signature interactive 3D particle vortex and branding experience built with Three.js.

=== PRODUCTS & VENTURES ===
- LumeOS Gateway: Industrial-grade edge IoT gateway hub (ESP32, Raspberry Pi, C++, MQTT, Wi-Fi, LoRa).
- AI GenBoiler: SaaS code generation platform compiling database schemas into enterprise React/Node.js/TypeScript codebases.
- HydroSense Telemetry: Ultra-low power solar-driven smart agricultural IoT sensor node with LoRaWAN telemetry.
- VibeMesh Cloud: Real-time high-throughput IoT dashboard broker for distributed sensor networks.

=== CONTACT & SOCIALS ===
- Email: [${PERSONAL_INFO.email}](mailto:${PERSONAL_INFO.email})
- Phone: ${PERSONAL_INFO.phone}
- GitHub: [GitHub](${PERSONAL_INFO.socials.github})
- LinkedIn: [LinkedIn](${PERSONAL_INFO.socials.linkedin})
- Twitter: [Twitter](https://twitter.com/nihan_vp)
- Instagram: [Instagram](https://www.instagram.com/nihan_vp/)

Use Markdown for clean formatting (e.g., bullet points, bold keywords, and links). If asked about Nihan's rates or availability, encourage them to reach out via email or LinkedIn.`;

      if (geminiApiKey) {
        // Available Gemini models ordered by highest quota (500 RPD -> 20 RPD)
        const availableModels = [
          'gemini-3.1-flash-lite',
          'gemini-2.5-flash-lite',
          'gemini-3.5-flash',
          'gemini-2.5-flash'
        ];

        let botResponse = '';
        let lastError = '';

        for (const model of availableModels) {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{ text: systemPrompt }]
                  },
                  contents: [
                    ...messages
                      .filter((_, i) => i > 0)
                      .map((m) => ({
                        role: m.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }]
                      })),
                    {
                      role: 'user',
                      parts: [{ text: userMsg }]
                    }
                  ],
                  generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7
                  }
                })
              }
            );

            if (response.ok) {
              const data = await response.json();
              botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (botResponse) break;
            } else {
              const errData = await response.json().catch(() => ({}));
              lastError = errData?.error?.message || `Status ${response.status}`;
            }
          } catch (e: any) {
            lastError = e?.message || 'Network error';
          }
        }

        if (botResponse) {
          setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
          return;
        } else if (lastError) {
          throw new Error(lastError);
        }
      }

      // Default offline fallback if API key is not configured or unavailable
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Thanks for reaching out! I'm Nihan's portfolio assistant. You can contact Nihan directly at ${PERSONAL_INFO.email} or connect on LinkedIn at ${PERSONAL_INFO.socials.linkedin}.`
          }
        ]);
      }, 500);
    } catch (err: any) {
      console.error("Chatbot API error:", err);
      setMessages((prev) => [...prev, { sender: 'bot', text: "Error: " + (err.message || "Failed to connect to AI service.") }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedMessage = (text: string) => {
    const lines = text.split('\n');

    const parseInline = (content: string) => {
      const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
      const parts = content.split(regex);

      return parts.map((part, i) => {
        if (!part) return null;

        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          return (
            <a
              key={i}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-cyan)] underline font-medium hover:text-cyan-300 inline-block transition-colors"
            >
              {linkText}
            </a>
          );
        }

        const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
        if (boldMatch) {
          return (
            <strong key={i} className="font-semibold text-white">
              {boldMatch[1]}
            </strong>
          );
        }

        const codeMatch = part.match(/^`(.*?)`$/);
        if (codeMatch) {
          return (
            <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-[var(--accent-cyan)] font-mono text-xs">
              {codeMatch[1]}
            </code>
          );
        }

        const italicMatch = part.match(/^\*(.*?)\*$/);
        if (italicMatch) {
          return <em key={i}>{italicMatch[1]}</em>;
        }

        return <span key={i}>{part}</span>;
      });
    };

    return (
      <div className="space-y-1.5 break-words leading-relaxed">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIdx} className="h-1" />;

          const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
          const cleanLine = isBullet ? trimmed.replace(/^[\*\-\•]\s+/, '') : line;

          if (isBullet) {
            return (
              <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
                <span className="text-[var(--accent-cyan)] text-xs mt-0.5">•</span>
                <div className="flex-1">{parseInline(cleanLine)}</div>
              </div>
            );
          }

          return <div key={lineIdx}>{parseInline(cleanLine)}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-1.5rem)]">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant Chat"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform border border-white/10"
        >
          <MessageSquare size={20} className="sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] sm:w-96 max-h-[calc(100dvh-5rem)] h-[480px] glass-card flex flex-col overflow-hidden border border-white/10 shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-cyan)]/20 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-[var(--accent-cyan)]" />
              <span className="font-bold font-heading text-sm text-white">Nihan's AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat Window"
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
                {renderFormattedMessage(msg.text)}
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
              aria-label="Send message"
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
