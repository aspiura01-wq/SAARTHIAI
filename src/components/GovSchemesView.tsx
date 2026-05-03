import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ArrowRight, ExternalLink, FileText, UserCheck, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';
import { Language, GovScheme } from '../types';

export default function GovSchemesView({ language }: { language: Language }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  
  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      searchPlaceholder: 'Search schemes (e.g. Health, Farmer)...',
      tags: ['All', 'Farmer', 'Student', 'Health', 'Woman', 'Pension'],
      howToApply: 'How to Apply',
      showLess: 'Show Less',
      eligibility: 'Eligibility',
      documents: 'Documents Needed',
      steps: 'Steps to Apply',
      savedSchemes: 'Saved Schemes (Offline)',
      allSchemes: 'All Schemes'
    },
    [Language.HINDI]: {
      searchPlaceholder: 'योजनाएं खोजें (जैसे स्वास्थ्य, किसान)...',
      tags: ['सभी', 'किसान', 'छात्र', 'स्वास्थ्य', 'महिला', 'पेंशन'],
      howToApply: 'आवेदन कैसे करें',
      showLess: 'कम दिखाएं',
      eligibility: 'पात्रता',
      documents: 'आवश्यक दस्तावेज',
      steps: 'आवेदन के चरण',
      savedSchemes: 'सेव की गई योजनाएं (ऑफलाइन)',
      allSchemes: 'सभी योजनाएं'
    },
    [Language.KANNADA]: {
      searchPlaceholder: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ. ಆರೋಗ್ಯ, ರೈತ)...',
      tags: ['ಎಲ್ಲಾ', 'ರೈತರು', 'ವಿದ್ಯಾರ್ಥಿಗಳು', 'ಆರೋಗ್ಯ', 'ಮಹಿಳೆಯರು', 'ಪಿಂಚಣಿ'],
      howToApply: 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ',
      showLess: 'ಕಡಿಮೆ ತೋರಿಸು',
      eligibility: 'ಅರ್ಹತೆ',
      documents: 'അಗತ್ಯ ದಾಖಲೆಗಳು',
      steps: 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಹಂತಗಳು',
      savedSchemes: 'ಉಳಿಸಿದ ಯೋಜನೆಗಳು (ಆಫ್‌ಲೈನ್)',
      allSchemes: 'ಎಲ್ಲಾ ಯೋಜನೆಗಳು'
    },
    [Language.TELUGU]: {
      searchPlaceholder: 'పథకాలను శోధించండి (ఉదా. ఆరోగ్యం, రైతు)...',
      tags: ['అన్నీ', 'రైతు', 'విద్యార్థి', 'ఆరోగ్యం', 'మహిళ', 'పెన్షన్'],
      howToApply: 'ఎలా దరఖాస్తు చేయాలి',
      showLess: 'తక్కువ చూపించు',
      eligibility: 'అర్హత',
      documents: 'అవసరమైన పత్రాలు',
      steps: 'దరఖాస్తు చేయడానికి దశలు',
      savedSchemes: 'సేవ్ చేసిన పథకాలు (ఆఫ్ లైన్)',
      allSchemes: 'అన్ని పథకాలు'
    },
    [Language.TAMIL]: {
      searchPlaceholder: 'திட்டங்களைத் தேடுங்கள் (உதாரணம்: சுகாதாரம், விவசாயி)...',
      tags: ['அனைத்தும்', 'விவசாயி', 'மாணவர்', 'சுகாதாரம்', 'பெண்', 'ஓய்வூதியம்'],
      howToApply: 'விண்ணப்பிப்பது எப்படி',
      showLess: 'குறைவாகக் காட்டு',
      eligibility: 'தகுதி',
      documents: 'தேவையான ஆவணங்கள்',
      steps: 'விண்ணப்பிப்பதற்கான படிகள்',
      savedSchemes: 'சேமிக்கப்பட்ட திட்டங்கள் (ஆஃப்லைன்)',
      allSchemes: 'அனைத்து திட்டங்கள்'
    },
    [Language.BENGALI]: {
      searchPlaceholder: 'প্রকল্প খুঁজুন (যেমন স্বাস্থ্য, কৃষক)...',
      tags: ['সব', 'কৃষক', 'ছাত্র', 'স্বাস্থ্য', 'মহিলা', 'পেনশন'],
      howToApply: 'কীভাবে আবেদন করবেন',
      showLess: 'কম দেখান',
      eligibility: 'যোগ্যতা',
      documents: 'প্রয়োজনীয় নথি',
      steps: 'আবেদন করার ধাপগুলো',
      savedSchemes: 'সংরক্ষিত প্রকল্প (অফলাইন)',
      allSchemes: 'সব প্রকল্প'
    }
  };

  const current = translations[language];

  useEffect(() => {
    const saved = localStorage.getItem('saved_schemes');
    if (saved) setSavedIds(JSON.parse(saved));
  }, []);

  const toggleSave = (name: string) => {
    const newSaved = savedIds.includes(name) 
      ? savedIds.filter(id => id !== name)
      : [...savedIds, name];
    setSavedIds(newSaved);
    localStorage.setItem('saved_schemes', JSON.stringify(newSaved));
  };

  // Dummy data for schemes
  const schemes: GovScheme[] = [
    {
      name: "Pradhan Mantri Jan Dhan Yojana",
      eligibility: "Unbanked individuals, Indian citizens",
      documents: ["Aadhaar Card", "Voter ID", "Mobile Number"],
      benefits: "Zero balance account, insurance, overdraft facility",
      applicationSteps: ["Visit nearest bank", "Fill form", "Provide KYC", "Get bank kit"],
      officialLink: "https://pmjdy.gov.in",
      nearbyOffice: "Any Public Sector Bank"
    },
    {
      name: "Ayushman Bharat Card (PM-JAY)",
      eligibility: "Low income families, rural/urban workers",
      documents: ["Aadhaar", "Ration Card", "Identity Proof"],
      benefits: "Free health cover up to ₹5 Lakh/year",
      applicationSteps: ["Check eligibility online", "Visit nearest Common Service Center", "Apply for card"],
      officialLink: "https://pmjay.gov.in",
      nearbyOffice: "Public Health Centers (PHC)"
    },
    {
      name: "PM-Kisan Samman Nidhi",
      eligibility: "Small and marginal farmers",
      documents: ["Land ownership proof", "Bank details", "Aadhaar"],
      benefits: "₹6,000 yearly in 3 installments",
      applicationSteps: ["Register on PM-Kisan portal", "Contact Lekhpal/Agricultural officer"],
      officialLink: "https://pmkisan.gov.in",
      nearbyOffice: "District Agriculture Office"
    },
    {
      name: "Atal Pension Yojana (APY)",
      eligibility: "Citizens aged 18-40 years",
      documents: ["Savings bank account", "Mobile number", "Aadhaar"],
      benefits: "Guaranteed monthly pension (₹1,000-₹5,000) after 60",
      applicationSteps: ["Visit your bank", "Fill APY registration form", "Setup auto-debit"],
      officialLink: "https://www.npscra.nsdl.co.in",
      nearbyOffice: "Your Savings Bank Branch"
    },
    {
      name: "Pradhan Mantri Matru Vandana Yojana",
      eligibility: "Pregnant women and lactating mothers",
      documents: ["LMP date", "MCP card", "Aadhaar", "Bank passbook"],
      benefits: "₹5,000 incentive in 3 installments for first child",
      applicationSteps: ["Visit Anganwadi Center / Health Facility", "Submit Form 1A"],
      officialLink: "https://wcd.nic.in",
      nearbyOffice: "Nearest Anganwadi Center"
    },
    {
      name: "Stand Up India Scheme",
      eligibility: "SC/ST and Woman entrepreneurs",
      documents: ["Business plan", "Caste certificate", "Identity proof"],
      benefits: "Loans between ₹10 Lakh and ₹1 Crore for greenfield projects",
      applicationSteps: ["Apply online via StandUp India portal", "Contact Lead District Manager"],
      officialLink: "https://www.standupmitra.in",
      nearbyOffice: "SIDBI / NABARD Office"
    },
    {
      name: "National Social Assistance Programme (NSAP)",
      eligibility: "Senior citizens, widows, disabled (BPL)",
      documents: ["BPL Card", "Age proof", "Disability certificate (if any)"],
      benefits: "Monthly pension support for livelihood",
      applicationSteps: ["Apply to Social Welfare Dept", "Submit form to Gram Panchayat"],
      officialLink: "https://nsap.nic.in",
      nearbyOffice: "Tehsil Office / BDO Office"
    },
    {
      name: "PM-AWAS Yojana (Urban/Rural)",
      eligibility: "Economically weaker sections (EWS), LIG families",
      documents: ["Income certificate", "Aadhaar", "Affidavit"],
      benefits: "Subsidy for building or purchasing a house",
      applicationSteps: ["Apply on PMAY portal", "Submit to local municipal office"],
      officialLink: "https://pmay-urban.gov.in",
      nearbyOffice: "Municipal Corporation / Panchayat Office"
    },
    {
      name: "Sukanya Samriddhi Yojana",
      eligibility: "Parents of girl child (below 10 years)",
      documents: ["Birth certificate", "Aadhaar of parent", "Address proof"],
      benefits: "High interest rate savings for girl child education/marriage",
      applicationSteps: ["Visit Post Office or Bank", "Open SSY account"],
      officialLink: "https://www.indiapost.gov.in",
      nearbyOffice: "Nearest Post Office"
    }
  ];

  let filtered = schemes.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  if (showSavedOnly) {
    filtered = filtered.filter(s => savedIds.includes(s.name));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-4 text-white/40" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={current.searchPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>

        <button 
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className={`px-4 py-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all ${showSavedOnly ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-white/60'}`}
        >
          {showSavedOnly ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {showSavedOnly ? current.savedSchemes : current.allSchemes}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {current.tags.map((tag: string) => (
          <button key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm whitespace-nowrap hover:bg-white/10">
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((scheme, i) => (
          <SchemeCard 
            key={i} 
            scheme={scheme} 
            translations={current} 
            isSaved={savedIds.includes(scheme.name)}
            onToggleSave={() => toggleSave(scheme.name)}
          />
        ))}
        {showSavedOnly && filtered.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <Bookmark size={48} className="mx-auto mb-4" />
            <p className="font-bold">{current.savedSchemes} is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SchemeCardProps {
  scheme: GovScheme;
  translations: any;
  isSaved: boolean;
  onToggleSave: () => void;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, translations, isSaved, onToggleSave }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
           <h4 className="text-lg font-bold flex-1">{scheme.name}</h4>
           <button 
            onClick={onToggleSave}
            className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-white/20'}`}
           >
             {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
           </button>
        </div>
        <p className="text-sm text-white/50 mb-4 line-clamp-2">{scheme.benefits}</p>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 py-2.5 bg-orange-500/10 text-orange-400 font-bold rounded-xl text-sm hover:bg-orange-500/20 transition-all"
          >
            {isOpen ? translations.showLess : translations.howToApply}
          </button>
          <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
            <ExternalLink size={18} className="text-white/40" />
          </a>
        </div>

        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-white/5 space-y-6"
          >
            <section>
              <div className="flex items-center gap-2 mb-3">
                <UserCheck size={16} className="text-orange-400" />
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/40">{translations.eligibility}</h5>
              </div>
              <p className="text-sm text-white/80">{scheme.eligibility}</p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-blue-400" />
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/40">{translations.documents}</h5>
              </div>
              <ul className="grid grid-cols-1 gap-2">
                {scheme.documents.map((doc, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {doc}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight size={16} className="text-purple-400" />
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/40">{translations.steps}</h5>
              </div>
              <div className="space-y-4">
                {scheme.applicationSteps.map((step, k) => (
                  <div key={k} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">{k+1}</div>
                    <p className="text-sm text-white/70">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
