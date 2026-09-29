import { Complaint } from './types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'complaint-1',
    trackingNumber: 'JS-2026-BR-PARSA-01',
    title: 'परसा प्रखंड वार्ड नं. 04: मुख्य सड़क से दलित बस्ती तक 8 वर्षों से सड़क नदारद, भारी कीचड़',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
    roadCondition: 'WATERLOGGED_SWAMP',
    state: 'बिहार (Bihar)',
    district: 'सारण (छपरा) / Saran',
    blockOrTehsil: 'परसा (Parsa)',
    gramPanchayat: 'परसा पूर्वी (Parsa East)',
    wardNumber: 'वार्ड नं 04',
    mukhiyaName: 'श्री रामेश्वर राय (मुखिया)',
    wardParshadName: 'श्री राजेश कुमार मांझी (वार्ड सदस्य)',
    mlaName: 'माननीय विधायक परसा विधानसभा',
    yearsPending: 8,
    roadLengthMeters: 850,
    affectedPopulation: 2200,
    description: 'यह सड़क परसा मुख्य बाजार से वार्ड नंबर 4 बस्ती की तरफ जाती है। पिछले 8 सालों से पंचायत चुनाव में सिर्फ वादे किए गए पर आज तक ईंट भी नहीं बिछाई गई। बारिश के दिनों में 3 फीट कीचड़ और गंदा पानी भर जाता है। पिछले महीने एक गर्भवती महिला को खटिया पर उठाकर अस्पताल ले जाना पड़ा।',
    problems: [
      'एम्बुलेंस या आपातकालीन वाहन नहीं आ पाते',
      'स्कूली बच्चों व छात्राओं का स्कूल छूटना',
      'बारिश में 3 फीट गहरा कीचड़ व जलभराव',
      'पंचायत फंड आने के बाद भी निर्माण न होना',
      'बीमार व बुजुर्गों को खाट पर ढोना पड़ता है'
    ],
    locationCoordinates: {
      latitude: 25.8612,
      longitude: 85.0489,
      addressText: 'वार्ड नं 04, निकट प्राथमिक विद्यालय, परसा बाजार, सारण, बिहार - 841219'
    },
    complainantName: 'उज्ज्वल पटेल व समस्त ग्रामवासी',
    complainantPhone: '98******45',
    isAnonymous: false,
    createdAt: '2026-09-20T10:30:00Z',
    upvotes: 184,
    hasUpvoted: false,
    status: 'DM_NOTICE_SENT',
    statusHistory: [
      {
        status: 'SUBMITTED',
        updatedAt: '2026-09-20T10:30:00Z',
        note: 'नागरिक द्वारा जन सड़क पोर्टल पर साक्ष्य व फोटो सहित शिकायत दर्ज कराई गई।'
      },
      {
        status: 'LEGAL_REVIEW',
        updatedAt: '2026-09-22T14:15:00Z',
        note: 'अधिवक्ता सेल द्वारा जांच पूर्ण। अनुच्छेद 21 व बिहार पंचायती राज अधिनियम 2006 का स्पष्ट उल्लंघन पाया गया।'
      },
      {
        status: 'DM_NOTICE_SENT',
        updatedAt: '2026-09-24T11:00:00Z',
        note: 'जिलाधिकारी (DM सारण) व बीडीओ (BDO परसा) को 15 दिवसीय विधिक मांग पत्र (Legal Demand Notice) प्रेषित। 15 दिन में संज्ञान न लेने पर पटना उच्च न्यायालय में जनहित याचिका (PIL) दर्ज होगी।',
        authorityContacted: 'DM Saran & BDO Parsa (Speed Post & Official Email)'
      }
    ],
    highCourtCaseDetails: {
      highCourtName: 'पटना उच्च न्यायालय (Patna High Court)',
      caseNumber: 'Draft PIL Petition Ref: PIL-SARAN/2026/89',
      advocateName: 'विधि सलाहकार व जनहित विधिक दल',
      courtHearingStatus: 'हाई कोर्ट याचिका प्रारूप तैयार (Pre-filing Notice Issued to DM & PWD)',
      officialNoticeIssuedTo: [
        'जिला पदाधिकारी (DM), सारण, बिहार',
        'प्रखंड विकास पदाधिकारी (BDO), परसा, सारण',
        'कार्यपालक अभियंता, ग्रामीण कार्य विभाग (PWD), मढ़ौरा/छपरा',
        'मुखिया, ग्राम पंचायत परसा पूर्वी'
      ]
    }
  },
  {
    id: 'complaint-2',
    trackingNumber: 'JS-2026-BR-VAISH-02',
    title: 'लालगंज प्रखंड वार्ड नं. 09: 10 साल से अधूरा सड़क निर्माण, ठेकेदार फरार, सिर्फ गिट्टी फेंक कर छोड़ी',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    roadCondition: 'ABANDONED_CONSTRUCTION',
    state: 'बिहार (Bihar)',
    district: 'वैशाली (हाजीपुर) / Vaishali',
    blockOrTehsil: 'लालगंज (Lalganj)',
    gramPanchayat: 'भगवानपुर दियारा',
    wardNumber: 'वार्ड नं 09',
    mukhiyaName: 'श्रीमती संजू देवी (मुखिया)',
    wardParshadName: 'श्री सुधीर राय',
    yearsPending: 10,
    roadLengthMeters: 1400,
    affectedPopulation: 3100,
    description: 'वर्ष 2016 में सड़क का शिलान्यास हुआ था। बोर्ड लगा था 48 लाख रुपये का। केवल नुकीली गिट्टियां डालकर छोड़ दिया गया जिसपर रोज मोटरसाइकिल व साइकिल पंचर होती है। बच्चे फिसलकर गंभीर घायल हो चुके हैं। आरटीआई में पता चला कि 80% बिल का भुगतान निकाल लिया गया पर सड़क आज तक नहीं बनी।',
    problems: [
      'सरकारी बजट की निकासी के बावजूद सड़क अधूरी (गबन)',
      'नुकीले पत्थरों से आए दिन दुर्घटनाएं व चोट',
      'कृषकों की फसल मंडियों तक नहीं पहुंच पाती',
      'ठेकेदार और जनप्रतिनिधि का कोई अता-पता नहीं'
    ],
    locationCoordinates: {
      latitude: 25.8675,
      longitude: 85.1764,
      addressText: 'वार्ड नं 09, दियारा रोड, लालगंज, वैशाली, बिहार'
    },
    complainantName: 'रविन्द्र कुमार सिंह',
    complainantPhone: '94******12',
    isAnonymous: false,
    createdAt: '2026-09-14T09:00:00Z',
    upvotes: 247,
    hasUpvoted: true,
    status: 'HIGH_COURT_PIL_FILED',
    statusHistory: [
      {
        status: 'SUBMITTED',
        updatedAt: '2026-09-14T09:00:00Z',
        note: 'शिकायत व आरटीआई कागजात सहित ऑनलाइन सबमिट।'
      },
      {
        status: 'DM_NOTICE_SENT',
        updatedAt: '2026-09-16T15:00:00Z',
        note: 'डीएम वैशाली को कानूनी नोटिस दिया गया, कोई जवाब नहीं मिलने पर रिट याचिका तैयार की गई।'
      },
      {
        status: 'HIGH_COURT_PIL_FILED',
        updatedAt: '2026-09-25T11:30:00Z',
        note: 'पटना हाईकोर्ट में अनुच्छेद 226 के तहत रिट याचिका (CWJC No. 3812/2026) पंजीकृत। मुख्य न्यायाधीश की खंडपीठ के समक्ष सुनवाई सूचीबद्ध।',
        authorityContacted: 'Patna High Court Registrar General (PIL Cell)'
      }
    ],
    highCourtCaseDetails: {
      highCourtName: 'पटना उच्च न्यायालय (Patna High Court)',
      caseNumber: 'CWJC (PIL) No. 3812/2026',
      filingDate: '25-Sep-2026',
      advocateName: 'अधिवक्ता आशुतोष वर्मा (Adv. Patna High Court)',
      advocateRegistration: 'BR/7841/2014',
      courtHearingStatus: 'याचिका स्वीकार - सरकार एवं ग्रामीण कार्य विभाग को कारण बताओ नोटिस (Show Cause Notice) जारी',
      nextDate: '14-Oct-2026',
      officialNoticeIssuedTo: [
        'प्रधान सचिव, ग्रामीण कार्य विभाग, बिहार सरकार',
        'जिला पदाधिकारी (DM), वैशाली',
        'निगरानी अन्वेषण ब्यूरो (Vigilance Bureau) - वित्तीय अनियमितता जांच'
      ]
    }
  },
  {
    id: 'complaint-3',
    trackingNumber: 'JS-2026-UP-GORAKH-03',
    title: 'बांसगांव तहसील वार्ड 06: आजादी के बाद से अब तक पक्की सड़क नहीं, 500 घरों का संपर्क कटा',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1000&q=80',
    roadCondition: 'UNBUILT_DIRT',
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    district: 'गोरखपुर / Gorakhpur',
    blockOrTehsil: 'बांसगांव (Bansgaon)',
    gramPanchayat: 'कौड़ीराम खुर्द',
    wardNumber: 'वार्ड नं 06',
    mukhiyaName: 'श्री वीरेंद्र प्रताप सिंह (ग्राम प्रधान)',
    wardParshadName: 'श्री मुन्ना लाल',
    yearsPending: 15,
    roadLengthMeters: 1800,
    affectedPopulation: 4500,
    description: 'गांव के मुख्य लिंक रोड की दूरी 1.8 किलोमीटर है। पिछले 15 वर्षों में 3 बार प्रधान बदले, विधायक बदले, हर बार चुनाव से पहले घोषणा हुई लेकिन चुनाव के बाद कोई देखने तक नहीं आया। बरसात में कीचड़ छाती तक भर जाता है। बच्चों की शादियां तक कट रही हैं क्योंकि गांव में कोई गाड़ी नहीं आ पाती।',
    problems: [
      '15 वर्षों से जनप्रतिनिधियों की निरंतर उपेक्षा',
      'आपातकाल में कोई भी चार पहिया वाहन प्रवेश असंभव',
      'गांव के युवाओं की शिक्षा व रोजगार में भारी बाधा',
      'सुप्रीम कोर्ट के अनुच्छेद 21 दिशा-निर्देशों का हनन'
    ],
    locationCoordinates: {
      latitude: 26.5583,
      longitude: 83.3551,
      addressText: 'वार्ड 06, कौड़ीराम रोड, बांसगांव, गोरखपुर, उत्तर प्रदेश'
    },
    complainantName: 'सत्यम त्रिपाठी',
    complainantPhone: '87******90',
    isAnonymous: false,
    createdAt: '2026-09-18T16:20:00Z',
    upvotes: 312,
    hasUpvoted: false,
    status: 'LEGAL_REVIEW',
    statusHistory: [
      {
        status: 'SUBMITTED',
        updatedAt: '2026-09-18T16:20:00Z',
        note: 'ग्रामीणों के संयुक्त हस्ताक्षर व जीपीएस फोटो सहित शिकायत प्राप्त।'
      },
      {
        status: 'LEGAL_REVIEW',
        updatedAt: '2026-09-23T10:00:00Z',
        note: 'इलाहाबाद उच्च न्यायालय (High Court of Judicature at Allahabad) में जनहित याचिका का प्रारूप तैयार किया जा रहा है।'
      }
    ],
    highCourtCaseDetails: {
      highCourtName: 'इलाहाबाद उच्च न्यायालय (Allahabad High Court)',
      caseNumber: 'Draft Writ-C (PIL) / 2026',
      courtHearingStatus: 'विधिक नोटिस ड्राफ्टिंग एवं साक्ष्य संकलन जारी'
    }
  }
];

