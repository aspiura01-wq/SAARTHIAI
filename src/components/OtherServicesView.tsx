import React from 'react';
import { motion } from 'motion/react';
import { 
  Scan, 
  ShieldCheck, 
  FileText, 
  CheckSquare, 
  MapPin, 
  Briefcase, 
  FolderOpen,
  ArrowLeft
} from 'lucide-react';
import { AppView, Language } from '../types';

interface OtherServicesViewProps {
  setView: (view: AppView) => void;
  language: Language;
}

export default function OtherServicesView({ setView, language }: OtherServicesViewProps) {
  const translations: Record<Language, { back: string, services: any[] }> = {
    [Language.ENGLISH]: {
      back: 'Back to Home',
      services: [
        { id: 'doc-scanner', title: 'Document Scanner', desc: 'Scan all kinds of documents', icon: <Scan className="text-blue-400" /> },
        { id: 'fraud-shield', title: 'Fraud Shield', icon: <ShieldCheck className="text-red-400" />, desc: 'Detect scams & frauds' },
        { id: 'complaints', title: 'Complaints', icon: <FileText className="text-amber-400" />, desc: 'Generate complaint letters' },
        { id: 'tasks', title: 'My Tasks', icon: <CheckSquare className="text-emerald-400" />, desc: 'To-do list & reminders' },
        { id: 'travel', title: 'Travel', icon: <MapPin className="text-indigo-400" />, desc: 'KSRTC, IRCTC & state travel' },
        { id: 'jobs', title: 'Job Finder', icon: <Briefcase className="text-orange-400" />, desc: 'Part & Full-time recommendations' },
        { id: 'records', title: 'My Records', icon: <FolderOpen className="text-pink-400" />, desc: 'Your scanned documents' },
      ]
    },
    [Language.HINDI]: {
      back: 'मुख्य पृष्ठ पर वापस',
      services: [
        { id: 'doc-scanner', title: 'दस्तावेज़ स्कैनर', desc: 'सभी प्रकार के दस्तावेज़ स्कैन करें', icon: <Scan className="text-blue-400" /> },
        { id: 'fraud-shield', title: 'फ्रॉड शील्ड', icon: <ShieldCheck className="text-red-400" />, desc: 'घोटालों और धोखाधड़ी का पता लगाएं' },
        { id: 'complaints', title: 'शिकायतें', icon: <FileText className="text-amber-400" />, desc: 'शिकायत पत्र तैयार करें' },
        { id: 'tasks', title: 'मेरे कार्य', icon: <CheckSquare className="text-emerald-400" />, desc: 'टू-डू सूची और अनुस्मारक' },
        { id: 'travel', title: 'यात्रा', icon: <MapPin className="text-indigo-400" />, desc: 'केएसआरटीसी, आईआरसीटीसी और राज्य यात्रा' },
        { id: 'jobs', title: 'नौकरी खोजक', icon: <Briefcase className="text-orange-400" />, desc: 'अंशकालिक और पूर्णकालिक सिफारिशें' },
        { id: 'records', title: 'मेरे रिकॉर्ड', icon: <FolderOpen className="text-pink-400" />, desc: 'आपके स्कैन किए गए दस्तावेज़' },
      ]
    },
    [Language.KANNADA]: {
      back: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
      services: [
        { id: 'doc-scanner', title: 'ದಾಖಲೆ ಸ್ಕ್ಯಾನರ್', desc: 'ಎಲ್ಲಾ ರೀತಿಯ ದಾಖಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', icon: <Scan className="text-blue-400" /> },
        { id: 'fraud-shield', title: 'ವಂಚನೆ ತಡೆ', icon: <ShieldCheck className="text-red-400" />, desc: 'ಹಗರಣಗಳು ಮತ್ತು ವಂಚನೆಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ' },
        { id: 'complaints', title: 'ದೂರುಗಳು', icon: <FileText className="text-amber-400" />, desc: 'ದೂರು ಪತ್ರಗಳನ್ನು ರಚಿಸಿ' },
        { id: 'tasks', title: 'ನನ್ನ ಕಾರ್ಯಗಳು', icon: <CheckSquare className="text-emerald-400" />, desc: 'ಮಾಡಬೇಕಾದ ಪಟ್ಟಿ ಮತ್ತು ಜ್ಞಾಪನೆಗಳು' },
        { id: 'travel', title: 'ಪ್ರಯಾಣ', icon: <MapPin className="text-indigo-400" />, desc: 'ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ, ಐಆರ್‌ಸಿಟಿಸಿ ಮತ್ತು ರಾಜ್ಯ ಪ್ರಯಾಣ' },
        { id: 'jobs', title: 'ಉದ್ಯೋಗ ಹುಡುಕುವವ', icon: <Briefcase className="text-orange-400" />, desc: 'ಅರೆಕಾಲಿಕ ಮತ್ತು ಪೂರ್ಣಕಾಲಿಕ ಶಿಫಾರಸುಗಳು' },
        { id: 'records', title: 'ನನ್ನ ದಾಖಲೆಗಳು', icon: <FolderOpen className="text-pink-400" />, desc: 'ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ದಾಖಲೆಗಳು' },
      ]
    },
    [Language.TELUGU]: {
      back: 'హోమ్ పేజీకి తిరిగి వెళ్ళండి',
      services: [
        { id: 'doc-scanner', title: 'డాక్యుమెంట్ స్కానర్', desc: 'అన్ని రకాల పత్రాలను స్కాన్ చేయండి', icon: <Scan className="text-blue-400" /> },
        { id: 'fraud-shield', title: 'ఫ్రాడ్ షీల్డ్', icon: <ShieldCheck className="text-red-400" />, desc: 'స్కామ్ లు మరియు మోసాలను గుర్తించండి' },
        { id: 'complaints', title: 'ఫిర్యాదులు', icon: <FileText className="text-amber-400" />, desc: 'ఫిర్యాదు లేఖలను రూపొందించండి' },
        { id: 'tasks', title: 'నా పనులు', icon: <CheckSquare className="text-emerald-400" />, desc: 'చేయవలసిన పనుల జాబితా మరియు రిమైండర్‌లు' },
        { id: 'travel', title: 'ప్రయాణం', icon: <MapPin className="text-indigo-400" />, desc: 'KSRTC, IRCTC మరియు స్టేట్ ట్రావెల్' },
        { id: 'jobs', title: 'జాబ్ ఫైండర్', icon: <Briefcase className="text-orange-400" />, desc: 'పార్ట్ టైమ్ మరియు ఫుల్ టైమ్ సిఫార్సులు' },
        { id: 'records', title: 'నా రికార్డులు', icon: <FolderOpen className="text-pink-400" />, desc: 'మీ స్కాన్ చేసిన పత్రాలు' },
      ]
    },
    [Language.TAMIL]: {
      back: 'முகப்புப் பக்கத்திற்குத் திரும்பு',
      services: [
        { id: 'doc-scanner', title: 'ஆவண ஸ்கேனர்', desc: 'அனைத்து வகையான ஆவணங்களையும் ஸ்கேன் செய்யவும்', icon: <Scan className="text-blue-400" /> },
        { id: 'fraud-shield', title: 'மோசடி தடுப்பு', icon: <ShieldCheck className="text-red-400" />, desc: 'ஏமாற்று வேலைகள் மற்றும் மோசடிகளைக் கண்டறிதல்' },
        { id: 'complaints', title: 'புகார்கள்', icon: <FileText className="text-amber-400" />, desc: 'புகார் கடிதங்களை உருவாக்கவும்' },
        { id: 'tasks', title: 'எனது பணிகள்', icon: <CheckSquare className="text-emerald-400" />, desc: 'செய்ய வேண்டிய பட்டியல் மற்றும் நினைவூட்டல்கள்' },
        { id: 'travel', title: 'பயணம்', icon: <MapPin className="text-indigo-400" />, desc: 'KSRTC, IRCTC மற்றும் அரசு பயணம்' },
        { id: 'jobs', title: 'வேலை தேடுபவர்', icon: <Briefcase className="text-orange-400" />, desc: 'நேர மற்றும் முழு நேர பரிந்துரைகள்' },
        { id: 'records', title: 'எனது பதிவுகள்', icon: <FolderOpen className="text-pink-400" />, desc: 'உங்கள் ஸ்கேன் செய்யப்பட்ட ஆவணங்கள்' },
      ]
    },
    [Language.BENGALI]: {
      back: 'হোম পেজে ফিরে যান',
      services: [
        { id: 'doc-scanner', title: 'ডকুমেন্ট স্ক্যানার', desc: 'সব ধরণের নথি স্ক্যান করুন', icon: <Scan className="text-blue-400" /> },
        { id: 'fraud-shield', title: 'ফ্রড শিল্ড', icon: <ShieldCheck className="text-red-400" />, desc: 'স্ক্যাম এবং জালিয়াতি শনাক্ত করুন' },
        { id: 'complaints', title: 'অভিযোগ', icon: <FileText className="text-amber-400" />, desc: 'অভিযোগ পত্র তৈরি করুন' },
        { id: 'tasks', title: 'আমার কাজ', icon: <CheckSquare className="text-emerald-400" />, desc: 'টু-ডু তালিকা এবং রিমাইন্ডার' },
        { id: 'travel', title: 'ভ্রমণ', icon: <MapPin className="text-indigo-400" />, desc: 'KSRTC, IRCTC এবং সরকারি ভ্রমণ' },
        { id: 'jobs', title: 'জব ফাইন্ডার', icon: <Briefcase className="text-orange-400" />, desc: 'পার্ট এবং ফুল-টাইম সুপারিশ' },
        { id: 'records', title: 'আমার রেকর্ড', icon: <FolderOpen className="text-pink-400" />, desc: 'আপনার স্ক্যান করা নথি' },
      ]
    }
  };

  const current = translations[language];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span className="font-medium tracking-tight">{current.back}</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
        {current.services.map((service, i) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            onClick={() => setView(service.id as AppView)}
            className="flex items-center gap-5 p-6 rounded-[32px] glass border-white/5 transition-all text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl">
              {service.icon}
            </div>
            <div>
              <h4 className="font-bold text-lg">{service.title}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{service.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
