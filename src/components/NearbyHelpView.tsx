import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Siren, 
  Pill, 
  Hospital, 
  Sandwich, 
  Home, 
  Building2, 
  RefreshCw,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { NearbyService, Language } from '../types';

interface NearbyHelpViewProps {
  language: Language;
}

export default function NearbyHelpView({ language }: NearbyHelpViewProps) {
  const [selectedType, setSelectedType] = useState<string>('hospital');
  const [liveLocation, setLiveLocation] = useState<{lat: number, lng: number} | null>(null);
  const [address, setAddress] = useState<string>('Finding your location...');
  const [isLocating, setIsLocating] = useState(false);
  const [isRadarActive, setIsRadarActive] = useState(false);
  const [radarProgress, setRadarProgress] = useState(0);
  const [distressSignals, setDistressSignals] = useState<any[]>([]);
  const [activeAlert, setActiveAlert] = useState<any | null>(null);
  const [isSOSBroadcasting, setIsSOSBroadcasting] = useState(false);
  const [sosStatus, setSosStatus] = useState<'idle' | 'sending' | 'helper-found'>('idle');

  const translations: Record<Language, { categories: any[], results: string, found: string, call: string, navigate: string, noResults: string, live: string, updated: string, radarScan: string, radarInfo: string, riskAlert: string, alertTitle: string, alertDesc: string, respondNow: string, ignore: string, nearbyHelp: string, broadcastSOS: string, sosActive: string, helperFound: string, helperDesc: string, vibrating: string }> = {
    [Language.ENGLISH]: {
      live: 'Live Location',
      updated: 'Updated just now',
      results: 'Nearby Results',
      found: 'found',
      call: 'Call',
      navigate: 'Navigate',
      noResults: 'No results found for this category nearby.',
      radarScan: 'Radar Scanner',
      radarInfo: 'Scanning for help near you...',
      riskAlert: 'HELP AT RISK DETECTED',
      alertTitle: 'DISTRESS SIGNAL',
      alertDesc: 'A person at risk has been identified nearby. Your assistance is requested.',
      respondNow: 'RESPOND NOW',
      ignore: 'IGNORE',
      nearbyHelp: 'People Needing Help',
      broadcastSOS: 'Broadcast SOS',
      sosActive: 'Broadcasting Signal...',
      helperFound: 'Helper Found!',
      helperDesc: 'A person nearby has received your signal and is coming to help.',
      vibrating: 'Sending pulse...',
      categories: [
        { id: 'hospital', label: 'Hospital', icon: <Hospital size={20} /> },
        { id: 'police', label: 'Police', icon: <Siren size={20} /> },
        { id: 'pharmacy', label: 'Pharmacy', icon: <Pill size={20} /> },
        { id: 'food', label: 'Food Help', icon: <Sandwich size={20} /> },
        { id: 'shelter', label: 'Shelter', icon: <Home size={20} /> },
        { id: 'gov', label: 'Gov Office', icon: <Building2 size={20} /> },
        { id: 'rural', label: 'Gram Panchayat/CSC', icon: <Home size={20} /> },
        { id: 'vet', label: 'Vet Clinic', icon: <MapPin size={20} /> },
      ]
    },
    [Language.HINDI]: {
      live: 'लाइव लोकेशन',
      updated: 'अभी अपडेट किया गया',
      results: 'आस-पास के परिणाम',
      found: 'मिले',
      call: 'कॉल करें',
      navigate: 'रास्ता देखें',
      noResults: 'आस-पास इस श्रेणी के लिए कोई परिणाम नहीं मिला।',
      radarScan: 'रडार स्कैनर',
      radarInfo: 'आपके पास मदद की तलाश की जा रही है...',
      riskAlert: 'जोखिम में मदद का पता चला',
      alertTitle: 'संकट संकेत',
      alertDesc: 'पास में एक जोखिम में व्यक्ति की पहचान की गई है। आपकी सहायता का अनुरोध है।',
      respondNow: 'अभी उत्तर दें',
      ignore: 'अनदेखा करें',
      nearbyHelp: 'मदद की जरूरत वाले लोग',
      broadcastSOS: 'एसओएस प्रसारित करें',
      sosActive: 'सिग्नल प्रसारित हो रहा है...',
      helperFound: 'सहायक मिल गया!',
      helperDesc: 'पास के एक व्यक्ति ने आपका सिग्नल प्राप्त कर लिया है और मदद के लिए आ रहा है।',
      vibrating: 'पल्स भेज रहा है...',
      categories: [
        { id: 'hospital', label: 'अस्पताल', icon: <Hospital size={20} /> },
        { id: 'police', label: 'पुलिस', icon: <Siren size={20} /> },
        { id: 'pharmacy', label: 'दवा की दुकान', icon: <Pill size={20} /> },
        { id: 'food', label: 'भोजन सहायता', icon: <Sandwich size={20} /> },
        { id: 'shelter', label: 'आश्रय', icon: <Home size={20} /> },
        { id: 'gov', label: 'सरकारी कार्यालय', icon: <Building2 size={20} /> },
        { id: 'rural', label: 'ग्राम पंचायत', icon: <Home size={20} /> },
        { id: 'vet', label: 'पशु अस्पताल', icon: <MapPin size={20} /> },
      ]
    },
    [Language.KANNADA]: {
      live: 'ಲೈವ್ ಸ್ಥಳ',
      updated: 'ಈಗಷ್ಟೇ ನವೀಕರಿಸಲಾಗಿದೆ',
      results: 'ಹತ್ತಿರದ ಫಲಿತಾಂಶಗಳು',
      found: 'ಕಂಡುಬಂದಿದೆ',
      call: 'ಕರೆ ಮಾಡಿ',
      navigate: 'ನ್ಯಾವಿಗೇಟ್',
      noResults: 'ಈ ವರ್ಗಕ್ಕೆ ಹತ್ತಿರದಲ್ಲಿ ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
      radarScan: 'ರಡಾರ್ ಸ್ಕ್ಯಾನರ್',
      radarInfo: 'ನಿಮ್ಮ ಹತ್ತಿರ ಸಹಾಯಕ್ಕಾಗಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
      riskAlert: 'ಅಪಾಯದಲ್ಲಿರುವ ಸಹಾಯ ಪತ್ತೆಯಾಗಿದೆ',
      alertTitle: 'ಸಂಕಷ್ಟ ಸಂಕೇತ',
      alertDesc: 'ಹತ್ತಿರದ ಒಬ್ಬ ವ್ಯಕ್ತಿ ಅಪಾಯದಲ್ಲಿದ್ದಾರೆ. ನಿಮ್ಮ ಸಹಾಯದ ಅಗತ್ಯವಿದೆ.',
      respondNow: 'ಈಗಲೇ ಪ್ರತಿಕ್ರಿಯಿಸಿ',
      ignore: 'ನಿರ್ಲಕ್ಷಿಸಿ',
      nearbyHelp: 'ಸಹಾಯ ಬೇಕಾದ ಜನರು',
      broadcastSOS: 'SOS ಪ್ರಸಾರ ಮಾಡಿ',
      sosActive: 'ಸಿಗ್ನಲ್ ಪ್ರಸಾರವಾಗುತ್ತಿದೆ...',
      helperFound: 'ಸಹಾಯಕರು ಸಿಕ್ಕಿದ್ದಾರೆ!',
      helperDesc: 'ಹತ್ತಿರದ ವ್ಯಕ್ತಿಯೊಬ್ಬರು ನಿಮ್ಮ ಸಿಗ್ನಲ್ ಅನ್ನು ಸ್ವೀಕರಿಸಿದ್ದಾರೆ ಮತ್ತು ಸಹಾಯ ಮಾಡಲು ಬರುತ್ತಿದ್ದಾರೆ.',
      vibrating: 'ಪಲ್ಸ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
      categories: [
        { id: 'hospital', label: 'ಆಸ್ಪತ್ರೆ', icon: <Hospital size={20} /> },
        { id: 'police', label: 'ಪೊಲೀಸ್', icon: <Siren size={20} /> },
        { id: 'pharmacy', label: 'ಫಾರ್ಮಸಿ', icon: <Pill size={20} /> },
        { id: 'food', label: 'ಆಹಾರ ಸಹಾಯ', icon: <Sandwich size={20} /> },
        { id: 'shelter', label: 'ಆಶ್ರಯ', icon: <Home size={20} /> },
        { id: 'gov', label: 'ಸರ್ಕಾರಿ ಕಚೇರಿ', icon: <Building2 size={20} /> },
      ]
    },
    [Language.TELUGU]: {
      live: 'లైవ్ లొకేషన్',
      updated: 'ఇప్పుడే అప్‌డేట్ చేయబడింది',
      results: 'సమీప ఫలితాలు',
      found: 'కనుగొనబడ్డాయి',
      call: 'కాల్ చేయండి',
      navigate: 'దారి చూపించు',
      noResults: 'సమీపంలో ఈ కేటగిరీకి ఫలితాలు లేవు.',
      radarScan: 'రాడార్ స్కానర్',
      radarInfo: 'మీ దగ్గర సహాయం కోసం స్కాన్ చేస్తున్నాము...',
      riskAlert: 'ప్రమాదంలో ఉన్న సహాయం గుర్తించబడింది',
      alertTitle: 'ప్రమాద సూచన',
      alertDesc: 'సమీపంలో ప్రమాదంలో ఉన్న వ్యక్తిని గుర్తించాము. మీ సహాయం కావాలి.',
      respondNow: 'ఇప్పుడే స్పందించండి',
      ignore: 'నిర్లక్ష్యం చేయండి',
      nearbyHelp: 'సహాయం అవసరమైన వ్యక్తులు',
      broadcastSOS: 'SOS బ్రాడ్‌కాస్ట్',
      sosActive: 'సిగ్నల్ పంపుతున్నాము...',
      helperFound: 'సహాయకుడు దొరికాడు!',
      helperDesc: 'సమీపంలోని వ్యక్తి మీ సిగ్నల్‌ను అందుకున్నారు మరియు సహాయం కోసం వస్తున్నారు.',
      vibrating: 'పల్స్ పంపుతున్నాము...',
      categories: [
        { id: 'hospital', label: 'ఆసుపత్రి', icon: <Hospital size={20} /> },
        { id: 'police', label: 'పోలీస్', icon: <Siren size={20} /> },
        { id: 'pharmacy', label: 'ఫార్మసీ', icon: <Pill size={20} /> },
        { id: 'food', label: 'ఆహార సహాయం', icon: <Sandwich size={20} /> },
        { id: 'shelter', label: 'ఆశ్రయం', icon: <Home size={20} /> },
        { id: 'gov', label: 'ప్రభుత్వ కార్యాలయం', icon: <Building2 size={20} /> },
      ]
    },
    [Language.TAMIL]: {
      live: 'நேரடி இருப்பிடம்',
      updated: 'இப்போது புதுப்பிக்கப்பட்டது',
      results: 'அருகிலுள்ள முடிவுகள்',
      found: 'காணப்பட்டது',
      call: 'அழைப்பு',
      navigate: 'வழிகாட்டுதல்',
      noResults: 'அருகிலுள்ள இந்த பிரிவில் முடிவுகள் எதுவும் இல்லை.',
      radarScan: 'ரேடார் ஸ்கேனர்',
      radarInfo: 'உங்களுக்கு அருகிலுள்ள உதவியை தேடுகிறது...',
      riskAlert: 'ஆபத்தில் உள்ள உதவி கண்டறியப்பட்டது',
      alertTitle: 'ஆபத்து சமிக்ஞை',
      alertDesc: 'அருகிலுள்ள ஒருவர் ஆபத்தில் இருப்பது கண்டறியப்பட்டது. உங்கள் உதவி தேவை.',
      respondNow: 'உடனே பதிலளிக்கவும்',
      ignore: 'புறக்கணி',
      nearbyHelp: 'உதவி தேவைப்படுபவர்கள்',
      broadcastSOS: 'SOS ஒளிபரப்பு',
      sosActive: 'சமிக்ஞை ஒளிபரப்பப்படுகிறது...',
      helperFound: 'உதவியாளர் கண்டுபிடிக்கப்பட்டார்!',
      helperDesc: 'அருகிலுள்ள ஒருவர் உங்கள் சமிக்ஞையைப் பெற்று உதவிக்கு வருகிறார்.',
      vibrating: 'துடிப்பு அனுப்பப்படுகிறது...',
      categories: [
        { id: 'hospital', label: 'மருத்துவமனை', icon: <Hospital size={20} /> },
        { id: 'police', label: 'காவல்துறை', icon: <Siren size={20} /> },
        { id: 'pharmacy', label: 'மருந்தகம்', icon: <Pill size={20} /> },
        { id: 'food', label: 'உணவு உதவி', icon: <Sandwich size={20} /> },
        { id: 'shelter', label: 'தங்குமிடம்', icon: <Home size={20} /> },
        { id: 'gov', label: 'அரசு அலுவலகம்', icon: <Building2 size={20} /> },
      ]
    },
    [Language.BENGALI]: {
      live: 'লাইভ লোকেশন',
      updated: 'এইমাত্র আপডেট করা হয়েছে',
      results: 'কাছাকাছি ফলাফল',
      found: 'পাওয়া গেছে',
      call: 'কল করুন',
      navigate: 'ন্যাভিগেট',
      noResults: 'কাছাকাছি এই বিভাগে কোনো ফলাফল পাওয়া যায়নি।',
      radarScan: 'রাডার স্ক্যানার',
      radarInfo: 'আপনার কাছাকাছি সাহায্যের সন্ধান করা হচ্ছে...',
      riskAlert: 'ঝুঁকিতে থাকা সাহায্য সনাক্ত করা হয়েছে',
      alertTitle: 'বিপদ সংকেত',
      alertDesc: 'কাছাকাছি একজন ঝুঁকিতে থাকা ব্যক্তিকে পাওয়া গেছে। আপনার সাহায্য প্রয়োজন।',
      respondNow: 'এখনই সাড়া দিন',
      ignore: 'উত্থাপন করুন',
      nearbyHelp: 'সাহায্য প্রয়োজন এমন মানুষ',
      broadcastSOS: 'SOS ব্রডকাস্ট',
      sosActive: 'সিগন্যাল পাঠানো হচ্ছে...',
      helperFound: 'সাহায্যকারী পাওয়া গেছে!',
      helperDesc: 'কাছাকাছি একজন আপনার সিগন্যাল পেয়েছেন এবং সাহায্যের জন্য আসছেন।',
      vibrating: 'পালস পাঠানো হচ্ছে...',
      categories: [
        { id: 'hospital', label: 'হাসপাতাল', icon: <Hospital size={20} /> },
        { id: 'police', label: 'পুলিশ', icon: <Siren size={20} /> },
        { id: 'pharmacy', label: 'ফার্মেসি', icon: <Pill size={20} /> },
        { id: 'food', label: 'খাবার সাহায্য', icon: <Sandwich size={20} /> },
        { id: 'shelter', label: 'আশ্রয়', icon: <Home size={20} /> },
        { id: 'gov', label: 'সরকারি অফিস', icon: <Building2 size={20} /> },
      ]
    }
  };

  const current = translations[language];

  const services: NearbyService[] = [
    { name: "City General Hospital", type: 'hospital', distance: "1.2 km", address: "Main Road, Sector 5", contact: "011-2345678" },
    { name: "Lifeline Pharmacy", type: 'pharmacy', distance: "450 m", address: "Station Market, Lane 2", contact: "+91-9876543210" },
    { name: "Modern Police Station", type: 'police', distance: "2.5 km", address: "Circle Office, West End", contact: "100" },
    { name: "Community Kitchen", type: 'food', distance: "3.2 km", address: "Panchayat Hall, South Wing", contact: "N/A" },
    { name: "Senior Care Center", type: 'shelter', distance: "5.0 km", address: "Green Valley Road", contact: "9988776655" },
    { name: "Sector 4 CSC Center", type: 'rural', distance: "1.0 km", address: "Market Block A", contact: "011-9988776" },
    { name: "Village Animal Clinic", type: 'vet', distance: "3.2 km", address: "Rural Path 9", contact: "9876543210" },
    { name: "Gram Panchayat Office", type: 'rural', distance: "2.1 km", address: "Central Square", contact: "N/A" }
  ];

  const getLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLiveLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setAddress(`Near Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        (error) => {
          setAddress("Unable to get location. Please enable GPS.");
          setIsLocating(false);
        }
      );
    } else {
      setAddress("Geolocation not supported.");
      setIsLocating(false);
    }
  };

  const handleStartRadar = () => {
    setIsRadarActive(true);
    setRadarProgress(0);
    setDistressSignals([]);
    setIsSOSBroadcasting(false);
    setSosStatus('idle');
    
    // Simulate radar scanning progress
    const interval = setInterval(() => {
      setRadarProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Randomly encounter a distress signal
        if (prev === 45) {
          const alert = {
            id: 'risk-1',
            name: 'Sunita Sharma',
            type: 'medical',
            locationName: 'Near Station Road, Sector 4',
            distance: '850m',
            contact: '+91-9988776655'
          };
          setDistressSignals(curr => [...curr, alert]);
          setTimeout(() => setActiveAlert(alert), 500);
        }
        
        if (prev === 75) {
          const alert = {
            id: 'risk-2',
            name: 'Rahul K.',
            type: 'safety',
            locationName: 'Panchayat Lane B',
            distance: '2.1km',
            contact: '+91-8877665544'
          };
          setDistressSignals(curr => [...curr, alert]);
        }

        return prev + 1;
      });
    }, 50);
  };

  const handleBroadcastSOS = () => {
    setIsSOSBroadcasting(true);
    setSosStatus('sending');
    
    // Vibrate device (if supported)
    if ("vibrate" in navigator) {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }

    // Simulate broadcast delay
    setTimeout(() => {
      setSosStatus('helper-found');
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }, 4000);
  };

  useEffect(() => {
    getLocation();
  }, []);

  const filtered = services.filter(s => s.type === selectedType || selectedType === 'all');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Live Location Card */}
      <section className="glass p-6 rounded-[32px] border-neon-blue/20 bg-neon-blue/5 overflow-hidden relative">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-blue/10 blur-3xl rounded-full" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-neon-blue">{current.live}</p>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-neon-blue animate-bounce" />
              <h3 className="text-lg font-bold truncate max-w-[200px]">{address}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock size={12} />
              <span>{current.updated}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleStartRadar}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-neon-blue flex items-center gap-2 border border-neon-blue/20"
            >
              <Radio size={18} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{current.radarScan}</span>
            </button>
            <button 
              onClick={getLocation}
              className={`p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all ${isLocating ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </section>

      {isRadarActive && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center">
          <AnimatePresence>
            {activeAlert && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
              >
                <div className="w-full max-w-sm glass border-red-500/30 p-8 rounded-[40px] shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
                  <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <AlertTriangle size={40} className="text-red-500 animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-red-500">{current.alertTitle}</h2>
                    <p className="text-sm font-medium">{activeAlert.name} • {activeAlert.distance}</p>
                    <p className="text-xs text-text-muted">{current.alertDesc}</p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60">Target Location</p>
                    <p className="text-xs font-bold">{activeAlert.locationName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => setActiveAlert(null)}
                      className="py-4 rounded-2xl bg-white/5 text-white/40 font-black text-[10px] uppercase tracking-widest border border-white/10"
                    >
                      {current.ignore}
                    </button>
                    <button className="py-4 rounded-2xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                      {current.respondNow}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <button onClick={() => setIsRadarActive(false)} className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <ArrowLeft size={24} />
            </button>
            <div className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 animate-pulse">
              <AlertTriangle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{current.riskAlert}</span>
            </div>
          </div>

          <div className="relative w-full aspect-square max-w-lg flex items-center justify-center">
            {/* Radar Rings */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.75,
                  ease: "easeOut"
                }}
                className="absolute w-full h-full border border-white/10 rounded-full"
              />
            ))}

            {/* Radar Line */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-neon-blue/20 rounded-full border-r border-neon-blue/40"
            />

            <div className="relative z-10 w-24 h-24 rounded-full bg-neon-blue/20 border border-neon-blue flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              {isSOSBroadcasting ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <AlertTriangle size={40} className="text-red-500" />
                </motion.div>
              ) : (
                <Radio size={40} className="text-neon-blue animate-pulse" />
              )}
            </div>

            {/* SOS Broadcast Pulse Rings */}
            {isSOSBroadcasting && [...Array(3)].map((_, i) => (
              <motion.div
                key={`sos-${i}`}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                className="absolute w-24 h-24 border-2 border-red-500 rounded-full"
              />
            ))}

            {/* Blips - Service Points */}
            {radarProgress > 20 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/4 left-1/3 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] border-4 border-white animate-pulse"
              />
            )}
            
            {/* Blips - Distress Signals */}
            {radarProgress > 45 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-red-500 rounded-full shadow-[0_0_25px_rgba(239,68,68,1)] border-4 border-white animate-ping"
              />
            )}
            
            {radarProgress > 75 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/2 right-1/4 w-5 h-5 bg-red-500 rounded-full shadow-[0_0_25px_rgba(239,68,68,1)] border-4 border-white animate-ping"
              />
            )}
          </div>

          <div className="text-center space-y-2 mt-8 z-10 px-6">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">
              {isSOSBroadcasting ? current.sosActive : current.radarScan}
            </h3>
            <p className="text-sm text-text-muted">
              {isSOSBroadcasting ? current.vibrating : current.radarInfo}
            </p>
          </div>

          {!isSOSBroadcasting ? (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 z-10"
            >
              <button 
                onClick={handleBroadcastSOS}
                className="px-8 py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center gap-3 active:scale-95 transition-transform"
              >
                <AlertTriangle size={20} />
                {current.broadcastSOS}
              </button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {sosStatus === 'helper-found' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 mx-6 p-6 glass border-emerald-500/30 rounded-3xl text-center space-y-4 max-w-sm"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-500 uppercase tracking-widest text-xs">{current.helperFound}</h4>
                    <p className="text-xs text-text-muted mt-1">{current.helperDesc}</p>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-neon-blue/20 text-neon-blue flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold">Helper: Vikram S.</p>
                      <p className="text-[8px] text-text-muted">Eta: 3 mins away</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <div className="mt-12 w-full px-6 max-w-md overflow-hidden relative">
             <div className="flex items-center justify-between mb-4 px-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{current.nearbyHelp}</p>
                <div className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest border border-red-500/20">
                  {distressSignals.length} Active
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-3 max-h-[30vh] overflow-y-auto no-scrollbar pb-8">
              {distressSignals.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-2xl glass border-red-500/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{s.name}</p>
                      <p className="text-[10px] text-text-muted italic">{s.locationName} • {s.distance}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full bg-red-500 text-white" onClick={() => setActiveAlert(s)}>
                    <Navigation size={16} />
                  </button>
                </motion.div>
              ))}

              {radarProgress > 30 && services.slice(0, 2).map((s, i) => (
                <motion.div
                  key={`service-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-2xl glass border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${s.type === 'hospital' || s.type === 'police' ? 'bg-red-500/20 text-red-500' : 'bg-neon-blue/20 text-neon-blue'}`}>
                      {s.type === 'hospital' ? <Hospital size={18} /> : <MapPin size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{s.name}</p>
                      <p className="text-[10px] text-text-muted italic">{s.distance}</p>
                    </div>
                  </div>
                  <a href={`tel:${s.contact}`} className="p-2 rounded-full bg-white/10 text-white">
                    <Phone size={16} />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {current.categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setSelectedType(cat.id)}
            className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
              selectedType === cat.id 
                ? 'bg-neon-blue border-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                : 'glass border-white/10 text-white/40'
            }`}
          >
            {cat.icon}
            <span className="text-[10px] font-bold uppercase tracking-tight">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">{current.results}</h4>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5">
            {filtered.length} {current.found}
          </span>
        </div>

        {filtered.length > 0 ? (
          filtered.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-[28px] glass border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h5 className="font-bold text-lg">{service.name}</h5>
                  <div className="flex items-center gap-1.5">
                    <div className="px-1.5 py-0.5 rounded-md bg-neon-blue/10 text-[10px] font-bold text-neon-blue">
                      {service.distance}
                    </div>
                    <p className="text-xs text-text-muted">{service.address}</p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle />
                </div>
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={`tel:${service.contact}`}
                  className="flex-1 py-3 bg-neon-blue/20 text-neon-blue rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-neon-blue/20 hover:bg-neon-blue/30 transition-all"
                >
                  <Phone size={14} /> {current.call}
                </a>
                <button className="flex-1 py-3 bg-white/5 text-white/70 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10 transition-all">
                  <Navigation size={14} /> {current.navigate}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center glass rounded-3xl border-dashed border-white/10">
            <MapPin size={40} className="mx-auto mb-3 opacity-10" />
            <p className="text-sm text-text-muted">{current.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}
