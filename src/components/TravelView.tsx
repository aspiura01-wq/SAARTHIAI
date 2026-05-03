import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, Train, Car, Navigation, CreditCard, Clock, Info, ArrowLeft, ExternalLink, Search, MapPin } from 'lucide-react';

import { Language } from '../types';

export default function TravelView({ language }: { language: Language }) {
  const [activeMode, setActiveMode] = useState<'main' | 'bus' | 'train' | 'cab' | 'maps'>('main');
  const [pnrNumber, setPnrNumber] = useState('');

  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      travelAssistant: 'Travel Assistant',
      travelDesc: 'Search for buses, trains, and local transport options.',
      busBooking: 'Bus Booking',
      busDesc: 'RedBus, AbhiBus & state buses',
      trainStatus: 'Train Status',
      trainDesc: 'PNR, Running status, Seat map',
      cabAuto: 'Cab / Auto',
      cabDesc: 'Uber, Ola, Rapido quick book',
      localMaps: 'Local Maps',
      localMapsDesc: 'Directions with current location',
      commonRoutes: 'Common Routes',
      railwayStation: 'Railway Station',
      cityCenter: 'City Center',
      home: 'Home',
      govHospital: 'Gov. Hospital',
      averageBusFare: 'Average Bus Fare',
      back: 'Back to Assistant',
      pnrLabel: 'Check PNR status',
      pnrPlaceholder: 'Enter 10-digit PNR',
      trackPNR: 'Track PNR Status',
      bookTicket: 'Book Ticket',
      liveStatus: 'Live Status',
    },
    [Language.HINDI]: {
      travelAssistant: 'यात्रा सहायक',
      travelDesc: 'बस, ट्रेन और स्थानीय परिवहन विकल्प खोजें।',
      busBooking: 'बस बुकिंग',
      busDesc: 'रेडबस, अभिबस और राज्य बसें',
      trainStatus: 'ट्रेन की स्थिति',
      trainDesc: 'पीएनआर, चलने की स्थिति, सीट मैप',
      cabAuto: 'कैब / ऑटो',
      cabDesc: 'उबर, ओला, रैपिडो क्विक बुक',
      localMaps: 'स्थानीय मानचित्र',
      localMapsDesc: 'वर्तमान स्थान के साथ दिशा-निर्देश',
      commonRoutes: 'सामान्य मार्ग',
      railwayStation: 'रेलवे स्टेशन',
      cityCenter: 'शहर का केंद्र',
      home: 'घर',
      govHospital: 'सरकारी अस्पताल',
      averageBusFare: 'औसत बस किराया',
      back: 'सहायक पर वापस जाएं',
      pnrLabel: 'पीएनआर स्थिति जांचें',
      pnrPlaceholder: '10-अंकीय पीएनआर दर्ज करें',
      trackPNR: 'पीएनआर स्थिति ट्रैक करें',
      bookTicket: 'टिकट बुक करें',
      liveStatus: 'सीधी स्थिति',
    },
    [Language.KANNADA]: {
      travelAssistant: 'ಪ್ರಯಾಣ ಸಹಾಯಕ',
      travelDesc: 'ಬಸ್‌ಗಳು, ರೈಲುಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಸಾರಿಗೆ ಆಯ್ಕೆಗಳಿಗಾಗಿ ಹುಡುಕಿ.',
      busBooking: 'ಬಸ್ ಬುಕಿಂಗ್',
      busDesc: 'ರೆಡ್‌ಬಸ್, ಅಬಿಬಸ್ ಮತ್ತು ರಾಜ್ಯ ಬಸ್‌ಗಳು',
      trainStatus: 'ರೈಲು ಸ್ಥಿತಿ',
      trainDesc: 'ಪಿಎನ್ಆರ್, ಚಾಲನೆಯಲ್ಲಿರುವ ಸ್ಥಿತಿ, ಆಸನ ನಕ್ಷೆ',
      cabAuto: 'ಕ್ಯಾಬ್ / ಆಟೋ',
      cabDesc: 'ಉಬರ್, ಓಲಾ, ರಾಪಿಡೋ ಶೀಘ್ರ ಬುಕಿಂಗ್',
      localMaps: 'ಸ್ಥಳೀಯ ನಕ್ಷೆಗಳು',
      localMapsDesc: 'ಪ್ರಸ್ತುತ ಸ್ಥಳದೊಂದಿಗೆ ದಿಕ್ಕುಗಳು',
      commonRoutes: 'ಸಾಮಾನ್ಯ ಮಾರ್ಗಗಳು',
      railwayStation: 'ರೈಲ್ವೇ ನಿಲ್ದಾಣ',
      cityCenter: 'ಸಿಟಿ ಸೆಂಟರ್',
      home: 'ಮನೆ',
      govHospital: 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ',
      averageBusFare: 'ಸರಾಸರಿ ಬಸ್ ಪ್ರಯಾಣ ದರ',
      back: 'ಸಹಾಯಕನಿಗೆ ಹಿಂತಿರುಗಿ',
      pnrLabel: 'ಪಿಎನ್ಆರ್ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
      pnrPlaceholder: '10-ಅಂಕಿಯ ಪಿಎನ್ಆರ್ ನಮೂದಿಸಿ',
      trackPNR: 'ಪಿಎನ್ಆರ್ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
      bookTicket: 'ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ',
      liveStatus: 'ಲೈವ್ ಸ್ಥಿತಿ',
    },
    [Language.TELUGU]: {
      travelAssistant: 'ప్రయాణ సహాయకుడు',
      travelDesc: 'బస్సులు, రైళ్లు మరియు స్థానిక రవాణా ఎంపికల కోసం శోధించండి.',
      busBooking: 'బస్సు బుకింగ్',
      busDesc: 'రెడ్‌బస్, అభిబస్ & రాష్ట్ర బస్సులు',
      trainStatus: 'రైలు స్థితి',
      trainDesc: 'PNR, రన్నింగ్ స్టేటస్, సీట్ మ్యాప్',
      cabAuto: 'క్యాబ్ / ఆటో',
      cabDesc: 'ఉబర్, ఓలా, రాపిడో క్విక్ బుక్',
      localMaps: 'స్థానిక మ్యాప్స్',
      localMapsDesc: 'ప్రస్తుత స్థానంతో దిశలు',
      commonRoutes: 'సాధారణ మార్గాలు',
      railwayStation: 'రైల్వే స్టేషన్',
      cityCenter: 'సిటీ సెంటర్',
      home: 'ఇల్లు',
      govHospital: 'ప్రభుత్వ ఆసుపత్రి',
      averageBusFare: 'సగటు బస్సు ఛార్జీ',
      back: 'సహాయకుడికి తిరిగి వెళ్ళండి',
      pnrLabel: 'PNR స్థితిని తనిఖీ చేయండి',
      pnrPlaceholder: '10 అంకెల PNR నమోదు చేయండి',
      trackPNR: 'PNR స్థితిని ట్రాక్ చేయండి',
      bookTicket: 'టికెట్ బుక్ చేయండి',
      liveStatus: 'లైవ్ స్టేటస్',
    },
    [Language.TAMIL]: {
      travelAssistant: 'பயண உதவியாளர்',
      travelDesc: 'பேருந்துகள், ரயில்கள் மற்றும் உள்ளூர் போக்குவரத்து விருப்பங்களைத் தேடுங்கள்.',
      busBooking: 'பேருந்து முன்பதிவு',
      busDesc: 'ரெட்பஸ், அபிபஸ் & அரசு பேருந்துகள்',
      trainStatus: 'ரயில் நிலை',
      trainDesc: 'பிஎன்ஆர், ஓடும் நிலை, இருக்கை வரைபடம்',
      cabAuto: 'கேப் / ஆட்டோ',
      cabDesc: 'உபெர், ஓலா, ரேபிடோ விரைவு முன்பதிவு',
      localMaps: 'உள்ளூர் வரைபடங்கள்',
      localMapsDesc: 'தற்போதைய இருப்பிடத்துடன் திசைகள்',
      commonRoutes: 'பொதுவான பாதைகள்',
      railwayStation: 'ரயில் நிலையம்',
      cityCenter: 'நகர மையம்',
      home: 'வீடு',
      govHospital: 'அரசு மருத்துவமனை',
      averageBusFare: 'சராசரி பேருந்து கட்டணம்',
      back: 'உதவியாளருக்குத் திரும்பு',
      pnrLabel: 'பிஎன்ஆர் நிலையைச் சரிபார்க்கவும்',
      pnrPlaceholder: '10 இலக்க பிஎன்ஆர் எண்ணை உள்ளிடவும்',
      trackPNR: 'பிஎன்ஆர் நிலையைத் தொடரவும்',
      bookTicket: 'டிக்கெட் முன்பதிவு',
      liveStatus: 'நேரடி நிலை',
    },
    [Language.BENGALI]: {
      travelAssistant: 'ভ্রমণ সহকারী',
      travelDesc: 'বাস, ট্রেন এবং স্থানীয় পরিবহনের বিকল্পগুলি খুঁজুন।',
      busBooking: 'বাস বুকিং',
      busDesc: 'রেডবাস, অভিাবাস এবং রাজ্য বাস',
      trainStatus: 'ট্রেনের স্থিতি',
      trainDesc: 'পিএনআর, রানিং স্ট্যাটাস, সিট ম্যাপ',
      cabAuto: 'ক্যাব / অটো',
      cabDesc: 'উবার, ওলা, র‍্যাপিডো কুইক বুক',
      localMaps: 'স্থানীয় মানচিত্র',
      localMapsDesc: 'বর্তমান অবস্থানের সাথে দিকনির্দেশ',
      commonRoutes: 'সাধারণ রুট',
      railwayStation: 'রেলওয়ে স্টেশন',
      cityCenter: 'সিটি সেন্টার',
      home: 'বাড়ি',
      govHospital: 'সরকারি হাসপাতাল',
      averageBusFare: 'গড় বাস ভাড়া',
      back: 'সহকারীর কাছে ফিরে যান',
      pnrLabel: 'পিএনআর স্থিতি পরীক্ষা করুন',
      pnrPlaceholder: '১০-সংখ্যার পিএনআর লিখুন',
      trackPNR: 'পিএনআর স্থিতি ট্র্যাক করুন',
      bookTicket: 'টিকিট বুক করুন',
      liveStatus: 'লাইভ স্ট্যাটাস',
    }
  };

  const current = translations[language];

  const options = [
    { id: 'bus', title: current.busBooking, desc: current.busDesc, icon: <Bus size={24} />, color: 'bg-emerald-500' },
    { id: 'train', title: current.trainStatus, desc: current.trainDesc, icon: <Train size={24} />, color: 'bg-orange-500' },
    { id: 'cab', title: current.cabAuto, desc: current.cabDesc, icon: <Car size={24} />, color: 'bg-amber-500' },
    { id: 'maps', title: current.localMaps, desc: current.localMapsDesc, icon: <Navigation size={24} />, color: 'bg-blue-500' },
  ];

  const handleMaps = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}`, '_blank');
      }, () => {
        window.open(`https://www.google.com/maps`, '_blank');
      });
    } else {
      window.open(`https://www.google.com/maps`, '_blank');
    }
  };

  const renderMain = () => (
    <div className="space-y-6">
       <section className="bg-purple-600/10 border border-purple-500/20 p-4 rounded-2xl flex gap-3 items-start">
        <Info className="text-purple-400 shrink-0 mt-1" size={20} />
        <div className="text-sm">
          <p className="font-bold text-purple-200">{current.travelAssistant}</p>
          <p className="text-white/60">{current.travelDesc}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        {options.map((opt, i) => (
          <motion.button 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => {
              if (opt.id === 'maps') handleMaps();
              else setActiveMode(opt.id as any);
            }}
            className="group flex items-center p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all text-left"
          >
            <div className={`p-4 rounded-2xl ${opt.color} shadow-lg shadow-black/20 mr-4 group-hover:scale-110 transition-transform`}>
              {opt.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">{opt.title}</h4>
              <p className="text-sm text-white/40">{opt.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Clock size={18} className="text-white/40" />
          {current.commonRoutes}
        </h4>
        <div className="space-y-3">
          {[
            { from: current.railwayStation, to: current.cityCenter, fare: '₹20 - ₹60' },
            { from: current.home, to: current.govHospital, fare: '₹15 - ₹40' },
          ].map((route, j) => (
            <div key={j} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <p className="text-sm font-bold">{route.from} → {route.to}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{current.averageBusFare}</p>
              </div>
              <p className="font-bold text-emerald-400">{route.fare}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {activeMode !== 'main' && (
        <button 
          onClick={() => setActiveMode('main')}
          className="mb-6 flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {current.back}
        </button>
      )}

      <AnimatePresence mode="wait">
        {activeMode === 'main' && renderMain()}

        {activeMode === 'bus' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Bus size={28} className="text-emerald-500" /> {current.busBooking}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <a href="https://www.redbus.in" target="_blank" rel="noopener noreferrer" className="p-6 glass rounded-[32px] border-emerald-500/20 hover:bg-emerald-500/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 font-black">R</div>
                  <div>
                    <h4 className="font-bold">RedBus</h4>
                    <p className="text-xs text-text-muted italic">#1 Bus Booking Platform</p>
                  </div>
                </div>
                <ExternalLink size={20} className="text-white/20 group-hover:text-emerald-500" />
              </a>
              <a href="https://www.abhibus.com" target="_blank" rel="noopener noreferrer" className="p-6 glass rounded-[32px] border-emerald-500/20 hover:bg-emerald-500/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 font-black">A</div>
                  <div>
                    <h4 className="font-bold">AbhiBus</h4>
                    <p className="text-xs text-text-muted italic">Great discounts & seat choice</p>
                  </div>
                </div>
                <ExternalLink size={20} className="text-white/20 group-hover:text-emerald-500" />
              </a>
              <a href="https://www.upsrtc.com" target="_blank" rel="noopener noreferrer" className="p-6 glass rounded-[32px] border-emerald-500/20 hover:bg-emerald-500/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 font-black">S</div>
                  <div>
                    <h4 className="font-bold">State Transport (UPSRTC)</h4>
                    <p className="text-xs text-text-muted italic">Official State Bus Booking</p>
                  </div>
                </div>
                <ExternalLink size={20} className="text-white/20 group-hover:text-emerald-500" />
              </a>
            </div>
          </motion.div>
        )}

        {activeMode === 'train' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Train size={28} className="text-orange-500" /> {current.trainStatus}
            </h3>
            
            <div className="glass p-8 rounded-[40px] border-orange-500/20 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">{current.pnrLabel}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={pnrNumber}
                    onChange={(e) => setPnrNumber(e.target.value)}
                    placeholder={current.pnrPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 outline-none focus:border-orange-500 transition-all text-white font-mono"
                  />
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                </div>
              </div>
              <button 
                onClick={() => window.open(`http://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?pnr=${pnrNumber}`, '_blank')}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20"
              >
                {current.trackPNR}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-3xl border-orange-500/10 text-center space-y-2 group">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <CreditCard size={18} />
                </div>
                <p className="text-xs font-bold">{current.bookTicket}</p>
              </a>
              <a href="https://enquiry.indianrail.gov.in" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-3xl border-orange-500/10 text-center space-y-2 group">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <Clock size={18} />
                </div>
                <p className="text-xs font-bold">{current.liveStatus}</p>
              </a>
            </div>
          </motion.div>
        )}

        {activeMode === 'cab' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Car size={28} className="text-amber-500" /> {current.cabAuto}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <a href="https://www.uber.com/in/en/" target="_blank" rel="noopener noreferrer" className="p-6 glass rounded-[32px] border-amber-500/20 hover:bg-amber-500/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black border border-white/20 flex items-center justify-center text-white font-black">U</div>
                  <div>
                    <h4 className="font-bold">Uber</h4>
                    <p className="text-xs text-text-muted italic">Quick cabs & premium rides</p>
                  </div>
                </div>
                <ExternalLink size={20} className="text-white/20 group-hover:text-amber-500" />
              </a>
              <a href="https://www.olacabs.com/" target="_blank" rel="noopener noreferrer" className="p-6 glass rounded-[32px] border-amber-500/20 hover:bg-amber-500/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black">O</div>
                  <div>
                    <h4 className="font-bold">Ola Cabs</h4>
                    <p className="text-xs text-text-muted italic">Auto & economical cabs</p>
                  </div>
                </div>
                <ExternalLink size={20} className="text-white/20 group-hover:text-amber-500" />
              </a>
              <a href="https://www.rapido.bike/" target="_blank" rel="noopener noreferrer" className="p-6 glass rounded-[32px] border-amber-500/20 hover:bg-amber-500/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-black font-black">R</div>
                  <div>
                    <h4 className="font-bold">Rapido</h4>
                    <p className="text-xs text-text-muted italic">Bike Taxis (Fastest for city)</p>
                  </div>
                </div>
                <ExternalLink size={20} className="text-white/20 group-hover:text-amber-500" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
