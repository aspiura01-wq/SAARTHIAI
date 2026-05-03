import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, ArrowLeft, Scan, CheckCircle2, ShieldCheck, History } from 'lucide-react';
import { Language } from '../types';

export default function DocScannerView({ onBack, language }: { onBack: () => void, language: Language }) {
  const [scanning, setScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      back: 'Back',
      title: 'Digital Scanner',
      subtitle: 'Scan documents, IDs, or certificates with AI clear-view.',
      scanNow: 'Scan Document',
      scanning: 'Processing & Enhancing...',
      saved: 'Document saved to vault!',
      viewVault: 'View in Records',
      shield: 'Documents are processed locally for your privacy.',
    },
    [Language.HINDI]: {
      back: 'पीछे',
      title: 'डिजिटल स्कैनर',
      subtitle: 'एआई क्लियर-व्यू के साथ दस्तावेज़, आईडी या प्रमाणपत्र स्कैन करें।',
      scanNow: 'दस्तावेज़ स्कैन करें',
      scanning: 'प्रसंस्करण और संवर्धन...',
      saved: 'दस्तावेज़ वॉल्ट में सुरक्षित!',
      viewVault: 'रिकॉर्ड में देखें',
      shield: 'आपकी गोपनीयता के लिए दस्तावेज़ स्थानीय रूप से संसाधित किए जाते हैं।',
    },
    [Language.KANNADA]: {
      back: 'ಹಿಂದಕ್ಕೆ',
      title: 'ಡಿಜಿಟಲ್ ಸ್ಕ್ಯಾನರ್',
      subtitle: 'AI ಕ್ಲಿಯರ್-ವ್ಯೂನೊಂದಿಗೆ ದಾಖಲೆಗಳು, ಐಡಿಗಳು ಅಥವಾ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
      scanNow: 'ದಾಖಲೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
      scanning: 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ ಮತ್ತು ವರ್ಧಿಸಲಾಗುತ್ತಿದೆ...',
      saved: 'ದಾಖಲೆಯನ್ನು ವಾಲ್ಟ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ!',
      viewVault: 'ದಾಖಲೆಗಳಲ್ಲಿ ವೀಕ್ಷಿಸಿ',
      shield: 'ನಿಮ್ಮ ಗೌಪ್ಯತೆಗಾಗಿ ದಾಖಲೆಗಳನ್ನು ಸ್ಥಳೀಯವಾಗಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತದೆ.',
    },
    [Language.TELUGU]: {
      back: 'వెనుకకు',
      title: 'డిజిటల్ స్కానర్',
      subtitle: 'AI క్లియర్-వ్యూతో పత్రాలు, IDలు లేదా ధృవీకరణ పత్రాలను స్కాన్ చేయండి.',
      scanNow: 'పత్రాన్ని స్కాన్ చేయండి',
      scanning: 'ప్రాసెసింగ్ & ఎన్‌హాన్సింగ్...',
      saved: 'పత్రం వాల్ట్‌లో సేవ్ చేయబడింది!',
      viewVault: 'రికార్డుల్లో చూడండి',
      shield: 'మీ గోప్యత కోసం పత్రాలు స్థానికంగా ప్రాసెస్ చేయబడతాయి.',
    },
    [Language.TAMIL]: {
      back: 'பின்செல்',
      title: 'டிஜிட்டல் ஸ்கேனர்',
      subtitle: 'AI தெளிவான காட்சியுடன் ஆவணங்கள், ஐடிகள் அல்லது சான்றிதழ்களை ஸ்கேன் செய்யவும்.',
      scanNow: 'ஆவணத்தை ஸ்கேன் செய்',
      scanning: 'செயலாக்கம் மற்றும் மேம்படுத்துதல்...',
      saved: 'ஆவணம் பெட்டகத்தில் சேமிக்கப்பட்டது!',
      viewVault: 'பதிவுகளில் பார்க்கவும்',
      shield: 'உங்கள் தனியுரிமைக்காக ஆவணங்கள் உள்ளூரிலேயே செயலாக்கப்படுகின்றன.',
    },
    [Language.BENGALI]: {
      back: 'পিছনে',
      title: 'ডিজিটাল স্ক্যানার',
      subtitle: 'AI ক্লিয়ার-ভিউ দিয়ে নথি, আইডি বা শংসাপত্র স্ক্যান করুন।',
      scanNow: 'নথি স্ক্যান করুন',
      scanning: 'প্রক্রিয়াকরণ এবং উন্নত করা হচ্ছে...',
      saved: 'নথি ভল্টে সংরক্ষিত হয়েছে!',
      viewVault: 'রেকর্ডে দেখুন',
      shield: 'আপনার গোপনীয়তার জন্য নথিগুলি স্থানীয়ভাবে প্রক্রিয়া করা হয়।',
    }
  };

  const current = translations[language];

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedImage('preview');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="text-xs text-text-muted flex items-center gap-2 hover:text-white"
      >
        <ArrowLeft size={16} /> {current.back}
      </button>

      <div className="glass p-8 rounded-[40px] border-white/5 space-y-8 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-black flex items-center justify-center gap-3">
            <Scan className="text-neon-blue" size={32} />
            {current.title}
          </h2>
          <p className="text-sm text-text-muted">{current.subtitle}</p>
        </div>

        <div className="aspect-3/4 bg-white/5 rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
          {scannedImage ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/10 p-6 space-y-4">
               <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                 <CheckCircle2 size={48} />
               </div>
               <p className="font-bold text-emerald-400">{current.saved}</p>
               <button 
                 onClick={onBack}
                 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400/60 hover:text-emerald-400"
               >
                 <History size={16} /> {current.viewVault}
               </button>
             </div>
          ) : scanning ? (
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-neon-blue animate-pulse">
                  {current.scanning}
                </p>
                <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue shadow-[0_0_20px_rgba(59,130,246,1)] animate-scan" />
             </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Camera size={40} className="text-white/20 group-hover:text-white/40" />
              </div>
              <button 
                onClick={handleScan}
                className="px-8 py-4 bg-neon-blue rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-neon-blue/20"
              >
                {current.scanNow}
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center bg-white/5 p-5 rounded-[24px] border border-white/5">
           <ShieldCheck size={24} className="text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
           <p className="text-[10px] text-left text-white/40 uppercase font-bold tracking-wider leading-relaxed">
             {current.shield}
           </p>
        </div>
      </div>
    </div>
  );
}
