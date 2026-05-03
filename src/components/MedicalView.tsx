import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, AlertTriangle, CheckCircle, Info, Bell, Stethoscope, Hospital as HospitalIcon, Calendar, User, ArrowLeft, Clock, Trash2, Zap, MapPin } from 'lucide-react';
import { Language, MedicineInfo } from '../types';
import { analyzeMedicalImage } from '../lib/gemini';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const MEDICAL_TRANSLATIONS: Record<Language, any> = {
  [Language.ENGLISH]: {
    scan: 'Scan Medicine',
    surgeons: 'Top Surgeons',
    hospitals: 'Nearby Hospitals',
    reminders: 'Set Reminders',
    scanPrescription: 'Scan Prescription',
    cameraInfo: 'Camera or Image Upload',
    scanning: 'Scanning Receipt...',
    identifying: 'Identifying salt, price & usage',
    medicinesFound: 'Medicines Found',
    clearAll: 'Clear All',
    warning: 'WARNING: This information is AI-generated for help only. ALWAYS consult a qualified doctor before taking any medicine.',
    book: 'Book',
    surgeonsNearby: 'Top Surgeons Nearby',
    requestingLocation: 'Requesting Location...',
    back: 'Back',
    locationRequired: 'Location Required',
    tryAgain: 'Try Again',
    goBack: 'Go Back',
    personalizedResults: 'Personalized Results',
    browsingBasedOn: 'Browsing based on',
    distance: 'Distance',
    showDirections: 'Show Directions',
    firstAid: 'First Aid Guide',
    offlineFirstAid: 'Offline First Aid',
  },
  [Language.HINDI]: {
    scan: 'दवा स्कैन करें',
    surgeons: 'शीर्ष सर्जन',
    hospitals: 'आस-पास के अस्पताल',
    reminders: 'अनुस्मारक सेट करें',
    scanPrescription: 'नुस्खा स्कैन करें',
    cameraInfo: 'कैमरा या छवि अपलोड',
    scanning: 'रसीद स्कैन की जा रही है...',
    identifying: 'नमक, कीमत और उपयोग की पहचान',
    medicinesFound: 'दवाएं मिलीं',
    clearAll: 'सभी साफ करें',
    warning: 'चेतावनी: यह जानकारी केवल सहायता के लिए AI-जनित है। किसी भी दवा को लेने से पहले हमेशा एक योग्य डॉक्टर से परामर्श लें।',
    book: 'बुक करें',
    surgeonsNearby: 'आस-पास के शीर्ष सर्जन',
    requestingLocation: 'स्थान का अनुरोध किया जा रहा है...',
    back: 'पीछे',
    locationRequired: 'स्थान आवश्यक है',
    tryAgain: 'पुनः प्रयास करें',
    goBack: 'वापस जाएं',
    personalizedResults: 'व्यक्तिगत परिणाम',
    browsingBasedOn: 'आधारित ब्राउज़िंग',
    distance: 'दूरी',
    showDirections: 'दिशा-निर्देश दिखाएं',
    firstAid: 'प्राथमिक चिकित्सा मार्गदर्शिका',
    offlineFirstAid: 'ऑफलाइन प्राथमिक चिकित्सा',
  },
  [Language.KANNADA]: {
    scan: 'ಔಷಧ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    surgeons: 'ಉನ್ನತ ಶಸ್ತ್ರಚಿಕಿತ್ಸಕರು',
    hospitals: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    reminders: 'ಜ್ಞಾಪನೆಗಳನ್ನು ಹೊಂದಿಸಿ',
    scanPrescription: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    cameraInfo: 'ಕ್ಯಾಮೆರಾ ಅಥವಾ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್',
    scanning: 'ರಶೀದಿಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    identifying: 'ಲವಣಾಂಶ, ಬೆಲೆ ಮತ್ತು ಬಳಕೆಯನ್ನು ಗುರುತಿಸಲಾಗುತ್ತಿದೆ',
    medicinesFound: 'ಔಷಧಿಗಳು ಕಂಡುಬಂದಿವೆ',
    clearAll: 'ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ',
    warning: 'ಎಚ್ಚರಿಕೆ: ಈ ಮಾಹಿತಿಯು ಕೇವಲ ಸಹಾಯಕ್ಕಾಗಿ AI ಇಂದ ರಚಿಸಲ್ಪಟ್ಟಿದೆ. ಯಾವುದೇ ಔಷಧಿಯನ್ನು ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಯಾವಾಗಲೂ ಅರ್ಹ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    book: 'ಬುಕ್ ಮಾಡಿ',
    surgeonsNearby: 'ಹತ್ತಿರದ ಉನ್ನತ ಶಸ್ತ್ರಚಿಕಿತ್ಸಕರು',
    requestingLocation: 'ಸ್ಥಳಕ್ಕಾಗಿ ವಿನಂತಿಸಲಾಗುತ್ತಿದೆ...',
    back: 'ಹಿಂದಕ್ಕೆ',
    locationRequired: 'ಸ್ಥಳ ಅಗತ್ಯವಿದೆ',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    goBack: 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ',
    personalizedResults: 'ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಫಲಿತಾಂಶಗಳು',
    browsingBasedOn: 'ಆಧಾರಿತ ಬ್ರೌಸಿಂಗ್',
    distance: 'ದೂರ',
    showDirections: 'ದಿಕ್ಕುಗಳನ್ನು ತೋರಿಸು',
    firstAid: 'ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮಾರ್ಗದರ್ಶಿ',
    offlineFirstAid: 'ಆಫ್‌ಲೈನ್ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ',
  },
  [Language.TELUGU]: {
    scan: 'మందును స్కాన్ చేయండి',
    surgeons: 'టాప్ సర్జన్లు',
    hospitals: 'సమీపంలోని ఆసుపత్రులు',
    reminders: 'రిమైండర్‌లను సెట్ చేయండి',
    scanPrescription: 'ప్రిస్క్రిప్షన్ స్కాన్ చేయండి',
    cameraInfo: 'కెమెరా లేదా ఇమేజ్ అప్‌లోడ్',
    scanning: 'రసీదును స్కాన్ చేస్తోంది...',
    identifying: 'సాల్ట్, ధర మరియు వినియోగాన్ని గుర్తిస్తోంది',
    medicinesFound: 'మందులు కనుగొనబడ్డాయి',
    clearAll: 'అన్నీ తుడిచివేయి',
    warning: 'హెచ్చరిక: ఈ సమాచారం సహాయం కోసం మాత్రమే AI ద్వారా రూపొందించబడింది. ఏదైనా మందు తీసుకునే ముందు ఎల్లప్పుడూ అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.',
    book: 'బుక్ చేయండి',
    surgeonsNearby: 'సమీపంలోని అగ్ర సర్జన్లు',
    requestingLocation: 'స్థానం కోసం అభ్యర్థిస్తోంది...',
    back: 'వెనుకకు',
    locationRequired: 'స్థానం అవసరం',
    tryAgain: 'మళ్ళీ ప్రయత్నించండి',
    goBack: 'వెనక్కి వెళ్ళండి',
    personalizedResults: 'వ్యక్తిగతీకరించిన ఫలితాలు',
    browsingBasedOn: 'ఆధారంగా బ్రౌజింగ్',
    distance: 'దూరం',
    showDirections: 'దిశలను చూపించు',
    firstAid: 'ప్రథమ చికిత్స మార్గదర్శిని',
    offlineFirstAid: 'ఆఫ్‌లైన్ ప్రథమ చికిత్స',
  },
  [Language.TAMIL]: {
    scan: 'மருந்தை ஸ்கேன் செய்யுங்கள்',
    surgeons: 'சிறந்த அறுவை சிகிச்சை நிபுணர்கள்',
    hospitals: 'அருகிலுள்ள மருத்துவமனைகள்',
    reminders: 'நினைவூட்டல்களை அமைக்கவும்',
    scanPrescription: 'மருந்துச் சீட்டை ஸ்கேன் செய்யுங்கள்',
    cameraInfo: 'கேமரா அல்லது படப் பதிவேற்றம்',
    scanning: 'ரசீதை ஸ்கேன் செய்கிறது...',
    identifying: 'உப்பு, விலை மற்றும் பயன்பாட்டை அடையாளம் காணுதல்',
    medicinesFound: 'மருந்துகள் காணப்படுகின்றன',
    clearAll: 'அனைத்தையும் அழி',
    warning: 'எச்சரிக்கை: இந்தத் தகவல் உதவிக்காக மட்டுமே AI மூலம் உருவாக்கப்பட்டது. எந்த மருந்தையும் எடுத்துக்கொள்வதற்கு முன் எப்போதும் தகுதியுள்ள மருத்துவரை அணுகவும்.',
    book: 'பதிவு செய்யுங்கள்',
    surgeonsNearby: 'அருகிலுள்ள சிறந்த அறுவை சிகிச்சை நிபுணர்கள்',
    requestingLocation: 'இருப்பிடத்தைக் கோருகிறது...',
    back: 'பின்செல்',
    locationRequired: 'இருப்பிடம் தேவை',
    tryAgain: 'மீண்டும் முயற்சி செய்பவும்',
    goBack: 'பின் செல்',
    personalizedResults: 'தனிப்பயனாக்கப்பட்ட முடிவுகள்',
    browsingBasedOn: 'அடிப்படையில் உலாவல்',
    distance: 'தூரம்',
    showDirections: 'திசைகளைக் காட்டு',
    firstAid: 'முதலுதவி வழிகாட்டி',
    offlineFirstAid: 'ஆஃப்லைன் முதலுதவி',
  },
  [Language.BENGALI]: {
    scan: 'ওষুধ স্ক্যান করুন',
    surgeons: 'শীর্ষ সার্জন',
    hospitals: 'কাছাকাছি হাসপাতাল',
    reminders: 'রিমাইন্ডার সেট করুন',
    scanPrescription: 'প্রেসক্রিপশন স্ক্যান করুন',
    cameraInfo: 'ক্যামেরা বা ইমেজ আপলোড',
    scanning: 'রসিদ স্ক্যান করা হচ্ছে...',
    identifying: 'সল্ট, দাম এবং ব্যবহার শনাক্ত করা হচ্ছে',
    medicinesFound: 'ওষুধ পাওয়া গেছে',
    clearAll: 'সব মুছে ফেলুন',
    warning: 'সতর্কতা: এই তথ্যটি শুধুমাত্র সাহায্যের জন্য AI দ্বারা তৈরি। কোনো ওষুধ নেওয়ার আগে সর্বদা একজন যোগ্য ডাক্তারের সাথে পরামর্শ করুন।',
    book: 'বুক করুন',
    surgeonsNearby: 'কাছাকাছি শীর্ষ সার্জন',
    requestingLocation: 'লোকেশন অনুরোধ করা হচ্ছে...',
    back: 'পিছনে',
    locationRequired: 'লোকেশন প্রয়োজন',
    tryAgain: 'আবার চেষ্টা করুন',
    goBack: 'ফিরে যান',
    personalizedResults: 'ব্যক্তিগতকৃত ফলাফল',
    browsingBasedOn: 'ভিত্তিতে ব্রাউজিং',
    distance: 'দূরত্ব',
    showDirections: 'দিকনির্দেশ দেখান',
    firstAid: 'প্রাথমিক চিকিৎসা নির্দেশিকা',
    offlineFirstAid: 'অফলাইন প্রাথমিক চিকিৎসা',
  }
};

