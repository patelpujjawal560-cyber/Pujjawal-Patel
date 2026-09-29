export type ComplaintStatus = 
  | 'SUBMITTED'           // शिकायत दर्ज (New)
  | 'LEGAL_REVIEW'        // विधिक जांच / अधिवक्ता समीक्षा
  | 'DM_NOTICE_SENT'      // डीएम व बीडीओ को कानूनी नोटिस प्रेषित
  | 'HIGH_COURT_PIL_FILED' // हाई कोर्ट में जनहित याचिका (PIL) दायर
  | 'WORK_SANCTIONED'     // सड़क निर्माण स्वीकृत व टेंडर जारी
  | 'COMPLETED';          // सड़क निर्माण पूर्ण (सत्यापित)

export interface Complaint {
  id: string;
  trackingNumber: string; // e.g. JS-2026-BR-0842
  title: string;
  photoUrl: string;
  roadCondition: 'UNBUILT_DIRT' | 'BROKEN_POTHOLES' | 'ABANDONED_CONSTRUCTION' | 'WATERLOGGED_SWAMP' | 'CORRUPTION_NO_ROAD';
  state: string;          // e.g. बिहार (Bihar)
  district: string;       // e.g. सारण (छपरा) / Saran
  blockOrTehsil: string;  // e.g. परसा (Parsa)
  gramPanchayat: string;  // e.g. परसा बुजुर्ग / रामपुर
  wardNumber: string;     // e.g. वार्ड नं 04
  mukhiyaName: string;    // e.g. श्री दिनेश कुमार सिंह (मुखिया)
  wardParshadName?: string; // e.g. श्री राकेश कुमार (वार्ड पार्षद)
  mlaName?: string;       // e.g. स्थानीय विधायक
  yearsPending: number;   // e.g. 7 साल से नहीं बनी
  roadLengthMeters?: number; // e.g. 1200m
  affectedPopulation?: number; // e.g. 2500 लोग
  description: string;
  problems: string[];     // ["बारिश में कीचड़", "एम्बुलेंस नहीं आ पाती", "स्कूली बच्चों की परेशानी", "फंड गबन का आरोप"]
  locationCoordinates?: {
    latitude: number;
    longitude: number;
    addressText: string;
  };
  complainantName: string;
  complainantPhone: string;
  isAnonymous: boolean;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  status: ComplaintStatus;
  statusHistory: {
    status: ComplaintStatus;
    updatedAt: string;
    note: string;
    authorityContacted?: string;
  }[];
  highCourtCaseDetails?: {
    highCourtName: string; // e.g. पटना उच्च न्यायालय (Patna High Court)
    caseNumber?: string;   // e.g. CWJC / PIL No. 4921/2026
    filingDate?: string;
    advocateName?: string;
    advocateRegistration?: string;
    courtHearingStatus?: string;
    nextDate?: string;
    officialNoticeIssuedTo?: string[];
  };
}

export interface LegalNoticeDraft {
  petitionTitle: string;
  highCourtName: string;
  courtArticle: string; // e.g. Article 226 of Constitution of India
  petitioners: string;
  respondents: string[];
  factsAndGrounds: string[];
  legalPrecedents: string[];
  prayers: string[];
  rtiQuestions: string[];
}
