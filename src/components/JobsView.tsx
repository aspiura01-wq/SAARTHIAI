import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, FileUser, Lightbulb, GraduationCap, MapPin, Search, ChevronRight, ArrowLeft, CheckCircle, Target, Sparkles, Map } from 'lucide-react';
import { Language } from '../types';

export default function JobsView({ language }: { language: Language }) {
  const [activeTab, setActiveTab] = useState<'near' | 'resume' | 'skills'>('near');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      nearbyJobs: 'Nearby Jobs',
      resumeScore: 'Resume Score',
      skillsList: 'Skills List',
      searchPlaceholder: 'Search by role or location...',
      findingJobs: 'Finding jobs near your current location',
      backToJobs: 'Back to Jobs',
      salary: 'Salary',
      loc: 'Location',
      aboutRole: 'About the Role',
      requirements: 'Requirements',
      applyNow: 'Apply Now',
      getOfficeLoc: 'Get Office Location',
      resumeTitle: 'Resume SEO Checker',
      resumeDesc: 'Upload your resume to see your score and get tips to improve visibility for HRs.',
      analyzing: 'Analyzing Skills & Experience...',
      jobMatch: 'Job Match',
      tipsTitle: 'Improvement Tips:',
      tips: [
        'Add more keyword related to "Admin Support"',
        'Mention specific tools like "MS Excel" or "Tally"',
        'Keep your mobile number visible at top'
      ],
      scanAnother: 'Scan Another',
      uploadBtn: 'Upload Resume Photo',
      tipLabel: 'TIP:',
      tipDesc: 'Keep your Aadhaar and Bank details ready for faster job applications.',
      month: 'mo',
      learnSteps: 'Learn steps'
    },
    [Language.HINDI]: {
      nearbyJobs: 'आस-पास की नौकरियां',
      resumeScore: 'रिज्यूमे स्कोर',
      skillsList: 'कौशल सूची',
      searchPlaceholder: 'भूमिका या स्थान के आधार पर खोजें...',
      findingJobs: 'आपके वर्तमान स्थान के पास नौकरियां ढूंढ रहे हैं',
      backToJobs: 'नौकरियों पर वापस जाएं',
      salary: 'वेतन',
      loc: 'स्थान',
      aboutRole: 'भूमिका के बारे में',
      requirements: 'आवश्यकताएं',
      applyNow: 'अभी आवेदन करें',
      getOfficeLoc: 'कार्यालय स्थान प्राप्त करें',
      resumeTitle: 'रिज्यूमे SEO चेकर',
      resumeDesc: 'अपना स्कोर देखने और HR के लिए दृश्यता में सुधार के सुझाव पाने के लिए अपना रिज्यूमे अपलोड करें।',
      analyzing: 'कौशल और अनुभव का विश्लेषण कर रहे हैं...',
      jobMatch: 'जॉब मैच',
      tipsTitle: 'सुधार के सुझाव:',
      tips: [
        '"एडमिन सपोर्ट" से संबंधित अधिक कीवर्ड जोड़ें',
        '"MS Excel" या "Tally" जैसे विशिष्ट उपकरणों का उल्लेख करें',
        'अपना मोबाइल नंबर सबसे ऊपर रखें'
      ],
      scanAnother: 'दूसरा स्कैन करें',
      uploadBtn: 'रिज्यूमे फोटो अपलोड करें',
      tipLabel: 'सुझाव:',
      tipDesc: 'तेजी से नौकरी के आवेदकों के लिए अपने आधार और बैंक विवरण तैयार रखें।',
      month: 'माह',
      learnSteps: 'कदम सीखें'
    },
    [Language.KANNADA]: {
      nearbyJobs: 'ಹತ್ತಿರದ ಉದ್ಯೋಗಗಳು',
      resumeScore: 'ರೆಸ್ಯೂಮೆ ಸ್ಕೋರ್',
      skillsList: 'ಕೌಶಲ್ಯಗಳ ಪಟ್ಟಿ',
      searchPlaceholder: 'ಪಾತ್ರ ಅಥವಾ ಸ್ಥಳದ ಮೂಲಕ ಹುಡುಕಿ...',
      findingJobs: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳದ ಸಮೀಪವಿರುವ ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ',
      backToJobs: 'ಉದ್ಯೋಗಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
      salary: 'ಸಂಬಳ',
      loc: 'ಸ್ಥಳ',
      aboutRole: 'ಪಾತ್ರದ ಬಗ್ಗೆ',
      requirements: 'ಅಗತ್ಯತೆಗಳು',
      applyNow: 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
      getOfficeLoc: 'ಕಚೇರಿ ಸ್ಥಳವನ್ನು ಪಡೆಯಿರಿ',
      resumeTitle: 'ರೆಸ್ಯೂಮೆ SEO ಚೆಕ್ಕರ್',
      resumeDesc: 'ನಿಮ್ಮ ಸ್ಕೋರ್ ನೋಡಲು ಮತ್ತು ಎಚ್‌ಆರ್‌ಗಳಿಗೆ ಗೋಚರತೆಯನ್ನು ಸುಧಾರಿಸಲು ಸಲಹೆಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ರೆಸ್ಯೂಮೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      analyzing: 'ಕೌಶಲ್ಯ ಮತ್ತು ಅನುಭವವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      jobMatch: 'ಉದ್ಯೋಗದ ಹೊಂದಾಣಿಕೆ',
      tipsTitle: 'ಸುಧಾರಣೆಯ ಸಲಹೆಗಳು:',
      tips: [
        '"ಅಡ್ಮಿನ್ ಸಪೋರ್ಟ್" ಗೆ ಸಂಬಂಧಿಸಿದ ಹೆಚ್ಚಿನ ಕೀವರ್ಡ್ ಸೇರಿಸಿ',
        '"MS Excel" ಅಥವಾ "Tally" ನಂತಹ ನಿರ್ದಿಷ್ಟ ಪರಿಕರಗಳನ್ನು ಉಲ್ಲೇಖಿಸಿ',
        'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಮೇಲ್ಭಾಗದಲ್ಲಿರಿಸಿ'
      ],
      scanAnother: 'ಇನ್ನೊಂದನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
      uploadBtn: 'ರೆಸ್ಯೂಮೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      tipLabel: 'ಸಲಹೆ:',
      tipDesc: 'ವೇಗವಾಗಿ ಉದ್ಯೋಗ ಅರ್ಜಿಗಳಿಗಾಗಿ ನಿಮ್ಮ ಆಧಾರ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ.',
      month: 'ತಿಂಗಳಿಗೆ',
      learnSteps: 'ಹಂತಗಳನ್ನು ಕಲಿಯಿರಿ'
    },
    [Language.TELUGU]: {
      nearbyJobs: 'సమీపంలోని ఉద్యోగాలు',
      resumeScore: 'రెజ్యూమ్ స్కోర్',
      skillsList: 'నైపుణ్యాల జాబితా',
      searchPlaceholder: 'పాత్ర లేదా స్థానం ఆధారంగా శోధించండి...',
      findingJobs: 'మీ ప్రస్తుత స్థానానికి సమీపంలో ఉద్యోగాలను కనుగొంటోంది',
      backToJobs: 'తిరిగి ఉద్యోగాలకు',
      salary: 'జీతం',
      loc: 'స్థానం',
      aboutRole: 'పాత్ర గురించి',
      requirements: 'అవసరాలు',
      applyNow: 'ఇప్పుడే దరఖాస్తు చేసుకోండి',
      getOfficeLoc: 'ఆఫీస్ లొకేషన్ పొందండి',
      resumeTitle: 'రెజ్యూమ్ SEO చెకర్',
      resumeDesc: 'మీ స్కోర్‌ను చూడటానికి మరియు HRలకు కనిపించేలా మెరుగుపరచుకోవడానికి మీ రెజ్యూమ్‌ను అప్‌లోడ్ చేయండి.',
      analyzing: 'నైపుణ్యాలు & అనుభవాన్ని విశ్లేషిస్తోంది...',
      jobMatch: 'ఉద్యోగ సరిపోలిక',
      tipsTitle: 'మెరుగుదల చిట్కాలు:',
      tips: [
        '"అడ్మిన్ సపోర్ట్" కి సంబంధించిన మరిన్ని కీలక పదాలను జోడించండి',
        '"MS Excel" లేదా "Tally" వంటి నిర్దిష్ట సాధనాలను పేర్కొనండి',
        'మీ మొబైల్ నంబర్‌ను పైన కనిపించేలా ఉంచండి'
      ],
      scanAnother: 'మరొకటి స్కాన్ చేయండి',
      uploadBtn: 'రెజ్యూమ్ ఫోటోను అప్‌లోడ్ చేయండి',
      tipLabel: 'చిట్కా:',
      tipDesc: 'వేగవంతమైన ఉద్యోగ దరఖాస్తుల కోసం మీ ఆధార్ మరియు బ్యాంక్ వివరాలను సిద్ధంగా ఉంచుకోండి.',
      month: 'నెలకు',
      learnSteps: 'దశలను నేర్చుకోండి'
    },
    [Language.TAMIL]: {
      nearbyJobs: 'அருகிலுள்ள வேலைகள்',
      resumeScore: 'ரெஸ்யூம் மதிப்பெண்',
      skillsList: 'திறன்களின் பட்டியல்',
      searchPlaceholder: 'பணி அல்லது இருப்பிடம் மூலம் தேடுங்கள்...',
      findingJobs: 'உங்கள் தற்போதைய இருப்பிடத்திற்கு அருகிலுள்ள வேலைகளைக் கண்டறிதல்',
      backToJobs: 'வேலைகளுக்குத் திரும்பு',
      salary: 'சம்பளம்',
      loc: 'இருப்பிடம்',
      aboutRole: 'பணியைப் பற்றி',
      requirements: 'தேவைகள்',
      applyNow: 'இப்பொழுதே விண்ணப்பிக்கவும்',
      getOfficeLoc: 'அலுவலக இருப்பிடத்தைப் பெறவும்',
      resumeTitle: 'ரெஸ்யூம் எஸ்சிஓ செக்கர்',
      resumeDesc: 'உங்கள் மதிப்பெண்ணைப் பார்க்கவும், எச்ஆர்களுக்கான பார்வைத்திறனை மேம்படுத்த குறிப்புகளைப் பெறவும் உங்கள் ரெஸ்யூமைப் பதிவேற்றவும்.',
      analyzing: 'திறன்கள் மற்றும் அனுபவத்தை ஆய்வு செய்தல்...',
      jobMatch: 'வேலை பொருத்தம்',
      tipsTitle: 'மேம்படுத்தல் குறிப்புகள்:',
      tips: [
        '"நிர்வாக ஆதரவு" தொடர்பான கூடுதல் முக்கிய வார்த்தைகளைச் சேர்க்கவும்',
        '"MS Excel" அல்லது "Tally" போன்ற குறிப்பிட்ட கருவிகளைக் குறிப்பிடவும்',
        'உங்கள் மொபைல் எண்ணை மேலே தெரியும் படி வைக்கவும்'
      ],
      scanAnother: 'மற்றொன்றை ஸ்கேன் செய்யவும்',
      uploadBtn: 'ரெஸ்யூம் புகைப்படத்தைப் பதிவேற்றவும்',
      tipLabel: 'குறிப்பு:',
      tipDesc: 'வேகமான வேலை விண்ணப்பங்களுக்கு உங்கள் ஆதார் மற்றும் வங்கி விவரங்களைத் தயாராக வைத்திருக்கவும்.',
      month: 'மாதம்',
      learnSteps: 'படிகளைக் கற்றுக்கொள்ளுங்கள்'
    },
    [Language.BENGALI]: {
      nearbyJobs: 'কাছাকাছি চাকরি',
      resumeScore: 'রিজিউম স্কোর',
      skillsList: 'দক্ষতার তালিকা',
      searchPlaceholder: 'পদ বা অবস্থান অনুসারে খুঁজুন...',
      findingJobs: 'আপনার বর্তমান অবস্থানের কাছে চাকরি খোঁজা হচ্ছে',
      backToJobs: 'চাকরিগুলোতে ফিরে যান',
      salary: 'বেতন',
      loc: 'অবস্থান',
      aboutRole: 'পদ সম্পর্কে',
      requirements: 'প্রয়োজনীয়তা',
      applyNow: 'এখনই আবেদন করুন',
      getOfficeLoc: 'অফিস লোকেশন দেখুন',
      resumeTitle: 'রিজিউম এসইও চেকার',
      resumeDesc: 'আপনার স্কোর দেখতে এবং এইচআর-এর কাছে দৃশ্যমানতা উন্নত করার টিপস পেতে আপনার রিজিউম আপলোড করুন।',
      analyzing: 'দক্ষতা এবং অভিজ্ঞতা বিশ্লেষণ করা হচ্ছে...',
      jobMatch: 'জব ম্যাচ',
      tipsTitle: 'উন্নতির টিপস:',
      tips: [
        '"অ্যাডমিন সাপোর্ট" সম্পর্কিত আরও কিওয়ার্ড যোগ করুন',
        '"MS Excel" বা "Tally" এর মতো নির্দিষ্ট সরঞ্জাম উল্লেখ করুন',
        'আপনার মোবাইল নম্বরটি উপরে দৃশ্যমান রাখুন'
      ],
      scanAnother: 'অন্যটি স্ক্যান করুন',
      uploadBtn: 'রিজিউম ফটো আপলোড করুন',
      tipLabel: 'টিপ:',
      tipDesc: 'দ্রুত চাকরির আবেদনের জন্য আপনার আধার এবং ব্যাঙ্কের বিবরণ প্রস্তুত রাখুন।',
      month: 'মাস',
      learnSteps: 'ধাপগুলো শিখুন'
    }
  };

  const current = translations[language];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const jobs = [
    { id: 1, title: 'Office Assistant', location: 'Okhla, Delhi', type: 'Full-time', salary: '₹15,000 - ₹20,000', company: 'TechSolutions Pvt Ltd', desc: 'Need basic computer knowledge and typing skills. Minimum 10th pass.', requirements: ['Typing', 'Excel', 'English'], mapUrl: 'https://goo.gl/maps/example1' },
    { id: 2, title: 'Delivery Partner', location: 'South Delhi', type: 'Flexible', salary: '₹12,000 + Incentive', company: 'FastDash Delivery', desc: 'Must have a bike and valid driving license. Good local knowledge.', requirements: ['License', 'Smart Phone', 'Punctuality'], mapUrl: 'https://goo.gl/maps/example2' },
    { id: 3, title: 'Customer Support', location: 'Gurgaon', type: 'Full-time', salary: '₹18,000', company: 'Global Services', desc: 'Good communication skills in Hindi and basic English.', requirements: ['Hindi', 'Communication', 'Listening'], mapUrl: 'https://goo.gl/maps/example3' },
  ];

  const handleResumeUpload = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 30) + 65); // Random score between 65 and 95
      setIsScanning(false);
    }, 2000);
  };

  const renderJobDetails = (job: any) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-text-muted hover:text-white transition-all text-sm mb-4">
        <ArrowLeft size={16} /> {current.backToJobs}
      </button>

      <div className="glass p-8 rounded-[40px] border-emerald-500/20 space-y-6">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">{job.type}</span>
          <h3 className="text-3xl font-bold">{job.title}</h3>
          <p className="text-emerald-400 font-bold">{job.company}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-[10px] text-white/40 uppercase font-black mb-1">{current.salary}</p>
             <p className="font-bold">{job.salary}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-[10px] text-white/40 uppercase font-black mb-1">{current.loc}</p>
             <p className="font-bold">{job.location}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold">{current.aboutRole}</h4>
          <p className="text-sm text-text-muted leading-relaxed">{job.desc}</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold">{current.requirements}</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((r: string, i: number) => (
              <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-xs font-medium border border-white/10">{r}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">{current.applyNow}</button>
          <button 
            onClick={() => window.open(job.mapUrl, '_blank')}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Map size={18} /> {current.getOfficeLoc}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {selectedJob ? renderJobDetails(selectedJob) : (
        <>
          <div className="flex gap-2 glass p-1 rounded-2xl mb-6">
            <button onClick={() => setActiveTab('near')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'near' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40'}`}>{current.nearbyJobs}</button>
            <button onClick={() => setActiveTab('resume')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'resume' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40'}`}>{current.resumeScore}</button>
            <button onClick={() => setActiveTab('skills')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'skills' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40'}`}>{current.skillsList}</button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'near' && (
              <motion.div key="near" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-4 text-white/40" size={20} />
                  <input type="text" placeholder={current.searchPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/50 transition-colors" />
                </div>

                {location && (
                   <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-emerald-400">
                     <MapPin size={12} /> {current.findingJobs}
                   </div>
                )}

                <div className="space-y-4">
                  {jobs.map((job, j) => (
                    <motion.div 
                      key={job.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: j * 0.1 }}
                      onClick={() => setSelectedJob(job)}
                      className="p-5 rounded-[32px] glass border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex-1">
                        <h5 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{job.title}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-white/60">{job.company}</p>
                          <div className="w-1 h-1 bg-white/20 rounded-full" />
                          <p className="text-xs text-white/60 italic">{job.location}</p>
                        </div>
                        <p className="text-emerald-400 font-bold text-sm mt-3">{job.salary} / {current.month}</p>
                      </div>
                      <ChevronRight className="text-white/20 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={24} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'resume' && (
              <motion.div key="resume" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass p-10 rounded-[40px] border-emerald-500/20 text-center space-y-6">
                   <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20">
                      <FileUser size={48} className="text-emerald-500" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-2xl font-bold">{current.resumeTitle}</h3>
                     <p className="text-text-muted text-sm leading-relaxed">{current.resumeDesc}</p>
                   </div>
                   
                   {isScanning ? (
                     <div className="py-4 space-y-3">
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-emerald-500" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">{current.analyzing}</p>
                     </div>
                   ) : score ? (
                     <div className="space-y-6">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 p-4">
                           <div className="text-center">
                              <p className="text-3xl font-black text-emerald-500">{score}%</p>
                              <p className="text-[8px] font-black uppercase tracking-widest">{current.jobMatch}</p>
                           </div>
                        </div>
                        <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 text-left space-y-2 text-xs">
                           <p className="font-bold flex items-center gap-2"><Sparkles size={14} className="text-emerald-400" /> {current.tipsTitle}</p>
                           <ul className="space-y-1 text-white/60 leading-relaxed">
                              {current.tips.map((tip: string, idx: number) => (
                                <li key={idx}>• {tip}</li>
                              ))}
                           </ul>
                        </div>
                        <button onClick={() => setScore(null)} className="text-xs text-white/20 hover:text-white transition-all underline">{current.scanAnother}</button>
                     </div>
                   ) : (
                     <button onClick={handleResumeUpload} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">{current.uploadBtn}</button>
                   )}
                </div>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { name: 'Computer Basics', level: 'Beginner', market: 'High Demand', color: 'bg-emerald-500' },
                    { name: 'Data Entry', level: 'Intermediate', market: 'Stable', color: 'bg-blue-500' },
                    { name: 'Communication', level: 'Essential', market: 'Critical', color: 'bg-amber-500' },
                    { name: 'Accounting', level: 'Professional', market: 'High Paying', color: 'bg-purple-500' },
                    { name: 'Digital Marketing', level: 'Modern', market: 'Growing', color: 'bg-pink-500' },
                  ].map((skill, k) => (
                    <motion.div key={k} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.05 }} className="p-5 rounded-[32px] glass border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${skill.color}/10 flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform`}>
                          <GraduationCap size={24} className={skill.color.replace('bg-', 'text-')} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{skill.name}</h4>
                          <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{skill.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${skill.color.replace('bg-', 'text-')}`}>{skill.market}</p>
                        <button className="text-[10px] text-white/40 hover:text-white transition-all underline">{current.learnSteps}</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-amber-200">
            <Lightbulb className="shrink-0" size={20} />
            <p className="text-xs font-medium leading-relaxed">{current.tipLabel} {current.tipDesc}</p>
          </div>
        </>
      )}
    </div>
  );
}