export const STATES_DISTRICTS: Record<string, { districts: string[]; blocks: string[] }> = {
  'बिहार (Bihar)': {
    districts: [
      'सारण (छपरा) / Saran',
      'पटना (Patna)',
      'वैशाली (हाजीपुर) / Vaishali',
      'मुजफ्फरपुर (Muzaffarpur)',
      'सीवान (Siwan)',
      'गोपालगंज (Gopalganj)',
      'समस्तीपुर (Samastipur)',
      'दरभंगा (Darbhanga)',
      'गया (Gaya)',
      'भागलपुर (Bhagalpur)',
      'पूर्णिया (Purnia)',
      'पूर्वी चंपारण (Motihari)',
      'पश्चिमी चंपारण (Bettiah)'
    ],
    blocks: [
      'परसा (Parsa)',
      'दरियापुर (Dariyapur)',
      'मकेर (Maker)',
      'मढ़ौरा (Marhaura)',
      'अमनौर (Amnour)',
      'सोनपुर (Sonpur)',
      'दिघवारा (Dighwara)',
      'गड़खा (Garkha)',
      'छपरा सदर (Chhapra Sadar)',
      'हाजीपुर (Hajipur)',
      'लालगंज (Lalganj)',
      'महुआ (Mahua)',
      'दानापुर (Danapur)',
      'फुलवारीशरीफ (Phulwarisharif)'
    ]
  },
  'उत्तर प्रदेश (Uttar Pradesh)': {
    districts: [
      'गोरखपुर (Gorakhpur)',
      'वाराणसी (Varanasi)',
      'प्रयागराज (Prayagraj)',
      'लखनऊ (Lucknow)',
      'बलिया (Ballia)',
      'देवरिया (Deoria)',
      'गाजीपुर (Ghazipur)',
      'आजमगढ़ (Azamgarh)',
      'कानपुर (Kanpur)'
    ],
    blocks: [
      'बांसगांव (Bansgaon)',
      'कौड़ीराम (Kauriram)',
      'सहजनवा (Sahjanwa)',
      'कैंपियरगंज (Campierganj)',
      'पिंडरा (Pindra)',
      'करछना (Karchhana)'
    ]
  },
  'झारखंड (Jharkhand)': {
    districts: ['रांची (Ranchi)', 'धनबाद (Dhanbad)', 'बोकारो (Bokaro)', 'हजारीबाग (Hazaribagh)', 'देवघर (Deoghar)'],
    blocks: ['कांके (Kanke)', 'ओरमांझी (Ormanjhi)', 'तोपचांची (Topchanchi)', 'गोविंदपुर (Govindpur)']
  },
  'मध्य प्रदेश (Madhya Pradesh)': {
    districts: ['भोपाल (Bhopal)', 'इंदौर (Indore)', 'ग्वालियर (Gwalior)', 'जबलपुर (Jabalpur)', 'रीवा (Rewa)'],
    blocks: ['हुजूर (Huzur)', 'फंदा (Phanda)', 'सावेर (Sanwer)', 'मुरार (Morar)']
  },
  'राजस्थान (Rajasthan)': {
    districts: ['जयपुर (Jaipur)', 'जोधपुर (Jodhpur)', 'अलवर (Alwar)', 'सीकर (Sikar)', 'कोटा (Kota)'],
    blocks: ['सांगानेर (Sanganer)', 'आमेर (Amer)', 'लक्ष्मणगढ़ (Laxmangarh)', 'बहरोड़ (Behror)']
  }
};

export const SAMPLE_ROAD_PHOTOS = [
  {
    title: 'कीचड़ व गहरा गड्ढा (Muddy Swamp)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
    tag: 'अति-गंभीर (Critical)'
  },
  {
    title: 'टूटी सड़क व बिखरी गिट्टी (Potholes & Stones)',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    tag: 'अधूरा निर्माण (Incomplete)'
  },
  {
    title: 'कच्चा रास्ता, कभी नहीं बनी सड़क (Never Constructed)',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1000&q=80',
    tag: 'शून्य निर्माण (Zero Work)'
  },
  {
    title: 'जलजमाव व नाला जाम (Waterlogged & Flooded)',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    tag: 'जलभराव (Flooded)'
  }
];
