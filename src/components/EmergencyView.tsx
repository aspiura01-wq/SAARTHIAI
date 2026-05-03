import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Siren, Flame, Shield, MapPin, HeartPulse, RefreshCw, Users, Plus, Trash2, Send } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, query, where, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Language, EmergencyContact } from '../types';

export default function EmergencyView({ language }: { language: Language }) {
  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      emergencyHelp: 'Emergency Help',
      callImmediately: 'Press a button to call immediately',
      familyContacts: 'Family Contacts',
      noContacts: 'No family contacts added yet. Add your parents\' details for SOS.',
      yourLocation: 'Your Location',
      tellOperator: 'Tell this to the operator for quick help',
      sendSOS: 'Send SOS to Family',
      findingLocation: 'Finding your location...',
      locPermissionDenied: 'Location permission denied. Please enable GPS.',
      locUnavailable: 'Location information is unavailable.',
      locTimeout: 'Request timed out.',
      locNotSupported: 'Geolocation is not supported by your browser.',
      addContact: 'Please add at least one family contact first.',
      saveContact: 'Save Contact',
      namePlaceholder: 'Name',
      numberPlaceholder: 'Parent\'s Number',
      relations: {
        Parent: 'Parent',
        Sibling: 'Sibling',
        Spouse: 'Spouse',
        Friend: 'Friend',
      },
      contacts: {
        Police: 'Police',
        Ambulance: 'Ambulance',
        Fire: 'Fire Service',
        Women: 'Women Help',
      }
    },
    [Language.HINDI]: {
      emergencyHelp: 'आपातकालीन सहायता',
      callImmediately: 'तुरंत कॉल करने के लिए एक बटन दबाएं',
      familyContacts: 'परिवार के संपर्क',
      noContacts: 'अभी तक कोई पारिवारिक संपर्क नहीं जोड़ा गया है। SOS के लिए अपने माता-पिता का विवरण जोड़ें।',
      yourLocation: 'आपका स्थान',
      tellOperator: 'त्वरित सहायता के लिए ऑपरेटर को यह बताएं',
      sendSOS: 'परिवार को SOS भेजें',
      findingLocation: 'आपका स्थान ढूंढ रहे हैं...',
      locPermissionDenied: 'स्थान की अनुमति अस्वीकार कर दी गई। कृपया GPS सक्षम करें।',
      locUnavailable: 'स्थान की जानकारी उपलब्ध नहीं है।',
      locTimeout: 'अनुरोध का समय समाप्त हो गया।',
      locNotSupported: 'आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।',
      addContact: 'कृपया पहले कम से कम एक पारिवारिक संपर्क जोड़ें।',
      saveContact: 'संपर्क सहेजें',
      namePlaceholder: 'नाम',
      numberPlaceholder: 'माता-पिता का नंबर',
      relations: {
        Parent: 'अभिभावक',
        Sibling: 'भाई-बहन',
        Spouse: 'जीवनसाथी',
        Friend: 'दोस्त',
      },
      contacts: {
        Police: 'पुलिस',
        Ambulance: 'एम्बुलेंस',
        Fire: 'दमकल सेवा',
        Women: 'महिला हेल्पलाइन',
      }
    },
    [Language.KANNADA]: {
      emergencyHelp: 'ತುರ್ತು ಸಹಾಯ',
      callImmediately: 'ತಕ್ಷಣ ಕರೆ ಮಾಡಲು ಬಟನ್ ಒತ್ತಿರಿ',
      familyContacts: 'ಕುಟುಂಬದ ಸಂಪರ್ಕಗಳು',
      noContacts: 'ಇನ್ನೂ ಯಾವುದೇ ಕುಟುಂಬದ ಸಂಪರ್ಕಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ. SOS ಗಾಗಿ ನಿಮ್ಮ ಪೋಷಕರ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.',
      yourLocation: 'ನಿಮ್ಮ ಸ್ಥಳ',
      tellOperator: 'ತ್ವರಿತ ಸಹಾಯಕ್ಕಾಗಿ ಆಪರೇಟರ್‌ಗೆ ಇದನ್ನು ತಿಳಿಸಿ',
      sendSOS: 'ಕುಟುಂಬಕ್ಕೆ SOS ಕಳುಹಿಸಿ',
      findingLocation: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
      locPermissionDenied: 'ಸ್ಥಳದ ಅನುಮತಿಯನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು GPS ಸಕ್ರಿಯಗೊಳಿಸಿ.',
      locUnavailable: 'ಸ್ಥಳದ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.',
      locTimeout: 'ವಿನಂತಿಯ ಸಮಯ ಮುಗಿದಿದೆ.',
      locNotSupported: 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಜಿಯೋಲೊಕೇಶನ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.',
      addContact: 'ದಯವಿಟ್ಟು ಮೊದಲು ಕನಿಷ್ಠ ಒಂದು ಕುಟುಂಬದ ಸಂಪರ್ಕವನ್ನು ಸೇರಿಸಿ.',
      saveContact: 'ಸಂಪರ್ಕವನ್ನು ಉಳಿಸಿ',
      namePlaceholder: 'ಹೆಸರು',
      numberPlaceholder: 'ಪೋಷಕರ ಸಂಖ್ಯೆ',
      relations: {
        Parent: 'ಪೋಷಕರು',
        Sibling: 'ಸಹೋದರ/ಸಹೋದರಿ',
        Spouse: 'ಜೀವನಸಂಗಾತಿ',
        Friend: 'ಸ್ನೇಹಿತ',
      },
      contacts: {
        Police: 'ಪೊಲೀಸ್',
        Ambulance: 'ಆಂಬ್ಯುಲೆನ್ಸ್',
        Fire: 'ಅಗ್ನಿಶಾಮಕ ಸೇವೆ',
        Women: 'ಮಹಿಳಾ ಸಹಾಯವಾಣಿ',
      }
    },
    [Language.TELUGU]: {
      emergencyHelp: 'అత్యవసర సహాయం',
      callImmediately: 'వెంటనే కాల్ చేయడానికి బటన్ నొక్కండి',
      familyContacts: 'కుటుంబ పరిచయాలు',
      noContacts: 'ఇంకా కుటుంబ పరిచయాలేమీ జోడించబడలేదు. SOS కోసం మీ తల్లిదండ్రుల వివరాలను జోడించండి.',
      yourLocation: 'మీ స్థానం',
      tellOperator: 'త్వరిత సహాయం కోసం దీనిని ఆపరేటర్‌కు చెప్పండి',
      sendSOS: 'కుటుంబానికి SOS పంపండి',
      findingLocation: 'మీ స్థానాన్ని కనుగొంటోంది...',
      locPermissionDenied: 'స్థాన అనుమతి తిరస్కరించబడింది. దయచేసి GPSని ప్రారంభించండి.',
      locUnavailable: 'స్థాన సమాచారం అందుబాటులో లేదు.',
      locTimeout: 'అభ్యర్థన గడువు ముగిసింది.',
      locNotSupported: 'మీ బ్రౌజర్ జియోలొకేషన్‌కు మద్దతు ఇవ్వదు.',
      addContact: 'దయచేసి ముందుగా కనీసం ఒక కుటుంబ పరిచయాన్ని జోడించండి.',
      saveContact: 'పరిచయాన్ని సేవ్ చేయండి',
      namePlaceholder: 'పేరు',
      numberPlaceholder: 'తల్లిదండ్రుల సంఖ్య',
      relations: {
        Parent: 'తల్లిదండ్రులు',
        Sibling: 'తోబుట్టువు',
        Spouse: 'భార్య/భర్త',
        Friend: 'స్నేహితుడు',
      },
      contacts: {
        Police: 'పోలీస్',
        Ambulance: 'అంబులెన్స్',
        Fire: 'అగ్నిమాపక సేవ',
        Women: 'మహిళా సహాయం',
      }
    },
    [Language.TAMIL]: {
      emergencyHelp: 'அவசர உதவி',
      callImmediately: 'உடனடியாக அழைக்க ஒரு பொத்தானை அழுத்தவும்',
      familyContacts: 'குடும்பத் தொடர்புகள்',
      noContacts: 'இன்னும் குடும்பத் தொடர்புகள் சேர்க்கப்படவில்லை. SOS சேவைக்காக உங்கள் பெற்றோரின் விவரங்களைச் சேர்க்கவும்.',
      yourLocation: 'உங்கள் இருப்பிடம்',
      tellOperator: 'விரைவான உதவிக்கு ஆபரேட்டரிடம் இதைச் சொல்லவும்',
      sendSOS: 'குடும்பத்திற்கு SOS அனுப்பவும்',
      findingLocation: 'உங்கள் இருப்பிடத்தைக் கண்டறியும்...',
      locPermissionDenied: 'இருப்பிட அனுமதி மறுக்கப்பட்டது. தயவுசெய்து GPS ஐ இயக்கவும்.',
      locUnavailable: 'இருப்பிடத் தகவல் கிடைக்கவில்லை.',
      locTimeout: 'கோரிக்கைக்கான நேரம் முடிந்தது.',
      locNotSupported: 'உங்கள் உலாவி புவிஇருப்பிடத்தை ஆதரிக்காது.',
      addContact: 'தயவுசெய்து முதலில் ஒரு குடும்பத் தொடர்பையாவது சேர்க்கவும்.',
      saveContact: 'தொடர்பைச் சேமி',
      namePlaceholder: 'பெயர்',
      numberPlaceholder: 'பெற்றோர் எண்',
      relations: {
        Parent: 'பெற்றோர்',
        Sibling: 'சகோதரர்/சகோதரி',
        Spouse: 'மனைவி/கணவர்',
        Friend: 'நண்பர்',
      },
      contacts: {
        Police: 'காவல்துறை',
        Ambulance: 'ஆம்புலன்ஸ்',
        Fire: 'தீயணைப்பு சேவை',
        Women: 'பெண்கள் உதவி',
      }
    },
    [Language.BENGALI]: {
      emergencyHelp: 'জরুরি সহায়তা',
      callImmediately: 'অবিলম্বে কল করতে একটি বোতাম টিপুন',
      familyContacts: 'পরিবারের যোগাযোগ',
      noContacts: 'এখনও কোনো পারিবারিক যোগাযোগ যোগ করা হয়নি। SOS-এর জন্য আপনার পিতামাতার বিবরণ যোগ করুন।',
      yourLocation: 'আপনার অবস্থান',
      tellOperator: 'দ্রুত সহায়তার জন্য অপারেটরকে এটি বলুন',
      sendSOS: 'পরিবারকে SOS পাঠান',
      findingLocation: 'আপনার অবস্থান খোঁজা হচ্ছে...',
      locPermissionDenied: 'অবস্থানের অনুমতি প্রত্যাখ্যান করা হয়েছে। দয়া করে GPS সক্ষম করুন।',
      locUnavailable: 'অবস্থানের তথ্য পাওয়া যাচ্ছে না।',
      locTimeout: 'অনুরোধের সময় শেষ হয়ে গেছে।',
      locNotSupported: 'আপনার ব্রাউজার জিওলোকেশন সমর্থন করে না।',
      addContact: 'অনুগ্রহ করে প্রথমে অন্তত একটি পারিবারিক যোগাযোগ যোগ করুন।',
      saveContact: 'যোগাযোগ সংরক্ষণ করুন',
      namePlaceholder: 'নাম',
      numberPlaceholder: 'পিতামাতার নম্বর',
      relations: {
        Parent: 'পিতামাতা',
        Sibling: 'ভাইবোন',
        Spouse: 'স্বামী/স্ত্রী',
        Friend: 'বন্ধু',
      },
      contacts: {
        Police: 'পুলিশ',
        Ambulance: 'অ্যাম্বুলেন্স',
        Fire: 'ফায়ার সার্ভিস',
        Women: 'মহিলাদের সহায়তা',
      }
    }
  };

  const current = translations[language];

  const [location, setLocation] = useState<string>(current.findingLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [familyContacts, setFamilyContacts] = useState<EmergencyContact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newRelation, setNewRelation] = useState('Parent');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'emergency_contacts'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EmergencyContact[];
      setFamilyContacts(contacts);
    });

    return () => unsubscribe();
  }, []);

  const addContact = async () => {
    if (!newName || !newNumber || !auth.currentUser) return;
    
    try {
      await addDoc(collection(db, 'emergency_contacts'), {
        name: newName,
        number: newNumber,
        relation: newRelation,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setNewName('');
      setNewNumber('');
      setShowAddContact(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'emergency_contacts', id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const sendSOS = () => {
    if (familyContacts.length === 0) {
      alert(current.addContact);
      setShowAddContact(true);
      return;
    }

    const message = encodeURIComponent(`🚨 SOS EMERGENCY ALERT!\n\nI need help! My current location is:\n${location}\n\nPlease contact me immediately.`);
    
    // In a real mobile app we'd use SMS. For web, we use WhatsApp for the most likely contact.
    const primaryContact = familyContacts[0].number;
    const whatsappUrl = `https://wa.me/${primaryContact.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const getLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app, would use reverse geocoding
          setLocation(`Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`);
          setIsLocating(false);
        },
        (err) => {
          let message = current.locNotSupported;
          if (err.code === 1) message = current.locPermissionDenied;
          else if (err.code === 2) message = current.locUnavailable;
          else if (err.code === 3) message = current.locTimeout;
          
          setLocation(message);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocation("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const contacts = [
// ...
    { label: current.contacts.Police, number: '100', icon: <Siren size={32} />, color: 'bg-red-600' },
    { label: current.contacts.Ambulance, number: '102', icon: <HeartPulse size={32} />, color: 'bg-red-600' },
    { label: current.contacts.Fire, number: '101', icon: <Flame size={32} />, color: 'bg-red-600' },
    { label: current.contacts.Women, number: '1091', icon: <Shield size={32} />, color: 'bg-red-600' },
  ];

  const callNumber = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <div className="inline-block p-4 rounded-full bg-red-600 animate-pulse mb-2">
          <Siren size={48} className="text-white" />
        </div>
        <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter">{current.emergencyHelp}</h2>
        <p className="text-white/60 text-sm max-w-[250px] mx-auto uppercase tracking-widest font-bold">{current.callImmediately}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {contacts.map((contact, i) => (
          <motion.button 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => callNumber(contact.number)}
            className="group flex flex-col items-center gap-4 p-8 rounded-[40px] bg-red-600/10 border border-red-500/30 hover:bg-red-600/20 transition-all shadow-xl shadow-red-900/10"
          >
            <div className={`p-4 rounded-3xl ${contact.color} text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform`}>
              {contact.icon}
            </div>
            <div className="text-center">
               <h4 className="font-black text-lg uppercase tracking-tight text-white">{contact.label}</h4>
               <p className="text-2xl font-black text-red-500 tracking-wider mt-1">{contact.number}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="glass p-6 rounded-[32px] border-white/5 bg-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="text-emerald-500" size={20} />
              <h4 className="font-bold text-lg">{current.familyContacts}</h4>
            </div>
            <button 
              onClick={() => setShowAddContact(!showAddContact)}
              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"
            >
              <Plus size={20} />
            </button>
          </div>

          <AnimatePresence>
            {showAddContact && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 pb-4 border-b border-white/5"
              >
                <div className="grid grid-cols-2 gap-2">
                   <input 
                     type="text" 
                     placeholder={current.namePlaceholder} 
                     value={newName}
                     onChange={(e) => setNewName(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-emerald-500/50"
                   />
                   <input 
                     type="text" 
                     placeholder={current.numberPlaceholder} 
                     value={newNumber}
                     onChange={(e) => setNewNumber(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-emerald-500/50"
                   />
                </div>
                <div className="flex gap-2">
                   {Object.entries(current.relations).map(([key, val]) => (
                     <button
                       key={key}
                       onClick={() => setNewRelation(key)}
                       className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${newRelation === key ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40'}`}
                     >
                       {val as string}
                     </button>
                   ))}
                </div>
                <button 
                  onClick={addContact}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black uppercase text-xs tracking-widest"
                >
                  {current.saveContact}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {familyContacts.length === 0 ? (
              <p className="text-center py-4 text-xs text-white/20 italic">{current.noContacts}</p>
            ) : (
              familyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Users size={20} />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm">{contact.name}</h5>
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{current.relations[contact.relation] || contact.relation} • {contact.number}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => contact.id && deleteContact(contact.id)}
                    className="p-2 text-white/10 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
      </div>

      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="text-red-500" size={20} />
              <h4 className="font-bold text-lg">{current.yourLocation}</h4>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={getLocation}
                className={`p-2 rounded-lg bg-white/5 ${isLocating ? 'animate-spin opacity-50' : ''}`}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          <p className="text-sm text-white/70 bg-white/5 p-4 rounded-2xl border border-white/5 min-h-[50px] flex items-center">
             {location}
          </p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{current.tellOperator}</p>
      </div>

      <motion.button 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={sendSOS}
        className="w-full py-6 rounded-[40px] bg-white text-black font-black text-xl uppercase tracking-tighter shadow-2xl flex items-center justify-center gap-3 active:bg-orange-500 active:text-white transition-colors"
      >
        <Send size={24} />
        {current.sendSOS}
      </motion.button>
    </div>
  );
}
