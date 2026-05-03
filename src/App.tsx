/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  History, 
  Settings, 
  Mic, 
  Languages, 
  AlertCircle, 
  Plus
} from 'lucide-react';
import { AppView, Language } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Background from './components/Background';
import HomeView from './components/HomeView';
import AssistantView from './components/AssistantView';
import MedicalView from './components/MedicalView';
import GovSchemesView from './components/GovSchemesView';
import NearbyHelpView from './components/NearbyHelpView';
import TravelView from './components/TravelView';
import JobsView from './components/JobsView';
import HistoryView from './components/HistoryView';
import EmergencyView from './components/EmergencyView';
import EducationView from './components/EducationView';
import FinanceView from './components/FinanceView';
import OtherServicesView from './components/OtherServicesView';
import TasksView from './components/TasksView';
import ComplaintsView from './components/ComplaintsView';
import FraudShieldView from './components/FraudShieldView';
import RecordsView from './components/RecordsView';
import DocScannerView from './components/DocScannerView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('low_data_mode');
    if (saved) setLowDataMode(JSON.parse(saved));
    
    const timer = setTimeout(() => setIsBooting(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  const toggleLowDataMode = () => {
    const newVal = !lowDataMode;
    setLowDataMode(newVal);
    localStorage.setItem('low_data_mode', JSON.stringify(newVal));
  };

  // Page title mapping
  const titles: Record<Language, Record<AppView, string>> = {
    [Language.ENGLISH]: {
      home: 'SaarthiAI', assistant: 'AI Assistant', medical: 'Medical Help', 'gov-schemes': 'Gov Schemes',
      nearby: 'Nearby Help', travel: 'Travel Support', jobs: 'Job Finder', emergency: 'EMERGENCY',
      history: 'My History', settings: 'Settings', education: 'Education', finance: 'Finance Help',
      'other-services': 'Utilities', 'doc-scanner': 'Doc Scanner', 'fraud-shield': 'Fraud Shield',
      complaints: 'Complaint Writer', tasks: 'My Tasks', records: 'My Records'
    },
    [Language.HINDI]: {
      home: 'सारथी एआई', assistant: 'एआई सहायक', medical: 'चिकित्सा सहायता', 'gov-schemes': 'सरकारी योजना',
      nearby: 'नजदीकी मदद', travel: 'यात्रा सहायता', jobs: 'नौकरी खोजक', emergency: 'आपातकाल',
      history: 'मेरा इतिहास', settings: 'सेटििंग्स', education: 'शिक्षा', finance: 'वित्त सहायता',
      'other-services': 'अन्य सेवाएं', 'doc-scanner': 'डॉक स्कैनर', 'fraud-shield': 'फ्रॉड शील्ड',
      complaints: 'शिकायत लेखक', tasks: 'मेरे कार्य', records: 'मेरे रिकॉर्ड'
    },
    [Language.KANNADA]: {
      home: 'ಸಾರಥಿ ಎಐ', assistant: 'ಎಐ ಸಹಾಯಕ', medical: 'ವೈದ್ಯಕೀಯ ಸಹಾಯ', 'gov-schemes': 'ಸರ್ಕಾರಿ ಯೋಜನೆ',
      nearby: 'ಹತ್ತಿರದ ಸಹಾಯ', travel: 'ಪ್ರಯಾಣ ಬೆಂಬಲ', jobs: 'ಉದ್ಯೋಗ ಹುಡುಕಾಟ', emergency: 'ತುರ್ತು',
      history: 'ನನ್ನ ಇತಿಹಾಸ', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', education: 'ಶಿಕ್ಷಣ', finance: 'ಹಣಕಾಸು ಸಹಾಯ',
      'other-services': 'ಇತರ ಸೇವೆಗಳು', 'doc-scanner': 'ಡಾಕ್ ಸ್ಕ್ಯಾನರ್', 'fraud-shield': 'ವಂಚನೆ ತಡೆ',
      complaints: 'ದೂರು ಬರಹಗಾರ', tasks: 'ನನ್ನ ಕಾರ್ಯಗಳು', records: 'ನನ್ನ ದಾಖಲೆಗಳು'
    },
    [Language.TELUGU]: {
      home: 'సారథి AI', assistant: 'AI సహాయకుడు', medical: 'వైద్య సహాయం', 'gov-schemes': 'ప్రభుత్వ పథకాలు',
      nearby: 'సమీప సహాయం', travel: 'ప్రయాణ మద్దతు', jobs: 'ఉద్యోగ అన్వేషణ', emergency: 'అత్యవసర పరిస్థితి',
      history: 'నా చరిత్ర', settings: 'సెట్టింగులు', education: 'విద్య', finance: 'ఆర్థిక సహాయం',
      'other-services': 'ఇతర సేవలు', 'doc-scanner': 'డాక్ స్కానర్', 'fraud-shield': 'మోసం రక్షణ',
      complaints: 'ఫిర్యాదు రచయిత', tasks: 'నా పనులు', records: 'నా రికార్డులు'
    },
    [Language.TAMIL]: {
      home: 'சாரதி AI', assistant: 'AI உதவியாளர்', medical: 'மருத்துவ உதவி', 'gov-schemes': 'அரசு திட்டங்கள்',
      nearby: 'அருகிலுள்ள உதவி', travel: 'பயண ஆதரவு', jobs: 'வேலை தேடுபவர்', emergency: 'அவசரநிலை',
      history: 'எனது வரலாறு', settings: 'அமைப்புகள்', education: 'கல்வி', finance: 'நிதியுதவி',
      'other-services': 'பிற சேவைகள்', 'doc-scanner': 'ஆவண ஸ்கேனர்', 'fraud-shield': 'மோசடி பாதுகாப்பு',
      complaints: 'புகார் எழுத்தாளர்', tasks: 'எனது பணிகள்', records: 'எனது பதிவுகள்'
    },
    [Language.BENGALI]: {
      home: 'সাথী AI', assistant: 'AI সহকারী', medical: 'চিকিৎসা সাহায্য', 'gov-schemes': 'সরকারি প্রকল্প',
      nearby: 'কাছাকাছি সাহায্য', travel: 'ভ্রমণ সহায়তা', jobs: 'চাকরি সন্ধান', emergency: 'জরুরি অবস্থা',
      history: 'আমার ইতিহাস', settings: 'সেটিংস', education: 'শিক্ষা', finance: 'আর্থিক সাহায্য',
      'other-services': 'অন্যান্য পরিষেবা', 'doc-scanner': 'ডক স্ক্যানার', 'fraud-shield': 'জালিয়াতি সুরক্ষা',
      complaints: 'অভিযোগ লেখক', tasks: 'আমার কাজ', records: 'আমার রেকর্ড'
    }
  };

  const navTranslations: Record<Language, any> = {
    [Language.ENGLISH]: { home: 'Home', history: 'History', help: 'Help', settings: 'Settings', loginTitle: 'Login with Google to Save Data', comingSoon: 'Coming Soon', biometric: 'Biometric Authentication', biometricDesc: 'Require Fingerprint/Face ID to open app', fraudPro: 'Advanced Fraud Protection', fraudProDesc: 'Real-time message & call analysis', appSettings: 'App Settings', emergency: 'Emergency', logout: 'Logout', lowData: 'Low Data Mode', lowDataDesc: 'Optimized for low internet' },
    [Language.HINDI]: { home: 'होम', history: 'इतिहास', help: 'मदद', settings: 'सेटिंग्स', loginTitle: 'डेटा बचाने के लिए गूगल से लॉगिन करें', comingSoon: 'जल्द आ रहा है', biometric: 'बायोमेट्रिक प्रमाणीकरण', biometricDesc: 'ऐप खोलने के लिए फिंगरप्रिंट/फेस आईडी की आवश्यकता है', fraudPro: 'उन्नत धोखाधड़ी सुरक्षा', fraudProDesc: 'रीयल-टाइम संदेश और कॉल विश्लेषण', appSettings: 'ऐप सेटिंग्स', emergency: 'आपातकाल', logout: 'लॉगआउट', lowData: 'लो डेटा मोड', lowDataDesc: 'कम इंटरनेट के लिए' },
    [Language.KANNADA]: { home: 'ಮನೆ', history: 'ಇತಿಹಾಸ', help: 'ಸಹಾಯ', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', loginTitle: 'ಡೇಟಾ ಉಳಿಸಲು ಗೂಗಲ್‌ನೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ', comingSoon: 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ', biometric: 'ಬಯೋಮೆಟ್ರಿಕ್ ದೃಢೀಕರಣ', biometricDesc: 'ಅಪ್ಲಿಕೇಶನ್ ತೆರೆಯಲು ಫಿಂಗರ್‌ಪ್ರಿಂಟ್/ಫೇಸ್ ಐಡಿ ಅಗತ್ಯವಿದೆ', fraudPro: 'ಸುಧಾರಿತ ವಂಚನೆ ರಕ್ಷಣೆ', fraudProDesc: 'ನೈಜ-ಸಮಯದ ಸಂದೇಶ ಮತ್ತು ಕರೆ ವಿಶ್ಲೇಷಣೆ', appSettings: 'ಅಪ್ಲಿಕೇಶನ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು', emergency: 'ತುರ್ತು', logout: 'ಲಾಗ್ ಔಟ್', lowData: 'ಕಡಿಮೆ ಡೇಟಾ ಮೋಡ್', lowDataDesc: 'ಕಡಿಮೆ ಇಂಟರ್ನೆಟ್‌ಗಾಗಿ' },
    [Language.TELUGU]: { home: 'హోమ్', history: 'చరిత్ర', help: 'సహాయం', settings: 'సెట్టింగులు', loginTitle: 'డేటాను సేవ్ చేయడానికి గూగుల్‌తో లాగిన్ అవ్వండి', comingSoon: 'త్వరలో వస్తుంది', biometric: 'బయోమెట్రిక్ ప్రామాణీకరణ', biometricDesc: 'యాప్‌ను తెరవడానికి ఫింగర్‌ప్రింట్/ఫేస్ ఐడి అవసరం', fraudPro: 'అధునాతన మోసం రక్షణ', fraudProDesc: 'నిజ-సమయ సందేశం & కాల్ విశ్లేషణ', appSettings: 'యాప్ సెట్టింగులు', emergency: 'అత్యవసర', logout: 'లాగ్ అవుట్', lowData: 'తక్కువ డేటా మోడ్', lowDataDesc: 'తక్కువ ఇంటర్నెట్ కోసం' },
    [Language.TAMIL]: { home: 'முகப்பு', history: 'வரலாறு', help: 'உதவி', settings: 'அமைப்புகள்', loginTitle: 'தரவைச் சேமிக்க கூகிள் மூலம் உள்நுழையவும்', comingSoon: 'விரைவில் வரும்', biometric: 'பயோமெட்ரிக் அங்கீகாரம்', biometricDesc: 'பயன்பாட்டைத் திறக்க கைரேகை/முக அடையாளத்தை கோரவும்', fraudPro: 'மேம்பட்ட மோசடி பாதுகாப்பு', fraudProDesc: 'நிகழ்நேர செய்தி மற்றும் அழைப்பு பகுப்பாய்வு', appSettings: 'பயன்பாட்டு அமைப்புகள்', emergency: 'அவசரம்', logout: 'வெளியేறு', lowData: 'குறைந்த தரவு முறை', lowDataDesc: 'குறைந்த இணையத்திற்கு' },
    [Language.BENGALI]: { home: 'হোম', history: 'ইতিহাস', help: 'সাহায্য', settings: 'সেটিংস', loginTitle: 'ডেটা সংরক্ষণ করতে গুগল দিয়ে লগইন করুন', comingSoon: 'শীঘ্রই আসছে', biometric: 'বায়োমেট্রিক প্রমাণীকরণ', biometricDesc: 'অ্যাপ খুলতে ফিঙ্গারপ্রিন্ট/ফেস আইডি প্রয়োজন', fraudPro: 'উন্নত জালিয়াতি সুরক্ষা', fraudProDesc: 'রিয়েল-টাইম মেসেজ এবং কল বিশ্লেষণ', appSettings: 'অ্যাপ সেটিংস', emergency: 'জরুরি', logout: 'লগআউট', lowData: 'লো ডেটা মোড', lowDataDesc: 'কম ইন্টারনেটের জন্য' }
  };

  const nav = navTranslations[language];

  const addToHistory = (item: any) => {
    setHistory(prev => [{ id: Date.now().toString(), ...item, timestamp: Date.now() }, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView setView={setCurrentView} language={language} />;
      case 'assistant': return <AssistantView language={language} addToHistory={addToHistory} />;
      case 'medical': return <MedicalView language={language} />;
      case 'gov-schemes': return <GovSchemesView language={language} />;
      case 'nearby': return <NearbyHelpView language={language} />;
      case 'travel': return <TravelView language={language} />;
      case 'jobs': return <JobsView language={language} />;
      case 'emergency': return <EmergencyView language={language} />;
      case 'history': return <HistoryView history={history} language={language} />;
      case 'education': return <EducationView language={language} />;
      case 'finance': return <FinanceView language={language} />;
      case 'other-services': return <OtherServicesView setView={setCurrentView} language={language} />;
      case 'tasks': return <TasksView language={language} />;
      case 'complaints': return <ComplaintsView language={language} />;
      case 'doc-scanner': return <DocScannerView onBack={() => setCurrentView('other-services')} language={language} />;
      case 'records': return <RecordsView onBack={() => setCurrentView('other-services')} language={language} />;
      case 'fraud-shield': return <FraudShieldView onBack={() => setCurrentView('other-services')} language={language} />;
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="glass p-8 rounded-[40px] border-white/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="text-neon-purple" />
                {nav.appSettings}
              </h2>
              <div className="space-y-4">
                <button 
                  onClick={toggleLowDataMode}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 w-full text-left"
                >
                  <div>
                    <p className="font-bold">{nav.lowData}</p>
                    <p className="text-xs text-text-muted">{nav.lowDataDesc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${lowDataMode ? 'bg-neon-blue' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${lowDataMode ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-bold">{nav.fraudPro}</p>
                    <p className="text-xs text-text-muted">{nav.fraudProDesc}</p>
                  </div>
                  <div className="w-12 h-6 bg-neon-blue rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
                </div>

                <div className="pt-6">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                            <Plus size={20} />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-sm tracking-tight">{user.displayName || 'Saarthi User'}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{user.email}</p>
                        </div>
                        <button 
                          onClick={async () => {
                            const { logout } = await import('./lib/firebase');
                            await logout();
                          }}
                          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                        >
                          {nav.logout}
                        </button>
                      </div>
                      <p className="text-[10px] text-center text-white/20 uppercase tracking-[0.2em]">Cloud Sync Active</p>
                    </div>
                  ) : (
                    <button 
                      onClick={async () => {
                        const { signInWithGoogle } = await import('./lib/firebase');
                        try {
                          await signInWithGoogle();
                        } catch (err) {
                          console.error("Login failed", err);
                        }
                      }}
                      className="w-full py-4 bg-neon-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-neon-blue/20 flex items-center justify-center gap-2"
                    >
                      {nav.loginTitle}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      default: return <div className="text-center py-20 text-text-muted">{nav.comingSoon}</div>;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`relative min-h-screen text-white font-sans selection:bg-blue-500/30 ${lowDataMode ? 'low-data' : ''}`}>
      <AnimatePresence mode="wait">
        {isBooting ? (
          <BootSequence key="boot" />
        ) : (
          <motion.div
            key="app"
            initial={{ y: "-100%", skewY: 5, opacity: 0 }}
            animate={{ y: 0, skewY: 0, opacity: 1 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.8 } 
            }}
            className="flex-1"
          >
            {!lowDataMode && <Background />}
            
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 bg-[#020617]/40 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('home')}>
                <h1 className="text-2xl md:text-3xl font-black tracking-tighter bg-linear-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent font-display">
                  SAARTHIAI
                </h1>
                {currentView !== 'home' && (
                  <div className="hidden md:flex items-center gap-2 text-xs font-black uppercase text-white/20 tracking-widest font-display">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    {titles[language][currentView]}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setLanguage(prev => {
                    const langs = Object.values(Language);
                    const currentIndex = langs.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % langs.length;
                    return langs[nextIndex] as Language;
                  })}
                  className="px-4 py-1.5 rounded-full text-xs font-medium glass hover:bg-white/10 transition-all font-mono"
                >
                  {language === Language.ENGLISH ? 'English' : 
                   language === Language.HINDI ? 'हिन्दी' : 
                   language === Language.KANNADA ? 'ಕನ್ನಡ' :
                   language === Language.TELUGU ? 'తెలుగు' :
                   language === Language.TAMIL ? 'தமிழ்' : 'বাংলা'}
                </button>

                <button 
                  onClick={() => setCurrentView('settings')}
                  className="p-2 rounded-full glass hover:bg-white/10 transition-all"
                >
                  <Settings size={18} className="text-white/70" />
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-28 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Voice Assistant Float Bubble (Home Only) */}
            {currentView === 'home' && (
              <motion.div 
                initial={{ scale: 0, y: 50 }} 
                animate={{ scale: 1, y: 0 }}
                className="fixed bottom-28 right-8 z-40 hidden md:block"
              >
                <button 
                  onClick={() => setCurrentView('assistant')}
                  className="w-20 h-20 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-white/20 hover:scale-110 transition-transform"
                >
                  <Mic size={32} className="text-white" />
                </button>
              </motion.div>
            )}

            {/* Bottom Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-[#020617]/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-8">
              <NavItem 
                icon={<Home size={22} />} 
                label={nav.home} 
                active={currentView === 'home'} 
                onClick={() => setCurrentView('home')} 
              />
              <NavItem 
                icon={<AlertCircle size={22} />} 
                label={nav.emergency} 
                active={currentView === 'emergency'} 
                onClick={() => setCurrentView('emergency')} 
                danger
              />
              <NavItem 
                icon={<History size={22} />} 
                label={nav.history} 
                active={currentView === 'history'} 
                onClick={() => setCurrentView('history')} 
              />
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BootSequence() {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const sequence = [
      ">_ mnt/saarthi/core",
      ">_ establishing quantum-secure link...",
      ">_ localized_engine.load_all([EN, HI, KN, TE, TA, BN])",
      ">_ sync.global_db(priority: high)",
      ">_ user_profile.decrypt()",
      ">_ [SUCCESS] system live."
    ];
    
    let current = 0;
    const interval = setInterval(() => {
      if (current < sequence.length) {
        setLogs(prev => [...prev, sequence[current]]);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 350);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        y: "100%",
        skewY: -5,
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative mb-16">
        {/* Outer Pulsing Glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-neon-blue rounded-full blur-[80px]"
        />

        {/* HUD Elements */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-[-40px] rounded-full border border-dashed ${i === 0 ? 'border-neon-blue/40' : i === 1 ? 'border-neon-purple/30 inset-[-60px]' : 'border-white/10 inset-[-80px]'}`}
          />
        ))}

        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 rounded-full border-t border-l border-neon-blue/60"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-full border-b border-r border-neon-purple/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <h2 className="text-5xl font-black tracking-tighter bg-linear-to-br from-white via-neon-blue to-neon-purple bg-clip-text text-transparent font-display italic">
                S
              </h2>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-sm px-4 space-y-3 font-mono text-[9px] uppercase tracking-[0.2em]">
        <div className="flex flex-col gap-1.5 min-h-[100px]">
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2 ${i === logs.length - 1 ? 'text-neon-blue font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'text-white/40'}`}
            >
              <span className="w-1.5 h-1.5 bg-current rounded-full" />
              {log}
            </motion.div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: "linear" }}
            className="absolute inset-0 bg-linear-to-r from-neon-purple to-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        </div>
        <div className="flex justify-between items-center text-[8px] text-white/20 font-mono">
          <span>SECURE_BOOT_v2.0.4</span>
          <span>SYSTEM_STABLE</span>
        </div>
      </div>
    </motion.div>
  );
}

function NavItem({ icon, label, active, onClick, danger }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all relative ${
        active ? (danger ? 'text-red-400' : 'text-neon-purple font-medium') : 'text-text-muted hover:text-white/70'
      }`}
    >
      <div className={`p-2 transition-all ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-[0.1em]">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className={`w-1 h-1 rounded-full mt-1 ${danger ? 'bg-red-400' : 'bg-neon-purple shadow-[0_0_8px_rgba(168,85,247,0.8)]'}`}
        />
      )}
    </button>
  );
}
