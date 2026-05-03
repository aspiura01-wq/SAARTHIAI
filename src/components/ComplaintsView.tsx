import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, FileText, Download, Sparkles, AlertCircle } from 'lucide-react';
import { getAssistantResponse } from '../lib/gemini';
import { Language } from '../types';

export default function ComplaintsView({ language }: { language: Language }) {
  const [complaint, setComplaint] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      title: 'AI Complaint Writer',
      desc: 'Just tell us what happened. Saarthi will write a professional letter for you.',
      placeholder: 'E.g., I have not received my ration last month / My street light is not working...',
      generateBtn: 'Generate Complaint Letter',
      drafting: 'Drafting...',
      generatedTitle: 'Generated Draft',
      note: 'NOTE: This is AI generated. Please review and fill in your personal details (like Name, Address, Date) before submitting.',
      promptLang: 'English'
    },
    [Language.HINDI]: {
      title: 'AI शिकायत लेखक',
      desc: 'बस हमें बताएं कि क्या हुआ। सारथी आपके लिए एक पेशेवर पत्र लिखेगा।',
      placeholder: 'जैसे, मुझे पिछले महीने मेरा राशन नहीं मिला / मेरी स्ट्रीट लाइट काम नहीं कर रही है...',
      generateBtn: 'शिकायत पत्र उत्पन्न करें',
      drafting: 'तैयार कर रहे हैं...',
      generatedTitle: 'जनरेट किया गया ड्राफ्ट',
      note: 'नोट: यह AI द्वारा जनरेट किया गया है। कृपया सबमिट करने से पहले अपनी व्यक्तिगत जानकारी (जैसे नाम, पता, दिनांक) की समीक्षा करें और भरें।',
      promptLang: 'Hindi'
    },
    [Language.KANNADA]: {
      title: 'AI ದೂರು ಬರಹಗಾರ',
      desc: 'ಏನಾಯಿತು ಎಂದು ನಮಗೆ ತಿಳಿಸಿ. ಸಾರಥಿ ನಿಮಗಾಗಿ ವೃತ್ತಿಪರ ಪತ್ರವನ್ನು ಬರೆಯುತ್ತಾರೆ.',
      placeholder: 'ಉದಾಹರಣೆಗೆ, ಕಳೆದ ತಿಂಗಳು ನನಗೆ ಪಡಿತರ ಸಿಕ್ಕಿಲ್ಲ / ನನ್ನ ಬೀದಿ ದೀಪ ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ...',
      generateBtn: 'ದೂರು ಪತ್ರವನ್ನು ರಚಿಸಿ',
      drafting: 'ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...',
      generatedTitle: 'ರಚಿಸಲಾದ ಕರಡು',
      note: 'ಸೂಚನೆ: ಇದು AI ನಿಂದ ರಚಿಸಲ್ಪಟ್ಟಿದೆ. ಸಲ್ಲಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು (ಹೆಸರು, ವಿಳಾಸ, ದಿನಾಂಕದಂತಹ) ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಭರ್ತಿ ಮಾಡಿ.',
      promptLang: 'Kannada'
    },
    [Language.TELUGU]: {
      title: 'AI ఫిర్యాదు రచయిత',
      desc: 'ఏం జరిగిందో మాకు చెప్పండి. సారథి మీ కోసం ప్రొఫెషనల్ లేఖను వ్రాస్తారు.',
      placeholder: 'ఉదాహరణకు, గత నెలలో నాకు రేషన్ రాలేదు / మా వీధి దీపం పనిచేయడం లేదు...',
      generateBtn: 'ఫిర్యాదు లేఖను రూపొందించండి',
      drafting: 'చిత్తుప్రతిని రూపొందిస్తోంది...',
      generatedTitle: 'రూపొందించబడిన చిత్తుప్రతి',
      note: 'గమనిక: ఇది AI ద్వారా రూపొందించబడింది. సమర్పించే ముందు దయచేసి మీ వ్యక్తిగత వివరాలను (పేరు, చిరునామా, తేదీ వంటివి) సమీక్షించి, పూరించండి.',
      promptLang: 'Telugu'
    },
    [Language.TAMIL]: {
      title: 'AI புகார் எழுத்தாளர்',
      desc: 'என்ன நடந்தது என்று எங்களிடம் கூறுங்கள். சாரதி உங்களுக்காக ஒரு தொழில்முறை கடிதத்தை எழுதுவார்.',
      placeholder: 'உதாரணத்திற்கு, கடந்த மாதம் எனக்கு ரேஷன் கிடைக்கவில்லை / எனது தெருவிளக்கு எரியவில்லை...',
      generateBtn: 'புகார் கடிதத்தை உருவாக்கு',
      drafting: 'ஆயத்தம் செய்கிறது...',
      generatedTitle: 'உருவாக்கப்பட்ட வரைவு',
      note: 'குறிப்பு: இது AI மூலம் உருவாக்கப்பட்டது. சமர்ப்பிக்கும் முன் உங்கள் தனிப்பட்ட விவரங்களை (பெயர், முகவரி, தேதி போன்றவை) சரிபார்த்து நிரப்பவும்.',
      promptLang: 'Tamil'
    },
    [Language.BENGALI]: {
      title: 'AI অভিযোগ লেখক',
      desc: 'কী হয়েছে আমাদের বলুন। সারথি আপনার জন্য একটি পেশাদার চিঠি লিখবেন।',
      placeholder: 'যেমন, গত মাসে আমি আমার রেশন পাইনি / আমার স্ট্রিট লাইট কাজ করছে না...',
      generateBtn: 'অভিযোগ পত্র তৈরি করুন',
      drafting: 'খসড়া তৈরি করা হচ্ছে...',
      generatedTitle: 'তৈরিকৃত খসড়া',
      note: 'দ্রষ্টব্য: এটি AI দ্বারা তৈরি করা হয়েছে। জমা দেওয়ার আগে দয়া করে আপনার ব্যক্তিগত বিবরণ (যেমন নাম, ঠিকানা, তারিখ) পর্যালোচনা করুন এবং পূরণ করুন।',
      promptLang: 'Bengali'
    }
  };

  const current = translations[language];

  const handleGenerate = async () => {
    if (!complaint.trim()) return;
    setIsGenerating(true);
    const prompt = `Generate a formal complaint letter in ${current.promptLang} for the following issue: "${complaint}". The letter should be professional, include placeholders for personal details, and be addressed to the relevant authority.`;
    const langCodes: Record<Language, string> = {
      [Language.ENGLISH]: 'en-IN',
      [Language.HINDI]: 'hi-IN',
      [Language.KANNADA]: 'kn-IN',
      [Language.TELUGU]: 'te-IN',
      [Language.TAMIL]: 'ta-IN',
      [Language.BENGALI]: 'bn-IN'
    };
    const result = await getAssistantResponse(prompt, langCodes[language]);
    setGeneratedLetter(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <section className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-3xl flex gap-3 items-start">
        <Sparkles className="text-blue-400 shrink-0 mt-1" size={24} />
        <div className="text-sm">
          <p className="font-bold text-blue-200">{current.title}</p>
          <p className="text-white/60">{current.desc}</p>
        </div>
      </section>

      <div className="space-y-4">
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder={current.placeholder}
          className="w-full glass bg-white/5 border-white/10 rounded-3xl p-6 min-h-[160px] outline-none focus:border-neon-blue/50"
        />
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !complaint}
          className="w-full py-4 bg-neon-blue rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-blue/20 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {isGenerating ? current.drafting : current.generateBtn}
          {!isGenerating && <Send size={18} />}
        </button>
      </div>

      {generatedLetter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-6 rounded-3xl border-white/5 relative"
        >
          <div className="absolute right-6 top-6 flex gap-2">
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40">
              <Download size={18} />
            </button>
          </div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText size={18} className="text-blue-400" />
            {current.generatedTitle}
          </h3>
          <div className="text-sm leading-relaxed text-white/80 font-mono whitespace-pre-wrap bg-black/20 p-4 rounded-xl">
            {generatedLetter}
          </div>
          <div className="mt-6 flex gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[10px] leading-tight">
              {current.note}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
