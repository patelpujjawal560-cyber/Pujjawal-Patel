import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { 
  generateHighCourtPIL, 
  generateLegalNoticeText, 
  generateRTIText,
  getHighCourtForState 
} from '../services/legalDraftGenerator';
import { 
  X, 
  Scale, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  Gavel, 
  Calendar,
  UserCheck
} from 'lucide-react';

interface HighCourtLegalHubModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    newStatus: ComplaintStatus,
    note: string,
    courtDetails?: Complaint['highCourtCaseDetails'],
    authorityContacted?: string
  ) => void;
  userRole: 'CITIZEN' | 'ADVOCATE';
}

export const HighCourtLegalHubModal: React.FC<HighCourtLegalHubModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onUpdateStatus,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState<'PIL_PETITION' | 'DM_NOTICE' | 'RTI_APPLICATION' | 'CASE_TRACKER'>('PIL_PETITION');
  const [copied, setCopied] = useState<boolean>(false);

  // Advocate status update form
  const [advocateCaseNumber, setAdvocateCaseNumber] = useState<string>(
    complaint?.highCourtCaseDetails?.caseNumber || `CWJC (PIL) No. ${Math.floor(1000 + Math.random() * 9000)}/2026`
  );
  const [advocateName, setAdvocateName] = useState<string>(
    complaint?.highCourtCaseDetails?.advocateName || 'अधिवक्ता, उच्च न्यायालय विधिक प्रकोष्ठ'
  );
  const [advocateNextDate, setAdvocateNextDate] = useState<string>(
    complaint?.highCourtCaseDetails?.nextDate || '18-Oct-2026'
  );
  const [advocateHearingStatus, setAdvocateHearingStatus] = useState<string>(
    complaint?.highCourtCaseDetails?.courtHearingStatus || 'याचिका स्वीकार - DM व पथ निर्माण विभाग को 4 सप्ताह में जवाब तलब'
  );
  const [selectedTargetStatus, setSelectedTargetStatus] = useState<ComplaintStatus>(
    complaint?.status || 'HIGH_COURT_PIL_FILED'
  );

  if (!isOpen || !complaint) return null;

  const pilDraft = generateHighCourtPIL(complaint);
  const dmNoticeText = generateLegalNoticeText(complaint);
  const rtiText = generateRTIText(complaint);
  const courtName = getHighCourtForState(complaint.state);

  const getActiveTextToCopy = () => {
    switch (activeTab) {
      case 'PIL_PETITION':
        return `
${pilDraft.petitionTitle}

IN THE MATTER OF:
${pilDraft.petitioners}
... PETITIONER(S)

VERSUS

${pilDraft.respondents.join('\n')}
... RESPONDENTS

WRIT PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA
PRAYING FOR ISSUANCE OF A WRIT IN THE NATURE OF MANDAMUS OR ANY OTHER APPROPRIATE WRIT FOR IMMEDIATE CONSTRUCTION OF ROAD IN ${complaint.wardNumber}, BLOCK ${complaint.blockOrTehsil}, DISTRICT ${complaint.district}.

FACTS & GROUNDS:
${pilDraft.factsAndGrounds.map((f, i) => `${i + 1}. ${f}`).join('\n\n')}

LEGAL PRECEDENTS & LANDMARK CITATIONS:
${pilDraft.legalPrecedents.map((p, i) => `[${i + 1}] ${p}`).join('\n')}

PRAYERS:
${pilDraft.prayers.map((pr, i) => `(${String.fromCharCode(97 + i)}) ${pr}`).join('\n\n')}

VERIFICATION & AFFIDAVIT
Verified at ${complaint.district} on ${new Date().toLocaleDateString('hi-IN')}.
        `.trim();
      case 'DM_NOTICE':
        return dmNoticeText;
      case 'RTI_APPLICATION':
        return rtiText;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    const text = getActiveTextToCopy();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppSendNotice = () => {
    const text = `⚖️ *विधिक मांग पत्र / जनहित याचिका (PIL) विधिक सूचना* ⚖️\n\n📌 *विषय:* ${complaint.district}, प्रखंड: ${complaint.blockOrTehsil}, ${complaint.wardNumber} में पिछले ${complaint.yearsPending} वर्षों से सड़क निर्माण न होने बाबत।\n👤 *जिम्मेदार मुखिया:* ${complaint.mukhiyaName}\n🏛️ *अदालत:* ${courtName}\n\n*सर्वोच्च न्यायालय नज़ीर:* सड़क का अधिकार संविधान के अनुच्छेद 21 के तहत मौलिक अधिकार है (State of H.P. v. Umed Ram Sharma).\n\n📄 संपूर्ण कानूनी नोटिस व हाई कोर्ट PIL ड्राफ्ट देखें: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSaveCourtEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(
      complaint.id,
      selectedTargetStatus,
      `हाई कोर्ट में विधिक कार्यवाही अद्यतन: ${advocateHearingStatus}`,
      {
        highCourtName: courtName,
        caseNumber: advocateCaseNumber,
        filingDate: new Date().toLocaleDateString('en-GB'),
        advocateName,
        courtHearingStatus: advocateHearingStatus,
        nextDate: advocateNextDate,
        officialNoticeIssuedTo: [
          `जिला पदाधिकारी (DM), ${complaint.district}`,
          `प्रखंड विकास पदाधिकारी (BDO), ${complaint.blockOrTehsil}`,
          `कार्यपालक अभियंता, ग्रामीण कार्य विभाग, ${complaint.district}`,
          `मुखिया: ${complaint.mukhiyaName}`
        ]
      },
      `Honourable High Court PIL Cell (${courtName})`
    );
    alert('हाई कोर्ट केस विवरण सफलतापूर्वक अद्यतन कर दिया गया है!');
    setActiveTab('CASE_TRACKER');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[94vh] flex flex-col">
        
        {/* Top Court Header */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Gavel className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    High Court Public Interest Litigation (PIL) Redressal Cell
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white font-['Rozha_One',serif]">
                  {courtName} — विधिक निवारण प्रकोष्ठ
                </h2>
                <p className="text-xs text-slate-400">
                  केस आईडी: <span className="text-amber-300 font-mono font-bold">{complaint.trackingNumber}</span> | {complaint.wardNumber}, प्रखंड: {complaint.blockOrTehsil} ({complaint.district})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-5 border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab('PIL_PETITION')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'PIL_PETITION'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>1. हाई कोर्ट PIL याचिका (Art. 226)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DM_NOTICE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'DM_NOTICE'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. DM व BDO को 15-दिवसीय विधिक नोटिस</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('RTI_APPLICATION')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'RTI_APPLICATION'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>3. RTI आवेदन (फंड व गबन जांच)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CASE_TRACKER')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CASE_TRACKER'
                  ? 'bg-blue-600 text-white shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>4. हाई कोर्ट केस स्टेटस व आदेश ट्रैकर</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* TAB 1: HIGH COURT PIL PETITION */}
          {activeTab === 'PIL_PETITION' && (
            <div className="space-y-6">
              {/* Supreme Court Authority Card */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 text-xs sm:text-sm">
                <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">संवैधानिक नज़ीर (Constitutional Mandate):</strong> माननीय सर्वोच्च न्यायालय ने <em>State of H.P. vs Umed Ram Sharma (AIR 1986 SC 847)</em> में फैसला दिया है कि हर नागरिक को सुगम पक्की सड़क उपलब्ध कराना राज्य का दायित्व है और यह अनुच्छेद 21 (जीने का अधिकार) का अनिवार्य अंग है। ग्राम पंचायत मुखिया ({complaint.mukhiyaName}) व जिला प्रशासन द्वारा {complaint.yearsPending} सालों से सड़क न बनाना संविधान का स्पष्ट उल्लंघन है।
                </div>
              </div>

              {/* Legal Petition Document Sheet */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm font-serif text-slate-900 text-sm leading-relaxed space-y-6">
                
                {/* Header */}
                <div className="text-center border-b pb-4">
                  <h3 className="font-bold text-base sm:text-lg tracking-wide uppercase">
                    IN THE HIGH COURT OF JUDICATURE AT {courtName.toUpperCase()}
                  </h3>
                  <p className="text-xs uppercase text-slate-600 mt-1 font-sans font-semibold">
                    EXTRAORDINARY WRIT JURISDICTION
                  </p>
                  <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                    {complaint.highCourtCaseDetails?.caseNumber || 'CIVIL WRIT JURISDICTION CASE (PIL) NO. _____ OF 2026'}
                  </p>
                </div>

                {/* Parties */}
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-sans font-bold text-slate-500 uppercase block">याचिकाकर्ता (Petitioner):</span>
                    <p className="font-semibold text-slate-900">
                      {pilDraft.petitioners}
                    </p>
                    <span className="text-xs italic text-slate-600 block text-right">... याचक / Petitioner(s)</span>
                  </div>

                  <div className="text-center font-sans font-bold text-xs text-slate-400">
                    — VERSUS —
                  </div>

                  <div>
                    <span className="text-xs font-sans font-bold text-slate-500 uppercase block">उत्तरदातागण (Respondents):</span>
                    <ul className="list-none space-y-1 font-medium text-slate-800 text-xs sm:text-sm pl-2">
                      {pilDraft.respondents.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                    <span className="text-xs italic text-slate-600 block text-right">... प्रतिवादी / Respondents</span>
                  </div>
                </div>

                {/* Article & Subject */}
                <div className="p-3 bg-slate-100 rounded-xl font-sans text-xs font-bold text-slate-800">
                  विषय (Subject): भारत के संविधान के अनुच्छेद 226 के अंतर्गत परमादेश (Writ of Mandamus) जारी कर {complaint.wardNumber}, ग्राम पंचायत {complaint.gramPanchayat}, प्रखंड: {complaint.blockOrTehsil}, जिला: {complaint.district} में पिछले {complaint.yearsPending} वर्षों से लंबित सड़क का तत्काल निर्माण कराने एवं मुखिया व संवेदक द्वारा फंड दुरुपयोग की जांच बाबत।
                </div>

                {/* Facts and Grounds */}
                <div>
                  <h4 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-700 mb-2">
                    तथ्य एवं आधार (FACTS & GROUNDS OF THE PIL):
                  </h4>
                  <div className="space-y-3 pl-2">
                    {pilDraft.factsAndGrounds.map((fact, i) => (
                      <p key={i} className="text-justify text-slate-800">
                        <strong>({i + 1})</strong> {fact}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Legal Citations */}
                <div>
                  <h4 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-700 mb-2">
                    विधिक नज़ीरें (LEGAL PRECEDENTS):
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs font-mono text-slate-700">
                    {pilDraft.legalPrecedents.map((precedent, i) => (
                      <li key={i}>{precedent}</li>
                    ))}
                  </ul>
                </div>

                {/* Prayers */}
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold font-sans text-xs uppercase tracking-wider text-amber-900 mb-2">
                    प्रार्थना (PRAYERS / RELIEFS SOUGHT):
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                    {pilDraft.prayers.map((prayer, i) => (
                      <p key={i} className="text-justify">
                        <strong>({String.fromCharCode(97 + i)})</strong> {prayer}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Signature Block */}
                <div className="pt-6 border-t flex items-center justify-between text-xs font-sans">
                  <div>
                    <p className="font-bold text-slate-900">स्थान: {complaint.district}</p>
                    <p className="text-slate-500">तारीख: {new Date().toLocaleDateString('hi-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">अधिवक्ता / काउंसिल फॉर पेटीशनर</p>
                    <p className="text-slate-500 font-mono">{complaint.highCourtCaseDetails?.advocateName || 'जन सड़क विधिक प्रकोष्ठ (Jan Sadak Legal Cell)'}</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: DM & BDO 15-DAY LEGAL NOTICE */}
          {activeTab === 'DM_NOTICE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 flex items-start gap-3 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">धारा 80 C.P.C. पूर्व विधिक नोटिस:</strong> किसी भी सरकारी विभाग अथवा अधिकारी के विरुद्ध हाई कोर्ट जाने से पूर्व 15 से 60 दिनों का कानूनी मांग पत्र देना विधिक रूप से आवश्यक होता है। यह नोटिस जिलाधिकारी (DM), प्रखंड विकास पदाधिकारी (BDO परसा) और मुखिया जी को रजिस्टर्ड डाक अथवा ईमेल द्वारा प्रेषित किया जाता है।
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-6 shadow-sm font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed border-slate-300">
                {dmNoticeText}
              </div>
            </div>
          )}

          {/* TAB 3: RTI APPLICATION */}
          {activeTab === 'RTI_APPLICATION' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-3 text-xs sm:text-sm">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">सूचना का अधिकार अधिनियम, 2005 (धारा 6(1)):</strong> यदि सड़क कागजों पर बन गई है और धरातल पर नहीं है, तो यह RTI आवेदन लोक सूचना अधिकारी / BDO / PWD को देकर 30 दिनों में फंड आवंटन, एमबी बुक, और मुखिया जी के प्रस्ताव की प्रमाणित प्रति हासिल की जा सकती है।
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-6 shadow-sm font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed border-slate-300">
                {rtiText}
              </div>
            </div>
          )}

          {/* TAB 4: CASE TRACKER & ADVOCATE ESCALATION */}
          {activeTab === 'CASE_TRACKER' && (
            <div className="space-y-6">
              
              {/* Current Status Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">हाई कोर्ट केस नंबर</span>
                  <span className="text-sm font-bold text-purple-900 font-mono">
                    {complaint.highCourtCaseDetails?.caseNumber || 'ड्राफ्ट PIL अवस्था में'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">अदालत</span>
                  <span className="text-sm font-bold text-slate-900">
                    {courtName}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">अग्रिम सुनवाई तिथि</span>
                  <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {complaint.highCourtCaseDetails?.nextDate || 'जल्द निर्धारित होगी'}
                  </span>
                </div>
              </div>

              {/* Status Stepper Tracker */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  कानूनी कार्यवाही टाइमलाइन (Legal Action Timeline)
                </h4>
                
                <div className="space-y-4">
                  {complaint.statusHistory.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                          <span>{step.status}</span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {new Date(step.updatedAt).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{step.note}</p>
                        {step.authorityContacted && (
                          <span className="inline-block mt-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                            प्राधिकारी: {step.authorityContacted}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advocate Escalate & Case Update Form */}
              <div className="bg-gradient-to-tr from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Gavel className="w-5 h-5 text-amber-400" />
                      हाई कोर्ट केस विवरण अद्यतन करें (Advocate Action Panel)
                    </h4>
                    <p className="text-xs text-slate-300">
                      यहां से आप शिकायत को सीधे हाई कोर्ट जनहित याचिका (PIL) में तब्दील कर सकते हैं
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg">
                    अधिवक्ता पैनल
                  </span>
                </div>

                <form onSubmit={handleSaveCourtEscalation} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        हाई कोर्ट याचिका संख्या (CWJC / PIL Number)
                      </label>
                      <input
                        type="text"
                        value={advocateCaseNumber}
                        onChange={(e) => setAdvocateCaseNumber(e.target.value)}
                        placeholder="उदा. CWJC (PIL) No. 4921/2026"
                        className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        अधिवक्ता का नाम व बार पंजीकरण
                      </label>
                      <input
                        type="text"
                        value={advocateName}
                        onChange={(e) => setAdvocateName(e.target.value)}
                        placeholder="उदा. अधिवक्ता आशुतोष वर्मा (BR/7841/2014)"
                        className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        नयी स्थिति (Update Status)
                      </label>
                      <select
                        value={selectedTargetStatus}
                        onChange={(e) => setSelectedTargetStatus(e.target.value as ComplaintStatus)}
                        className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="DM_NOTICE_SENT">15-दिवसीय DM नोटिस प्रेषित</option>
                        <option value="HIGH_COURT_PIL_FILED">हाई कोर्ट में PIL याचिका पंजीकृत (Filed)</option>
                        <option value="WORK_SANCTIONED">सड़क निर्माण स्वीकृत व टेंडर जारी (Success)</option>
                        <option value="COMPLETED">सड़क निर्माण पूर्ण व सत्यापित</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        अगली सुनवाई तारीख (Next Hearing Date)
                      </label>
                      <input
                        type="text"
                        value={advocateNextDate}
                        onChange={(e) => setAdvocateNextDate(e.target.value)}
                        placeholder="उदा. 24-Oct-2026"
                        className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      अदालत की वर्तमान टिप्पणी / आदेश सार (Hearing Order Summary)
                    </label>
                    <input
                      type="text"
                      value={advocateHearingStatus}
                      onChange={(e) => setAdvocateHearingStatus(e.target.value)}
                      placeholder="उदा. मुख्य न्यायाधीश की खंडपीठ ने डीएम सारण व बीडीओ परसा से 3 सप्ताह में विस्तृत हलफनामा मांगा।"
                      className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>हाई कोर्ट स्टेटस अद्यतन करें</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? 'कॉपी हो गया!' : 'ड्राफ्ट कॉपी करें'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>प्रिंट / PDF सेव करें</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppSendNotice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>DM, BDO व मुखिया को WhatsApp करें</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-colors"
            >
              बंद करें
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
