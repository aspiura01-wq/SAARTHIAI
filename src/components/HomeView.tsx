import React from 'react';
import { motion } from 'motion/react';
import { 
  HeartPulse, 
  MapPin, 
  Briefcase, 
  FileText, 
  BusFront, 
  ShieldAlert,
  Mic
} from 'lucide-react';
import { AppView, Language } from '../types';

interface HomeViewProps {
  setView: (view: AppView) => void;
  language: Language;
}

export default function HomeView({ setView, language }: HomeViewProps) {
  const translations: Record<Language, { cards: any[], otherServices: string, otherServicesDesc: string }> = {
    [Language.ENGLISH]: {
      cards: [
        { id: 'nearby', title: 'Nearby Help', icon: '📍', color: 'border-white/10', desc: 'Find Police, NGOs, Food and Shelter' },
        { id: 'medical', title: 'Medical Center', icon: '🏥', color: 'border-neon-purple/40', desc: 'Scan prescriptions, find medicines' },
        { id: 'education', title: 'Education', icon: '🎓', color: 'border-white/10', desc: 'Study, Careers & Scholarships' },
        { id: 'gov-schemes', title: 'Govt Schemes', icon: '🏛️', color: 'border-white/10', desc: 'Pensions & Subsidy eligibility' },
        { id: 'finance', title: 'Finance', icon: '💰', color: 'border-white/10', desc: 'Card block, Cash & Loan help' },
        { id: 'emergency', title: 'Emergency', icon: '🆘', color: 'border-red-500/40', danger: true, desc: 'Call Ambulance or Police' },
      ],
      otherServices: 'Other Services',
      otherServicesDesc: 'Tasks, Records & more'
    },
    [Language.HINDI]: {
      cards: [
        { id: 'nearby', title: 'आस-पास सहायता', icon: '📍', color: 'border-white/10', desc: 'पुलिस, एनजीओ, भोजन और आश्रय खोजें' },
        { id: 'medical', title: 'चिकित्सा केंद्र', icon: '🏥', color: 'border-neon-purple/40', desc: 'नुस्खे स्कैन करें, दवाएं खोजें' },
        { id: 'education', title: 'शिक्षा', icon: '🎓', color: 'border-white/10', desc: 'पढ़ाई, करियर और छात्रवृत्ति' },
        { id: 'gov-schemes', title: 'सरकारी योजनाएं', icon: '🏛️', color: 'border-white/10', desc: 'पेंशन और सब्सिडी पात्रता' },
        { id: 'finance', title: 'वित्त सहायता', icon: '💰', color: 'border-white/10', desc: 'कार्ड ब्लॉक, नकद और ऋण सहायता' },
        { id: 'emergency', title: 'आपातकालीन', icon: '🆘', color: 'border-red-500/40', danger: true, desc: 'एम्बुलेंस या पुलिस को बुलाएं' },
      ],
      otherServices: 'अन्य सेवाएं',
      otherServicesDesc: 'कार्य, रिकॉर्ड और अधिक'
    },
    [Language.KANNADA]: {
      cards: [
        { id: 'nearby', title: 'ಹತ್ತಿರದ ಸಹಾಯ', icon: '📍', color: 'border-white/10', desc: 'ಪೊಲೀಸ್, ಎನ್‌ಜಿಒಗಳು, ಆಹಾರ ಮತ್ತು ಆಶ್ರಯವನ್ನು ಹುಡುಕಿ' },
        { id: 'medical', title: 'ವೈದ್ಯಕೀಯ ಕೇಂದ್ರ', icon: '🏥', color: 'border-neon-purple/40', desc: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅನ್ವಯಿಸಿ, ಔಷಧಿಗಳನ್ನು ಹುಡುಕಿ' },
        { id: 'education', title: 'ಶಿಕ್ಷಣ', icon: '🎓', color: 'border-white/10', desc: 'ಅಧ್ಯಯನ, ವೃತ್ತಿ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು' },
        { id: 'gov-schemes', title: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', icon: '🏛️', color: 'border-white/10', desc: 'ಪೆನ್ಷನ್ ಮತ್ತು ಸಬ್ಸಿಡಿ ಅರ್ಹತೆ' },
        { id: 'finance', title: 'ಹಣಕಾಸು', icon: '💰', color: 'border-white/10', desc: 'ಕಾರ್ಡ್ ಬ್ಲಾಕ್, ನಗದು ಮತ್ತು ಸಾಲದ ಸಹಾಯ' },
        { id: 'emergency', title: 'ತುರ್ತು', icon: '🆘', color: 'border-red-500/40', danger: true, desc: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಅಥವಾ ಪೊಲೀಸರನ್ನು ಕರೆ ಮಾಡಿ' },
      ],
      otherServices: 'ಇತರ ಸೇವೆಗಳು',
      otherServicesDesc: 'ಕಾರ್ಯಗಳು, ದಾಖಲೆಗಳು ಮತ್ತು ಇನ್ನಷ್ಟು'
    },
    [Language.TELUGU]: {
      cards: [
        { id: 'nearby', title: 'సమీప సహాయం', icon: '📍', color: 'border-white/10', desc: 'పోలీసులు, NGOలు, ఆహారం మరియు ఆశ్రయం కనుగొనండి' },
        { id: 'medical', title: 'వైద్య కేంద్రం', icon: '🏥', color: 'border-neon-purple/40', desc: 'ప్రిస్క్రిప్షన్లు స్కాన్ చేయండి, మందులు కనుగొనండి' },
        { id: 'education', title: 'విద్య', icon: '🎓', color: 'border-white/10', desc: 'చదువు, కెరీర్ మరియు స్కాలర్‌షిప్‌లు' },
        { id: 'gov-schemes', title: 'ప్రభుత్వ పథకాలు', icon: '🏛️', color: 'border-white/10', desc: 'పెన్షన్ మరియు సబ్సిడీ అర్హత' },
        { id: 'finance', title: 'ఆర్థిక సహాయం', icon: '💰', color: 'border-white/10', desc: 'కార్డ్ బ్లాక్, నగదు మరియు రుణ సాయం' },
        { id: 'emergency', title: 'అత్యవసర', icon: '🆘', color: 'border-red-500/40', danger: true, desc: 'అంబులెన్స్ లేదా పోలీసులకు కాల్ చేయండి' },
      ],
      otherServices: 'ఇతర సేవలు',
      otherServicesDesc: 'పనులు, రికార్డులు & మరిన్ని'
    },
    [Language.TAMIL]: {
      cards: [
        { id: 'nearby', title: 'அருகிலுள்ள உதவி', icon: '📍', color: 'border-white/10', desc: 'காவல்துறை, தன்னார்வ தொண்டு நிறுவனங்கள், உணவு மற்றும் தங்குமிடம் ஆகியவற்றைக் கண்டறியவும்' },
        { id: 'medical', title: 'மருத்துவ மையம்', icon: '🏥', color: 'border-neon-purple/40', desc: 'மருந்துச் சீட்டுகளை ஸ்கேன் செய்யுங்கள், மருந்துகளைக் கண்டறியவும்' },
        { id: 'education', title: 'கல்வி', icon: '🎓', color: 'border-white/10', desc: 'படிப்பு, தொழில் மற்றும் உதவித்தொகை' },
        { id: 'gov-schemes', title: 'அரசு திட்டங்கள்', icon: '🏛️', color: 'border-white/10', desc: 'ஓய்வூதியம் மற்றும் மானியத் தகுதி' },
        { id: 'finance', title: 'நிதியுதவி', icon: '💰', color: 'border-white/10', desc: 'கார்டு பிளாக், ரொக்கம் மற்றும் கடன் உதவி' },
        { id: 'emergency', title: 'அவசரம்', icon: '🆘', color: 'border-red-500/40', danger: true, desc: 'ஆம்புலன்ஸ் அல்லது காவல்துறையை அழைக்கவும்' },
      ],
      otherServices: 'பிற சேவைகள்',
      otherServicesDesc: 'பணிகள், பதிவுகள் மற்றும் பல'
    },
    [Language.BENGALI]: {
      cards: [
        { id: 'nearby', title: 'কাছাকাছি সাহায্য', icon: '📍', color: 'border-white/10', desc: 'পুলিশ, এনজিও, খাবার এবং আশ্রয় খুঁজুন' },
        { id: 'medical', title: 'চিকিৎসা কেন্দ্র', icon: '🏥', color: 'border-neon-purple/40', desc: 'প্রেসক্রিপশন স্ক্যান করুন, ওষুধ খুঁজুন' },
        { id: 'education', title: 'শিক্ষা', icon: '🎓', color: 'border-white/10', desc: 'পড়াশোনা, ক্যারিয়ার এবং স্কলারশিপ' },
        { id: 'gov-schemes', title: 'সরকারি প্রকল্প', icon: '🏛️', color: 'border-white/10', desc: 'পেনশন এবং ভর্তুকি যোগ্যতা' },
        { id: 'finance', title: 'আর্থিক সাহায্য', icon: '💰', color: 'border-white/10', desc: 'কার্ড ব্লক, নগদ এবং ঋণের সাহায্য' },
        { id: 'emergency', title: 'জরুরি অবস্থা', icon: '🆘', color: 'border-red-500/40', danger: true, desc: 'অ্যাম্বুলেন্স বা পুলিশকে কল করুন' },
      ],
      otherServices: 'অন্যান্য পরিষেবা',
      otherServicesDesc: 'কাজ, রেকর্ড ও আরও অনেক কিছু'
    }
  };

  const currentTranslations = translations[language];

  const greetings: Record<Language, string> = {
    [Language.ENGLISH]: 'Namaste, how can I help you?',
    [Language.HINDI]: 'नमस्ते, मैं कैसे मदद करूँ?',
    [Language.KANNADA]: 'ನಮಸ್ಕಾರ, ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    [Language.TELUGU]: 'నమస్తే, నేను మీకు ఎలా సహాయపడగలను?',
    [Language.TAMIL]: 'வணக்கம், நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    [Language.BENGALI]: 'নমস্তে, আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
  };

  const subGreetings: Record<Language, string> = {
    [Language.ENGLISH]: 'I am listening...',
    [Language.HINDI]: 'मैं सुन रहा हूँ...',
    [Language.KANNADA]: 'ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ...',
    [Language.TELUGU]: 'నేను వింటున్నాను...',
    [Language.TAMIL]: 'நான் கேட்டுக்கொண்டிருக்கிறேன்...',
    [Language.BENGALI]: 'আমি শুনছি...',
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-8">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-6xl font-light tracking-tight mb-2"
        >
          {greetings[language]}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-lg md:text-xl mb-10"
        >
          {subGreetings[language]}
        </motion.p>
        
        <motion.div 
          onClick={() => setView('assistant')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="voice-circle w-40 h-40 md:w-48 md:h-48 rounded-full bg-neon-blue/20 border-2 border-neon-blue flex items-center justify-center relative cursor-pointer shadow-[0_0_40px_rgba(59,130,246,0.4)]"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-2 border border-neon-purple rounded-full opacity-50"
          />
          <Mic size={48} className="text-white" />
        </motion.div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTranslations.cards.map((card, index) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
            whileHover={{ y: -6, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView(card.id as AppView)}
            className={`flex items-center gap-5 p-7 rounded-[32px] glass ${card.color} transition-all text-left ${card.danger ? 'bg-red-500/5' : ''}`}
          >
            <div className={`w-16 h-16 shrink-0 rounded-[22px] flex items-center justify-center text-3xl ${card.danger ? 'bg-red-500/20' : 'bg-white/10'}`}>
              {card.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-xl ${card.danger ? 'text-red-400' : 'text-white'}`}>{card.title}</h3>
              <p className={`text-sm mt-1 leading-relaxed ${card.danger ? 'text-red-300/80' : 'text-text-muted'}`}>{card.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Other Services Button - Sophisticated Centerpiece */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pb-20"
      >
        <button 
          onClick={() => setView('other-services')}
          className="group relative px-10 py-5 rounded-full glass border-neon-purple/30 hover:border-neon-purple/60 transition-all overflow-hidden flex items-center gap-4"
        >
          <div className="absolute inset-0 bg-linear-to-r from-neon-purple/10 to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-2xl">✨</span>
          <span className="text-lg font-bold tracking-tight uppercase">{currentTranslations.otherServices}</span>
          <span className="text-xs text-text-muted mt-0.5 group-hover:text-white transition-colors tracking-widest font-black uppercase">{currentTranslations.otherServicesDesc}</span>
        </button>
      </motion.div>
    </div>
  );
}
