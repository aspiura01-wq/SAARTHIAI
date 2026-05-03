import React from 'react';
import { motion } from 'motion/react';
import { Clock, MessageCircle, HeartPulse, FileText, Trash2, ArrowRight } from 'lucide-react';
import { AppView, Language } from '../types';

interface HistoryViewProps {
  history: any[];
  language: Language;
}

export default function HistoryView({ history, language }: HistoryViewProps) {
  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      recentActivity: 'Recent Activity',
      clearAll: 'Clear all',
      noHistory: 'No history yet',
      noHistorySub: 'Your scans and chats will appear here.',
    },
    [Language.HINDI]: {
      recentActivity: 'हाल की गतिविधि',
      clearAll: 'सभी साफ करें',
      noHistory: 'अभी तक कोई इतिहास नहीं है',
      noHistorySub: 'आपके स्कैन और चैट यहां दिखाई देंगे।',
    },
    [Language.KANNADA]: {
      recentActivity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
      clearAll: 'ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ',
      noHistory: 'ಇನ್ನೂ ಯಾವುದೇ ಇತಿಹಾಸವಿಲ್ಲ',
      noHistorySub: 'ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್‌ಗಳು ಮತ್ತು ಚಾಟ್‌ಗಳು ಇಲ್ಲಿ ಗೋಚರಿಸುತ್ತವೆ.',
    },
    [Language.TELUGU]: {
      recentActivity: 'ఇటీవలి కార్యాచరణ',
      clearAll: 'అన్నీ క్లియర్ చేయి',
      noHistory: 'ఇంకా చరిత్ర ఏమీ లేదు',
      noHistorySub: 'మీ స్కాన్‌లు మరియు చాట్‌లు ఇక్కడ కనిపిస్తాయి.',
    },
    [Language.TAMIL]: {
      recentActivity: 'சமீபத்திய செயல்பாடு',
      clearAll: 'அனைத்தையும் அழி',
      noHistory: 'இன்னும் வரலாறு எதுவும் இல்லை',
      noHistorySub: 'உங்கள் ஸ்கேன்கள் மற்றும் அரட்டைகள் இங்கே தோன்றும்.',
    },
    [Language.BENGALI]: {
      recentActivity: 'সাম্প্রতিক কার্যকলাপ',
      clearAll: 'সব মুছে ফেলুন',
      noHistory: 'এখনও কোনো ইতিহাস নেই',
      noHistorySub: 'আপনার স্ক্যান এবং চ্যাট এখানে প্রদর্শিত হবে।',
    }
  };

  const current = translations[language];

  const getIcon = (type: AppView) => {
    switch(type) {
      case 'assistant': return <MessageCircle size={18} className="text-blue-400" />;
      case 'medical': return <HeartPulse size={18} className="text-pink-400" />;
      case 'gov-schemes': return <FileText size={18} className="text-orange-400" />;
      default: return <Clock size={18} className="text-white/40" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold">{current.recentActivity}</h3>
        <button className="text-xs text-red-400 hover:underline flex items-center gap-1">
          <Trash2 size={12} /> {current.clearAll}
        </button>
      </div>

      {history.length === 0 ? (
        <div className="py-24 text-center text-white/20 select-none">
          <Clock size={48} className="mx-auto mb-4 opacity-10" />
          <p className="text-lg font-bold">{current.noHistory}</p>
          <p className="text-sm">{current.noHistorySub}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                {getIcon(item.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm truncate">{item.title}</h4>
                  <span className="text-[10px] text-white/30 whitespace-nowrap ml-2">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-white/40 uppercase tracking-widest mt-1 font-bold">{item.type.replace('-', ' ')}</p>
              </div>

              <ArrowRight size={16} className="text-white/20 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
