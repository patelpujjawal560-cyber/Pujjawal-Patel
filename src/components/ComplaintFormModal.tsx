import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { STATES_DISTRICTS, SAMPLE_ROAD_PHOTOS } from '../mockData';
import { 
  X, 
  Camera, 
  Upload, 
  MapPin, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  ShieldCheck, 
  Sparkles,
  Info,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (complaint: Complaint) => void;
}

export const ComplaintFormModal: React.FC<ComplaintFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  // Form state
  const [selectedState, setSelectedState] = useState<string>('बिहार (Bihar)');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('सारण (छपरा) / Saran');
  const [blockOrTehsil, setBlockOrTehsil] = useState<string>('परसा (Parsa)');
  const [gramPanchayat, setGramPanchayat] = useState<string>('परसा पूर्वी (Parsa East)');
  const [wardNumber, setWardNumber] = useState<string>('वार्ड नं 04');
  
  const [mukhiyaName, setMukhiyaName] = useState<string>('श्री रामेश्वर राय (मुखिया)');
  const [wardParshadName, setWardParshadName] = useState<string>('श्री राजेश कुमार मांझी');
  const [mlaName, setMlaName] = useState<string>('माननीय स्थानीय विधायक');

  const [yearsPending, setYearsPending] = useState<number>(7);
  const [roadLengthMeters, setRoadLengthMeters] = useState<number>(850);
  const [affectedPopulation, setAffectedPopulation] = useState<number>(2500);

  const [roadCondition, setRoadCondition] = useState<Complaint['roadCondition']>('WATERLOGGED_SWAMP');
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_ROAD_PHOTOS[0].url);
  const [customPhotoSelected, setCustomPhotoSelected] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('परसा वार्ड नं. 04: 7 वर्षों से मुख्य संपर्क मार्ग अधूरा, भारी कीचड़ व जलजमाव');
  const [description, setDescription] = useState<string>(
    'यह सड़क मुख्य मार्ग से वार्ड नंबर 4 गांव को जोड़ती है। पिछले 7 वर्षों से लगातार पंचायत प्रतिनिधियों और मुखिया जी से अनुरोध किया गया लेकिन आज तक सड़क नहीं बनी। बारिश में 3 फीट गहरा कीचड़ हो जाता है, जिससे स्कूली बच्चे और बीमार लोग नहीं निकल पाते।'
  );

  const [selectedProblems, setSelectedProblems] = useState<string[]>([
    'एम्बुलेंस या आपातकालीन वाहन नहीं आ पाते',
    'स्कूली बच्चों व छात्राओं का स्कूल छूटना',
    'बारिश में 3 फीट गहरा कीचड़ व जलभराव',
    'पंचायत फंड आने के बाद भी निर्माण न होना (गबन)'
  ]);

  const [complainantName, setComplainantName] = useState<string>('उज्ज्वल पटेल व ग्रामवासी');
  const [complainantPhone, setComplainantPhone] = useState<string>('9876543210');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [gpsLocation, setGpsLocation] = useState<{ latitude: number; longitude: number; addressText: string } | null>({
    latitude: 25.8612,
    longitude: 85.0489,
    addressText: 'वार्ड 04, निकट प्राथमिक विद्यालय, परसा बाजार, सारण, बिहार'
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const availableDistricts = STATES_DISTRICTS[selectedState]?.districts || [];
  const availableBlocks = STATES_DISTRICTS[selectedState]?.blocks || [];

  if (!isOpen) return null;

  const handleProblemToggle = (problemText: string) => {
    if (selectedProblems.includes(problemText)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== problemText));
    } else {
      setSelectedProblems([...selectedProblems, problemText]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setCustomPhotoSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('आपके ब्राउज़र में जीपीएस लोकेशन सपोर्ट उपलब्ध नहीं है।');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLocation({
          latitude: parseFloat(pos.coords.latitude.toFixed(5)),
          longitude: parseFloat(pos.coords.longitude.toFixed(5)),
          addressText: `GPS पिन: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E (${wardNumber}, ${blockOrTehsil}, ${selectedDistrict})`
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error or denied:', err);
        setIsLocating(false);
        // Fallback default coordinate for Parsa
        setGpsLocation({
          latitude: 25.8612,
          longitude: 85.0489,
          addressText: `अनुमानित लोकेशन: ${wardNumber}, ${blockOrTehsil}, ${selectedDistrict}`
        });
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mukhiyaName.trim()) {
      alert('कृपया संबंधित मुखिया का नाम दर्ज करें।');
      return;
    }
    if (!wardNumber.trim()) {
      alert('कृपया वार्ड नंबर दर्ज करें।');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const stateCode = selectedState.includes('बिहार') ? 'BR' : 'IN';
    const cleanBlock = blockOrTehsil.split(' ')[0].replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '');
    const trackingNumber = `JS-2026-${stateCode}-${cleanBlock || 'ROAD'}-${randomSuffix}`;

    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}`,
      trackingNumber,
      title: title || `${blockOrTehsil} ${wardNumber}: ${yearsPending} वर्षों से सड़क निर्माण अधूरा`,
      photoUrl,
      roadCondition,
      state: selectedState,
      district: selectedDistrict,
      blockOrTehsil,
      gramPanchayat,
      wardNumber,
      mukhiyaName,
      wardParshadName,
      mlaName,
      yearsPending,
      roadLengthMeters,
      affectedPopulation,
      description,
      problems: selectedProblems.length > 0 ? selectedProblems : ['सड़क न बनने से आवागमन बाधित'],
      locationCoordinates: gpsLocation || {
        latitude: 25.8612,
        longitude: 85.0489,
        addressText: `${wardNumber}, ${gramPanchayat}, ${blockOrTehsil}, ${selectedDistrict}`
      },
      complainantName: isAnonymous ? 'गोपनीय नागरिक' : complainantName,
      complainantPhone: isAnonymous ? 'गोपनीय' : complainantPhone,
      isAnonymous,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      hasUpvoted: true,
      status: 'SUBMITTED',
      statusHistory: [
        {
          status: 'SUBMITTED',
          updatedAt: new Date().toISOString(),
          note: 'नागरिक द्वारा जन सड़क पोर्टल पर साक्ष्य, फोटो व मुखिया विवरण सहित शिकायत दर्ज कराई गई।'
        }
      ],
      highCourtCaseDetails: {
        highCourtName: selectedState.includes('बिहार') ? 'पटना उच्च न्यायालय (Patna High Court)' : 'माननीय उच्च न्यायालय',
        courtHearingStatus: 'विधिक सेल द्वारा प्रारंभिक परीक्षण प्रक्रियाधीन'
      }
    };

    onSubmit(newComplaint);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClose();
  };

  const problemOptions = [
    'एम्बुलेंस या आपातकालीन वाहन नहीं आ पाते',
    'स्कूली बच्चों व छात्राओं का स्कूल छूटना',
    'बारिश में 3 फीट गहरा कीचड़ व जलभराव',
    'पंचायत फंड आने के बाद भी निर्माण न होना (गबन)',
    'बीमार व बुजुर्गों को खाट पर ढोना पड़ता है',
    'सड़क पर नुकीले पत्थर व आए दिन दुर्घटनाएं',
    'किसानों की फसल मंडी तक न पहुंचना',
    'ठेकेदार आधा काम छोड़ कर फरार हो गया'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                सड़क निर्माण शिकायत व विधिक साक्ष्य फॉर्म
              </h2>
              <p className="text-xs text-slate-300">
                फोटो खींचें, परसा/प्रखंड, वार्ड व मुखिया का नाम दर्ज करें — हाई कोर्ट PIL हेतु अग्रसारित होगा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-800">

          {/* Alert Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">सत्यापित विधिक प्रक्रिया:</strong> आपकी शिकायत दर्ज होते ही विधिक सेल द्वारा संबंधित डीएम (DM) एवं बीडीओ (BDO) को 15-दिवसीय विधिक नोटिस प्रेषित किया जाएगा। यदि नियत समय में संज्ञान नहीं लिया गया, तो माननीय उच्च न्यायालय में अनुच्छेद 226 के तहत जनहित याचिका (PIL) दायर की जाएगी।
            </div>
          </div>

          {/* Section 1: Photo Evidence */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600" />
                1. सड़क का फोटो साक्ष्य (Photo Evidence)
              </label>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                * अनिवार्य
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Preview & Upload */}
              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden h-52 bg-slate-100 flex flex-col items-center justify-center group">
                <img
                  src={photoUrl}
                  alt="Road evidence preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 hover:bg-slate-100">
                    <Upload className="w-4 h-4 text-amber-600" />
                    गैलरी / कैमरा से चुनें
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sample realistic road conditions quick click */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-600 block mb-2">
                    या त्वरित चयन हेतु सामान्य स्थिति चुनें (Quick Presets):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_ROAD_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(sample.url);
                          setCustomPhotoSelected(false);
                        }}
                        className={`text-left p-2 rounded-xl border text-xs transition-all flex items-center gap-2 ${
                          photoUrl === sample.url
                            ? 'border-amber-500 bg-amber-50/80 font-bold text-amber-950 ring-2 ring-amber-400/40'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="truncate">
                          <span className="block truncate font-semibold">{sample.title}</span>
                          <span className="text-[10px] text-slate-500">{sample.tag}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    सड़क की वर्तमान दशा (Road Condition Type):
                  </label>
                  <select
                    value={roadCondition}
                    onChange={(e) => setRoadCondition(e.target.value as Complaint['roadCondition'])}
                    className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="WATERLOGGED_SWAMP">बारिश में कीचड़ व 3 फीट गहरा जलभराव (Mud & Flooded)</option>
                    <option value="UNBUILT_DIRT">कच्चा रास्ता, आजादी के बाद कभी नहीं बनी सड़क (Never Built)</option>
                    <option value="ABANDONED_CONSTRUCTION">अधूरा निर्माण / संवेदक गिट्टी डालकर फरार (Abandoned)</option>
                    <option value="BROKEN_POTHOLES">टूटी सड़क व जानलेवा गड्ढे (Severe Potholes)</option>
                    <option value="CORRUPTION_NO_ROAD">कागजों में सड़क पूर्ण दिखाई, धरातल पर शून्य (Corruption)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location & Administrative Hierarchy */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                2. स्थान, प्रदेश, जिला, प्रखंड (परसा आदि) व वार्ड विवरण
              </label>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'लोकेशन खोज रहे हैं...' : 'GPS ऑटो-डिटेक्ट'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  प्रदेश (State) *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const newDistricts = STATES_DISTRICTS[e.target.value]?.districts || [];
                    if (newDistricts.length > 0) setSelectedDistrict(newDistricts[0]);
                  }}
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Object.keys(STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  जिला (District) *
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {availableDistricts.map((dst) => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                  <option value="अन्य जिला (Other District)">अन्य जिला (Other)</option>
                </select>
              </div>

              {/* Block / Tehsil (e.g. Parsa) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  प्रखंड / तहसील (Block - e.g. परसा) *
                </label>
                <input
                  type="text"
                  value={blockOrTehsil}
                  onChange={(e) => setBlockOrTehsil(e.target.value)}
                  placeholder="उदा. परसा (Parsa), मढ़ौरा, लालगंज"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Gram Panchayat */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ग्राम पंचायत (Gram Panchayat) *
                </label>
                <input
                  type="text"
                  value={gramPanchayat}
                  onChange={(e) => setGramPanchayat(e.target.value)}
                  placeholder="उदा. परसा बुजुर्ग / रामपुर"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Ward Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  वार्ड नंबर (Ward No.) *
                </label>
                <input
                  type="text"
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value)}
                  placeholder="उदा. वार्ड नं 04"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* GPS coordinates text display */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  स्थान / पता / लैंडमार्क
                </label>
                <input
                  type="text"
                  value={gpsLocation?.addressText || ''}
                  onChange={(e) =>
                    setGpsLocation(prev => ({
                      latitude: prev?.latitude || 25.8612,
                      longitude: prev?.longitude || 85.0489,
                      addressText: e.target.value
                    }))
                  }
                  placeholder="उदा. प्राथमिक विद्यालय के समीप, परसा"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Responsible Representatives & Pending Years */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-amber-600" />
              3. जिम्मेदार जनप्रतिनिधि (मुखिया) एवं कितने वर्षों से नहीं बनी
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {/* Mukhiya Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  संबंधित मुखिया का नाम (Mukhiya Name) *
                </label>
                <input
                  type="text"
                  value={mukhiyaName}
                  onChange={(e) => setMukhiyaName(e.target.value)}
                  placeholder="उदा. श्री दिनेश कुमार सिंह (मुखिया)"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Ward Parshad / Member */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  वार्ड सदस्य / पार्षद का नाम
                </label>
                <input
                  type="text"
                  value={wardParshadName}
                  onChange={(e) => setWardParshadName(e.target.value)}
                  placeholder="उदा. श्री राजेश मांझी"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* MLA */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  स्थानीय विधायक / विधानसभा
                </label>
                <input
                  type="text"
                  value={mlaName}
                  onChange={(e) => setMlaName(e.target.value)}
                  placeholder="उदा. विधायक परसा विधानसभा"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Years Pending Slider & Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200">
              
              {/* Slider: Kitne saal se nahi bani */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    कितने साल से नहीं बन पाया?
                  </label>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                    {yearsPending} वर्ष
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={yearsPending}
                  onChange={(e) => setYearsPending(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>1 साल</span>
                  <span>10 साल</span>
                  <span>20 साल</span>
                  <span>30+ साल</span>
                </div>
              </div>

              {/* Road Length */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  सड़क की लंबाई (मीटर में)
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={roadLengthMeters}
                  onChange={(e) => setRoadLengthMeters(parseInt(e.target.value, 10) || 500)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-slate-500">लगभग {roadLengthMeters} मीटर ({(roadLengthMeters / 1000).toFixed(1)} किमी)</span>
              </div>

              {/* Affected Population */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  प्रभावित ग्रामीण आबादी
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={affectedPopulation}
                  onChange={(e) => setAffectedPopulation(parseInt(e.target.value, 10) || 1000)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-slate-500">लगभग {affectedPopulation}+ ग्रामीण परेशान</span>
              </div>

            </div>
          </div>

          {/* Section 4: Specific Problems & Description */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              4. मुख्य परेशानियां एवं जन-समस्याएं (Checklist for High Court Evidence)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {problemOptions.map((prob) => {
                const isChecked = selectedProblems.includes(prob);
                return (
                  <label
                    key={prob}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-amber-50/80 border-amber-400 font-semibold text-amber-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleProblemToggle(prob)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>{prob}</span>
                  </label>
                );
              })}
            </div>

            {/* Title & Detailed Narrative */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  शिकायत का शीर्षक (Complaint Headline)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. परसा वार्ड 04 मुख्य सड़क 7 साल से बदहाल..."
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  विस्तृत विवरण (विधिक व जनहित याचिका के लिए मुख्य तथ्य)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="सड़क की वास्तविक स्थिति, ग्रामीणों को हो रही दिक्कतें, कब-कब मुखिया से कहा गया..."
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 5: Complainant Details */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                5. शिकायतकर्ता / याचिकाकर्ता विवरण (Petitioners Info)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>पहचान गोपनीय रखें (Anonymous)</span>
              </label>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    आपका नाम / ग्रामवासियों का नाम *
                  </label>
                  <input
                    type="text"
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    placeholder="उदा. उज्ज्वल पटेल व समस्त ग्रामवासी"
                    className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required={!isAnonymous}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    मोबाइल नंबर (सूचना एवं स्टेटस हेतु) *
                  </label>
                  <input
                    type="tel"
                    value={complainantPhone}
                    onChange={(e) => setComplainantPhone(e.target.value)}
                    placeholder="उदा. 9876543210"
                    className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required={!isAnonymous}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview Guarantee Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  स्वतः हाई कोर्ट PIL प्रारूप तैयार होगा
                </h4>
                <p className="text-xs text-slate-300">
                  यह फॉर्म सबमिट होते ही संविधान के अनुच्छेद 226 के तहत हाई कोर्ट याचिका, DM को 15-दिवसीय विधिक नोटिस और RTI ड्राफ्ट तुरंत तैयार हो जाएंगे।
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 block">विधिक अधिकार</span>
              <span className="text-xs font-bold text-emerald-400">अनुच्छेद 21 (Right to Road)</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>शिकायत दर्ज करें व विधिक कार्यवाही शुरू करें</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
