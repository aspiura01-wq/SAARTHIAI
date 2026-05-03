import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Language, Task } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function TasksView({ language }: { language: Language }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newText, setNewText] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);

  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      signInTitle: 'Sign in to Save Tasks',
      signInDesc: 'To keep your task list safe and synced across devices, please sign in with your Google account.',
      signInBtn: 'Sign in with Google',
      loadingTasks: 'Loading tasks...',
      placeholder: 'What needs to be done?',
      detailsPlaceholder: 'Add details (Notepad)...',
      setReminder: 'Set Reminder:',
      cancel: 'Cancel',
      reminderLabel: 'Reminder:',
      noTasks: 'No tasks yet. Add one above!',
    },
    [Language.HINDI]: {
      signInTitle: 'कार्यों को सहेजने के लिए साइन इन करें',
      signInDesc: 'अपनी कार्य सूची को सुरक्षित रखने और डिवाइसों में सिंक करने के लिए, कृपया अपने Google खाते से साइन इन करें।',
      signInBtn: 'Google के साथ साइन इन करें',
      loadingTasks: 'कार्य लोड हो रहे हैं...',
      placeholder: 'क्या किया जाना चाहिए?',
      detailsPlaceholder: 'विवरण जोड़ें (नोटपैड)...',
      setReminder: 'अनुस्मारक सेट करें:',
      cancel: 'रद्द करें',
      reminderLabel: 'अनुस्मारक:',
      noTasks: 'अभी तक कोई कार्य नहीं है। ऊपर एक जोड़ें!',
    },
    [Language.KANNADA]: {
      signInTitle: 'ಕಾರ್ಯಗಳನ್ನು ಉಳಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
      signInDesc: 'ನಿಮ್ಮ ಕಾರ್ಯಪಟ್ಟಿಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿಡಲು ಮತ್ತು ಸಾಧನಗಳಲ್ಲಿ ಸಿಂಕ್ ಮಾಡಲು, ದಯವಿಟ್ಟು ನಿಮ್ಮ Google ಖಾತೆಯೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.',
      signInBtn: 'Google ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
      loadingTasks: 'ಕಾರ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
      placeholder: 'ಏನು ಮಾಡಬೇಕಾಗಿದೆ?',
      detailsPlaceholder: 'ವಿವರಗಳನ್ನು ಸೇರಿಸಿ (ನೋಟ್‌ಪ್ಯಾಡ್)...',
      setReminder: 'ಜ್ಞಾಪನೆ ಹೊಂದಿಸಿ:',
      cancel: 'ರದ್ದುಗೊಳಿಸು',
      reminderLabel: 'ಜ್ಞಾಪನೆ:',
      noTasks: 'ಇನ್ನೂ ಯಾವುದೇ ಕಾರ್ಯಗಳಿಲ್ಲ. ಮೇಲೆ ಒಂದನ್ನು ಸೇರಿಸಿ!',
    },
    [Language.TELUGU]: {
      signInTitle: 'పనులను సేవ్ చేయడానికి సైన్ ఇన్ చేయండి',
      signInDesc: 'మీ పనుల జాబితాను సురక్షితంగా ఉంచడానికి మరియు పరికరాల్లో సమకాలీకరించడానికి, దయచేసి మీ Google ఖాతాతో సైన్ ఇన్ చేయండి.',
      signInBtn: 'Googleతో సైన్ ఇన్ చేయండి',
      loadingTasks: 'పనులను లోడ్ చేస్తోంది...',
      placeholder: 'ఏం చేయాలి?',
      detailsPlaceholder: 'వివరాలను జోడించండి (నోట్‌ప్యాడ్)...',
      setReminder: 'రిమైండర్‌ను సెట్ చేయండి:',
      cancel: 'రద్దు చేయి',
      reminderLabel: 'రిమైండర్:',
      noTasks: 'ఇంకా పనులేమీ లేవు. పైన ఒకదాన్ని జోడించండి!',
    },
    [Language.TAMIL]: {
      signInTitle: 'பணிகளைச் சேமிக்க உள்நுழையவும்',
      signInDesc: 'உங்கள் பணிப் பட்டியலைப் பாதுகாப்பாக வைத்திருக்கவும், சாதனங்களில் ஒத்திசைக்கவும், தயவுசெய்து உங்கள் Google கணக்கு மூலம் உள்நுழையவும்.',
      signInBtn: 'Google மூலம் உள்நுழையவும்',
      loadingTasks: 'பணிகளை ஏற்றுகிறது...',
      placeholder: 'என்ன செய்ய வேண்டும்?',
      detailsPlaceholder: 'விவரங்களைச் சேர்க்கவும் (நோட்பேட்)...',
      setReminder: 'நினைவூட்டலை அமைக்கவும்:',
      cancel: 'ரத்துசெய்',
      reminderLabel: 'நினைவூட்டல்:',
      noTasks: 'இன்னும் பணிகள் இல்லை. மேலே ஒன்றைச் சேர்க்கவும்!',
    },
    [Language.BENGALI]: {
      signInTitle: 'কাজ সংরক্ষণ করতে সাইন ইন করুন',
      signInDesc: 'আপনার কাজের তালিকা নিরাপদ রাখতে এবং ডিভাইস জুড়ে সিঙ্ক করতে, দয়া করে আপনার Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন।',
      signInBtn: 'Google-এর মাধ্যমে সাইন ইন করুন',
      loadingTasks: 'কাজ লোড হচ্ছে...',
      placeholder: 'কী করতে হবে?',
      detailsPlaceholder: 'বিবরণ যোগ করুন (নোটপ্যাড)...',
      setReminder: 'রিমাইন্ডার সেট করুন:',
      cancel: 'বাতিল করুন',
      reminderLabel: 'রিমাইন্ডার:',
      noTasks: 'এখনও কোনো কাজ নেই। উপরে একটি যোগ করুন!',
    }
  };

  const current = translations[language];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (!newText.trim() || !auth.currentUser) return;
    
    try {
      await addDoc(collection(db, 'tasks'), {
        text: newText,
        description: newDesc,
        dueDate: newDate,
        completed: false,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setNewText('');
      setNewDesc('');
      setNewDate('');
      setIsExpanding(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'tasks', id), {
        completed: !completed
      });
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!auth.currentUser) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-6">
        <div className="glass p-10 rounded-[40px] border-white/5 space-y-6">
          <div className="w-20 h-20 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-neon-blue" />
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
        <p>{current.loadingTasks}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="glass p-1 rounded-3xl border-white/10 group focus-within:border-neon-blue/40 transition-all">
        <div className="flex gap-2 p-2">
          <input 
            type="text" 
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onFocus={() => setIsExpanding(true)}
            placeholder={current.placeholder}
            className="flex-1 bg-transparent py-3 px-4 outline-none text-white placeholder-white/20"
          />
          <button 
            onClick={addTask}
            className="p-3 bg-neon-blue rounded-2xl shadow-lg shadow-neon-blue/20"
          >
            <Plus size={24} />
          </button>
        </div>
        
        {isExpanding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4"
          >
            <textarea 
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder={current.detailsPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-blue/30 text-xs text-white/70 h-24 resize-none"
            />
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{current.setReminder}</span>
               <input 
                 type="date" 
                 value={newDate}
                 onChange={(e) => setNewDate(e.target.value)}
                 className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-xs text-white/40"
               />
               <button onClick={() => setIsExpanding(false)} className="text-xs text-white/20 hover:text-white ml-auto">{current.cancel}</button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {tasks.map((task: any) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-5 rounded-[32px] border-white/5 group hover:bg-white/5 transition-all"
            >
              <div className="flex items-start gap-4">
                <button onClick={() => toggleTask(task.id, task.completed)} className="mt-1">
                  {task.completed ? <CheckCircle2 className="text-emerald-400" /> : <Circle className="text-white/20" />}
                </button>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${task.completed ? 'line-through text-white/20' : 'text-white/90'}`}>{task.text}</h4>
                  {task.description && (
                    <p className="text-xs text-text-muted mt-2 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-amber-400/60 font-black uppercase tracking-widest">
                      <Clock size={10} /> {current.reminderLabel} {task.dueDate}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-red-400 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            <CheckSquare size={48} className="mx-auto mb-3 opacity-10" />
            <p>{current.noTasks}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckSquare({ className, size = 24 }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
