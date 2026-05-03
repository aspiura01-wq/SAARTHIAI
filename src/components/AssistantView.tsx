import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, RotateCcw, X } from 'lucide-react';
import { Language } from '../types';
import { stopSpeaking, SpeechToText } from '../lib/voice';
import { getAssistantResponse } from '../lib/gemini';

interface AssistantViewProps {
  language: Language;
  addToHistory: (item: any) => void;
}

export default function AssistantView({ language, addToHistory }: AssistantViewProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      welcome: 'How can I help you?',
      sub: 'Speak in English, Hindi, or Kannada.',
      listening: 'Listening',
      placeholder: 'Ask anything...',
    },
    [Language.HINDI]: {
      welcome: 'मैं आपकी किस प्रकार सहायता कर सकता हूँ?',
      sub: 'हिंदी, अंग्रेजी या कन्नड़ में बोलें।',
      listening: 'सुन रहे हैं',
      placeholder: 'कुछ भी पूछें...',
    },
    [Language.KANNADA]: {
      welcome: 'ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      sub: 'ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ.',
      listening: 'ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ',
      placeholder: 'ಏನನ್ನಾದರೂ ಕೇಳಿ...',
    },
    [Language.TELUGU]: {
      welcome: 'నేను మీకు ఎలా సహాయపడగలను?',
      sub: 'తెలుగు, హిందీ లేదా ఇంగ్లీష్‌లో మాట్లాడండి.',
      listening: 'వింటున్నారు',
      placeholder: 'ఏదైనా అడగండి...',
    },
    [Language.TAMIL]: {
      welcome: 'நான் உங்களுக்கு எப்படி உதவ முடியும்?',
      sub: 'தமிழ், இந்தி அல்லது ஆங்கிலத்தில் பேசுங்கள்.',
      listening: 'கேட்கிறது',
      placeholder: 'எது வேண்டுமானாலும் கேளுங்கள்...',
    },
    [Language.BENGALI]: {
      welcome: 'আমি আপনাকে কিভাবে সাহায্য করতে পারি?',
      sub: 'বাংলা, হিন্দি বা ইংরেজিতে কথা বলুন।',
      listening: 'শুনছি',
      placeholder: 'যেকোনো কিছু জিজ্ঞাসা করুন...',
    }
  };

  const current = translations[language];
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const stt = useRef<SpeechToText | null>(null);

  useEffect(() => {
    stt.current = new SpeechToText(language);
    stt.current.onResult = (text) => {
      handleSend(text);
      setIsListening(false);
    };
    stt.current.onEnd = () => setIsListening(false);
    stt.current.onError = (err) => {
      console.error(err);
      setIsListening(false);
    };

    return () => stopSpeaking();
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputText('');
    setIsProcessing(true);

    const response = await getAssistantResponse(text, language);
    setIsProcessing(false);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    
    addToHistory({ type: 'assistant', title: text.slice(0, 30) + '...', data: response });
  };

  const toggleListening = () => {
    if (isListening) {
      stt.current?.stop();
    } else {
      setIsListening(true);
      stt.current?.start();
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden">
      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50 space-y-2">
            <Mic size={48} className="mb-2 opacity-20" />
            <h3 className="font-bold text-lg">{current.welcome}</h3>
            <p className="text-sm">{current.sub}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-neon-blue text-white rounded-tr-none shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'glass rounded-tl-none border-white/5'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="glass p-4 rounded-2xl rounded-tl-none flex gap-2 border-white/5">
              <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 border-t border-white/10 space-y-4 backdrop-blur-3xl">
        {isListening && (
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="flex gap-1 h-8 items-end">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 24, 8] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-neon-purple rounded-full"
                />
              ))}
            </div>
            <p className="text-neon-purple text-[10px] font-black tracking-widest animate-pulse uppercase">{current.listening}</p>
          </div>
        )}
         
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleListening}
            className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/40' : 'bg-neon-blue hover:bg-blue-500 shadow-lg shadow-neon-blue/20'}`}
          >
            {isListening ? <X size={24} /> : <Mic size={24} />}
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              placeholder={current.placeholder}
              className="w-full glass bg-white/5 border-white/10 rounded-2xl py-3.5 px-4 outline-none focus:border-neon-blue/50 transition-colors"
            />
            <button 
              onClick={() => handleSend(inputText)}
              className="absolute right-2 top-1.5 p-2 text-neon-blue hover:text-white transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
