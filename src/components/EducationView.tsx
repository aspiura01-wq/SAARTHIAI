import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, BookOpen, Search, Sparkles, Trophy, ArrowRight, MapPin, Send, Mic, X } from 'lucide-react';
import { Language } from '../types';
import { getHomeworkHelp } from '../lib/gemini';

export default function EducationView({ language }: { language: Language }) {
  const [activeTab, setActiveTab] = useState<'study' | 'career' | 'scholarship' | 'homework'>('study');
  const [showHomeworkChat, setShowHomeworkChat] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleHomeworkQuery = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsProcessing(true);

    const response = await getHomeworkHelp(text, language);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsProcessing(false);
  };
  
  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      personalizing: 'Personalizing for your region',
      tabs: {
        study: 'Study Tools',
        career: 'Career Guide',
        scholarship: 'Scholarships',
        homework: 'AI Homework',
      },
      homeworkTitle: 'AI Homework Assistant',
      homeworkDesc: 'Scan your homework or type the question. Saarthi will explain it in simple steps.',
      askSaarthi: 'Ask Saarthi',
      back: 'Back',
    },
    [Language.HINDI]: {
      personalizing: 'आपके क्षेत्र के लिए व्यक्तिगत',
      tabs: {
        study: 'अध्ययन उपकरण',
        career: 'कैरियर गाइड',
        scholarship: 'छात्रवृत्ति',
        homework: 'AI होमवर्क',
      },
      homeworkTitle: 'AI होमवर्क सहायक',
      homeworkDesc: 'अपना होमवर्क स्कैन करें या प्रश्न टाइप करें। सारथी इसे सरल चरणों में समझाएगा।',
      askSaarthi: 'सारथी से पूछें',
      back: 'पीछे',
    },
    [Language.KANNADA]: {
      personalizing: 'ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ವೈಯಕ್ತಿಕಗೊಳಿಸಲಾಗುತ್ತಿದೆ',
      tabs: {
        study: 'ಅಧ್ಯಯನ ಪರಿಕರಗಳು',
        career: 'ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಿ',
        scholarship: 'ಶಿಷ್ಯವೇತನಗಳು',
        homework: 'AI ಹೋಂವರ್ಕ್',
      },
      homeworkTitle: 'AI ಹೋಂವರ್ಕ್ ಸಹಾಯಕ',
      homeworkDesc: 'ನಿಮ್ಮ ಹೋಂವರ್ಕ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ. ಸಾರಥಿ ಅದನ್ನು ಸರಳ ಹಂತಗಳಲ್ಲಿ ವಿವರಿಸುತ್ತಾರೆ.',
      askSaarthi: 'ಸಾರಥಿಯನ್ನು ಕೇಳಿ',
      back: 'ಹಿಂದಕ್ಕೆ',
    },
    [Language.TELUGU]: {
      personalizing: 'మీ ప్రాంతం కోసం వ్యక్తిగతీకరిస్తోంది',
      tabs: {
        study: 'స్టడీ టూల్స్',
        career: 'కెరీర్ గైడ్',
        scholarship: 'స్కాలర్‌షిప్‌లు',
        homework: 'AI హోంవర్క్',
      },
      homeworkTitle: 'AI హోంవర్క్ అసిస్టెంట్',
      homeworkDesc: 'మీ హోంవర్క్‌ను స్కాన్ చేయండి లేదా ప్రశ్నను టైప్ చేయండి. సారథి దానిని సులభమైన దశల్లో వివరిస్తారు.',
      askSaarthi: 'సారథిని అడగండి',
      back: 'వెనుకకు',
    },
    [Language.TAMIL]: {
      personalizing: 'உங்கள் பிராந்தியத்திற்காக தனிப்பயனாக்குதல்',
      tabs: {
        study: 'படிப்பு கருவிகள்',
        career: 'தொழில் வழிகாட்டி',
        scholarship: 'உதவித்தொகை',
        homework: 'AI வீட்டுப்பாடம்',
      },
      homeworkTitle: 'AI வீட்டுப்பாட உதவியாளர்',
      homeworkDesc: 'உங்கள் வீட்டுப்பாடத்தை ஸ்கேன் செய்யவும் அல்லது கேள்வியைத் தட்டச்சு செய்யவும். சாரதி அதை எளிய நிலைகளில் விளக்குவார்.',
      askSaarthi: 'சாரதியிடம் கேளுங்கள்',
      back: 'பின்செல்',
    },
    [Language.BENGALI]: {
      personalizing: 'আপনার অঞ্চলের জন্য ব্যক্তিগতকৃত করা হচ্ছে',
      tabs: {
        study: 'অধ্যয়ন সরঞ্জাম',
        career: 'ক্যারিয়ার গাইড',
        scholarship: 'স্কলারশিপ',
        homework: 'AI হোমওয়ার্ক',
      },
      homeworkTitle: 'AI হোমওয়ার্ক সহকারী',
      homeworkDesc: 'আপনার হোমওয়ার্ক স্ক্যান করুন বা প্রশ্ন টাইপ করুন। সারথি এটি সহজ ধাপে ব্যাখ্যা করবে।',
      askSaarthi: 'সারথিকে জিজ্ঞাসা করুন',
      back: 'পিছনে',
    }
  };

  const current = translations[language];

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocError(error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocError("Geolocation not supported");
    }
  }, []);

  const content = {
    study: [
      { title: 'Class 10th Maths', desc: 'NCERT based solutions & videos', link: 'https://ncert.nic.in/' },
      { title: 'English Speaking', desc: 'Basic grammar & daily use phrases', link: 'https://www.britishcouncil.in/english' },
      { title: 'Digital Literacy', desc: 'How to use mobile safely', link: 'https://www.digitalliteracy.gov.in/' },
      { title: 'Exam Prep', desc: 'Previous year question papers', link: 'https://www.cbse.gov.in/' },
    ],
    career: [
      { title: 'Nursing Guide', desc: 'Steps to join ANM/GNM courses', link: 'https://indiannursingcouncil.org/' },
      { title: 'Skill Training', desc: 'PMKVY Govt courses & centers', link: 'https://www.pmkvyofficial.org/' },
      { title: 'Police Recruitment', desc: 'Physical and written test prep', link: 'https://www.ncs.gov.in/' },
      { title: 'Self-Employment', desc: 'Small business ideas for rural areas', link: 'https://www.kviconline.gov.in/' },
    ],
    scholarship: [
      { title: 'Post-Matric Scholarship', desc: 'For SC/ST/OBC students', link: 'https://scholarships.gov.in/' },
      { title: 'Minority Scholarship', desc: 'National scholarship portal help', link: 'https://scholarships.gov.in/' },
      { title: 'AICTE Pragati', desc: 'For girls in technical education', link: 'https://www.aicte-india.org/schemes/students-development-schemes' },
      { title: 'Labor Dept Scholarship', desc: 'For children of labor card holders', link: 'https://labour.gov.in/' },
    ],
    homework: {
      desc: 'Ask your HW questions to Saarthi AI assistant.',
      icon: <Sparkles className="text-neon-purple" />
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        {location && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit">
            <MapPin size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              {current.personalizing}: {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'study', label: current.tabs.study, icon: <BookOpen size={16} /> },
          { id: 'career', label: current.tabs.career, icon: <GraduationCap size={16} /> },
          { id: 'scholarship', label: current.tabs.scholarship, icon: <Trophy size={16} /> },
          { id: 'homework', label: current.tabs.homework, icon: <Sparkles size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-neon-purple border-neon-purple shadow-lg shadow-neon-purple/20' : 'glass border-white/5 opacity-60'
            }`}
          >
            {tab.icon}
            <span className="text-sm font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
        {activeTab === 'homework' ? (
           <div className="space-y-4">
             {!showHomeworkChat ? (
               <div className="p-8 rounded-[40px] glass border-neon-purple/20 text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-neon-purple/10 flex items-center justify-center mx-auto mb-4 border border-neon-purple/20">
                    <Sparkles className="text-neon-purple" size={32} />
                 </div>
                 <h3 className="text-2xl font-bold">{current.homeworkTitle}</h3>
                 <p className="text-text-muted leading-relaxed max-w-sm mx-auto">
                   {current.homeworkDesc}
                 </p>
                 <button 
                  onClick={() => setShowHomeworkChat(true)}
                  className="px-8 py-3 bg-neon-purple rounded-full font-bold shadow-lg shadow-neon-purple/20"
                 >
                   {current.askSaarthi}
                 </button>
               </div>
             ) : (
               <div className="flex flex-col h-[60vh] glass border-neon-purple/10 rounded-[40px] overflow-hidden">
                 <div className="p-4 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Sparkles size={18} className="text-neon-purple" />
                     <span className="font-bold">{current.homeworkTitle}</span>
                   </div>
                   <button onClick={() => setShowHomeworkChat(false)} className="p-2 hover:bg-white/5 rounded-full">
                     <X size={18} />
                   </button>
                 </div>
                 
                 <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                   {messages.length === 0 && (
                     <p className="text-center text-text-muted text-sm py-10 italic">
                       {current.homeworkDesc}
                     </p>
                   )}
                   {messages.map((m, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                     >
                       <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-neon-purple' : 'bg-white/5 border border-white/5'}`}>
                         <p className="text-sm shadow-black leading-relaxed whitespace-pre-wrap">{m.content}</p>
                       </div>
                     </motion.div>
                   ))}
                   {isProcessing && (
                     <div className="flex justify-start">
                       <div className="bg-white/5 p-4 rounded-2xl flex gap-1">
                         <span className="w-1 h-1 bg-neon-purple rounded-full animate-bounce" />
                         <span className="w-1 h-1 bg-neon-purple rounded-full animate-bounce delay-100" />
                         <span className="w-1 h-1 bg-neon-purple rounded-full animate-bounce delay-200" />
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="p-4 bg-black/20 border-t border-white/5">
                   <div className="relative">
                     <input 
                       value={inputText}
                       onChange={(e) => setInputText(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleHomeworkQuery()}
                       placeholder="Type your question..."
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 outline-none focus:border-neon-purple/50"
                     />
                     <button 
                       onClick={handleHomeworkQuery}
                       className="absolute right-2 top-2 p-2 text-neon-purple"
                     >
                       <Send size={18} />
                     </button>
                   </div>
                 </div>
               </div>
             )}
           </div>
        ) : (
          (content[activeTab] as any[]).map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-[32px] glass hover:bg-white/10 transition-all flex items-center justify-between no-underline"
            >
              <div>
                <h4 className="font-bold text-lg text-white">{item.title}</h4>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
              <ArrowRight className="text-white/20" />
            </motion.a>
          ))
        )}
      </div>
    </div>
  );
}