export default function MedicalView({ language }: { language: Language }) {
  const current = MEDICAL_TRANSLATIONS[language];

  const [medicines, setMedicines] = useState<MedicineInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'scan' | 'surgeons' | 'appointments' | 'reminders' | 'hospitals' | 'first-aid'>('scan');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(fetched);
    });

    return () => unsubscribe();
  }, []);

  const requestLocation = (autoOpenMaps = false) => {
    setLocationLoading(true);
    setLocationError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          setLocationLoading(false);
          
          if (autoOpenMaps) {
            const mapsUrl = `https://www.google.com/maps/search/hospitals+near+me/@${lat},${lng},15z`;
            window.open(mapsUrl, '_blank');
          }
        },
        (err) => {
          let message = "Could not get your location.";
          if (err.code === 1) message = "Location permission denied.";
          else if (err.code === 2) message = "Location unavailable.";
          setLocationError(message);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  useEffect(() => {
    if (viewMode === 'hospitals' || viewMode === 'surgeons') {
      if (!location) {
        requestLocation(viewMode === 'hospitals');
      }
    }
  }, [viewMode]);

  const confirmBooking = async () => {
    if (!auth.currentUser || !selectedDoctor) return;
    setIsBooking(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        hospital: selectedDoctor.hospital,
        date: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
        time: '10:30 AM',
        status: 'confirmed',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setSelectedDoctor(null);
      setViewMode('surgeons');
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsBooking(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeMedicalImage(base64);
      if (result && result.length > 0) {
        setMedicines(result);
      } else {
        setScanError("Could not find any medicines. Please make sure the image is clear.");
      }
      setIsScanning(false);
    };
    reader.onerror = () => {
      setScanError("File upload failed.");
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const topSurgeons = [
    { id: 1, name: "Dr. Arvind Kumar", specialty: "Cardiac Surgeon", hospital: "Max Super Specialty", location: "Saket, Delhi", rating: 4.9, image: "👨‍⚕️" },
    { id: 2, name: "Dr. Meena Iyer", specialty: "Neurosurgeon", hospital: "Apollo Hospitals", location: "Jubilee Hills, Hyderabad", rating: 4.8, image: "👩‍⚕️" },
    { id: 3, name: "Dr. Rahul Sharma", specialty: "Orthopedic", hospital: "Fortis Memorial", location: "Gurgaon", rating: 4.7, image: "👨‍⚕️" },
    { id: 4, name: "Dr. Priya Das", specialty: "Oncologist", hospital: "Tata Memorial", location: "Parel, Mumbai", rating: 4.9, image: "👩‍⚕️" },
  ];

  const hospitals = [
    { id: 1, name: "City General Hospital", location: "1.2 km away", emergency: true },
    { id: 2, name: "LifeCare Clinic", location: "2.5 km away", emergency: false },
    { id: 3, name: "Apollo Specialty", location: "4.1 km away", emergency: true },
  ];

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setViewMode('appointments');
  };

  return (
    <div className="space-y-6">
      {/* View Switcher */}
      <div className="flex gap-2 glass p-1 rounded-2xl">
        <button 
          onClick={() => setViewMode('scan')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'scan' ? 'bg-neon-blue text-white shadow-lg' : 'text-white/40'}`}
        >
          {current.scan}
        </button>
        <button 
          onClick={() => setViewMode('surgeons')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'surgeons' ? 'bg-neon-blue text-white shadow-lg' : 'text-white/40'}`}
        >
          {current.surgeons}
        </button>
      </div>

      {viewMode === 'scan' && (
        <div className="space-y-6">
          {/* Header Info */}
          <section className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 items-start">
            <Info className="text-blue-400 shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-bold text-blue-200">{current.scan}</p>
              <p className="text-white/60">{current.cameraInfo}</p>
            </div>
          </section>

          {/* Action Area */}
          {!medicines.length && !isScanning && (
            <div className="flex flex-col gap-4">
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-48 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 hover:bg-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Camera size={32} />
                </div>
                <span className="font-bold text-lg">{current.scanPrescription}</span>
                <span className="text-xs text-white/40">{current.cameraInfo}</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setViewMode('hospitals')}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all"
                >
                  <HospitalIcon className="text-red-400" />
                  <span className="text-sm font-medium">{current.hospitals}</span>
                </button>
                <button 
                  onClick={() => setViewMode('reminders')}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all"
                >
                   <Bell className="text-amber-400" />
                   <span className="text-sm font-medium">{current.reminders}</span>
                </button>
                <button 
                  onClick={() => setViewMode('first-aid')}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all col-span-2"
                >
                   <AlertTriangle className="text-emerald-400" />
                   <div className="text-left">
                     <p className="text-sm font-medium">{current.firstAid}</p>
                     <p className="text-[10px] text-white/40 uppercase font-black">{current.offlineFirstAid}</p>
                   </div>
                </button>
              </div>
            </div>
          )}

          {viewMode === 'reminders' && (
            <RemindersSection language={language} onBack={() => setViewMode('scan')} />
          )}

          {viewMode === 'hospitals' && (
            <HospitalsSection 
              language={language} 
              onBack={() => setViewMode('scan')} 
              location={location}
              loading={locationLoading}
              error={locationError}
              onRequestLocation={() => requestLocation(true)}
            />
          )}

          {/* Scanning State */}
          {isScanning && (
            <div className="py-12 flex flex-col items-center gap-6">
              <div className="relative">
                 <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-blue-400 animate-pulse" />
                 </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl mb-1">{current.scanning}</p>
                <p className="text-white/40 text-sm">{current.identifying}</p>
              </div>
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {medicines.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-bold text-lg">{current.medicinesFound} ({medicines.length})</h3>
                  <button 
                    onClick={() => setMedicines([])}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {current.clearAll}
                  </button>
                </div>
                
                {medicines.map((med, i) => (
                  <MedicineCard key={i} medicine={med} index={i} language={language} />
                ))}

                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-200">
                   <AlertTriangle className="shrink-0" size={20} />
                   <p className="text-xs font-medium">
                     {current.warning}
                   </p>
                </div>
              </div>
            )}
          </AnimatePresence>

          {scanError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
              {scanError}
            </div>
          )}
        </div>
      )}

      {viewMode === 'surgeons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Stethoscope className="text-neon-purple" />
              {current.surgeonsNearby}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5 uppercase font-black">
              {location ? `Near Current Location` : `Saket, Delhi`}
            </span>
          </div>

          {locationLoading && (
            <div className="py-10 text-center flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin" />
              <p className="text-[10px] uppercase font-black tracking-widest text-white/40">{current.requestingLocation}</p>
            </div>
          )}

          <div className="space-y-4">
            {topSurgeons.map((doctor) => (
              <motion.div 
                key={doctor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-5 rounded-[32px] border-white/5 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
                  {doctor.image}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{doctor.name}</h4>
                  <p className="text-xs text-neon-purple font-black uppercase tracking-tight">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                    <HospitalIcon size={12} />
                    <span>{doctor.hospital}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleBookAppointment(doctor)}
                  className="px-4 py-2 bg-neon-blue rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                >
                  Book
                </button>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 px-1">{current.hospitals}</h4>
            <div className="grid grid-cols-1 gap-3">
              {hospitals.map(h => (
                <button 
                  key={h.id} 
                  onClick={() => {
                    setViewMode('hospitals');
                  }}
                  className="w-full p-4 rounded-2xl glass border-white/5 flex items-center justify-between hover:bg-white/10 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${h.emergency ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      <HospitalIcon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{h.name}</p>
                      <p className="text-[10px] text-text-muted">{h.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {h.emergency && (
                      <span className="px-2 py-1 rounded bg-red-500/20 text-red-500 text-[8px] font-black uppercase">Emergency</span>
                    )}
                    <Zap size={14} className="text-white/20" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'first-aid' && (
        <FirstAidSection language={language} onBack={() => setViewMode('scan')} />
      )}

      {viewMode === 'appointments' && (
        <div className="space-y-6">
          <button 
            onClick={() => setViewMode('surgeons')}
            className="text-xs text-text-muted flex items-center gap-2 hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Surgeons
          </button>

          {!auth.currentUser ? (
            <div className="glass p-10 rounded-[40px] border-white/5 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto border-2 border-neon-blue shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <Calendar size={48} className="text-neon-blue" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Sign in to Book</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  To book an appointment and keep track of your medical schedule, please sign in with Google.
                </p>
              </div>
              <button 
                onClick={async () => {
                  const { signInWithGoogle } = await import('../lib/firebase');
                  await signInWithGoogle();
                }}
                className="w-full py-4 bg-neon-blue rounded-2xl font-black uppercase tracking-widest"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="glass p-8 rounded-[40px] border-neon-blue/20 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto border-2 border-neon-blue shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <Calendar size={48} className="text-neon-blue" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">Book Appointment</h3>
                <p className="text-text-muted">with {selectedDoctor?.name}</p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <User className="text-white/20" size={18} />
                   <input type="text" placeholder="Patient Name" className="bg-transparent outline-none flex-1 text-sm" />
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <Calendar className="text-white/20" size={18} />
                   <input type="date" className="bg-transparent outline-none flex-1 text-sm text-white/40" />
                </div>
              </div>

              <button 
                onClick={confirmBooking}
                disabled={isBooking}
                className="w-full py-4 bg-neon-blue rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-neon-blue/20 disabled:opacity-50"
              >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </button>
              <p className="text-[10px] text-text-muted">Booking Fee: ₹500 (Pay at Clinic)</p>
            </div>
          )}
        </div>
      )}

      {/* Appointment List Section (Visible in Surgeons view or below) */}
      {viewMode === 'surgeons' && appointments.length > 0 && (
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Calendar className="text-neon-blue" />
            My Booked Appointments
          </h3>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-2xl glass border-neon-blue/20 bg-neon-blue/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{apt.doctorName}</h4>
                    <p className="text-[10px] text-text-muted">{apt.specialty} • {apt.hospital}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-neon-blue flex items-center gap-1 font-bold">
                        <Calendar size={10} /> {apt.date}
                      </span>
                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <Clock size={10} /> {apt.time}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteAppointment(apt.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HospitalsSection({ language, onBack, location, loading, error, onRequestLocation }: { 
  language: Language, 
  onBack: () => void,
  location: {lat: number, lng: number} | null,
  loading: boolean,
  error: string | null,
  onRequestLocation: () => void
}) {
  const current = MEDICAL_TRANSLATIONS[language];

  const nearbyHospitals = [
    { id: 1, name: "City General Hospital", distance: "0.8 km", rating: 4.5, type: "Multi-specialty", address: "Main Road, Sector 4", emergency: true },
    { id: 2, name: "Metro Care Clinic", distance: "1.5 km", rating: 4.2, type: "General", address: "Green View Colony", emergency: false },
    { id: 3, name: "St. Jude Hospital", distance: "2.1 km", rating: 4.7, type: "Tertiary Care", address: "Beside Metro Station", emergency: true },
    { id: 4, name: "Sunrise Children's Hospital", distance: "3.4 km", rating: 4.8, type: "Pediatrics", address: "Link Road, Block B", emergency: true },
    { id: 5, name: "Orthocare Center", distance: "4.0 km", rating: 4.4, type: "Specialized Orthopedic", address: "Market Area", emergency: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
          <HospitalIcon className="text-red-500" /> {current.hospitals}
        </h3>
        <button onClick={onBack} className="text-xs text-text-muted hover:text-white flex items-center gap-1">
          <ArrowLeft size={14} /> {current.back}
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          <p className="text-sm font-bold animate-pulse">{current.requestingLocation}</p>
        </div>
      ) : error ? (
        <div className="p-10 text-center glass rounded-[40px] border-red-500/20 text-red-200">
          <AlertTriangle size={48} className="mx-auto mb-4 opacity-50 text-red-500" />
          <h4 className="font-bold text-lg mb-2">{current.locationRequired}</h4>
          <p className="text-sm opacity-70 mb-6 leading-relaxed max-w-xs mx-auto">{error}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={onRequestLocation}
              className="px-6 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
            >
              <MapPin size={18} /> {current.tryAgain}
            </button>
            <button onClick={onBack} className="text-xs text-text-muted hover:text-white transition-all">{current.goBack}</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
               <Zap size={16} />
             </div>
             <div className="text-xs">
                <p className="font-bold text-emerald-200">{current.personalizedResults}</p>
                <p className="text-emerald-400/60 uppercase font-black tracking-widest text-[9px]">
                  {current.browsingBasedOn} Lat: {location?.lat.toFixed(4)}, Lng: {location?.lng.toFixed(4)}
                </p>
             </div>
          </div>

          <div className="space-y-3">
            {nearbyHospitals.map(h => (
              <motion.div 
                key={h.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-[32px] glass border-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400/60">{h.type}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <span>★ {h.rating}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-lg">{h.name}</h4>
                    <p className="text-xs text-text-muted mt-1">{h.address}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black text-white/90">{h.distance}</p>
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{current.distance}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  {h.emergency && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
                       <Zap size={10} fill="currentColor" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Emergency Ready</span>
                    </div>
                  )}
                  <button className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                    {current.showDirections}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MedicineCardProps {
  medicine: MedicineInfo;
  index: number;
  language: Language;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, index, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const speakInfo = () => {
    // Left for potential text-to-text functionality if needed, but removed talk back
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              {medicine.category || 'General'}
            </span>
            <h4 className="text-xl font-bold text-white">{medicine.name}</h4>
            <p className="text-xs text-white/40 font-mono mt-0.5">{medicine.salt}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-emerald-400">{medicine.price}</p>
            <p className="text-[10px] text-white/30 tracking-tight">EST. PRICE</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-white/70 text-sm font-medium border border-white/10 hover:bg-white/10 transition-all"
          >
            {isExpanded ? 'Show Less' : 'Full Detail'}
          </button>
        </div>

        {isExpanded && (
           <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-6 pt-6 border-t border-white/5 space-y-4"
           >
             <div>
               <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Uses</p>
               <p className="text-sm text-white/80 leading-relaxed">{medicine.uses}</p>
             </div>
             <div>
               <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Benefits</p>
               <p className="text-sm text-white/80 leading-relaxed">{medicine.benefits}</p>
             </div>
             <div>
               <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Side Effects</p>
               <p className="text-sm text-white/70 leading-relaxed">{medicine.sideEffects}</p>
             </div>
             <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
               <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1">Safety Tips</p>
               <p className="text-xs text-amber-100/80 leading-relaxed">{medicine.safetyWarnings}</p>
             </div>
             <div>
               <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">Cheaper Substitutes</p>
               <div className="flex flex-wrap gap-2 mt-2">
                 {medicine.alternatives?.map((alt, j) => (
                   <span key={j} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">{alt}</span>
                 ))}
               </div>
             </div>
           </motion.div>
        )}
      </div>
    </motion.div>
  );
};

function FirstAidSection({ language, onBack }: { language: Language, onBack: () => void }) {
  const translations: Record<Language, any> = {
    [Language.ENGLISH]: {
      title: 'First Aid Guide',
      subtitle: 'Critical steps for emergencies. Accessible offline.',
      topics: [
        { title: 'Choking', steps: ['Stand behind the person.', 'Give 5 back blows.', 'Give 5 abdominal thrusts (Heimlich).'] },
        { title: 'Bleeding', steps: ['Apply direct pressure with clean cloth.', 'Elevate the wound.', 'Keep person warm.'] },
        { title: 'Burns', steps: ['Cool the burn with running water.', 'Do not use ice or ointments.', 'Cover loosely with sterile bandage.'] },
        { title: 'Fainting', steps: ['Lay person flat on their back.', 'Elevate legs about 12 inches.', 'Check breathing.'] }
      ]
    },
    [Language.HINDI]: {
      title: 'प्राथमिक चिकित्सा गाइड',
      subtitle: 'आपात स्थिति के लिए महत्वपूर्ण कदम। ऑफलाइन उपलब्ध।',
      topics: [
        { title: 'दम घुटना', steps: ['व्यक्ति के पीछे खड़े हों।', '5 बार पीठ पर थपथपाएं।', '5 बार पेट पर दबाव दें (हैमलिच)।'] },
        { title: 'रक्तस्राव', steps: ['साफ कपड़े से सीधा दबाव डालें।', 'घाव को ऊपर उठाएं।', 'व्यक्ति को गर्म रखें।'] },
        { title: 'जलना', steps: ['बहते पानी से जलन को ठंडा करें।', 'बर्फ या मलहम का प्रयोग न करें।', 'बाँझ पट्टी से ढीला ढकें।'] },
        { title: 'बेहोशी', steps: ['व्यक्ति को पीठ के बल लिटाएं।', 'पैरों को लगभग 12 इंच ऊपर उठाएं।', 'सांस की जाँच करें।'] }
      ]
    },
    [Language.KANNADA]: {
      title: 'ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮಾರ್ಗದರ್ಶಿ',
      subtitle: 'ತುರ್ತು ಸಂದರ್ಭಗಳಿಗಾಗಿ ನಿರ್ಣಾಯಕ ಹಂತಗಳು. ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ.',
      topics: [
        { title: 'ಉಸಿರುಗಟ್ಟುವಿಕೆ', steps: ['ವ್ಯಕ್ತಿಯ ಹಿಂದೆ ನಿಂತುಕೊಳ್ಳಿ.', '5 ಬಾರಿ ಬೆನ್ನಿಗೆ ಹೊಡೆಯಿರಿ.', '5 ಬಾರಿ ಕಿಬ್ಬೊಟ್ಟೆಯ ಒತ್ತಡವನ್ನು ನೀಡಿ (ಹೈಮ್ಲಿಚ್).'] },
        { title: 'ರಕ್ತಸ್ರಾವ', steps: ['ಶುದ್ಧ ಬಟ್ಟೆಯಿಂದ ನೇರ ಒತ್ತಡವನ್ನು ಅನ್ವಯಿಸಿ.', 'ಗಾಯವನ್ನು ಎತ್ತರಿಸಿ.', 'ವ್ಯಕ್ತಿಯನ್ನು ಬೆಚ್ಚಗಿಡಿ.'] },
        { title: 'ಸುಟ್ಟ ಗಾಯಗಳು', steps: ['ಹರಿಯುವ ನೀರಿನಿಂದ ಸುಟ್ಟ ಗಾಯವನ್ನು ತಣ್ಣಗಾಗಿಸಿ.', 'ಐಸ್ ಅಥವಾ ಮುಲಾಮುಗಳನ್ನು ಬಳಸಬೇಡಿ.', 'ಕ್ರಿಮಿನಾಶಕ ಬ್ಯಾಂಡೇಜ್ನಿಂದ ಸಡಿಲವಾಗಿ ಮುಚ್ಚಿ.'] },
        { title: 'ಪ್ರಜ್ಞೆ ತಪ್ಪುವುದು', steps: ['ವ್ಯಕ್ತಿಯನ್ನು ಬೆನ್ನಿನ ಮೇಲೆ ಮಲಗಿಸಿ.', 'ಕಾಲುಗಳನ್ನು ಸುಮಾರು 12 ಇಂಚುಗಳಷ್ಟು ಎತ್ತರಿಸಿ.', 'ಉಸಿರಾಟವನ್ನು ಪರೀಕ್ಷಿಸಿ.'] }
      ]
    },
    [Language.TELUGU]: {
      title: 'ప్రథమ చికిత్స మార్గదర్శిని',
      subtitle: 'అత్యవసర పరిస్థితుల కోసం కీలక దశలు. ఆఫ్‌లైన్‌లో అందుబాటులో ఉంది.',
      topics: [
        { title: 'ఊపిరి ఆడకపోవడం', steps: ['వ్యక్తి వెనుక నిలబడండి.', '5 సార్లు వెనుకన కొట్టండి.', '5 సార్లు పొత్తికడుపుపై ఒత్తిడి ఇవ్వండి (హైమ్లిచ్).'] },
        { title: 'రక్తస్రావం', steps: ['శుభ్రమైన గుడ్డతో నేరుగా ఒత్తిడి చేయండి.', 'గాయాన్ని పైకి ఎత్తండి.', 'వ్యక్తిని వెచ్చగా ఉంచండి.'] },
        { title: 'కాలిన గాయాలు', steps: ['ప్రవహించే నీటితో కాలిన గాయాన్ని చల్లబరచండి.', 'మంచు లేదా ములాములను ఉపయోగించవద్దు.', 'శుభ్రమైన బ్యాండేజీతో వదులుగా కప్పండి.'] },
        { title: 'స్పృహ తప్పడం', steps: ['వ్యక్తిని వెల్లకిలా పడుకోబెట్టండి.', 'కాళ్ళను సుమారు 12 అంగుళాల పైకి ఎత్తండి.', 'శ్వాసను తనిఖీ చేయండి.'] }
      ]
    },
    [Language.TAMIL]: {
      title: 'முதலுதவி வழிகாட்டி',
      subtitle: 'அவசரகால அத்தியாவசிய படிகள். ஆஃப்லைனில் அணுகலாம்.',
      topics: [
        { title: 'மூச்சுத்திணறல்', steps: ['நபருக்குப் பின்னால் நில்லுங்கள்.', 'முதுகில் 5 முறை தட்டவும்.', 'வயிற்றில் 5 முறை அழுத்தவும் (ஹெய்ம்லிச்).'] },
        { title: 'இரத்தப்போக்கு', steps: ['சுத்தமான துணியால் நேரடி அழுத்தம் கொடுக்கவும்.', 'காயத்தை உயர்த்தவும்.', 'நபரை கதகதப்பாக வைத்திருங்கள்.'] },
        { title: 'தீக்காயங்கள்', steps: ['ஓடும் நீரில் தீக்காயத்தைக் குளிர வைக்கவும்.', 'ஐஸ் அல்லது களிம்புகளைப் பயன்படுத்த வேண்டாம்.', 'சுத்தமான கட்டுப்போட்டு தளர்வாக மூடவும்.'] },
        { title: 'மயக்கம்', steps: ['நபரை நேராக மல்லாக்க படுக்க வைக்கவும்.', 'கால்களை சுமார் 12 அங்குலம் உயர்த்தவும்.', 'சுவாசத்தை சரிபார்க்கவும்.'] }
      ]
    },
    [Language.BENGALI]: {
      title: 'প্রাথমিক চিকিৎসা নির্দেশিকা',
      subtitle: 'জরুরি অবস্থার জন্য গুরুত্বপূর্ণ পদক্ষেপ। অফলাইনে উপলব্ধ।',
      topics: [
        { title: 'দম বন্ধ হয়ে যাওয়া', steps: ['ব্যক্তির পিছনে দাঁড়ান।', 'পিঠে ৫ বার চাপ দিন।', 'পেটে ৫ বার চাপ দিন (হেইমলিচ)।'] },
        { title: 'রক্তক্ষরণ', steps: ['পরিষ্কার কাপড় দিয়ে সরাসরি চাপ দিন।', 'ক্ষত স্থানটি উপরে তুলুন।', 'ব্যক্তিকে গরম রাখুন।'] },
        { title: 'পুড়ে যাওয়া', steps: ['চলমান জল দিয়ে পোড়া জায়গাটি ঠান্ডা করুন।', 'বরফ বা মলম ব্যবহার করবেন না।', 'জীবাণুমুক্ত ব্যান্ডেজ দিয়ে ঢিলেঢালাভাবে ঢেকে দিন।'] },
        { title: 'অজ্ঞান হওয়া', steps: ['ব্যক্তিকে চিত করে শুইয়ে দিন।', 'পা প্রায় ১২ ইঞ্চি উপরে তুলুন।', 'নিঃশ্বাস পরীক্ষা করুন।'] }
      ]
    }
  };

  const current = translations[language] || translations[Language.ENGLISH];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
          <AlertTriangle className="text-emerald-500" /> {current.title}
        </h3>
        <button onClick={onBack} className="text-xs text-text-muted hover:text-white flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <p className="text-sm text-text-muted">{current.subtitle}</p>

      <div className="space-y-4">
        {current.topics.map((topic: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-[32px] glass border-white/5"
          >
            <h4 className="font-bold text-lg text-emerald-400 mb-3">{topic.title}</h4>
            <div className="space-y-2">
              {topic.steps.map((step: string, j: number) => (
                <div key={j} className="flex gap-3 text-sm text-white/70">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                    {j + 1}
                  </span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RemindersSection({ language, onBack }: { language: Language, onBack: () => void }) {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMed, setNewMed] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [whatsapp, setWhatsapp] = useState(true);
  const [mobile, setMobile] = useState(true);
  const [alarmType, setAlarmType] = useState('bell');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReminders(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addReminder = async () => {
    if (!newMed.trim() || !auth.currentUser) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'reminders'), {
        medicineName: newMed,
        time: newTime,
        enableWhatsapp: whatsapp,
        enableMobile: mobile,
        alarmType: alarmType,
        active: true,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setNewMed('');
    } catch (err) {
      console.error("Error adding reminder:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reminders', id));
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  if (!auth.currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase">Medicine Reminders</h3>
          <button onClick={onBack} className="text-xs text-text-muted hover:text-white flex items-center gap-1">
            <ArrowLeft size={14} /> Back
          </button>
        </div>
        <div className="glass p-10 rounded-[40px] border-white/5 text-center space-y-6">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
            <Bell size={40} className="text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Sign in to Set Reminders</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              To receive notifications on your mobile and WhatsApp to take your medicine on time, please sign in.
            </p>
          </div>
          <button 
            onClick={async () => {
              const { signInWithGoogle } = await import('../lib/firebase');
              await signInWithGoogle();
            }}
            className="w-full py-4 bg-amber-500 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase">Medicine Reminders</h3>
        <button onClick={onBack} className="text-xs text-text-muted hover:text-white flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="glass p-6 rounded-[32px] border-amber-500/20 bg-amber-500/5 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Medicine Name</label>
              <input 
                type="text" 
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                placeholder="e.g. Paracetamol"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-amber-500 transition-all text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Time</label>
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-amber-500 transition-all text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setMobile(!mobile)}
              className={`px-4 py-3 rounded-2xl border flex items-center gap-2 transition-all ${mobile ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 text-white/40'}`}
            >
              <Bell size={18} />
              <span className="text-xs font-bold">Mobile Notification</span>
            </button>
            <button 
              onClick={() => setWhatsapp(!whatsapp)}
              className={`px-4 py-3 rounded-2xl border flex items-center gap-2 transition-all ${whatsapp ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'}`}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4" alt="WA" />
              <span className="text-xs font-bold">WhatsApp Message</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Alarm Type</label>
            <div className="flex gap-2">
              {['bell', 'siren', 'gentle', 'bird'].map((type) => (
                <button
                  key={type}
                  onClick={() => setAlarmType(type)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${alarmType === type ? 'bg-amber-500 text-black shadow-lg' : 'bg-white/5 border border-white/10 text-white/40'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={addReminder}
            disabled={isAdding || !newMed.trim()}
            className="w-full py-4 bg-amber-500 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 disabled:opacity-50"
          >
            {isAdding ? 'Setting Reminder...' : 'Set Reminder'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-black uppercase tracking-widest text-white/40 ml-2">Your Reminders</h4>
        {loading ? (
          <div className="py-10 text-center opacity-20">Loading...</div>
        ) : reminders.length === 0 ? (
          <div className="p-10 text-center glass rounded-3xl border-dashed border-white/10 text-white/20">
            No reminders set yet.
          </div>
        ) : (
          reminders.map((rem) => (
            <div key={rem.id} className="p-4 rounded-2xl glass border-white/10 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Clock size={24} />
                </div>
                <div>
                  <h5 className="font-bold">{rem.medicineName}</h5>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xl font-black text-white/90">{rem.time}</span>
                    <div className="flex items-center gap-2">
                       {rem.enableMobile && <Bell size={12} className="text-amber-400" />}
                       {rem.enableWhatsapp && <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-3 h-3" alt="WA" />}
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteReminder(rem.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-red-400 transition-all font-bold"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
