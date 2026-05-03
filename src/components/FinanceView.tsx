import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Landmark, DollarSign, AlertCircle, ChevronRight, Lock, PieChart, Plus, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

import { Language } from '../types';

export default function FinanceView({ language }: { language: Language }) {
  const [viewMode, setViewMode] = useState<'info' | 'budget'>('info');
  const [budgetItems, setBudgetItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      safetyInfo: 'Safety Info',
      myBudget: 'My Budget',
      financialSafety: 'Financial Safety',
      safetyTip: 'Never share your OTP or PIN with anyone. Banks never ask for it.',
      signInTitle: 'Sign in to Save Budget',
      signInDesc: 'Track your expenses and income across all your devices by signing in securely with Google.',
      signInBtn: 'Sign in with Google',
      totalIncome: 'Total Income',
      totalExpense: 'Total Expense',
      recentTransactions: 'Recent Transactions',
      loadingTransactions: 'Loading transactions...',
      addFirstTransaction: 'Tap + to add your first transaction',
      savingsPositive: (val: string) => `You have saved ₹${val} this month. Great job!`,
      savingsNegative: 'Watch your expenses this month to stay within budget.',
      stepsTitle: 'Safe Steps to Follow',
      helplinesTitle: 'Important Helplines',
      secureHelp: 'Secure Help',
      issues: {
        lostCard: 'Lost ATM Card',
        lostCardSteps: [
          'Call bank customer care immediately',
          'Request to "Block Card"',
          'Note down the complaint number',
          'Visit home branch for new card application'
        ],
        helplines: 'Bank Helpline Numbers',
        helplinesSteps: [
          'Select your bank from the list',
          'Call the 24/7 toll-free number',
          'Keep your account number ready',
          'Never share OTP or PIN over call'
        ],
        cashHelp: 'Urgent Cash Help',
        cashHelpSteps: [
          'Check nearby micro-ATMs or Bank Mitras',
          'Use Aadhaar Enabled Payment (AePS)',
          'Check PMJDY Overdraft eligibility',
          'Avoid local informal high-interest lenders'
        ],
        loanInfo: 'Loan Information',
        loanInfoSteps: [
          'Check Kisan Credit Card (KCC)',
          'PMEGP for small business setup',
          'Mudra loans for startups',
          'Education loans for students'
        ]
      }
    },
    [Language.HINDI]: {
      safetyInfo: 'सुरक्षा जानकारी',
      myBudget: 'मेरा बजट',
      financialSafety: 'वित्तीय सुरक्षा',
      safetyTip: 'कभी भी अपना OTP या PIN किसी के साथ साझा न करें। बैंक कभी इसे नहीं मांगते।',
      signInTitle: 'बजट सहेजने के लिए साइन इन करें',
      signInDesc: 'Google के साथ सुरक्षित रूप से साइन इन करके अपने सभी डिवाइस पर अपने खर्चों और आय को ट्रैक करें।',
      signInBtn: 'Google के साथ साइन इन करें',
      totalIncome: 'कुल आय',
      totalExpense: 'कुल खर्च',
      recentTransactions: 'हाल ही के लेनदेन',
      loadingTransactions: 'लेनदेन लोड हो रहे हैं...',
      addFirstTransaction: 'अपना पहला लेनदेन जोड़ने के लिए + टैप करें',
      savingsPositive: (val: string) => `आपने इस महीने ₹${val} बचाए हैं। बहुत अच्छा!`,
      savingsNegative: 'बजट के भीतर रहने के लिए इस महीने अपने खर्चों पर नज़र रखें।',
      stepsTitle: 'पालन करने योग्य सुरक्षित कदम',
      helplinesTitle: 'महत्वपूर्ण हेल्पलाइन',
      secureHelp: 'सुरक्षित सहायता',
      issues: {
        lostCard: 'एटीएम कार्ड खो गया',
        lostCardSteps: [
          'तुरंत बैंक कस्टमर केयर को कॉल करें',
          'कार्ड ब्लॉक करने का अनुरोध करें',
          'शिकायत नंबर नोट कर लें',
          'नए कार्ड आवेदन के लिए अपनी शाखा में जाएं'
        ],
        helplines: 'बैंक हेल्पलाइन नंबर',
        helplinesSteps: [
          'सूची से अपना बैंक चुनें',
          '24/7 टोल-फ्री नंबर पर कॉल करें',
          'अपना खाता नंबर तैयार रखें',
          'कॉल पर कभी भी OTP या PIN साझा न करें'
        ],
        cashHelp: 'तत्काल नकद सहायता',
        cashHelpSteps: [
          'पास के माइक्रो-एटीएम या बैंक मित्रों की जाँच करें',
          'आधार सक्षम भुगतान (AePS) का उपयोग करें',
          'PMJDY ओवरड्राफ्ट पात्रता की जाँच करें',
          'स्थानीय अनौपचारिक उच्च-ब्याज उधारदाताओं से बचें'
        ],
        loanInfo: 'ऋण जानकारी',
        loanInfoSteps: [
          'किसान क्रेडिट कार्ड (KCC) की जाँच करें',
          'छोटे व्यवसाय सेटअप के लिए PMEGP',
          'स्टार्टअप के लिए मुद्रा ऋण',
          'छात्रों के लिए शिक्षा ऋण'
        ]
      }
    },
    [Language.KANNADA]: {
      safetyInfo: 'ಸುರಕ್ಷತಾ ಮಾಹಿತಿ',
      myBudget: 'ನನ್ನ ಬಜೆಟ್',
      financialSafety: 'ಹಣಕಾಸು ಸುರಕ್ಷತೆ',
      safetyTip: 'ನಿಮ್ಮ OTP ಅಥವಾ PIN ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. ಬ್ಯಾಂಕುಗಳು ಎಂದಿಗೂ ಅದನ್ನು ಕೇಳುವುದಿಲ್ಲ.',
      signInTitle: 'ಬಜೆಟ್ ಉಳಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
      signInDesc: 'Google ನೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿ ಸೈನ್ ಇನ್ ಮಾಡುವ ಮೂಲಕ ನಿಮ್ಮ ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ನಿಮ್ಮ ವೆಚ್ಚಗಳು ಮತ್ತು ಆದಾಯವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
      signInBtn: 'Google ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
      totalIncome: 'ಒಟ್ಟು ಆದಾಯ',
      totalExpense: 'ಒಟ್ಟು ವೆಚ್ಚ',
      recentTransactions: 'ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು',
      loadingTransactions: 'ವಹಿವಾಟುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
      addFirstTransaction: 'ನಿಮ್ಮ ಮೊದಲ ವಹಿವಾಟನ್ನು ಸೇರಿಸಲು + ಟ್ಯಾಪ್ ಮಾಡಿ',
      savingsPositive: (val: string) => `ಈ ತಿಂಗಳು ನೀವು ₹${val} ಉಳಿಸಿದ್ದೀರಿ. ಅದ್ಭುತ ಕೆಲಸ!`,
      savingsNegative: 'ಬಜೆಟ್‌ನಲ್ಲಿ ಉಳಿಯಲು ಈ ತಿಂಗಳು ನಿಮ್ಮ ವೆಚ್ಚಗಳನ್ನು ಗಮನಿಸಿ.',
      stepsTitle: 'ಅನುಸರಿಸಬೇಕಾದ ಸುರಕ್ಷಿತ ಕ್ರಮಗಳು',
      helplinesTitle: 'ಪ್ರಮುಖ ಸಹಾಯವಾಣಿಗಳು',
      secureHelp: 'ಸುರಕ್ಷಿತ ಸಹಾಯ',
      issues: {
        lostCard: 'ಎಟಿಎಂ ಕಾರ್ಡ್ ಕಳೆದುಹೋಗಿದೆ',
        lostCardSteps: [
          'ತಕ್ಷಣ ಬ್ಯಾಂಕ್ ಗ್ರಾಹಕ ಸೇವೆಗೆ ಕರೆ ಮಾಡಿ',
          'ಕಾರ್ಡ್ ಬ್ಲಾಕ್ ಮಾಡಲು ವಿನಂತಿಸಿ',
          'ದೂರು ಸಂಖ್ಯೆಯನ್ನು ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ',
          'ಹೊಸ ಕಾರ್ಡ್ ಅರ್ಜಿಗಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ'
        ],
        helplines: 'ಬ್ಯಾಂಕ್ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆಗಳು',
        helplinesSteps: [
          'ಪಟ್ಟಿಯಿಂದ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಆಯ್ಕೆಮಾಡಿ',
          '24/7 ಟೋಲ್-ಫ್ರೀ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ',
          'ನಿಮ್ಮ ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ಸಿದ್ಧವಾಗಿಡಿ',
          'ಕರೆಯಲ್ಲಿ ಎಂದಿಗೂ OTP ಅಥವಾ PIN ಹಂಚಿಕೊಳ್ಳಬೇಡಿ'
        ],
        cashHelp: 'ತುರ್ತು ನಗದು ಸಹಾಯ',
        cashHelpSteps: [
          'ಹತ್ತಿರದ ಮೈಕ್ರೋ-ಎಟಿಎಂ ಅಥವಾ ಬ್ಯಾಂಕ್ ಮಿತ್ರರನ್ನು ಪರಿಶೀಲಿಸಿ',
          'ಆಧಾರ್ ಸಕ್ರಿಯಗೊಳಿಸಿದ ಪಾವತಿ (AePS) ಬಳಸಿ',
          'PMJDY ಓವರ್‌ಡ್ರಾಫ್ಟ್ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
          'ಸ್ಥಳೀಯ ಅನೌಪಚಾರಿಕ ಹೆಚ್ಚಿನ ಬಡ್ಡಿಯ ಸಾಲದಾತರಿಂದ ದೂರವಿರಿ'
        ],
        loanInfo: 'ಸಾಲದ ಮಾಹಿತಿ',
        loanInfoSteps: [
          'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಪರಿಶೀಲಿಸಿ',
          'ಸಣ್ಣ ಉದ್ಯಮ ಸ್ಥಾಪನೆಗಾಗಿ PMEGP',
          'ಸ್ಟಾರ್ಟ್‌ಅಪ್‌ಗಳಿಗಾಗಿ ಮುದ್ರಾ ಸಾಲಗಳು',
          'ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ ಶಿಕ್ಷಣ ಸಾಲಗಳು'
        ]
      }
    },
    [Language.TELUGU]: {
      safetyInfo: 'భద్రతా సమాచారం',
      myBudget: 'నా బడ్జెట్',
      financialSafety: 'ఆర్థిక భద్రత',
      safetyTip: 'మీ OTP లేదా PINను ఎవరితోనూ పంచుకోవద్దు. బ్యాంకులు ఎప్పుడూ వీటిని అడగవు.',
      signInTitle: 'బడ్జెట్‌ను సేవ్ చేయడానికి సైన్ ఇన్ చేయండి',
      signInDesc: 'Googleతో సురక్షితంగా సైన్ ఇన్ చేయడం ద్వారా మీ అన్ని పరికరాల్లో మీ ఖర్చులు మరియు ఆదాయాన్ని ట్రాక్ చేయండి.',
      signInBtn: 'Googleతో సైన్ ఇన్ చేయండి',
      totalIncome: 'మొత్తం ఆదాయం',
      totalExpense: 'మొత్తం ఖర్చు',
      recentTransactions: 'ఇటీవలి లావాదేవీలు',
      loadingTransactions: 'లావాదేవీలను లోడ్ చేస్తోంది...',
      addFirstTransaction: 'మీ మొదటి లావాదేవీని జోడించడానికి + నొక్కండి',
      savingsPositive: (val: string) => `మీరు ఈ నెలలో ₹${val} ఆదా చేశారు. గొప్ప పని!`,
      savingsNegative: 'బడ్జెట్‌లో ఉండటానికి ఈ నెల మీ ఖర్చులను గమనించండి.',
      stepsTitle: 'అనుసరించాల్సిన సురక్షిత దశలు',
      helplinesTitle: 'ముఖ్యమైన హెల్ప్‌లైన్లు',
      secureHelp: 'సురక్షిత సహాయం',
      issues: {
        lostCard: 'ATM కార్డ్ పోయింది',
        lostCardSteps: [
          'వెంటనే బ్యాంక్ కస్టమర్ కేర్‌కు కాల్ చేయండి',
          '"బ్లాక్ కార్డ్" కోసం అభ్యర్థించండి',
          'ఫిర్యాదు నంబర్‌ను నోట్ చేసుకోండి',
          'కొత్త కార్డ్ దరఖాస్తు కోసం హోమ్ బ్రాంచ్‌ను సందర్శించండి'
        ],
        helplines: 'బ్యాంక్ హెల్ప్‌లైన్ నంబర్లు',
        helplinesSteps: [
          'జాబితా నుండి మీ బ్యాంక్‌ను ఎంచుకోండి',
          '24/7 టోల్-ఫ్రీ నంబర్‌కు కాల్ చేయండి',
          'మీ ఖాతా సంఖ్యను సిద్ధంగా ఉంచుకోండి',
          'కాల్‌లో ఎప్పుడూ OTP లేదా PINను పంచుకోవద్దు'
        ],
        cashHelp: 'అత్యవసర నగదు సహాయం',
        cashHelpSteps: [
          'సమీపంలోని మైక్రో-ATMలు లేదా బ్యాంక్ మిత్రాలను తనిఖీ చేయండి',
          'ఆధార్ ఎనేబుల్డ్ పేమెంట్ (AePS) ఉపయోగించండి',
          'PMJDY ఓవర్‌డ్రాఫ్ట్ అర్హతను తనిఖీ చేయండి',
          'స్థానిక అనధికారిక అధిక వడ్డీ రుణదాతలను నివారించండి'
        ],
        loanInfo: 'రుణ సమాచారం',
        loanInfoSteps: [
          'కిసాన్ క్రెడిట్ కార్డ్ (KCC)ని తనిఖీ చేయండి',
          'చిన్న వ్యాపార స్థాపన కోసం PMEGP',
          'స్టార్టప్‌ల కోసం ముద్ర రుణాలు',
          'విద్యార్థుల కోసం విద్యా రుణాలు'
        ]
      }
    },
    [Language.TAMIL]: {
      safetyInfo: 'பாதுகாப்பு தகவல்',
      myBudget: 'எனது பட்ஜெட்',
      financialSafety: 'நிதி பாதுகாப்பு',
      safetyTip: 'உங்கள் OTP அல்லது PIN-ஐ யாருடனும் பகிர வேண்டாம். வங்கி ஒருபோதும் இதைக் கேட்காது.',
      signInTitle: 'பட்ஜெட்டைச் சேமிக்க உள்நுழையவும்',
      signInDesc: 'Google மூலம் பாதுகாப்பாக உள்நுழைவதன் மூலம் உங்கள் அனைத்து சாதனங்களிலும் உங்கள் செலவுகள் மற்றும் வருமானத்தைக் கண்காணிக்கவும்.',
      signInBtn: 'Google மூலம் உள்நுழையவும்',
      totalIncome: 'மொத்த வருமானம்',
      totalExpense: 'மொத்த செலவு',
      recentTransactions: 'சமீபத்திய பரிவர்த்தனைகள்',
      loadingTransactions: 'பரிவர்த்தனைகளை ஏற்றுகிறது...',
      addFirstTransaction: 'உங்கள் முதல் பரிவர்த்தனையைச் சேர்க்க + ஐ அழுத்தவும்',
      savingsPositive: (val: string) => `இந்த மாதம் நீங்கள் ₹${val} சேமித்துள்ளீர்கள். நன்று!`,
      savingsNegative: 'பட்ஜெட்டுக்குள் இருக்க இந்த மாதம் உங்கள் செலவுகளைக் கவனியுங்கள்.',
      stepsTitle: 'பின்பற்ற வேண்டிய பாதுகாப்பு முறைகள்',
      helplinesTitle: 'முக்கிய உதவி எண்கள்',
      secureHelp: 'பாதுகாப்பான உதவி',
      issues: {
        lostCard: 'ஏடிஎம் கார்டு தொலைந்தது',
        lostCardSteps: [
          'உடனடியாக வங்கி வாடிக்கையாளர் சேவையை அழைக்கவும்',
          '"கார்டைத் தடுக்க" (Block Card) கோரிக்கை விடுக்கவும்',
          'புகார் எண்ணைக் குறித்துக் கொள்ளவும்',
          'புதிய கார்டு விண்ணப்பத்திற்கு உங்கள் வங்கிக் கிளையை அணுகவும்'
        ],
        helplines: 'வங்கி உதவி எண்கள்',
        helplinesSteps: [
          'பட்டியலில் இருந்து உங்கள் வங்கியைத் தேர்ந்தெடுக்கவும்',
          '24/7 கட்டணமில்லா எண்ணை அழைக்கவும்',
          'உங்கள் கணக்கு எண்ணைத் தயாராக வைத்திருக்கவும்',
          'அழைப்பின் போது ஒருபோதும் OTP அல்லது PIN-ஐப் பகிர வேண்டாம்'
        ],
        cashHelp: 'அவசர பண உதவி',
        cashHelpSteps: [
          'அருகிலுள்ள மைக்ரோ-ஏடிஎம்கள் அல்லது வங்கி மித்ராக்களைச் சரிபார்க்கவும்',
          'ஆதார் அடிப்படையிலான பணம் செலுத்தும் முறையை (AePS) பயன்படுத்தவும்',
          'PMJDY ஓவர் டிராஃப்ட் தகுதியைச் சரிபார்க்கவும்',
          'உள்ளூர் கந்துவட்டிக் காரர்களிடம் பணம் வாங்குவதைத் தவிர்க்கவும்'
        ],
        loanInfo: 'கடன் தகவல்',
        loanInfoSteps: [
          'கிசான் கிரெடிட் கார்டு (KCC) இருப்பைச் சரிபார்க்கவும்',
          'சிறு தொழில் தொடங்க PMEGP திட்டத்தைப் பயன்படுத்தவும்',
          'தொடக்க நிறுவனங்களுக்கான முத்ரா கடன்கள்',
          'மாணவர்களுக்கான கல்வி கடன்கள்'
        ]
      }
    },
    [Language.BENGALI]: {
      safetyInfo: 'নিরাপত্তা তথ্য',
      myBudget: 'আমার বাজেট',
      financialSafety: 'আর্থিক নিরাপত্তা',
      safetyTip: 'কখনও আপনার OTP বা PIN কারও সাথে শেয়ার করবেন না। ব্যাঙ্ক কখনও এটি চায় না।',
      signInTitle: 'বাজেট সংরক্ষণ করতে সাইন ইন করুন',
      signInDesc: 'Google-এর মাধ্যমে নিরাপদে সাইন ইন করে আপনার সমস্ত ডিভাইসে আপনার খরচ এবং আয় ট্র্যাক করুন।',
      signInBtn: 'Google-এর মাধ্যমে সাইন ইন করুন',
      totalIncome: 'মোট আয়',
      totalExpense: 'মোট খরচ',
      recentTransactions: 'সাম্প্রতিক লেনদেন',
      loadingTransactions: 'লেনদেন লোড হচ্ছে...',
      addFirstTransaction: 'আপনার প্রথম লেনদেন যোগ করতে + আলতো চাপুন',
      savingsPositive: (val: string) => `আপনি এই মাসে ₹${val} সাশ্রয় করেছেন। দুর্দান্ত কাজ!`,
      savingsNegative: 'বাজেটের মধ্যে থাকতে এই মাসে আপনার খরচের দিকে নজর দিন।',
      stepsTitle: 'অনুসরণ করার জন্য নিরাপদ পদক্ষেপ',
      helplinesTitle: 'গুরুত্বপূর্ণ হেল্পলাইন',
      secureHelp: 'নিরাপদ সাহায্য',
      issues: {
        lostCard: 'এটিএম কার্ড হারিয়ে গেছে',
        lostCardSteps: [
          'অবিলম্বে ব্যাঙ্ক কাস্টমার কেয়ারে কল করুন',
          '"কার্ড ব্লক" করার অনুরোধ জানান',
          'অভিযোগ নম্বরটি লিখে রাখুন',
          'নতুন কার্ডের আবেদনের জন্য হোম ব্রাঞ্চে যান'
        ],
        helplines: 'ব্যাঙ্ক হেল্পলাইন নম্বর',
        helplinesSteps: [
          'তালিকা থেকে আপনার ব্যাঙ্ক নির্বাচন করুন',
          '২৪/৭ টোল-ফ্রি নম্বরে কল করুন',
          'আপনার অ্যাকাউন্ট নম্বর প্রস্তুত রাখুন',
          'কলের মাধ্যমে কখনও OTP বা PIN শেয়ার করবেন না'
        ],
        cashHelp: 'জরুরি নগদ সাহায্য',
        cashHelpSteps: [
          'কাছাকাছি মাইক্রো-এটিএম বা ব্যাঙ্ক মিত্রদের খুঁজুন',
          'আধার সক্ষম পেমেন্ট (AePS) ব্যবহার করুন',
          'PMJDY ওভারড্রাফ্ট যোগ্যতা পরীক্ষা করুন',
          'স্থানীয় অনানুষ্ঠানিক উচ্চ-সুদের মহাজনদের এড়িয়ে চলুন'
        ],
        loanInfo: 'ঋণ তথ্য',
        loanInfoSteps: [
          'কিষাণ ক্রেডিট কার্ড (KCC) পরীক্ষা করুন',
          'ক্ষুদ্র ব্যবসা স্থাপনের জন্য PMEGP',
          'স্টার্টআপের জন্য মুদ্রা ঋণ',
          'ছাত্রদের জন্য শিক্ষা ঋণ'
        ]
      }
    }
  };

  const current = translations[language];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'budget'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBudgetItems(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalIncome = budgetItems.filter(i => i.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = budgetItems.filter(i => i.type === 'expense').reduce((sum, item) => sum + item.amount, 0);

  const addDummyTransaction = async () => {
    if (!auth.currentUser) return;
    const isIncome = Math.random() > 0.7;
    const item = isIncome ? { category: 'Side Work', amount: 500, type: 'income' } : { category: 'Market', amount: 200, type: 'expense' };
    
    try {
      await addDoc(collection(db, 'budget'), {
        ...item,
        date: new Date().toLocaleDateString(),
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding budget item:", error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'budget', id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const banks = [
    { name: 'SBI', number: '1800 1234' },
    { name: 'HDFC', number: '1800 202 6161' },
    { name: 'ICICI', number: '1800 1080' },
    { name: 'PNB', number: '1800 180 2222' },
    { name: 'Axis', number: '1800 419 5959' },
    { name: 'BoB', number: '1800 5700' },
    { name: 'Canara', number: '1800 1030' },
    { name: 'Kotak', number: '1860 266 2666' },
  ];

  const issues = [
    {
      id: 'lost-card',
      title: current.issues.lostCard,
      icon: <CreditCard className="text-red-400" />,
      steps: current.issues.lostCardSteps,
      helplines: banks.slice(0, 4)
    },
    {
      id: 'bank-support',
      title: current.issues.helplines,
      icon: <Landmark className="text-amber-400" />,
      steps: current.issues.helplinesSteps,
      helplines: banks
    },
    {
      id: 'urgent-cash',
      title: current.issues.cashHelp,
      icon: <DollarSign className="text-emerald-400" />,
      steps: current.issues.cashHelpSteps,
      helplines: []
    },
    {
      id: 'loan-help',
      title: current.issues.loanInfo,
      icon: <Landmark className="text-blue-400" />,
      steps: current.issues.loanInfoSteps,
      helplines: [
        { name: 'JanSamarth Portal', number: 'jansamarth.in' }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* View Switcher */}
      <div className="flex gap-2 glass p-1 rounded-2xl">
        <button 
          onClick={() => setViewMode('info')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'info' ? 'bg-neon-blue text-white shadow-lg' : 'text-white/40'}`}
        >
          {current.safetyInfo}
        </button>
        <button 
          onClick={() => setViewMode('budget')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'budget' ? 'bg-neon-blue text-white shadow-lg' : 'text-white/40'}`}
        >
          {current.myBudget}
        </button>
      </div>

      {viewMode === 'info' && (
        <>
          <section className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-3xl flex gap-4 items-start">
            <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
            <div>
              <p className="font-bold text-amber-200">{current.financialSafety}</p>
              <p className="text-sm text-white/60">{current.safetyTip}</p>
            </div>
          </section>

          <div className="space-y-4">
            {issues.map((issue, i) => (
              <FinanceCard key={issue.id} issue={issue} index={i} current={current} />
            ))}
          </div>
        </>
      )}

      {viewMode === 'budget' && (
        <div className="space-y-6">
          {!auth.currentUser ? (
            <div className="glass p-10 rounded-[40px] border-white/5 text-center space-y-6">
              <div className="w-20 h-20 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto">
                <PieChart size={40} className="text-neon-blue" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{current.signInTitle}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {current.signInDesc}
                </p>
              </div>
              <button 
                onClick={async () => {
                  const { signInWithGoogle } = await import('../lib/firebase');
                  await signInWithGoogle();
                }}
                className="w-full py-4 bg-neon-blue rounded-2xl font-black uppercase tracking-widest"
              >
                {current.signInBtn}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 rounded-[32px] border-emerald-500/10 bg-emerald-500/5">
              <TrendingUp className="text-emerald-400 mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">{current.totalIncome}</p>
              <p className="text-2xl font-black text-emerald-400">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="glass p-6 rounded-[32px] border-red-500/10 bg-red-500/5">
              <TrendingDown className="text-red-400 mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60">{current.totalExpense}</p>
              <p className="text-2xl font-black text-white/90">₹{totalExpense.toLocaleString()}</p>
            </div>
          </div>

          <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h3 className="font-bold">{current.recentTransactions}</h3>
              <button 
                onClick={addDummyTransaction}
                className="p-2 rounded-full bg-white/5 text-neon-blue hover:bg-neon-blue/10 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            {loading ? (
               <div className="py-10 text-center opacity-20">{current.loadingTransactions}</div>
            ) : (
              <div className="space-y-3">
                {budgetItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/40'}`}>
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.category}</p>
                        <p className="text-[10px] text-text-muted">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-black ${item.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                        {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                      </p>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {budgetItems.length === 0 && (
                  <p className="text-center py-10 text-text-muted text-sm italic">{current.addFirstTransaction}</p>
                )}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-3 items-center">
            <PieChart className="text-blue-400" size={20} />
            <p className="text-xs text-blue-200">
              {totalIncome > totalExpense 
                ? current.savingsPositive((totalIncome - totalExpense).toLocaleString())
                : current.savingsNegative}
            </p>
          </div>
        </>
      )}
      </div>
    )}
    </div>
  );
}

interface FinanceCardProps {
  issue: any;
  index: number;
  current: any;
}

const FinanceCard: React.FC<FinanceCardProps> = ({ issue, index, current }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-[32px] overflow-hidden border-white/5"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
            {issue.icon}
          </div>
          <h4 className="font-bold text-lg">{issue.title}</h4>
        </div>
        <div className={`p-2 rounded-xl transition-transform ${isOpen ? 'rotate-90 bg-white/10' : ''}`}>
          <ChevronRight size={20} className="text-white/40" />
        </div>
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 pb-6 space-y-6"
        >
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{current.stepsTitle}</p>
            {issue.steps.map((step: string, j: number) => (
              <div key={j} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-neon-blue/20 flex items-center justify-center text-[10px] font-bold text-neon-blue shrink-0">{j+1}</div>
                <p className="text-sm text-white/80">{step}</p>
              </div>
            ))}
          </div>

          {issue.helplines.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{current.helplinesTitle}</p>
              <div className="grid grid-cols-2 gap-2">
                {issue.helplines.map((h: any, k: number) => (
                  <div key={k} className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col">
                    <span className="text-[10px] text-white/40 font-bold uppercase">{h.name}</span>
                    <span className="font-bold text-sm text-neon-blue">{h.number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button className="w-full py-3 bg-red-500/10 text-red-400 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-red-500/20">
            <Lock size={16} /> {current.secureHelp}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
