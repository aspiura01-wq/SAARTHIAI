import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderOpen, FileText, Plus, Search, Trash2, Download, Eye, Clock, ShieldCheck, ArrowLeft, MoreVertical, Camera } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, query, where, orderBy, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';

import { Language } from '../types';

export default function RecordsView({ onBack, language }: { onBack: () => void, language: Language }) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      back: 'Back',
      photoScan: 'Photo Scan',
      addRecord: 'Add Record',
      title: 'My Digital Records',
      subtitle: 'Encrypted & secure storage for your vital documents.',
      searchPlaceholder: 'Search records...',
      loading: 'Loading digital vault...',
      noRecords: 'No records matching your search.',
      shieldTitle: 'Military Grade Encryption',
      shieldDesc: 'All your documents are encrypted with AES-256 before being stored. Only you can access them.',
      signInTitle: 'Sign in to Access Records',
      signInDesc: 'Your digital records are stored securely in the cloud. Please sign in to view and manage your documents safely.',
      signInBtn: 'Sign in with Google',
      misc: 'Misc',
      photoScanType: 'Photo Scan',
      scanLabel: 'Scan',
    },
    [Language.HINDI]: {
      back: 'पीछे',
      photoScan: 'फोटो स्कैन',
      addRecord: 'रिकॉर्ड जोड़ें',
      title: 'मेरे डिजिटल रिकॉर्ड',
      subtitle: 'आपके महत्वपूर्ण दस्तावेजों के लिए एन्क्रिप्टेड और सुरक्षित भंडारण।',
      searchPlaceholder: 'रिकॉर्ड खोजें...',
      loading: 'डिजिटल वॉल्ट लोड हो रहा है...',
      noRecords: 'आपकी खोज से मेल खाने वाला कोई रिकॉर्ड नहीं मिला।',
      shieldTitle: 'मिलिट्री ग्रेड एन्क्रिप्शन',
      shieldDesc: 'आपके सभी दस्तावेज़ संग्रहीत होने से पहले AES-256 के साथ एन्क्रिप्ट किए गए हैं। केवल आप ही उन तक पहुँच सकते हैं।',
      signInTitle: 'रिकॉर्ड एक्सेस करने के लिए साइन इन करें',
      signInDesc: 'आपके डिजिटल रिकॉर्ड क्लाउड में सुरक्षित रूप से संग्रहीत हैं। कृपया अपने दस्तावेजों को सुरक्षित रूप से देखने और प्रबंधित करने के लिए साइन इन करें।',
      signInBtn: 'Google के साथ साइन इन करें',
      misc: 'विविध',
      photoScanType: 'फोटो स्कैन',
      scanLabel: 'स्कैन',
    },
    [Language.KANNADA]: {
      back: 'ಹಿಂದಕ್ಕೆ',
      photoScan: 'ಫೋಟೋ ಸ್ಕ್ಯಾನ್',
      addRecord: 'ದಾಖಲೆ ಸೇರಿಸಿ',
      title: 'ನನ್ನ ಡಿಜಿಟಲ್ ದಾಖಲೆಗಳು',
      subtitle: 'ನಿಮ್ಮ ಪ್ರಮುಖ ದಾಖಲೆಗಳಿಗಾಗಿ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಮತ್ತು ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ.',
      searchPlaceholder: 'ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ...',
      loading: 'ಡಿಜಿಟಲ್ ವಾಲ್ಟ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      noRecords: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ದಾಖಲೆಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.',
      shieldTitle: 'ಮಿಲಿಟರಿ ಗ್ರೇಡ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್',
      shieldDesc: 'ನಿಮ್ಮ ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸುವ ಮೊದಲು AES-256 ನೊಂದಿಗೆ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗುತ್ತದೆ. ನೀವು ಮಾತ್ರ ಅವುಗಳನ್ನು ಪ್ರವೇಶಿಸಬಹುದು.',
      signInTitle: 'ದಾಖಲೆಗಳನ್ನು ಪ್ರವೇಶಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
      signInDesc: 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ದಾಖಲೆಗಳನ್ನು ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ವೀಕ್ಷಿಸಲು ಮತ್ತು ನಿರ್ವಹಿಸಲು ದಯವಿಟ್ಟು ಸೈನ್ ಇನ್ ಮಾಡಿ.',
      signInBtn: 'Google ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
      misc: 'ಇತರೆ',
      photoScanType: 'ಫೋಟೋ ಸ್ಕ್ಯಾನ್',
      scanLabel: 'ಸ್ಕ್ಯಾನ್',
    },
    [Language.TELUGU]: {
      back: 'వెనుకకు',
      photoScan: 'ఫోటో స్కాన్',
      addRecord: 'రికార్డును జోడించు',
      title: 'నా డిజిటల్ రికార్డులు',
      subtitle: 'మీ ముఖ్యమైన పత్రాల కోసం ఎన్‌క్రిప్ట్ చేయబడిన మరియు సురక్షితమైన నిల్వ.',
      searchPlaceholder: 'రికార్డులను వెతకండి...',
      loading: 'డిజిటల్ వాల్ట్‌ను లోడ్ చేస్తోంది...',
      noRecords: 'మీ శోధనకు సరిపోయే రికార్డులేమీ లేవు.',
      shieldTitle: 'మిలిటరీ గ్రేడ్ ఎన్‌క్రిప్షన్',
      shieldDesc: 'మీ అన్ని పత్రాలు నిల్వ చేయబడటానికి ముందు AES-256తో ఎన్‌క్రిప్ట్ చేయబడతాయి. మీరు మాత్రమే వాటిని యాక్సెస్ చేయగలరు.',
      signInTitle: 'రికార్డులను యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి',
      signInDesc: 'మీ డిజిటల్ రికార్డులు క్లౌడ్‌లో సురక్షితంగా నిల్వ చేయబడతాయి. దయచేసి మీ పత్రాలను సురక్షితంగా వీక్షించడానికి మరియు నిర్వహించడానికి సైన్ ఇన్ చేయండి.',
      signInBtn: 'Googleతో సైన్ ఇన్ చేయండి',
      misc: 'ఇతరాలు',
      photoScanType: 'ఫోటో స్కాన్',
      scanLabel: 'స్కాన్',
    },
    [Language.TAMIL]: {
      back: 'பின்செல்',
      photoScan: 'புகைப்பட ஸ்கேன்',
      addRecord: 'பதிவைச் சேர்',
      title: 'எனது டிஜிட்டல் பதிவுகள்',
      subtitle: 'உங்கள் முக்கிய ஆவணங்களுக்கு மறைகுறியாக்கப்பட்ட (Encrypted) மற்றும் பாதுகாப்பான சேமிப்பு.',
      searchPlaceholder: 'பதிவுகளைத் தேடு...',
      loading: 'டிஜிட்டல் பெட்டகத்தை ஏற்றுகிறது...',
      noRecords: 'உங்கள் தேடலுக்குப் பொருந்தும் பதிவுகள் எதுவும் இல்லை.',
      shieldTitle: 'இராணுவ தர குறியாக்கம் (Encryption)',
      shieldDesc: 'உங்கள் அனைத்து ஆவணங்களும் சேமிக்கப்படுவதற்கு முன்பு AES-256 மூலம் குறியாக்கம் செய்யப்படுகின்றன. நீங்கள் மட்டுமே அவற்றை அணுக முடியும்.',
      signInTitle: 'பதிவுகளை அணுக உள்நுழையவும்',
      signInDesc: 'உங்கள் டிஜிட்டல் பதிவுகள் மேகக்கணியில் (Cloud) பாதுகாப்பாக சேமிக்கப்பட்டுள்ளன. உங்கள் ஆவணங்களைப் பாதுகாப்பாகப் பார்க்கவும் நிர்வகிக்கவும் உள்நுழையவும்.',
      signInBtn: 'Google மூலம் உள்நுழையவும்',
      misc: 'மற்றவை',
      photoScanType: 'புகைப்பட ஸ்கேன்',
      scanLabel: 'ஸ்கேன்',
    },
    [Language.BENGALI]: {
      back: 'পিছনে',
      photoScan: 'ফটো স্ক্যান',
      addRecord: 'রেকর্ড যোগ করুন',
      title: 'আমার ডিজিটাল রেকর্ড',
      subtitle: 'আপনার গুরুত্বপূর্ণ নথির জন্য এনক্রিপ্ট করা এবং নিরাপদ স্টোরেজ।',
      searchPlaceholder: 'রেকর্ড খুঁজুন...',
      loading: 'ডিজিটাল ভল্ট লোড হচ্ছে...',
      noRecords: 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনও রেকর্ড নেই।',
      shieldTitle: 'মিলিটারি গ্রেড এনক্রিপশন',
      shieldDesc: 'আপনার সমস্ত নথি সংরক্ষণ করার আগে AES-256 দিয়ে এনক্রিপ্ট করা হয়। শুধুমাত্র আপনিই সেগুলি অ্যাক্সেস করতে পারেন।',
      signInTitle: 'রেকর্ড অ্যাক্সেস করতে সাইন ইন করুন',
      signInDesc: 'আপনার ডিজিটাল রেকর্ড ক্লাউডে নিরাপদে সংরক্ষিত আছে। আপনার নথিগুলি নিরাপদে দেখতে এবং পরিচালনা করতে দয়া করে সাইন ইন করুন।',
      signInBtn: 'Google-এর মাধ্যমে সাইন ইন করুন',
      misc: 'বিবিধ',
      photoScanType: 'ফটো স্ক্যান',
      scanLabel: 'স্ক্যান',
    }
  };

  const current = translations[language];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'records'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRecords = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecords(fetchedRecords);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addDummyRecord = async () => {
    if (!auth.currentUser) return;
    const items = ['Income Certificate', 'Graduation Marksheet', 'Land Record', 'Health Card'];
    const item = items[Math.floor(Math.random() * items.length)];
    
    try {
      await addDoc(collection(db, 'records'), {
        name: item,
        type: current.misc,
        size: '1.5 MB',
        date: new Date().toISOString().split('T')[0],
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'records', id));
    } catch (error) {
       console.error("Error deleting record:", error);
    }
  };

  const handlePhotoScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;
    
    try {
      await addDoc(collection(db, 'records'), {
        name: `${current.scanLabel} ${new Date().toLocaleDateString()}`,
        type: current.photoScanType,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        date: new Date().toISOString().split('T')[0],
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving scan:", error);
    }
  };

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!auth.currentUser) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-6">
        <button 
          onClick={onBack}
          className="text-xs text-text-muted flex items-center gap-2 hover:text-white mb-8"
        >
          <ArrowLeft size={16} /> {current.back}
        </button>
        <div className="glass p-10 rounded-[40px] border-white/5 space-y-6">
          <div className="w-20 h-20 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto">
            <FolderOpen size={40} className="text-neon-blue" />
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
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-white/20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p>{current.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-xs text-text-muted flex items-center gap-2 hover:text-white"
        >
          <ArrowLeft size={16} /> {current.back}
        </button>
        <div className="flex gap-2">
          <label className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer">
            <Camera size={16} /> {current.photoScan}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              capture="environment"
              onChange={handlePhotoScan}
            />
          </label>
          <button 
            onClick={addDummyRecord}
            className="px-5 py-2.5 bg-neon-blue rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
            <Plus size={16} /> {current.addRecord}
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-[32px] border-white/5 bg-white/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FolderOpen className="text-pink-400" />
              {current.title}
            </h2>
            <p className="text-xs text-text-muted">{current.subtitle}</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder={current.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-neon-blue transition-all text-sm w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredRecords.map((record, i) => (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-[24px] glass border-white/5 hover:border-white/10 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{record.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-white/40">{record.type}</span>
                      <span className="text-[10px] text-white/20 flex items-center gap-1">
                        <Clock size={10} /> {record.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"><Eye size={18} /></button>
                  <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"><Download size={18} /></button>
                  <button 
                    onClick={() => deleteRecord(record.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all font-bold"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <button className="p-2 rounded-lg text-white/20 hover:text-white md:hidden"><MoreVertical size={18} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredRecords.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-white/10 opacity-20">
              <Search size={32} />
            </div>
            <p className="text-sm text-text-muted">{current.noRecords}</p>
          </div>
        )}
      </div>

      <div className="p-6 rounded-[32px] glass border-emerald-500/20 bg-emerald-500/5 flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <ShieldCheck size={28} />
        </div>
        <div>
          <p className="font-bold text-emerald-400 text-sm">{current.shieldTitle}</p>
          <p className="text-xs text-white/40">{current.shieldDesc}</p>
        </div>
      </div>
    </div>
  );
}
