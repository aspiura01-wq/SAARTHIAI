import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Search, AlertTriangle, PhoneOff, CheckCircle2, XCircle, Info, ArrowLeft, ShieldAlert } from 'lucide-react';

import { Language } from '../types';

export default function FraudShieldView({ onBack, language }: { onBack: () => void, language: Language }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ status: 'safe' | 'scam' | 'suspicious', score: number, details: string } | null>(null);

  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      back: 'Back',
      title: 'Fraud Shield',
      subtitle: 'Protect yourself from digital scammers and fraudulent calls.',
      placeholder: 'Enter suspicious number...',
      analyzing: 'Analyzing Pattern...',
      detectBtn: 'Detect Fraud',
      safeTitle: 'Likely Safe',
      scamTitle: 'Confirmed Scam',
      suspiciousTitle: 'Suspicious',
      riskScore: 'Risk Score',
      safeDetails: 'No negative reports found for this number in our community database.',
      scamDetails: 'This number has been reported 45 times for impersonating bank officials. High risk of phishing.',
      suspiciousDetails: 'Newly active number with high frequency of short-duration calls. Exercise caution.',
      commonScams: 'Common Scams',
      scams: [
        '"Your electricity will be cut tonight" calls',
        '"You won a lottery, pay processing fee"',
        'WhatsApp messages from "known" relatives'
      ],
      protectionTips: 'Protection Tips',
      tips: [
        'Never download "Screen Share" apps',
        'Report suspicious calls on Chakshu portal',
        'Enable "Block Spam" in your phone settings',
        'SaarthiAI will never ask for your PIN'
      ]
    },
    [Language.HINDI]: {
      back: 'पीछे',
      title: 'फ्रॉड शील्ड',
      subtitle: 'डिजिटल स्कैमर्स और धोखाधड़ी वाली कॉलों से खुद को बचाएं।',
      placeholder: 'संदिग्ध नंबर दर्ज करें...',
      analyzing: 'पैटर्न का विश्लेषण कर रहे हैं...',
      detectBtn: 'धोखाधड़ी का पता लगाएं',
      safeTitle: 'संभावित रूप से सुरक्षित',
      scamTitle: 'पुष्टि किया गया घोटाला',
      suspiciousTitle: 'संदिग्ध',
      riskScore: 'जोखिम स्कोर',
      safeDetails: 'हमारे समुदाय डेटाबेस में इस नंबर के लिए कोई नकारात्मक रिपोर्ट नहीं मिली।',
      scamDetails: 'बैंक अधिकारियों का रूप धारण करने के लिए इस नंबर की 45 बार रिपोर्ट की गई है। फिशिंग का उच्च जोखिम।',
      suspiciousDetails: 'कम अवधि की कॉलों की उच्च आवृत्ति वाला नया सक्रिय नंबर। सावधानी बरतें।',
      commonScams: 'सामान्य घोटाले',
      scams: [
        '"आपकी बिजली आज रात कट जाएगी" कॉल',
        '"आपने लॉटरी जीती है, प्रोसेसिंग शुल्क का भुगतान करें"',
        '"परिचित" रिश्तेदारों के व्हाट्सएप मैसेज'
      ],
      protectionTips: 'सुरक्षा सुझाव',
      tips: [
        'कभी भी "स्क्रीन शेयर" ऐप डाउनलोड न करें',
        'चक्षु पोर्टल पर संदिग्ध कॉलों की रिपोर्ट करें',
        'अपने फोन सेटिंग्स में "ब्लॉक स्पैम" सक्षम करें',
        'सारथी एआई आपसे कभी आपका पिन नहीं मांगेगा'
      ]
    },
    [Language.KANNADA]: {
      back: 'ಹಿಂದಕ್ಕೆ',
      title: 'ವಂಚನೆ ತಡೆ',
      subtitle: 'ಡಿಜಿಟಲ್ ವಂಚಕರು ಮತ್ತು ವಂಚನೆಯ ಕರೆಗಳಿಂದ ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸಿಕೊಳ್ಳಿ.',
      placeholder: 'ಸಂದೇಹಾಸ್ಪದ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ...',
      analyzing: 'ಮಾದರಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      detectBtn: 'ವಂಚನೆಯನ್ನು ಪತ್ತೆಹಚ್ಚಿ',
      safeTitle: 'ಬಹುಶಃ ಸುರಕ್ಷಿತ',
      scamTitle: 'ಖಚಿತಪಡಿಸಿದ ವಂಚನೆ',
      suspiciousTitle: 'ಅನುಮಾನಾಸ್ಪದ',
      riskScore: 'ಅಪಾಯದ ಅಂಕ',
      safeDetails: 'ನಮ್ಮ ಸಮುದಾಯ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಈ ಸಂಖ್ಯೆಗೆ ಯಾವುದೇ ನಕಾರಾತ್ಮಕ ವರದಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
      scamDetails: 'ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಗಳಂತೆ ನಟಿಸಿದ್ದಕ್ಕಾಗಿ ಈ ಸಂಖ್ಯೆಯನ್ನು 45 ಬಾರಿ ವರದಿ ಮಾಡಲಾಗಿದೆ. ವಂಚನೆಯ ಹೆಚ್ಚಿನ ಅಪಾಯವಿದೆ.',
      suspiciousDetails: 'ಕಡಿಮೆ ಅವಧಿಯ ಕರೆಗಳ ಹೆಚ್ಚಿನ ಆವರ್ತನದೊಂದಿಗೆ ಹೊಸದಾಗಿ ಸಕ್ರಿಯವಾಗಿರುವ ಸಂಖ್ಯೆ. ಎಚ್ಚರಿಕೆ ವಹಿಸಿ.',
      commonScams: 'ಸಾಮಾನ್ಯ ವಂಚನೆಗಳು',
      scams: [
        '"ನಿಮ್ಮ ವಿದ್ಯುತ್ ಇಂದೇ ಕಟ್ ಆಗುತ್ತದೆ" ಎಂಬ ಕರೆಗಳು',
        '"ನೀವು ಲಾಟರಿ ಗೆದ್ದಿದ್ದೀರಿ, ಪ್ರಕ್ರಿಯೆ ಶುಲ್ಕ ಪಾವತಿಸಿ"',
        '"ತಿಳಿದಿರುವ" ಸಂಬಂಧಿಕರಿಂದ ವಾಟ್ಸಾಪ್ ಸಂದೇಶಗಳು'
      ],
      protectionTips: 'ರಕ್ಷಣೆಯ ಸಲಹೆಗಳು',
      tips: [
        '"ಸ್ಕ್ರೀನ್ ಶೇರ್" ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಎಂದಿಗೂ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಡಿ',
        'ಚಕ್ಷು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಸಂಶಯಾಸ್ಪದ ಕರೆಗಳನ್ನು ವರದಿ ಮಾಡಿ',
        'ಪೋನ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ "ಸ್ಪ್ಯಾಮ್ ಬ್ಲಾಕ್" ಸಕ್ರಿಯಗೊಳಿಸಿ',
        'ಸಾರಥಿಎಐ ಎಂದಿಗೂ ನಿಮ್ಮ ಪಿನ್ ಕೇಳುವುದಿಲ್ಲ'
      ]
    },
    [Language.TELUGU]: {
      back: 'వెనుకకు',
      title: 'ఫ్రాడ్ షీల్డ్',
      subtitle: 'డిజిటల్ స్కామర్‌లు మరియు మోసపూరిత కాల్‌ల నుండి మిమ్మల్ని మీరు రక్షించుకోండి.',
      placeholder: 'అనుమానాస్పద సంఖ్యను నమోదు చేయండి...',
      analyzing: 'నమూనాను విశ్లేషిస్తోంది...',
      detectBtn: 'మోసాన్ని గుర్తించండి',
      safeTitle: 'బహుశా సురక్షితం',
      scamTitle: 'ధృవీకరించబడిన స్కామ్',
      suspiciousTitle: 'అనుమానాస్పద',
      riskScore: 'రిస్క్ స్కోర్',
      safeDetails: 'మా కమ్యూనిటీ డేటాబేస్‌లో ఈ నంబర్ కోసం ఎటువంటి ప్రతికూల నివేదికలు కనుగొనబడలేదు.',
      scamDetails: 'బ్యాంక్ అధికారుల వేషంలో ఉన్నందుకు ఈ నంబర్ 45 సార్లు నివేదించబడింది. ఫిషింగ్ వచ్చే ప్రమాదం ఉంది.',
      suspiciousDetails: 'తక్కువ వ్యవధి కాల్‌లను తరచుగా చేసే కొత్తగా యాక్టివ్ అయిన నంబర్. జాగ్రత్త వహించండి.',
      commonScams: 'సాధారణ స్కామ్‌లు',
      scams: [
        '"మీ విద్యుత్ ఈ రాత్రి కట్ అవుతుంది" అని వచ్చే కాల్‌లు',
        '"మీరు లాటరీ గెలుచుకున్నారు, ప్రాసెసింగ్ ఫీజు చెల్లించండి"',
        '"తెలిసిన" బంధువుల నుండి వచ్చే వాట్సాప్ సందేశాలు'
      ],
      protectionTips: 'రక్షణ చిట్కాలు',
      tips: [
        '"స్క్రీన్ షేర్" యాప్‌లను ఎప్పుడూ డౌన్‌లోడ్ చేయవద్దు',
        'చక్షు పోర్టల్‌లో అనుమానాస్పద కాల్‌లను నివేదించండి',
        'మీ ఫోన్ సెట్టింగ్‌లలో "బ్లాక్ స్పామ్"ని ఎనేబుల్ చేయండి',
        'సారథి AI ఎప్పుడూ మీ పిన్‌ని అడగదు'
      ]
    },
    [Language.TAMIL]: {
      back: 'பின்செல்',
      title: 'மோசடி தடுப்பு',
      subtitle: 'டிஜிட்டல் மோசடி செய்பவர்கள் மற்றும் மோசடி அழைப்புகளிலிருந்து உங்களைப் பாதுகாத்துக் கொள்ளுங்கள்.',
      placeholder: 'சந்தேகத்திற்கிடமான எண்ணை உள்ளிடவும்...',
      analyzing: 'முறையை ஆய்வு செய்கிறது...',
      detectBtn: 'மோசடியைக் கண்டறி',
      safeTitle: 'பாதுகாப்பானது',
      scamTitle: 'உறுதிப்படுத்தப்பட்ட மோசடி',
      suspiciousTitle: 'சந்தேகத்திற்குரியது',
      riskScore: 'ஆபத்து மதிப்பெண்',
      safeDetails: 'எங்கள் சமூக தரவுத்தளத்தில் இந்த எண்ணைப் பற்றி எதிர்மறையான புகார்கள் எதுவும் இல்லை.',
      scamDetails: 'வங்கி அதிகாரிகளைப் போல நடித்ததற்காக இந்த எண் 45 முறை புகார் செய்யப்பட்டுள்ளது. பிஷிங் (Phishing) ஆபத்து அதிகம்.',
      suspiciousDetails: 'அடிக்கடி குறுகிய கால அழைப்புகளைச் செய்யும் புதிய செயலில் உள்ள எண். எச்சரிக்கையுடன் இருக்கவும்.',
      commonScams: 'பொதுவான மோசடிகள்',
      scams: [
        '"உங்கள் மின்சாரம் இன்று இரவு துண்டிக்கப்படும்" என்று வரும் அழைப்புகள்',
        '"நீங்கள் லாட்டரி வென்றுள்ளீர்கள், செயலாக்கக் கட்டணத்தைச் செலுத்துங்கள்"',
        '"தெரிந்த" உறவினர்களிடமிருந்து வரும் வாட்ஸ்அப் செய்திகள்'
      ],
      protectionTips: 'பாதுகாப்பு குறிப்புகள்',
      tips: [
        'ஒருபோதும் "ஸ்கிரீன் ஷேர்" (Screen Share) செயலிகளைப் பதிவிறக்க வேண்டாம்',
        'சக்ஷு (Chakshu) போர்ட்டலில் சந்தேகத்திற்கிடமான அழைப்புகளைப் புகாரளிக்கவும்',
        'உங்கள் தொலைபேசி அமைப்புகளில் "தேவையற்ற அழைப்புகளைத் தடு" (Block Spam) என்பதைச் செயல்படுத்தவும்',
        'சாரதி AI ஒருபோதும் உங்கள் PIN எண்ணைக் கேட்காது'
      ]
    },
    [Language.BENGALI]: {
      back: 'পিছনে',
      title: 'ফ্রড শিল্ড',
      subtitle: 'ডিজিটাল স্ক্যামার এবং প্রতারণামূলক কল থেকে নিজেকে রক্ষা করুন।',
      placeholder: 'সন্দেহজনক নম্বর লিখুন...',
      analyzing: 'প্যাটার্ন বিশ্লেষণ করা হচ্ছে...',
      detectBtn: 'প্রতারণা শনাক্ত করুন',
      safeTitle: 'সম্ভবত নিরাপদ',
      scamTitle: 'নিশ্চিত স্ক্যাম',
      suspiciousTitle: 'সন্দেহজনক',
      riskScore: 'ঝুঁকি স্কোর',
      safeDetails: 'আমাদের কমিউনিটি ডাটাবেসে এই নম্বরের জন্য কোনো নেতিবাচক রিপোর্ট পাওয়া যায়নি।',
      scamDetails: 'ব্যাঙ্ক কর্মকর্তাদের ছদ্মবেশ ধারণ করার জন্য এই নম্বরটি ৪৫ বার রিপোর্ট করা হয়েছে। ফিশিংয়ের উচ্চ ঝুঁকি।',
      suspiciousDetails: 'স্বল্প সময়ের কলের উচ্চ ফ্রিকোয়েন্সি সহ নতুন সক্রিয় নম্বর। সতর্কতা অবলম্বন করুন।',
      commonScams: 'সাধারণ স্ক্যাম',
      scams: [
        '"আপনার বিদ্যুৎ আজ রাতে বিচ্ছিন্ন হয়ে যাবে" কল',
        '"আপনি লটারি জিতেছেন, প্রসেসিং ফি জমা দিন"',
        '"পরিচিত" আত্মীয়দের কাছ থেকে হোয়াটসঅ্যাপ বার্তা'
      ],
      protectionTips: 'সুরক্ষা টিপস',
      tips: [
        'কখনও "স্ক্রিন শেয়ার" অ্যাপ ডাউনলোড করবেন না',
        'চক্ষু পোর্টালে সন্দেহজনক কলের রিপোর্ট করুন',
        'আপনার ফোন সেটিংসে "ব্লক স্প্যাম" সক্ষম করুন',
        'সারথি AI কখনও আপনার পিন জিজ্ঞাসা করবে না'
      ]
    }
  };

  const current = translations[language];

  const analyzeNumber = () => {
    if (!phoneNumber) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate analysis
    setTimeout(() => {
      const lastDigit = parseInt(phoneNumber.slice(-1));
      if (lastDigit % 3 === 0) {
        setResult({
          status: 'scam',
          score: 98,
          details: current.scamDetails
        });
      } else if (lastDigit % 2 === 0) {
        setResult({
          status: 'suspicious',
          score: 45,
          details: current.suspiciousDetails
        });
      } else {
        setResult({
          status: 'safe',
          score: 5,
          details: current.safeDetails
        });
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="text-xs text-text-muted flex items-center gap-2 hover:text-white"
      >
        <ArrowLeft size={16} /> {current.back}
      </button>

      <div className="glass p-8 rounded-[40px] border-neon-purple/20 bg-neon-purple/5 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheck size={120} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 bg-neon-purple/20 rounded-3xl mx-auto flex items-center justify-center border border-neon-purple/40 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <ShieldAlert size={40} className="text-neon-purple" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">{current.title}</h2>
            <p className="text-text-muted text-sm">{current.subtitle}</p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={current.placeholder}
                className="w-full py-5 px-6 rounded-3xl bg-white/5 border border-white/10 outline-none focus:border-neon-purple transition-all text-center text-xl font-bold tracking-widest"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search size={24} className="text-white/20" />
              </div>
            </div>
            
            <button 
              onClick={analyzeNumber}
              disabled={isAnalyzing || !phoneNumber}
              className="w-full py-4 bg-neon-purple rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-neon-purple/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {current.analyzing}
                </>
              ) : (
                <>{current.detectBtn}</>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 rounded-[40px] border relative overflow-hidden ${
              result.status === 'scam' ? 'bg-red-500/10 border-red-500/20' : 
              result.status === 'suspicious' ? 'bg-amber-500/10 border-amber-500/20' : 
              'bg-emerald-500/10 border-emerald-500/20'
            }`}
          >
            <div className="flex items-start gap-6">
              <div className={`p-4 rounded-3xl shrink-0 ${
                result.status === 'scam' ? 'bg-red-500/20 text-red-500' : 
                result.status === 'suspicious' ? 'bg-amber-500/20 text-amber-500' : 
                'bg-emerald-500/20 text-emerald-500'
              }`}>
                {result.status === 'scam' ? <PhoneOff size={32} /> : 
                 result.status === 'suspicious' ? <AlertTriangle size={32} /> : 
                 <CheckCircle2 size={32} />}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black uppercase">
                    {result.status === 'scam' ? current.scamTitle : 
                     result.status === 'suspicious' ? current.suspiciousTitle : 
                     current.safeTitle}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    result.status === 'scam' ? 'bg-red-500 text-white' : 
                    result.status === 'suspicious' ? 'bg-amber-500 text-black' : 
                    'bg-emerald-500 text-white'
                  }`}>
                    {current.riskScore}: {result.score}%
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed text-sm">
                  {result.details}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
          <h4 className="font-bold flex items-center gap-2">
            <Info size={18} className="text-neon-blue" />
            {current.commonScams}
          </h4>
          <div className="space-y-3">
             {current.scams.map((scam: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 text-xs text-white/60">{scam}</div>
             ))}
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
          <h4 className="font-bold flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            {current.protectionTips}
          </h4>
          <ul className="space-y-2 text-xs text-white/60 list-disc list-inside">
            {current.tips.map((tip: string, idx: number) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
