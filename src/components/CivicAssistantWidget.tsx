'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import {
  Bot,
  MessageSquare,
  X,
  Send,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Minimize2,
  RefreshCw,
  Mic,
  MicOff,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export function CivicAssistantWidget() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract case ID if user is browsing a specific report
  const reportIdMatch = pathname.match(/\/reports\/([A-Za-z0-9_-]+)/);
  const currentReportId = reportIdMatch ? reportIdMatch[1] : undefined;

  // Initialize greeting on first open or language switch
  useEffect(() => {
    let greeting = 'Hello! I am FixBot, your Civic AI Copilot. How can I help verify or report civic issues today?';
    if (language === 'kn') {
      greeting = 'ನಮಸ್ಕಾರ! ನಾನು FixBot, ನಿಮ್ಮ ಫಿಕ್ಸ್ ಪ್ರೂಫ್ AI ನಾಗರಿಕ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?';
    } else if (language === 'te') {
      greeting = 'నమస్కారం! నేను FixBot, మీ ఫిక్స్‌ప్రూఫ్ AI పౌర సహాయకుడిని. నేను మీకు ఎలా సహాయపడగలను?';
    } else if (language === 'hi') {
      greeting = 'नमस्ते! मैं FixBot हूँ, आपका फिक्सप्रूफ एआई नागरिक सहायक। आज मैं आपकी क्या मदद कर सकता हूँ?';
    }

    setMessages([
      {
        id: 'greet_1',
        sender: 'assistant',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            reportId: currentReportId,
            language,
            role: currentUser.role,
          },
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply || data.data?.reply || 'I am currently unable to process your request. Please try again.';

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Failed to communicate with assistant:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'assistant',
          text: 'Network connection issue. Please check your connectivity and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Speech Recognition (Web Speech API)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        language === 'kn' ? 'kn-IN' : language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Suggested quick prompts depending on language
  const suggestedPrompts =
    language === 'kn'
      ? ['ತಪ್ಪಾದ ಮುಕ್ತಾಯವನ್ನು ಹೇಗೆ ಪ್ರಶ್ನಿಸುವುದು?', 'ಫೋಟೋ ತೆಗೆಯುವ ನಿಯಮಗಳು', 'AI ಪರಿಶೀಲನೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?']
      : language === 'te'
      ? ['తప్పుడు ముగింపును ఎలా సవాలు చేయాలి?', 'మంచి ఫోటో తీయడం ఎలా?', 'AI ధృవీకరణ ఎలా పనిచేస్తుంది?']
      : language === 'hi'
      ? ['गलत समाप्ति को कैसे चुनौती दें?', 'अच्छी फोटो लेने के सुझाव', 'एआई सत्यापन कैसे काम करता है?']
      : [
          'How do I challenge a false closure?',
          'Tips for high-confidence photos',
          'How does AI verification work?',
          'What is the SHA-256 evidence ledger?',
        ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-xs shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          aria-label="Open FixProof AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <span className="hidden sm:inline font-bold">FixBot AI Copilot</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono tracking-tight uppercase">
            AI Civic
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-fade-in backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-sm">
                <Bot className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">FixBot AI Copilot</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {currentReportId ? `Context: Case ${currentReportId}` : 'Civic Verification & Evidence Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:text-white hover:bg-slate-800 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/70 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-slate-400 font-bold shrink-0 text-[10px] uppercase">
              <Sparkles className="w-3 h-3 inline text-blue-600 mr-1" />
              Quick:
            </span>
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 whitespace-nowrap transition-all shrink-0 font-medium shadow-2xs text-[11px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-2xs whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 italic">
                <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 animate-spin shrink-0">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <span>FixBot is analyzing civic standards...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Voice input (Speech to text)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                language === 'kn'
                  ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                  : language === 'te'
                  ? 'మీ ప్రశ్నను ఇక్కడ నమోదు చేయండి...'
                  : language === 'hi'
                  ? 'अपना सवाल यहां लिखें...'
                  : 'Ask about evidence, disputes, or repairs...'
              }
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-sm transition-all shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
